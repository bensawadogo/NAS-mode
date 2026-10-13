//! Échantillonnage des métriques système et simulation de la flotte d'agents IA.
//! Aucun type Tauri ici : le module se compile et se teste seul.

use serde::Serialize;
use sysinfo::{Networks, System};

#[derive(Serialize, Clone, Debug)]
pub struct AgentStat {
    pub id: &'static str,
    pub label: &'static str,
    pub status: &'static str,
    pub latency_ms: f32,
    pub tokens_per_s: f32,
    pub load: f32,
}

#[derive(Serialize, Clone, Debug)]
pub struct Snapshot {
    pub ts_ms: u128,
    pub cpu: f32,
    pub mem_used_gb: f32,
    pub mem_total_gb: f32,
    pub net_rx_kbs: f32,
    pub net_tx_kbs: f32,
    pub agents: Vec<AgentStat>,
    pub runs_ok: u64,
    pub runs_err: u64,
    pub cost_usd: f32,
}

const AGENTS: [(&str, &str); 6] = [
    ("trigger", "Déclencheur"),
    ("planner", "Planificateur"),
    ("retriever", "Recherche RAG"),
    ("coder", "Agent code"),
    ("critic", "Critique"),
    ("output", "Livraison"),
];

pub struct Sampler {
    sys: System,
    nets: Networks,
    seed: u64,
    tick: u64,
    runs_ok: u64,
    runs_err: u64,
    cost: f32,
}

impl Sampler {
    pub fn new() -> Self {
        let mut sys = System::new();
        sys.refresh_cpu_usage();
        Self {
            sys,
            nets: Networks::new_with_refreshed_list(),
            seed: 0x9E37_79B9_7F4A_7C15,
            tick: 0,
            runs_ok: 1284,
            runs_err: 17,
            cost: 42.18,
        }
    }

    /// Xorshift64 : suffisant pour animer des données de démonstration.
    fn rnd(&mut self) -> f32 {
        self.seed ^= self.seed << 13;
        self.seed ^= self.seed >> 7;
        self.seed ^= self.seed << 17;
        (self.seed >> 11) as f32 / (1u64 << 53) as f32
    }

    pub fn snapshot(&mut self) -> Snapshot {
        self.sys.refresh_cpu_usage();
        self.sys.refresh_memory();
        self.nets.refresh(true);
        self.tick += 1;

        let (rx, tx) = self
            .nets
            .iter()
            .fold((0u64, 0u64), |(r, t), (_, n)| (r + n.received(), t + n.transmitted()));

        let wave = (self.tick as f32 / 6.0).sin() * 0.5 + 0.5;
        let mut agents = Vec::with_capacity(AGENTS.len());
        for (i, (id, label)) in AGENTS.iter().enumerate() {
            let load = (0.25 + 0.55 * ((self.tick as f32 / 5.0 + i as f32).sin() * 0.5 + 0.5)
                + self.rnd() * 0.15)
                .min(1.0);
            let latency = 120.0 + load * 900.0 + self.rnd() * 60.0 + i as f32 * 40.0;
            let status = if load > 0.88 { "busy" } else if load < 0.18 { "idle" } else { "active" };
            agents.push(AgentStat {
                id,
                label,
                status,
                latency_ms: latency,
                tokens_per_s: 40.0 + load * 160.0 * (0.6 + wave * 0.4),
                load,
            });
        }

        let new_runs = (self.rnd() * 4.0) as u64;
        self.runs_ok += new_runs;
        if self.rnd() > 0.93 {
            self.runs_err += 1;
        }
        self.cost += new_runs as f32 * 0.0137;

        Snapshot {
            ts_ms: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .map(|d| d.as_millis())
                .unwrap_or(0),
            cpu: self.sys.global_cpu_usage(),
            mem_used_gb: self.sys.used_memory() as f32 / 1.0737e9,
            mem_total_gb: self.sys.total_memory() as f32 / 1.0737e9,
            net_rx_kbs: rx as f32 / 1024.0,
            net_tx_kbs: tx as f32 / 1024.0,
            agents,
            runs_ok: self.runs_ok,
            runs_err: self.runs_err,
            cost_usd: self.cost,
        }
    }
}
