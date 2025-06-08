import tkinter as tk
from tkinter import ttk, messagebox
import requests
import json
import threading
import time
import schedule
from datetime import datetime
import os
import sys

class MotivationalApp:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Daily Motivation")
        self.root.geometry("500x400")
        self.root.configure(bg='#f0f0f0')
        
        self.backend_url = "https://motivational-calendar.vercel.app/"  
        self.user_name = "Friend"
        self.client_id = f"desktop_client_{int(time.time())}"
        
        self.setup_ui()
        self.register_client()
        self.fetch_daily_content()
        self.schedule_updates()
        
    def setup_ui(self):
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        title_label = ttk.Label(main_frame, text="🌟 Daily Motivation 🌟", 
                               font=('Arial', 18, 'bold'))
        title_label.grid(row=0, column=0, columnspan=2, pady=(0, 20))
        
        quote_frame = ttk.LabelFrame(main_frame, text="Quote of the Day", padding="15")
        quote_frame.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(0, 15))
        
        self.quote_text = tk.Text(quote_frame, height=4, width=50, wrap=tk.WORD,
                                 font=('Arial', 11), bg='#ffffff', relief='flat')
        self.quote_text.grid(row=0, column=0, sticky=(tk.W, tk.E))
        
        message_frame = ttk.LabelFrame(main_frame, text="Personal Message", padding="15")
        message_frame.grid(row=2, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(0, 15))
        
        self.message_text = tk.Text(message_frame, height=3, width=50, wrap=tk.WORD,
                                   font=('Arial', 10), bg='#f8f9fa', relief='flat')
        self.message_text.grid(row=0, column=0, sticky=(tk.W, tk.E))
        
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=3, column=0, columnspan=2, pady=(15, 0))
        
        refresh_btn = ttk.Button(button_frame, text="🔄 Refresh", 
                                command=self.fetch_daily_content)
        refresh_btn.grid(row=0, column=0, padx=(0, 10))
        
        ping_btn = ttk.Button(button_frame, text="📡 Ping Backend", 
                             command=self.ping_backend)
        ping_btn.grid(row=0, column=1, padx=(0, 10))
        
        settings_btn = ttk.Button(button_frame, text="⚙️ Settings", 
                                 command=self.open_settings)
        settings_btn.grid(row=0, column=2)
        
        self.status_var = tk.StringVar()
        self.status_var.set("Ready")
        status_bar = ttk.Label(main_frame, textvariable=self.status_var, 
                              font=('Arial', 8), foreground='#666')
        status_bar.grid(row=4, column=0, columnspan=2, pady=(15, 0))
        
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(0, weight=1)
        
    def register_client(self):
        """Register this client with the backend"""
        try:
            response = requests.post(f"{self.backend_url}/api/ping", 
                                   json={
                                       "clientId": self.client_id,
                                       "action": "register"
                                   }, timeout=5)
            if response.status_code == 200:
                self.status_var.set("Connected to backend")
            else:
                self.status_var.set("Failed to register with backend")
        except requests.exceptions.RequestException:
            self.status_var.set("Backend not available")
    
    def fetch_daily_content(self):
        """Fetch daily quote and personalized message"""
        def fetch_in_thread():
            try:
                current_hour = datetime.now().hour
                if current_hour < 12:
                    time_of_day = "morning"
                elif current_hour < 17:
                    time_of_day = "afternoon"
                else:
                    time_of_day = "evening"
                
                quote_response = requests.get(f"{self.backend_url}/api/quotes/daily", timeout=5)
                
                message_response = requests.get(
                    f"{self.backend_url}/api/messages/personalized?name={self.user_name}&time={time_of_day}", 
                    timeout=5
                )
                
                if quote_response.status_code == 200 and message_response.status_code == 200:
                    quote_data = quote_response.json()
                    message_data = message_response.json()
                    
                    self.root.after(0, self.update_content, quote_data, message_data)
                else:
                    self.root.after(0, lambda: self.status_var.set("Failed to fetch content"))
                    
            except requests.exceptions.RequestException as e:
                self.root.after(0, lambda: self.status_var.set(f"Connection error: {str(e)}"))
        
        threading.Thread(target=fetch_in_thread, daemon=True).start()
        self.status_var.set("Fetching content...")
    
    def update_content(self, quote_data, message_data):
        """Update the UI with fetched content"""
        self.quote_text.delete(1.0, tk.END)
        self.quote_text.insert(1.0, quote_data['quote'])
        self.quote_text.config(state='disabled')
        
        self.message_text.delete(1.0, tk.END)
        full_message = f"{message_data['greeting']}\n\n{message_data['message']}\n\n{message_data['timeBasedMessage']}"
        self.message_text.insert(1.0, full_message)
        self.message_text.config(state='disabled')
        
        self.status_var.set(f"Updated at {datetime.now().strftime('%H:%M:%S')}")
    
    def ping_backend(self):
        """Send a ping to the backend"""
        def ping_in_thread():
            try:
                response = requests.post(f"{self.backend_url}/api/ping", 
                                       json={
                                           "clientId": self.client_id,
                                           "action": "ping"
                                       }, timeout=5)
                if response.status_code == 200:
                    data = response.json()
                    self.root.after(0, lambda: messagebox.showinfo("Backend Response", data['message']))
                    self.root.after(0, lambda: self.status_var.set("Ping successful"))
                else:
                    self.root.after(0, lambda: self.status_var.set("Ping failed"))
            except requests.exceptions.RequestException:
                self.root.after(0, lambda: self.status_var.set("Ping failed - backend not available"))
        
        threading.Thread(target=ping_in_thread, daemon=True).start()
    
    def open_settings(self):
        """Open settings dialog"""
        settings_window = tk.Toplevel(self.root)
        settings_window.title("Settings")
        settings_window.geometry("300x200")
        settings_window.configure(bg='#f0f0f0')
        
        ttk.Label(settings_window, text="Your Name:").pack(pady=10)
        name_entry = ttk.Entry(settings_window, width=30)
        name_entry.insert(0, self.user_name)
        name_entry.pack(pady=5)
        
        ttk.Label(settings_window, text="Backend URL:").pack(pady=(20, 5))
        url_entry = ttk.Entry(settings_window, width=30)
        url_entry.insert(0, self.backend_url)
        url_entry.pack(pady=5)
        
        def save_settings():
            self.user_name = name_entry.get()
            self.backend_url = url_entry.get()
            settings_window.destroy()
            self.fetch_daily_content()
        
        ttk.Button(settings_window, text="Save", command=save_settings).pack(pady=20)
    
    def schedule_updates(self):
        """Schedule automatic updates"""
        schedule.every().hour.do(self.fetch_daily_content)
        
        def run_scheduler():
            while True:
                schedule.run_pending()
                time.sleep(60)  
        
        threading.Thread(target=run_scheduler, daemon=True).start()
    
    def run(self):
        """Start the application"""
        self.root.mainloop()

def add_to_startup():
    """Add the application to system startup (Windows)"""
    if sys.platform == "win32":
        import winreg
        key = winreg.HKEY_CURRENT_USER
        key_value = "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run"
        
        try:
            open_key = winreg.OpenKey(key, key_value, 0, winreg.KEY_ALL_ACCESS)
            winreg.SetValueEx(open_key, "MotivationalApp", 0, winreg.REG_SZ, 
                             f'"{sys.executable}" "{os.path.abspath(__file__)}"')
            winreg.CloseKey(open_key)
            print("Added to startup successfully!")
        except Exception as e:
            print(f"Failed to add to startup: {e}")

if __name__ == "__main__":
    add_to_startup()
    
    app = MotivationalApp()
    app.run()