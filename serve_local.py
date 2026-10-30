#!/usr/bin/env python3
"""
serve_local.py - Local Development and Preview Server for FPL Dashboard

Provides a local HTTP server with proper MIME types and caching controls
for testing decoupled JSON assets, multi-season archives, and offline preview.

Usage:
    python3 serve_local.py [--port 8000] [--open]
"""

import http.server
import socketserver
import os
import sys
import webbrowser

PORT = 8000
for arg in sys.argv[1:]:
    if arg.isdigit():
        PORT = int(arg)
    elif arg.startswith('--port=') and arg.split('=')[1].isdigit():
        PORT = int(arg.split('=')[1])

base_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(base_dir)

class FplRequestHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.json': 'application/json; charset=utf-8',
        '.manifest': 'text/cache-manifest',
        '.webmanifest': 'application/manifest+json',
        '.ttf': 'font/ttf',
        '.woff2': 'font/woff2',
    }

    def end_headers(self):
        # Prevent aggressive local browser caching during development
        if self.path.endswith('.json') or self.path.endswith('.html'):
            self.send_header('Cache-Control', 'no-cache, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def main():
    print("\n" + "=" * 65)
    print("⚽ FPL Mini-League: Local Development & Preview Server")
    print("=" * 65)
    print(f"Server Root Directory: {base_dir}")
    print(f"Listening on:          http://localhost:{PORT}")
    print("\nQuick Links:")
    print(f"  👉 Main Dashboard:   http://localhost:{PORT}/preview.html")
    print(f"  👉 Root Entry:       http://localhost:{PORT}/")
    print(f"  👉 League 40700:     http://localhost:{PORT}/40700/")
    print(f"  👉 League 675290:    http://localhost:{PORT}/675290/")
    print("=" * 65)
    print("Press Ctrl+C to stop the server.\n")

    if '--open' in sys.argv:
        webbrowser.open(f"http://localhost:{PORT}/preview.html")

    try:
        with socketserver.TCPServer(("", PORT), FplRequestHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Local server stopped.")

if __name__ == '__main__':
    main()
