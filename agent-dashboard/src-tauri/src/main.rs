#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod metrics;

use metrics::{Sampler, Snapshot};
use std::sync::Mutex;
use tauri::State;

struct AppState(Mutex<Sampler>);

#[tauri::command]
fn get_snapshot(state: State<'_, AppState>) -> Snapshot {
    state.0.lock().expect("sampler poisoned").snapshot()
}

fn main() {
    tauri::Builder::default()
        .manage(AppState(Mutex::new(Sampler::new())))
        .invoke_handler(tauri::generate_handler![get_snapshot])
        .run(tauri::generate_context!())
        .expect("erreur au lancement de l'application Tauri");
}
