#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate standalone preview.html, index.html, 404.html, 40700/index.html, 675290/index.html, and 38491/index.html
Supporting clean short user URLs:
- https://asawamanasak.github.io/fpl-mini/40700
- https://asawamanasak.github.io/fpl-mini/675290
- https://asawamanasak.github.io/fpl-mini/38491

Build Version: 2026.08.31.01
"""

import json
import os

def generate_html(multi_data, leagues_config, default_league_id=None):
    # Performance Optimization: Deep-strip raw_picks and raw_hist before serializing into HTML
    pruned_data = {
        "last_sync": multi_data.get("last_sync"),
        "last_sync_iso": multi_data.get("last_sync_iso"),
        "sync_status": multi_data.get("sync_status"),
        "max_gw": multi_data.get("max_gw"),
        "leagues": {}
    }
    for lid, l_obj in multi_data.get("leagues", {}).items():
        pruned_squads = {}
        for s_key, s_data in l_obj.get("squads", {}).items():
            if isinstance(s_data, dict):
                pruned_sq = {k: v for k, v in s_data.items() if k not in ("raw_picks", "raw_hist")}
                pruned_squads[s_key] = pruned_sq
            else:
                pruned_squads[s_key] = s_data
        pruned_data["leagues"][lid] = {
            "id": l_obj.get("id"),
            "name": l_obj.get("name"),
            "season": l_obj.get("season"),
            "teams": l_obj.get("teams", []),
            "gameweeks": l_obj.get("gameweeks", {}),
            "squads": pruned_squads
        }
    multi_data_json_str = json.dumps(pruned_data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    leagues_config_json_str = json.dumps(leagues_config, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    default_lid_code = f'"{default_league_id}"' if default_league_id else 'null'
    asset_prefix = "../" if default_league_id else "./"
    last_sync_str = str(multi_data.get("last_sync") or "31 ส.ค. 2026, 22:30 น.")

    html_template = """<!DOCTYPE html>
<html lang="th" class="h-full bg-slate-50 dark:bg-slate-950 transition-colors duration-150">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>FPL Dashboard - มินิลีกแฟนตาซี</title>
  <meta name="description" content="เกาะติดคะแนนสด ตารางคะแนน ไฮไลท์ประจำสัปดาห์ และสรุปเงินรางวัล FPL มินิลีก">
  <meta name="theme-color" content="#0f172a">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="FPL Dashboard">

  <!-- Favicons & App Shortcut Icons (Chrome / Safari / iOS / Android) -->
  <link rel="icon" type="image/x-icon" href="__ASSET_PREFIX__favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="__ASSET_PREFIX__images/icons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="__ASSET_PREFIX__images/icons/favicon-16x16.png">
  <link rel="icon" type="image/png" sizes="192x192" href="__ASSET_PREFIX__images/icons/favicon-192x192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="__ASSET_PREFIX__images/icons/favicon-512x512.png">
  <link rel="apple-touch-icon" sizes="180x180" href="__ASSET_PREFIX__images/icons/apple-touch-icon.png">
  <link rel="manifest" href="__ASSET_PREFIX__site.webmanifest">

  <!-- Open Graph / Social Media Share Thumbnail -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="FPL Dashboard - มินิลีกแฟนตาซี">
  <meta property="og:description" content="เกาะติดคะแนนสด ตารางคะแนน ไฮไลท์ประจำสัปดาห์ และสรุปเงินรางวัล FPL มินิลีก">
  <meta property="og:image" content="https://asawamanasak.github.io/fpl-mini/images/icons/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="FPL Dashboard - มินิลีกแฟนตาซี">
  <meta name="twitter:description" content="เกาะติดคะแนนสด ตารางคะแนน ไฮไลท์ประจำสัปดาห์ และสรุปเงินรางวัล FPL มินิลีก">
  <meta name="twitter:image" content="https://asawamanasak.github.io/fpl-mini/images/icons/og-image.png">
  
  <script>
    (function() {
      try {
        var params = new URLSearchParams(window.location.search);
        var urlTheme = params.get('theme');
        var savedTheme = localStorage.getItem('fpl_theme');
        var systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var shouldBeDark = (urlTheme === 'dark') || (!urlTheme && (savedTheme === 'dark' || (!savedTheme && systemDark)));
        if (urlTheme === 'light') shouldBeDark = false;

        if (shouldBeDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {}
    })();

    window.toggleThemeFallback = function() {
      var isDark = document.documentElement.classList.toggle('dark');
      try {
        localStorage.setItem('fpl_theme', isDark ? 'dark' : 'light');
      } catch (e) {}
      if (window.app && window.app.updateThemeIcons) {
        window.app.updateThemeIcons(isDark);
      }
    };
  </script>

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <style type="text/tailwindcss">
    @variant dark (&:where(.dark, .dark *));
  </style>

  <!-- SheetJS (xlsx) for Export Excel -->
  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>

  <!-- Google Fonts: Sarabun -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&display=swap" rel="stylesheet">

  <style>
    /* Sarabun Font-Face Declarations */
    @font-face {
      font-family: 'Sarabun';
      src: local('Sarabun'),
           local('Sarabun Regular'),
           url('./fonts/Sarabun-Regular.ttf') format('truetype'),
           url('../fonts/Sarabun-Regular.ttf') format('truetype'),
           url('https://fonts.gstatic.com/s/sarabun/v17/DtVjJx26TKEr37c9WBI.ttf') format('truetype');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'Sarabun';
      src: local('Sarabun Medium'),
           url('./fonts/Sarabun-Medium.ttf') format('truetype'),
           url('../fonts/Sarabun-Medium.ttf') format('truetype'),
           url('https://fonts.gstatic.com/s/sarabun/v17/DtVmJx26TKEr37c9YOZqulw.ttf') format('truetype');
      font-weight: 500;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'Sarabun';
      src: local('Sarabun SemiBold'),
           url('./fonts/Sarabun-SemiBold.ttf') format('truetype'),
           url('../fonts/Sarabun-SemiBold.ttf') format('truetype'),
           url('https://fonts.gstatic.com/s/sarabun/v17/DtVmJx26TKEr37c9YMptulw.ttf') format('truetype');
      font-weight: 600;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'Sarabun';
      src: local('Sarabun Bold'),
           url('./fonts/Sarabun-Bold.ttf') format('truetype'),
           url('../fonts/Sarabun-Bold.ttf') format('truetype'),
           url('https://fonts.gstatic.com/s/sarabun/v17/DtVmJx26TKEr37c9YK5sulw.ttf') format('truetype');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }

    /* Sukhumvit Set Font-Face Declarations (Fallback) */
    @font-face {
      font-family: 'Sukhumvit Set';
      src: local('Sukhumvit Set'),
           local('SukhumvitSet-Text'),
           url('./fonts/SukhumvitSet-Text.ttf') format('truetype'),
           url('../fonts/SukhumvitSet-Text.ttf') format('truetype'),
           url('https://raw.githubusercontent.com/bluenex/baansuan_prannok/master/fonts/sukhumvit-set/SukhumvitSet-Text.ttf') format('truetype');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'Sukhumvit Set';
      src: local('Sukhumvit Set Medium'),
           local('SukhumvitSet-Medium'),
           url('./fonts/SukhumvitSet-Medium.ttf') format('truetype'),
           url('../fonts/SukhumvitSet-Medium.ttf') format('truetype'),
           url('https://raw.githubusercontent.com/bluenex/baansuan_prannok/master/fonts/sukhumvit-set/SukhumvitSet-Medium.ttf') format('truetype');
      font-weight: 500;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'Sukhumvit Set';
      src: local('Sukhumvit Set SemiBold'),
           local('SukhumvitSet-SemiBold'),
           url('./fonts/SukhumvitSet-SemiBold.ttf') format('truetype'),
           url('../fonts/SukhumvitSet-SemiBold.ttf') format('truetype'),
           url('https://raw.githubusercontent.com/bluenex/baansuan_prannok/master/fonts/sukhumvit-set/SukhumvitSet-SemiBold.ttf') format('truetype');
      font-weight: 600;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'Sukhumvit Set';
      src: local('Sukhumvit Set Bold'),
           local('SukhumvitSet-Bold'),
           url('./fonts/SukhumvitSet-Bold.ttf') format('truetype'),
           url('../fonts/SukhumvitSet-Bold.ttf') format('truetype'),
           url('https://raw.githubusercontent.com/bluenex/baansuan_prannok/master/fonts/sukhumvit-set/SukhumvitSet-Bold.ttf') format('truetype');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }

    :root {
      --font-family: 'Sarabun', 'Sukhumvit Set', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    * {
      font-family: var(--font-family) !important;
    }

    body {
      font-family: var(--font-family) !important;
      background-color: #f8fafc;
      color: #0f172a;
      letter-spacing: -0.01em;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .font-display {
      font-family: var(--font-family) !important;
    }

    .glass-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03);
    }

    /* Spotlight Cards (Weekly Winner, Live Leader, Pre-Match) */
    .winner-spotlight-card {
      background-color: #fffdf7;
      background-image: radial-gradient(circle at 0% 0%, rgba(254, 243, 199, 0.85) 0%, rgba(255, 251, 235, 0.45) 55%, #ffffff 100%);
      border: 1.5px solid #fcd34d;
      border-left: 5px solid #f59e0b;
      box-shadow: 0 4px 20px -2px rgba(245, 158, 11, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.04);
      position: relative;
    }

    .live-leader-spotlight-card {
      background-color: #f7fee7;
      background-image: radial-gradient(circle at 0% 0%, rgba(220, 252, 231, 0.85) 0%, rgba(240, 253, 244, 0.45) 55%, #ffffff 100%);
      border: 1.5px solid #86efac;
      border-left: 5px solid #10b981;
      box-shadow: 0 4px 20px -2px rgba(16, 185, 129, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.04);
      position: relative;
    }

    .prematch-spotlight-card {
      background-color: #f8fafc;
      background-image: radial-gradient(circle at 0% 0%, rgba(238, 242, 255, 0.85) 0%, rgba(245, 243, 255, 0.45) 55%, #ffffff 100%);
      border: 1.5px solid #c7d2fe;
      border-left: 5px solid #6366f1;
      box-shadow: 0 4px 20px -2px rgba(99, 102, 241, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.04);
      position: relative;
    }

    /* Scrollbars */
    .scrollbar-thin::-webkit-scrollbar {
      height: 5px;
      width: 5px;
    }
    .scrollbar-thin::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 9999px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 9999px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .touch-scroll {
      -webkit-overflow-scrolling: touch;
      overscroll-behavior-x: contain;
      scroll-snap-type: x mandatory;
    }

    /* Authentic Football Pitch System (4-Tier Vertical Formation) */
    .fpl-pitch {
      background: linear-gradient(180deg, #15803d 0%, #166534 50%, #14532d 100%);
      position: relative;
      border-radius: 1.25rem;
      border: 2px solid rgba(255, 255, 255, 0.4);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 420px;
      padding: 0.75rem 0.25rem;
      box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.4);
    }

    @media (min-width: 640px) {
      .fpl-pitch {
        min-height: 480px;
        padding: 1.25rem 0.5rem;
      }
    }

    .pitch-center-line {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1.5px;
      background: rgba(255, 255, 255, 0.35);
      pointer-events: none;
      z-index: 1;
    }

    .pitch-center-circle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 70px;
      height: 70px;
      border-radius: 50%;
      border: 1.5px solid rgba(255, 255, 255, 0.35);
      pointer-events: none;
      z-index: 1;
    }

    .pitch-penalty-top {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 140px;
      height: 45px;
      border: 1.5px solid rgba(255, 255, 255, 0.3);
      border-top: 0;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
      pointer-events: none;
      z-index: 1;
    }

    .pitch-penalty-bottom {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 140px;
      height: 45px;
      border: 1.5px solid rgba(255, 255, 255, 0.3);
      border-bottom: 0;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      pointer-events: none;
      z-index: 1;
    }

    .fpl-pitch-row {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      width: 100%;
      position: relative;
      z-index: 10;
      padding: 0.15rem 0;
    }

    /* Chip Badges */
    .chip-badge {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: 0.35rem;
      display: inline-flex;
      align-items: center;
      letter-spacing: 0.02em;
    }
    .badge-3xc, .badge-triple_captain { background: #fdf2f8; color: #be185d; border: 1px solid #fbcfe8; }
    .badge-bboost, .badge-bench_boost { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
    .badge-freehit { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
    .badge-wildcard { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }

    /* ==================== DARK MODE THEME ==================== */
    html.dark {
      color-scheme: dark;
    }

    .dark body {
      background-color: #0b1120 !important;
      color: #f1f5f9 !important;
    }

    .dark header {
      background-color: rgba(15, 23, 42, 0.95) !important;
      border-color: #1e293b !important;
    }

    .dark .glass-card {
      background: #1e293b !important;
      border-color: #334155 !important;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3) !important;
    }

    .dark .winner-spotlight-card {
      background-color: #1e293b !important;
      background-image: radial-gradient(circle at 0% 0%, rgba(245, 158, 11, 0.15) 0%, rgba(30, 41, 59, 0.6) 60%, #1e293b 100%) !important;
      border: 1.5px solid rgba(245, 158, 11, 0.35) !important;
      border-left: 5px solid #f59e0b !important;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4) !important;
    }

    .dark .live-leader-spotlight-card {
      background-color: #1e293b !important;
      background-image: radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.15) 0%, rgba(30, 41, 59, 0.6) 60%, #1e293b 100%) !important;
      border: 1.5px solid rgba(16, 185, 129, 0.35) !important;
      border-left: 5px solid #10b981 !important;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4) !important;
    }

    .dark .prematch-spotlight-card {
      background-color: #1e293b !important;
      background-image: radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.15) 0%, rgba(30, 41, 59, 0.6) 60%, #1e293b 100%) !important;
      border: 1.5px solid rgba(99, 102, 241, 0.35) !important;
      border-left: 5px solid #6366f1 !important;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4) !important;
    }

    .dark .border-slate-200,
    .dark .border-slate-100,
    .dark .border-slate-200\/80 {
      border-color: #334155 !important;
    }

    .dark .divide-slate-100 > :not([hidden]) ~ :not([hidden]),
    .dark .divide-slate-200 > :not([hidden]) ~ :not([hidden]) {
      border-color: #334155 !important;
    }

    .dark .bg-slate-50,
    .dark .bg-slate-50\/50,
    .dark .bg-slate-100,
    .dark .bg-slate-100\/90 {
      background-color: #0f172a !important;
    }

    .dark .bg-white {
      background-color: #1e293b !important;
    }

    .dark .text-slate-900 {
      color: #f8fafc !important;
    }

    .dark .text-slate-800 {
      color: #e2e8f0 !important;
    }

    .dark .text-slate-700 {
      color: #cbd5e1 !important;
    }

    .dark .text-slate-600 {
      color: #94a3b8 !important;
    }

    .dark .text-slate-500 {
      color: #94a3b8 !important;
    }

    .dark .hover\:bg-slate-50:hover,
    .dark .hover\:bg-slate-100:hover {
      background-color: #334155 !important;
    }

    .dark .hover\:text-slate-900:hover {
      color: #ffffff !important;
    }

    .dark .hover\:text-blue-700:hover {
      color: #60a5fa !important;
    }

    .dark .text-blue-900 {
      color: #93c5fd !important;
    }

    .dark .bg-blue-50\/20 {
      background-color: rgba(30, 58, 138, 0.25) !important;
    }

    .dark .hover\:bg-blue-50\/40:hover {
      background-color: rgba(30, 58, 138, 0.45) !important;
    }

    .dark .scrollbar-thin::-webkit-scrollbar-track {
      background: #0f172a !important;
    }

    .dark .scrollbar-thin::-webkit-scrollbar-thumb {
      background: #334155 !important;
    }

    .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
      background: #475569 !important;
    }

    /* Modals & Dropdowns in Dark Mode */
    .dark #team-modal-content,
    .dark #summary-modal-content,
    .dark #text-summary-modal > div:last-child,
    .dark #team-modal > div:last-child {
      background-color: #1e293b !important;
      border-color: #334155 !important;
      color: #f8fafc !important;
    }

    .dark #team-modal .sticky.top-0 {
      background-color: rgba(30, 41, 59, 0.95) !important;
      border-color: #334155 !important;
    }

    .dark #league-dropdown-menu {
      background-color: #1e293b !important;
      border-color: #334155 !important;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
    }

    .dark #league-dropdown-menu button:hover {
      background-color: #334155 !important;
    }

    .dark textarea#text-summary-content {
      background-color: #0f172a !important;
      color: #e2e8f0 !important;
      border-color: #334155 !important;
    }

    /* Live note / Spotlight preview in Dark Mode */
    .dark .bg-amber-50,
    .dark .bg-amber-50\/80,
    .dark .bg-amber-50\/20 {
      background-color: rgba(120, 53, 15, 0.25) !important;
      border-color: rgba(217, 119, 6, 0.4) !important;
    }
    .dark .text-amber-900,
    .dark .text-amber-800 {
      color: #fde68a !important;
    }
    .dark .text-amber-700,
    .dark .text-amber-600 {
      color: #fbbf24 !important;
    }
    .dark .bg-amber-100 {
      background-color: rgba(180, 83, 9, 0.3) !important;
      border-color: rgba(245, 158, 11, 0.45) !important;
    }
    .dark .border-amber-300 {
      border-color: rgba(245, 158, 11, 0.45) !important;
    }

    .dark .text-blue-800,
    .dark .text-blue-700 {
      color: #60a5fa !important;
    }
    .dark .bg-blue-100 {
      background-color: rgba(30, 58, 138, 0.35) !important;
      border-color: rgba(59, 130, 246, 0.45) !important;
    }
    .dark .border-blue-300 {
      border-color: rgba(59, 130, 246, 0.45) !important;
    }

    .dark .bg-emerald-50 {
      background-color: rgba(6, 78, 59, 0.3) !important;
      border-color: rgba(16, 185, 129, 0.4) !important;
    }
    .dark .text-emerald-900 {
      color: #a7f3d0 !important;
    }

    .dark .bg-indigo-50 {
      background-color: rgba(49, 46, 129, 0.3) !important;
      border-color: rgba(99, 102, 241, 0.4) !important;
    }
    .dark .text-indigo-900 {
      color: #c7d2fe !important;
    }

    /* Header League ID Badge (กล่องสีเข้มขึ้น ตัวหนังสือคมชัด) */
    .dark #header-league-id-badge {
      background-color: #0f172a !important;
      color: #93c5fd !important;
      border-color: #1e3a8a !important;
    }

    /* Live Gameweek Selector Button Pulse */
    @keyframes liveGreenPulse {
      0%, 100% {
        opacity: 1;
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      }
      50% {
        opacity: 0.75;
        box-shadow: 0 0 10px 3px rgba(16, 185, 129, 0.5);
      }
    }
    .btn-live-pulse {
      animation: liveGreenPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes tabGreenPulse {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.45);
        border-color: rgba(16, 185, 129, 0.85);
        background-color: rgba(16, 185, 129, 0.08);
      }
      50% {
        box-shadow: 0 0 14px 3px rgba(16, 185, 129, 0.65);
        border-color: rgba(5, 150, 105, 1);
        background-color: rgba(16, 185, 129, 0.22);
      }
    }
    @keyframes tabGreenPulseActive {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.55);
        filter: brightness(1);
      }
      50% {
        box-shadow: 0 0 16px 4px rgba(16, 185, 129, 0.85);
        filter: brightness(1.15);
      }
    }
    .tab-pulse-live {
      animation: tabGreenPulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
      border: 1px solid rgba(16, 185, 129, 0.8) !important;
      color: #059669 !important;
    }
    .dark .tab-pulse-live {
      color: #34d399 !important;
    }
    .tab-pulse-live-active {
      animation: tabGreenPulseActive 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
      background-color: #059669 !important;
      color: #ffffff !important;
      border: 1px solid #10b981 !important;
    }
    .dark .tab-pulse-live-active {
      background-color: #059669 !important;
      color: #ffffff !important;
      border: 1px solid #34d399 !important;
    }

    .dark .text-emerald-700 {
      color: #34d399 !important;
    }

    /* Football Pitch Player Cards in Dark Mode */
    .dark .fpl-pitch .bg-white\/90 {
      background-color: rgba(15, 23, 42, 0.92) !important;
      color: #f8fafc !important;
    }
    .dark .fpl-pitch .text-slate-900 {
      color: #f8fafc !important;
    }
    .dark .fpl-pitch .text-slate-500 {
      color: #94a3b8 !important;
    }
  </style>
