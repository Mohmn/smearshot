// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayEvent};
use tauri::Manager;
use tauri_plugin_autostart::MacosLauncher;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn show_window(app: tauri::AppHandle, label: String) {
	println!("show {}", label);
		let app = app.get_window("dialog").unwrap();
			app.show().unwrap();
}

#[tauri::command]
fn hide_window(window: tauri::Window) {
  window.hide().unwrap();
}

fn main() {
    let select_folder_item = CustomMenuItem::new("open_app_window".to_string(), "open smershot app");

    let tray_menu = SystemTrayMenu::new().add_item(select_folder_item);

    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, None ))
        .system_tray(SystemTray::new().with_menu(tray_menu))
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "open_app_window" => {
                    let app = app.get_window("main").unwrap();
                    app.show().unwrap();                        
                }
                _ => {}
            },
            _ => {}
        })
        .plugin(tauri_plugin_fs_watch::init())
        .invoke_handler(tauri::generate_handler![show_window,hide_window])
        .on_window_event(|event| match event.event() {
					tauri::WindowEvent::CloseRequested { api, .. } => {
						// let lb = event.window().label();
						println!("CloseRequessted");
            event.window().hide().unwrap();
            api.prevent_close();
          }
          _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
