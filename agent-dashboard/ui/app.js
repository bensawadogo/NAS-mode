"use strict";
const ICE = "#7df3ff", PLASMA = "#ff2fd0", VIOLET = "#8a5cff", MUTE = "#6f86b0";
const N = 60;
const $ = (s) => document.querySelector(s);
const hist = { cpu: [], mem: [], ok: [], cost: [], net_rx: [], net_tx: [], lat: {}, tok: {} };
let last = null;

/* ---------- source de données : Rust (Tauri) ou simulation JS ---------- */
const tauri = window.__TAURI__ && window.__TAURI__.core;
const AGENTS = [["trigger","Déclencheur"],["planner","Planificateur"],["retriever","Recherche RAG"],["coder","Agent code"],["critic","Critique"],["output","Livraison"]];
let tick = 0, simOk = 1284, simErr = 17, simCost = 42.18;
function simulate() {
  tick++;
  const agents = AGENTS.map(([id, label], i) => {
    const load = Math.min(1, .25 + .55 * (Math.sin(tick / 5 + i) * .5 + .5) + Math.random() * .15);
    return { id, label, load, status: load > .88 ? "busy" : load < .18 ? "idle" : "active",
      latency_ms: 120 + load * 900 + Math.random() * 60 + i * 40, tokens_per_s: 40 + load * 160 };
  });
  const n = Math.floor(Math.random() * 4); simOk += n; simCost += n * .0137;
  if (Math.random() > .93) simErr++;
  return { cpu: 20 + 30 * (Math.sin(tick / 9) * .5 + .5) + Math.random() * 8, mem_used_gb: 9.4 + Math.random() * .3, mem_total_gb: 16,
    net_rx_kbs: 80 + Math.random() * 400, net_tx_kbs: 30 + Math.random() * 160, agents, runs_ok: simOk, runs_err: simErr, cost_usd: simCost };
}
async function fetchSnap() { return tauri ? tauri.invoke("get_snapshot") : simulate(); }

/* ---------- canvas helpers ---------- */
function fit(c) {
  const r = c.getBoundingClientRect(), d = devicePixelRatio || 1;
  if (c.width !== Math.round(r.width * d) || c.height !== Math.round(r.height * d)) { c.width = r.width * d; c.height = r.height * d; }
  const g = c.getContext("2d"); g.setTransform(d, 0, 0, d, 0, 0); g.clearRect(0, 0, r.width, r.height);
  return { g, w: r.width, h: r.height };
}
function line(g, pts, w, h, color, max, pad = 0, fill = true) {
  if (pts.length < 2) return;
  const X = (i) => (i / (N - 1)) * w, Y = (v) => h - pad - (v / max) * (h - pad * 2);
  const off = N - pts.length;
  g.beginPath();
  pts.forEach((v, i) => { const x = X(i + off), y = Y(v); i ? g.lineTo(x, y) : g.moveTo(x, y); });
  g.shadowColor = color; g.shadowBlur = 10; g.strokeStyle = color; g.lineWidth = 2; g.lineJoin = "round"; g.stroke(); g.shadowBlur = 0;
  if (fill) {
    g.lineTo(X(N - 1), h); g.lineTo(X(off), h); g.closePath();
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, color + "55"); gr.addColorStop(1, color + "00");
    g.fillStyle = gr; g.fill();
  }
}
function axes(g, w, h, max, unit) {
  g.strokeStyle = "rgba(125,200,255,.09)"; g.fillStyle = MUTE; g.font = "10px monospace"; g.lineWidth = 1;
  for (let i = 0; i <= 3; i++) { const y = 4 + (h - 8) * i / 3; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke();
    g.fillText(Math.round(max * (1 - i / 3)) + unit, 4, y - 3); }
}
const push = (a, v) => { a.push(v); if (a.length > N) a.shift(); };

