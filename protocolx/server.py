#!/usr/bin/env python3
"""
PROTOCOL-X Local Web Server
Runs 100% locally with zero external network access.
Standard library only: requires Python 3 (no pip packages needed).
"""

import http.server
import socketserver
import webbrowser
import os
import sys

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Clean terminal logging
        sys.stdout.write(f"[PROTOCOL-X Local Server] {self.address_string()} - {format % args}\n")
        sys.stdout.flush()

def main():
    os.chdir(DIRECTORY)
    
    # Try preferred port or find next available port
    current_port = PORT
    httpd = None
    for attempt in range(10):
        try:
            httpd = socketserver.TCPServer(("", current_port), Handler)
            break
        except OSError:
            current_port += 1

    if not httpd:
        print("Could not bind to any local port between 8000 and 8010.")
        sys.exit(1)

    url = f"http://localhost:{current_port}"
    print("=" * 65)
    print("  [PROTOCOL-X] Local-First AI Message Organiser")
    print(f"  [PRIVACY] 100% On-Device (Zero Data Leaves Your Machine)")
    print(f"  [RUNNING] Local URL: {url}")
    print("  Press Ctrl+C to stop the server.")
    print("=" * 65)

    # Launch browser automatically
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"Could not open browser automatically: {e}")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down PROTOCOL-X server.")
        httpd.server_close()

if __name__ == "__main__":
    main()