</head>
<body class="h-full flex flex-col selection:bg-slate-900 selection:text-white" onclick="app && app.closeLeagueDropdownIfClickedOutside(event)">

  <!-- 1. Header (League Identity, Switcher Dropdown, Status & Tabs) -->
  <header class="border-b border-slate-200 bg-white/95 backdrop-blur-xl sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
      
      <!-- 1.1 ข้อมูลประจำลีก (Redesigned Clean, Beautiful & Balanced Header) -->
      <div class="flex items-center gap-3 min-w-0">
        <!-- Logo Image -->
        <img 
          src="__ASSET_PREFIX__images/icons/favicon-192x192.png" 
          alt="เซียนอยู่รู หมูอยู่ตึก" 
          class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-contain shadow-xs flex-shrink-0 border border-slate-200/80 hover:scale-105 transition-transform"
        >
        
        <!-- Text Container: Title & Clean Metadata -->
        <div class="min-w-0 flex flex-col justify-center">
          
          <!-- Row 1: Primary League Title with Switcher Trigger -->
          <div class="relative inline-block text-left">
            <button 
              id="league-switcher-btn" 
              onclick="app.toggleLeagueDropdown(event)" 
              class="group flex items-center gap-1.5 text-left cursor-pointer transition-colors leading-tight"
              title="คลิกเพื่อสลับดูมินิลีกอื่น (Switch League)"
            >
              <span id="header-league-name" class="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight truncate max-w-[170px] sm:max-w-[320px]">กำลังโหลดลีก...</span>
              <span class="inline-flex items-center justify-center w-5 h-5 rounded-lg bg-blue-50 group-hover:bg-blue-100 text-blue-600 transition-colors flex-shrink-0 shadow-2xs">
                <svg class="w-3 h-3 group-hover:translate-y-0.5 transition-transform" id="league-switcher-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
              </span>
            </button>

            <!-- Dropdown Menu Box -->
            <div id="league-dropdown-menu" class="hidden absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in duration-100" onclick="event.stopPropagation()">
              <div class="px-3.5 py-1.5 text-[10px] uppercase font-bold text-blue-600 font-display border-b border-slate-100 flex items-center justify-between">
                <span>เลือกลีก (Select League)</span>
                <span class="text-[9px] text-slate-400 font-normal">คลิกเพื่อสลับ</span>
              </div>
              <div id="league-dropdown-options" class="p-1 space-y-0.5">
                <!-- Dynamic options for 40700 and 675290 -->
              </div>
            </div>
          </div>

          <!-- Row 2: Symmetrical, Balanced & Easy-to-Read Metadata Line -->
          <div class="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 font-medium mt-1 flex-wrap">
            <span id="header-league-id-badge" class="font-bold text-blue-900 bg-blue-100/70 border border-blue-200/80 px-1.5 py-0.5 rounded-md font-display leading-none">LEAGUE 40700</span>
            <span class="text-slate-300">•</span>
            <span id="header-member-count" class="font-bold text-slate-700">12 ทีมสมาชิก</span>
            <span class="text-slate-300">•</span>
            <span id="header-season">ฤดูกาล 2026/27</span>
            <span class="text-slate-300 hidden sm:inline">•</span>
            
            <!-- Last Sync Badge with Connection Indicator -->
            <span id="header-last-sync-badge" class="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-medium text-slate-700 bg-slate-100/90 border border-slate-200/80 px-2 sm:px-2.5 py-0.5 rounded-full font-display shadow-2xs" title="ระบบเชื่อมต่อ Auto-Sync ปกติ (Online)">
              <span>Last Sync: <strong id="header-last-sync" class="text-slate-900 font-bold">__LAST_SYNC__</strong></span>
              <span id="header-last-sync-icon" class="inline-flex items-center" title="ระบบเชื่อมต่อ Auto-Sync ปกติ (Online)">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
              </span>
            </span>
          </div>

        </div>
      </div>

      <!-- 1.2 แถบสถานะระบบ & 1.3 ปุ่ม Action หลัก (Entire box pulses in green when live) -->
      <div class="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        <div id="api-status-text" class="text-xs font-semibold text-emerald-900 hidden md:flex items-center bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-300 shadow-xs animate-pulse font-display">
          <span id="header-gw-status-dot" class="inline-block w-2 h-2 rounded-full bg-emerald-600 mr-2"></span>
          <span id="header-gw-status">Gameweek 2 กำลังแข่งขัน (Live)</span>
        </div>

        <!-- Dark Mode Toggle Button -->
        <button 
          id="btn-theme-toggle"
          onclick="window.app ? window.app.toggleTheme() : (window.toggleThemeFallback && window.toggleThemeFallback())"
          class="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-2xs active:scale-95 flex-shrink-0 cursor-pointer"
          title="สลับโหมดสว่าง / โหมดมืด (Dark Mode)"
          aria-label="Toggle Dark Mode"
        >
          <!-- Moon icon (shows in light mode) -->
          <svg id="theme-icon-moon" class="w-4 h-4 block dark:hidden text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
          <!-- Sun icon (shows in dark mode) -->
          <svg id="theme-icon-sun" class="w-4 h-4 hidden dark:block text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
        </button>

        <button 
          id="btn-export-excel"
          onclick="window.app ? window.app.exportToExcel() : (window.exportToExcelFallback ? window.exportToExcelFallback() : null)"
          class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 border border-emerald-600 text-xs font-semibold text-white transition-all shadow-sm active:scale-95 flex-shrink-0 cursor-pointer"
          title="Export ข้อมูลทั้งหมดทุก Gameweek, Leaderboard และสรุปเงินรางวัลเป็นไฟล์ Excel (.xlsx)"
        >
          <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <span class="font-bold">Export Excel</span>
        </button>
      </div>

    </div>

    <!-- 1.4 แถบเมนู 5 แท็บหลัก (เปลี่ยน "บอลถ้วย" เป็น "CUP") -->
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 border-t border-slate-200/80">
      <nav class="flex space-x-1 sm:space-x-2 overflow-x-auto touch-scroll no-scrollbar py-1.5 sm:py-2">
        <button 
          id="tab-btn-live"
          data-tab-target="gameweek-view" 
          class="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-slate-900 text-white shadow-xs dark:bg-blue-600 dark:text-white"
        >
          LIVE
        </button>
        <button 
          id="tab-btn-highlights"
          data-tab-target="highlights-view" 
          class="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Weekly Highlight
        </button>
        <button 
          id="tab-btn-prizes"
          data-tab-target="prizes-view" 
          class="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          สรุปรางวัล
        </button>
        <button 
          data-tab-target="hall-of-fame-view" 
          class="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Hall of Fame
        </button>
        <button 
          id="tab-btn-cup"
          data-tab-target="cup-view" 
          class="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          CUP
        </button>
        <button 
          data-tab-target="rules-view" 
          class="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          กติกาของลีก
        </button>
      </nav>
    </div>
  </header>

  <!-- 2. Main Content Container -->
  <main class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 w-full space-y-4 sm:space-y-6">

    <!-- ==================== TAB 1: LIVE (GAMEWEEK VIEW) ==================== -->
    <div id="gameweek-view" class="tab-content space-y-4">
      
      <!-- 2.1 แถบเลือกสัปดาห์ GW 1 - 38 -->
      <div class="glass-card rounded-2xl p-2.5 sm:p-3 border border-slate-200">
        <div class="flex items-center justify-between mb-2 px-1">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider font-display">เลือกสัปดาห์การแข่งขัน (GAMEWEEK SELECTOR)</span>
          <span id="gw-range-status" class="text-xs font-bold text-emerald-600">สัปดาห์ที่ 1 - 38</span>
        </div>
        <div id="gw-selector-container" class="flex space-x-1.5 overflow-x-auto touch-scroll no-scrollbar py-1">
          <!-- Rendered dynamically -->
        </div>
      </div>

      <!-- 2.2 การ์ดไฮไลท์ผู้นำ (Spotlight Card - รูปแบบคลีนตัดไอคอนซ้ายออก) -->
      <div id="champion-card-container">
        <!-- Rendered dynamically -->
      </div>

      <!-- 2.3 ตารางคะแนนประจำสัปดาห์ & 2.4 ตารางคะแนนรวมสะสม (Distinct Visual Theming) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        <!-- ซ้าย: ตารางคะแนนสัปดาห์ปัจจุบัน (Matchday Standings - Emerald Live Theme) -->
        <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 border-t-4 border-t-emerald-500 shadow-xs relative">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div>
              <span class="text-[10px] sm:text-xs uppercase tracking-wider text-emerald-600 font-bold font-display flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                GAMEWEEK STANDING
              </span>
              <h3 id="matchday-table-title" class="text-sm sm:text-base font-bold text-slate-900 font-display mt-0.5">ตารางคะแนน Gameweek 2</h3>
            </div>
            <span id="matchday-table-badge" class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ผลการแข่งขัน
            </span>
          </div>

          <div class="overflow-x-auto no-scrollbar -mx-4 sm:mx-0 touch-scroll">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-100 text-[11px] font-bold text-slate-400 font-display bg-slate-50/50">
                  <th class="py-2.5 px-1 sm:px-2 text-center w-7 sm:w-8">#</th>
                  <th class="py-2.5 px-1.5 sm:px-3 min-w-0">ทีม & ผู้จัดการ</th>
                  <th class="py-2.5 px-2 sm:px-3 text-center hidden sm:table-cell">กัปตัน</th>
                  <th class="py-2.5 px-1 sm:px-2 text-center text-[10px] sm:text-[11px] text-emerald-700 dark:text-emerald-400 font-bold whitespace-nowrap">คะแนนสด (GW)</th>
                  <th class="py-2.5 px-1 sm:px-2 text-center w-8 sm:w-10 text-[10px] sm:text-[11px]">แต้มลบ</th>
                  <th class="py-2.5 px-1.5 sm:px-3 text-right w-14 sm:w-16 text-[10px] sm:text-[11px] text-slate-500 font-bold">แต้มสุทธิ</th>
                </tr>
              </thead>
              <tbody id="matchday-table-body" class="divide-y divide-slate-100 text-xs sm:text-sm">
                <!-- Rendered dynamically -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- ขวา: ตารางคะแนนรวมสะสม (Overall Standings - Royal Blue Championship Theme) -->
        <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 border-t-4 border-t-blue-600 shadow-xs relative">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div>
              <span class="text-[10px] sm:text-xs uppercase tracking-wider text-blue-600 font-bold font-display flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-blue-600"></span>
                TOTAL LEADERBOARD
              </span>
              <h3 class="text-sm sm:text-base font-bold text-slate-900 font-display mt-0.5">ตารางคะแนนรวมสะสม</h3>
            </div>
            <span id="overall-gw-pill" class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-display">
              หลังจบ GW <span id="overall-gw-num">2</span>
            </span>
          </div>

          <div class="overflow-x-auto no-scrollbar -mx-4 sm:mx-0 touch-scroll">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-100 text-[11px] font-bold text-slate-400 font-display bg-slate-50/50">
                  <th class="py-2.5 px-1 sm:px-2 text-center w-7 sm:w-8">#</th>
                  <th class="py-2.5 px-1.5 sm:px-3 min-w-0">ทีม & ผู้จัดการ</th>
                  <th class="py-2.5 px-1 sm:px-3 text-center w-12 sm:w-16 text-[10px] sm:text-[11px]">GW ล่าสุด</th>
                  <th class="py-2.5 px-1.5 sm:px-3 text-right w-14 sm:w-16 text-blue-800 font-bold">แต้มรวม</th>
                </tr>
              </thead>
              <tbody id="overall-standings-body" class="divide-y divide-slate-100 text-xs sm:text-sm">
                <!-- Rendered dynamically -->
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>

    <!-- ==================== TAB: WEEKLY HIGHLIGHT ==================== -->
    <div id="highlights-view" class="tab-content hidden space-y-4">
      
      <!-- Top Overview Banner (Minimal) -->
      <div class="glass-card rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
        <div class="flex items-center gap-2.5">
          <h2 id="highlights-overview-title" class="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">Weekly Highlights <span class="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400 font-sans">(ไฮไลท์ประจำสัปดาห์)</span></h2>
        </div>
        <div class="flex items-center gap-2">
          <span id="highlights-gw-badge" class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs px-3 py-1 rounded-xl font-bold font-display"></span>
        </div>
      </div>

      <!-- 14 Awards Cards Grid -->
      <div id="highlights-cards-grid" class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <!-- Rendered dynamically -->
      </div>

    </div>

    <!-- ==================== TAB 2: สรุปรางวัล & รายเดือน (PRIZES & MONTHLY VIEW) ==================== -->
    <div id="prizes-view" class="tab-content hidden space-y-4">
      
      <!-- Top Overview Banner -->
      <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span id="prizes-overview-tag" class="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-bold font-display">PRIZE LEADERBOARD</span>
          <h2 id="prizes-overview-title" class="text-lg sm:text-xl font-bold text-slate-900 font-display mt-0.5">สรุปเงินรางวัลสะสม</h2>
          <p id="prizes-overview-subtitle" class="text-xs text-slate-500 mt-0.5">คำนวณเงินรางวัลตามกติกาของลีกอย่างโปร่งใส</p>
        </div>
        <div class="flex items-center gap-2">
          <span id="prizes-pool-badge" class="bg-slate-100 text-slate-700 border border-slate-200 text-xs px-3 py-1 rounded-xl font-bold font-display"></span>
        </div>
      </div>

      <!-- Main Dynamic Prize Container (Weekly for 40700 / Monthly & Season for 675290) -->
      <div id="prizes-main-content" class="space-y-4">
        <!-- Rendered dynamically -->
      </div>

    </div>

    <!-- ==================== TAB 3: HALL OF FAME (หอเกียรติยศ) ==================== -->
    <div id="hall-of-fame-view" class="tab-content hidden space-y-4">
      
      <!-- 4 Highlight Cards -->
      <div id="hall-of-fame-records" class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- Dynamic Records -->
      </div>

      <!-- Consistency Radar Table -->
      <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div>
            <span class="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-bold font-display">CONSISTENCY RADAR</span>
            <h3 class="text-sm sm:text-base font-bold text-slate-900 font-display">ความสม่ำเสมอของทีม</h3>
          </div>
        </div>

        <div class="overflow-x-auto no-scrollbar -mx-4 sm:mx-0 touch-scroll">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-100 text-[10px] sm:text-[11px] font-bold text-slate-400 font-display bg-slate-50/50">
                <th class="py-2.5 px-1 sm:px-2 text-center w-7 sm:w-8 whitespace-nowrap">#</th>
                <th class="py-2.5 px-1.5 sm:px-3 min-w-0 whitespace-nowrap">ทีม</th>
                <th class="py-2.5 px-1 sm:px-2 text-center whitespace-nowrap" id="hof-col-wins">
                  <span class="sm:hidden">#1 GW</span>
                  <span class="hidden sm:inline">#1 GAMEWEEK</span>
                </th>
                <th class="py-2.5 px-1 sm:px-2 text-center whitespace-nowrap">
                  <span class="sm:hidden">เฉลี่ย</span>
                  <span class="hidden sm:inline">แต้มเฉลี่ย</span>
                </th>
                <th class="py-2.5 px-1 sm:px-2 text-center whitespace-nowrap">
                  <span class="sm:hidden">สูงสุด</span>
                  <span class="hidden sm:inline">แต้มสูงสุด</span>
                </th>
                <th class="py-2.5 px-1 sm:px-2 text-center whitespace-nowrap">
                  <span class="sm:hidden">ต่ำสุด</span>
                  <span class="hidden sm:inline">แต้มต่ำสุด</span>
                </th>
                <th class="py-2.5 px-1.5 sm:px-3 text-right whitespace-nowrap">
                  <span class="sm:hidden">แต้มลบ</span>
                  <span class="hidden sm:inline">แต้มลบสะสม</span>
                </th>
              </tr>
            </thead>
            <tbody id="hall-of-fame-table-body" class="divide-y divide-slate-100 text-xs sm:text-sm">
              <!-- Rendered dynamically -->
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- ==================== TAB 4: CUP (LEAGUE CUP) ==================== -->
    <div id="cup-view" class="tab-content hidden space-y-4">
      
      <!-- Top Cup Banner -->
      <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span class="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-bold font-display">MINI-LEAGUE KNOCKOUT CUP</span>
          <h2 id="cup-title" class="text-lg sm:text-xl font-bold text-slate-900 font-display mt-0.5">การแข่งขันฟุตบอลถ้วย (CUP)</h2>
          <p id="cup-subtitle" class="text-xs text-slate-500 mt-0.5">ระบบจับคู่ Knockout อัตโนมัติจาก Official FPL</p>
        </div>
        <div class="flex items-center gap-2">
          <span id="cup-prize-badge" class="bg-slate-100 text-slate-700 border border-slate-200 text-xs px-3 py-1 rounded-xl font-bold font-display">CUP TOURNAMENT</span>
        </div>
      </div>

      <!-- Cup Structure Container -->
      <div id="cup-tournament-container" class="space-y-4">
        <!-- Rendered dynamically -->
      </div>

    </div>

    <!-- ==================== TAB 5: กติกาของลีก (RULES VIEW) ==================== -->
    <div id="rules-view" class="tab-content hidden space-y-4">
      
      <!-- Top Rules Overview Banner -->
      <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span class="text-[10px] sm:text-xs uppercase tracking-widest text-slate-500 font-bold font-display">OFFICIAL LEAGUE RULES & PRIZE MATRIX</span>
          <h2 id="rules-header-title" class="text-lg sm:2xl font-bold text-slate-900 font-display mt-0.5">กติกาแฟนตาซี</h2>
          <p id="rules-header-desc" class="text-xs text-slate-500 mt-0.5"></p>
        </div>
        <div class="flex items-center gap-2">
          <span class="bg-slate-100 text-slate-700 border border-slate-200 text-xs px-3 py-1 rounded-xl font-bold font-display">38 GAMEWEEKS</span>
          <span id="rules-header-badge" class="bg-slate-100 text-slate-700 border border-slate-200 text-xs px-3 py-1 rounded-xl font-bold font-display"></span>
        </div>
      </div>

      <!-- 3-Column Dynamic Grid for Rules -->
      <div id="rules-cards-container" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Rendered dynamically -->
      </div>

    </div>

  </main>

  <!-- 5.5 Footer & Site Visitor Counter -->
  <footer class="w-full py-6 text-center select-none">
    <div class="max-w-7xl mx-auto px-4 flex items-center justify-center">
      <span id="site-visitor-counter" class="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 font-normal tracking-wide">
        <svg class="w-3.5 h-3.5 text-slate-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
        <span id="visitor-counter-text">Visitors: ...</span>
      </span>
    </div>
  </footer>

  <!-- 6. Interactive Modal Systems -->

  <!-- 6.1 หน้าต่างดูแผนจัดตัวนักเตะ (Team Squad Modal) -->
  <div id="team-modal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs hidden transition-all duration-200" onclick="if (event.target === this) app.closeTeamModal()">
    <div class="bg-white rounded-3xl p-4 sm:p-6 max-w-xl w-full shadow-2xl border border-slate-200 max-h-[94vh] overflow-y-auto" onclick="event.stopPropagation()">
      
      <!-- Header (Sticky at top when scrolling through pitch and bench) -->
      <div class="sticky top-0 bg-white/95 backdrop-blur-md z-30 -mt-4 sm:-mt-6 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 border-b border-slate-100 mb-3 sm:mb-4 flex items-center justify-between shadow-2xs">
        <div class="min-w-0 pr-2">
          <div class="flex items-center gap-2">
            <span class="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-bold font-display">ข้อมูลขุมกำลัง & การจัดทัพ</span>
            <span id="team-modal-chip-badge" class="hidden"></span>
          </div>
          <h3 id="team-modal-title" class="text-base sm:text-xl font-bold text-slate-900 truncate mt-0.5">ชื่อทีม</h3>
          <p id="team-modal-subtitle" class="text-[11px] sm:text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
            <span id="team-modal-manager">ผู้จัดการ: -</span>
            <span>•</span>
            <span id="team-modal-formation" class="font-bold text-slate-700">แผน: -</span>
            <span>•</span>
            <span id="team-modal-pts" class="font-bold text-emerald-600">แต้มสด: - pts</span>
          </p>
        </div>
        <button onclick="app.closeTeamModal()" class="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 font-bold transition-colors cursor-pointer text-base flex-shrink-0">✕</button>
      </div>

      <!-- Authentic FPL Pitch (Vertical 4-Tier: GKP -> DEF -> MID -> FWD) -->
      <div class="fpl-pitch rounded-2xl mb-3.5 relative overflow-hidden shadow-inner flex flex-col justify-between py-2 sm:py-3 px-1">
        <div class="pitch-penalty-top"></div>
        <div class="pitch-center-circle"></div>
        <div class="pitch-center-line"></div>
        <div class="pitch-penalty-bottom"></div>

        <!-- 4 Separate Formation Rows -->
        <div id="pitch-line-gkp" class="fpl-pitch-row"></div>
        <div id="pitch-line-def" class="fpl-pitch-row"></div>
        <div id="pitch-line-mid" class="fpl-pitch-row"></div>
        <div id="pitch-line-fwd" class="fpl-pitch-row"></div>
      </div>

      <!-- Substitutes Box -->
      <div class="bg-slate-50 rounded-2xl p-3 sm:p-4 border border-slate-200/80">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-bold font-display">ตัวสำรอง (Substitutes)</span>
          <span id="team-modal-bench-total" class="text-[10px] sm:text-xs text-slate-500 font-bold font-display"></span>
        </div>
        <div id="team-bench-container" class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
          <!-- 4 Bench Player Cards -->
        </div>
      </div>

    </div>
  </div>

  <!-- 6.3 หน้าต่าง Text Summary Modal สำหรับส่ง LINE -->
  <div id="text-summary-modal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs hidden transition-all duration-200" onclick="if (event.target === this) app.closeTextSummaryModal()">
    <div class="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col justify-between" onclick="event.stopPropagation()">
      <div>
        <div class="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 id="modal-summary-title" class="text-base sm:text-lg font-bold text-slate-900 font-display">สรุปผล Gameweek</h3>
          </div>
          <button onclick="app.closeTextSummaryModal()" class="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 font-bold transition-colors cursor-pointer text-base">✕</button>
        </div>
        
        <p class="text-xs text-slate-500 mb-3">ข้อความถูกจัดรูปแบบสำหรับส่งเข้ากลุ่ม LINE เรียบร้อยแล้ว:</p>
        
        <div class="relative">
          <textarea id="text-summary-content" readonly class="w-full h-64 sm:h-72 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-[13px] font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none selection:bg-slate-900 selection:text-white leading-relaxed"></textarea>
        </div>
      </div>

      <div class="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
        <span id="modal-copy-indicator" class="text-xs text-emerald-600 font-bold flex items-center gap-1.5 opacity-0 transition-opacity duration-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          คัดลอกลงคลิปบอร์ดแล้ว!
        </span>
        <div class="flex items-center gap-2">
          <button onclick="app.closeTextSummaryModal()" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer">
            ปิด
          </button>
          <button id="btn-modal-copy" onclick="app.copyFromModal()" class="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
            <span>คัดลอกข้อความ</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Embedded Multi-League Data & Config -->
  <script>
    const MULTI_LEAGUE_DATA = __MULTI_DATA_JSON__;
    const LEAGUES_CONFIG = __LEAGUES_CONFIG_JSON__;
    const INITIAL_DEFAULT_LEAGUE = __DEFAULT_LID__;

    /**
     * Dynamic Live Commentary Engine (Borbou Style)
     */
    /**
     * Dynamic Live Commentary & Slang Engine (Borbou & Sian-Yoo-Roo Style)
     * ระบบวิเคราะห์สด 3 ตอน: ประโยคเปิดหัวตามชิป/แต้ม + เจาะลึกแท็กติก (Hits/สำรอง/กัปตัน) + ลูกเตือนกวนๆ ปิดท้าย
     */
    class LiveCommentaryEngine {
      static _refreshStep = 0;

      static generateFreshNote(gwNumber, gwData, leagueName, forceRandom = false, nonPrizeTeams = [], leagueData = null, isWeeklyPrize = true) {
        if (!gwData || !gwData.results || gwData.results.length === 0) {
          return `Gameweek นี้กำลังรอผลการแข่งขันจากสนามจริง`;
        }

        if (forceRandom) {
          LiveCommentaryEngine._refreshStep = (LiveCommentaryEngine._refreshStep + 1) % 997;
        }
        const stepOffset = forceRandom ? LiveCommentaryEngine._refreshStep : 0;

        const clean = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        const isFinished = Boolean(gwData.is_finished);
        const isStarted = gwData.is_started !== undefined ? Boolean(gwData.is_started) : (isFinished || (gwData.results && gwData.results.some(r => r.points > 0)));
        const scoreKey = (isFinished || isWeeklyPrize) ? 'net_points' : 'points';
        const sorted = [...gwData.results].map(r => ({
          ...r,
          team_name: clean(r.team_name),
          player_name: clean(r.player_name),
          captain: clean(r.captain)
        })).sort((a, b) => (b[scoreKey] - a[scoreKey]) || (b.net_points - a.net_points) || (b.points - a.points));

        const leagueSeed = String(leagueData?.id || leagueName || '40700').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
        const baseHash = Math.abs(Number(gwNumber) * 37 + leagueSeed * 13);

        // Pre-Match Preview (when GW has not kicked off yet)
        if (!isStarted) {
          const capMap = {};
          let chipCnt = 0;
          let hitCnt = 0;
          sorted.forEach(r => {
            const c = (r.captain || '-').replace(/\s*\(C\)/gi, '').trim();
            if (c && c !== '-') capMap[c] = (capMap[c] || 0) + 1;
            if (r.chip && r.chip !== '-') chipCnt++;
            if (r.hits > 0) hitCnt++;
          });
          const topCapEntry = Object.entries(capMap).sort((a, b) => b[1] - a[1])[0];
          const popCapText = topCapEntry ? `กัปตันมหาชนวีคนี้เทใจไปที่ ${topCapEntry[0]} (${topCapEntry[1]} ทีม)` : `ต่างคนต่างซุ่มวางกัปตันทีเด็ด`;
          const tacticalSubText = chipCnt > 0
            ? `แถมมีเสือซุ่มกดชิปพิเศษถึง ${chipCnt} ทีม`
            : (hitCnt > 0 ? `มีคนยอมเจ็บกดแต้มลบแก้เกม ${hitCnt} ทีม` : `ทุกทีมจัดทัพนิ่งกริ๊บไม่มีใครยอมเสียแต้มลบ`);

          const preMatchNotes = [
            `เดดไลน์ปิดเรียบร้อย! คืนนี้เตรียมเปิดฟลอร์ Gameweek ${gwNumber} ${popCapText} ${tacticalSubText} ใครจะยืนหนึ่งรอดูในสนามจริง!`,
            `ส่องขุมกำลัง Gameweek ${gwNumber} ล็อกทีมส่งชื่อเสร็จสรรพ! ${popCapText} ${tacticalSubText} บอลยังไม่เตะแต่ได้กลิ่นความเดือด ใครเลือกกัปตันถูกตัวเตรียมเฮสนั่นรู!`,
            `จัดทัพพร้อมรบ Gameweek ${gwNumber}! ${popCapText} ${tacticalSubText} รอดูกระสุนนัดแรกคิกออฟ ใครของแทร่หรือใครจะมุดรูเดี๋ยวรู้เรื่อง!`,
            `เข้าสู่โหมดรอคิกออฟ Gameweek ${gwNumber}! ส่งรายชื่อครบถ้วน ${popCapText} ${tacticalSubText} เตรียมลุ้นกันตัวโก่ง ใครจัดตัวแม่นเดี๋ยวแต้มลั่นทุ่งแน่นอน!`,
            `ระฆังเดดไลน์ GW ${gwNumber} ดังแล้วพี่น้อง! ${popCapText} ${tacticalSubText} สัปดาห์นี้ใครจะกินเต็มข้อหรือใครจะน้ำตาเช็ดหัวเข่า เดี๋ยวสนามจริงให้คำตอบ!`,
            `เปิดโผขุมกำลัง GW ${gwNumber} อย่างเป็นทางการ! ${popCapText} ${tacticalSubText} กูรูบอ.บู๋ฟันธงเลยว่าวีคนี้มีคนแหกโค้งแน่นอน เตรียมป๊อปคอร์นรอดูได้เลย!`
          ];
          const pick = (baseHash + stepOffset) % preMatchNotes.length;
          return preMatchNotes[pick];
        }

        const isNonPrize = (eid) => nonPrizeTeams && nonPrizeTeams.some(id => Number(id) === Number(eid));
        const eligibleSorted = sorted.filter(r => !isNonPrize(r.entry_id));
        const overallTop = sorted[0];
        const isTopNonPrize = isNonPrize(overallTop.entry_id) && eligibleSorted.length > 0 && overallTop[scoreKey] > eligibleSorted[0][scoreKey];

        // Primary spotlight team (prize leader if eligible teams exist, otherwise overall top)
        const top = eligibleSorted.length > 0 ? eligibleSorted[0] : overallTop;
        const second = eligibleSorted.length > 1 ? eligibleSorted[1] : sorted[1];
        const bottom = sorted[sorted.length - 1];
        const topPts = top[scoreKey];
        const secondPts = second ? second[scoreKey] : 0;
        const diff = topPts - secondPts;
        const winners = (eligibleSorted.length > 0 ? eligibleSorted : sorted).filter(r => r[scoreKey] === topPts);
        const isJoint = winners.length > 1;
        const captName = (top.captain || '-').replace(/\s*\(C\)/gi, '').trim();
        const isCentury = topPts >= 100;
        const chip = (top.chip || '').toLowerCase();
        const avgScore = Math.round(sorted.reduce((s, r) => s + r[scoreKey], 0) / sorted.length);

        // Inspect winner's squad for Hero Player (MVP) and Second Star
        let heroPlayer = null;
        let secondHero = null;
        if (leagueData && leagueData.squads) {
          const sq = leagueData.squads[`${top.entry_id}_${gwNumber}`];
          if (sq && sq.starting && sq.starting.length > 0) {
            const stSorted = [...sq.starting].sort((a, b) => (b.points || 0) - (a.points || 0));
            if (stSorted[0] && stSorted[0].points >= 10) {
              heroPlayer = { name: clean(stSorted[0].name), pts: stSorted[0].points, isCap: stSorted[0].is_captain };
            }
            if (stSorted[1] && stSorted[1].points >= 10) {
              secondHero = { name: clean(stSorted[1].name), pts: stSorted[1].points };
            }
          }
        }
        const heroPhrase = heroPlayer
          ? (secondHero
              ? `ได้คู่หู ${heroPlayer.name} (${heroPlayer.pts} pts) ผนึกกำลัง ${secondHero.name} (${secondHero.pts} pts)`
              : `ได้เดอะแบกอย่าง ${heroPlayer.name} ระเบิดฟอร์มกดคนเดียว ${heroPlayer.pts} แต้ม`)
          : `วางหมากกัปตัน ${captName} ได้อย่างเฉียบขาด`;

        // Check if winner also won the previous GW (Back-to-Back streak)
        let isBackToBack = false;
        if (leagueData && leagueData.gameweeks && Number(gwNumber) > 1) {
          const prevGwData = leagueData.gameweeks[String(Number(gwNumber) - 1)];
          if (prevGwData && prevGwData.results && prevGwData.results.length > 0) {
            const prevKey = (prevGwData.is_finished || isWeeklyPrize) ? 'net_points' : 'points';
            const prevElig = prevGwData.results.filter(r => !isNonPrize(r.entry_id)).sort((a, b) => b[prevKey] - a[prevKey]);
            if (prevElig[0] && Number(prevElig[0].entry_id) === Number(top.entry_id)) {
              isBackToBack = true;
            }
          }
        }

        // =========================================================
        // 1. LEAD PHRASE (ประโยคเปิดหัวตามสถานการณ์จริงของสัปดาห์)
        // =========================================================
        let leadOptions = [];

        if (isTopNonPrize) {
          const funPts = overallTop[scoreKey];
          leadOptions.push(
            `ท็อปสกอร์สนามจริงวีคนี้คือ "${overallTop.team_name}" ที่กดไปถึง ${funPts} แต้มในฐานะทีมร่วมสนุก ทำให้สิทธิ์แชมป์เงินรางวัลตกเป็นของ "${top.team_name}" (${topPts} pts) ที่${heroPhrase} รับทรัพย์ไปเต็มๆ!`,
            `"${overallTop.team_name}" ลงเล่นเพื่อความบันเทิงแต่ฟอร์มโหดจัด ซัดไป ${funPts} แต้ม ก่อนส่งไม้ต่อบัลลังก์รางวัลวีคนี้ให้ "${top.team_name}" (${topPts} pts) ที่${heroPhrase} คว้าชัยไปแบบหวานเจี๊ยบ!`,
            `หัวตารางคะแนนรวมเป็นของทีมร่วมสนุก "${overallTop.team_name}" (${funPts} pts) ส่วนศึกชิงเงินรางวัลประจำสัปดาห์ "${top.team_name}" (${topPts} pts) ${heroPhrase} ผงาดเข้าป้ายอันดับ 1 แบบไร้ข้อกังขา!`,
            `"${overallTop.team_name}" โชว์เหนือไร้ความกดดันกดไป ${funPts} แต้ม ขณะที่แชมป์สายชิงรางวัลวีคนี้ตกเป็นของ "${top.team_name}" (${topPts} pts) ที่เฉือน "${second ? second.team_name : ''}" ไปด้วยฟอร์มสุดสะเด่า!`,
            `ของแทร่สายเอ็นเตอร์เทน! "${overallTop.team_name}" นำโด่ง ${funPts} แต้มในโหมดร่วมสนุก เปิดทางให้ "${top.team_name}" (${topPts} pts) ที่${heroPhrase} กวาดแชมป์ประจำสัปดาห์ไปครองอย่างหล่อ!`
          );
        } else if (isBackToBack && !isJoint) {
          leadOptions.push(
            `แชมป์สองสมัยติดโว้ยพี่น้อง! "${top.team_name}" ฟอร์มโคตรร้อนแรง ป้องกันแชมป์วีคได้สำเร็จด้วยสกอร์ ${topPts} แต้ม โดย${heroPhrase} ใครจะหยุดพี่แกอยู่ตอนนี้!`,
            `ผูกขาดบัลลังก์! "${top.team_name}" กดแชมป์ Back-to-Back สองสัปดาห์ซ้อน ซัดไปอีก ${topPts} แต้ม ทิ้ง "${second ? second.team_name : 'คู่แข่ง'}" ${diff} แต้ม ประกาศศักดาเจ้าพ่อประจำลีก!`
          );
        }

        // Chip-specific leads
        if (!isTopNonPrize) {
          if (chip === 'bboost' || chip === 'bench_boost') {
            leadOptions.push(
              `"${top.team_name}" เปิดหัวก็บ้าพลัง งัดการ์ด Bench Boost ขนแต้มมาทั้ง 15 คน กวาด ${topPts} แต้ม ยึดหัวหาดแบบหล่อๆ!`,
              `ของแทร่ไม่ต้องพูดเยอะ! "${top.team_name}" สวมวิญญาณป๋า กดชิป Bench Boost ตัวจริงก็ยิง สำรองก็จ่าย ล่อไป ${topPts} แต้ม ฟันแชมป์วีคสบายแฮ!`,
              `จังหวะกางการ์ดระดับตำนาน! "${top.team_name}" เปิด Bench Boost โกยแต้มยกแผง ${topPts} คะแนน ทิ้งอันดับสอง ${diff} แต้ม ขึ้นนำแบบไร้ข้อกังขา!`
            );
          } else if (chip === '3xc' || chip === 'triple_captain') {
            leadOptions.push(
              `"${top.team_name}" ใส่ 3XC ทริปเปิ้ลกัปตัน ${captName} เต็มข้อ ล่อไป ${topPts} แต้ม คว้าแชมป์วีคแบบไม่ต้องสืบ!`,
              `อ่านเกมขาดกระจุย! "${top.team_name}" กดชิป Triple Captain ใส่ ${captName} แต้มคูณสามพุ่งทะยานแตะ ${topPts} แต้ม ยึดจ่าฝูงคนเดียวแบบเหงาๆ!`,
              `กระสุนคูณสามทำงานเต็มระบบ! "${top.team_name}" งัดการ์ด 3XC พาทีมโกย ${topPts} แต้ม ฉีกหนี "${second ? second.team_name : 'อันดับสอง'}" ไป ${diff} แต้ม!`
            );
          } else if (chip === 'freehit') {
            leadOptions.push(
              `"${top.team_name}" งัดชิป Free Hit สลับไพ่ทั้งสำรับ ${heroPhrase} กวาด ${topPts} แต้ม ทะยานขึ้นนำอย่างหล่อ!`,
              `เปิดการ์ด Free Hit แก้ทางแบบเซียน! "${top.team_name}" จัดชุดเฉพาะกิจโกย ${topPts} แต้ม สะบัดคู่แข่งกระจุยกระจาย!`
            );
          } else if (chip === 'wildcard') {
            leadOptions.push(
              `"${top.team_name}" ผ่าตัดทีมด้วย Wildcard ชุบชีวิตใหม่ ${heroPhrase} ซัดไป ${topPts} แต้ม ยึดจ่าฝูงแบบสะใจโก๋!`,
              `ยกเครื่องใหม่ไฉไลกว่าเดิม! "${top.team_name}" งัด Wildcard มาปราบเซียน กวาดไปเน้นๆ ${topPts} แต้ม ทิ้งห่าง ${diff} แต้ม!`
            );
          }

          // Score & Margin-based leads
          if (isJoint && winners.length > 1) {
            const names = winners.length === 2
              ? `"${winners[0].team_name}" กับ "${winners[1].team_name}"`
              : `"${winners[0].team_name}", "${winners[1].team_name}" และเพื่อนร่วมลีกอีก ${winners.length - 2} ทีม`;
            leadOptions.push(
              `กินกันไม่ลงโว้ย! ${names} ซัดไปคนละ ${topPts} แต้มเท่ากันเป๊ะ กอดคอคว้าแชมป์ร่วม GW ${gwNumber} แบ่งเค้กกันไปคนละครึ่งสุดแฮปปี้!`,
              `ดวลกันเดือดจนตาข่ายแทบขาด! ${names} รัวคนละ ${topPts} pts ไม่มีใครยอมใคร จับมือครองบัลลังก์ร่วมกันในสัปดาห์นี้!`,
              `บทสรุปสุดดราม่า GW ${gwNumber}! ${names} เข้าป้ายที่ ${topPts} แต้มเท่ากันทุกเม็ด ต้องใช้ภาพถ่ายตัดสินแต่ก็ยังเสมอกัน!`,
              `มิตรภาพลูกผู้ชาย! ${names} นัดกันกดคนละ ${topPts} แต้ม ครองจ่าฝูงร่วมประจำวีคแบบสมานฉันท์!`
            );
          } else if (isCentury) {
            leadOptions.push(
              `สะเด่าไปเลยอีน้องงง!! "${top.team_name}" ระเบิดฟอร์มทะลุร้อย กดไปถึง ${topPts} แต้ม โดย${heroPhrase} ทิ้งห่างอันดับสอง ${diff} แต้ม หวานเจี๊ยบบบ!`,
              `ร้อยแต้มแตกเฉยพี่น้อง! "${top.team_name}" ฟอร์มระดับสิบกะโหลก ${heroPhrase} ซัด ${topPts} แต้ม ทิ้ง "${second ? second.team_name : ''}" ขาดลอย ${diff} แต้ม เดินยืดอกอย่างราชา!`,
              `แต้มทะลักปรอทแตก! "${top.team_name}" กดสกอร์สามหลัก ${topPts} แต้ม (ค่าเฉลี่ยลีกแค่ ${avgScore} pts) ฉีกหนี ${diff} แต้มแบบไม่ต้องจุดธูปขอพร!`,
              `ขึ้นหิ้งระดับตำนาน! "${top.team_name}" ทะยานแตะหลักร้อยที่ ${topPts} แต้ม ${heroPhrase} ขยี้คู่แข่งทั้งลีกแบบเต็มคาราเบล!`
            );
          } else if (diff <= 2 && second) {
            leadOptions.push(
              `หัวใจจะวาย! "${top.team_name}" เบียดชนะ "${second.team_name}" ปลายจมูกแค่ ${diff} แต้ม (${topPts} ต่อ ${secondPts} pts) โดย${heroPhrase} เข้าป้ายแชมป์แบบสะใจโก๋!`,
              `ปาดหน้าเค้กวินาทีสุดท้าย! "${top.team_name}" ซัด ${topPts} แต้ม เฉือน "${second.team_name}" (${secondPts} pts) แค่ ${diff} แต้ม ชนะแต้มเดียวก็คือแชมป์ ร้องไห้ทำไม!`,
              `ดราม่าเฉือนกันเลือดซิป! "${top.team_name}" อาศัยทีเด็ด ${heroPhrase} แซงเข้าป้าย ${topPts} แต้ม หนี "${second.team_name}" แค่ก้าวเดียว (${diff} pt)!`,
              `ต้องตัดสินด้วย VAR! "${top.team_name}" กด ${topPts} แต้ม เบียดไหล่ชนะ "${second.team_name}" (${secondPts} pts) ไปแบบเฉียดฉิวแค่ ${diff} แต้ม ลุ้นกันเยี่ยวเหนียว!`
            );
          } else if (diff <= 6 && second) {
            leadOptions.push(
              `บี้กันไฟแลบ! "${top.team_name}" ${heroPhrase} กดไป ${topPts} แต้ม เบียดหนี "${second.team_name}" (${secondPts} pts) ไป ${diff} แต้ม ยึดบัลลังก์ GW ${gwNumber} อย่างสุดมันส์!`,
              `เกมตึงเปรี๊ยะระดับห้าดาว! "${top.team_name}" เก็บไป ${topPts} แต้ม เอาชนะ "${second.team_name}" ที่ไล่บี้มาติดๆ ที่ ${secondPts} แต้ม ด้วยความเฉียบคมของขุมกำลัง!`,
              `ชิงจังหวะกันสนุก! "${top.team_name}" อาศัยทีเด็ด${heroPhrase} พาทีมเข้าวินที่ ${topPts} แต้ม ทิ้ง "${second.team_name}" ไป ${diff} แต้มแบบได้ลุ้นจนนัดสุดท้าย!`,
              `วัดกึ๋นกันตัวต่อตัว! "${top.team_name}" ยืนระยะสุดแกร่งที่ ${topPts} แต้ม กันท่า "${second.team_name}" (${secondPts} pts) ไม่ให้แซงได้สำเร็จ!`
            );
          } else if (diff >= 15) {
            leadOptions.push(
              `พับสนามบุกอยู่ฝ่ายเดียว! "${top.team_name}" ${heroPhrase} ซัดไป ${topPts} แต้ม ทิ้งห่าง "${second ? second.team_name : 'อันดับสอง'}" ขาดลอยถึง ${diff} แต้ม กินเต็มข้อ ล่อเต็มแข้ง!`,
              `ฟอร์มอย่างโหด โกรธใครมา! "${top.team_name}" ฟาด ${topPts} แต้ม ฉีกหนีอันดับสอง ${diff} แต้ม ยืนหนึ่งบนยอดเขาแบบไร้คู่ต่อกร!`,
              `ม้วนเดียวจบไม่ต้องพึ่งยาดม! "${top.team_name}" จัดหนัก ${topPts} แต้ม ทิ้งห่าง "${second ? second.team_name : 'คู่แข่ง'}" ไม่เห็นฝุ่น ${diff} แต้ม คว้าแชมป์วีคแบบสบายเกือก!`,
              `สอนบอลเชิงลึก! "${top.team_name}" ${heroPhrase} กดสกอร์ ${topPts} แต้ม ทิ้งห่าง ${diff} แต้ม ขยี้คู่แข่งจนหาทางกลับบ้านไม่ถูก!`
            );
          } else if (topPts < 60) {
            leadOptions.push(
              `สัปดาห์แห่งทุ่งสังหาร! ค่าเฉลี่ยทั้งลีกอยู่ที่ ${avgScore} แต้ม แต่ "${top.team_name}" เอาตัวรอดเก่งจัด ${heroPhrase} เก็บ ${topPts} แต้ม คว้าแชมป์วีคท่ามกลางพายุแต้มบอด!`,
              `วีคนี้แต้มฝืดกันทั้งบาง แต่ "${top.team_name}" ยังเก๋าพอ กดไป ${topPts} แต้ม (เฉลี่ยลีก ${avgScore} pts) เฉือน "${second ? second.team_name : 'อันดับสอง'}" ${diff} แต้ม ผงาดคว้าแชมป์แบบหล่อท่ามกลางซากปรักหักพัง!`,
              `สงครามคนอึด GW ${gwNumber}! ในวันที่ทีมใหญ่พากันนัดบอด "${top.team_name}" ${heroPhrase} โกย ${topPts} แต้ม เข้าป้ายอันดับ 1 แบบเหนือชั้น!`
            );
          } else {
            leadOptions.push(
              `ฟอร์มกำลังเข้าฝัก! "${top.team_name}" ${heroPhrase} โกยไป ${topPts} แต้ม ทิ้งอันดับสอง "${second ? second.team_name : ''}" ${diff} แต้ม คว้าชัย GW ${gwNumber} อย่างสมศักดิ์ศรี!`,
              `จ่าฝูงวีคนี้ของแทร่! "${top.team_name}" กดสกอร์เน้นๆ ${topPts} แต้ม (สูงกว่าค่าเฉลี่ยลีกที่ ${avgScore} pts) หนี "${second ? second.team_name : 'อันดับสอง'}" ${diff} แต้ม นอนกอดแชมป์สบายใจเฉิบ!`,
              `วางหมากระดับปรมาจารย์! "${top.team_name}" ${heroPhrase} พาทีมซัด ${topPts} แต้ม ทิ้งห่าง ${diff} แต้ม เดินหน้าประกาศศักดาใน GW ${gwNumber}!`,
              `เครื่องร้อนฉ่าหยุดไม่อยู่! "${top.team_name}" จัดทัพลงล็อกทุกตำแหน่ง กวาด ${topPts} แต้ม เอาชนะ "${second ? second.team_name : 'คู่แข่ง'}" ไป ${diff} แต้มแบบไร้ที่ติ!`
            );
          }
        }

        const leadIdx = (baseHash + stepOffset) % leadOptions.length;
        const leadSentence = leadOptions[leadIdx] || leadOptions[0];

        // =========================================================
        // 2. TACTICAL & DRAMA STORYLINES (เจาะลึก 7 มิติดราม่าในสัปดาห์นั้น)
        // =========================================================
        let midOptions = [];

        // Storyline A: Transfer Masterclass (ตลาดซื้อขายเข้าเป้า)
        const txMaster = [...sorted].filter(t => (t.transfers_net_impact || 0) >= 6).sort((a, b) => (b.transfers_net_impact || 0) - (a.transfers_net_impact || 0))[0];
        if (txMaster) {
          const bestMoveIn = (txMaster.transfer_moves || []).filter(m => m && m.in && m.in !== '-').sort((a, b) => (b.in_pts || 0) - (a.in_pts || 0))[0];
          const mv = (bestMoveIn && bestMoveIn.in_pts > 0) ? ` (ดึง ${clean(bestMoveIn.in)} เข้ามาซัด ${bestMoveIn.in_pts} pts)` : '';
          midOptions.push(
            `ไฮไลท์ตลาดนักเตะต้องยกให้ "${txMaster.team_name}" ที่เสริมทัพโคตรแม่น บวกกำไรจากการย้ายตัวสุทธิถึง +${txMaster.transfers_net_impact} แต้ม${mv}`,
            `ด้านสายช็อปปิ้ง "${txMaster.team_name}" ตาเหยี่ยวจัด ซื้อตัวใหม่เข้ามาปุ๊บทำกำไรแต้มสุทธิทันที +${txMaster.transfers_net_impact} คะแนน${mv}`
          );
        }

        // Storyline B: Transfer Regret / Bust (ซื้อขายพังหรือขายตัวเก่าแล้วยิง)
        const txBust = [...sorted].filter(t => (t.transfers_net_impact || 0) <= -6).sort((a, b) => (a.transfers_net_impact || 0) - (b.transfers_net_impact || 0))[0];
        if (txBust) {
          const worstMoveOut = (txBust.transfer_moves || []).filter(m => m && m.out && m.out !== '-').sort((a, b) => (b.out_pts || 0) - (a.out_pts || 0))[0];
          const mvOut = (worstMoveOut && worstMoveOut.out_pts >= 6)
            ? ` เพราะตัวที่เพิ่งขายทิ้งอย่าง ${clean(worstMoveOut.out)} ดันยิงแสกหน้าไป ${worstMoveOut.out_pts} แต้ม`
            : '';
          midOptions.push(
            `ส่วนดราม่าตลาดซื้อขายต้องเห็นใจ "${txBust.team_name}" ที่ขยับเปลี่ยนตัวแล้วแต้มติดลบไป ${txBust.transfers_net_impact} คะแนน${mvOut}`,
            `ขณะที่ "${txBust.team_name}" เจออาถรรพ์ตลาดนักเตะเล่นงาน เปลี่ยนตัวปุ๊บแต้มหายไป ${Math.abs(txBust.transfers_net_impact)} คะแนน${mvOut}`
          );
        }

        // Storyline C: Bench Tragedy (แต้มสำรองระเบิดคาซุ้มม้านั่ง)
        const benchCandidates = sorted.filter(t => (t.bench_points || 0) >= 10 && !['bboost', 'bench_boost'].includes((t.chip || '').toLowerCase()));
        const benchKing = benchCandidates.sort((a, b) => (b.bench_points || 0) - (a.bench_points || 0))[0];
        if (benchKing) {
          let benchHeroText = '';
          if (leagueData && leagueData.squads) {
            const bSq = leagueData.squads[`${benchKing.entry_id}_${gwNumber}`];
            if (bSq && bSq.bench && bSq.bench.length > 0) {
              const topB = [...bSq.bench].sort((a, b) => (b.points || 0) - (a.points || 0))[0];
              if (topB && topB.points >= 6) benchHeroText = ` (โดยเฉพาะ ${clean(topB.name)} ที่กดไป ${topB.points} pts บนม้านั่ง)`;
            }
          }
          midOptions.push(
            `ขณะที่ "${benchKing.team_name}" นั่งกุมขมับหลังดองแต้มตัวสำรองไว้ข้างสนามถึง ${benchKing.bench_points} แต้มคาเบาะ${benchHeroText}`,
            `ด้าน "${benchKing.team_name}" น้ำตาตกใน ตัวสำรององค์ลงกดรวมกัน ${benchKing.bench_points} แต้ม${benchHeroText} แต่นั่งมองตาปริบๆ ข้างสนาม`
          );
        }

        // Storyline D: Differential Captain Genius (กัปตันทางเลือกพาบิน)
        const capCountMap = {};
        sorted.forEach(t => {
          const cn = (t.captain || '-').replace(/\s*\(C\)/gi, '').trim();
          if (cn && cn !== '-') capCountMap[cn] = (capCountMap[cn] || 0) + 1;
        });
        const diffCapTeams = sorted.slice(0, 6).filter(t => {
          const cn = (t.captain || '-').replace(/\s*\(C\)/gi, '').trim();
          return cn && cn !== '-' && (capCountMap[cn] || 0) <= 2;
        });
        if (diffCapTeams.length > 0) {
          const dc = diffCapTeams[(baseHash + stepOffset) % diffCapTeams.length];
          const dcName = (dc.captain || '-').replace(/\s*\(C\)/gi, '').trim();
          midOptions.push(
            `ส่วน "${dc.team_name}" โชว์กึ๋นอินดี้ ฉีกตำราตั้ง ${dcName} เป็นกัปตันตัวแรร์ที่มีแค่ไม่กี่ทีมในลีกกล้าจิ้มจนพาทีมบินสูง`,
            `ความใจถึงต้องยกให้ "${dc.team_name}" ที่สวนกระแสมหาชนมอบปลอกแขนให้ ${dcName} จนกลายเป็นหมากเด็ดประจำวีค`
          );
        }

        // Storyline E: Popular Captain Blank vs Roar (กัปตันมหาชนบอดหรือปัง)
        const mostPopCap = Object.entries(capCountMap).sort((a, b) => b[1] - a[1])[0];
        if (mostPopCap && mostPopCap[1] >= 4 && leagueData && leagueData.squads) {
          const popCapName = mostPopCap[0];
          const sampleTeam = sorted.find(t => (t.captain || '').includes(popCapName));
          const sampleSq = sampleTeam ? leagueData.squads[`${sampleTeam.entry_id}_${gwNumber}`] : null;
          const capPlayerObj = sampleSq && sampleSq.starting ? sampleSq.starting.find(p => p.is_captain) : null;
          if (capPlayerObj) {
            if (capPlayerObj.points <= 6) {
              midOptions.push(
                `สัปดาห์นี้เหล่าสาวกกัปตันมหาชนอย่าง ${popCapName} (${mostPopCap[1]} ทีมในลีก) ต้องกอดคอกันซึม หลังทำแต้มคูณสองได้แค่ ${capPlayerObj.points} คะแนน`,
                `แถมวีคนี้กัปตันขวัญใจมหาชน ${popCapName} ที่คนแห่ตั้งกันถึง ${mostPopCap[1]} ทีม ดันกระสุนด้านเก็บไปแค่ ${capPlayerObj.points} แต้ม ทำเอาสะเทือนกันทั้งตาราง`
              );
            } else if (capPlayerObj.points >= 20) {
              midOptions.push(
                `ส่วนใครที่เทใจให้กัปตันมหาชน ${popCapName} (${mostPopCap[1]} ทีม) ยิ้มแก้มปริกันถ้วนหน้า หลังระเบิดฟอร์มกดคูณสองไปถึง ${capPlayerObj.points} แต้ม`
              );
            }
          }
        }

        // Storyline F: Heavy Hit Takers (แก๊งยอมเจ็บกดแต้มลบ)
        const hitTakers = sorted.filter(t => t.hits > 0).sort((a, b) => b.hits - a.hits);
        if (hitTakers.length > 0) {
          const profitingHits = hitTakers.filter(t => t[scoreKey] >= avgScore);
          const strugglingHits = hitTakers.filter(t => t[scoreKey] < avgScore);
          if (profitingHits.length > 0) {
            const hitNames = profitingHits.slice(0, 2).map(t => `"${t.team_name}" (-${t.hits})`).join(' และ ');
            midOptions.push(
              `ด้านสายลุยอย่าง ${hitNames} ยอมกัดฟันเสียแต้มลบผ่าตัดทีม แต่ผลลัพธ์คุ้มค่าเหนื่อยเก็บแต้มเหนือค่าเฉลี่ยของลีกได้สำเร็จ`
            );
          } else if (strugglingHits.length > 0) {
            const hitNames = strugglingHits.slice(0, 2).map(t => `"${t.team_name}" (-${t.hits})`).join(' และ ');
            midOptions.push(
              `ส่วนแก๊งมือลั่นอย่าง ${hitNames} ยอมเสียค่าปรับติดลบแก้เกมแต่ยังไม่ฟื้น ต้องรอลุ้นถอนทุนคืนในสัปดาห์หน้า`
            );
          }
        }

        // Storyline G: Tough Week / Bottom of the Table (บ๊วยประจำสัปดาห์)
        if (bottom && bottom.entry_id !== top.entry_id && sorted.length > 3) {
          midOptions.push(
            `ด้านท้ายตารางสัปดาห์นี้ "${bottom.team_name}" เจอมรสุมลูกหนังเล่นงาน เก็บไปได้ ${bottom[scoreKey]} แต้ม ต้องรีบกลับไปกางตำราแก้เกมด่วน`,
            `ส่วนตำแหน่งสู้ชีวิตประจำวีคตกเป็นของ "${bottom.team_name}" ที่แต้มสะดุดอยู่ที่ ${bottom[scoreKey]} คะแนน แต่เส้นทางยังอีกยาวไกลให้เอาคืน`
          );
        }

        let midSentence = '';
        if (midOptions.length > 0) {
          const midIdx = (Math.abs(Number(gwNumber) * 19 + leagueSeed * 7) + stepOffset) % midOptions.length;
          midSentence = midOptions[midIdx];
        }

        // =========================================================
        // 3. ENDING PUNCHLINE (คลังประโยคปิดท้าย 18 แบบ ไม่ซ้ำกันในแต่ละวีค)
        // =========================================================
        let endOptions = [];
        if (isFinished) {
          endOptions = [
            `ใครตามไม่ทัน...ก็ต้องก้มหน้าอยู่รูกันต่อไป!`,
            `ของแทร่ไม่ต้องพูดเยอะ สัปดาห์หน้าเปิดฟลอร์ดวลกันใหม่!`,
            `ฟอร์มระดับนี้บอกเลยว่า ยาวไปๆ พี่น้อง!`,
            `เซียนอยู่รูของจริง วัดกันที่ผลงานบนตารางล้วนๆ!`,
            `แดกเต็มข้อ ล่อเต็มแข้ง หวานเจี๊ยบบบ!`,
            `ใครจัดตัวพลาดวีคนี้ รีบไปอาบน้ำมนต์แก้ชงด่วน!`,
            `สัปดาห์หน้าเดดไลน์มาไว อย่ามัวแต่เหม่อเดี๋ยวตกรถด่วนขบวนแชมป์!`,
            `นี่แหละเสน่ห์แฟนตาซี พลิกนรกได้ทุกสัปดาห์!`,
            `คนชนะเดินแอ็คหล่อได้เต็มที่ ส่วนคนแพ้ซุ่มซ้อมรอล้างตา!`,
            `สามแต้มในสนามจริงยังสู้ความสะใจในมินิลีกไม่ได้เลยโว้ย!`,
            `กูรูบอ.บู๋ซูฮกให้หนึ่งจอก จัดทัพได้สะเด่าทรวงจริงๆ!`,
            `แต้มเป็นเรื่องของวาสนา แต่จัดตัวเข้าตาเป็นเรื่องของฝีมือล้วนๆ!`,
            `จบวีคนี้แยกย้ายไปเลียแผลใจ แล้วเจอกันใหม่แมตช์หน้า!`,
            `ตารางคะแนนไม่เคยโกหกใคร ตัวตึงตัวจริงเขาวัดกันตรงนี้!`
          ];
        } else {
          endOptions = [
            `แต่บอลยังเตะไม่ครบทุกคู่ อย่าเพิ่งรีบโม้ เดี๋ยวจะหาว่าไม่เตือน!`,
            `บอลยังไม่จบอย่าเพิ่งนับศพทหาร รอดูบทสรุปของจริงตอนนกหวีดสุดท้าย!`,
            `จ่าฝูงชั่วคราวอย่าเพิ่งเหลิง บอลกลมๆ อะไรก็เกิดขึ้นได้เสมอ!`,
            `ยังเหลือตัวทีเด็ดในคู่อื่นให้ลุ้น ระวังโดนปาดหน้าเค้กตอนจบวีค!`,
            `เกมยังไม่จบ 90 นาที ใครมีตัวเหลือในมือเตรียมสวดมนต์รอปาฏิหาริย์ได้เลย!`,
            `คะแนนโบนัสยังไม่นิ่ง เกาะขอบจอลุ้นกันต่อห้ามกะพริบตา!`,
            `สงครามยังไม่จบ อย่าเพิ่งรีบฉลอง เดี๋ยวเจอทีเด็ดคู่ดึกแซงทางโค้ง!`,
            `ลุ้นกันนัดต่อนัด ตัวสำรองออโต้ซับยังอาจเปลี่ยนชะตาชีวิตได้!`
          ];
        }

        const endIdx = (Math.abs(Number(gwNumber) * 29 + leagueSeed * 5) + stepOffset) % endOptions.length;
        const endSentence = endOptions[endIdx];

        if (midSentence) {
          return `${leadSentence} ${midSentence} ${endSentence}`;
        }
        return `${leadSentence} ${endSentence}`;
      }
    }

    /**
     * Official Premier League Club Kit Mapping (Team Short Name -> Kit Code)
     */
    const FPL_TEAM_CODES = {
      'ARS': 3, 'AVL': 7, 'BOU': 91, 'BRE': 94, 'BHA': 36,
      'CHE': 8, 'COV': 9, 'CRY': 31, 'EVE': 11, 'FUL': 54,
      'HUL': 88, 'IPS': 40, 'LEE': 2, 'LIV': 14, 'MCI': 43,
      'MUN': 1, 'NEW': 4, 'NFO': 17, 'TOT': 6, 'SUN': 56
    };

    /**
     * Standalone Multi-League Application
     */
    class StandaloneApp {
      constructor(multiData, configs, defaultLeagueId) {
        this.multiData = multiData;
        this.configs = configs;

        // Path detection (e.g. /fpl-mini/40700 or /fpl-mini/675290)
        let pathLeague = '';
        if (window.location && window.location.pathname) {
          const parts = window.location.pathname.split('/').filter(Boolean);
          for (let p of parts) {
            if (this.multiData.leagues[p]) {
              pathLeague = p;
              break;
            }
          }
        }

        let queryLeague = '';
        let queryTab = '';
        let queryGW = '';
        try {
          if (typeof URLSearchParams !== 'undefined' && window.location && window.location.search) {
            const urlParams = new URLSearchParams(window.location.search);
            queryLeague = urlParams.get('league') || '';
            queryTab = urlParams.get('tab') || '';
            queryGW = urlParams.get('gw') || '';
          }
        } catch (e) {}

        let hashLeague = '';
        if (window.location && window.location.hash) {
          hashLeague = window.location.hash.replace('#', '');
        }

        let savedLeague = '';
        try {
          if (typeof localStorage !== 'undefined') {
            savedLeague = localStorage.getItem('fpl_mini_active_league');
          }
        } catch (e) {}

        if (defaultLeagueId && this.multiData.leagues[defaultLeagueId]) {
          this.activeLeagueId = defaultLeagueId;
        } else if (pathLeague && this.multiData.leagues[pathLeague]) {
          this.activeLeagueId = pathLeague;
        } else if (queryLeague && this.multiData.leagues[queryLeague]) {
          this.activeLeagueId = queryLeague;
        } else if (hashLeague && this.multiData.leagues[hashLeague]) {
          this.activeLeagueId = hashLeague;
        } else if (savedLeague && this.multiData.leagues[savedLeague]) {
          this.activeLeagueId = savedLeague;
        } else {
          this.activeLeagueId = "40700";
        }

        this.data = this.multiData.leagues[this.activeLeagueId] || Object.values(this.multiData.leagues)[0];
        this.config = this.configs[this.activeLeagueId] || Object.values(this.configs)[0];
        
        const maxGW = Number(this.multiData.max_gw) || 2;
        const latestGWData = this.data && this.data.gameweeks ? this.data.gameweeks[String(maxGW)] : null;
        const isLatestStarted = latestGWData ? (latestGWData.is_started !== undefined ? Boolean(latestGWData.is_started) : (Boolean(latestGWData.is_finished) || (latestGWData.results && latestGWData.results.some(r => r.points > 0)))) : false;
        
        const queryGWNum = Number(queryGW);
        if (queryGWNum >= 1 && queryGWNum <= maxGW) {
          this.selectedGW = queryGWNum;
        } else {
          this.selectedGW = (!isLatestStarted && maxGW > 1) ? (maxGW - 1) : maxGW;
        }
        const activeMonth = (this.config && this.config.monthly_schedule || []).find(m => m.gw_list && m.gw_list.includes(this.selectedGW));
        this.selectedMonthId = activeMonth ? activeMonth.id : 1;
        this.activeTab = queryTab || 'gameweek-view';
        this.liveNotesCache = {};
      }

      init() {
        this.initTheme();
        this.renderLeagueDropdown();
        this.updateHeaderInfo();
        this.initTabNavigation();
        this.renderAll();
        if (this.activeTab && this.activeTab !== 'gameweek-view') {
          this.switchTab(this.activeTab);
        }
        this.initVisitorCounter();
      }

      initTheme() {
        const isDark = document.documentElement.classList.contains('dark');
        this.updateThemeIcons(isDark);
      }

      toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark');
        try {
          localStorage.setItem('fpl_theme', isDark ? 'dark' : 'light');
        } catch (e) {}
        this.updateThemeIcons(isDark);
      }

      updateThemeIcons(isDark) {
        const moonIcon = document.getElementById('theme-icon-moon');
        const sunIcon = document.getElementById('theme-icon-sun');
        if (moonIcon && sunIcon) {
          if (isDark) {
            moonIcon.classList.add('hidden');
            moonIcon.classList.remove('block');
            sunIcon.classList.remove('hidden');
            sunIcon.classList.add('block');
          } else {
            moonIcon.classList.remove('hidden');
            moonIcon.classList.add('block');
            sunIcon.classList.add('hidden');
            sunIcon.classList.remove('block');
          }
        }
      }

      escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }

      toggleLeagueDropdown(event) {
        if (event) event.stopPropagation();
        const menu = document.getElementById('league-dropdown-menu');
        const chevron = document.getElementById('league-switcher-chevron');
        if (menu) {
          const isHidden = menu.classList.contains('hidden');
          if (isHidden) {
            menu.classList.remove('hidden');
            if (chevron) chevron.style.transform = 'rotate(180deg)';
          } else {
            menu.classList.add('hidden');
            if (chevron) chevron.style.transform = 'rotate(0deg)';
          }
        }
      }

      closeLeagueDropdownIfClickedOutside(event) {
        const menu = document.getElementById('league-dropdown-menu');
        const btn = document.getElementById('league-switcher-btn');
        const chevron = document.getElementById('league-switcher-chevron');
        if (menu && !menu.classList.contains('hidden')) {
          if (btn && btn.contains(event.target)) return;
          menu.classList.add('hidden');
          if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
      }

      switchLeague(leagueId) {
        if (!this.multiData.leagues[leagueId]) return;
        this.activeLeagueId = String(leagueId);
        this.data = this.multiData.leagues[this.activeLeagueId];
        this.config = this.configs[this.activeLeagueId];
        const activeMonth = (this.config && this.config.monthly_schedule || []).find(m => m.gw_list && m.gw_list.includes(this.selectedGW));
        this.selectedMonthId = activeMonth ? activeMonth.id : 1;
        
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('fpl_mini_active_league', this.activeLeagueId);
          }
        } catch (e) {}

        // Safely update clean URL without ever breaking script execution
        try {
          if (window.history && window.history.replaceState) {
            if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
              const isGitHubPages = window.location.pathname.includes('/fpl-mini');
              const basePath = isGitHubPages ? '/fpl-mini/' : '/';
              const configuredIds = Object.keys(this.configs || {});
              const currentInSubdir = configuredIds.some(lid => window.location.pathname.includes('/' + lid));

              if (currentInSubdir) {
                let newPath = window.location.pathname;
                configuredIds.forEach(lid => {
                  newPath = newPath.replace(new RegExp('/' + lid + '(/index\\.html|/)?$'), '/' + this.activeLeagueId + '/');
                });
                window.history.replaceState(null, '', newPath);
              } else {
                window.history.replaceState(null, '', basePath + '?league=' + this.activeLeagueId);
              }
            } else {
              // Local file:// protocol: never strip directories or trigger SecurityError
              const currentPath = window.location.pathname;
              window.history.replaceState(null, '', currentPath + '?league=' + this.activeLeagueId);
            }
          }
        } catch (e) {
          console.warn('replaceState skipped:', e);
          try {
            window.location.hash = this.activeLeagueId;
          } catch (err) {}
        }

        const menu = document.getElementById('league-dropdown-menu');
        const chevron = document.getElementById('league-switcher-chevron');
        if (menu) menu.classList.add('hidden');
        if (chevron) chevron.style.transform = 'rotate(0deg)';

        this.renderLeagueDropdown();
        this.updateHeaderInfo();
        this.renderAll();
      }

      renderLeagueDropdown() {
        const container = document.getElementById('league-dropdown-options');
        if (!container) return;

        let html = '';
        Object.keys(this.multiData.leagues).forEach(lid => {
          const lData = this.multiData.leagues[lid];
          const isCurrent = (lid === this.activeLeagueId);
          const memberCount = (lData.teams || []).length;

          html += `
            <button onclick="app.switchLeague('${lid}')" class="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-blue-50/60 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${isCurrent ? 'bg-blue-50 border border-blue-200/80 text-blue-950 font-black' : ''}">
              <div>
                <div class="${isCurrent ? 'text-blue-950 font-black' : 'text-slate-900'}">${this.escapeHtml(lData.name)}</div>
                <div class="text-[10px] text-slate-500 font-normal">League ${lid} • ${memberCount} ทีม</div>
              </div>
              ${isCurrent ? '<span class="text-blue-600 font-black text-xs font-display">✓ กำลังดู</span>' : ''}
            </button>
          `;
        });

        container.innerHTML = html;
      }

      updateHeaderInfo() {
        const nameEl = document.getElementById('header-league-name');
        const idBadge = document.getElementById('header-league-id-badge');
        const seasonEl = document.getElementById('header-season');
        const memberEl = document.getElementById('header-member-count');
        const lastSyncEl = document.getElementById('header-last-sync');
        const cupTabBtn = document.getElementById('tab-btn-cup');

        if (nameEl) nameEl.innerText = this.data.name;
        if (idBadge) idBadge.innerText = `LEAGUE ${this.activeLeagueId}`;
        if (seasonEl) seasonEl.innerText = `ฤดูกาล ${this.data.season || '2026/27'}`;
        if (memberEl) memberEl.innerText = `${(this.data.teams || []).length} ทีมสมาชิก`;
        if (lastSyncEl) lastSyncEl.innerText = this.multiData.last_sync || 'ล่าสุด';

        // Check if latest gameweek is currently live, finished, or upcoming (pre-match)
        const maxGW = Number(this.multiData.max_gw) || 2;
        const curGWData = this.data.gameweeks ? this.data.gameweeks[String(maxGW)] : null;
        const isCurFinished = Boolean(curGWData && curGWData.is_finished);
        const isCurStarted = curGWData ? (curGWData.is_started !== undefined ? Boolean(curGWData.is_started) : (isCurFinished || (curGWData.results && curGWData.results.some(r => r.points > 0)))) : false;

        const gwStatusEl = document.getElementById('header-gw-status');
        const gwStatusBox = document.getElementById('api-status-text');
        const gwStatusDot = document.getElementById('header-gw-status-dot');
        const lastSyncIcon = document.getElementById('header-last-sync-icon');
        const lastSyncBadge = document.getElementById('header-last-sync-badge');

        if (gwStatusEl) {
          if (isCurFinished) {
            gwStatusEl.innerText = `Gameweek ${maxGW} จบการแข่งขัน (Finished)`;
          } else if (isCurStarted) {
            gwStatusEl.innerText = `Gameweek ${maxGW} กำลังแข่งขัน (Live)`;
          } else {
            gwStatusEl.innerText = `Gameweek ${maxGW} รอคิกออฟ (Upcoming)`;
          }
        }

        if (isCurFinished) {
          if (gwStatusBox) gwStatusBox.className = 'text-xs font-medium text-slate-700 hidden md:flex items-center bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200';
          if (gwStatusDot) gwStatusDot.className = 'inline-block w-2 h-2 rounded-full bg-slate-400 mr-2';
        } else if (isCurStarted) {
          if (gwStatusBox) gwStatusBox.className = 'text-xs font-semibold text-emerald-900 hidden md:flex items-center bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-300 shadow-xs animate-pulse';
          if (gwStatusDot) gwStatusDot.className = 'inline-block w-2 h-2 rounded-full bg-emerald-600 mr-2';
        } else {
          if (gwStatusBox) gwStatusBox.className = 'text-xs font-semibold text-indigo-900 hidden md:flex items-center bg-indigo-50 px-3.5 py-1.5 rounded-xl border border-indigo-200 shadow-xs';
          if (gwStatusDot) gwStatusDot.className = 'inline-block w-2 h-2 rounded-full bg-indigo-500 mr-2';
        }

        // Auto-Sync Connection Status (Green = Connected/Healthy, Red = Disconnected/Error)
        let isSyncHealthy = true;
        let syncStatusTitle = 'ระบบเชื่อมต่อ Auto-Sync ปกติ (Online)';

        if (this.multiData && this.multiData.sync_status === 'offline') {
          isSyncHealthy = false;
          syncStatusTitle = 'ไม่สามารถเชื่อมต่อระบบ Auto-Sync ได้ (Offline/Error)';
        } else if (this.multiData && this.multiData.last_sync_iso) {
          try {
            const syncTime = new Date(this.multiData.last_sync_iso.replace(' ', 'T') + '+07:00');
            const now = new Date();
            const diffHours = (now - syncTime) / (1000 * 60 * 60);
            if (diffHours > 24) {
              isSyncHealthy = false;
              syncStatusTitle = 'ไม่พบสัญญาณ Auto-Sync นานกว่า 24 ชม. (Offline)';
            }
          } catch (e) {}
        }

        if (lastSyncIcon) {
          if (isSyncHealthy) {
            lastSyncIcon.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" title="' + syncStatusTitle + '"></span>';
          } else {
            lastSyncIcon.innerHTML = '<span class="w-2 h-2 rounded-full bg-rose-500 inline-block animate-ping" title="' + syncStatusTitle + '"></span>';
          }
          lastSyncIcon.setAttribute('title', syncStatusTitle);
        }

        if (lastSyncBadge) {
          lastSyncBadge.setAttribute('title', syncStatusTitle);
          if (!isSyncHealthy) {
            lastSyncBadge.className = 'inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-medium text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 px-2 sm:px-2.5 py-0.5 rounded-full font-display shadow-2xs';
          } else {
            lastSyncBadge.className = 'inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-medium text-slate-700 bg-slate-100/90 border border-slate-200/80 px-2 sm:px-2.5 py-0.5 rounded-full font-display shadow-2xs';
          }
        }

        // Check Cup Feature Flag
        const hasCup = Boolean(this.config.features && this.config.features.has_cup);
        if (cupTabBtn) {
          if (hasCup) {
            cupTabBtn.classList.remove('hidden');
          } else {
            cupTabBtn.classList.add('hidden');
            if (this.activeTab === 'cup-view') {
              this.switchTab('gameweek-view');
            }
          }
        }
      }

      initTabNavigation() {
        document.querySelectorAll('.tab-nav-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab-target');
            this.switchTab(target);
          });
        });
        this.updateHighlightsTabBlink();
      }

      switchTab(target) {
        this.activeTab = target;
        document.querySelectorAll('.tab-content').forEach(view => view.classList.add('hidden'));
        const targetView = document.getElementById(target);
        if (targetView) targetView.classList.remove('hidden');

        document.querySelectorAll('.tab-nav-btn').forEach(btn => {
          const isTarget = btn.getAttribute('data-tab-target') === target;
          btn.className = isTarget 
            ? 'tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-slate-900 text-white shadow-xs dark:bg-blue-600 dark:text-white'
            : 'tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800';
        });

        this.updateHighlightsTabBlink();
        this.renderCurrentTab();
      }

      updateHighlightsTabBlink() {
        const liveTabBtn = document.getElementById('tab-btn-live');
        const hlTabBtn = document.getElementById('tab-btn-highlights');
        const gwKey = String(this.selectedGW);
        const gwData = this.data.gameweeks ? this.data.gameweeks[gwKey] : null;
        const isFinished = gwData ? Boolean(gwData.is_finished) : false;

        // ทั้งสองหัวข้อ (LIVE และ Weekly Highlight) จะกระพริบเป็นสีเขียวเหมือนกันขณะที่เกมวีคกำลังแข่งขันและยังไม่จบ
        if (!isFinished) {
          if (liveTabBtn) {
            const isLiveActive = this.activeTab === 'gameweek-view';
            if (isLiveActive) {
              liveTabBtn.className = 'tab-nav-btn tab-pulse-live-active flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-emerald-600 text-white border border-emerald-500 shadow-xs dark:bg-emerald-600 dark:text-white dark:border-emerald-400';
            } else {
              liveTabBtn.className = 'tab-nav-btn tab-pulse-live flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 text-emerald-600 dark:text-emerald-400 border border-emerald-500/80 bg-emerald-500/10 hover:bg-emerald-500/20';
            }
          }

          if (hlTabBtn) {
            const isHlActive = this.activeTab === 'highlights-view';
            if (isHlActive) {
              hlTabBtn.className = 'tab-nav-btn tab-pulse-live-active flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-emerald-600 text-white border border-emerald-500 shadow-xs dark:bg-emerald-600 dark:text-white dark:border-emerald-400';
            } else {
              hlTabBtn.className = 'tab-nav-btn tab-pulse-live flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 text-emerald-600 dark:text-emerald-400 border border-emerald-500/80 bg-emerald-500/10 hover:bg-emerald-500/20';
            }
          }
        } else {
          // หากจบการแข่งขันเกมวีคนั้นแล้ว ทั้งสองปุ่มจะหยุดกระพริบ และกลับสู่โทนสีปกติ
          if (liveTabBtn) {
            const isLiveActive = this.activeTab === 'gameweek-view';
            if (isLiveActive) {
              liveTabBtn.className = 'tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-slate-900 text-white shadow-xs dark:bg-blue-600 dark:text-white border border-transparent';
            } else {
              liveTabBtn.className = 'tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800';
            }
            liveTabBtn.classList.remove('tab-pulse-live', 'tab-pulse-live-active');
          }

          if (hlTabBtn) {
            const isHlActive = this.activeTab === 'highlights-view';
            if (isHlActive) {
              hlTabBtn.className = 'tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-slate-900 text-white shadow-xs dark:bg-blue-600 dark:text-white border border-transparent';
            } else {
              hlTabBtn.className = 'tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800';
            }
            hlTabBtn.classList.remove('tab-pulse-live', 'tab-pulse-live-active');
          }
        }
      }

      renderAll() {
        this.renderGWSelector();
        this.renderGameweekView();
        this.renderHighlightsView();
        this.renderPrizesView();
        this.renderHallOfFameView();
        this.renderCupView();
        this.renderRulesView();
        this.updateHighlightsTabBlink();
      }

      renderCurrentTab() {
        if (this.activeTab === 'gameweek-view') this.renderGameweekView();
        else if (this.activeTab === 'highlights-view') this.renderHighlightsView();
        else if (this.activeTab === 'prizes-view') this.renderPrizesView();
        else if (this.activeTab === 'hall-of-fame-view') this.renderHallOfFameView();
        else if (this.activeTab === 'cup-view') this.renderCupView();
        else if (this.activeTab === 'rules-view') this.renderRulesView();
      }

      renderGWSelector() {
        const container = document.getElementById('gw-selector-container');
        if (!container) return;

        let html = '';
        const maxGW = Number(this.multiData.max_gw) || 2;

        for (let gw = 1; gw <= 38; gw++) {
          const isSelected = (gw === this.selectedGW);
          const isPlayed = (gw <= maxGW);
          const gwData = this.data.gameweeks ? this.data.gameweeks[String(gw)] : null;
          const isFinished = Boolean(gwData && gwData.is_finished);
          const isStarted = gwData ? (gwData.is_started !== undefined ? Boolean(gwData.is_started) : (isFinished || (gwData.results && gwData.results.some(r => r.points > 0)))) : false;

          let badgeClass = 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60';
          let statusText = 'LOCKED';

          if (isPlayed) {
            if (isFinished) {
              statusText = 'Finished';
              if (isSelected) {
                badgeClass = 'bg-slate-900 text-white border border-slate-900 shadow-sm cursor-pointer scale-105';
              } else {
                badgeClass = 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 cursor-pointer';
              }
            } else if (isStarted) {
              // Not finished, but matches started -> LIVE & Pulsing Green Button!
              statusText = 'LIVE';
              if (isSelected) {
                badgeClass = 'bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-emerald-300 shadow-lg shadow-emerald-900/40 cursor-pointer scale-105 btn-live-pulse font-bold';
              } else {
                badgeClass = 'bg-emerald-600/85 hover:bg-emerald-600 text-white border-2 border-emerald-400 shadow-md cursor-pointer btn-live-pulse font-bold';
              }
            } else {
              // Pre-match / Squads locked -> Upcoming
              statusText = 'Upcoming';
              if (isSelected) {
                badgeClass = 'bg-indigo-950 text-white border-2 border-indigo-400 shadow-md cursor-pointer scale-105';
              } else {
                badgeClass = 'bg-indigo-50/80 text-indigo-900 border border-indigo-200 hover:bg-indigo-100 cursor-pointer';
              }
            }
          }

          html += `
            <button 
              onclick="${isPlayed ? `app.selectGW(${gw})` : ''}"
              class="flex-shrink-0 flex flex-col items-center justify-center w-14 sm:w-16 py-1.5 rounded-xl transition-all font-display ${badgeClass}"
              ${!isPlayed ? 'disabled' : ''}
            >
              <span class="text-xs font-bold">GW ${gw}</span>
              <span class="text-[9px] font-semibold">${statusText}</span>
            </button>
          `;
        }
        container.innerHTML = html;
      }

      selectGW(gw) {
        const maxGW = Number(this.multiData.max_gw) || 2;
        this.selectedGW = Math.min(Math.max(Number(gw) || 1, 1), maxGW);
        const activeMonth = (this.config && this.config.monthly_schedule || []).find(m => m.gw_list && m.gw_list.includes(this.selectedGW));
        if (activeMonth) {
          this.selectedMonthId = activeMonth.id;
        }
        this.renderGWSelector();
        this.renderGameweekView();
        this.renderHighlightsView();
        this.updateHighlightsTabBlink();
        this.renderCurrentTab();
      }

      renderGameweekView() {
        const gwKey = String(this.selectedGW);
        const gwData = this.data.gameweeks ? this.data.gameweeks[gwKey] : null;

        const tableTitle = document.getElementById('matchday-table-title');
        const tableBadge = document.getElementById('matchday-table-badge');
        const matchdayBody = document.getElementById('matchday-table-body');
        const overallBody = document.getElementById('overall-standings-body');
        const overallNum = document.getElementById('overall-gw-num');
        const championCard = document.getElementById('champion-card-container');

        if (overallNum) overallNum.innerText = this.selectedGW;

        if (!gwData || !gwData.results || gwData.results.length === 0) {
          if (matchdayBody) matchdayBody.innerHTML = '<tr><td colspan="6" class="text-center py-6 text-slate-400">ยังไม่มีข้อมูลในสัปดาห์นี้</td></tr>';
          return;
        }

        const isFinished = Boolean(gwData.is_finished);
        const isStarted = gwData.is_started !== undefined ? Boolean(gwData.is_started) : (isFinished || (gwData.results && gwData.results.some(r => r.points > 0)));

        const overallPill = document.getElementById('overall-gw-pill');
        if (overallPill) {
          if (isFinished) {
            overallPill.innerText = `หลังจบ GW ${this.selectedGW}`;
          } else if (isStarted) {
            overallPill.innerText = `คะแนนสด GW ${this.selectedGW}`;
          } else {
            overallPill.innerText = `ก่อนแข่ง GW ${this.selectedGW}`;
          }
        } else if (overallNum) {
          overallNum.innerText = this.selectedGW;
        }

        if (tableTitle) tableTitle.innerText = `ตารางคะแนน Gameweek ${this.selectedGW}`;
        if (tableBadge) {
          if (isFinished) {
            tableBadge.innerText = 'ผลการแข่งขันทางการ';
            tableBadge.className = 'text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200';
          } else if (isStarted) {
            tableBadge.innerText = 'กำลังแข่งขัน (Live)';
            tableBadge.className = 'text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse';
          } else {
            tableBadge.innerText = 'รอคิกออฟ (Upcoming)';
            tableBadge.className = 'text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200';
          }
        }

        const isWeeklyPrize = (this.config.features && this.config.features.prize_model === 'weekly');
        const scoreProp = (isFinished || isWeeklyPrize) ? 'net_points' : 'points';
        const sorted = [...gwData.results].sort((a, b) => (b[scoreProp] - a[scoreProp]) || (b.net_points - a.net_points) || (b.points - a.points));
        let curRank = 1;
        let prevEligiblePoints = null;
        let eligiblePreCount = 0;
        sorted.forEach((team) => {
          if (!this.isPrizeEligible(team.entry_id)) {
            team.rank = null;
            team.preRank = null;
            return;
          }
          eligiblePreCount++;
          team.preRank = eligiblePreCount;
          if (prevEligiblePoints !== null && team[scoreProp] < prevEligiblePoints) {
            curRank = eligiblePreCount;
          }
          prevEligiblePoints = team[scoreProp];
          team.rank = curRank;
        });

        const eligibleResults = sorted.filter(r => this.isPrizeEligible(r.entry_id));
        const eligibleSortedByPrize = [...eligibleResults].sort((a, b) => (b[scoreProp] - a[scoreProp]) || (b.net_points - a.net_points));
        const eligibleHighestScore = eligibleSortedByPrize.length > 0 ? eligibleSortedByPrize[0][scoreProp] : 0;
        const eligibleTopWinners = eligibleSortedByPrize.filter(r => r[scoreProp] === eligibleHighestScore);
        const prizeLeader = eligibleTopWinners[0] || sorted[0];
        const isJointPrizeWinner = eligibleTopWinners.length > 1;

        const overallTop = sorted[0];
        const hasPassedPrize = !this.isPrizeEligible(overallTop.entry_id) && eligibleTopWinners.length > 0 && overallTop[scoreProp] > prizeLeader[scoreProp];
        const leader = prizeLeader;

        // 1. Render Spotlight Card (Pre-Match Lineup Preview OR Live Leader / Weekly Winner)
        if (championCard && leader) {
          const cacheKey = `${this.activeLeagueId}_${this.selectedGW}`;
          const nonPrizeList = (this.config && this.config.non_prize_teams) || [];
          const currentLiveNote = this.liveNotesCache[cacheKey] || LiveCommentaryEngine.generateFreshNote(this.selectedGW, gwData, this.data.name, false, nonPrizeList, this.data, isWeeklyPrize);
          this.liveNotesCache[cacheKey] = currentLiveNote;

          if (!isStarted) {
            // Render PRE-MATCH Tactical Lineup Preview
            const captainCounts = {};
            const chipCounts = {};
            let totalHitsCount = 0;
            let totalHitsPoints = 0;

            gwData.results.forEach(t => {
              if (t.captain && t.captain !== '-') {
                const cName = t.captain.replace(/\s*\(C\)/gi, '').trim();
                captainCounts[cName] = (captainCounts[cName] || 0) + 1;
              }
              if (t.chip) {
                const ch = t.chip.toUpperCase();
                chipCounts[ch] = (chipCounts[ch] || 0) + 1;
              }
              if (t.hits > 0) {
                totalHitsCount++;
                totalHitsPoints += t.hits;
              }
            });

            const sortedCaptains = Object.entries(captainCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
            const topCaptainsText = sortedCaptains.map(([name, cnt]) => `${this.escapeHtml(name)} (${cnt})`).join(', ') || '-';
            const chipsList = Object.entries(chipCounts).map(([ch, cnt]) => `${this.escapeHtml(ch)} (${cnt})`).join(', ') || 'ไม่มีทีมเปิดชิป';
            const hitsText = totalHitsCount > 0 ? `${totalHitsCount} ทีม (-${totalHitsPoints} pts)` : 'ไม่มีทีมเสียแต้มลบ';

            championCard.innerHTML = `
              <div class="prematch-spotlight-card rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all duration-200">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-900 dark:text-indigo-200 border border-indigo-300/60 dark:border-indigo-500/30 font-display shadow-2xs">
                        <span>📋</span>
                        <span>พรีวิวสัปดาห์การแข่งขัน (GAMEWEEK PREVIEW)</span>
                      </span>
                      <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">รอคิกออฟ</span>
                    </div>
                    <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">Gameweek ${this.selectedGW} ส่งรายชื่อเรียบร้อยแล้ว</h2>
                    <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-0.5">รอการแข่งขันคู่แรกเริ่มเตะ • สถิติการจัดทีมและวางหมากในลีก</p>
                  </div>

                  <div class="w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 border-indigo-100 dark:border-slate-700 flex items-center justify-end gap-3 text-right">
                    <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-indigo-200/90 dark:border-slate-700 shadow-2xs ml-auto sm:ml-0">
                      <span class="text-[10px] text-indigo-900/80 dark:text-slate-400 uppercase font-bold font-display block">จำนวนทีมในลีก</span>
                      <span class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">${gwData.results.length} <span class="text-xs font-bold text-slate-500 dark:text-slate-400">ทีม</span></span>
                    </div>
                  </div>
                </div>

                <!-- Tactical Grid for Pre-Match -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3.5 pt-3 border-t border-indigo-100/80 dark:border-slate-700 text-xs">
                  <div class="bg-white/90 dark:bg-slate-800/90 rounded-xl p-2.5 border border-indigo-100/90 dark:border-slate-700 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display block">กัปตันยอดฮิต (Top Captains)</span>
                    <span class="font-bold text-slate-900 dark:text-white text-xs mt-0.5 block truncate">${topCaptainsText}</span>
                  </div>
                  <div class="bg-white/90 dark:bg-slate-800/90 rounded-xl p-2.5 border border-indigo-100/90 dark:border-slate-700 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display block">ชิปที่ใช้งาน (Active Chips)</span>
                    <span class="font-bold text-slate-900 dark:text-white text-xs mt-0.5 block truncate">${chipsList}</span>
                  </div>
                  <div class="bg-white/90 dark:bg-slate-800/90 rounded-xl p-2.5 border border-indigo-100/90 dark:border-slate-700 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display block">แต้มลบย้ายตัว (Hits Taken)</span>
                    <span class="font-bold text-slate-900 dark:text-white text-xs mt-0.5 block truncate">${hitsText}</span>
                  </div>
                </div>

                <!-- Highlight Note (Borbou Style with Copy & Refresh Buttons) -->
                <div class="mt-3 pt-3 border-t border-indigo-100/80 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                  <div class="min-w-0 pr-1">
                    <span id="current-gw-note-text" class="italic font-medium text-slate-700 dark:text-slate-300 leading-relaxed break-words">${currentLiveNote}</span>
                  </div>
                  <div class="flex items-center justify-end gap-1 flex-shrink-0 self-end sm:self-center pt-1 sm:pt-0">
                    <span id="quote-copy-indicator" class="text-[11px] font-bold text-emerald-600 opacity-0 transition-opacity duration-200 inline-block font-display">Copied!</span>
                    <button onclick="app.copyHighlightQuote()" class="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer" title="คัดลอกบทวิเคราะห์ (Copy Quote)">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                    </button>
                    <button onclick="app.regenerateLiveNote()" class="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer" title="สุ่มบทวิเคราะห์ใหม่สไตล์ บอ.บู๋ (Refresh Analysis)">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            `;
          } else {
            // Standard In-Play or Finished Spotlight Card (Crown Prize-Eligible Leader)
            const isWeekly = (this.config.features.prize_model === 'weekly');
            let badgeTitle = isFinished 
              ? (isJointPrizeWinner ? 'แชมป์ร่วมประจำสัปดาห์ (Joint Weekly Winners)' : 'แชมป์ประจำสัปดาห์ (Weekly Winner)')
              : (isJointPrizeWinner ? 'ผู้นำคะแนนสดร่วม (Joint Live Leaders)' : 'ผู้นำคะแนนสด (Live Leader)');
            if (!isWeekly) {
              badgeTitle = isFinished ? 'คะแนนสูงสุดประจำสัปดาห์ (Top Scorer)' : 'ผู้นำคะแนนสดประจำสัปดาห์ (Live Leader)';
            }

            let badgeIcon = isFinished ? '🏆' : '🟢';
            if (!isWeekly) {
              badgeIcon = isFinished ? '👑' : '🟢';
            }

            const winnerNames = eligibleTopWinners.length > 2 
              ? `${this.escapeHtml(eligibleTopWinners[0].team_name)}, ${this.escapeHtml(eligibleTopWinners[1].team_name)} และอีก ${eligibleTopWinners.length - 2} ทีม` 
              : eligibleTopWinners.map(w => this.escapeHtml(w.team_name)).join(' & ');
            const managerNames = eligibleTopWinners.length > 2
              ? `${this.escapeHtml(eligibleTopWinners[0].player_name)}, ${this.escapeHtml(eligibleTopWinners[1].player_name)} และอีก ${eligibleTopWinners.length - 2} คน`
              : eligibleTopWinners.map(w => `${this.escapeHtml(w.player_name)} • (C) <strong>${this.escapeHtml((w.captain || '-').replace(/\s*\(C\)/gi, '').trim())}</strong>`).join('<br/>');

            const passNoteHtml = hasPassedPrize ? `
              <div class="mt-3 px-3.5 py-2.5 rounded-xl bg-amber-100/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-xs text-amber-950 dark:text-amber-200 shadow-2xs">
                <div class="leading-relaxed">
                  <strong class="font-bold">หมายเหตุการมอบรางวัล:</strong> ทีม <strong>${this.escapeHtml(overallTop.team_name)}</strong> (${overallTop.points} pts${overallTop.hits > 0 ? `, แต้มสุทธิ ${overallTop.net_points} pts หักย้าย -${overallTop.hits}` : ''}) ทำคะแนนสูงสุดในสัปดาห์นี้แต่เป็นทีมร่วมสนุก จึงส่งมอบสิทธิ์รับรางวัลประจำสัปดาห์ให้แก่ <strong>${this.escapeHtml(prizeLeader.team_name)}</strong> (${prizeLeader[scoreProp]} pts)
                </div>
              </div>
            ` : '';

            championCard.innerHTML = `
              <div class="${isFinished ? 'winner-spotlight-card' : 'live-leader-spotlight-card'} rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all duration-200">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  
                  <div>
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isFinished ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-400/50 dark:border-amber-500/40' : 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border border-emerald-400/50 dark:border-emerald-500/40'} font-display shadow-2xs">
                        <span class="text-xs">${badgeIcon}</span>
                        <span>${badgeTitle}</span>
                      </span>
                    </div>
                    <button onclick="app.openTeamModal(${prizeLeader.entry_id})" class="text-left group cursor-pointer block">
                      <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 tracking-tight transition-colors">${winnerNames}</h2>
                    </button>
                    <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-0.5">${managerNames}</p>
                  </div>

                  <div class="flex items-center justify-end gap-3 w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 ${isFinished ? 'border-amber-200/70' : 'border-emerald-200/70'} dark:border-slate-700">
                    <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs px-3.5 py-2 rounded-xl border ${isFinished ? 'border-amber-200/90' : 'border-emerald-200/90'} dark:border-slate-700 shadow-2xs flex items-center gap-3 ml-auto sm:ml-0">
                      <div class="text-right">
                        <span class="text-[10px] sm:text-[11px] ${isFinished ? 'text-amber-900/80' : 'text-emerald-900/80'} dark:text-slate-400 uppercase font-bold font-display block leading-tight">${isFinished ? (isWeeklyPrize ? 'แต้มสุทธิ (Net Pts)' : 'คะแนนทางการ') : (isWeeklyPrize ? 'แต้มสุทธิสด (Live Net)' : 'คะแนนสด (Live Pts)')}</span>
                        <span class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display leading-none">${prizeLeader[scoreProp]} <span class="text-xs font-bold text-slate-500 dark:text-slate-400">pts</span></span>
                      </div>
                      <div class="text-right pl-3 border-l ${isFinished ? 'border-amber-200/90' : 'border-emerald-200/90'} dark:border-slate-700">
                        <span class="text-[10px] ${prizeLeader.hits > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'} block font-display">แต้มลบ: ${prizeLeader.hits > 0 ? `-${prizeLeader.hits}` : '-'}</span>
                        <span class="text-[9px] text-slate-400 block font-display">${prizeLeader.hits > 0 ? ((isFinished || isWeeklyPrize) ? 'หักในแต้มสุทธิแล้ว' : 'หักในแต้มรวม') : 'ไม่มีแต้มลบ'}</span>
                      </div>
                    </div>
                  </div>

                </div>

                <!-- Highlight Note (Borbou Style with Copy & Refresh Buttons) -->
                <div class="mt-3.5 pt-3 border-t ${isFinished ? 'border-amber-200/70' : 'border-emerald-200/70'} dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                  <div class="min-w-0 pr-1">
                    <span id="current-gw-note-text" class="italic font-medium text-slate-700 dark:text-slate-300 leading-relaxed break-words">${currentLiveNote}</span>
                  </div>
                  <div class="flex items-center justify-end gap-1 flex-shrink-0 self-end sm:self-center pt-1 sm:pt-0">
                    <span id="quote-copy-indicator" class="text-[11px] font-bold text-emerald-600 opacity-0 transition-opacity duration-200 inline-block font-display">Copied!</span>
                    <button onclick="app.copyHighlightQuote()" class="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer" title="คัดลอกพาดหัวบทวิเคราะห์ (Copy Quote)">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                    </button>
                    <button onclick="app.regenerateLiveNote()" class="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer" title="สุ่มบทวิเคราะห์ใหม่สไตล์ บอ.บู๋ (Refresh Analysis)">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    </button>
                  </div>
                </div>
                ${passNoteHtml}
              </div>
            `;
          }
        }

        // 2. Render Matchday Table Body
        if (matchdayBody) {
          let mHtml = '';
          sorted.forEach((team, idx) => {
            const chip = team.chip ? `<span class="chip-badge badge-${team.chip.toLowerCase()} font-display">${team.chip.toUpperCase()}</span>` : '';
            const hits = team.hits > 0 ? `<span class="text-rose-600 font-bold font-display">-${team.hits}</span>` : '<span class="text-slate-400">-</span>';
            const isPrize = this.isPrizeEligible(team.entry_id);
            const prizeBadge = this.getPrizeBadge(team.entry_id);
            const isWinner = isStarted && isPrize && eligibleTopWinners.some(w => w.entry_id === team.entry_id);
            const rankDisplay = isStarted ? team.rank : team.preRank;

            let rankBadge = '';
            if (!isPrize) {
              rankBadge = this.getNonPrizeRankBadge();
            } else if (isStarted) {
              if (team.rank === 1) rankBadge = `<span class="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black inline-flex items-center justify-center text-[10px] shadow-xs">${eligibleTopWinners.length > 1 ? 'T1' : '1'}</span>`;
              else if (team.rank === 2) rankBadge = '<span class="w-5 h-5 rounded-full bg-slate-300 text-slate-900 font-black inline-flex items-center justify-center text-[10px] shadow-xs">2</span>';
              else if (team.rank === 3) rankBadge = '<span class="w-5 h-5 rounded-full bg-amber-700/25 text-amber-950 font-black inline-flex items-center justify-center text-[10px] shadow-xs">3</span>';
              else rankBadge = `<span class="text-slate-500 font-bold">${team.rank}</span>`;
            } else {
              rankBadge = `<span class="text-slate-500 font-bold">${rankDisplay}</span>`;
            }

            mHtml += `
              <tr class="hover:bg-blue-50/40 transition-colors ${isWinner ? 'bg-blue-50/20 font-semibold' : ''}">
                <td class="py-2.5 px-1 sm:px-2 text-center font-display font-bold text-xs sm:text-sm">${rankBadge}</td>
                <td class="py-2.5 px-1.5 sm:px-3 min-w-0">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <button onclick="app.openTeamModal(${team.entry_id})" class="text-left font-bold text-xs sm:text-sm text-slate-900 hover:text-slate-600 transition-colors cursor-pointer">
                      <span class="break-words">${this.escapeHtml(team.team_name)}</span>
                    </button>
                    ${chip}
                    ${prizeBadge}
                  </div>
                  <div class="text-[11px] text-slate-500 mt-0.5">
                    <div class="truncate">${this.escapeHtml(team.player_name)}</div>
                    <div class="sm:hidden text-[10px] text-slate-600 font-medium mt-0.5 truncate">
                      (C) ${this.escapeHtml((team.captain || '-').replace(/\s*\(C\)/gi, '').trim())}
                    </div>
                  </div>
                </td>
                <td class="py-2.5 px-2 sm:px-3 text-center hidden sm:table-cell">
                  <span class="text-xs text-slate-600 font-medium">${team.captain && team.captain !== '-' ? this.escapeHtml(team.captain.replace(/\s*\(C\)/gi, '').trim()) + ' (C)' : '-'}</span>
                </td>
                <td class="py-2.5 px-1 sm:px-2 text-center font-display font-bold text-xs sm:text-sm ${isStarted ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700'}">${team.points}</td>
                <td class="py-2.5 px-1 sm:px-2 text-center text-xs sm:text-sm">${hits}</td>
                <td class="py-2.5 px-1.5 sm:px-3 text-right font-display font-medium text-xs sm:text-sm text-slate-600 dark:text-slate-400">${team.net_points}</td>
              </tr>
            `;
          });
          matchdayBody.innerHTML = mHtml;
        }

        // 3. Render Overall Standings Body
        if (overallBody) {
          const overallMap = {};
          const maxGW = Number(this.multiData.max_gw) || 2;

          (this.data.teams || []).forEach(t => {
            overallMap[t.entry_id] = {
              entry_id: t.entry_id,
              team_name: t.entry_name,
              player_name: t.player_name,
              fpl_rank: t.rank || 999,
              total_points: 0,
              last_gw_pts: 0,
              last_gw_raw: 0,
              last_gw_hits: 0
            };
          });

          const targetGW = Math.min(Number(this.selectedGW) || maxGW, maxGW);
          for (let g = 1; g <= targetGW; g++) {
            const gData = this.data.gameweeks ? this.data.gameweeks[String(g)] : null;
            if (gData && gData.results) {
              const gIsStarted = gData.is_started !== undefined 
                ? Boolean(gData.is_started) 
                : (Boolean(gData.is_finished) || gData.results.some(r => r.points > 0));

              // Only accumulate into overall total if gameweek has actually started!
              if (gIsStarted) {
                const seenInGw = new Set();
                gData.results.forEach(r => {
                  if (seenInGw.has(r.entry_id)) return;
                  seenInGw.add(r.entry_id);
                  if (!overallMap[r.entry_id]) {
                    overallMap[r.entry_id] = {
                      entry_id: r.entry_id,
                      team_name: r.team_name,
                      player_name: r.player_name,
                      fpl_rank: 999,
                      total_points: 0,
                      last_gw_pts: 0,
                      last_gw_raw: 0,
                      last_gw_hits: 0
                    };
                  }
                  overallMap[r.entry_id].total_points += r.net_points;
                });
              }

              if (g === this.selectedGW) {
                gData.results.forEach(r => {
                  if (overallMap[r.entry_id]) {
                    overallMap[r.entry_id].last_gw_pts = r.net_points;
                    overallMap[r.entry_id].last_gw_raw = r.points;
                    overallMap[r.entry_id].last_gw_hits = r.hits || 0;
                  }
                });
              }
            }
          }

          const overallSorted = Object.values(overallMap).sort((a, b) => (b.total_points - a.total_points) || ((a.fpl_rank || 999) - (b.fpl_rank || 999)));
          let curOverallRank = 1;
          let eligibleCount = 0;
          let prevEligibleTotal = null;
          overallSorted.forEach((team) => {
            if (!this.isPrizeEligible(team.entry_id)) {
              team.overall_rank = null;
              return;
            }
            eligibleCount++;
            if (prevEligibleTotal !== null && team.total_points < prevEligibleTotal) {
              curOverallRank = eligibleCount;
            }
            prevEligibleTotal = team.total_points;
            team.overall_rank = curOverallRank;
          });

          let oHtml = '';
          overallSorted.forEach((team) => {
            const isPrize = this.isPrizeEligible(team.entry_id);
            const prizeBadge = this.getPrizeBadge(team.entry_id);

            let rankBadge = '';
            if (!isPrize) {
              rankBadge = this.getNonPrizeRankBadge();
            } else if (team.overall_rank === 1) {
              rankBadge = '<span class="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black inline-flex items-center justify-center text-[10px] shadow-xs">1</span>';
            } else if (team.overall_rank === 2) {
              rankBadge = '<span class="w-5 h-5 rounded-full bg-slate-300 text-slate-900 font-black inline-flex items-center justify-center text-[10px] shadow-xs">2</span>';
            } else if (team.overall_rank === 3) {
              rankBadge = '<span class="w-5 h-5 rounded-full bg-amber-700/25 text-amber-950 font-black inline-flex items-center justify-center text-[10px] shadow-xs">3</span>';
            } else {
              rankBadge = `<span class="text-slate-500 font-bold">${team.overall_rank}</span>`;
            }

            const rawScore = team.last_gw_raw !== undefined ? team.last_gw_raw : team.last_gw_pts;
            const hitsBadge = team.last_gw_hits > 0 ? `<span class="text-[10px] sm:text-[11px] font-bold text-rose-500 dark:text-rose-400 font-display ml-0.5">(-${team.last_gw_hits})</span>` : '';

            oHtml += `
              <tr class="hover:bg-blue-50/40 transition-colors ${team.overall_rank && team.overall_rank <= 3 && isPrize ? 'bg-blue-50/20' : ''}">
                <td class="py-2.5 px-1 sm:px-2 text-center font-display font-bold text-xs sm:text-sm">${rankBadge}</td>
                <td class="py-2.5 px-1.5 sm:px-3 min-w-0">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <button onclick="app.openTeamModal(${team.entry_id})" class="text-left font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-700 transition-colors block truncate cursor-pointer">
                      ${this.escapeHtml(team.team_name)}
                    </button>
                    ${prizeBadge}
                  </div>
                  <span class="text-[11px] text-slate-500 block truncate">${this.escapeHtml(team.player_name)}</span>
                </td>
                <td class="py-2.5 px-1 sm:px-3 text-center font-display text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap"><span class="font-semibold">${rawScore}</span>${hitsBadge}</td>
                <td class="py-2.5 px-1.5 sm:px-3 text-right font-display font-black text-xs sm:text-sm text-blue-900">${team.total_points}</td>
              </tr>
            `;
          });
          overallBody.innerHTML = oHtml;
        }
      }

      getChipCode(chip) {
        if (!chip) return '';
        const c = String(chip).toLowerCase();
        if (c === 'wildcard') return 'WC';
        if (c === 'bboost') return 'BB';
        if (c === '3xc') return 'TC';
        if (c === 'freehit') return 'FH';
        return chip.toUpperCase();
      }

      getChipName(chip) {
        if (!chip) return '-';
        const c = String(chip).toLowerCase();
        if (c === 'wildcard') return 'Wildcard';
        if (c === 'bboost') return 'Bench Boost';
        if (c === '3xc') return 'Triple Captain';
        if (c === 'freehit') return 'Free Hit';
        return chip.toUpperCase();
      }

      isPrizeEligible(entryId) {
        if (!this.config || !this.config.non_prize_teams) return true;
        const numId = Number(entryId);
        return !this.config.non_prize_teams.some(id => Number(id) === numId);
      }

      getPrizeBadge(entryId) {
        if (this.isPrizeEligible(entryId)) return '';
        return `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 ml-1.5" title="ทีมนี้เข้าร่วมเล่นสนุก ไม่ได้ลงชิงเงินรางวัล">ร่วมสนุก</span>`;
      }

      getNonPrizeRankBadge() {
        return '<span class="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/80 inline-flex items-center justify-center flex-shrink-0" title="ทีมร่วมสนุก (ไม่นับอันดับ)"></span>';
      }

      renderHighlightsView() {
        const gwKey = String(this.selectedGW);
        const gwData = this.data.gameweeks ? this.data.gameweeks[gwKey] : null;
        
        const titleEl = document.getElementById('highlights-overview-title');
        const gwBadge = document.getElementById('highlights-gw-badge');
        const grid = document.getElementById('highlights-cards-grid');

        if (titleEl) titleEl.innerHTML = 'Weekly Highlights <span class="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400 font-sans">(ไฮไลท์ประจำสัปดาห์)</span>';
        if (gwBadge) gwBadge.innerText = `Gameweek ${this.selectedGW}`;
        this.updateHighlightsTabBlink();

        if (!grid) return;

        if (!gwData || !gwData.results || gwData.results.length === 0) {
          grid.innerHTML = '<div class="col-span-full py-12 text-center text-slate-400 font-medium font-display">No data available for this Gameweek</div>';
          return;
        }

        const isFinished = Boolean(gwData.is_finished);
        const isStarted = gwData.is_started !== undefined 
          ? Boolean(gwData.is_started) 
          : (isFinished || (gwData.results && gwData.results.some(r => r.points > 0)));

        if (!isStarted) {
          grid.innerHTML = `
            <div class="col-span-full py-12 text-center text-slate-400 font-medium font-display glass-card rounded-2xl p-6 border border-slate-200">
              <div class="text-2xl mb-2">⏳</div>
              <div class="text-slate-700 dark:text-slate-200 font-bold text-base">Gameweek ${this.selectedGW} has not started yet</div>
              <p class="text-xs text-slate-400 mt-1">Weekly awards will update live as matches kick off</p>
            </div>
          `;
          return;
        }

        const results = [...gwData.results];
        const sortedByNet = [...results].sort((a, b) => b.net_points - a.net_points);
        const avgNet = results.reduce((sum, r) => sum + r.net_points, 0) / results.length;
        const avgRawPoints = results.reduce((sum, r) => sum + r.points, 0) / results.length;

        const ICONS = {
          star: `<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
          layers: `<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
          rotateCcw: `<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>`,
          chartDown: `<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><polyline points="7 10 11 8 13 13 17 16"></polyline></svg>`,
          trophy: `<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 4h16v6a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6V4z"></path><path d="M12 16v4"></path><path d="M8 20h8"></path></svg>`,
          award: `<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`,
          arrowUp: `<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`
        };

        // LiveFPL-style Award Card builder
        const renderCard = (cfg) => {
          let badgeColor = '';
          let cardHover = '';

          if (cfg.theme === 'green') {
            badgeColor = 'text-emerald-700 dark:text-emerald-400';
            cardHover = 'hover:border-emerald-300 dark:hover:border-emerald-700/60';
          } else if (cfg.theme === 'red') {
            badgeColor = 'text-rose-700 dark:text-rose-400';
            cardHover = 'hover:border-rose-300 dark:hover:border-rose-700/60';
          } else if (cfg.theme === 'purple') {
            badgeColor = 'text-indigo-700 dark:text-indigo-400';
            cardHover = 'hover:border-indigo-300 dark:hover:border-indigo-700/60';
          } else {
            badgeColor = 'text-slate-700 dark:text-slate-300';
            cardHover = 'hover:border-slate-300 dark:hover:border-slate-700';
          }

          if (!cfg.winner) {
            return '';
          }

          return `
            <div class="glass-card rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-all ${cardHover}">
              
              <!-- Header: Vector Icon, English Title & Subtitle with Thai Tag -->
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 flex items-center justify-center flex-shrink-0 shadow-2xs">
                  ${cfg.icon}
                </span>
                <div class="min-w-0">
                  <h4 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 font-display truncate">${cfg.title}</h4>
                  <p class="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-tight mt-0.5">${cfg.subtitle}</p>
                </div>
              </div>

              <!-- Manager Line: Player Name — Team Name (Stats) -->
              <div class="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-baseline gap-1.5 text-xs sm:text-sm">
                <span class="text-slate-600 dark:text-slate-400 font-medium truncate">${this.escapeHtml(cfg.winner.player_name)} —</span>
                <button onclick="app.openTeamModal(${cfg.winner.entry_id})" class="font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer truncate">
                  ${this.escapeHtml(cfg.winner.team_name)}
                </button>
                ${this.getPrizeBadge(cfg.winner.entry_id)}
                <span class="font-extrabold font-display ${badgeColor}">${cfg.statText}</span>
              </div>

              <!-- Minimal Detail Pill -->
              ${cfg.detailHtml ? `
                <div class="mt-2 text-[10.5px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800/80 leading-relaxed">
                  ${cfg.detailHtml}
                </div>
              ` : ''}

            </div>
          `;
        };

        // 1. Top Gun
        const sortedByRaw = [...results].sort((a, b) => (b.points - a.points) || (b.net_points - a.net_points));
        const topGunWinner = sortedByRaw[0];
        const card1 = renderCard({
          icon: ICONS.star,
          title: 'Top Gun',
          subtitle: 'Highest Gameweek score <span class="text-slate-500 dark:text-slate-400 font-normal">(แต้มโหดสุดในวีค)</span>',
          theme: 'green',
          winner: topGunWinner,
          statText: topGunWinner ? `(${topGunWinner.points} pts)` : '',
          detailHtml: topGunWinner ? `Captain: <strong>${this.escapeHtml(topGunWinner.captain || '-')}</strong>${topGunWinner.hits > 0 ? ` • แต้มลบ: -${topGunWinner.hits} (หักในแต้มรวม)` : ''}` : null
        });

        // 2. Tough Week
        const toughCandidate = sortedByRaw[sortedByRaw.length - 1];
        const toughWinner = (sortedByRaw.length > 1 && toughCandidate && topGunWinner && toughCandidate.points < topGunWinner.points) ? toughCandidate : null;
        const card2 = renderCard({
          icon: ICONS.chartDown,
          title: 'Tough Week',
          subtitle: 'Lowest Gameweek score <span class="text-slate-500 dark:text-slate-400 font-normal">(ยับเยินสุดในวีค)</span>',
          theme: 'red',
          winner: toughWinner,
          statText: toughWinner ? `(${toughWinner.points} pts)` : '',
          detailHtml: toughWinner ? `${toughWinner.hits > 0 ? `แต้มลบ: -${toughWinner.hits} (หักในแต้มรวม)` : 'คะแนนตาม Official'}` : null
        });

        // 3. Comeback Kid & 4. Rank Crasher
        let comebackWinner = null;
        let comebackStat = '';
        let comebackDetail = '';
        let comebackEmpty = '';

        let crasherWinner = null;
        let crasherStat = '';
        let crasherDetail = '';
        let crasherEmpty = '';

        if (this.selectedGW === 1) {
          comebackEmpty = 'First gameweek of the season';
          crasherEmpty = 'First gameweek of the season';
        } else {
          const prevTotals = {};
          const currTotals = {};

          (this.data.teams || []).forEach(t => {
            prevTotals[t.entry_id] = 0;
            currTotals[t.entry_id] = 0;
          });

          for (let g = 1; g <= this.selectedGW; g++) {
            const gData = this.data.gameweeks ? this.data.gameweeks[String(g)] : null;
            if (gData && gData.results) {
              gData.results.forEach(r => {
                if (g < this.selectedGW) {
                  prevTotals[r.entry_id] = (prevTotals[r.entry_id] || 0) + (r.net_points || 0);
                }
                currTotals[r.entry_id] = (currTotals[r.entry_id] || 0) + (r.net_points || 0);
              });
            }
          }

          const teamOrderMap = {};
          (this.data.teams || []).forEach((t, idx) => {
            teamOrderMap[t.entry_id] = idx;
          });

          const prevRanked = Object.keys(prevTotals)
            .map(eid => ({ entry_id: Number(eid), pts: prevTotals[eid] }))
            .sort((a, b) => (b.pts - a.pts) || ((teamOrderMap[a.entry_id] ?? 999) - (teamOrderMap[b.entry_id] ?? 999)));
          const currRanked = Object.keys(currTotals)
            .map(eid => ({ entry_id: Number(eid), pts: currTotals[eid] }))
            .sort((a, b) => (b.pts - a.pts) || ((teamOrderMap[a.entry_id] ?? 999) - (teamOrderMap[b.entry_id] ?? 999)));

          const prevRankMap = {};
          prevRanked.forEach((item, idx) => prevRankMap[item.entry_id] = idx + 1);
          const currRankMap = {};
          currRanked.forEach((item, idx) => currRankMap[item.entry_id] = idx + 1);

          const teamsMetaMap = {};
          (this.data.teams || []).forEach(t => teamsMetaMap[t.entry_id] = t);

          const currentMaxGW = Number(this.multiData && this.multiData.max_gw) || 1;
          let rankDiffs = [];
          if (this.selectedGW === currentMaxGW && this.data.teams && this.data.teams.some(t => t.last_rank && t.rank)) {
            rankDiffs = results.map(r => {
              const tm = teamsMetaMap[r.entry_id] || {};
              const pR = (tm.last_rank !== undefined && tm.last_rank !== null) ? tm.last_rank : results.length;
              const cR = tm.rank || results.length;
              return {
                result: r,
                prevRank: pR,
                currRank: cR,
                diff: pR - cR
              };
            });
          } else {
            rankDiffs = results.map(r => {
              const pR = prevRankMap[r.entry_id] || results.length;
              const cR = currRankMap[r.entry_id] || results.length;
              return {
                result: r,
                prevRank: pR,
                currRank: cR,
                diff: pR - cR
              };
            });
          }

          if (this.selectedGW === 1) {
            comebackWinner = null;
            comebackEmpty = 'ยังไม่มีอันดับก่อนหน้าในสัปดาห์แรก (GW 1)';
            crasherWinner = null;
            crasherEmpty = 'ยังไม่มีอันดับก่อนหน้าในสัปดาห์แรก (GW 1)';
          } else {
            const maxRise = [...rankDiffs].filter(r => r.diff > 0).sort((a, b) => (b.diff - a.diff) || (b.prevRank - a.prevRank))[0];
            if (maxRise) {
              comebackWinner = maxRise.result;
              comebackStat = `(+${maxRise.diff})`;
              comebackDetail = `Rose from rank ${maxRise.prevRank} to rank ${maxRise.currRank}`;
            } else {
              comebackEmpty = 'No rank rise this week';
            }

            const maxFall = [...rankDiffs].filter(r => r.diff < 0).sort((a, b) => (a.diff - b.diff) || (b.prevRank - a.prevRank))[0];
            if (maxFall) {
              crasherWinner = maxFall.result;
              crasherStat = `(${maxFall.diff})`;
              crasherDetail = `Fell from rank ${maxFall.prevRank} to rank ${maxFall.currRank}`;
            } else {
              crasherEmpty = 'No rank fall this week';
            }
          }
        }

        const card3 = renderCard({
          icon: ICONS.rotateCcw,
          title: 'Comeback Kid',
          subtitle: 'Biggest rank rise <span class="text-slate-500 dark:text-slate-400 font-normal">(ไต่แรงแซงโค้ง)</span>',
          theme: 'green',
          winner: comebackWinner,
          statText: comebackStat,
          detailHtml: comebackDetail,
          emptyMsg: comebackEmpty
        });

        const card4 = renderCard({
          icon: ICONS.chartDown,
          title: 'Rank Crasher',
          subtitle: 'Biggest rank fall <span class="text-slate-500 dark:text-slate-400 font-normal">(รูดยับลงเหว)</span>',
          theme: 'red',
          winner: crasherWinner,
          statText: crasherStat,
          detailHtml: crasherDetail,
          emptyMsg: crasherEmpty
        });

        // 5. Chip Master
        const chipTeams = results.filter(r => r.chip && r.chip !== '-').sort((a, b) => b.net_points - a.net_points);
        const chipMasterWinner = chipTeams[0] || null;
        const card5 = renderCard({
          icon: ICONS.trophy,
          title: 'Chip Master',
          subtitle: chipMasterWinner ? `Best score with a chip (${this.getChipCode(chipMasterWinner.chip)}) <span class="text-slate-500 dark:text-slate-400 font-normal">(กางการ์ดอย่างเซียน)</span>` : 'Best score with a chip <span class="text-slate-500 dark:text-slate-400 font-normal">(กางการ์ดอย่างเซียน)</span>',
          theme: 'green',
          winner: chipMasterWinner,
          statText: chipMasterWinner ? `(${chipMasterWinner.net_points} pts)` : '',
          detailHtml: chipMasterWinner ? `Active Chip: <strong>${this.getChipName(chipMasterWinner.chip)}</strong>` : null,
          emptyMsg: 'No chips played this week'
        });

        // 6. No-Chip Warrior
        const noChipTeams = results.filter(r => !r.chip || r.chip === '-').sort((a, b) => b.net_points - a.net_points);
        const noChipWinner = noChipTeams[0] || null;
        const card6 = renderCard({
          icon: ICONS.award,
          title: 'No-Chip Warrior',
          subtitle: 'Best score without playing a chip <span class="text-slate-500 dark:text-slate-400 font-normal">(ตัวตึงไม่ง้อชิป)</span>',
          theme: 'green',
          winner: noChipWinner,
          statText: noChipWinner ? `(${noChipWinner.net_points} pts)` : '',
          detailHtml: noChipWinner ? 'Played without an active chip' : null,
          emptyMsg: 'All teams played a chip this week'
        });

        // 7. Value King
        const valueSorted = [...results].sort((a, b) => ((b.team_value || 100.0) - (a.team_value || 100.0)) || ((a.bank || 0) - (b.bank || 0)));
        const valueWinner = valueSorted[0] || null;
        const card7 = renderCard({
          icon: ICONS.trophy,
          title: 'Value King',
          subtitle: 'Highest Team Value <span class="text-slate-500 dark:text-slate-400 font-normal">(ใครอยากเป็นเศรษฐี... ฉันน่ะสิ ฉันน่ะสิ)</span>',
          theme: 'green',
          winner: valueWinner,
          statText: valueWinner ? `(£${valueWinner.team_value || 100.0})` : '',
          detailHtml: valueWinner ? `Team Value: £${valueWinner.team_value || 100.0}m${valueWinner.bank ? ` • In the bank: £${valueWinner.bank}m` : ''}` : null,
          emptyMsg: 'No team value data available'
        });

        // 8. Wildcard Wasteland (Players who played Wildcard below league raw average)
        const lowWcTeams = results.filter(r => r.chip === 'wildcard' && r.points < avgRawPoints).sort((a, b) => a.points - b.points);
        const lowWcWinner = lowWcTeams[0] || null;
        const card8 = renderCard({
          icon: ICONS.layers,
          title: 'Wildcard Wasteland',
          subtitle: 'Wildcard played but below league average <span class="text-slate-500 dark:text-slate-400 font-normal">(เปิดการ์ดแต่ยังกริบ)</span>',
          theme: 'red',
          winner: lowWcWinner,
          statText: lowWcWinner ? `(${lowWcWinner.points} vs avg ${avgRawPoints.toFixed(1)})` : '',
          detailHtml: lowWcWinner ? `Played Wildcard: ${lowWcWinner.points} pts (league avg ${avgRawPoints.toFixed(1)} pts)` : null,
          emptyMsg: 'No Wildcard played below league average'
        });

        // 9. Bench Disaster (Left 20+ points on the bench without Bench Boost)
        const benchTeams = results.filter(r => r.chip !== 'bboost' && (r.bench_points || 0) >= 20).sort((a, b) => (b.bench_points || 0) - (a.bench_points || 0));
        const benchWinner = benchTeams[0] || null;
        const card9 = renderCard({
          icon: ICONS.layers,
          title: 'Bench Disaster',
          subtitle: 'Left 20+ points on the bench (no Bench Boost) <span class="text-slate-500 dark:text-slate-400 font-normal">(สำรองแต้มทะลัก)</span>',
          theme: 'red',
          winner: benchWinner,
          statText: benchWinner ? `(${benchWinner.bench_points} pts)` : '',
          detailHtml: benchWinner ? `${benchWinner.bench_points} points on bench without Bench Boost` : null,
          emptyMsg: 'No bench disaster (20+ pts) this week'
        });

        // Non-Wildcard/FreeHit teams for regular transfer awards
        const nonWcTeams = results.filter(r => r.chip !== 'wildcard' && r.chip !== 'freehit');

        // 10. YOLO Manager (Most transfer hits taken, excluding Wildcard/Free Hit)
        const hitTeams = nonWcTeams.filter(r => r.hits > 0).sort((a, b) => b.hits - a.hits);
        const hitWinner = hitTeams[0] || null;
        const card10 = renderCard({
          icon: ICONS.arrowUp,
          title: 'YOLO Manager',
          subtitle: 'Most transfer hits taken <span class="text-slate-500 dark:text-slate-400 font-normal">(สายลบไม่ยั้ง)</span>',
          theme: 'purple',
          winner: hitWinner,
          statText: hitWinner ? `(${hitWinner.hits} pts)` : '',
          detailHtml: hitWinner ? `Took -${hitWinner.hits} pts in transfer penalties (${hitWinner.hits / 4} extra transfer${hitWinner.hits / 4 > 1 ? 's' : ''})` : null,
          emptyMsg: 'No transfer hits taken this week'
        });

        // 11. Sharpest Trader (Best net transfer impact, excluding Wildcard/Free Hit)
        const goodTxTeams = nonWcTeams.filter(r => (r.transfers_count || 0) > 0 && (r.transfers_net_impact || 0) > 0).sort((a, b) => b.transfers_net_impact - a.transfers_net_impact);
        const goodTxWinner = goodTxTeams[0] || null;
        let goodTxDetail = '';
        let goodTxStat = '';
        if (goodTxWinner) {
          const hitsStr = goodTxWinner.hits > 0 ? `-${goodTxWinner.hits} hits` : '0 hits';
          const movesSign = goodTxWinner.transfers_pts_gain >= 0 ? '+' : '';
          goodTxStat = `(+${goodTxWinner.transfers_net_impact} net; ${movesSign}${goodTxWinner.transfers_pts_gain} from moves, ${hitsStr})`;
          if (goodTxWinner.transfer_moves && goodTxWinner.transfer_moves.length > 0) {
            goodTxDetail = goodTxWinner.transfer_moves.map(m => `<strong>${this.escapeHtml(m.in)}</strong> (${m.in_pts > 0 ? '+' : ''}${m.in_pts}) in for <strong>${this.escapeHtml(m.out)}</strong> (${m.out_pts})`).join(', ');
          }
        }
        const card11 = renderCard({
          icon: ICONS.award,
          title: 'Sharpest Trader',
          subtitle: 'Best net transfer impact <span class="text-slate-500 dark:text-slate-400 font-normal">(ดึงตัวเข้าเป้าสุดปัง)</span>',
          theme: 'green',
          winner: goodTxWinner,
          statText: goodTxStat,
          detailHtml: goodTxDetail,
          emptyMsg: 'No positive transfer impact this week'
        });

        // 12. Transfer Tangle (Worst net transfer impact, excluding Wildcard/Free Hit)
        const badTxTeams = nonWcTeams.filter(r => (r.transfers_count || 0) > 0 && (r.transfers_net_impact || 0) < 0).sort((a, b) => a.transfers_net_impact - b.transfers_net_impact);
        const badTxWinner = badTxTeams[0] || null;
        let badTxDetail = '';
        let badTxStat = '';
        if (badTxWinner) {
          const hitsStr = badTxWinner.hits > 0 ? `-${badTxWinner.hits} hits` : '0 hits';
          const movesSign = badTxWinner.transfers_pts_gain >= 0 ? '+' : '';
          badTxStat = `(${badTxWinner.transfers_net_impact} net; ${movesSign}${badTxWinner.transfers_pts_gain} from moves, ${hitsStr})`;
          if (badTxWinner.transfer_moves && badTxWinner.transfer_moves.length > 0) {
            badTxDetail = badTxWinner.transfer_moves.map(m => `<strong>${this.escapeHtml(m.in)}</strong> (${m.in_pts}) in for <strong>${this.escapeHtml(m.out)}</strong> (${m.out_pts})`).join(', ');
          }
        }
        const card12 = renderCard({
          icon: ICONS.layers,
          title: 'Transfer Tangle',
          subtitle: 'Worst net transfer impact <span class="text-slate-500 dark:text-slate-400 font-normal">(ดึงผิดชีวิตเปลี่ยน)</span>',
          theme: 'red',
          winner: badTxWinner,
          statText: badTxStat,
          detailHtml: badTxDetail,
          emptyMsg: 'No negative transfer impact this week'
        });

        // 13. Hit Hero (Took a hit but still profited overall, excluding Wildcard/Free Hit)
        const hitCandidates = nonWcTeams.filter(r => r.hits > 0);
        const profitableHits = hitCandidates.filter(r => (r.transfers_net_impact || 0) > 0).sort((a, b) => b.transfers_net_impact - a.transfers_net_impact);
        const hitHeroWinner = profitableHits[0] || null;
        let hitHeroDetail = '';
        let hitHeroStat = '';
        if (hitHeroWinner) {
          const movesSign = hitHeroWinner.transfers_pts_gain >= 0 ? '+' : '';
          hitHeroStat = `(+${hitHeroWinner.transfers_net_impact} net; ${movesSign}${hitHeroWinner.transfers_pts_gain} from moves, -${hitHeroWinner.hits} hits)`;
          if (hitHeroWinner.transfer_moves && hitHeroWinner.transfer_moves.length > 0) {
            hitHeroDetail = hitHeroWinner.transfer_moves.map(m => `<strong>${this.escapeHtml(m.in)}</strong> (${m.in_pts > 0 ? '+' : ''}${m.in_pts}) in for <strong>${this.escapeHtml(m.out)}</strong> (${m.out_pts})`).join(', ');
          }
        }
        const card13 = renderCard({
          icon: ICONS.award,
          title: 'Hit Hero',
          subtitle: 'Took a hit but still profited overall <span class="text-slate-500 dark:text-slate-400 font-normal">(ยอมลบแต่จบกำไร)</span>',
          theme: 'green',
          winner: hitHeroWinner,
          statText: hitHeroStat,
          detailHtml: hitHeroDetail,
          emptyMsg: 'No profitable hits this week'
        });

        // 14. Painful Hit (Took a hit and it didn't pay off, excluding Wildcard/Free Hit)
        const failedHits = hitCandidates.filter(r => (r.transfers_net_impact || 0) < 0).sort((a, b) => a.transfers_net_impact - b.transfers_net_impact);
        const painfulHitWinner = failedHits[0] || null;
        let painfulHitDetail = '';
        let painfulHitStat = '';
        if (painfulHitWinner) {
          const movesSign = painfulHitWinner.transfers_pts_gain >= 0 ? '+' : '';
          painfulHitStat = `(${painfulHitWinner.transfers_net_impact} net; ${movesSign}${painfulHitWinner.transfers_pts_gain} from moves, -${painfulHitWinner.hits} hits)`;
          if (painfulHitWinner.transfer_moves && painfulHitWinner.transfer_moves.length > 0) {
            painfulHitDetail = painfulHitWinner.transfer_moves.map(m => `<strong>${this.escapeHtml(m.in)}</strong> (${m.in_pts}) in for <strong>${this.escapeHtml(m.out)}</strong> (${m.out_pts})`).join(', ');
          }
        }
        const card14 = renderCard({
          icon: ICONS.layers,
          title: 'Painful Hit',
          subtitle: 'Took a hit and it didn\\\'t pay off <span class="text-slate-500 dark:text-slate-400 font-normal">(ยอมลบแต่จบเจ็บ)</span>',
          theme: 'red',
          winner: painfulHitWinner,
          statText: painfulHitStat,
          detailHtml: painfulHitDetail,
          emptyMsg: 'No painful hits this week'
        });

        // 15. One-Move Master (Single transfer that made a positive difference, excluding Wildcard/Free Hit)
        const singleTxTeams = nonWcTeams.filter(r => (r.transfers_count || 0) === 1 && (r.transfers_net_impact || 0) > 0).sort((a, b) => b.transfers_net_impact - a.transfers_net_impact);
        const singleTxWinner = singleTxTeams[0] || null;
        let singleTxDetail = '';
        let singleTxStat = '';
        if (singleTxWinner) {
          singleTxStat = `(+${singleTxWinner.transfers_net_impact} net from 1 move)`;
          if (singleTxWinner.transfer_moves && singleTxWinner.transfer_moves[0]) {
            const m = singleTxWinner.transfer_moves[0];
            singleTxDetail = `<strong>${this.escapeHtml(m.in)}</strong> (${m.in_pts > 0 ? '+' : ''}${m.in_pts} pts) in for <strong>${this.escapeHtml(m.out)}</strong> (${m.out_pts})`;
          }
        }
        const card15 = renderCard({
          icon: ICONS.award,
          title: 'One-Move Master',
          subtitle: 'Single transfer that made a positive difference <span class="text-slate-500 dark:text-slate-400 font-normal">(ย้ายตัวเดียวเสียวทั้งลีก)</span>',
          theme: 'green',
          winner: singleTxWinner,
          statText: singleTxStat,
          detailHtml: singleTxDetail,
          emptyMsg: 'No single transfers with positive difference'
        });

        // Assemble all cards with winners
        grid.innerHTML = [
          card1, card2, card3, card4,
          card5, card6, card7, card8,
          card9, card10, card11, card12,
          card13, card14, card15
        ].filter(Boolean).join('');

        this.updateHighlightsTabBlink();
      }

      renderPrizesView() {
        const titleEl = document.getElementById('prizes-overview-title');
        const subEl = document.getElementById('prizes-overview-subtitle');
        const poolBadge = document.getElementById('prizes-pool-badge');
        const mainContainer = document.getElementById('prizes-main-content');
        const tagEl = document.getElementById('prizes-overview-tag');

        if (poolBadge) poolBadge.innerText = this.config.total_pool || 'เงินรางวัล';

        const isWeekly = (this.config.features.prize_model === 'weekly');

        if (isWeekly) {
          if (tagEl) tagEl.innerText = 'WEEKLY PRIZES';
          const weeklyAmount = this.config.features.weekly_prize_amount || 300;
          const weeklyTotal = weeklyAmount * 38;
          if (subEl) subEl.innerText = `ชิงเงินรางวัลรวม ${this.config.total_pool} (แชมป์สัปดาห์ละ ${weeklyAmount.toLocaleString()} THB x 38 สัปดาห์ = ${weeklyTotal.toLocaleString()} THB)`;

          const maxGW = Number(this.multiData.max_gw) || 2;
          const winsCount = {};
          const prizeEarnings = {};
          (this.data.teams || []).forEach(t => {
            winsCount[t.entry_id] = 0;
            prizeEarnings[t.entry_id] = 0;
          });

          for (let g = 1; g <= maxGW; g++) {
            const gData = this.data.gameweeks ? this.data.gameweeks[String(g)] : null;
            if (gData && gData.results && gData.is_finished) {
              const eligibleResults = gData.results.filter(r => this.isPrizeEligible(r.entry_id));
              const sorted = [...eligibleResults].sort((a, b) => b.net_points - a.net_points);
              if (sorted.length > 0) {
                const high = sorted[0].net_points;
                const winners = sorted.filter(r => r.net_points === high);
                const prizePerWinner = weeklyAmount / winners.length;
                const winCredit = 1 / winners.length;
                winners.forEach(r => {
                  if (winsCount[r.entry_id] === undefined) {
                    winsCount[r.entry_id] = 0;
                    prizeEarnings[r.entry_id] = 0;
                  }
                  winsCount[r.entry_id] += winCredit;
                  prizeEarnings[r.entry_id] += prizePerWinner;
                });
              }
            }
          }
          const sortedTeams = [...(this.data.teams || [])].sort((a, b) => {
            const aEligible = this.isPrizeEligible(a.entry_id) ? 1 : 0;
            const bEligible = this.isPrizeEligible(b.entry_id) ? 1 : 0;
            if (aEligible !== bEligible) return bEligible - aEligible;
            if ((prizeEarnings[b.entry_id] || 0) !== (prizeEarnings[a.entry_id] || 0)) {
              return (prizeEarnings[b.entry_id] || 0) - (prizeEarnings[a.entry_id] || 0);
            }
            return (winsCount[b.entry_id] || 0) - (winsCount[a.entry_id] || 0);
          });

          let tableRows = '';
          let hasRenderedNonPrizeHeader = false;
          let totalDistributedWins = 0;
          let totalDistributedPrize = 0;

          sortedTeams.forEach((t, idx) => {
            const isEligible = this.isPrizeEligible(t.entry_id);
            const wins = winsCount[t.entry_id] || 0;
            const actualPrize = prizeEarnings[t.entry_id] || 0;
            if (isEligible) {
              totalDistributedWins += wins;
              totalDistributedPrize += actualPrize;
            }

            if (!isEligible && !hasRenderedNonPrizeHeader) {
              hasRenderedNonPrizeHeader = true;
              tableRows += `
                <tr class="bg-slate-100/75 dark:bg-slate-800/60 border-y border-slate-200/80 dark:border-slate-700/80">
                  <td colspan="4" class="py-2 px-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-display">
                    ทีมร่วมสนุก (ไม่นำมาคิดคำนวณเงินรางวัล)
                  </td>
                </tr>
              `;
            }

            const winsDisplay = isEligible ? ((wins % 1 === 0) ? wins : wins.toFixed(1)) : '-';
            const prizeDisplay = isEligible ? `${actualPrize.toLocaleString()} THB` : '<span class="text-slate-400 font-normal">ร่วมสนุก (ไม่มีรางวัล)</span>';

            tableRows += `
              <tr class="hover:bg-slate-50 transition-colors ${idx < 3 && wins > 0 && isEligible ? 'bg-amber-50/20' : ''}">
                <td class="py-2.5 px-2 sm:px-3 text-center font-display font-bold text-slate-500">${isEligible ? (idx + 1) : this.getNonPrizeRankBadge()}</td>
                <td class="py-2.5 px-2 sm:px-3">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <button onclick="app.openTeamModal(${t.entry_id})" class="text-left font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-700 transition-colors cursor-pointer block">${this.escapeHtml(t.entry_name)}</button>
                    ${this.getPrizeBadge(t.entry_id)}
                  </div>
                  <div class="text-[11px] text-slate-500">${this.escapeHtml(t.player_name)}</div>
                </td>
                <td class="py-2.5 px-2 sm:px-3 text-center font-display font-bold text-slate-800">${winsDisplay}</td>
                <td class="py-2.5 px-2 sm:px-3 text-right font-display font-black text-emerald-600">${prizeDisplay}</td>
              </tr>
            `;
          });

          let phasesHtml = '';
          if (this.config.settlement_phases) {
            this.config.settlement_phases.forEach(p => {
              const parts = (p.gws || '').replace(/GW/gi, '').split('-');
              const startGW = parseInt(parts[0]) || 1;
              const endGW = parseInt(parts[1]) || 6;

              const phaseGWEntries = [];
              let phaseTotalPaid = 0;
              let finishedGWCount = 0;

              for (let g = startGW; g <= endGW; g++) {
                const gData = this.data.gameweeks ? this.data.gameweeks[String(g)] : null;
                if (gData && gData.results && gData.is_finished) {
                  finishedGWCount++;
                  const eligibleResults = gData.results.filter(r => this.isPrizeEligible(r.entry_id));
                  const sorted = [...eligibleResults].sort((a, b) => b.net_points - a.net_points);
                  if (sorted.length > 0) {
                    const topScore = sorted[0].net_points;
                    const topTeams = sorted.filter(r => r.net_points === topScore);
                    const prizePerTeam = (this.config.features.weekly_prize_amount || 300) / topTeams.length;
                    topTeams.forEach(t => {
                      phaseGWEntries.push({
                        gw: g,
                        entry_id: t.entry_id,
                        team_name: t.team_name,
                        player_name: t.player_name,
                        amount: prizePerTeam,
                        is_joint: topTeams.length > 1
                      });
                      phaseTotalPaid += prizePerTeam;
                    });
                  }
                }
              }

              const isPhaseFinished = (finishedGWCount >= (endGW - startGW + 1));
              const isPhaseOngoing = (maxGW >= startGW && !isPhaseFinished);
              
              let badgeHtml = '';
              if (isPhaseFinished) {
                badgeHtml = `<span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-display flex-shrink-0">จบรอบเคลียร์เงินรางวัลแล้ว</span>`;
              } else if (isPhaseOngoing) {
                badgeHtml = `<span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-display flex-shrink-0">กำลังแข่งขัน</span>`;
              } else {
                badgeHtml = `<span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 font-display flex-shrink-0">รอการแข่งขัน</span>`;
              }

              let winnersListHtml = '';
              if (phaseGWEntries.length > 0) {
                winnersListHtml = `
                  <div class="mt-2.5 pt-2.5 border-t border-slate-200/80 space-y-1">
                    <div class="text-[10px] font-bold text-slate-500 uppercase font-display">สรุปทีมที่ได้รับเงินรางวัลรอบนี้:</div>
                    ${phaseGWEntries.map(w => `
                      <div class="flex items-center justify-between text-xs py-0.5">
                        <div class="truncate pr-2">
                          <span class="font-bold text-slate-900">${this.escapeHtml(w.team_name)}</span>
                          <span class="text-[10px] text-slate-500">(${'GW ' + w.gw}${w.is_joint ? ' แชมป์ร่วม' : ''})</span>
                        </div>
                        <span class="font-bold font-display text-emerald-700 flex-shrink-0">${w.amount.toLocaleString()} THB</span>
                      </div>
                    `).join('')}
                    <div class="flex items-center justify-between text-[11px] pt-1.5 border-t border-dashed border-slate-200 font-bold text-slate-800">
                      <span>ยอดเงินรางวัลรวมรอบนี้</span>
                      <span class="text-emerald-700 font-display">${phaseTotalPaid.toLocaleString()} THB</span>
                    </div>
                  </div>
                `;
              } else {
                winnersListHtml = `
                  <div class="mt-2 text-[11px] text-slate-400 italic">
                    ${isPhaseOngoing ? 'ยังไม่มีสัปดาห์ที่จบการแข่งขันในรอบนี้' : 'รอการแข่งขันในสัปดาห์ ' + p.gws}
                  </div>
                `;
              }

              phasesHtml += `
                <div class="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-1 gap-1">
                      <span class="text-xs font-bold text-slate-900 font-display">${p.title} (${p.gws})</span>
                      ${badgeHtml}
                    </div>
                    <div class="text-xs text-slate-500 mt-1">งบประมาณ: <strong class="text-slate-800 font-display">${p.budget}</strong></div>
                  </div>
                  ${winnersListHtml}
                </div>
              `;
            });
          }

          if (mainContainer) {
            mainContainer.innerHTML = `
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200">
                <h3 class="text-sm sm:text-base font-bold text-slate-900 mb-3 font-display">ตารางเงินรางวัลสะสมของสมาชิก</h3>
                <div class="overflow-x-auto no-scrollbar -mx-4 sm:mx-0 touch-scroll">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="border-b border-slate-100 text-[11px] font-bold text-slate-400 font-display bg-slate-50/50">
                        <th class="py-2 px-2 sm:px-3 text-center w-8">#</th>
                        <th class="py-2 px-2 sm:px-3">ทีม & ผู้จัดการ</th>
                        <th class="py-2 px-2 sm:px-3 text-center">แชมป์วีค</th>
                        <th class="py-2 px-2 sm:px-3 text-right">เงินรางวัลสะสม</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-xs sm:text-sm">
                      ${tableRows}
                    </tbody>
                    <tfoot class="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 font-display text-xs sm:text-sm font-bold">
                      <tr>
                        <td colspan="2" class="py-3 px-2 sm:px-3 text-slate-700 dark:text-slate-300">
                          <div class="flex items-center gap-1.5 flex-wrap">
                            <span>ยอดรวมเงินรางวัลสะสมที่มอบไปแล้ว</span>
                            <span class="text-[11px] font-normal text-slate-500 font-display">(จบแล้ว ${Math.round(totalDistributedWins)} วีค)</span>
                          </div>
                        </td>
                        <td class="py-3 px-2 sm:px-3 text-center text-slate-800 dark:text-slate-200 font-bold">${totalDistributedWins % 1 === 0 ? totalDistributedWins : totalDistributedWins.toFixed(1)}</td>
                        <td class="py-3 px-2 sm:px-3 text-right font-black text-emerald-600 dark:text-emerald-400">${totalDistributedPrize.toLocaleString()} THB</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              ${phasesHtml ? `
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200">
                <h3 class="text-sm sm:text-base font-bold text-slate-900 mb-3 font-display">รอบเคลียร์เงินรางวัล 6 งวด</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  ${phasesHtml}
                </div>
              </div>
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200">
                <h3 class="text-sm sm:text-base font-bold text-slate-900 mb-3 font-display">โครงสร้างเงินรางวัลรวมทั้งฤดูกาล (${this.config.total_pool || '20,000 THB'})</h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">รางวัลแชมป์วีค (38 วีค)</span>
                    <div class="text-xl font-black text-slate-900 mt-1 font-display">${weeklyTotal.toLocaleString()} <span class="text-xs">THB</span></div>
                    <div class="text-xs text-slate-600 mt-0.5 font-medium">วีคละ ${weeklyAmount.toLocaleString()} THB x 38 รางวัล</div>
                  </div>
                  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">รางวัลแชมป์บอลถ้วย (Cup)</span>
                    <div class="text-xl font-black text-slate-900 mt-1 font-display">1,550 <span class="text-xs">THB</span></div>
                    <div class="text-xs text-slate-600 mt-0.5 font-medium">แชมป์ ${this.config.cup_champion_prize || '1,000 THB'} / รองแชมป์ ${this.config.cup_runner_up_prize || '550 THB'}</div>
                  </div>
                  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">รางวัลแชมป์ฤดูกาล</span>
                    <div class="text-xl font-black text-slate-900 mt-1 font-display">7,050 <span class="text-xs">THB</span></div>
                    <div class="text-xs text-slate-600 mt-0.5 font-medium">ที่ 1: 3,500 / ที่ 2: 2,000 / ที่ 3: 1,000 / ที่ 4: 550</div>
                  </div>
                </div>
              </div>` : `
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200">
                <h3 class="text-sm sm:text-base font-bold text-slate-900 mb-3 font-display">โครงสร้างเงินรางวัลประจำฤดูกาล & การบริหารกองกลาง</h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">แชมป์ประจำสัปดาห์ (38 สัปดาห์)</span>
                    <div class="text-xl font-black text-slate-900 mt-1 font-display">${((this.config.features.weekly_prize_amount || 500) * 38).toLocaleString()} <span class="text-xs">THB</span></div>
                    <div class="text-xs text-slate-600 mt-0.5 font-medium">สัปดาห์ละ ${this.config.features.weekly_prize_amount || 500} THB x 38 สัปดาห์</div>
                  </div>
                  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">แชมป์ฤดูกาล (รวม 5 อันดับ)</span>
                    <div class="text-xl font-black text-slate-900 mt-1 font-display">9,000 <span class="text-xs">THB</span></div>
                    <div class="text-xs text-slate-600 mt-0.5 font-medium">แชมป์ 4,500 / รอง 2,500 / ที่ 3 1,000 / ที่ 4-5 500</div>
                  </div>
                  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">ผู้ประสานงาน & ดูแลกองกลาง</span>
                    <div class="text-base font-bold text-slate-900 mt-1">${this.config.coordinator || 'เฟม (Some might say)'}</div>
                    <div class="text-xs text-slate-600 mt-0.5 font-medium">เก็บเงินงวดเดียวเต็มจำนวน (${this.config.entry_fee || '1,900 THB'})</div>
                  </div>
                </div>
              </div>`}
            `;
          }

        } else {
          const feat = (this.config && this.config.features) || {};
          const champPrize = feat.monthly_champion_prize || 600;
          const runnerPrize = feat.monthly_runner_up_prize || 400;
          const totalMonthly = feat.total_monthly_budget || '10,000 THB';

          if (tagEl) tagEl.innerText = 'MONTHLY AWARDS (10 MONTHS) & SEASON POOL';
          if (titleEl) titleEl.innerText = 'สรุปรางวัลประจำเดือน & กองกลางการกุศล';
          if (subEl) subEl.innerText = `รางวัลประจำเดือน: แชมป์ ${champPrize} THB • รองแชมป์ ${runnerPrize} THB (10 เดือน = ${totalMonthly}) • กองกลางรวม ${this.config.total_pool || '36,000 THB'}`;

          const curMonth = (this.config.monthly_schedule || []).find(m => m.id === this.selectedMonthId) || this.config.monthly_schedule[0];
          const monthlyMap = {};
          (this.data.teams || []).forEach(t => {
            monthlyMap[t.entry_id] = {
              entry_id: t.entry_id,
              team_name: t.entry_name,
              player_name: t.player_name,
              gw_scores: {},
              month_total: 0
            };
          });

          if (curMonth && curMonth.gw_list) {
            curMonth.gw_list.forEach(gwNum => {
              const gData = this.data.gameweeks ? this.data.gameweeks[String(gwNum)] : null;
              if (gData && gData.results) {
                const gIsStarted = gData.is_started !== undefined 
                  ? Boolean(gData.is_started) 
                  : (Boolean(gData.is_finished) || gData.results.some(r => r.points > 0));

                if (gIsStarted) {
                  gData.results.forEach(r => {
                    if (!monthlyMap[r.entry_id]) {
                      monthlyMap[r.entry_id] = {
                        entry_id: r.entry_id,
                        team_name: r.team_name,
                        player_name: r.player_name,
                        gw_scores: {},
                        month_total: 0
                      };
                    }
                    monthlyMap[r.entry_id].gw_scores[gwNum] = r.net_points;
                    monthlyMap[r.entry_id].month_total += r.net_points;
                  });
                }
              }
            });
          }

          const monthlySorted = Object.values(monthlyMap).sort((a, b) => {
            const aEligible = this.isPrizeEligible(a.entry_id) ? 1 : 0;
            const bEligible = this.isPrizeEligible(b.entry_id) ? 1 : 0;
            if (aEligible !== bEligible) return bEligible - aEligible;
            return b.month_total - a.month_total;
          });
          let curMonthlyRank = 1;
          let eligibleMonthlyCount = 0;
          let prevEligibleMonthTotal = null;
          monthlySorted.forEach((t) => {
            if (!this.isPrizeEligible(t.entry_id)) {
              t.rank = null;
              t.eligible_monthly_rank = null;
              return;
            }
            eligibleMonthlyCount++;
            if (prevEligibleMonthTotal !== null && t.month_total < prevEligibleMonthTotal) {
              curMonthlyRank = eligibleMonthlyCount;
            }
            prevEligibleMonthTotal = t.month_total;
            t.rank = curMonthlyRank;
            t.eligible_monthly_rank = curMonthlyRank;
          });

          const curMonthGWList = curMonth.gw_list || [];
          const curMonthIsFinished = (curMonthGWList.length > 0 && curMonthGWList.every(g => {
            const gd = this.data.gameweeks ? this.data.gameweeks[String(g)] : null;
            return gd && gd.is_finished;
          }));
          const curMonthIsStarted = curMonthGWList.some(g => {
            const gd = this.data.gameweeks ? this.data.gameweeks[String(g)] : null;
            return gd ? (gd.is_started !== undefined ? Boolean(gd.is_started) : (Boolean(gd.is_finished) || (gd.results && gd.results.some(r => r.points > 0)))) : false;
          });

          let curMonthBadge = '';
          if (curMonthIsFinished) {
            curMonthBadge = `<span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-display flex-shrink-0">จบการแข่งขันแล้ว</span>`;
          } else if (curMonthIsStarted) {
            curMonthBadge = `<span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-display flex-shrink-0 animate-pulse">กำลังแข่งขัน</span>`;
          } else {
            curMonthBadge = `<span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 font-display flex-shrink-0">รอการแข่งขัน</span>`;
          }

          let monthSelectorBtns = '';
          (this.config.monthly_schedule || []).forEach(m => {
            const isSel = (m.id === this.selectedMonthId);
            const mGWList = m.gw_list || [];
            const mFinished = (mGWList.length > 0 && mGWList.every(g => {
              const gd = this.data.gameweeks ? this.data.gameweeks[String(g)] : null;
              return gd && gd.is_finished;
            }));
            monthSelectorBtns += `
              <button 
                onclick="app.selectMonth(${m.id})"
                class="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-display ${isSel ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
              >
                ${m.month.split(' ')[0]} (${m.gws}) ${mFinished ? '✓' : ''}
              </button>
            `;
          });

          let monthlyTableRows = '';
          let hasRenderedMonthlyNonPrizeHeader = false;
          const eligibleMonthSorted = monthlySorted.filter(x => this.isPrizeEligible(x.entry_id) && x.month_total > 0);
          const topChampsInMonth = eligibleMonthSorted.filter(x => x.eligible_monthly_rank === 1);
          const topRunnersInMonth = eligibleMonthSorted.filter(x => x.eligible_monthly_rank === 2);
          const leaderCount = topChampsInMonth.length;
          const runnerCount = topRunnersInMonth.length;
          const splitChampAmt = leaderCount > 0 ? Math.floor((champPrize + (leaderCount > 1 ? runnerPrize : 0)) / leaderCount) : champPrize;
          const splitRunnerAmt = runnerCount > 0 ? Math.floor(runnerPrize / runnerCount) : runnerPrize;

          monthlySorted.forEach((t) => {
            const isEligible = this.isPrizeEligible(t.entry_id);

            if (!isEligible && !hasRenderedMonthlyNonPrizeHeader) {
              hasRenderedMonthlyNonPrizeHeader = true;
              monthlyTableRows += `
                <tr class="bg-slate-100/75 dark:bg-slate-800/60 border-y border-slate-200/80 dark:border-slate-700/80">
                  <td colspan="${curMonth.gw_list.length + 3}" class="py-2 px-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-display">
                    ทีมร่วมสนุก (ไม่นำมาคิดคำนวณเงินรางวัล)
                  </td>
                </tr>
              `;
            }
            const isLeader = isEligible && (t.eligible_monthly_rank === 1 && t.month_total > 0);
            const isRunnerUp = isEligible && (t.eligible_monthly_rank === 2 && t.month_total > 0);
            let rankBadge = '';
            let prizePill = '';

            if (!isEligible) {
              rankBadge = this.getNonPrizeRankBadge();
            } else if (isLeader) {
              rankBadge = '<span class="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black inline-flex items-center justify-center text-[10px] shadow-xs">1</span>';
              if (leaderCount > 1) {
                prizePill = `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-600/50 font-display flex-shrink-0">แชมป์ร่วม (หาร ${leaderCount}) ${splitChampAmt.toLocaleString()} THB</span>`;
              } else {
                prizePill = `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-600/50 font-display flex-shrink-0">แชมป์เดือน ${champPrize} THB</span>`;
              }
            } else if (isRunnerUp) {
              rankBadge = '<span class="w-5 h-5 rounded-full bg-slate-300 text-slate-900 font-black inline-flex items-center justify-center text-[10px] shadow-xs">2</span>';
              if (runnerCount > 1) {
                prizePill = `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-600/50 font-display flex-shrink-0">รองแชมป์ร่วม (หาร ${runnerCount}) ${splitRunnerAmt.toLocaleString()} THB</span>`;
              } else {
                prizePill = `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-600/50 font-display flex-shrink-0">รองแชมป์ ${runnerPrize} THB</span>`;
              }
            } else {
              rankBadge = `<span class="text-slate-500 font-bold">${t.rank}</span>`;
            }

            let scoreCols = '';
            curMonth.gw_list.forEach(gwNum => {
              const gData = this.data.gameweeks ? this.data.gameweeks[String(gwNum)] : null;
              const gIsStarted = gData ? (gData.is_started !== undefined ? Boolean(gData.is_started) : (Boolean(gData.is_finished) || (gData.results && gData.results.some(r => r.points > 0)))) : false;
              const pts = (gIsStarted && t.gw_scores[gwNum] !== undefined) ? t.gw_scores[gwNum] : '-';
              scoreCols += `<td class="py-2.5 px-2 text-center font-display text-xs text-slate-600 dark:text-slate-300">${pts}</td>`;
            });

            monthlyTableRows += `
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isLeader ? 'bg-amber-50/20 font-semibold' : (isRunnerUp ? 'bg-blue-50/20' : '')}">
                <td class="py-2.5 px-2 text-center font-display font-bold">${rankBadge}</td>
                <td class="py-2.5 px-2">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <button onclick="app.openTeamModal(${t.entry_id})" class="text-left font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-700 transition-colors cursor-pointer block">${this.escapeHtml(t.team_name)}</button>
                    ${prizePill}
                    ${this.getPrizeBadge(t.entry_id)}
                  </div>
                  <div class="text-[11px] text-slate-500">${this.escapeHtml(t.player_name)}</div>
                </td>
                ${scoreCols}
                <td class="py-2.5 px-2 text-right font-display font-black text-xs sm:text-sm ${isLeader ? 'text-amber-700 dark:text-amber-400 font-bold' : (isRunnerUp ? 'text-blue-700 dark:text-blue-400 font-bold' : 'text-slate-900 dark:text-slate-100')}">${t.month_total}</td>
              </tr>
            `;
          });

          let scheduleCards = '';
          (this.config.monthly_schedule || []).forEach(m => {
            const gwList = m.gw_list || [];
            let finishedGWCount = 0;
            let startedGWCount = 0;

            gwList.forEach(gNum => {
              const gData = this.data.gameweeks ? this.data.gameweeks[String(gNum)] : null;
              if (gData) {
                if (gData.is_finished) finishedGWCount++;
                const isSt = gData.is_started !== undefined ? Boolean(gData.is_started) : (Boolean(gData.is_finished) || (gData.results && gData.results.some(r => r.points > 0)));
                if (isSt) startedGWCount++;
              }
            });

            const isMonthFinished = (gwList.length > 0 && finishedGWCount === gwList.length);
            const isMonthOngoing = (!isMonthFinished && startedGWCount > 0);

            let badgeHtml = '';
            if (isMonthFinished) {
              badgeHtml = `<span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-display flex-shrink-0">จบการแข่งขันแล้ว</span>`;
            } else if (isMonthOngoing) {
              badgeHtml = `<span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-display flex-shrink-0 animate-pulse">กำลังแข่งขัน</span>`;
            } else {
              badgeHtml = `<span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 font-display flex-shrink-0">รอการแข่งขัน</span>`;
            }

            // Calculate team scores for this month
            const monthTeamMap = {};
            (this.data.teams || []).forEach(t => {
              monthTeamMap[t.entry_id] = {
                entry_id: t.entry_id,
                team_name: t.entry_name,
                player_name: t.player_name,
                total: 0
              };
            });

            if (startedGWCount > 0) {
              gwList.forEach(gNum => {
                const gData = this.data.gameweeks ? this.data.gameweeks[String(gNum)] : null;
                if (gData && gData.results) {
                  const isSt = gData.is_started !== undefined ? Boolean(gData.is_started) : (Boolean(gData.is_finished) || gData.results.some(r => r.points > 0));
                  if (isSt) {
                    gData.results.forEach(r => {
                      if (!monthTeamMap[r.entry_id]) {
                        monthTeamMap[r.entry_id] = { entry_id: r.entry_id, team_name: r.team_name, player_name: r.player_name, total: 0 };
                      }
                      monthTeamMap[r.entry_id].total += (r.net_points || 0);
                    });
                  }
                }
              });
            }

            const sortedMonthTeams = Object.values(monthTeamMap).sort((a, b) => b.total - a.total);
            const eligibleMonthTeams = sortedMonthTeams.filter(t => this.isPrizeEligible(t.entry_id));

            let winnersSummaryHtml = '';
            if (isMonthFinished && eligibleMonthTeams.length > 0 && eligibleMonthTeams[0].total > 0) {
              const topPts = eligibleMonthTeams[0].total;
              const topChamps = eligibleMonthTeams.filter(t => t.total === topPts);

              let champRows = '';
              let runnerRows = '';
              let totalPaidThisMonth = 0;

              if (topChamps.length > 1) {
                const splitAmt = Math.floor((champPrize + runnerPrize) / topChamps.length);
                totalPaidThisMonth = splitAmt * topChamps.length;
                champRows = topChamps.map(c => `
                  <div class="flex items-center justify-between text-xs py-0.5">
                    <div class="truncate pr-2">
                      <span class="font-bold text-amber-700 dark:text-amber-400">🥇 แชมป์ร่วม: ${this.escapeHtml(c.team_name)}</span>
                      <span class="text-[10px] text-slate-500">(${c.total} pts)</span>
                    </div>
                    <span class="font-bold font-display text-emerald-700 flex-shrink-0">${splitAmt.toLocaleString()} THB</span>
                  </div>
                `).join('');
              } else {
                const champ = topChamps[0];
                totalPaidThisMonth += champPrize;
                champRows = `
                  <div class="flex items-center justify-between text-xs py-0.5">
                    <div class="truncate pr-2">
                      <span class="font-bold text-amber-700 dark:text-amber-400">🥇 แชมป์เดือน: ${this.escapeHtml(champ.team_name)}</span>
                      <span class="text-[10px] text-slate-500">(${champ.total} pts)</span>
                    </div>
                    <span class="font-bold font-display text-emerald-700 flex-shrink-0">${champPrize.toLocaleString()} THB</span>
                  </div>
                `;

                const secondPts = eligibleMonthTeams.find(t => t.total < topPts)?.total;
                if (secondPts !== undefined && secondPts > 0) {
                  const topRunners = eligibleMonthTeams.filter(t => t.total === secondPts);
                  const isJointRunner = topRunners.length > 1;
                  const splitRunnerAmt = (runnerPrize / topRunners.length);
                  const splitRunnerDisplay = (topRunners.length > 1 && runnerPrize % topRunners.length !== 0)
                    ? `${splitRunnerAmt.toFixed(2)} THB`
                    : `${splitRunnerAmt.toLocaleString()} THB`;
                  totalPaidThisMonth += runnerPrize;
                  runnerRows = topRunners.map(r => `
                    <div class="flex items-center justify-between text-xs py-0.5">
                      <div class="truncate pr-2">
                        <span class="font-bold text-blue-700 dark:text-blue-400">🥈 ${isJointRunner ? `รองแชมป์ร่วม (หาร ${topRunners.length}):` : 'รองแชมป์:'} ${this.escapeHtml(r.team_name)}</span>
                        <span class="text-[10px] text-slate-500">(${r.total} pts)</span>
                      </div>
                      <span class="font-bold font-display text-emerald-700 flex-shrink-0">${splitRunnerDisplay}</span>
                    </div>
                  `).join('');
                }
              }

              winnersSummaryHtml = `
                <div class="mt-2.5 pt-2.5 border-t border-slate-200/80 space-y-1">
                  <div class="text-[10px] font-bold text-slate-500 uppercase font-display">สรุปทีมที่ได้รับเงินรางวัลประจำเดือน:</div>
                  ${champRows}
                  ${runnerRows}
                  <div class="flex items-center justify-between text-[11px] pt-1.5 border-t border-dashed border-slate-200 font-bold text-slate-800">
                    <span>ยอดเงินรางวัลรวมเดือนนี้</span>
                    <span class="text-emerald-700 font-display">${totalPaidThisMonth.toLocaleString()} THB</span>
                  </div>
                </div>
              `;
            } else if (isMonthOngoing && eligibleMonthTeams.length > 0 && eligibleMonthTeams[0].total > 0) {
              const curLead = eligibleMonthTeams[0];
              winnersSummaryHtml = `
                <div class="mt-2.5 pt-2.5 border-t border-slate-200/80 space-y-1">
                  <div class="text-[10px] font-bold text-emerald-700 uppercase font-display flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    ผู้นำคะแนนสดชิงรางวัล:
                  </div>
                  <div class="flex items-center justify-between text-xs py-0.5">
                    <span class="font-bold text-slate-900 truncate pr-2">${this.escapeHtml(curLead.team_name)}</span>
                    <span class="font-bold text-emerald-700 font-display flex-shrink-0">${curLead.total} pts</span>
                  </div>
                </div>
              `;
            } else {
              winnersSummaryHtml = `
                <div class="mt-2 text-[11px] text-slate-400 italic">
                  รอการแข่งขันในสัปดาห์ ${m.gws}
                </div>
              `;
            }

            scheduleCards += `
              <div class="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-1 gap-1">
                    <span class="text-xs font-bold text-slate-900 font-display">${m.month} (${m.gws})</span>
                    ${badgeHtml}
                  </div>
                  <div class="text-xs text-slate-500 mt-1">งบประมาณ: <strong class="text-slate-800 font-display">${m.budget}</strong></div>
                </div>
                ${winnersSummaryHtml}
              </div>
            `;
          });

          if (mainContainer) {
            mainContainer.innerHTML = `
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div class="glass-card rounded-2xl p-4 border border-slate-200">
                  <span class="text-[10px] uppercase font-bold text-slate-400 font-display">รางวัลประจำเดือน (10 เดือน)</span>
                  <div class="text-xl font-black text-slate-900 mt-1 font-display">${((feat.monthly_prize_amount || (champPrize + runnerPrize)) * 10).toLocaleString()} <span class="text-xs">THB</span></div>
                  <div class="text-xs text-slate-600 mt-0.5 font-medium">แชมป์ ${champPrize.toLocaleString()} / รอง ${runnerPrize.toLocaleString()} (ส.ค. - พ.ค.)</div>
                </div>

                <div class="glass-card rounded-2xl p-4 border border-slate-200">
                  <span class="text-[10px] uppercase font-bold text-slate-400 font-display">รางวัลประจำฤดูกาล (5 อันดับ)</span>
                  <div class="text-xl font-black text-slate-900 mt-1 font-display">13,500 <span class="text-xs">THB</span></div>
                  <div class="text-xs text-slate-600 mt-0.5 font-medium">อันดับ 1-5 (5k / 3.5k / 2.5k / 1.5k / 1k)</div>
                </div>

                <div class="glass-card rounded-2xl p-4 border border-slate-200">
                  <span class="text-[10px] uppercase font-bold text-slate-400 font-display">แชมป์ฟุตบอลถ้วย (CUP)</span>
                  <div class="text-xl font-black text-amber-600 mt-1 font-display">3,000 <span class="text-xs">THB</span></div>
                  <div class="text-xs text-slate-600 mt-0.5 font-medium">วัดผลคะแนนหากตกรอบพร้อมกัน</div>
                </div>

                <div class="glass-card rounded-2xl p-4 border border-slate-200">
                  <span class="text-[10px] uppercase font-bold text-slate-400 font-display">บริจาคการกุศล</span>
                  <div class="text-xl font-black text-rose-600 mt-1 font-display">9,500 <span class="text-xs">THB</span></div>
                  <div class="text-xs text-slate-600 mt-0.5 font-medium">ร่วมบริจาคทำบุญให้แก่โรงพยาบาล</div>
                </div>
              </div>

              <div class="text-right text-[11px] text-slate-400 -mt-1 font-medium">
                *** เงินรางวัลอาจมีการเพิ่มเติม ถ้าในระหว่างสิบเดือนของฤดูกาล มีผู้ลงเล่นประจำเดือน
              </div>

              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200">
                <div class="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 mb-3 gap-2">
                  <div>
                    <span class="text-[10px] uppercase font-bold text-slate-500 font-display">MONTHLY STANDINGS LEADERBOARD</span>
                    <h3 class="text-sm sm:text-base font-bold text-slate-900 font-display">ตารางคะแนนประจำเดือน: ${curMonth.month} (${curMonth.gws})</h3>
                  </div>
                  ${curMonthBadge}
                </div>

                <div class="flex space-x-1.5 overflow-x-auto touch-scroll no-scrollbar pb-2.5 mb-2 border-b border-slate-100">
                  ${monthSelectorBtns}
                </div>

                <div class="overflow-x-auto no-scrollbar -mx-4 sm:mx-0 touch-scroll">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="border-b border-slate-100 text-[11px] font-bold text-slate-400 font-display bg-slate-50/50">
                        <th class="py-2 px-2 text-center w-8">#</th>
                        <th class="py-2 px-2">ทีม & ผู้จัดการ</th>
                        ${curMonth.gw_list.map(g => `<th class="py-2 px-2 text-center">GW ${g}</th>`).join('')}
                        <th class="py-2 px-2 text-right">แต้มรวมเดือน</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-xs sm:text-sm">
                      ${monthlyTableRows}
                    </tbody>
                    <tfoot class="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 font-display text-xs sm:text-sm font-bold">
                      <tr>
                        <td colspan="2" class="py-3 px-2 sm:px-3 text-slate-700 dark:text-slate-300">
                          <div class="flex items-center gap-1.5 flex-wrap">
                            <span>งบประมาณรางวัลประจำเดือน: ${curMonth.month}</span>
                            <span class="text-[11px] font-normal text-slate-500 font-display">(${curMonthIsFinished ? 'มอบรางวัลเรียบร้อย' : (curMonthIsStarted ? 'กำลังแข่งขัน' : 'รอการแข่งขัน')})</span>
                          </div>
                        </td>
                        <td colspan="${curMonth.gw_list.length}" class="py-3 px-2 text-center text-[11px] text-slate-500 font-normal">
                          แชมป์ ${champPrize.toLocaleString()} THB • รองแชมป์ ${runnerPrize.toLocaleString()} THB
                        </td>
                        <td class="py-3 px-2 sm:px-3 text-right font-black text-emerald-600 dark:text-emerald-400">${(feat.monthly_prize_amount || (champPrize + runnerPrize)).toLocaleString()} THB</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200">
                <h3 class="text-sm sm:text-base font-bold text-slate-900 mb-3 font-display">กำหนดการแข่งขันประจำเดือนทั้ง 10 เดือน (งบ ${totalMonthly})</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  ${scheduleCards}
                </div>
              </div>
            `;
          }
        }
      }

      selectMonth(monthId) {
        this.selectedMonthId = monthId;
        this.renderPrizesView();
      }

      renderHallOfFameView() {
        const recordsContainer = document.getElementById('hall-of-fame-records');
        const tableBody = document.getElementById('hall-of-fame-table-body');
        const hofColWins = document.getElementById('hof-col-wins');
        const maxGW = Number(this.multiData.max_gw) || 2;

        if (hofColWins) hofColWins.innerHTML = '<span class="sm:hidden">#1 GW</span><span class="hidden sm:inline">#1 GAMEWEEK</span>';

        let highGW = { score: 0, team: '-', gw: 1 };
        let bestBench = { bench: 0, team: '-', gw: 1 };

        const teamStats = {};
        (this.data.teams || []).forEach(t => {
          teamStats[t.entry_id] = {
            entry_id: t.entry_id,
            team_name: t.entry_name,
            player_name: t.player_name,
            total_net: 0,
            scores: [],
            total_hits: 0,
            wins: 0,
            top3: 0
          };
        });

        for (let g = 1; g <= maxGW; g++) {
          const gData = this.data.gameweeks ? this.data.gameweeks[String(g)] : null;
          if (gData && gData.results) {
            const gIsStarted = gData.is_started !== undefined 
              ? Boolean(gData.is_started) 
              : (Boolean(gData.is_finished) || gData.results.some(r => r.points > 0));

            // Cumulative transfer hits are locked in at deadline; accumulate for all started gameweeks
            if (gIsStarted) {
              gData.results.forEach(r => {
                if (!teamStats[r.entry_id]) {
                  teamStats[r.entry_id] = {
                    entry_id: r.entry_id,
                    team_name: r.team_name,
                    player_name: r.player_name,
                    total_net: 0,
                    scores: [],
                    total_hits: 0,
                    wins: 0,
                    top3: 0
                  };
                }
                teamStats[r.entry_id].total_hits += (r.hits || 0);
              });
            }

            // Gameweek performance records, averages, highs/lows, and wins are evaluated only for finished gameweeks
            if (gData.is_finished) {
              const eligibleResults = gData.results.filter(r => this.isPrizeEligible(r.entry_id));
              const eligibleSorted = [...eligibleResults].sort((a, b) => b.net_points - a.net_points);
              const highEligiblePts = eligibleSorted.length > 0 ? eligibleSorted[0].net_points : 0;
              const topEligibleWinners = eligibleSorted.filter(x => x.net_points === highEligiblePts);
              const winCredit = topEligibleWinners.length > 0 ? 1 / topEligibleWinners.length : 0;

              const sorted = [...gData.results].sort((a, b) => b.net_points - a.net_points);
              sorted.forEach((r, idx) => {
                if (!teamStats[r.entry_id]) {
                  teamStats[r.entry_id] = {
                    entry_id: r.entry_id,
                    team_name: r.team_name,
                    player_name: r.player_name,
                    total_net: 0,
                    scores: [],
                    total_hits: 0,
                    wins: 0,
                    top3: 0
                  };
                }
                const ts = teamStats[r.entry_id];
                ts.total_net += r.net_points;
                ts.scores.push(r.net_points);
                if (this.isPrizeEligible(r.entry_id) && r.net_points === highEligiblePts) {
                  ts.wins += winCredit;
                }
                if (idx < 3) ts.top3 += 1;

                if (r.net_points > highGW.score) {
                  highGW = { score: r.net_points, team: r.team_name, gw: g };
                }
                if (r.bench_points > bestBench.bench) {
                  bestBench = { bench: r.bench_points, team: r.team_name, gw: g };
                }
              });
            }
          }
        }

        const sortedStats = Object.values(teamStats).sort((a, b) => b.total_net - a.total_net);
        const overallTopLeader = sortedStats[0] || { team_name: '-', total_net: 0, scores: [0] };
        const eligibleSortedStats = sortedStats.filter(t => this.isPrizeEligible(t.entry_id));
        const eligibleLeader = eligibleSortedStats[0] || overallTopLeader;
        const leader = eligibleLeader;
        const isNonPrizeOverallLead = (overallTopLeader.entry_id !== eligibleLeader.entry_id);

        // Accurately compute team(s) with most GW #1 finishes (prize eligible only)
        let mostWinsCount = 0;
        let mostWinsTeams = [];
        sortedStats.forEach(t => {
          if (this.isPrizeEligible(t.entry_id)) {
            if (t.wins > mostWinsCount) {
              mostWinsCount = t.wins;
              mostWinsTeams = [t.team_name];
            } else if (t.wins === mostWinsCount && t.wins > 0) {
              mostWinsTeams.push(t.team_name);
            }
          }
        });
        const mostWinsDisplay = (mostWinsCount % 1 === 0) ? mostWinsCount : mostWinsCount.toFixed(1);
        const mostWinsName = mostWinsTeams.length > 0 ? mostWinsTeams.join(', ') : '-';

        if (recordsContainer) {
          recordsContainer.innerHTML = `
            <div class="glass-card rounded-2xl p-4 border border-slate-200">
              <span class="text-[10px] uppercase font-bold text-slate-400 block font-display">แต้มสูงสุดใน 1 วีค</span>
              <div class="text-xl font-black text-slate-900 mt-1 font-display">${highGW.score} <span class="text-xs">PTS</span></div>
              <div class="text-xs font-bold text-slate-700 truncate mt-0.5">${this.escapeHtml(highGW.team)}</div>
              <div class="text-[10px] text-slate-500 font-display">Gameweek ${highGW.gw}</div>
            </div>

            <div class="glass-card rounded-2xl p-4 border border-slate-200">
              <span class="text-[10px] uppercase font-bold text-slate-400 block font-display">ครองอันดับ 1 มากที่สุด</span>
              <div class="text-xl font-black text-slate-900 mt-1 font-display">${mostWinsDisplay} <span class="text-xs">ครั้ง</span></div>
              <div class="text-xs font-bold text-slate-700 truncate mt-0.5">${this.escapeHtml(mostWinsName)}</div>
              <div class="text-[10px] text-slate-500 font-display">ตลอดฤดูกาล (ชิงเงินรางวัล)</div>
            </div>

            <div class="glass-card rounded-2xl p-4 border border-slate-200">
              <span class="text-[10px] uppercase font-bold text-slate-400 block font-display">จ่าฝูงคะแนนรวม (ชิงรางวัล)</span>
              <div class="text-xl font-black text-slate-900 mt-1 font-display">${leader.total_net} <span class="text-xs">PTS</span></div>
              <div class="text-xs font-bold text-slate-700 truncate mt-0.5">${this.escapeHtml(leader.team_name)}</div>
              <div class="text-[10px] text-slate-500 font-display">${isNonPrizeOverallLead ? `*ทีมร่วมสนุกนำ: ${this.escapeHtml(overallTopLeader.team_name)} (${overallTopLeader.total_net} pts)` : `เฉลี่ย ${(leader.total_net / Math.max(leader.scores.length, 1)).toFixed(1)} pts/GW`}</div>
            </div>

            <div class="glass-card rounded-2xl p-4 border border-slate-200">
              <span class="text-[10px] uppercase font-bold text-slate-400 block font-display">แต้มสำรองสูงสุด 1 วีค</span>
              <div class="text-xl font-black text-slate-900 mt-1 font-display">${bestBench.bench} <span class="text-xs">PTS</span></div>
              <div class="text-xs font-bold text-slate-700 truncate mt-0.5">${this.escapeHtml(bestBench.team)}</div>
              <div class="text-[10px] text-slate-500 font-display">Gameweek ${bestBench.gw}</div>
            </div>
          `;
        }

        if (tableBody) {
          let html = '';
          let curHofRank = 1;
          let eligibleCount = 0;
          let prevHofTotal = null;
          sortedStats.forEach((t) => {
            const isPrize = this.isPrizeEligible(t.entry_id);
            if (!isPrize) {
              t.hof_rank = null;
              return;
            }
            eligibleCount++;
            if (prevHofTotal !== null && t.total_net < prevHofTotal) {
              curHofRank = eligibleCount;
            }
            prevHofTotal = t.total_net;
            t.hof_rank = curHofRank;
          });

          sortedStats.forEach((t) => {
            const isPrize = this.isPrizeEligible(t.entry_id);
            const rankBadge = isPrize 
              ? `<span class="text-slate-500 font-bold">${t.hof_rank}</span>` 
              : this.getNonPrizeRankBadge();
            const avg = t.scores.length > 0 ? (t.total_net / t.scores.length).toFixed(1) : '-';
            const high = t.scores.length > 0 ? Math.max(...t.scores) : '-';
            const low = t.scores.length > 0 ? Math.min(...t.scores) : '-';
            const top3Rate = t.scores.length > 0 ? ((t.top3 / t.scores.length) * 100).toFixed(0) : '0';
            const winsDisp = (t.wins % 1 === 0) ? t.wins : t.wins.toFixed(1);

            html += `
              <tr class="hover:bg-slate-50 transition-colors">
                <td class="py-2.5 px-1 sm:px-2 text-center font-display font-bold text-slate-500 whitespace-nowrap">${rankBadge}</td>
                <td class="py-2.5 px-1.5 sm:px-3 min-w-0">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <button onclick="app.openTeamModal(${t.entry_id})" class="text-left font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-700 transition-colors cursor-pointer block truncate">${this.escapeHtml(t.team_name)}</button>
                    ${this.getPrizeBadge(t.entry_id)}
                  </div>
                  <div class="text-[10px] sm:text-[11px] text-slate-500 truncate">${this.escapeHtml(t.player_name || '')}</div>
                </td>
                <td class="py-2.5 px-1 sm:px-2 text-center font-display font-bold text-slate-800 whitespace-nowrap">${winsDisp}</td>
                <td class="py-2.5 px-1 sm:px-2 text-center font-display font-black text-slate-900 whitespace-nowrap">${avg}</td>
                <td class="py-2.5 px-1 sm:px-2 text-center font-display text-emerald-600 font-bold whitespace-nowrap">${high}</td>
                <td class="py-2.5 px-1 sm:px-2 text-center font-display text-slate-500 whitespace-nowrap">${low}</td>
                <td class="py-2.5 px-1.5 sm:px-3 text-right font-display whitespace-nowrap ${t.total_hits > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'}">${t.total_hits > 0 ? `-${t.total_hits}` : '-'}</td>
              </tr>
            `;
          });
          tableBody.innerHTML = html;
        }
      }

      renderCupView() {
        const titleEl = document.getElementById('cup-title');
        const subEl = document.getElementById('cup-subtitle');
        const prizeBadge = document.getElementById('cup-prize-badge');
        const container = document.getElementById('cup-tournament-container');

        const feat = (this.config && this.config.features) || {};
        const hasCup = Boolean(feat.has_cup);
        if (!hasCup) return;

        const champPrize = feat.cup_champion_prize;
        const runnerPrize = feat.cup_runner_up_prize;
        const startGW = feat.cup_start_gw;

        if (prizeBadge) {
          if (champPrize && runnerPrize) {
            prizeBadge.innerText = `${champPrize} + ${runnerPrize} PRIZE`;
          } else if (champPrize) {
            prizeBadge.innerText = `${champPrize} PRIZE`;
          } else {
            prizeBadge.innerText = 'CUP TOURNAMENT';
          }
        }

        if (container) {
          let prizeCardsHtml = '';
          if (champPrize && runnerPrize) {
            prizeCardsHtml = `
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="glass-card rounded-2xl p-5 border border-slate-200">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-black font-display shadow-md">🏆</div>
                    <div>
                      <span class="text-xs uppercase font-bold text-amber-700 font-display">CUP CHAMPION</span>
                      <h3 class="text-lg font-bold text-slate-900">แชมป์ฟุตบอลถ้วย (CUP)</h3>
                      <div class="text-sm font-black text-emerald-600 font-display mt-0.5">${champPrize}</div>
                    </div>
                  </div>
                </div>

                <div class="glass-card rounded-2xl p-5 border border-slate-200">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl bg-slate-200 text-slate-900 flex items-center justify-center text-2xl font-black font-display shadow-md">🥈</div>
                    <div>
                      <span class="text-xs uppercase font-bold text-slate-600 font-display">RUNNER-UP</span>
                      <h3 class="text-lg font-bold text-slate-900">รองแชมป์ฟุตบอลถ้วย (CUP)</h3>
                      <div class="text-sm font-black text-emerald-600 font-display mt-0.5">${runnerPrize}</div>
                    </div>
                  </div>
                </div>
              </div>
            `;
          } else if (champPrize) {
            const cupNote = feat.cup_rule_note || '';
            prizeCardsHtml = `
              <div class="glass-card rounded-2xl p-5 border border-slate-200">
                <div class="flex items-center gap-3.5">
                  <div class="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-black font-display shadow-md">🏆</div>
                  <div>
                    <span class="text-xs uppercase font-bold text-amber-700 font-display">MINI-LEAGUE CUP CHAMPION</span>
                    <h3 class="text-lg font-bold text-slate-900">แชมป์ลีคคัพ ${startGW ? `(เริ่ม Gameweek ${startGW})` : ''}</h3>
                    <div class="text-sm font-black text-emerald-600 font-display mt-0.5">${champPrize}</div>
                    ${cupNote ? `<p class="text-xs text-amber-600 font-semibold mt-1">* ${cupNote}</p>` : ''}
                    ${startGW ? `<p class="text-xs text-slate-500 mt-1">* เริ่มแข่งขันใน Gameweek ${startGW} (สงวนสิทธิ์เฉพาะทีมที่ชำระค่าสมัครครบถ้วน)</p>` : ''}
                  </div>
                </div>
              </div>
            `;
          } else {
            prizeCardsHtml = `
              <div class="glass-card rounded-2xl p-5 border border-slate-200">
                <div class="flex items-center gap-3.5">
                  <div class="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-black font-display shadow-md">🏆</div>
                  <div>
                    <span class="text-xs uppercase font-bold text-amber-700 font-display">${this.escapeHtml(this.data.name || 'MINI-LEAGUE')} CUP</span>
                    <h3 class="text-lg font-bold text-slate-900">รางวัลผู้ชนะ Cup (บอลถ้วย)</h3>
                    <p class="text-xs text-slate-600 mt-0.5">รอสรุปสัปดาห์ที่เริ่มแข่งขัน และจัดสรรเงินรางวัลตามยอดสมัคร</p>
                  </div>
                </div>
              </div>
            `;
          }

          const gwInfoText = startGW 
            ? `ระบบ Official FPL Cup จะเริ่มจัดประกบคู่แข่งขันแบบแพ้คัดออกอัตโนมัติในสัปดาห์ที่ ${startGW} สมาชิกที่ชนะในแต่ละรอบจะผ่านเข้าสู่รอบต่อไปจนถึงรอบชิงชนะเลิศ`
            : `ระบบ Official FPL Cup จะทำการจับคู่รอบ Knockout อัตโนมัติเมื่อถึงสัปดาห์ที่กำหนด สมาชิกที่ชนะในแต่ละสัปดาห์จะผ่านเข้าสู่รอบต่อไป`;

          container.innerHTML = `
            ${prizeCardsHtml}
            <div class="glass-card rounded-2xl p-5 border border-slate-200 text-center py-8">
              <div class="text-3xl mb-2">⚔️</div>
              <h4 class="text-base font-bold text-slate-900">รอบการแข่งขัน Knockout Cup ${startGW ? `(เริ่ม GW ${startGW})` : ''}</h4>
              <p class="text-xs text-slate-500 mt-1 max-w-md mx-auto">${gwInfoText}</p>
            </div>
          `;
        }
      }

      renderRulesView() {
        const titleEl = document.getElementById('rules-header-title');
        const descEl = document.getElementById('rules-header-desc');
        const badgeEl = document.getElementById('rules-header-badge');
        const cardsContainer = document.getElementById('rules-cards-container');

        if (titleEl) titleEl.innerText = `กติกาแฟนตาซี ${this.data.name} (${this.data.season || '2026/27'})`;
        const nonPrizeCount = (this.config && this.config.non_prize_teams) ? this.config.non_prize_teams.length : 0;
        const totalTeams = (this.data.teams || []).length;
        const prizeTeamsCount = totalTeams - nonPrizeCount;
        const teamDesc = nonPrizeCount > 0 
          ? `สมาชิก ${totalTeams} ทีม (ชิงรางวัล ${prizeTeamsCount} ทีม, ร่วมสนุก ${nonPrizeCount} ทีม)`
          : `สมาชิก ${totalTeams} ทีม`;
        if (descEl) descEl.innerHTML = `LEAGUE ID: <strong class="text-slate-800">${this.activeLeagueId}</strong> | ${teamDesc} | ค่าสมัคร: ${this.config.entry_fee} | กองกลาง: <strong>${this.config.total_pool}</strong>`;
        if (badgeEl) badgeEl.innerText = this.config.total_pool || 'OFFICIAL RULES';

        if (cardsContainer && this.config.rules_cards) {
          let html = '';
          this.config.rules_cards.forEach((card, idx) => {
            let itemsHtml = '';
            card.items.forEach(item => {
              itemsHtml += `
                <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <strong class="text-slate-900 block mb-0.5">• ${item.label}:</strong>
                  <span>${item.desc}</span>
                </div>
              `;
            });

            html += `
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <div class="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                    <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center font-display">${idx + 1}</span>
                    <h3 class="font-bold text-slate-900 text-sm">${card.title}</h3>
                  </div>
                  <div class="space-y-2 text-xs text-slate-600">
                    ${itemsHtml}
                  </div>
                </div>
                <div class="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  ${card.footer || ''}
                </div>
              </div>
            `;
          });
          cardsContainer.innerHTML = html;
        }
      }

      getPlayerShirtUrl(p) {
        const isGk = (p.pos === 'GKP');
        const teamCode = p.team_code || FPL_TEAM_CODES[p.team] || 0;
        const suffix = isGk ? '_1-66.webp' : '-66.webp';

        // For HTTP/HTTPS, compute root-relative URL for 100% rock-solid asset resolution
        if (window.location && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
          const isGitHubPages = window.location.pathname.includes('/fpl-mini');
          const basePath = isGitHubPages ? '/fpl-mini/' : '/';
          return `${basePath}images/shirts/shirt_${teamCode}${suffix}`;
        }

        // For local file:// protocol:
        const configuredIds = Object.keys(this.configs || {});
        const inSubdir = Boolean(window.location && window.location.pathname && (
          configuredIds.some(lid => window.location.pathname.includes('/' + lid + '/') || window.location.pathname.endsWith('/' + lid))
        ));
        const prefix = inSubdir ? '../' : './';
        return `${prefix}images/shirts/shirt_${teamCode}${suffix}`;
      }

      openTeamModal(entryId) {
        const entryIdNum = Number(entryId);
        let teamObj = (this.data.teams || []).find(t => Number(t.entry_id) === entryIdNum);
        if (!teamObj && this.multiData && this.multiData.leagues) {
          for (const l of Object.values(this.multiData.leagues)) {
            const found = (l.teams || []).find(t => Number(t.entry_id) === entryIdNum);
            if (found) {
              teamObj = found;
              break;
            }
          }
        }
        teamObj = teamObj || {};

        let gwResults = ((this.data.gameweeks || {})[String(this.selectedGW)] || {}).results || [];
        let matchdayRes = gwResults.find(r => Number(r.entry_id) === entryIdNum);
        if (!matchdayRes && this.multiData && this.multiData.leagues) {
          for (const l of Object.values(this.multiData.leagues)) {
            const gr = ((l.gameweeks || {})[String(this.selectedGW)] || {}).results || [];
            const found = gr.find(r => Number(r.entry_id) === entryIdNum);
            if (found) {
              matchdayRes = found;
              break;
            }
          }
        }
        matchdayRes = matchdayRes || {};

        const titleEl = document.getElementById('team-modal-title');
        if (titleEl) titleEl.innerText = teamObj.entry_name || matchdayRes.team_name || 'ชื่อทีม';

        const managerEl = document.getElementById('team-modal-manager');
        if (managerEl) managerEl.innerText = `ผู้จัดการ: ${teamObj.player_name || matchdayRes.player_name || '-'}`;

        const ptsEl = document.getElementById('team-modal-pts');
        if (ptsEl) ptsEl.innerText = `แต้ม GW ${this.selectedGW}: ${matchdayRes.net_points !== undefined ? matchdayRes.net_points : 0} pts`;

        const chipBadge = document.getElementById('team-modal-chip-badge');
        if (chipBadge) {
          if (matchdayRes.chip) {
            chipBadge.className = `chip-badge badge-${matchdayRes.chip.toLowerCase()} font-display`;
            chipBadge.innerText = matchdayRes.chip.toUpperCase();
            chipBadge.classList.remove('hidden');
          } else {
            chipBadge.classList.add('hidden');
          }
        }

        const squadKey = `${entryIdNum}_${this.selectedGW}`;
        let squad = (this.data.squads || {})[squadKey];
        if (!squad && this.multiData && this.multiData.leagues) {
          for (const l of Object.values(this.multiData.leagues)) {
            if (l.squads && l.squads[squadKey]) {
              squad = l.squads[squadKey];
              break;
            }
          }
        }

        const gkpLine = document.getElementById('pitch-line-gkp');
        const defLine = document.getElementById('pitch-line-def');
        const midLine = document.getElementById('pitch-line-mid');
        const fwdLine = document.getElementById('pitch-line-fwd');
        const benchContainer = document.getElementById('team-bench-container');
        const benchTotal = document.getElementById('team-modal-bench-total');
        const formationEl = document.getElementById('team-modal-formation');

        if (!squad || !squad.starting || squad.starting.length === 0) {
          if (formationEl) formationEl.innerText = 'แผน: -';
          if (gkpLine) gkpLine.innerHTML = '';
          const emptyMsg = (squad && squad.dnp) 
            ? `ทีมนี้เข้าร่วมการแข่งขันหลังจากสัปดาห์นี้ (ไม่ได้ส่งทีมใน GW ${this.selectedGW})`
            : 'ยังไม่มีข้อมูลแผนการจัดทัพในสัปดาห์นี้';
          if (defLine) defLine.innerHTML = `<div class="text-center text-white/80 py-8 font-bold text-xs w-full">${emptyMsg}</div>`;
          if (midLine) midLine.innerHTML = '';
          if (fwdLine) fwdLine.innerHTML = '';
          if (benchContainer) benchContainer.innerHTML = '<div class="text-center text-slate-400 py-4 col-span-2 text-xs">ไม่มีข้อมูลตัวสำรอง</div>';
          if (benchTotal) benchTotal.innerHTML = '';
          const modal = document.getElementById('team-modal');
          if (modal) modal.classList.remove('hidden');
          return;
        }

        if (squad && squad.starting) {
          const gks = squad.starting.filter(p => p.pos === 'GKP');
          const defs = squad.starting.filter(p => p.pos === 'DEF');
          const mids = squad.starting.filter(p => p.pos === 'MID');
          const fwds = squad.starting.filter(p => p.pos === 'FWD');

          if (formationEl) {
            formationEl.innerText = `แผน: ${defs.length}-${mids.length}-${fwds.length}`;
          }

          const renderPlayerCard = (p, count) => {
            const isCap = Boolean(p.is_captain);
            const isVice = Boolean(p.is_vice);
            const shirtUrl = this.getPlayerShirtUrl(p);

            return `
              <div class="flex flex-col items-center justify-center p-0.5 text-center flex-shrink-0 transition-transform active:scale-95 group" style="width: ${100 / Math.max(count, 3)}%; max-width: 76px;">
                <div class="relative flex items-center justify-center mb-0.5">
                  <img 
                    src="${shirtUrl}" 
                    alt="${this.escapeHtml(p.team || '')}" 
                    width="44"
                    height="52"
                    decoding="async"
                    class="w-9 h-10 sm:w-11 sm:h-12 md:w-12 md:h-14 object-contain drop-shadow-md transition-transform group-hover:scale-105"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_0-66.webp';"
                  />
                  ${isCap ? '<span class="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-[8px] sm:text-[9px] w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex items-center justify-center font-display shadow-md border border-amber-300 animate-pulse z-10">C</span>' : ''}
                  ${isVice ? '<span class="absolute -top-1 -right-1 bg-slate-200 text-slate-950 font-black text-[8px] sm:text-[9px] w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex items-center justify-center font-display shadow-md border border-slate-300 z-10">V</span>' : ''}
                </div>

                <div class="bg-slate-950/90 text-white font-bold text-[9px] sm:text-[10px] px-1 py-0.5 rounded shadow-sm w-full truncate text-center border border-white/10 leading-tight">
                  ${this.escapeHtml(p.name)}
                </div>

                <div class="bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-[8.5px] sm:text-[9.5px] font-black font-display px-1.5 py-0.2 rounded mt-0.5 shadow-xs">
                  ${p.points} pts
                </div>
              </div>
            `;
          };

          if (gkpLine) gkpLine.innerHTML = gks.map(p => renderPlayerCard(p, gks.length)).join('');
          if (defLine) defLine.innerHTML = defs.map(p => renderPlayerCard(p, defs.length)).join('');
          if (midLine) midLine.innerHTML = mids.map(p => renderPlayerCard(p, mids.length)).join('');
          if (fwdLine) fwdLine.innerHTML = fwds.map(p => renderPlayerCard(p, fwds.length)).join('');
        }

        if (squad && squad.bench) {
          let bPoints = 0;
          let bHtml = '';
          squad.bench.forEach(p => {
            bPoints += (p.points || 0);
            const shirtUrl = this.getPlayerShirtUrl(p);
            bHtml += `
              <div class="bg-white border border-slate-200 rounded-xl p-2 sm:p-2.5 flex items-center justify-between shadow-xs hover:border-slate-300 transition-colors">
                <div class="flex items-center gap-2 min-w-0 pr-2">
                  <img 
                    src="${shirtUrl}" 
                    alt="${this.escapeHtml(p.team || '')}" 
                    width="28"
                    height="32"
                    decoding="async"
                    class="w-6 h-7 sm:w-7 sm:h-8 object-contain drop-shadow-xs flex-shrink-0"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_0-66.webp';"
                  />
                  <span class="text-[9px] sm:text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md font-display flex-shrink-0">${p.pos}</span>
                  <span class="text-xs sm:text-sm font-bold text-slate-900 truncate">${this.escapeHtml(p.name)}</span>
                </div>
                <span class="text-xs sm:text-xs font-bold text-slate-700 font-display flex-shrink-0 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">${p.points} pts</span>
              </div>
            `;
          });
          if (benchContainer) benchContainer.innerHTML = bHtml;
          if (benchTotal) {
            const isBBoost = ['bboost', 'bench_boost'].includes((matchdayRes.chip || '').toLowerCase());
            benchTotal.innerHTML = isBBoost 
              ? `<span class="text-emerald-600 font-bold">รวม ${bPoints} pts (⚡ Bench Boost นับแต้ม)</span>`
              : `รวม ${bPoints} pts`;
          }
        }

        const modal = document.getElementById('team-modal');
        if (modal) modal.classList.remove('hidden');
      }

      closeTeamModal() {
        const modal = document.getElementById('team-modal');
        if (modal) modal.classList.add('hidden');
      }

      regenerateLiveNote() {
        const gw = this.selectedGW;
        const gwData = this.data.gameweeks ? this.data.gameweeks[String(gw)] : null;
        const nonPrizeList = (this.config && this.config.non_prize_teams) || [];
        const isWeeklyPrize = (this.config && this.config.features && this.config.features.prize_model === 'weekly');
        const newNote = LiveCommentaryEngine.generateFreshNote(gw, gwData, this.data.name, true, nonPrizeList, this.data, isWeeklyPrize);
        const cacheKey = `${this.activeLeagueId}_${gw}`;
        this.liveNotesCache[cacheKey] = newNote;
        
        const noteEl = document.getElementById('current-gw-note-text');
        if (noteEl) {
          noteEl.innerHTML = newNote;
        }
      }

      copyHighlightQuote() {
        const noteEl = document.getElementById('current-gw-note-text');
        if (!noteEl) return;
        const text = noteEl.innerText.replace(/^"|"$/g, '').trim();
        if (!text) return;

        if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => this.showQuoteCopyIndicator()).catch(() => this.fallbackCopyQuote(text));
        } else {
          this.fallbackCopyQuote(text);
        }
      }

      fallbackCopyQuote(text) {
        if (typeof document !== 'undefined') {
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try {
            document.execCommand('copy');
            this.showQuoteCopyIndicator();
          } catch (e) {}
          document.body.removeChild(ta);
        }
      }

      showQuoteCopyIndicator() {
        const ind = document.getElementById('quote-copy-indicator');
        if (ind) {
          ind.innerText = 'Copied!';
          ind.classList.remove('opacity-0');
          setTimeout(() => {
            ind.classList.add('opacity-0');
          }, 1800);
        }

        // Mobile on-screen notification toast
        let toast = document.getElementById('global-copied-toast');
        if (!toast) {
          toast = document.createElement('div');
          toast.id = 'global-copied-toast';
          toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white font-bold text-xs px-4 py-2 rounded-full shadow-2xl border border-slate-700/80 z-50 flex items-center gap-1.5 transition-all duration-200 opacity-0 pointer-events-none translate-y-2 backdrop-blur-xs font-display';
          toast.innerHTML = '<svg class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg><span>Copied!</span>';
          document.body.appendChild(toast);
        }

        toast.classList.remove('opacity-0', 'translate-y-2');
        toast.classList.add('opacity-100', 'translate-y-0');
        setTimeout(() => {
          toast.classList.remove('opacity-100', 'translate-y-0');
          toast.classList.add('opacity-0', 'translate-y-2');
        }, 1600);
      }

      shareCurrentGameweek() {
        try {
          const gwKey = String(this.selectedGW || 2);
          const gwData = (this.data && this.data.gameweeks) ? (this.data.gameweeks[gwKey] || this.data.gameweeks[this.selectedGW]) : null;
          if (!gwData || !gwData.results || gwData.results.length === 0) {
            if (typeof alert !== 'undefined') alert('กำลังโหลดข้อมูล Gameweek กรุณาลองใหม่อีกครั้ง');
            return;
          }

          const isWeekly = (this.config && this.config.features && this.config.features.prize_model === 'weekly');
          const isFinished = Boolean(gwData.is_finished);
          const scoreProp = (isFinished || isWeekly) ? 'net_points' : 'points';
          const sorted = [...gwData.results].sort((a, b) => (b[scoreProp] - a[scoreProp]) || (b.net_points - a.net_points) || (b.points - a.points));
          const eligibleResults = sorted.filter(r => this.isPrizeEligible(r.entry_id));
          const eligibleHighestScore = eligibleResults.length > 0 ? eligibleResults[0][scoreProp] : 0;
          const eligibleWinners = eligibleResults.filter(r => r[scoreProp] === eligibleHighestScore);
          const isJointPrize = eligibleWinners.length > 1;
          const overallTop = sorted[0];
          const prizeLeader = eligibleWinners[0] || overallTop;
          const hasPassedPrize = !this.isPrizeEligible(overallTop.entry_id) && eligibleWinners.length > 0 && overallTop[scoreProp] > prizeLeader[scoreProp];

          const noteEl = document.getElementById('current-gw-note-text');
          let currentLiveNote = noteEl ? noteEl.innerText.replace(/^"|"$/g, '').trim() : '';
          if (!currentLiveNote) {
            const nonPrizeList = (this.config && this.config.non_prize_teams) || [];
            const cacheKey = `${this.activeLeagueId}_${this.selectedGW}`;
            const rawHtmlNote = this.liveNotesCache[cacheKey] || LiveCommentaryEngine.generateFreshNote(this.selectedGW, gwData, this.data.name, false, nonPrizeList, this.data, isWeekly);
            currentLiveNote = String(rawHtmlNote).replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
          }

          let text = `${this.data.name} (League ${this.activeLeagueId})\n`;
          text += `สรุปผล Gameweek ${gwKey} (${isFinished ? 'จบการแข่งขัน' : 'กำลังแข่งขัน'})\n`;
          text += `----------------------------------------\n`;

          if (isFinished) {
            if (isWeekly) {
              if (hasPassedPrize) {
                text += `💡 หมายเหตุ: ทีม ${overallTop.team_name} ทำแต้มสูงสุดสัปดาห์นี้ (${overallTop.points} pts) แต่เป็นทีมร่วมสนุก จึงส่งมอบสิทธิ์เงินรางวัลประจำสัปดาห์ให้แก่ทีมถัดไป\n`;
              }
              if (isJointPrize) {
                const names = eligibleWinners.map(w => `${w.team_name} (${w.player_name})`).join(' & ');
                text += `🏆 แชมป์ร่วมประจำสัปดาห์ (${eligibleWinners.length} ทีม): ${names}\n`;
              } else {
                text += `🏆 แชมป์ประจำสัปดาห์: ${prizeLeader.team_name} (${prizeLeader.player_name})\n`;
              }
              const w0 = prizeLeader;
              const hitsStr = (w0.hits && w0.hits > 0) ? ` | แต้มลบ: -${w0.hits}` : '';
              text += `คะแนน: ${w0.points} pts (สุทธิ ${w0.net_points}${hitsStr})\n`;
              const weeklyPrize = this.config.features.weekly_prize_amount || 300;
              const prizePerTeam = isJointPrize ? (weeklyPrize / eligibleWinners.length).toFixed(0) : weeklyPrize;
              text += `เงินรางวัล: ${prizePerTeam} THB${isJointPrize ? ' / ทีม (หารเท่า)' : ''}\n`;
            } else {
              text += `👑 คะแนนสูงสุด Gameweek ${gwKey}: ${overallTop.team_name} (${overallTop.player_name})\n`;
              const w0 = overallTop;
              const hitsStr = (w0.hits && w0.hits > 0) ? ` | แต้มลบ: -${w0.hits}` : '';
              text += `คะแนน: ${w0.points} pts (สุทธิ ${w0.net_points}${hitsStr})\n`;
            }
          } else {
            if (hasPassedPrize) {
              text += `💡 หมายเหตุ: ทีม ${overallTop.team_name} (${overallTop.points} pts) นำคะแนนสดสูงสุด (ร่วมสนุก) • สิทธิ์ชิงเงินรางวัลส่งต่อให้ ${prizeLeader.team_name}\n`;
            }
            text += `⚡ ผู้นำคะแนนสดชิงรางวัล: ${prizeLeader.team_name} (${prizeLeader.player_name})\n`;
            const w0 = prizeLeader;
            const hitsStr = (w0.hits && w0.hits > 0) ? ` | แต้มลบ: -${w0.hits} (หักในคะแนนรวม)` : '';
            text += `คะแนนสด: ${w0.points} pts (ตรงกับ Official)${hitsStr}\n`;
            if (w0.chip) {
              text += `ชิปที่ใช้: ${w0.chip.toUpperCase()}\n`;
            }
          }

          if (!isWeekly) {
            const curMonth = (this.config.monthly_schedule || []).find(m => m.gw_list && m.gw_list.includes(Number(gwKey))) || this.config.monthly_schedule[0];
            if (curMonth) {
              const monthlyScores = {};
              (this.data.teams || []).forEach(t => monthlyScores[t.entry_id] = { name: t.entry_name, pts: 0 });
              curMonth.gw_list.forEach(g => {
                const gd = this.data.gameweeks ? this.data.gameweeks[String(g)] : null;
                if (gd && gd.results) {
                  gd.results.forEach(r => {
                    if (monthlyScores[r.entry_id]) monthlyScores[r.entry_id].pts += r.net_points;
                  });
                }
              });
              const eligibleMonthly = Object.entries(monthlyScores)
                .filter(([eid]) => this.isPrizeEligible(eid))
                .map(([, t]) => t)
                .sort((a, b) => b.pts - a.pts);
              const topM = eligibleMonthly[0];
              if (topM) {
                text += `\n📅 สถานการณ์รางวัลประจำเดือน (${curMonth.month} - ชิง ${curMonth.budget}):\n`;
                text += `• จ่าฝูงเดือนนี้: ${topM.name} (${topM.pts} pts)\n`;
              }
            }
          }

          text += `\n⭐ จุดเด่นสัปดาห์นี้:\n"${currentLiveNote}"\n`;

          const transfers = sorted.filter(r => r.hits && r.hits > 0);
          const chipsUsed = sorted.filter(r => r.chip);

          if (transfers.length > 0 || chipsUsed.length > 0) {
            text += `\n🔥 ย้ายตัว & ชิป:\n`;
            if (transfers.length > 0) {
              const tfList = transfers.map(t => `${t.team_name} (-${t.hits})`).join(', ');
              text += `• แต้มลบ (Hits): ${tfList}\n`;
            }
            if (chipsUsed.length > 0) {
              const cpList = chipsUsed.map(c => `${c.team_name} (${c.chip.toUpperCase()})`).join(', ');
              text += `• ชิปพิเศษ: ${cpList}\n`;
            }
          }

          text += `\n📊 อันดับคะแนน GW ${gwKey} (Top 5):\n`;
          sorted.slice(0, 5).forEach((t, i) => {
            const hitsPart = (t.hits && t.hits > 0) ? ` (-${t.hits})` : '';
            const chipPart = t.chip ? ` [${t.chip.toUpperCase()}]` : '';
            const funTag = !this.isPrizeEligible(t.entry_id) ? ' (ร่วมสนุก)' : '';
            text += `${i + 1}. ${t.team_name}${funTag}: ${t.net_points} pts${hitsPart}${chipPart}\n`;
          });

          text += `\n🌐 ตรวจสอบผลสด & อันดับตารางเต็มได้ที่:\nhttps://asawamanasak.github.io/fpl-mini/${this.activeLeagueId}`;

          const modal = document.getElementById('text-summary-modal');
          const contentArea = document.getElementById('text-summary-content');
          const title = document.getElementById('modal-summary-title');

          if (title) title.innerText = `สรุปผล ${this.data.name} (GW ${gwKey})`;
          if (contentArea) contentArea.value = text;
          if (modal) modal.classList.remove('hidden');

          if (contentArea) {
            contentArea.focus();
            contentArea.select();
          }

          this.triggerCopyAction(text);

        } catch (e) {
          console.error('shareCurrentGameweek error:', e);
          if (typeof alert !== 'undefined') alert('ไม่สามารถเปิดสรุปผลได้ กรุณาลองใหม่อีกครั้ง');
        }
      }

      triggerCopyAction(text) {
        let copied = false;
        if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            this.showCopyIndicator();
          }).catch(() => {
            this.fallbackExecCopy();
          });
        } else {
          this.fallbackExecCopy();
        }
      }

      fallbackExecCopy() {
        const contentArea = document.getElementById('text-summary-content');
        if (contentArea) {
          contentArea.focus();
          contentArea.select();
          try {
            document.execCommand('copy');
            this.showCopyIndicator();
          } catch (err) {}
        }
      }

      copyFromModal() {
        const contentArea = document.getElementById('text-summary-content');
        if (contentArea) {
          this.triggerCopyAction(contentArea.value);
        }
      }

      showCopyIndicator() {
        const ind = document.getElementById('modal-copy-indicator');
        if (ind) {
          ind.style.opacity = '1';
          setTimeout(() => {
            ind.style.opacity = '0';
          }, 3000);
        }
      }

      closeTextSummaryModal() {
        const modal = document.getElementById('text-summary-modal');
        if (modal) modal.classList.add('hidden');
      }

      showToast(msg, type = 'success') {
        if (typeof document === 'undefined') return;
        let toast = document.getElementById('global-copied-toast');
        if (!toast) {
          toast = document.createElement('div');
          toast.id = 'global-copied-toast';
          toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white font-bold text-xs px-4 py-2 rounded-full shadow-2xl border border-slate-700/80 z-50 flex items-center gap-1.5 transition-all duration-200 opacity-0 pointer-events-none translate-y-2 backdrop-blur-xs font-display';
          document.body.appendChild(toast);
        }
        const icon = (type === 'error') 
          ? '<svg class="w-3.5 h-3.5 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>'
          : '<svg class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>';
        toast.innerHTML = `${icon}<span>${msg}</span>`;
        toast.classList.remove('opacity-0', 'translate-y-2');
        toast.classList.add('opacity-100', 'translate-y-0');
        if (this._toastTimer) clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
          toast.classList.remove('opacity-100', 'translate-y-0');
          toast.classList.add('opacity-0', 'translate-y-2');
        }, 2500);
      }

      exportToExcel() {
        try {
          this.showToast('กำลังจัดเตรียมข้อมูลเพื่อ Export Excel...');
          const leagueName = (this.data && this.data.name) ? this.data.name : `League_${this.activeLeagueId}`;
          const cleanLeagueName = leagueName.replace(/[\\/*?:"<>|]/g, '_').trim();
          const maxGW = Number(this.multiData && this.multiData.max_gw) || 1;
          const dateStr = new Date().toISOString().slice(0, 10);
          const fileName = `FPL_${cleanLeagueName}_${this.activeLeagueId}_AllGWs_${dateStr}.xlsx`;

          // ====================================================
          // 1. DATA PREPARATION: TOTAL LEADERBOARD
          // ====================================================
          const leaderHeaders = [
            'อันดับ (Rank)',
            'ชื่อทีม (Team Name)',
            'ผู้จัดการ (Manager)',
            'FPL ID',
            'สถานะ (Status)',
            'คะแนนรวมสุทธิ (Total Net Pts)'
          ];
          for (let g = 1; g <= maxGW; g++) {
            leaderHeaders.push(`GW ${g}`);
          }
          leaderHeaders.push(
            'แต้มลบรวม (Total Hits)',
            'ชิปที่ใช้ไป (Chips Used)',
            'มูลค่าทีม (£M)',
            'เงินในธนาคาร (£M)'
          );

          const teams = this.data.teams || [];
          const teamStats = teams.map(t => {
            const eid = Number(t.entry_id);
            const isPrize = this.isPrizeEligible(eid);
            let totalNet = 0;
            let totalHits = 0;
            const gwPoints = {};
            const chipsUsed = [];
            let latestValue = 100.0;
            let latestBank = 0.0;

            for (let g = 1; g <= maxGW; g++) {
              const gwData = this.data.gameweeks ? this.data.gameweeks[String(g)] : null;
              if (gwData && gwData.results) {
                const res = gwData.results.find(r => Number(r.entry_id) === eid);
                if (res) {
                  gwPoints[g] = res.net_points;
                  totalNet += (res.net_points || 0);
                  totalHits += (res.hits || 0);
                  if (res.chip) {
                    chipsUsed.push(`${res.chip.toUpperCase()}(GW${g})`);
                  }
                  if (res.team_value !== undefined) latestValue = res.team_value;
                  if (res.bank !== undefined) latestBank = res.bank;
                } else {
                  gwPoints[g] = '-';
                }
              } else {
                gwPoints[g] = '-';
              }
            }

            return {
              entry_id: eid,
              team_name: t.entry_name || t.team_name,
              player_name: t.player_name,
              is_prize: isPrize,
              total_net: totalNet,
              gw_points: gwPoints,
              total_hits: totalHits,
              chips_used: chipsUsed.join(', ') || '-',
              team_value: latestValue,
              bank: latestBank,
              fpl_rank: t.rank || 999
            };
          });

          // Sort by cumulative total net points descending
          teamStats.sort((a, b) => (b.total_net - a.total_net) || (a.fpl_rank - b.fpl_rank));

          let curPrizeRank = 1;
          let eligibleCount = 0;
          let prevTotal = null;
          teamStats.forEach(t => {
            if (!t.is_prize) {
              t.displayRank = 'ร่วมสนุก';
              return;
            }
            eligibleCount++;
            if (prevTotal !== null && t.total_net < prevTotal) {
              curPrizeRank = eligibleCount;
            }
            prevTotal = t.total_net;
            t.displayRank = curPrizeRank;
          });

          const leaderRows = [leaderHeaders];
          teamStats.forEach(t => {
            const row = [
              t.displayRank,
              t.team_name,
              t.player_name,
              t.entry_id,
              t.is_prize ? 'แข่งขันชิงรางวัล' : 'ร่วมสนุก',
              t.total_net
            ];
            for (let g = 1; g <= maxGW; g++) {
              row.push(t.gw_points[g]);
            }
            row.push(
              t.total_hits,
              t.chips_used,
              t.team_value,
              t.bank
            );
            leaderRows.push(row);
          });

          // ====================================================
          // 2. DATA PREPARATION: GAMEWEEK STANDINGS
          // ====================================================
          const gwHeaders = [
            'Gameweek',
            'สถานะสัปดาห์ (GW Status)',
            'อันดับ GW (GW Rank)',
            'ชื่อทีม (Team Name)',
            'ผู้จัดการ (Manager)',
            'FPL ID',
            'สถานะทีม (Team Status)',
            'คะแนนดิบ (Raw Points)',
            'แต้มลบ (Hits)',
            'คะแนนสุทธิ (Net Points)',
            'กัปตัน (Captain)',
            'ชิปที่ใช้ (Chip Used)',
            'แต้มตัวสำรอง (Bench)',
            'จำนวนย้ายตัว (Transfers)',
            'ผลต่างแต้มย้ายตัว (Transfer Net Impact)'
          ];

          const gwRows = [gwHeaders];
          for (let g = 1; g <= maxGW; g++) {
            const gwData = this.data.gameweeks ? this.data.gameweeks[String(g)] : null;
            if (!gwData || !gwData.results || gwData.results.length === 0) continue;

            const isFinished = Boolean(gwData.is_finished);
            const isStarted = gwData.is_started !== undefined ? Boolean(gwData.is_started) : (isFinished || gwData.results.some(r => r.points > 0));
            const statusText = isFinished ? 'จบการแข่งขัน' : (isStarted ? 'กำลังแข่งขัน (Live)' : 'รอคิกออฟ');

            const isWeeklyPrize = (this.config && this.config.features && this.config.features.prize_model === 'weekly');
            const scoreProp = (isFinished && isWeeklyPrize) ? 'net_points' : 'points';
            const sortedGWResults = [...gwData.results].sort((a, b) => (b[scoreProp] - a[scoreProp]) || (b.net_points - a.net_points) || (b.points - a.points));

            let prizeRank = 1;
            let eCount = 0;
            let prevScore = null;
            const rankMap = {};

            sortedGWResults.forEach(r => {
              const isPrize = this.isPrizeEligible(r.entry_id);
              if (!isPrize) {
                rankMap[r.entry_id] = 'ร่วมสนุก';
                return;
              }
              eCount++;
              const score = r[scoreProp];
              if (prevScore !== null && score < prevScore) {
                prizeRank = eCount;
              }
              prevScore = score;
              rankMap[r.entry_id] = prizeRank;
            });

            sortedGWResults.forEach(r => {
              const isPrize = this.isPrizeEligible(r.entry_id);
              gwRows.push([
                `GW ${g}`,
                statusText,
                rankMap[r.entry_id] || '-',
                r.team_name,
                r.player_name,
                r.entry_id,
                isPrize ? 'แข่งขันชิงรางวัล' : 'ร่วมสนุก',
                r.points !== undefined ? r.points : 0,
                r.hits !== undefined ? r.hits : 0,
                r.net_points !== undefined ? r.net_points : 0,
                r.captain ? r.captain.replace(/\s*\(C\)/gi, '').trim() : '-',
                r.chip ? r.chip.toUpperCase() : '-',
                r.bench_points !== undefined ? r.bench_points : 0,
                r.transfers_count !== undefined ? r.transfers_count : 0,
                r.transfers_net_impact !== undefined ? r.transfers_net_impact : 0
              ]);
            });
          }

          // ====================================================
          // 3. DATA PREPARATION: PRIZE SUMMARY
          // ====================================================
          const prizeRows = [];
          const feat = (this.config && this.config.features) || {};
          const isWeekly = (feat.prize_model === 'weekly');

          if (isWeekly) {
            prizeRows.push(['=== สรุปแชมป์เงินรางวัลประจำสัปดาห์ (WEEKLY PRIZE WINNERS) ===']);
            prizeRows.push([
              'Gameweek',
              'สถานะ',
              'ทีมที่ได้รับรางวัล',
              'ผู้จัดการ',
              'FPL ID',
              'คะแนนดิบ',
              'แต้มลบ (Hits)',
              'คะแนนสุทธิ',
              'เงินรางวัล (THB)',
              'หมายเหตุ'
            ]);

            const weeklyPrize = feat.weekly_prize_amount || (this.activeLeagueId === '38491' ? 500 : 350);
            const teamWinnings = {};
            teams.forEach(t => {
              teamWinnings[t.entry_id] = {
                team_name: t.entry_name,
                player_name: t.player_name,
                is_prize: this.isPrizeEligible(t.entry_id),
                win_count: 0,
                won_gws: [],
                total_prize: 0
              };
            });

            for (let g = 1; g <= maxGW; g++) {
              const gwData = this.data.gameweeks ? this.data.gameweeks[String(g)] : null;
              if (!gwData || !gwData.results) continue;
              const isFin = Boolean(gwData.is_finished);
              const eligible = gwData.results.filter(r => this.isPrizeEligible(r.entry_id));
              const sortedAll = [...gwData.results].sort((a, b) => b.net_points - a.net_points);
              const topAll = sortedAll[0];
              const hasPassed = topAll && !this.isPrizeEligible(topAll.entry_id);

              if (eligible.length > 0) {
                const sortedEligible = [...eligible].sort((a, b) => b.net_points - a.net_points);
                const topScore = sortedEligible[0].net_points;
                const winners = sortedEligible.filter(r => r.net_points === topScore);
                const prizePerTeam = Math.round(weeklyPrize / winners.length);

                winners.forEach(w => {
                  if (isFin) {
                    if (teamWinnings[w.entry_id]) {
                      teamWinnings[w.entry_id].win_count += 1 / winners.length;
                      teamWinnings[w.entry_id].won_gws.push(`GW${g}`);
                      teamWinnings[w.entry_id].total_prize += prizePerTeam;
                    }
                  }
                  const note = winners.length > 1
                    ? `แชมป์ร่วม ${winners.length} ทีม (หารเท่า)`
                    : (hasPassed ? `ส่งมอบสิทธิ์จากทีมร่วมสนุก (${topAll.team_name})` : 'แชมป์เดี่ยว');

                  prizeRows.push([
                    `GW ${g}`,
                    isFin ? 'จบการแข่งขัน (รับรางวัลแล้ว)' : 'กำลังแข่งขัน (ผู้นำชั่วคราว)',
                    w.team_name,
                    w.player_name,
                    w.entry_id,
                    w.points,
                    w.hits || 0,
                    w.net_points,
                    isFin ? prizePerTeam : 0,
                    note
                  ]);
                });
              }
            }

            // Summary Table: Total Winnings by Team
            prizeRows.push([]);
            prizeRows.push(['=== สรุปยอดเงินรางวัลสะสมรายทีม (TOTAL PRIZE WINNINGS PER TEAM) ===']);
            prizeRows.push([
              'อันดับเงินรางวัล',
              'ชื่อทีม',
              'ผู้จัดการ',
              'FPL ID',
              'สถานะ',
              'จำนวนแชมป์วีค (ครั้ง)',
              'สัปดาห์ที่ชนะ',
              'เงินรางวัลรวมสะสม (THB)'
            ]);

            const sortedWinnings = Object.values(teamWinnings)
              .filter(t => t.is_prize)
              .sort((a, b) => b.total_prize - a.total_prize);

            sortedWinnings.forEach((t, idx) => {
              const winCountDisp = (t.win_count % 1 === 0) ? t.win_count : t.win_count.toFixed(1);
              prizeRows.push([
                idx + 1,
                t.team_name,
                t.player_name,
                t.entry_id,
                'แข่งขันชิงรางวัล',
                winCountDisp,
                t.won_gws.join(', ') || '-',
                t.total_prize
              ]);
            });

            // Settlement Phases if configured
            if (this.config.settlement_phases) {
              prizeRows.push([]);
              prizeRows.push(['=== รอบเคลียร์เงินรางวัล 6 งวด (SETTLEMENT PHASES) ===']);
              prizeRows.push(['งวดที่', 'สัปดาห์ (GWs)', 'งบประมาณ', 'สถานะ']);
              this.config.settlement_phases.forEach(p => {
                prizeRows.push([p.title, p.gws, p.budget, p.status || '-']);
              });
            }

            // Season & Cup Prizes
            if (this.config.season_prizes) {
              prizeRows.push([]);
              prizeRows.push(['=== รางวัลประจำฤดูกาล & บอลถ้วย (SEASON & CUP PRIZES) ===']);
              prizeRows.push(['รางวัล', 'จำนวนเงิน']);
              Object.entries(this.config.season_prizes).forEach(([k, v]) => {
                prizeRows.push([`อันดับ ${k}`, v]);
              });
              if (feat.cup_champion_prize) {
                prizeRows.push(['แชมป์บอลถ้วย (CUP)', feat.cup_champion_prize]);
              }
            }

          } else {
            // Monthly League (e.g. 675290)
            prizeRows.push(['=== สรุปรางวัลประจำเดือน 10 เดือน (MONTHLY AWARDS) ===']);
            prizeRows.push([
              'เดือน',
              'สัปดาห์แข่งขัน (GWs)',
              'สถานะ',
              'แชมป์ประจำเดือน',
              'ผู้จัดการ (แชมป์)',
              'คะแนนสุทธิเดือนนี้',
              'เงินรางวัลแชมป์ (THB)',
              'รองแชมป์ประจำเดือน',
              'ผู้จัดการ (รองแชมป์)',
              'คะแนนสุทธิ',
              'เงินรางวัลรองแชมป์ (THB)'
            ]);

            const monthlySchedule = this.config.monthly_schedule || [];
            const champAmount = feat.monthly_champion_prize || 600;
            const runnerAmount = feat.monthly_runner_up_prize || 400;

            monthlySchedule.forEach(m => {
              const gwList = m.gw_list || [];
              const monthTotals = {};
              teams.forEach(t => {
                monthTotals[t.entry_id] = {
                  entry_id: t.entry_id,
                  team_name: t.entry_name,
                  player_name: t.player_name,
                  is_prize: this.isPrizeEligible(t.entry_id),
                  pts: 0
                };
              });

              gwList.forEach(g => {
                const gd = this.data.gameweeks ? this.data.gameweeks[String(g)] : null;
                if (gd && gd.results) {
                  gd.results.forEach(r => {
                    if (monthTotals[r.entry_id]) {
                      monthTotals[r.entry_id].pts += (r.net_points || 0);
                    }
                  });
                }
              });

              const isMonthFin = gwList.length > 0 && gwList.every(g => {
                const gd = this.data.gameweeks ? this.data.gameweeks[String(g)] : null;
                return gd && gd.is_finished;
              });

              const sortedMonth = Object.values(monthTotals)
                .filter(t => t.is_prize)
                .sort((a, b) => b.pts - a.pts);

              if (sortedMonth.length === 0 || sortedMonth[0].pts === 0) {
                prizeRows.push([
                  m.month,
                  m.gws,
                  isMonthFin ? 'จบการแข่งขัน' : (m.status || 'รอการแข่งขัน'),
                  '-', '-', 0, 0,
                  '-', '-', 0, 0
                ]);
              } else {
                const topScore = sortedMonth[0].pts;
                const topChamps = sortedMonth.filter(t => t.pts === topScore);
                let topRunners = [];
                let champPayout = champAmount;
                let runnerPayout = runnerAmount;

                if (topChamps.length > 1) {
                  champPayout = Math.floor((champAmount + runnerAmount) / topChamps.length);
                  runnerPayout = 0;
                } else {
                  const secondScore = sortedMonth.find(t => t.pts < topScore)?.pts;
                  if (secondScore !== undefined && secondScore > 0) {
                    topRunners = sortedMonth.filter(t => t.pts === secondScore);
                    runnerPayout = (topRunners.length > 1 && runnerAmount % topRunners.length !== 0)
                      ? Number((runnerAmount / topRunners.length).toFixed(2))
                      : Math.round(runnerAmount / topRunners.length);
                  }
                }

                const champNames = topChamps.map(c => c.team_name).join(', ');
                const champManagers = topChamps.map(c => c.player_name).join(', ');
                const runnerNames = topRunners.map(r => r.team_name).join(', ') || '-';
                const runnerManagers = topRunners.map(r => r.player_name).join(', ') || '-';

                prizeRows.push([
                  m.month,
                  m.gws,
                  isMonthFin ? 'จบการแข่งขัน (มอบรางวัลแล้ว)' : (m.status || 'รอการแข่งขัน'),
                  champNames + (topChamps.length > 1 ? ` (แชมป์ร่วม ${topChamps.length} ทีม)` : ''),
                  champManagers,
                  topScore,
                  isMonthFin ? (topChamps.length > 1 ? `${champPayout} / ทีม` : champPayout) : 0,
                  runnerNames + (topRunners.length > 1 ? ` (รองแชมป์ร่วม ${topRunners.length} ทีม)` : ''),
                  runnerManagers,
                  topRunners.length > 0 ? topRunners[0].pts : 0,
                  isMonthFin ? (topRunners.length > 1 ? `${runnerPayout} / ทีม` : runnerPayout) : 0
                ]);
              }
            });

            // Season & Central pool / Charity
            prizeRows.push([]);
            prizeRows.push(['=== รางวัลประจำฤดูกาล บอลถ้วย และเงินบริจาคการกุศล ===']);
            prizeRows.push(['หมวดหมู่', 'รายละเอียด / จำนวนเงิน']);
            prizeRows.push(['อันดับ 1 ประจำฤดูกาล', '5,000 THB']);
            prizeRows.push(['อันดับ 2 ประจำฤดูกาล', '3,500 THB']);
            prizeRows.push(['อันดับ 3 ประจำฤดูกาล', '2,500 THB']);
            prizeRows.push(['อันดับ 4 ประจำฤดูกาล', '1,500 THB']);
            prizeRows.push(['อันดับ 5 ประจำฤดูกาล', '1,000 THB']);
            if (feat.cup_champion_prize) {
              prizeRows.push(['แชมป์บอลถ้วย (CUP)', feat.cup_champion_prize]);
            }
            if (feat.charity_donation) {
              prizeRows.push(['บริจาคการกุศลให้โรงพยาบาล', feat.charity_donation]);
            }
            if (this.config.total_pool) {
              prizeRows.push(['กองกลางรวมทั้งหมด', this.config.total_pool]);
            }
          }

          // ====================================================
          // 4. WRITE EXCEL VIA SHEETJS OR FALLBACK
          // ====================================================
          if (typeof XLSX !== 'undefined' && XLSX.utils && XLSX.writeFile) {
            const wb = XLSX.utils.book_new();

            const wsLeader = XLSX.utils.aoa_to_sheet(leaderRows);
            const wsGW = XLSX.utils.aoa_to_sheet(gwRows);
            const wsPrize = XLSX.utils.aoa_to_sheet(prizeRows);

            const calcWidths = (rows) => {
              const widths = [];
              rows.forEach(r => {
                r.forEach((val, i) => {
                  const str = (val === null || val === undefined) ? '' : String(val);
                  widths[i] = Math.max(widths[i] || 10, Math.min(str.length + 3, 40));
                });
              });
              return widths.map(w => ({ wch: w }));
            };

            wsLeader['!cols'] = calcWidths(leaderRows);
            wsGW['!cols'] = calcWidths(gwRows);
            wsPrize['!cols'] = calcWidths(prizeRows);

            XLSX.utils.book_append_sheet(wb, wsLeader, 'Total Leaderboard');
            XLSX.utils.book_append_sheet(wb, wsGW, 'Gameweek Standings');
            XLSX.utils.book_append_sheet(wb, wsPrize, 'Prize Summary');

            XLSX.writeFile(wb, fileName);
            this.showToast('ดาวน์โหลดไฟล์ Excel เรียบร้อยแล้ว!');
          } else {
            this.exportExcelXmlFallback(leaderRows, gwRows, prizeRows, fileName.replace(/\.xlsx$/i, '.xls'));
            this.showToast('ดาวน์โหลดไฟล์ Excel เรียบร้อยแล้ว!');
          }

        } catch (err) {
          console.error('Export Excel failed:', err);
          this.showToast('เกิดข้อผิดพลาดในการส่งออก Excel', 'error');
          if (typeof alert !== 'undefined') {
            alert('ไม่สามารถสร้างไฟล์ Excel ได้: ' + (err.message || err));
          }
        }
      }

      exportExcelXmlFallback(leaderRows, gwRows, prizeRows, fileName) {
        const escapeXml = (unsafe) => {
          if (unsafe === null || unsafe === undefined) return '';
          return String(unsafe)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
        };

        const rowsToXmlTable = (rows) => {
          let out = '<Table>';
          rows.forEach(r => {
            out += '<Row>';
            r.forEach(cell => {
              const isNum = typeof cell === 'number';
              const type = isNum ? 'Number' : 'String';
              out += `<Cell><Data ss:Type="${type}">${escapeXml(cell)}</Data></Cell>`;
            });
            out += '</Row>';
          });
          out += '</Table>';
          return out;
        };

        const xmlParts = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<?mso-application progid="Excel.Sheet"?>',
          '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"',
          ' xmlns:o="urn:schemas-microsoft-com:office:office"',
          ' xmlns:x="urn:schemas-microsoft-com:office:excel"',
          ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"',
          ' xmlns:html="http://www.w3.org/TR/REC-html40">',
          '  <Worksheet ss:Name="Total Leaderboard">' + rowsToXmlTable(leaderRows) + '</Worksheet>',
          '  <Worksheet ss:Name="Gameweek Standings">' + rowsToXmlTable(gwRows) + '</Worksheet>',
          '  <Worksheet ss:Name="Prize Summary">' + rowsToXmlTable(prizeRows) + '</Worksheet>',
          '</Workbook>'
        ];
        const xml = xmlParts.join('');

        const blob = new Blob(['\\uFEFF', xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      initVisitorCounter() {
        const counterEl = document.getElementById('visitor-counter-text');
        if (!counterEl) return;

        let cached = null;
        let lastCountedStr = null;
        try {
          if (typeof localStorage !== 'undefined') {
            cached = localStorage.getItem('fpl_visitor_count');
            lastCountedStr = localStorage.getItem('fpl_visitor_last_counted');
          }
        } catch (e) {}

        // Display cached count immediately to eliminate loading delay
        if (cached) {
          const num = parseInt(cached, 10);
          if (!isNaN(num)) {
            counterEl.textContent = `Visitors: ${num.toLocaleString()}`;
          }
        }

        // 1-Hour Cooldown per browser to prevent refresh/F5 count abuse
        const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour in milliseconds
        const now = Date.now();
        if (lastCountedStr && cached) {
          const lastCounted = parseInt(lastCountedStr, 10);
          if (!isNaN(lastCounted) && (now - lastCounted < COOLDOWN_MS)) {
            // Still within 1-hour cooldown window: keep cached count and skip API call
            return;
          }
        }

        // Outside cooldown: Fetch live visitor count (sitewide path: asawamanasak-fpl-mini)
        const controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        const timeoutId = controller ? setTimeout(() => controller.abort(), 4000) : null;

        fetch('https://api.visitorbadge.io/api/visitors?path=asawamanasak-fpl-mini', {
          signal: controller ? controller.signal : undefined
        })
          .then(res => {
            if (timeoutId) clearTimeout(timeoutId);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.text();
          })
          .then(svgText => {
            const match = svgText.match(/VISITORS:\s*([\d,]+)/i);
            if (match && match[1]) {
              const count = parseInt(match[1].replace(/,/g, ''), 10);
              if (!isNaN(count)) {
                try {
                  if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('fpl_visitor_count', count.toString());
                    localStorage.setItem('fpl_visitor_last_counted', now.toString());
                  }
                } catch (e) {}
                counterEl.textContent = `Visitors: ${count.toLocaleString()}`;
              }
            }
          })
          .catch(err => {
            console.debug('Visitor count unavailable:', err);
            if (!cached) {
              counterEl.textContent = 'Visitors: -';
            }
          });
      }
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('DOMContentLoaded', () => {
        window.app = new StandaloneApp(MULTI_LEAGUE_DATA, LEAGUES_CONFIG, INITIAL_DEFAULT_LEAGUE);
        window.app.init();
      });

      // Keyboard Accessibility: Escape key closes any active modal
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && window.app) {
          window.app.closeTeamModal();
          window.app.closeTextSummaryModal();
        }
      });

      window.exportToExcelFallback = function() {
        if (window.app && typeof window.app.exportToExcel === 'function') {
          window.app.exportToExcel();
        } else {
          alert('ระบบกำลังโหลดข้อมูล กรุณารอสักครู่แล้วคลิกใหม่อีกครั้ง');
        }
      };
    }
  </script>
</body>
</html>"""

    html = html_template.replace('__LAST_SYNC__', last_sync_str)
    html = html.replace('__MULTI_DATA_JSON__', multi_data_json_str)
    html = html.replace('__LEAGUES_CONFIG_JSON__', leagues_config_json_str)
    html = html.replace('__DEFAULT_LID__', default_lid_code)
    html = html.replace('__ASSET_PREFIX__', asset_prefix)
    return html

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    multi_data_path = os.path.join(base_dir, 'multi_fpl_data.json')
    config_path = os.path.join(base_dir, 'config', 'leagues_config.json')

    if not os.path.exists(multi_data_path) or not os.path.exists(config_path):
        import subprocess
        subprocess.run(['python3', os.path.join(base_dir, 'sync_live_fpl.py')], check=True)

    with open(multi_data_path, 'r', encoding='utf-8') as f:
        multi_data = json.load(f)

    with open(config_path, 'r', encoding='utf-8') as f:
        leagues_config = json.load(f)

    # 1. Generate root files
    root_html = generate_html(multi_data, leagues_config, default_league_id=None)
    with open(os.path.join(base_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(root_html)

    with open(os.path.join(base_dir, 'preview.html'), 'w', encoding='utf-8') as f:
        f.write(root_html)

    with open(os.path.join(base_dir, '404.html'), 'w', encoding='utf-8') as f:
        f.write(root_html)

    # 2. Generate dedicated folder entry points for all configured leagues dynamically
    for lid in leagues_config.keys():
        dir_league = os.path.join(base_dir, str(lid))
        os.makedirs(dir_league, exist_ok=True)
        html_league = generate_html(multi_data, leagues_config, default_league_id=str(lid))
        with open(os.path.join(dir_league, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(html_league)

    print("Successfully generated all HTML dashboard files on local!")

if __name__ == '__main__':
    main()