/* ---------- rendu des graphiques ---------- */
const COLORS = [ICE, PLASMA, VIOLET, "#ffd166", "#5cffb0", "#ff7a59"];
function drawMulti(canvas, series, unit) {
  const { g, w, h } = fit(canvas); const max = Math.max(100, ...Object.values(series).flat()) * 1.1;
  axes(g, w, h, max, unit);
  Object.keys(series).forEach((k, i) => line(g, series[k], w, h, COLORS[i % COLORS.length], max, 4, i === 0));
}
function drawNet(canvas) {
  const { g, w, h } = fit(canvas); const max = Math.max(100, ...hist.net_rx, ...hist.net_tx) * 1.15;
  axes(g, w, h, max, ""); line(g, hist.net_rx, w, h, ICE, max, 4); line(g, hist.net_tx, w, h, PLASMA, max, 4);
}
function drawDonut(canvas, ok, err) {
  const { g, w, h } = fit(canvas); const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 12, tot = ok + err, a = (err / tot) * Math.PI * 2;
  g.lineWidth = 14; g.lineCap = "round";
  g.shadowColor = ICE; g.shadowBlur = 14; g.strokeStyle = ICE; g.beginPath(); g.arc(cx, cy, R, -Math.PI / 2 + a + .12, Math.PI * 1.5 - .12); g.stroke();
  g.shadowColor = PLASMA; g.strokeStyle = PLASMA; g.beginPath(); g.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.max(a, .02)); g.stroke(); g.shadowBlur = 0;
  g.fillStyle = "#fff"; g.font = "600 24px monospace"; g.textAlign = "center"; g.fillText((ok / tot * 100).toFixed(1) + "%", cx, cy + 6);
  g.fillStyle = MUTE; g.font = "10px monospace"; g.fillText("SUCCÈS", cx, cy + 24);
  $("#donutLegend").innerHTML = `<span><b>${ok}</b> ok</span><span><b style="color:${PLASMA}">${err}</b> erreurs</span>`;
}
function spark(canvas, data, color) {
  const { g, w, h } = fit(canvas); const lo = Math.min(...data), hi = Math.max(...data), span = hi - lo || 1;
  const d = data.map((v) => (v - lo) / span * .8 + .1);
  const X = (i) => (i / (N - 1)) * w, off = N - d.length;
  if (d.length < 2) return;
  g.beginPath(); d.forEach((v, i) => { const x = X(i + off), y = h - v * h; i ? g.lineTo(x, y) : g.moveTo(x, y); });
  g.strokeStyle = color; g.lineWidth = 1.6; g.shadowColor = color; g.shadowBlur = 8; g.stroke(); g.shadowBlur = 0;
  g.lineTo(w, h); g.lineTo(X(off), h); const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, color + "40"); gr.addColorStop(1, color + "00");
  g.fillStyle = gr; g.fill();
}

