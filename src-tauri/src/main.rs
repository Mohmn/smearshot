// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayEvent};
use tauri::Manager;
mod watcher;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn show_window(window: tauri::Window) {
  window.show().unwrap();
}

#[tauri::command]
fn hide_window(window: tauri::Window) {
  window.hide().unwrap();
}

// #[tauri::command]
// fn watch(window: tauri::Window, path: String) {
//   std::thread::spawn(move || {
//     match watcher::watch(path) {
//       Ok(_) => (),
//       Err(e) => {
//         window.emit("fs-watch-error", Some(e.to_string())).expect("Failed to emit error");
//       },
//     }
//   });
// }

fn main() {
    let select_folder_item = CustomMenuItem::new("open_app_window".to_string(), "open smershot app");

    let tray_menu = SystemTrayMenu::new().add_item(select_folder_item);

    tauri::Builder::default()
        .system_tray(SystemTray::new().with_menu(tray_menu))
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "open_app_window" => {
                    println!("yo running!");
                    let app = app.get_window("main").unwrap();
                    app.show().unwrap();                        
                }
                _ => {}
            },
            _ => {}
        })
        .plugin(watcher::init())
        .invoke_handler(tauri::generate_handler![show_window,hide_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