/* ---------- graphe de nœuds façon n8n ---------- */
const stage = $("#stage"), svg = $("#links"), nodes = {};
const EDGES = [["trigger","planner"],["planner","retriever"],["planner","coder"],["retriever","critic"],["coder","critic"],["critic","output"]];
const POS = { trigger:[.04,.42], planner:[.22,.42], retriever:[.44,.14], coder:[.44,.68], critic:[.68,.42], output:[.86,.42] };
svg.innerHTML = `<defs><linearGradient id="lg"><stop offset="0" stop-color="${ICE}"/><stop offset="1" stop-color="${PLASMA}"/></linearGradient></defs>`;
function buildNodes() {
  const r = stage.getBoundingClientRect();
  AGENTS.forEach(([id, label]) => {
    const el = document.createElement("div"); el.className = "node";
    el.innerHTML = `<span class="port in"></span><span class="port out"></span><h3><i></i>${label}</h3><p>–</p><div class="bar"><span></span></div>`;
    el.style.left = POS[id][0] * (r.width - 160) + "px"; el.style.top = POS[id][1] * (r.height - 84) + "px";
    stage.appendChild(el); nodes[id] = el; drag(el);
  });
  EDGES.forEach(([a, b]) => {
    const base = document.createElementNS("http://www.w3.org/2000/svg", "path"); base.setAttribute("class", "link");
    const fl = document.createElementNS("http://www.w3.org/2000/svg", "path"); fl.setAttribute("class", "flowdash");
    svg.append(base, fl); (nodes[a]._e ||= []).push([base, fl, a, b]); (nodes[b]._e ||= []).push([base, fl, a, b]);
  });
  layout();
}
function port(id, out) { const n = nodes[id]; return [n.offsetLeft + (out ? n.offsetWidth : 0), n.offsetTop + n.offsetHeight / 2]; }
function layout() {
  EDGES.forEach(([a, b], i) => {
    const [x1, y1] = port(a, true), [x2, y2] = port(b, false), k = Math.max(50, Math.abs(x2 - x1) * .5);
    const d = `M${x1},${y1} C${x1 + k},${y1} ${x2 - k},${y2} ${x2},${y2}`;
    const p = svg.querySelectorAll("path"); p[i * 2].setAttribute("d", d); p[i * 2 + 1].setAttribute("d", d);
  });
}
function drag(el) {
  el.addEventListener("pointerdown", (e) => {
    el.setPointerCapture(e.pointerId);
    const sx = e.clientX - el.offsetLeft, sy = e.clientY - el.offsetTop, box = stage.getBoundingClientRect();
    const mv = (m) => { el.style.left = Math.max(0, Math.min(box.width - el.offsetWidth, m.clientX - sx)) + "px";
      el.style.top = Math.max(0, Math.min(box.height - el.offsetHeight, m.clientY - sy)) + "px"; layout(); };
    const up = () => { el.removeEventListener("pointermove", mv); el.removeEventListener("pointerup", up); };
    el.addEventListener("pointermove", mv); el.addEventListener("pointerup", up);
  });
}

/* ---------- boucle principale ---------- */
const fmt = (n) => n.toLocaleString("fr-FR");
function render(s) {
  push(hist.cpu, s.cpu); push(hist.mem, s.mem_used_gb); push(hist.ok, s.runs_ok); push(hist.cost, s.cost_usd);
  push(hist.net_rx, s.net_rx_kbs); push(hist.net_tx, s.net_tx_kbs);
  s.agents.forEach((a) => { push(hist.lat[a.id] ||= [], a.latency_ms); push(hist.tok[a.id] ||= [], a.tokens_per_s);
    const el = nodes[a.id]; if (!el) return; el.className = "node " + (a.status === "active" ? "" : a.status);
    el.querySelector("p").textContent = `${Math.round(a.latency_ms)} ms · ${Math.round(a.tokens_per_s)} tok/s`;
    el.querySelector(".bar span").style.width = (a.load * 100).toFixed(0) + "%"; });
  $("#kCpu").textContent = s.cpu.toFixed(1) + " %";
  $("#kMem").textContent = `${s.mem_used_gb.toFixed(1)} / ${s.mem_total_gb.toFixed(0)} Go`;
  $("#kOk").textContent = fmt(s.runs_ok);
  $("#kCost").textContent = s.cost_usd.toFixed(2) + " $";
  const map = { cpu: ICE, mem: VIOLET, ok: ICE, cost: PLASMA };
  document.querySelectorAll("[data-spark]").forEach((c) => spark(c, hist[c.dataset.spark], map[c.dataset.spark]));
  drawMulti($("#cLat"), hist.lat, ""); drawMulti($("#cTok"), hist.tok, "");
  drawNet($("#cNet")); drawDonut($("#cDonut"), s.runs_ok, s.runs_err);
}
async function loop() {
  try { last = await fetchSnap(); render(last); } catch (e) { console.error(e); $("#modeTxt").textContent = "erreur backend"; }
  setTimeout(loop, 1000);
}
buildNodes();
const live = !!tauri;
$("#mode").classList.toggle("live", live);
$("#modeTxt").textContent = live ? "backend Rust · en direct" : "simulation navigateur";
setInterval(() => ($("#clock").textContent = new Date().toLocaleTimeString("fr-FR")), 1000);
addEventListener("resize", () => { layout(); if (last) render(last); });
loop();
