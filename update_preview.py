#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate standalone preview.html, index.html, 404.html, 40700/index.html, 675290/index.html, 38491/index.html, and 1101958/index.html
Supporting clean short user URLs:
- https://asawamanasak.github.io/fpl-mini/40700
- https://asawamanasak.github.io/fpl-mini/675290
- https://asawamanasak.github.io/fpl-mini/38491
- https://asawamanasak.github.io/fpl-mini/1101958

Build Version: 2026.08.31.01
"""

import json
import os
from parse_shi62_special import parse_shi62_file

def generate_html(multi_data, leagues_config, default_league_id=None, precomputed_json_str=None, precomputed_cfg_str=None, shi62_data_json_str=None):
    if precomputed_json_str is None:
        # Performance Optimization: Deep-strip raw_picks and raw_hist before serializing into HTML
        pruned_data = {
            "last_sync": multi_data.get("last_sync"),
            "last_sync_iso": multi_data.get("last_sync_iso"),
            "sync_status": multi_data.get("sync_status"),
            "max_gw": multi_data.get("max_gw"),
            "transfer_suggestions": multi_data.get("transfer_suggestions", {}),
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
    else:
        multi_data_json_str = precomputed_json_str

    if precomputed_cfg_str is None:
        leagues_config_json_str = json.dumps(leagues_config, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    else:
        leagues_config_json_str = precomputed_cfg_str

    default_lid_code = f'"{default_league_id}"' if default_league_id else 'null'
    asset_prefix = "../" if default_league_id else "./"
    last_sync_str = str(multi_data.get("last_sync") or "31 ส.ค. 2026, 22:30 น.")

    html_template = """<!DOCTYPE html>
<html lang="th" class="h-full bg-slate-50 dark:bg-slate-950 transition-colors duration-150 overflow-x-hidden">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <title>FPL Dashboard - มินิลีกแฟนตาซี</title>
  <meta name="description" content="เกาะติดคะแนนสด ตารางคะแนน ไฮไลท์ประจำสัปดาห์ และสรุปเงินรางวัล FPL มินิลีก">
  <meta name="theme-color" content="#0f172a">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="FPL Dashboard">

  <!-- Favicons & App Shortcut Icons (Chrome / Safari / iOS / Android) -->
  <link rel="shortcut icon" href="__ASSET_PREFIX__favicon.ico?v=2">
  <link rel="icon" type="image/x-icon" href="__ASSET_PREFIX__favicon.ico?v=2">
  <link rel="icon" type="image/png" sizes="32x32" href="__ASSET_PREFIX__images/icons/favicon-32x32.png?v=2">
  <link rel="icon" type="image/png" sizes="16x16" href="__ASSET_PREFIX__images/icons/favicon-16x16.png?v=2">
  <link rel="icon" type="image/png" sizes="192x192" href="__ASSET_PREFIX__images/icons/favicon-192x192.png?v=2">
  <link rel="icon" type="image/png" sizes="512x512" href="__ASSET_PREFIX__images/icons/favicon-512x512.png?v=2">
  <link rel="apple-touch-icon" sizes="180x180" href="__ASSET_PREFIX__images/icons/apple-touch-icon.png?v=2">
  <link rel="manifest" href="__ASSET_PREFIX__site.webmanifest?v=2">

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

    html {
      overflow-x: hidden;
      max-width: 100vw;
      width: 100%;
      box-sizing: border-box;
      -webkit-text-size-adjust: 100%;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      font-family: var(--font-family) !important;
    }

    body {
      overflow-x: hidden;
      max-width: 100vw;
      width: 100%;
      min-height: 100dvh;
      font-family: var(--font-family) !important;
      background-color: #f8fafc;
      color: #0f172a;
      letter-spacing: -0.01em;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      touch-action: manipulation;
    }

    /* Fluid responsive containers & media */
    main, header, footer {
      max-width: 100%;
      width: 100%;
    }

    img {
      max-width: 100%;
      height: auto;
    }

    /* Mobile touch target minimum size & feedback */
    button, [role="button"], a {
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
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
      background-image: linear-gradient(135deg, rgba(254, 243, 199, 0.75) 0%, rgba(255, 251, 235, 0.4) 45%, #ffffff 100%);
      border: 1px solid rgba(245, 158, 11, 0.35);
      box-shadow: 0 4px 20px -2px rgba(245, 158, 11, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.04);
      position: relative;
    }

    .live-leader-spotlight-card {
      background-color: #f7fee7;
      background-image: radial-gradient(circle at 0% 0%, rgba(220, 252, 231, 0.85) 0%, rgba(240, 253, 244, 0.45) 55%, #ffffff 100%);
      border: 1.5px solid #86efac;
      box-shadow: 0 4px 20px -2px rgba(16, 185, 129, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.04);
      position: relative;
    }

    .prematch-spotlight-card {
      background-color: #f8fafc;
      background-image: radial-gradient(circle at 0% 0%, rgba(238, 242, 255, 0.85) 0%, rgba(245, 243, 255, 0.45) 55%, #ffffff 100%);
      border: 1.5px solid #c7d2fe;
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
      scroll-behavior: smooth;
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
      min-height: 400px;
      width: 100%;
      max-width: 100%;
      padding: 0.625rem 0.25rem;
      box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.4);
      box-sizing: border-box;
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
      max-width: 100%;
      position: relative;
      z-index: 10;
      padding: 0.15rem 0;
      box-sizing: border-box;
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

    /* ==================== DARK MODE THEME (AMOLED / PURE TRUE BLACK) ==================== */
    html.dark {
      color-scheme: dark;
      background-color: #000000 !important;
    }

    .dark body {
      background-color: #000000 !important;
      color: #f3f4f6 !important;
    }

    .dark header {
      background-color: rgba(0, 0, 0, 0.85) !important;
      border-color: #1a1a1c !important;
      backdrop-filter: blur(16px) !important;
      -webkit-backdrop-filter: blur(16px) !important;
    }

    .dark .glass-card {
      background: #0d0d0f !important;
      border-color: #222225 !important;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.7) !important;
    }

    .dark .winner-spotlight-card {
      background-color: #0c0b08 !important;
      background-image: radial-gradient(circle at 10% 0%, rgba(245, 158, 11, 0.16) 0%, rgba(217, 119, 6, 0.06) 40%, rgba(13, 13, 15, 0.95) 75%, #0d0d0f 100%) !important;
      border: 1px solid rgba(245, 158, 11, 0.3) !important;
      box-shadow: 0 4px 24px -2px rgba(245, 158, 11, 0.08), 0 4px 20px -2px rgba(0, 0, 0, 0.7) !important;
    }

    .dark .live-leader-spotlight-card {
      background-color: #0d0d0f !important;
      background-image: radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.14) 0%, rgba(13, 13, 15, 0.85) 60%, #0d0d0f 100%) !important;
      border: 1.5px solid rgba(16, 185, 129, 0.3) !important;
      box-shadow: 0 4px 24px -2px rgba(0, 0, 0, 0.8) !important;
    }

    .dark .prematch-spotlight-card {
      background-color: #0d0d0f !important;
      background-image: radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.14) 0%, rgba(13, 13, 15, 0.85) 60%, #0d0d0f 100%) !important;
      border: 1.5px solid rgba(99, 102, 241, 0.3) !important;
      box-shadow: 0 4px 24px -2px rgba(0, 0, 0, 0.8) !important;
    }

    .dark .border-slate-200,
    .dark .border-slate-100,
    .dark .border-slate-200\/80,
    .dark .border-slate-300 {
      border-color: #222225 !important;
    }

    .dark .divide-slate-100 > :not([hidden]) ~ :not([hidden]),
    .dark .divide-slate-200 > :not([hidden]) ~ :not([hidden]) {
      border-color: #1a1a1c !important;
    }

    .dark .bg-slate-50,
    .dark .bg-slate-50\/50,
    .dark .bg-slate-100,
    .dark .bg-slate-100\/90 {
      background-color: #141416 !important;
    }

    .dark .bg-white {
      background-color: #0d0d0f !important;
    }

    .dark .text-slate-900 {
      color: #ffffff !important;
    }

    .dark .text-slate-800 {
      color: #f3f4f6 !important;
    }

    .dark .text-slate-700 {
      color: #e5e7eb !important;
    }

    .dark .text-slate-600 {
      color: #d1d5db !important;
    }

    .dark .text-slate-500 {
      color: #9ca3af !important;
    }

    .dark .hover\:bg-slate-50:hover,
    .dark .hover\:bg-slate-100:hover {
      background-color: #1e1e24 !important;
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
      background: #000000 !important;
    }

    .dark .scrollbar-thin::-webkit-scrollbar-thumb {
      background: #222225 !important;
    }

    .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
      background: #333336 !important;
    }

    /* Modals & Dropdowns in Dark Mode */
    .dark #team-modal-content,
    .dark #summary-modal-content,
    .dark #text-summary-modal > div:last-child,
    .dark #team-modal > div:last-child,
    .dark #projected-points-modal > div:last-child {
      background-color: #0d0d0f !important;
      border-color: #262629 !important;
      color: #f8fafc !important;
    }

    .dark #team-modal .sticky.top-0 {
      background-color: rgba(13, 13, 15, 0.95) !important;
      border-color: #262629 !important;
    }

    .dark #league-dropdown-menu {
      background-color: #0d0d0f !important;
      border-color: #262629 !important;
      box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.9) !important;
    }

    .dark #league-dropdown-menu button:hover {
      background-color: #1a1a1c !important;
    }

    .dark textarea#text-summary-content {
      background-color: #050505 !important;
      color: #e2e8f0 !important;
      border-color: #262629 !important;
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
      background-color: #141416 !important;
      color: #93c5fd !important;
      border-color: #1e3a8a !important;
    }

    /* Pure Black / AMOLED Theme Overrides for Tailwind classes */
    .dark .dark\:bg-slate-950,
    .dark .dark\:bg-slate-900 {
      background-color: #0d0d0f !important;
    }
    .dark .dark\:bg-slate-800 {
      background-color: #141416 !important;
    }
    .dark .dark\:bg-slate-800\/90 {
      background-color: rgba(20, 20, 22, 0.92) !important;
    }
    .dark .dark\:bg-slate-800\/80 {
      background-color: rgba(20, 20, 22, 0.8) !important;
    }
    .dark .dark\:bg-slate-800\/60 {
      background-color: rgba(20, 20, 22, 0.6) !important;
    }
    .dark .dark\:bg-slate-800\/50 {
      background-color: rgba(20, 20, 22, 0.5) !important;
    }
    .dark .dark\:bg-slate-800\/40 {
      background-color: rgba(20, 20, 22, 0.4) !important;
    }
    .dark .dark\:bg-slate-800\/30 {
      background-color: rgba(20, 20, 22, 0.3) !important;
    }
    .dark .dark\:bg-slate-700 {
      background-color: #1c1c20 !important;
    }
    .dark .dark\:border-slate-800,
    .dark .dark\:border-slate-700,
    .dark .dark\:border-slate-800\/80,
    .dark .dark\:border-slate-700\/80,
    .dark .dark\:border-slate-800\/60,
    .dark .dark\:border-slate-700\/60 {
      border-color: #222225 !important;
    }
    .dark .dark\:divide-slate-800 > :not([hidden]) ~ :not([hidden]),
    .dark .dark\:divide-slate-800\/80 > :not([hidden]) ~ :not([hidden]),
    .dark .dark\:divide-slate-800\/60 > :not([hidden]) ~ :not([hidden]),
    .dark .dark\:divide-slate-800\/40 > :not([hidden]) ~ :not([hidden]) {
      border-color: #1a1a1c !important;
    }
    .dark .dark\:hover\:bg-slate-800:hover,
    .dark .dark\:hover\:bg-slate-800\/60:hover,
    .dark .dark\:hover\:bg-slate-800\/40:hover,
    .dark .dark\:hover\:bg-slate-700:hover {
      background-color: #1e1e24 !important;
    }
    .dark .dark\:text-slate-500,
    .dark .dark\:text-slate-400 {
      color: #9ca3af !important;
    }
    .dark .dark\:text-slate-300 {
      color: #d1d5db !important;
    }
    .dark .dark\:text-slate-200 {
      color: #e5e7eb !important;
    }
    .dark .dark\:text-slate-100 {
      color: #f3f4f6 !important;
    }
    .dark .dark\:text-white {
      color: #ffffff !important;
    }
    .dark .dark\:bg-blue-950\/60,
    .dark .dark\:bg-blue-950\/50,
    .dark .dark\:bg-blue-950\/40 {
      background-color: rgba(37, 99, 235, 0.16) !important;
      border-color: rgba(59, 130, 246, 0.3) !important;
    }
    .dark .dark\:bg-emerald-950\/60,
    .dark .dark\:bg-emerald-950\/70,
    .dark .dark\:bg-emerald-950\/50 {
      background-color: rgba(16, 185, 129, 0.16) !important;
      border-color: rgba(16, 185, 129, 0.3) !important;
    }
    .dark .dark\:bg-amber-950\/60,
    .dark .dark\:bg-amber-950\/40 {
      background-color: rgba(245, 158, 11, 0.16) !important;
      border-color: rgba(245, 158, 11, 0.3) !important;
    }
    .dark .dark\:bg-rose-950,
    .dark .dark\:bg-rose-950\/60 {
      background-color: rgba(244, 63, 94, 0.16) !important;
      border-color: rgba(244, 63, 94, 0.3) !important;
    }

    /* Modal Backdrop in Pure Black */
    .dark .bg-slate-950\/75 {
      background-color: rgba(0, 0, 0, 0.85) !important;
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

    @keyframes tabBluePulse {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.45);
        border-color: rgba(59, 130, 246, 0.85);
        background-color: rgba(37, 99, 235, 0.08);
      }
      50% {
        box-shadow: 0 0 14px 3px rgba(37, 99, 235, 0.7);
        border-color: rgba(29, 78, 216, 1);
        background-color: rgba(37, 99, 235, 0.22);
      }
    }
    @keyframes tabBluePulseActive {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.55);
        filter: brightness(1);
      }
      50% {
        box-shadow: 0 0 16px 4px rgba(37, 99, 235, 0.85);
        filter: brightness(1.15);
      }
    }
    .tab-pulse-comp {
      animation: tabBluePulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
      border: 1px solid rgba(59, 130, 246, 0.8) !important;
      color: #2563eb !important;
    }
    .dark .tab-pulse-comp {
      color: #60a5fa !important;
    }
    .tab-pulse-comp-active {
      animation: tabBluePulseActive 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
      background-color: #2563eb !important;
      color: #ffffff !important;
      border: 1px solid #3b82f6 !important;
    }
    .dark .tab-pulse-comp-active {
      background-color: #2563eb !important;
      color: #ffffff !important;
      border: 1px solid #60a5fa !important;
    }

    .dark .text-emerald-700 {
      color: #34d399 !important;
    }

    /* Football Pitch Player Cards in Dark Mode */
    .dark .fpl-pitch .bg-white\/90 {
      background-color: rgba(10, 10, 12, 0.92) !important;
      border: 1px solid #222225 !important;
      color: #ffffff !important;
    }
    .dark .fpl-pitch .text-slate-900 {
      color: #ffffff !important;
    }
    .dark .fpl-pitch .text-slate-500 {
      color: #9ca3af !important;
    }
  </style>
</head>
<body class="h-full flex flex-col selection:bg-slate-900 selection:text-white" onclick="app && app.closeLeagueDropdownIfClickedOutside(event)">

  <!-- 1. Header (League Identity, Switcher Dropdown, Status & Tabs) -->
  <header class="border-b border-slate-200 bg-white/95 backdrop-blur-xl sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
      
      <!-- 1.1 ข้อมูลประจำลีก & Action Header -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <!-- Logo Image -->
          <img 
          src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAQABAADASIAAhEBAxEB/8QAHQABAAICAwEBAAAAAAAAAAAAAAgJBgcBBAUDAv/EAFYQAQABAwMBBQQECwMIBggGAwABAgMEBQYRBwgSITFBE1FhcRQiMoEVI0JSYnKCkZKhsRYzwRckQ1NjorLCGDQ3dbPRJTVEVHOTldInNlaUo8O04fD/xAAdAQEAAQQDAQAAAAAAAAAAAAAABgQFBwgCAwkB/8QAShEAAgECAwMHCAcGBAQHAQAAAAECAwQFBhEhMUEHEiJRYXGBCBMUMpGhscFCUmJygtHhFSMzkrLwFiSiwkNTc9IYJTQ1NmPxg//aAAwDAQACEQMRAD8A3GAiR5jgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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VixZpii3at0RTRRTEcRERHhEfB9QUj27WRaTc25SerYAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//Z" 
          alt="Premier League" 
          class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover shadow-xs flex-shrink-0 border border-slate-200/80"
        >
        
        <!-- League Switcher Container -->
        <div class="relative inline-block text-left min-w-0">
          <button 
            id="league-switcher-btn" 
            onclick="app.toggleLeagueDropdown(event)" 
            class="group flex items-center gap-1.5 text-left cursor-pointer transition-colors leading-tight"
            title="คลิกเพื่อสลับดูมินิลีกอื่น (Switch League)"
          >
            <span id="header-league-name" class="text-sm sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight truncate max-w-[95px] min-[360px]:max-w-[140px] sm:max-w-[320px] md:max-w-[420px]">กำลังโหลดลีก...</span>
            <span class="inline-flex items-center justify-center w-5 h-5 rounded-lg bg-blue-50 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-slate-700 text-blue-600 dark:text-blue-400 transition-colors flex-shrink-0 shadow-2xs">
              <svg class="w-3 h-3 group-hover:translate-y-0.5 transition-transform" id="league-switcher-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
            </span>
          </button>

          <!-- Dropdown Menu Box -->
          <div id="league-dropdown-menu" class="hidden absolute top-full left-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in duration-100" onclick="event.stopPropagation()">
            <div class="px-3.5 py-1.5 text-[10px] uppercase font-bold text-blue-600 font-display border-b border-slate-100 flex items-center justify-between">
              <span>เลือกลีก (Select League)</span>
              <span class="text-[9px] text-slate-400 font-normal">คลิกเพื่อสลับ</span>
            </div>
            <div id="league-dropdown-options" class="p-1 space-y-0.5">
              <!-- Dynamic options for 40700 and 675290 -->
            </div>
          </div>
        </div>
      </div>

      <!-- Actions (Theme Toggle & Excel Export) -->
      <div class="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
        <div id="api-status-text" class="text-xs font-semibold text-emerald-900 hidden md:flex items-center bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-300 shadow-xs animate-pulse font-display">
          <span id="header-gw-status-dot" class="inline-block w-2 h-2 rounded-full bg-emerald-600 mr-2"></span>
          <span id="header-gw-status">Gameweek 2 กำลังแข่งขัน (Live)</span>
        </div>

        <!-- Dark Mode Toggle Button -->
        <button 
          id="btn-theme-toggle"
          onclick="window.app ? window.app.toggleTheme() : (window.toggleThemeFallback && window.toggleThemeFallback())"
          class="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 min-w-[36px] min-h-[36px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-2xs active:scale-95 flex-shrink-0 cursor-pointer"
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
          class="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] rounded-xl bg-emerald-700 hover:bg-emerald-600 border border-emerald-600 text-xs font-semibold text-white transition-all shadow-sm active:scale-95 flex-shrink-0 cursor-pointer"
          title="Export ข้อมูลทั้งหมดทุก Gameweek, Leaderboard และสรุปเงินรางวัลเป็นไฟล์ Excel (.xlsx)"
        >
          <svg class="w-3.5 h-3.5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <span class="font-bold hidden sm:inline">Export Excel</span>
          <span class="font-bold sm:hidden">Excel</span>
        </button>
      </div>
    </div>

    <!-- Sub-Row: Symmetrical, Balanced & Easy-to-Read Metadata Line -->
    <div class="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5 sm:mt-1 flex-wrap pl-0 sm:pl-[52px]">
      <span id="header-league-id-badge" class="font-bold text-blue-900 bg-blue-100/70 border border-blue-200/80 px-1.5 py-0.5 rounded-md font-display leading-none">LEAGUE 40700</span>
      <span class="text-slate-300 dark:text-slate-600">•</span>
      <span id="header-member-count" class="font-bold text-slate-700 dark:text-slate-300">12 ทีมสมาชิก</span>
      <span class="text-slate-300 dark:text-slate-600">•</span>
      <span id="header-season">ฤดูกาล 2026/27</span>
      <span class="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
      
      <!-- Last Sync Badge with Connection Indicator -->
      <span id="header-last-sync-badge" class="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 px-2 sm:px-2.5 py-0.5 rounded-full font-display shadow-2xs" title="ระบบเชื่อมต่อ Auto-Sync ปกติ (Online)">
        <span>Last Sync: <strong id="header-last-sync" class="text-slate-900 dark:text-white font-bold">__LAST_SYNC__</strong></span>
        <span id="header-last-sync-icon" class="inline-flex items-center" title="ระบบเชื่อมต่อ Auto-Sync ปกติ (Online)">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
        </span>
      </span>
    </div>
  </div>

    <!-- 1.4 แถบเมนูแท็บหลัก (จัดหมวดหมู่และเรียงลำดับภาษาไทย) -->
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 border-t border-slate-200/80">
      <nav class="flex space-x-1 sm:space-x-2 overflow-x-auto touch-scroll no-scrollbar py-1.5 sm:py-2">
        <button 
          id="tab-btn-live"
          data-tab-target="gameweek-view" 
          class="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-slate-900 text-white shadow-xs dark:bg-blue-600 dark:text-white active:scale-95 cursor-pointer"
        >
          คะแนนสด
        </button>
        <button 
          id="tab-btn-highlights"
          data-tab-target="highlights-view" 
          class="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 cursor-pointer"
        >
          ไฮไลท์
        </button>
        <button 
          id="tab-btn-global-radar"
          data-tab-target="global-radar-view" 
          class="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 cursor-pointer"
        >
          เรดาร์ฟอร์ม
        </button>
        <button 
          id="tab-btn-competition"
          data-tab-target="competition-view" 
          class="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 cursor-pointer"
        >
          สถานะชิป
        </button>
        <button 
          id="tab-btn-prizes"
          data-tab-target="prizes-view" 
          class="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 cursor-pointer"
        >
          เงินรางวัล
        </button>
        <button 
          id="tab-btn-cup"
          data-tab-target="cup-view" 
          class="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 cursor-pointer"
        >
          บอลถ้วย
        </button>
        <button 
          id="tab-btn-hall-of-fame"
          data-tab-target="hall-of-fame-view" 
          class="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 cursor-pointer"
        >
          ทำเนียบแชมป์
        </button>
        <button 
          id="tab-btn-rules"
          data-tab-target="rules-view" 
          class="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 cursor-pointer"
        >
          กติกา
        </button>
        <button 
          id="tab-btn-about"
          data-tab-target="about-view" 
          class="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 cursor-pointer"
        >
          เกี่ยวกับ
        </button>
        <button 
          id="tab-btn-shi62-special"
          data-tab-target="shi62-special-view" 
          class="tab-nav-btn hidden flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 cursor-pointer"
        >
          พิเศษ (BETA)
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
        <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 border-t-4 border-t-emerald-500 shadow-xs relative">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3">
            <div>
              <span class="text-[10px] sm:text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold font-display flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                GAMEWEEK STANDING
              </span>
              <h3 id="matchday-table-title" class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display mt-0.5">ตารางคะแนน Gameweek 2</h3>
            </div>
            <span id="matchday-table-badge" class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              ผลการแข่งขัน
            </span>
          </div>

          <div class="overflow-x-auto no-scrollbar -mx-4 sm:mx-0 touch-scroll">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-100 dark:border-slate-800/80 text-[11px] font-bold text-slate-400 dark:text-slate-500 font-display bg-slate-50/50 dark:bg-slate-900/50">
                  <th class="py-2.5 px-1 sm:px-2 text-center w-7 sm:w-8">#</th>
                  <th class="py-2.5 px-1.5 sm:px-3 min-w-0">ทีม & ผู้จัดการ</th>
                  <th class="py-2.5 px-2 sm:px-3 text-center hidden sm:table-cell">กัปตัน</th>
                  <th class="py-2.5 px-1 sm:px-2 text-center text-[10px] sm:text-[11px] text-emerald-700 dark:text-emerald-400 font-bold whitespace-nowrap"><span class="hidden sm:inline">คะแนนสด (GW)</span><span class="sm:hidden">แต้มสด</span></th>
                  <th class="py-2.5 px-1 sm:px-2 text-center w-8 sm:w-10 text-[10px] sm:text-[11px]"><span class="hidden sm:inline">แต้มลบ</span><span class="sm:hidden">ลบ</span></th>
                  <th class="py-2.5 px-1.5 sm:px-3 text-right w-14 sm:w-16 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-bold"><span class="hidden sm:inline">แต้มสุทธิ</span><span class="sm:hidden">สุทธิ</span></th>
                </tr>
              </thead>
              <tbody id="matchday-table-body" class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-sm">
                <!-- Rendered dynamically -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- ขวา: ตารางคะแนนรวมสะสม (Overall Standings - Royal Blue Championship Theme) -->
        <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 border-t-4 border-t-blue-600 shadow-xs relative">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3">
            <div>
              <span class="text-[10px] sm:text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold font-display flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-blue-600"></span>
                TOTAL LEADERBOARD
              </span>
              <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display mt-0.5">ตารางคะแนนรวมสะสม</h3>
            </div>
            <span id="overall-gw-pill" class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-display">
              หลังจบ GW <span id="overall-gw-num">2</span>
            </span>
          </div>

          <div class="overflow-x-auto no-scrollbar -mx-4 sm:mx-0 touch-scroll">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-100 dark:border-slate-800/80 text-[11px] font-bold text-slate-400 dark:text-slate-500 font-display bg-slate-50/50 dark:bg-slate-900/50">
                  <th class="py-2.5 px-1 sm:px-2 text-center w-7 sm:w-8">#</th>
                  <th class="py-2.5 px-1.5 sm:px-3 min-w-0">ทีม & ผู้จัดการ</th>
                  <th class="py-2.5 px-1 sm:px-3 text-center w-12 sm:w-16 text-[10px] sm:text-[11px]">GW ล่าสุด</th>
                  <th class="py-2.5 px-1.5 sm:px-3 text-right w-14 sm:w-16 text-blue-800 dark:text-blue-400 font-bold">แต้มรวม</th>
                </tr>
              </thead>
              <tbody id="overall-standings-body" class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-sm">
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

    <!-- ==================== TAB: SHI'62 SPECIAL ==================== -->
    <div id="shi62-special-view" class="tab-content hidden space-y-6">
      <!-- Rendered dynamically via app.renderShi62Special() -->
    </div>

    <!-- ==================== TAB: COMPETITION ==================== -->
    <div id="competition-view" class="tab-content hidden space-y-6">
      
      <!-- Top Overview Banner -->
      <div class="glass-card rounded-2xl px-4 py-3.5 sm:px-6 sm:py-4.5 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="competition-overview-title" class="text-base sm:text-xl font-bold text-slate-900 dark:text-white font-display">
            Competition <span class="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400 font-sans">(ข้อมูลเจาะลึกคู่แข่ง & การวิเคราะห์ขุมกำลัง)</span>
          </h2>
          <p id="competition-overview-subtitle" class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ส่องการ์ดคงเหลือของคู่แข่ง, นักเตะยอดนิยมมหาชน, ตัวทีเด็ดดิฟเฟอเรนเชียล และคำแนะนำการย้ายตัวประจำสัปดาห์
          </p>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <span id="competition-league-badge" class="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs px-3 py-1 rounded-xl font-bold font-display"></span>
          <span id="competition-gw-badge" class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs px-3 py-1 rounded-xl font-bold font-display"></span>
        </div>
      </div>

      <!-- Section 1: Card Available -->
      <div id="competition-cards-section" class="space-y-4">
        <!-- Rendered dynamically -->
      </div>

      <!-- Section 2: Important Players & Differential Players (Side-by-side Grid) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <!-- Left: Important Players (> 70%) -->
        <div id="competition-important-section" class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <!-- Rendered dynamically -->
        </div>

        <!-- Right: Differential Players (< 20%) -->
        <div id="competition-differential-section" class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <!-- Rendered dynamically -->
        </div>
      </div>

      <!-- Section 3: Transfer Suggestions -->
      <div id="competition-transfers-section" class="space-y-4">
        <!-- Rendered dynamically -->
      </div>

    </div>

    <!-- ==================== TAB 2: สรุปรางวัล & รายเดือน (PRIZES & MONTHLY VIEW) ==================== -->
    <div id="prizes-view" class="tab-content hidden space-y-4">
      
      <!-- Top Overview Banner -->
      <div id="prizes-top-banner" class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
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
      <div id="hall-of-fame-records" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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

    <!-- ==================== TAB: CONSISTENCY RADAR (ทุกลีกในระบบ) ==================== -->
    <div id="global-radar-view" class="tab-content hidden space-y-3 sm:space-y-4">
      
      <!-- Top Banner -->
      <div class="glass-card rounded-2xl p-3.5 sm:p-5 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div>
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <span id="global-radar-header-pill" class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              __RADAR_BANNER_TEXT__
            </span>
          </div>
          <h2 class="text-base sm:text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
            เรดาร์ความสม่ำเสมอของทีม (Consistency Radar)
          </h2>
          <p class="text-[11px] sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            เปรียบเทียบมาตรฐานฟอร์มการเล่น ความนิ่ง (Floor) และความแกว่ง (Spread) ของทุกทีมในระบบ ไม่จำกัดเฉพาะในลีก
          </p>
        </div>
      </div>

      <!-- 4 Superlative Highlight Cards (Mobile: 2x2 grid, Desktop: 4 columns) -->
      <div id="global-radar-records" class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <!-- Rendered dynamically -->
      </div>

      <!-- League Benchmark Ranking (จัดอันดับความแข็งแกร่งของแต่ละลีก บนลงล่าง) -->
      <div id="benchmark-ranking-card" class="glass-card rounded-2xl p-3.5 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div class="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-slate-800 mb-3 gap-2">
          <div>
            <h3 class="text-xs sm:text-base font-bold text-slate-900 dark:text-white font-display">จัดอันดับความแข็งแกร่งเฉลี่ยของแต่ละลีก</h3>
          </div>
          <div class="flex items-center gap-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-display whitespace-nowrap">
            <span>คะแนนเฉลี่ยต่อทีม / GW</span>
            <button id="benchmark-clear-filter" onclick="app.setRadarLeagueFilter('all')" class="hidden px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer">ล้างตัวกรอง ✕</button>
          </div>
        </div>
        <div id="global-radar-league-benchmarks" class="space-y-1.5 sm:space-y-2">
          <!-- Rendered dynamically -->
        </div>
      </div>

      <!-- Consistency Radar Main Table Card -->
      <div class="glass-card rounded-2xl p-3.5 sm:p-5 border border-slate-200 dark:border-slate-800">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
          <div>
            <span class="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-bold font-display">ALL-LEAGUE CONSISTENCY MATRIX</span>
            <h3 class="text-xs sm:text-base font-bold text-slate-900 dark:text-white font-display">ตารางวัดระดับความสม่ำเสมอ & ฟอร์มการเล่น <span id="radar-gw-status-badge" class="text-[10px] text-slate-500 dark:text-slate-400 font-normal"></span></h3>
          </div>

          <!-- Controls: Search & Quick Sort on Mobile -->
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <div class="relative flex-1 sm:w-64">
              <input 
                type="text" 
                id="global-radar-search-input" 
                oninput="app.handleRadarSearch(this.value)"
                placeholder="ค้นหาชื่อทีม / ผู้จัดการ..." 
                class="w-full text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-3 pr-8 py-1.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <span class="absolute right-2.5 top-2 text-slate-400 text-xs pointer-events-none">🔍</span>
            </div>
            <!-- Mobile Sort Dropdown -->
            <div class="sm:hidden flex-shrink-0">
              <select 
                id="global-radar-sort-select"
                onchange="app.setRadarSortBy(this.value)"
                class="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1.5 text-slate-700 dark:text-slate-300 font-bold focus:outline-hidden cursor-pointer"
              >
                <option value="total_net">เรียง: แต้มรวม ▼</option>
                <option value="avg">เรียง: แต้มเฉลี่ย ▼</option>
                <option value="high">เรียง: แต้มสูงสุด ▼</option>
                <option value="low">เรียง: ต่ำสุด (Floor) ▼</option>
                <option value="spread">เรียง: ความนิ่ง (แกว่งน้อย) ▲</option>
                <option value="hits">เรียง: แต้มลบน้อยสุด ▲</option>
                <option value="bench">เรียง: แต้มสำรองสูงสุด ▼</option>
                <option value="tier">เรียง: ระดับความสม่ำเสมอ ▼</option>
                <option value="team_name">เรียง: ชื่อทีม A-Z ▲</option>
              </select>
            </div>
          </div>
        </div>

        <!-- League Filter Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto touch-scroll no-scrollbar pb-2 mb-2.5 border-b border-slate-100 dark:border-slate-800 text-xs" id="global-radar-league-pills">
          <!-- Rendered dynamically -->
        </div>

        <!-- Mobile Scroll Affordance Bar -->
        <div class="sm:hidden flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 px-1 py-1 mb-1.5">
          <span class="flex items-center gap-1 font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span id="mobile-radar-sort-label">เรียงตามคะแนนรวม (# อันดับรวม)</span>
          </span>
          <span class="text-slate-400 font-medium">👉 เลื่อนขวาดูสถิติเพิ่มเติม</span>
        </div>


        <!-- Table Container with Locked/Sticky Headers & Columns -->
        <div class="overflow-auto max-h-[65vh] sm:max-h-[75vh] no-scrollbar -mx-3.5 sm:mx-0 touch-scroll rounded-xl border border-slate-200/80 dark:border-slate-800/80">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 font-display">
                <th onclick="app.setRadarSortBy('total_net')" class="py-2.5 px-1 sm:px-2 text-center w-[28px] min-w-[28px] max-w-[28px] sm:w-[36px] sm:min-w-[36px] whitespace-nowrap sticky top-0 left-0 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-40 cursor-pointer hover:text-blue-600 transition-colors select-none" title="คลิกเพื่อเรียงตามอันดับคะแนนรวม">#</th>
                <th onclick="app.setRadarSortBy('team_name')" class="py-2.5 px-2 sm:px-3 min-w-[125px] sm:min-w-0 max-w-[150px] sm:max-w-none whitespace-nowrap sticky top-0 left-[28px] sm:left-[36px] bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-40 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] dark:shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)] cursor-pointer hover:text-blue-600 transition-colors select-none" title="คลิกเพื่อเรียงตามชื่อทีม">
                  <span id="th-radar-team_name">ทีม & ผู้จัดการ</span>
                </th>
                <th onclick="app.setRadarSortBy('total_net')" class="py-2.5 px-1.5 sm:px-2 text-center whitespace-nowrap sticky top-0 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none text-blue-600 dark:text-blue-400 font-black" title="คลิกเพื่อเรียงตามคะแนนรวมสุทธิ">
                  <span id="th-radar-total_net"><span class="hidden sm:inline">คะแนนรวม ▼</span><span class="sm:hidden">แต้มรวม ▼</span></span>
                </th>
                <th onclick="app.setRadarSortBy('avg')" class="py-2.5 px-1.5 sm:px-2 text-center whitespace-nowrap sticky top-0 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none" title="คลิกเพื่อเรียงตามแต้มเฉลี่ยต่อสัปดาห์">
                  <span id="th-radar-avg"><span class="hidden sm:inline">แต้มเฉลี่ย</span><span class="sm:hidden">เฉลี่ย</span></span>
                </th>
                <th onclick="app.setRadarSortBy('high')" class="py-2.5 px-1.5 sm:px-2 text-center whitespace-nowrap sticky top-0 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none" title="คลิกเพื่อเรียงตามแต้มสัปดาห์สูงสุด">
                  <span id="th-radar-high"><span class="hidden sm:inline">สูงสุด</span><span class="sm:hidden">สูงสุด</span></span>
                </th>
                <th onclick="app.setRadarSortBy('low')" class="py-2.5 px-1.5 sm:px-2 text-center whitespace-nowrap sticky top-0 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none" title="คลิกเพื่อเรียงตามแต้มต่ำสุด">
                  <span id="th-radar-low"><span class="hidden sm:inline">ต่ำสุด (Floor)</span><span class="sm:hidden">ต่ำสุด</span></span>
                </th>
                <th onclick="app.setRadarSortBy('spread')" class="py-2.5 px-1.5 sm:px-2 text-center whitespace-nowrap sticky top-0 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none" title="คลิกเพื่อเรียงตามความแกว่ง (น้อยไปมาก = นิ่งกว่า)">
                  <span id="th-radar-spread"><span class="hidden sm:inline">ความแกว่ง (Spread)</span><span class="sm:hidden">แกว่ง</span></span>
                </th>
                <th onclick="app.setRadarSortBy('hits')" class="py-2.5 px-1.5 sm:px-2 text-center whitespace-nowrap sticky top-0 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none" title="คลิกเพื่อเรียงตามแต้มลบสะสม">
                  <span id="th-radar-hits"><span class="hidden sm:inline">แต้มลบ</span><span class="sm:hidden">ลบ</span></span>
                </th>
                <th onclick="app.setRadarSortBy('bench')" class="py-2.5 px-1.5 sm:px-2 text-center whitespace-nowrap sticky top-0 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none" title="คลิกเพื่อเรียงตามแต้มตัวสำรองตกน้ำสะสม">
                  <span id="th-radar-bench"><span class="hidden sm:inline">สำรอง</span><span class="sm:hidden">สำรอง</span></span>
                </th>
                <th onclick="app.setRadarSortBy('tier')" class="py-2.5 px-2 sm:px-3 text-center whitespace-nowrap sticky top-0 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none" title="Consistency Tier: 💎 S-Tier (หัวกะทิยอดเยี่ยมและนิ่งจริง) | ⚡ Volatile (แต้มสวิงสูง) | 🟢 A-Tier (มาตรฐานสูง) | 🟡 B-Tier (ระดับกลางคงที่) | ⚪ C-Tier (ระดับพัฒนาการ)">
                  <span id="th-radar-tier"><span class="hidden sm:inline">ระดับความสม่ำเสมอ</span><span class="sm:hidden">ระดับ</span></span>
                </th>
              </tr>
            </thead>
            <tbody id="global-radar-table-body" class="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
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

    <!-- ==================== TAB 6: เกี่ยวกับแพลตฟอร์ม (ABOUT VIEW) ==================== -->
    <div id="about-view" class="tab-content hidden space-y-4">
      
      <!-- Top About Overview Banner -->
      <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span class="text-[10px] sm:text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold font-display">PLATFORM ARCHITECTURE & CAPABILITIES</span>
          <h2 class="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white font-display mt-0.5">เกี่ยวกับแพลตฟอร์ม (About Platform)</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ระบบรายงานผลสดและบริหารจัดการลีก Fantasy Premier League กึ่งอัตโนมัติเต็มรูปแบบ</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs px-3 py-1 rounded-xl font-bold font-display">SERVERLESS JAMSTACK</span>
          <span class="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 text-xs px-3 py-1 rounded-xl font-bold font-display">ZERO RUNTIME COST</span>
        </div>
      </div>

      <!-- 6 Feature Cards Grid (Monochrome Professional Emerald Theme) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        
        <!-- Card 1: Platform Overview -->
        <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between shadow-2xs">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3.5">
              <div class="flex items-center gap-2.5">
                <span class="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center font-mono border border-emerald-200/60 dark:border-emerald-800/60">01</span>
                <div>
                  <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-[15px] tracking-tight">ภาพรวมและวิสัยทัศน์ของแพลตฟอร์ม</h3>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Platform Overview</p>
                </div>
              </div>
            </div>
            <ul class="space-y-3">
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="flex-1">ระบบรายงานผลการแข่งขันและบริหารจัดการลีก Fantasy Premier League กึ่งอัตโนมัติเต็มรูปแบบ ระบบเชื่อมต่อข้อมูลทางการเพื่อให้บริการสมาชิกในลีกตลอด 24 ชั่วโมง</span>
              </li>
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="flex-1">ระบบขจัดความล่าช้าในการคำนวณคะแนนของแอปทางการ และลดภาระของผู้จัดลีก ไม่ต้องบันทึกคะแนนลงตาราง Excel ด้วยมืออีกต่อไป</span>
              </li>
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="flex-1">ระบบทำงานบนสถาปัตยกรรม Serverless Jamstack โฮสต์บนเครือข่าย CDN จึงไม่มีต้นทุนค่าดูแลเซิร์ฟเวอร์รายเดือน และรองรับจำนวนผู้เข้าชมพร้อมกันได้ไม่จำกัด</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Card 2: Real-Time Matchday Engine -->
        <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between shadow-2xs">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3.5">
              <div class="flex items-center gap-2.5">
                <span class="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center font-mono border border-emerald-200/60 dark:border-emerald-800/60">02</span>
                <div>
                  <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-[15px] tracking-tight">ฟังก์ชันรายงานผลสดระหว่างแข่งขัน</h3>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Real-Time Matchday Engine</p>
                </div>
              </div>
            </div>
            <ul class="space-y-3">
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="flex-1">ระบบดึงคะแนนดิบและคะแนนโบนัสของนักเตะทุกคนระหว่างการแข่งขันแบบสดทุกนาที</span>
              </li>
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="flex-1">ระบบตรวจสอบนักเตะตัวจริงที่ไม่ถูกส่งลงสนาม และดึงตัวสำรองขึ้นมาคำนวณแต้มให้ทันทีระหว่างเกม ผู้เล่นไม่ต้องรอผลการประมวลผลข้ามคืนของระบบทางการ</span>
              </li>
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="flex-1">ระบบปรับคะแนนคูณสองให้รองกัปตันทันทีเมื่อสโมสรของกัปตันตัวจริงลงแข่งขันจบแล้วและกัปตันไม่ได้ลงเล่น</span>
              </li>
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="flex-1">ระบบสร้างบทวิเคราะห์เหตุการณ์สดที่ตอบสนองต่อทุกประตู ใบแดง และการสลับอันดับตารางคะแนน ช่วยสร้างบรรยากาศการรับชมในกลุ่มเพื่อน</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Card 3: Treasury and Prize System -->
        <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between shadow-2xs">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3.5">
              <div class="flex items-center gap-2.5">
                <span class="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center font-mono border border-emerald-200/60 dark:border-emerald-800/60">03</span>
                <div>
                  <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-[15px] tracking-tight">ฟังก์ชันระบบบัญชีกองกลางและเงินรางวัล</h3>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Treasury and Prize System</p>
                </div>
              </div>
            </div>
            <ul class="space-y-3">
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="flex-1">ระบบรองรับการตั้งค่าแยกอิสระของแต่ละมินิลีก พร้อมระบบเส้นทาง URL เฉพาะตัวสำหรับแต่ละกลุ่มผู้เล่น</span>
              </li>
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="flex-1">ระบบคำนวณแชมป์ประจำสัปดาห์จากคะแนนสุทธิหลังหักแต้มย้ายทีม และรองรับการแบ่งงวดเคลียร์เงินรางวัลเป็นรอบๆ ตลอด 38 สัปดาห์</span>
              </li>
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <div class="flex-1">
                  <span class="font-bold text-slate-800 dark:text-slate-200">โมเดลเงินรางวัลประจำเดือน:</span> ระบบสรุปคะแนนผู้จัดการทีมยอดเยี่ยมประจำเดือน พร้อมกลไก Tie-breaker ตัดสินผลเสมอด้วยจำนวนการย้ายตัวอย่างโปร่งใส
                </div>
              </li>
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="flex-1">ระบบคำนวณค่าปรับแบบลดหลั่นตามลำดับ พร้อมระบบเฉลี่ยค่าปรับกรณีมีทีมแต้มเท่ากัน และสรุปยอดเงินสะสมสุทธิเข้ากองกลางอัตโนมัติ</span>
              </li>
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="flex-1">ระบบคัดกรองทีมแอดมินหรือทีมที่ไม่ลงขันออกจากระบบเงินรางวัล โดยไม่ส่งผลกระทบต่ออันดับบนตารางคะแนนทางการ</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Card 4: Tactical UX and Interface -->
        <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between shadow-2xs">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3.5">
              <div class="flex items-center gap-2.5">
                <span class="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center font-mono border border-emerald-200/60 dark:border-emerald-800/60">04</span>
                <div>
                  <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-[15px] tracking-tight">ฟังก์ชันการแสดงผลและประสบการณ์ผู้ใช้</h3>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Tactical UX and Interface</p>
                </div>
              </div>
            </div>
            <ul class="space-y-3">
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="flex-1">ระบบจัดวาง 11 ตัวจริงและตัวสำรองลงบนแผนผังสนามตามตำแหน่งการเล่นจริง พร้อมแสดงคะแนนและสถานะลงสนามของนักเตะแต่ละคน</span>
              </li>
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="flex-1">ระบบแสดงป้ายสัญลักษณ์เมื่อผู้จัดการทีมเปิดใช้งานชิป Triple Captain, Bench Boost, Free Hit หรือ Wildcard ไว้อย่างชัดเจน</span>
              </li>
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="flex-1">ระบบได้รับการออกแบบโครงสร้างแบบ Responsive หน้าเว็บแสดงผลได้สมบูรณ์บนจอมือถือ โดยไม่มีอาการเลื่อนล้นจอแนวนอน</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Card 5: Analytics and Export -->
        <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between shadow-2xs">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3.5">
              <div class="flex items-center gap-2.5">
                <span class="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center font-mono border border-emerald-200/60 dark:border-emerald-800/60">05</span>
                <div>
                  <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-[15px] tracking-tight">ฟังก์ชันวิเคราะห์ข้อมูลและการส่งออกบัญชี</h3>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Analytics and Export</p>
                </div>
              </div>
            </div>
            <ul class="space-y-3">
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="flex-1">ระบบบันทึกรายการย้ายเข้าและย้ายออกในแต่ละสัปดาห์ พร้อมคำนวณผลต่างคะแนนที่ได้หรือเสียจากการหักลบแต้มย้ายทีม</span>
              </li>
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="flex-1">ระบบเชื่อมต่อแบบจำลองการเรียนรู้ของเครื่องเพื่อแนะนำรายชื่อนักเตะที่มีโอกาสทำคะแนนสูงในสัปดาห์ถัดไป</span>
              </li>
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="flex-1">ผู้จัดลีกสามารถดาวน์โหลดตารางคะแนนสรุปยอดเงินรางวัลและค่าปรับเป็นไฟล์ Excel ได้ทันทีด้วยการกดปุ่มเพียงครั้งเดียว</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Card 6: System Reliability -->
        <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between shadow-2xs">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3.5">
              <div class="flex items-center gap-2.5">
                <span class="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center font-mono border border-emerald-200/60 dark:border-emerald-800/60">06</span>
                <div>
                  <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-[15px] tracking-tight">ความมั่นคงของระบบและความปลอดภัยของข้อมูล</h3>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 font-mono">System Reliability</p>
                </div>
              </div>
            </div>
            <ul class="space-y-3">
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="flex-1">ระบบใช้กลไกหน่วงเวลาแบบ Exponential Backoff และ Random Jitter เพื่อป้องกันการถูกปฏิเสธคำขอจากเซิร์ฟเวอร์ข้อมูล</span>
              </li>
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="flex-1">ระบบเขียนไฟล์แคชด้วยเทคนิค Atomic Replacement และสร้างสำเนาไฟล์สำรองคู่ขนาน ป้องกันปัญหาไฟล์ข้อมูลสูญหาย</span>
              </li>
              <li class="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="flex-1">ระบบทำงานผ่านกระบวนการอัตโนมัติของ GitHub Actions อัปเดตข้อมูลขึ้นหน้าเว็บแบบอัตโนมัติโดยไม่ต้องมีผู้ควบคุม</span>
              </li>
            </ul>
          </div>
        </div>

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
  <div id="team-modal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs hidden transition-all duration-200 overflow-y-auto" onclick="if (event.target === this) app.closeTeamModal()">
    <div class="bg-white dark:bg-[#0d0d0f] rounded-3xl p-3 sm:p-6 max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92dvh] sm:max-h-[94vh] overflow-y-auto overflow-x-hidden my-auto" onclick="event.stopPropagation()">
      
      <!-- Header (Sticky at top when scrolling through pitch and bench) -->
      <div class="sticky top-0 bg-white/95 dark:bg-[#0d0d0f]/95 backdrop-blur-md z-30 -mt-3 sm:-mt-6 -mx-3 sm:-mx-6 px-3 sm:px-6 pt-3 sm:pt-6 pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-slate-800 mb-3 sm:mb-4 flex items-center justify-between shadow-2xs">
        <div class="min-w-0 pr-2">
          <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span class="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold font-display">ข้อมูลขุมกำลัง & การจัดทัพ</span>
            <span id="team-modal-chip-badge" class="hidden"></span>
          </div>
          <h3 id="team-modal-title" class="text-sm xs:text-base sm:text-xl font-bold text-slate-900 dark:text-white truncate mt-0.5">ชื่อทีม</h3>
          <p id="team-modal-subtitle" class="text-[10.5px] xs:text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <span id="team-modal-manager" class="truncate max-w-[140px] xs:max-w-[180px] sm:max-w-none">ผู้จัดการ: -</span>
            <span>•</span>
            <span id="team-modal-formation" class="font-bold text-slate-700 dark:text-slate-300">แผน: -</span>
            <span>•</span>
            <span id="team-modal-pts" class="font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">แต้มสด: - pts</span>
          </p>
        </div>
        <button onclick="app.closeTeamModal()" class="w-8 h-8 sm:w-8 sm:h-8 min-w-[32px] min-h-[32px] rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold transition-colors cursor-pointer text-base flex-shrink-0 active:scale-95" aria-label="Close modal">✕</button>
      </div>

      <!-- Authentic FPL Pitch (Vertical 4-Tier: GKP -> DEF -> MID -> FWD) -->
      <div class="fpl-pitch rounded-2xl mb-3 sm:mb-3.5 relative overflow-hidden shadow-inner flex flex-col justify-between py-2 sm:py-3 px-1 w-full max-w-full">
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
      <div class="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-2.5 sm:p-4 border border-slate-200/80 dark:border-slate-800/80">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold font-display">ตัวสำรอง (Substitutes)</span>
          <span id="team-modal-bench-total" class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold font-display"></span>
        </div>
        <div id="team-bench-container" class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2.5">
          <!-- 4 Bench Player Cards -->
        </div>
      </div>

    </div>
  </div>

  <!-- 6.2 หน้าต่างข้อมูล Projected Points Modal (FPL Gameweek Explanation) -->
  <div id="projected-points-modal" class="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/75 backdrop-blur-xs hidden transition-all duration-200" onclick="if (event.target === this) app.closeProjectedPointsModal()">
    <div class="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92dvh] sm:max-h-[94vh] overflow-y-auto" onclick="event.stopPropagation()">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
        <div class="flex items-center gap-2">
          <span class="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm font-display">Pts</span>
          <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">Projected Points (คะแนนคาดการณ์)</h3>
        </div>
        <button onclick="app.closeProjectedPointsModal()" class="w-9 h-9 sm:w-8 sm:h-8 min-w-[36px] min-h-[36px] rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold transition-colors cursor-pointer text-base active:scale-95" aria-label="Close modal">✕</button>
      </div>
      <div class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2.5 leading-relaxed">
        <p>
          คะแนนคาดการณ์ (Projected Points) คือการประเมินคะแนนโดยประมาณที่นักเตะน่าจะทำได้ในสัปดาห์ถัดไป จาก AI Algorithm
        </p>
        <div class="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 rounded-xl p-3 text-xs text-blue-900 dark:text-blue-200">
          <strong class="font-bold">เงื่อนไขสำคัญ:</strong> ข้อมูลนี้สมมติว่าผู้เล่นมีชื่อลงเล่นเป็นตัวจริงในสนาม ผู้จัดการทีมควรตรวจสอบอาการบาดเจ็บหรือโอกาสการโรเตชันของนักเตะก่อนตัดสินใจกดย้ายทีมจริง
        </div>
      </div>
      <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button onclick="app.closeProjectedPointsModal()" class="px-4 py-2 bg-slate-900 dark:bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors cursor-pointer active:scale-95">
          เข้าใจแล้ว
        </button>
      </div>
    </div>
  </div>

  <!-- 6.3 หน้าต่าง Text Summary Modal สำหรับส่ง LINE -->
  <div id="text-summary-modal" class="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/75 backdrop-blur-xs hidden transition-all duration-200" onclick="if (event.target === this) app.closeTextSummaryModal()">
    <div class="bg-white rounded-3xl p-4 sm:p-6 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[92dvh] sm:max-h-[94vh] flex flex-col justify-between overflow-y-auto" onclick="event.stopPropagation()">
      <div>
        <div class="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 id="modal-summary-title" class="text-base sm:text-lg font-bold text-slate-900 font-display">สรุปผล Gameweek</h3>
          </div>
          <button onclick="app.closeTextSummaryModal()" class="w-9 h-9 sm:w-8 sm:h-8 min-w-[36px] min-h-[36px] rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 font-bold transition-colors cursor-pointer text-base active:scale-95" aria-label="Close modal">✕</button>
        </div>
        
        <p class="text-xs text-slate-500 mb-3">ข้อความถูกจัดรูปแบบสำหรับส่งเข้ากลุ่ม LINE เรียบร้อยแล้ว:</p>
        
        <div class="relative">
          <textarea id="text-summary-content" readonly class="w-full h-60 sm:h-72 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-[13px] font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none selection:bg-slate-900 selection:text-white leading-relaxed"></textarea>
        </div>
      </div>

      <div class="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        <span id="modal-copy-indicator" class="text-xs text-emerald-600 font-bold flex items-center gap-1.5 opacity-0 transition-opacity duration-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          คัดลอกลงคลิปบอร์ดแล้ว!
        </span>
        <div class="flex items-center gap-2 ml-auto">
          <button onclick="app.closeTextSummaryModal()" class="px-4 py-2 min-h-[38px] rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer active:scale-95">
            ปิด
          </button>
          <button id="btn-modal-copy" onclick="app.copyFromModal()" class="px-4 sm:px-5 py-2 min-h-[38px] rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5">
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
    const SHI62_SPECIAL_DATA = __SHI62_SPECIAL_DATA_JSON__;
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

      static generateFreshNote(gwNumber, gwData, leagueName, forceRandom = false, nonPrizeTeams = [], leagueData = null, isWeeklyPrize = true, useTieBreaker = false) {
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

        const getPlayerScores = (eid) => {
          if (!leagueData || !leagueData.squads) return [];
          const sq = leagueData.squads[`${eid}_${gwNumber}`];
          if (!sq || !sq.starting) return [];
          const pts = sq.starting.map(p => Number(p.points) || 0);
          if (sq.chip === 'bboost' && sq.bench) pts.push(...sq.bench.map(p => Number(p.points) || 0));
          return pts.sort((a, b) => b - a);
        };
        const cmpPlayerScores = (eidA, eidB) => {
          const sA = getPlayerScores(eidA), sB = getPlayerScores(eidB);
          for (let i = 0; i < Math.max(sA.length, sB.length); i++) {
            const vA = sA[i] !== undefined ? sA[i] : -Infinity;
            const vB = sB[i] !== undefined ? sB[i] : -Infinity;
            if (vA !== vB) return vB - vA;
          }
          return 0;
        };

        const sorted = [...gwData.results].map(r => ({
          ...r,
          team_name: clean(r.team_name),
          player_name: clean(r.player_name),
          captain: clean(r.captain)
        })).sort((a, b) => {
          const diff = (b[scoreKey] - a[scoreKey]) || (b.net_points - a.net_points) || (b.points - a.points);
          if (diff !== 0) return diff;
          if (useTieBreaker) return cmpPlayerScores(a.entry_id, b.entry_id);
          return 0;
        });

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
        let winners = (eligibleSorted.length > 0 ? eligibleSorted : sorted).filter(r => r[scoreKey] === topPts);
        if (useTieBreaker && winners.length > 1) {
          const topLeader = winners[0];
          winners = winners.filter(w => cmpPlayerScores(w.entry_id, topLeader.entry_id) === 0);
        }
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
        let pathLeague = this.detectPathLeague();

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
        let hashTab = '';
        if (window.location && window.location.hash) {
          const rawHash = window.location.hash.replace('#', '');
          if (this.multiData.leagues[rawHash]) {
            hashLeague = rawHash;
          } else if (rawHash.includes('tab=')) {
            try {
              const hashParams = new URLSearchParams(rawHash.split('?')[1] || rawHash);
              hashTab = hashParams.get('tab') || '';
            } catch (e) {}
          } else if (rawHash) {
            hashTab = rawHash;
          }
        }

        let savedLeague = '';
        let savedTab = '';
        try {
          if (typeof localStorage !== 'undefined') {
            savedLeague = localStorage.getItem('fpl_mini_active_league') || '';
            savedTab = localStorage.getItem('fpl_mini_active_tab') || '';
          }
        } catch (e) {}

        if (pathLeague && this.multiData.leagues[pathLeague]) {
          this.activeLeagueId = pathLeague;
        } else if (queryLeague && this.multiData.leagues[queryLeague]) {
          this.activeLeagueId = queryLeague;
        } else if (hashLeague && this.multiData.leagues[hashLeague]) {
          this.activeLeagueId = hashLeague;
        } else if (savedLeague && this.multiData.leagues[savedLeague]) {
          this.activeLeagueId = savedLeague;
        } else if (defaultLeagueId && this.multiData.leagues[defaultLeagueId]) {
          this.activeLeagueId = defaultLeagueId;
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
        this.activeTab = this.normalizeTab(queryTab || hashTab || savedTab || 'gameweek-view');
        this.liveNotesCache = {};
        this.shi62Data = (typeof SHI62_SPECIAL_DATA !== 'undefined') ? SHI62_SPECIAL_DATA : null;
        this.activeShi62GW = null;
        this.radarSearchQuery = '';
        this.radarLeagueFilter = 'all';
        this.radarSortBy = 'total_net';
        this.radarSortOrder = 'desc';
      }

      normalizeTab(tabName) {
        if (!tabName) return 'gameweek-view';
        let t = String(tabName).trim().toLowerCase();
        if (t === 'live' || t === 'gw' || t === 'gameweek') return 'gameweek-view';
        if (t === 'highlight' || t === 'highlights' || t === 'weekly-highlight') return 'highlights-view';
        if (t === 'competition' || t === 'comp' || t === 'standings') return 'competition-view';
        if (t === 'prize' || t === 'prizes' || t === 'reward' || t === 'rewards') return 'prizes-view';
        if (t === 'hof' || t === 'hall-of-fame' || t === 'halloffame') return 'hall-of-fame-view';
        if (t === 'global-radar' || t === 'radar' || t === 'global' || t === 'all-leagues' || t === 'consistency-radar' || t === 'consistency') return 'global-radar-view';
        if (t === 'cup') return 'cup-view';
        if (t === 'shi62' || t === 'shi62-special' || t === 'special' || t === 'beta') return 'shi62-special-view';
        if (t === 'rule' || t === 'rules') return 'rules-view';
        if (t === 'about' || t === 'about-us' || t === 'about-me' || t === 'feature' || t === 'features' || t === 'function' || t === 'functions' || t === 'capabilities') return 'about-view';
        if (!t.endsWith('-view')) return t + '-view';
        return t;
      }

      detectPathLeague() {
        if (typeof window !== 'undefined' && window.location && window.location.pathname) {
          const parts = window.location.pathname.split('/').filter(Boolean);
          for (let p of parts) {
            if (this.multiData && this.multiData.leagues && this.multiData.leagues[p]) {
              return p;
            }
          }
        }
        return '';
      }

      init() {
        this.initTheme();
        this.renderLeagueDropdown();
        this.updateHeaderInfo();
        this.initTabNavigation();
        this.renderAll();
        if (this.activeTab) {
          this.switchTab(this.activeTab, true);
        }
        this.initVisitorCounter();

        // Listen for browser Back/Forward navigation
        if (typeof window !== 'undefined' && window.addEventListener) {
          window.addEventListener('popstate', () => {
            try {
              const urlParams = new URLSearchParams((window.location && window.location.search) ? window.location.search : '');
              const qLeague = urlParams.get('league') || this.detectPathLeague();
              const qTab = this.normalizeTab(urlParams.get('tab'));
              const qGW = urlParams.get('gw');
              if (qLeague && this.multiData.leagues[qLeague] && qLeague !== this.activeLeagueId) {
                this.switchLeague(qLeague, true);
              }
              if (qTab && qTab !== this.activeTab) {
                this.switchTab(qTab, true);
              }
              if (qGW && Number(qGW) !== this.selectedGW) {
                this.selectGW(Number(qGW), true);
              }
            } catch (e) {}
          });
        }
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

      switchLeague(leagueId, fromPopstate = false) {
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
        if (!fromPopstate) {
          try {
            if (window.history && (window.history.pushState || window.history.replaceState)) {
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
                  window.history.pushState(null, '', newPath);
                } else {
                  window.history.pushState(null, '', basePath + '?league=' + this.activeLeagueId);
                }
              } else {
                // Local file:// protocol: never strip directories or trigger SecurityError
                const currentPath = window.location.pathname;
                window.history.replaceState(null, '', currentPath + '?league=' + this.activeLeagueId);
              }
            }
          } catch (e) {
            console.warn('history state update skipped:', e);
            try {
              window.location.hash = this.activeLeagueId;
            } catch (err) {}
          }
        }

        const menu = document.getElementById('league-dropdown-menu');
        const chevron = document.getElementById('league-switcher-chevron');
        if (menu) menu.classList.add('hidden');
        if (chevron) chevron.style.transform = 'rotate(0deg)';

        this.renderLeagueDropdown();
        this.updateHeaderInfo();
        this.renderAll();
        if (this.activeTab) {
          this.switchTab(this.activeTab, true);
        }
      }

      renderLeagueDropdown() {
        const container = document.getElementById('league-dropdown-options');
        if (!container) return;

        // เรียงลำดับ: ลีก 40700 อยู่ด้านบนสุดเสมอ และลีกอื่นๆ เรียงตาม League ID จากน้อยไปมาก
        const allLeagueIds = Object.keys(this.multiData.leagues || {});
        allLeagueIds.sort((a, b) => {
          const idA = String(a);
          const idB = String(b);
          if (idA === '40700') return -1;
          if (idB === '40700') return 1;
          return Number(idA) - Number(idB);
        });

        let html = '';
        allLeagueIds.forEach(lid => {
          const lData = this.multiData.leagues[lid];
          if (!lData) return;
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
            lastSyncBadge.className = 'inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 px-2 sm:px-2.5 py-0.5 rounded-full font-display shadow-2xs';
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

        // Check Shi'62 Special Feature Flag
        const shi62TabBtn = document.getElementById('tab-btn-shi62-special');
        const isShi62 = String(this.activeLeagueId) === '187827';
        if (shi62TabBtn) {
          if (isShi62) {
            shi62TabBtn.classList.remove('hidden');
          } else {
            shi62TabBtn.classList.add('hidden');
            if (this.activeTab === 'shi62-special-view') {
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

      switchTab(target, fromPopstate = false) {
        let normalized = this.normalizeTab(target);
        let targetView = document.getElementById(normalized);
        if (!targetView) {
          normalized = 'gameweek-view';
          targetView = document.getElementById('gameweek-view');
        }
        this.activeTab = normalized;

        document.querySelectorAll('.tab-content').forEach(view => view.classList.add('hidden'));
        if (targetView) targetView.classList.remove('hidden');

        document.querySelectorAll('.tab-nav-btn').forEach(btn => {
          const isTarget = btn.getAttribute('data-tab-target') === this.activeTab;
          let cls = isTarget 
            ? 'tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-slate-900 text-white shadow-xs dark:bg-blue-600 dark:text-white'
            : 'tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800';
          if (btn.id === 'tab-btn-cup' && !Boolean(this.config && this.config.features && this.config.features.has_cup)) {
            cls += ' hidden';
          }
          if (btn.id === 'tab-btn-shi62-special' && String(this.activeLeagueId) !== '187827') {
            cls += ' hidden';
          }
          btn.className = cls;
        });

        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('fpl_mini_active_tab', this.activeTab);
          }
        } catch (e) {}

        if (!fromPopstate) {
          try {
            if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
              const urlParams = new URLSearchParams(window.location.search || '');
              const cleanTab = this.activeTab.replace('-view', '');
              if (cleanTab === 'gameweek') urlParams.delete('tab');
              else urlParams.set('tab', cleanTab);
              const newSearch = urlParams.toString();
              const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '') + window.location.hash;
              window.history.replaceState(null, '', newUrl);
            }
          } catch (e) {}
        }

        this.updateHighlightsTabBlink();
        this.renderCurrentTab();
      }

      updateHighlightsTabBlink() {
        const liveTabBtn = document.getElementById('tab-btn-live');
        const hlTabBtn = document.getElementById('tab-btn-highlights');
        const compTabBtn = document.getElementById('tab-btn-competition');
        const gwKey = String(this.selectedGW);
        const gwData = this.data.gameweeks ? this.data.gameweeks[gwKey] : null;
        const isFinished = gwData ? Boolean(gwData.is_finished) : false;

        // สลับการกระพริบระหว่าง [LIVE & Weekly Highlight] กับ [Competition]:
        // 1. ขณะที่เกมวีคกำลังแข่งขัน (isFinished = false): LIVE และ Weekly Highlight กระพริบสีเขียว ส่วน Competition หยุดกระพริบ
        // 2. เมื่อเกมวีคจบการแข่งขันแล้ว (isFinished = true): LIVE และ Weekly Highlight หยุดกระพริบ ส่วน Competition ขึ้นกระพริบแทน เพื่อเตือนให้ User เข้ามาดู/วางแผนจัดตัวก่อนสัปดาห์ถัดไปจะเริ่ม
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

          if (compTabBtn) {
            const isCompActive = this.activeTab === 'competition-view';
            if (isCompActive) {
              compTabBtn.className = 'tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-slate-900 text-white shadow-xs dark:bg-blue-600 dark:text-white border border-transparent';
            } else {
              compTabBtn.className = 'tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800';
            }
            compTabBtn.classList.remove('tab-pulse-comp', 'tab-pulse-comp-active');
          }
        } else {
          // หากจบการแข่งขันเกมวีคนั้นแล้ว ทั้งสองปุ่ม (LIVE และ Weekly Highlight) จะหยุดกระพริบ และกลับสู่โทนสีปกติ
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

          // Competition ขึ้นกระพริบแทน!
          if (compTabBtn) {
            const isCompActive = this.activeTab === 'competition-view';
            if (isCompActive) {
              compTabBtn.className = 'tab-nav-btn tab-pulse-comp-active flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-blue-600 text-white border border-blue-500 shadow-xs dark:bg-blue-600 dark:text-white dark:border-blue-400';
            } else {
              compTabBtn.className = 'tab-nav-btn tab-pulse-comp flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 text-blue-600 dark:text-blue-400 border border-blue-500/80 bg-blue-500/10 hover:bg-blue-500/20';
            }
          }
        }
      }

      renderAll() {
        this.renderGWSelector();
        this.renderGameweekView();
        this.renderHighlightsView();
        this.renderCompetitionView();
        this.renderPrizesView();
        this.renderHallOfFameView();
        this.renderGlobalRadarView();
        this.renderCupView();
        this.renderRulesView();
        if (this.shi62Data && String(this.activeLeagueId) === '187827') {
          this.renderShi62Special();
        }
        this.updateHighlightsTabBlink();
      }

      renderCurrentTab() {
        if (this.activeTab === 'gameweek-view') this.renderGameweekView();
        else if (this.activeTab === 'highlights-view') this.renderHighlightsView();
        else if (this.activeTab === 'competition-view') this.renderCompetitionView();
        else if (this.activeTab === 'prizes-view') this.renderPrizesView();
        else if (this.activeTab === 'hall-of-fame-view') this.renderHallOfFameView();
        else if (this.activeTab === 'global-radar-view') this.renderGlobalRadarView();
        else if (this.activeTab === 'cup-view') this.renderCupView();
        else if (this.activeTab === 'rules-view') this.renderRulesView();
        else if (this.activeTab === 'shi62-special-view') this.renderShi62Special();
        else if (this.activeTab === 'about-view') {
          // Static content
        }
      }

selectShi62GW(gwName) {
        this.activeShi62GW = gwName;
        this.renderShi62Special();
      }

      copyShi62LINEResult(gwName) {
        if (!this.shi62Data) return;
        const gw = (this.shi62Data.gameweeks || []).find(g => g.name === gwName);
        if (!gw) return;

        const gwDisplayName = gw.name.startsWith('GW') ? gw.name : `GW${gw.name}`;
        let lines = [];
        lines.push(`สรุปผล Extra ${gwDisplayName}`);
        lines.push(`---------------------------------`);
        lines.push(`⚽ ผลประจำสัปดาห์ (${gwDisplayName})`);
        (gw.summary || []).forEach((s, i) => {
          const sign = s.net > 0 ? '+' : '';
          const pushStr = s.push > 0 ? ` ${s.push}D` : '';
          lines.push(`${i + 1}. ${s.player.display_name}: ${sign}${Number(s.net).toLocaleString()} (${s.won}W ${s.lost}L${pushStr})`);
        });
        lines.push(`---------------------------------`);
        lines.push(`💰 พูลสัปดาห์นี้: ${Number(gw.total_pool).toLocaleString()} บาท (${gw.matches.length} คู่)`);
        lines.push(`---------------------------------`);

        if (gw.matches && gw.matches.length > 0) {
          lines.push(`📋 ผลการแข่งขัน (${gwDisplayName}):`);
          const formatPlayerName = (name) => {
            if (!name) return '';
            const clean = name.trim();
            if (clean.toLowerCase() === 'pong+') return 'Pong+';
            return clean.charAt(0).toUpperCase() + clean.slice(1);
          };

          gw.matches.forEach(m => {
            if (m.winners && m.winners.length > 0) {
              const winNames = m.winners.map(formatPlayerName).join(', ');
              lines.push(`• ${m.title} ➔ ${m.winning_option} ✅ [${winNames}]`);
            } else {
              const winSide = m.winning_option || 'ยกเลิก';
              lines.push(`• ${m.title} ➔ ${winSide} (ไม่มีคนถูก)`);
            }
          });
          lines.push(`---------------------------------`);
        }

        lines.push(`🏆 สรุปยอดสะสม Extra:`);

        (this.shi62Data.cumulative_standings || []).forEach((c, idx) => {
          const sign = c.net > 0 ? '+' : '';
          lines.push(`${idx + 1}. ${c.player.display_name}: ${sign}${Number(c.net).toLocaleString()}`);
        });

        lines.push(`---------------------------------`);
        lines.push(`🌐 https://asawamanasak.github.io/fpl-mini/187827`);

        const textToCopy = lines.join(String.fromCharCode(10));
        const onCopied = () => this.showCopiedToast(`คัดลอกสรุปผล ${gw.name} สำหรับ LINE เรียบร้อย`);
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(onCopied).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            onCopied();
          });
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          onCopied();
        }
      }

      copyShi62PrizesLINEResult() {
        if (!this.shi62Data) return;
        const maxGW = Number(this.multiData && this.multiData.max_gw) || 7;
        let lines = [];
        lines.push(`สรุปรางวัล (FPL & Extra) GW${maxGW}`);
        lines.push(`---------------------------------`);
        lines.push(`🏆 สรุปรางวัล:`);
        lines.push(`(อันดับ • FPL • Extra • Total)`);

        const tiers = (this.config && this.config.features && this.config.features.annual_payout_tiers) || {
          "1": 1000, "2": 800, "3": 600, "4": 400, "5": 200, "6": 100,
          "7": -100, "8": -200, "9": -400, "10": -600, "11": -800, "12": -1000
        };

        const extraMapByEntryId = {};
        const extraMapByName = {};
        (this.shi62Data.cumulative_standings || []).forEach(c => {
          if (c.player) {
            if (c.player.entry_id) extraMapByEntryId[c.player.entry_id] = Number(c.net) || 0;
            if (c.player.display_name) extraMapByName[c.player.display_name.toLowerCase()] = Number(c.net) || 0;
          }
        });

        const shi62ShortNames = {
          1309919: "Tong",
          837763: "Oo",
          2342390: "Riin",
          720631: "Totti",
          1153245: "Poang",
          7601484: "Oan",
          3508212: "Sia",
          1312974: "Mai",
          2804957: "Boy",
          5463640: "Dow",
          4549514: "Bert",
          5340913: "Pong+"
        };

        const overallTeams = (this.data && this.data.teams ? [...this.data.teams] : [])
          .filter(t => this.isPrizeEligible(t.entry_id))
          .sort((a, b) => (b.total_points - a.total_points) || ((a.rank || 999) - (b.rank || 999)));

        const fmtVal = (v) => {
          if (v > 0) return `+${Number(v).toLocaleString()}`;
          if (v < 0) return `${Number(v).toLocaleString()}`;
          return '0';
        };

        overallTeams.forEach((t, idx) => {
          const rank = idx + 1;
          const seasonPrize = Number(tiers[String(rank)] || 0);
          const extraNet = (extraMapByEntryId[t.entry_id] !== undefined)
            ? extraMapByEntryId[t.entry_id]
            : (extraMapByName[(t.player_name || '').toLowerCase()] || 0);
          const grandTotal = seasonPrize + extraNet;

          const dispName = shi62ShortNames[t.entry_id] || t.player_name;

          lines.push(`${rank}. ${dispName}: FPL ${fmtVal(seasonPrize)} | Extra ${fmtVal(extraNet)} | Total ${fmtVal(grandTotal)}`);
        });

        const nodCum = (this.shi62Data.cumulative_standings || []).find(c => c.player && c.player.is_guest);
        if (nodCum) {
          const nodNet = nodCum.net || 0;
          lines.push(`• Nod (Guest): FPL - | Extra ${fmtVal(nodNet)} | Total ${fmtVal(nodNet)}`);
        }

        lines.push(`---------------------------------`);
        lines.push(`🌐 https://asawamanasak.github.io/fpl-mini/187827`);

        const textToCopy = lines.join(String.fromCharCode(10));
        const onCopied = () => this.showCopiedToast('คัดลอกสรุปรางวัลสำหรับ LINE เรียบร้อย');
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(onCopied).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            onCopied();
          });
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          onCopied();
        }
      }

      showCopiedToast(text = 'คัดลอกข้อความสำเร็จ!') {
        let toast = document.getElementById('global-copied-toast');
        if (!toast) {
          toast = document.createElement('div');
          toast.id = 'global-copied-toast';
          toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white font-bold text-xs px-4 py-2 rounded-full shadow-2xl border border-slate-700/80 z-50 flex items-center gap-1.5 transition-all duration-200 opacity-0 pointer-events-none translate-y-2 backdrop-blur-xs font-display';
          document.body.appendChild(toast);
        }
        toast.innerHTML = `<svg class="w-3.5 h-3.5 text-[#06C755] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 5.92 2 10.75c0 3.1 1.87 5.86 4.75 7.37-.21.78-.77 2.82-.88 3.25-.15.58.21.57.44.42.18-.12 2.5-1.7 3.51-2.4.72.11 1.45.16 2.18.16 5.52 0 10-3.92 10-8.75S17.52 2 12 2z"/></svg><span>${text}</span>`;
        toast.classList.remove('opacity-0', 'translate-y-2');
        toast.classList.add('opacity-100', 'translate-y-0');
        if (this._toastTimer) clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
          toast.classList.remove('opacity-100', 'translate-y-0');
          toast.classList.add('opacity-0', 'translate-y-2');
        }, 1800);
      }

      renderShi62Special() {
        if (!this.shi62Data) return;
        const container = document.getElementById('shi62-special-view');
        if (!container) return;

        if (!this.activeShi62GW && this.shi62Data.gameweeks && this.shi62Data.gameweeks.length > 0) {
          this.activeShi62GW = this.shi62Data.gameweeks[0].name;
        }

        const data = this.shi62Data;
        const activeGWObj = (data.gameweeks || []).find(g => g.name === this.activeShi62GW) || data.gameweeks[0];
        if (!activeGWObj) return;

        const fmtMoney = (val, showPlus = true, unit = '') => {
          const formatted = Math.abs(val).toLocaleString();
          const u = unit ? ` ${unit}` : '';
          if (val > 0) return `${showPlus ? '+' : ''}${formatted}${u}`;
          if (val < 0) return `-${formatted}${u}`;
          return `0${u}`;
        };

        // Build Prize Summary Table (FPL จบฤดู & Extra รวมทั้งหมด)
        const maxGW = Number(this.multiData && this.multiData.max_gw) || 7;
        const extraMapByEntryId = {};
        const extraMapByName = {};
        (data.cumulative_standings || []).forEach(c => {
          if (c.player) {
            if (c.player.entry_id) extraMapByEntryId[c.player.entry_id] = Number(c.net) || 0;
            if (c.player.display_name) extraMapByName[c.player.display_name.toLowerCase()] = Number(c.net) || 0;
          }
        });

        const shi62ShortNames = {
          1309919: "Tong",
          837763: "Oo",
          2342390: "Riin",
          720631: "Totti",
          1153245: "Poang",
          7601484: "Oan",
          3508212: "Sia",
          1312974: "Mai",
          2804957: "Boy",
          5463640: "Dow",
          4549514: "Bert",
          5340913: "Pong+"
        };

        const overallTeams = (this.data && this.data.teams ? [...this.data.teams] : [])
          .filter(t => this.isPrizeEligible(t.entry_id))
          .sort((a, b) => (b.total_points - a.total_points) || ((a.rank || 999) - (b.rank || 999)));

        const tiers = (this.config && this.config.features && this.config.features.annual_payout_tiers) || {
          "1": 1000, "2": 800, "3": 600, "4": 400, "5": 200, "6": 100,
          "7": -100, "8": -200, "9": -400, "10": -600, "11": -800, "12": -1000
        };

        let prizeSummaryRowsHtml = '';
        let sumFplPoints = 0;
        let sumSeason = 0;
        let sumExtra = 0;
        let sumGrand = 0;

        const fmtValCell = (val) => {
          if (val > 0) return `<span class="text-emerald-600 dark:text-emerald-400 font-bold font-display">+${Number(val).toLocaleString()}</span>`;
          if (val < 0) return `<span class="text-rose-600 dark:text-rose-400 font-bold font-display">${Number(val).toLocaleString()}</span>`;
          return `<span class="text-slate-400 dark:text-slate-500 font-display">0</span>`;
        };

        const fmtGrandCell = (val) => {
          if (val > 0) return `<span class="text-emerald-600 dark:text-emerald-400 font-black font-display text-xs sm:text-sm">+${Number(val).toLocaleString()} THB</span>`;
          if (val < 0) return `<span class="text-rose-600 dark:text-rose-400 font-black font-display text-xs sm:text-sm">${Number(val).toLocaleString()} THB</span>`;
          return `<span class="text-slate-400 dark:text-slate-500 font-black font-display text-xs sm:text-sm">0 THB</span>`;
        };

        overallTeams.forEach((team, idx) => {
          const rank = idx + 1;
          const seasonPrize = Number(tiers[String(rank)] || 0);
          const extraNet = (extraMapByEntryId[team.entry_id] !== undefined)
            ? extraMapByEntryId[team.entry_id]
            : (extraMapByName[(team.player_name || '').toLowerCase()] || 0);
          const grandTotal = seasonPrize + extraNet;

          sumFplPoints += team.total_points;
          sumSeason += seasonPrize;
          sumExtra += extraNet;
          sumGrand += grandTotal;

          const shortName = shi62ShortNames[team.entry_id] || team.player_name;

          let rowBg = '';
          if (rank === 1) rowBg = 'bg-amber-50/20 dark:bg-amber-950/10 font-semibold';
          else if (rank === overallTeams.length) rowBg = 'bg-rose-50/20 dark:bg-rose-950/10 font-semibold';

          prizeSummaryRowsHtml += `
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${rowBg}">
              <td class="py-2.5 px-3 text-center font-display font-bold text-xs text-slate-500 dark:text-slate-400">${rank}</td>
              <td class="py-2.5 px-3 min-w-[140px]">
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
                    ${shortName}
                  </span>
                  <div>
                    <div class="font-bold text-slate-900 dark:text-white leading-tight">${this.escapeHtml(team.entry_name)}</div>
                    <div class="text-[11px] text-slate-400 leading-tight">${this.escapeHtml(team.player_name)}</div>
                  </div>
                </div>
              </td>
              <td class="py-2.5 px-3 text-center font-display font-black text-xs sm:text-sm text-slate-900 dark:text-white">${team.total_points}</td>
              <td class="py-2.5 px-3 text-right font-display text-xs sm:text-sm font-semibold">${fmtValCell(seasonPrize)}</td>
              <td class="py-2.5 px-3 text-right font-display text-xs sm:text-sm font-semibold">${fmtValCell(extraNet)}</td>
              <td class="py-2.5 px-3 text-right font-display">${fmtGrandCell(grandTotal)}</td>
            </tr>
          `;
        });

        // Guest Nod row
        const nodCum = (data.cumulative_standings || []).find(c => c.player && c.player.is_guest);
        if (nodCum) {
          const nodNet = Number(nodCum.net) || 0;
          sumExtra += nodNet;
          sumGrand += nodNet;
          const fmtNodNet = nodNet > 0 
            ? `<span class="text-emerald-600 dark:text-emerald-400 font-bold font-display">+${Number(nodNet).toLocaleString()}</span>`
            : (nodNet < 0 ? `<span class="text-rose-600 dark:text-rose-400 font-bold font-display">${Number(nodNet).toLocaleString()}</span>` : '<span class="text-slate-400 font-display">0</span>');
          const fmtNodGrand = nodNet > 0 
            ? `<span class="text-emerald-600 dark:text-emerald-400 font-black font-display text-xs sm:text-sm">+${Number(nodNet).toLocaleString()} THB</span>`
            : (nodNet < 0 ? `<span class="text-rose-600 dark:text-rose-400 font-black font-display text-xs sm:text-sm">${Number(nodNet).toLocaleString()} THB</span>` : '<span class="text-slate-400 font-black font-display text-xs sm:text-sm">0 THB</span>');

          prizeSummaryRowsHtml += `
            <tr class="bg-slate-50/40 dark:bg-slate-800/20 text-slate-500 border-t border-dashed border-slate-200 dark:border-slate-800">
              <td class="py-2.5 px-3 text-center font-display font-bold text-xs text-slate-400">•</td>
              <td class="py-2.5 px-3 min-w-[140px]">
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
                    Nod
                  </span>
                  <div>
                    <div class="font-bold text-slate-800 dark:text-slate-200 leading-tight">Guest Player</div>
                    <div class="text-[11px] text-slate-400 leading-tight">เล่นเฉพาะ Extra</div>
                  </div>
                </div>
              </td>
              <td class="py-2.5 px-3 text-center font-display text-xs text-slate-400">-</td>
              <td class="py-2.5 px-3 text-right font-display text-xs text-slate-400">-</td>
              <td class="py-2.5 px-3 text-right font-display text-xs sm:text-sm font-semibold">${fmtNodNet}</td>
              <td class="py-2.5 px-3 text-right font-display">${fmtNodGrand}</td>
            </tr>
          `;
        }

        let html = `
          <!-- Header Banner (Minimal & Professional) -->
          <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 class="text-xl sm:text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
                  Shi'62 Special
                </h1>
              </div>

              <!-- Quick Stats Grid (Clean & Minimal) -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div class="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-2.5 sm:p-3 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">ยอดเงินสะพัดรวม</div>
                  <div class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display mt-0.5">฿${Number(data.total_season_turnover).toLocaleString()}</div>
                </div>
                <div class="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-2.5 sm:p-3 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">คู่ที่เปิดทายผล</div>
                  <div class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display mt-0.5">${data.total_season_matches} คู่</div>
                </div>
                <div class="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-2.5 sm:p-3 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">ผู้นำทำกำไรสูงสุด</div>
                  <div class="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-display truncate mt-0.5">${data.cumulative_standings[0] ? data.cumulative_standings[0].player.display_name + ' (' + fmtMoney(data.cumulative_standings[0].net) + ')' : '-'}</div>
                </div>
                <div class="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-2.5 sm:p-3 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">แม่นยำสูงสุด (%ชนะ)</div>
                  <div class="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 font-display mt-0.5">${[...data.cumulative_standings].sort((a,b) => b.win_rate - a.win_rate)[0]?.player.display_name || '-'} (${[...data.cumulative_standings].sort((a,b) => b.win_rate - a.win_rate)[0]?.win_rate || 0}%)</div>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 1: Cumulative Standings Table -->
          <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                การแข่งขัน Extra
              </h2>
            </div>

            <!-- Standings Table -->
            <div class="overflow-x-auto touch-scroll">
              <table class="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr class="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th class="py-2.5 px-3 text-center w-12">อันดับ</th>
                    <th class="py-2.5 px-3">ผู้เล่น / ทีม FPL</th>
                    <th class="py-2.5 px-3 text-center">แข่ง (คู่)</th>
                    <th class="py-2.5 px-3 text-center">ชนะ</th>
                    <th class="py-2.5 px-3 text-center">แพ้</th>
                    <th class="py-2.5 px-3 text-center">เสมอ</th>
                    <th class="py-2.5 px-3 text-center">% ชนะ</th>
                    <th class="py-2.5 px-3 text-right">เงินที่ได้</th>
                    <th class="py-2.5 px-3 text-right">เงินที่เสีย</th>
                    <th class="py-2.5 px-3 text-right font-bold">กำไร/ขาดทุนสุทธิ</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-sm">
                  ${data.cumulative_standings.map(c => {
                    const isPositive = c.net > 0;
                    const isNegative = c.net < 0;
                    const netColor = isPositive 
                      ? 'text-emerald-600 dark:text-emerald-400 font-bold' 
                      : (isNegative ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-500 font-medium');
                    
                    const rankBadge = `<span class="text-xs font-semibold text-slate-500 dark:text-slate-400">${c.rank}</span>`;

                    return `
                      <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td class="py-2.5 px-3 text-center font-display">${rankBadge}</td>
                        <td class="py-2.5 px-3">
                          <div class="flex items-center gap-2">
                            <span class="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
                              ${c.player.display_name}
                            </span>
                            <div>
                              ${c.player.is_guest 
                                ? '<div class="text-xs text-slate-500 dark:text-slate-400 font-medium">เล่นเฉพาะมินิเกม</div>' 
                                : `
                                  <div class="font-bold text-slate-900 dark:text-white leading-tight">${c.player.team_name}</div>
                                  <div class="text-[11px] text-slate-400 leading-tight">${c.player.manager}</div>
                                `}
                            </div>
                          </div>
                        </td>
                        <td class="py-2.5 px-3 text-center font-display font-medium text-slate-700 dark:text-slate-300">${c.matches}</td>
                        <td class="py-2.5 px-3 text-center font-display font-semibold text-emerald-600 dark:text-emerald-400">${c.won}</td>
                        <td class="py-2.5 px-3 text-center font-display font-semibold text-rose-500 dark:text-rose-400">${c.lost}</td>
                        <td class="py-2.5 px-3 text-center font-display text-slate-400">${c.push}</td>
                        <td class="py-2.5 px-3 text-center font-display font-medium text-slate-600 dark:text-slate-400">${c.win_rate}%</td>
                        <td class="py-2.5 px-3 text-right font-display text-emerald-600 dark:text-emerald-400">${c.total_won_amount.toLocaleString()}</td>
                        <td class="py-2.5 px-3 text-right font-display text-rose-500 dark:text-rose-400">${c.total_lost_amount > 0 ? `-${c.total_lost_amount.toLocaleString()}` : '0'}</td>
                        <td class="py-2.5 px-3 text-right font-display ${netColor}">
                          ${fmtMoney(c.net)}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- SECTION 2: Gameweek Breakdown & Match Details -->
          <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <!-- Gameweek Controls Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                ผลการแข่งขัน & การคิดเงินรายสัปดาห์
              </h2>

              <!-- GW Pills Selector & Copy LINE Button -->
              <div class="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
                <div class="flex items-center gap-1 overflow-x-auto touch-scroll p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 max-w-full w-full sm:w-auto">
                  ${data.gameweeks.map(g => {
                    const isActive = g.name === this.activeShi62GW;
                    return `
                      <button 
                        onclick="app.selectShi62GW('${g.name}')"
                        class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          isActive 
                            ? 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-xs' 
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/60'
                        }"
                      >
                        ${g.name}
                      </button>
                    `;
                  }).join('')}
                </div>

                <button 
                  onclick="app.copyShi62LINEResult('${activeGWObj.name}')"
                  class="ml-auto sm:ml-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#06C755]/10 hover:bg-[#06C755]/20 dark:bg-[#06C755]/15 dark:hover:bg-[#06C755]/25 text-[#04a044] dark:text-[#06C755] border border-[#06C755]/25 dark:border-[#06C755]/30 shadow-2xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                  title="คัดลอกสรุปผลสัปดาห์นี้สำหรับส่ง LINE"
                >
                  <svg class="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 5.92 2 10.75c0 3.1 1.87 5.86 4.75 7.37-.21.78-.77 2.82-.88 3.25-.15.58.21.57.44.42.18-.12 2.5-1.7 3.51-2.4.72.11 1.45.16 2.18.16 5.52 0 10-3.92 10-8.75S17.52 2 12 2z"/></svg>
                  <span>คัดลอก LINE</span>
                </button>
              </div>
            </div>

            <!-- Active GW Stats & Financial Balance Card -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <!-- Left: GW Info -->
              <div class="bg-slate-50/80 dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-xs font-bold text-slate-700 dark:text-slate-300 font-display">${activeGWObj.name}</span>
                    <span class="text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">${activeGWObj.matches.length} คู่</span>
                  </div>
                  <div class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display mt-2">
                    ฿${Number(activeGWObj.total_pool).toLocaleString()}
                  </div>
                </div>
              </div>

              <!-- Right 2 cols: GW Standings -->
              <div class="md:col-span-2 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800">
                <div class="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                  <span>สรุปยอดเงินได้-เสียสุทธิในสัปดาห์นี้ (${activeGWObj.name})</span>
                  <span class="text-[10.5px] text-slate-400 font-normal">เรียงตามกำไรสุทธิ</span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  ${activeGWObj.summary.map(s => {
                    const isPositive = s.net > 0;
                    const isNegative = s.net < 0;
                    const bgStyle = isPositive 
                      ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20' 
                      : (isNegative ? 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20' : 'bg-slate-100/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60');
                    const textStyle = isPositive ? 'text-emerald-600 dark:text-emerald-400' : (isNegative ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400');
                    return `
                      <div class="p-2 rounded-lg border ${bgStyle} flex flex-col justify-between">
                        <div class="flex items-center justify-between">
                          <span class="font-bold text-xs text-slate-800 dark:text-slate-200">${s.player.display_name}</span>
                          <span class="text-[10px] text-slate-400">${s.won}W - ${s.lost}L</span>
                        </div>
                        <div class="text-xs sm:text-sm font-bold font-display mt-1 ${textStyle}">
                          ${fmtMoney(s.net)}
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>

            <!-- Matches List Grid -->
            <div>
              <div class="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center justify-between">
                <span>รายละเอียดการทายผลทุกคู่ (${activeGWObj.matches.length} คู่)</span>
                <span class="text-[10.5px] text-slate-400 font-normal">เครื่องหมาย ✅ คือผลชนะ</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                ${activeGWObj.matches.map((m, idx) => {
                  const isVoid = m.status === 'void';
                  return `
                    <div class="rounded-xl border ${isVoid ? 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-900/20' : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-2xs'} p-3 flex flex-col justify-between space-y-2.5">
                      <!-- Match Top Header -->
                      <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                        <div class="flex items-center gap-2">
                          <span class="w-4 h-4 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center text-[10px] font-bold font-display">
                            ${idx + 1}
                          </span>
                          <span class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-display">
                            ${m.title}
                          </span>
                        </div>
                        <div>
                          ${isVoid 
                            ? '<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">โมฆะ / เจ๊า (ไม่มีผู้ชนะ)</span>'
                            : `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">฿${m.pool} (${m.winners.length} คนชนะ)</span>`
                          }
                        </div>
                      </div>

                      <!-- Options Rows -->
                      <div class="space-y-1">
                        ${m.options.map(opt => {
                          const isWinOpt = opt.is_win;
                          const hasNames = opt.names && opt.names.length > 0;
                          return `
                            <div class="flex items-center justify-between p-1.5 px-2 rounded-lg text-xs transition-colors ${
                              isWinOpt 
                                ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20' 
                                : 'bg-slate-50/60 dark:bg-slate-800/40 border border-transparent'
                            }">
                              <div class="flex items-center gap-2 min-w-0">
                                <span class="font-bold text-xs font-display w-9 sm:w-10 shrink-0 ${isWinOpt ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}">
                                  ${opt.label}
                                </span>
                                <div class="flex items-center gap-1 flex-wrap">
                                  ${hasNames 
                                    ? opt.names.map(name => {
                                        const pRes = m.payouts[name] || {};
                                        const netVal = pRes.net || 0;
                                        const badgeColor = netVal > 0 
                                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold' 
                                          : (netVal < 0 ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400');
                                        return `
                                          <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] ${badgeColor}">
                                            ${name}
                                            <span class="text-[9px] opacity-75">${fmtMoney(netVal, true)}</span>
                                          </span>
                                        `;
                                      }).join('')
                                    : '<span class="text-[10.5px] text-slate-400 italic">(ไม่มีคนแทง)</span>'
                                  }
                                </div>
                              </div>
                              <div class="flex items-center pl-2 flex-shrink-0">
                                ${isWinOpt 
                                  ? '<span class="text-xs">✅</span>' 
                                  : (hasNames ? '<span class="text-[10.5px] text-rose-500/80 font-medium">-100</span>' : '')
                                }
                              </div>
                            </div>
                          `;
                        }).join('')}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- SECTION 1.5: Prize Summary (สรุปรางวัล FPL จบฤดู & Extra รวมทั้งหมด) -->
          <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                  สรุปรางวัล (FPL & Extra)
                </h2>
                <span class="text-[11px] font-medium text-slate-400 font-display">
                  คำนวณตามคะแนน FPL ปัจจุบัน (GW 1 - ${maxGW}) รวมกับยอดสะสม Extra
                </span>
              </div>
              <button 
                onclick="app.copyShi62PrizesLINEResult()"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#06C755]/10 hover:bg-[#06C755]/20 dark:bg-[#06C755]/15 dark:hover:bg-[#06C755]/25 text-[#04a044] dark:text-[#06C755] border border-[#06C755]/25 dark:border-[#06C755]/30 shadow-2xs transition-all active:scale-95 cursor-pointer whitespace-nowrap self-end sm:self-auto"
                title="คัดลอกสรุปผลสำหรับส่ง LINE"
              >
                <svg class="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 5.92 2 10.75c0 3.1 1.87 5.86 4.75 7.37-.21.78-.77 2.82-.88 3.25-.15.58.21.57.44.42.18-.12 2.5-1.7 3.51-2.4.72.11 1.45.16 2.18.16 5.52 0 10-3.92 10-8.75S17.52 2 12 2z"/></svg>
                <span>คัดลอก LINE</span>
              </button>
            </div>

            <!-- Prize Summary Table -->
            <div class="overflow-x-auto touch-scroll">
              <table class="w-full text-left border-collapse min-w-[620px]">
                <thead>
                  <tr class="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th class="py-2.5 px-3 text-center w-12">#</th>
                    <th class="py-2.5 px-3">ผู้เล่น / ทีม FPL</th>
                    <th class="py-2.5 px-3 text-center w-20">คะแนน FPL</th>
                    <th class="py-2.5 px-3 text-right min-w-[100px]">FPL</th>
                    <th class="py-2.5 px-3 text-right min-w-[100px]">ยอดรวม Extra</th>
                    <th class="py-2.5 px-3 text-right min-w-[110px]">ยอดรวมทั้งหมด</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-sm">
                  ${prizeSummaryRowsHtml}
                </tbody>
                <tfoot class="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 font-display text-xs sm:text-sm font-bold">
                  <tr>
                    <td colspan="2" class="py-3 px-3 text-slate-700 dark:text-slate-300">
                      ยอดรวมสุทธิทั้งลีก (Net Zero-Sum Balance)
                    </td>
                    <td class="py-3 px-3 text-center text-slate-900 dark:text-white font-black">${sumFplPoints}</td>
                    <td class="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">${sumSeason === 0 ? '0' : sumSeason.toLocaleString()} THB</td>
                    <td class="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">${sumExtra === 0 ? '0' : sumExtra.toLocaleString()} THB</td>
                    <td class="py-3 px-3 text-right font-black text-slate-900 dark:text-white text-sm sm:text-base">${sumGrand === 0 ? '0' : sumGrand.toLocaleString()} THB</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        `;

        container.innerHTML = html;
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

          let badgeClass = 'bg-slate-100 text-slate-400 border border-slate-200 dark:bg-slate-900/40 dark:text-slate-600 dark:border-slate-800/40 cursor-not-allowed opacity-60';
          let statusText = 'LOCKED';

          if (isPlayed) {
            if (isFinished) {
              statusText = 'Finished';
              if (isSelected) {
                badgeClass = 'bg-slate-900 text-white border border-slate-900 dark:bg-blue-600 dark:text-white dark:border-blue-500 shadow-sm cursor-pointer scale-105';
              } else {
                badgeClass = 'bg-white text-slate-700 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer';
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
                badgeClass = 'bg-indigo-950 text-white border-2 border-indigo-400 dark:bg-indigo-600 dark:border-indigo-400 shadow-md cursor-pointer scale-105';
              } else {
                badgeClass = 'bg-indigo-50/80 text-indigo-900 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60 hover:bg-indigo-100 cursor-pointer';
              }
            }
          }

          html += `
            <button 
              onclick="${isPlayed ? `app.selectGW(${gw})` : ''}"
              class="flex-shrink-0 flex flex-col items-center justify-center w-14 sm:w-16 py-1.5 min-h-[44px] rounded-xl transition-all font-display active:scale-95 ${badgeClass}"
              ${!isPlayed ? 'disabled' : ''}
            >
              <span class="text-xs font-bold">GW ${gw}</span>
              <span class="text-[9px] font-semibold">${statusText}</span>
            </button>
          `;
        }
        container.innerHTML = html;
      }

      selectGW(gw, fromPopstate = false) {
        const maxGW = Number(this.multiData.max_gw) || 2;
        this.selectedGW = Math.min(Math.max(Number(gw) || 1, 1), maxGW);
        const activeMonth = (this.config && this.config.monthly_schedule || []).find(m => m.gw_list && m.gw_list.includes(this.selectedGW));
        if (activeMonth) {
          this.selectedMonthId = activeMonth.id;
        }

        if (!fromPopstate) {
          try {
            if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
              const urlParams = new URLSearchParams(window.location.search || '');
              urlParams.set('gw', this.selectedGW);
              const newSearch = urlParams.toString();
              const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '') + window.location.hash;
              window.history.replaceState(null, '', newUrl);
            }
          } catch (e) {}
        }

        this.renderGWSelector();
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
        const useHighestPlayerTieBreaker = Boolean(this.config.features && this.config.features.tie_breaker === 'highest_player');
        const scoreProp = (isFinished || isWeeklyPrize) ? 'net_points' : 'points';
        const sorted = [...gwData.results].sort((a, b) => {
          const scoreDiff = (b[scoreProp] - a[scoreProp]) || (b.net_points - a.net_points) || (b.points - a.points);
          if (scoreDiff !== 0) return scoreDiff;
          if (useHighestPlayerTieBreaker) {
            return this.compareTeamPlayerScores(a.entry_id, b.entry_id, this.selectedGW);
          }
          return 0;
        });
        let curRank = 1;
        let prevEligiblePoints = null;
        let prevEligibleTeam = null;
        let eligiblePreCount = 0;
        sorted.forEach((team) => {
          if (!this.isPrizeEligible(team.entry_id)) {
            team.rank = null;
            team.preRank = null;
            return;
          }
          eligiblePreCount++;
          team.preRank = eligiblePreCount;
          let isTiedWithPrev = false;
          if (prevEligiblePoints !== null && team[scoreProp] === prevEligiblePoints) {
            if (useHighestPlayerTieBreaker && prevEligibleTeam) {
              isTiedWithPrev = (this.compareTeamPlayerScores(team.entry_id, prevEligibleTeam.entry_id, this.selectedGW) === 0);
            } else {
              isTiedWithPrev = true;
            }
          }
          if (!isTiedWithPrev && prevEligiblePoints !== null) {
            curRank = eligiblePreCount;
          }
          prevEligiblePoints = team[scoreProp];
          prevEligibleTeam = team;
          team.rank = curRank;
        });

        const eligibleResults = sorted.filter(r => this.isPrizeEligible(r.entry_id));
        const eligibleSortedByPrize = [...eligibleResults].sort((a, b) => {
          const scoreDiff = (b[scoreProp] - a[scoreProp]) || (b.net_points - a.net_points);
          if (scoreDiff !== 0) return scoreDiff;
          if (useHighestPlayerTieBreaker) {
            return this.compareTeamPlayerScores(a.entry_id, b.entry_id, this.selectedGW);
          }
          return 0;
        });
        const eligibleHighestScore = eligibleSortedByPrize.length > 0 ? eligibleSortedByPrize[0][scoreProp] : 0;
        let eligibleTopWinners = [];
        if (eligibleSortedByPrize.length > 0) {
          const topLeader = eligibleSortedByPrize[0];
          if (useHighestPlayerTieBreaker) {
            eligibleTopWinners = eligibleSortedByPrize.filter(r => 
              r[scoreProp] === topLeader[scoreProp] && 
              this.compareTeamPlayerScores(r.entry_id, topLeader.entry_id, this.selectedGW) === 0
            );
          } else {
            eligibleTopWinners = eligibleSortedByPrize.filter(r => r[scoreProp] === eligibleHighestScore);
          }
        }
        const prizeLeader = eligibleTopWinners[0] || sorted[0];
        const isJointPrizeWinner = eligibleTopWinners.length > 1;

        const overallTop = sorted[0];
        const hasPassedPrize = !this.isPrizeEligible(overallTop.entry_id) && eligibleTopWinners.length > 0 && overallTop[scoreProp] > prizeLeader[scoreProp];
        const leader = prizeLeader;

        // 1. Render Spotlight Card (Pre-Match Lineup Preview OR Live Leader / Weekly Winner)
        if (championCard && leader) {
          const cacheKey = `${this.activeLeagueId}_${this.selectedGW}`;
          const nonPrizeList = (this.config && this.config.non_prize_teams) || [];
          const currentLiveNote = this.liveNotesCache[cacheKey] || LiveCommentaryEngine.generateFreshNote(this.selectedGW, gwData, this.data.name, false, nonPrizeList, this.data, isWeeklyPrize, useHighestPlayerTieBreaker);
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
                    <button onclick="app.copyHighlightQuote()" class="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer active:scale-95" title="คัดลอกบทวิเคราะห์ (Copy Quote)">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                    </button>
                    <button onclick="app.regenerateLiveNote()" class="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer active:scale-95" title="สุ่มบทวิเคราะห์ใหม่สไตล์ บอ.บู๋ (Refresh Analysis)">
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

            let multiTierPayoutsHtml = '';
            if (isFinished && isWeeklyPrize && this.config.features && this.config.features.weekly_prizes) {
              const tierPrizes = Object.values(this.config.features.weekly_prizes).map(Number);
              const weeklyPayouts = this.calculateWeeklyTierPrizes(eligibleSortedByPrize, tierPrizes, this.selectedGW);
              if (weeklyPayouts.length > 0) {
                multiTierPayoutsHtml = `
                  <div class="mt-3 pt-3 border-t ${isFinished ? 'border-slate-200 dark:border-slate-800' : 'border-emerald-200/80 dark:border-emerald-900/60'}">
                    <div class="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-display flex items-center justify-between">
                      <span>🏆 สรุปเงินรางวัลประจำสัปดาห์ 3 อันดับ</span>
                      <span class="text-[10px] text-slate-500 font-normal">รวมสัปดาห์ละ ${tierPrizes.reduce((a,b)=>a+b,0).toLocaleString()} THB</span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      ${weeklyPayouts.map(p => {
                        const medal = p.rank === 1 ? '🥇 ที่ 1' : (p.rank === 2 ? '🥈 ที่ 2' : '🥉 ที่ 3');
                        const cardStyle = p.rank === 1 
                          ? 'bg-gradient-to-br from-amber-200/90 via-amber-100/80 to-amber-50/70 dark:from-amber-600/30 dark:via-amber-800/20 dark:to-amber-950/40 border-amber-400 dark:border-amber-500/50 text-amber-950 dark:text-amber-100 shadow-sm' 
                          : (p.rank === 2 
                            ? 'bg-slate-100/70 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200' 
                            : 'bg-amber-50/40 dark:bg-stone-900/40 border-amber-200/60 dark:border-stone-800 text-stone-800 dark:text-stone-300');
                        const tieNoteHtml = p.tieBreakNote ? `<span class="text-[9px] text-amber-700 dark:text-amber-400 font-semibold block truncate mt-0.5">⚡ ${this.escapeHtml(p.tieBreakNote)}</span>` : '';
                        return `
                          <div class="p-2.5 rounded-xl border ${cardStyle} flex items-center justify-between text-xs shadow-2xs">
                            <div class="truncate pr-2">
                              <span class="font-bold text-[11px] block">${medal}${p.isJoint ? ` (เสมอ ${p.jointCount})` : ''}</span>
                              <span class="font-bold truncate block">${this.escapeHtml(p.team_name)}</span>
                              <span class="text-[10px] text-slate-500 dark:text-slate-400 block truncate">${this.escapeHtml(p.player_name)} (${p.net_points} pts)</span>
                              ${tieNoteHtml}
                            </div>
                            <div class="text-right flex-shrink-0">
                              <span class="font-black font-display text-emerald-700 dark:text-emerald-400 text-sm block">${p.prize.toLocaleString()}</span>
                              <span class="text-[9px] text-slate-400 block">${p.isJoint ? 'THB (หารเท่า)' : 'THB'}</span>
                            </div>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                `;
              }
            }

            let penaltyPayoutsHtml = '';
            if (isFinished && this.config.features && this.config.features.has_weekly_penalties) {
              const weeklyPenalties = this.calculateWeeklyPenalties(eligibleSortedByPrize, this.selectedGW);
              const penaltyTiersList = (this.config.features && this.config.features.weekly_penalty_tiers)
                ? Object.values(this.config.features.weekly_penalty_tiers).map(Number)
                : [600, 500, 400, 300, 200];
              const totalWeeklyFines = penaltyTiersList.reduce((a, b) => a + b, 0);
              const weeklyChampPrize = this.config.features.weekly_prize_amount || 200;
              const netWeeklyAccumulated = totalWeeklyFines - weeklyChampPrize;

              penaltyPayoutsHtml = `
                <div class="mt-3 pt-3 border-t ${isFinished ? 'border-slate-200 dark:border-slate-800' : 'border-emerald-200/80 dark:border-emerald-900/60'}">
                  <div class="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-display flex items-center justify-between flex-wrap gap-1">
                    <span class="flex items-center gap-1.5"><span class="text-rose-600">⚠️</span> ผู้เสียค่าปรับ 5 อันดับท้าย (รวม ${totalWeeklyFines.toLocaleString()} THB - หักจ่ายแชมป์ ${weeklyChampPrize.toLocaleString()} THB)</span>
                    <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">+${netWeeklyAccumulated.toLocaleString()} THB สะสมเข้ากองกลาง</span>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    ${weeklyPenalties.map((p, i) => {
                      const cardStyle = p.bottomTierIndex === 0 
                        ? 'bg-rose-100/80 dark:bg-rose-950/50 border-rose-300 dark:border-rose-700/60 text-rose-950 dark:text-rose-200' 
                        : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200/70 dark:border-rose-800/40 text-rose-900 dark:text-rose-300';
                      return `
                        <div class="p-2 rounded-xl border ${cardStyle} text-xs shadow-2xs">
                          <div class="flex items-center justify-between">
                            <span class="font-bold text-[10px] block">${p.rankLabel}</span>
                            <span class="font-black text-rose-600 dark:text-rose-400 text-xs">-${p.fine.toLocaleString()} THB</span>
                          </div>
                          <div class="font-bold truncate mt-1 text-slate-900 dark:text-white">${this.escapeHtml(p.team_name)}</div>
                          <div class="text-[10px] text-slate-500 dark:text-slate-400 truncate">${this.escapeHtml(p.player_name)} (${p.net_points} pts)</div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              `;
            }

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

                  <div class="flex items-center justify-end gap-3 w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 ${isFinished ? 'border-slate-200 dark:border-slate-800' : 'border-emerald-200/70 dark:border-slate-700'}">
                    <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs px-3.5 py-2 rounded-xl border ${isFinished ? 'border-slate-200 dark:border-slate-700' : 'border-emerald-200/90 dark:border-slate-700'} shadow-2xs flex items-center gap-3 ml-auto sm:ml-0">
                      <div class="text-right">
                        <span class="text-[10px] sm:text-[11px] ${isFinished ? 'text-slate-700 dark:text-slate-300' : 'text-emerald-900/80 dark:text-slate-400'} uppercase font-bold font-display block leading-tight">${isFinished ? (isWeeklyPrize ? 'แต้มสุทธิ (Net Pts)' : 'คะแนนทางการ') : (isWeeklyPrize ? 'แต้มสุทธิสด (Live Net)' : 'คะแนนสด (Live Pts)')}</span>
                        <span class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display leading-none">${prizeLeader[scoreProp]} <span class="text-xs font-bold text-slate-500 dark:text-slate-400">pts</span></span>
                      </div>
                      <div class="text-right pl-3 border-l ${isFinished ? 'border-slate-200 dark:border-slate-700' : 'border-emerald-200/90 dark:border-slate-700'}">
                        <span class="text-[10px] ${prizeLeader.hits > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'} block font-display">แต้มลบ: ${prizeLeader.hits > 0 ? `-${prizeLeader.hits}` : '-'}</span>
                        <span class="text-[9px] text-slate-400 block font-display">${prizeLeader.hits > 0 ? ((isFinished || isWeeklyPrize) ? 'หักในแต้มสุทธิแล้ว' : 'หักในแต้มรวม') : 'ไม่มีแต้มลบ'}</span>
                      </div>
                    </div>
                  </div>

                </div>

                ${multiTierPayoutsHtml}
                ${penaltyPayoutsHtml}

                <!-- Highlight Note (Borbou Style with Copy & Refresh Buttons) -->
                <div class="mt-3.5 pt-3 border-t ${isFinished ? 'border-slate-200 dark:border-slate-800' : 'border-emerald-200/70 dark:border-slate-700/60'} flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                  <div class="min-w-0 pr-1">
                    <span id="current-gw-note-text" class="italic font-medium text-slate-700 dark:text-slate-300 leading-relaxed break-words">${currentLiveNote}</span>
                  </div>
                  <div class="flex items-center justify-end gap-1 flex-shrink-0 self-end sm:self-center pt-1 sm:pt-0">
                    <span id="quote-copy-indicator" class="text-[11px] font-bold text-emerald-600 opacity-0 transition-opacity duration-200 inline-block font-display">Copied!</span>
                    <button onclick="app.copyHighlightQuote()" class="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer active:scale-95" title="คัดลอกพาดหัวบทวิเคราะห์ (Copy Quote)">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                    </button>
                    <button onclick="app.regenerateLiveNote()" class="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer active:scale-95" title="สุ่มบทวิเคราะห์ใหม่สไตล์ บอ.บู๋ (Refresh Analysis)">
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
          const weeklyPenaltiesMap = {};
          let weeklyWinnerPrize = 200;
          if (this.config.features && this.config.features.has_weekly_penalties) {
            const penaltiesList = this.calculateWeeklyPenalties(eligibleSortedByPrize, this.selectedGW);
            penaltiesList.forEach(p => {
              weeklyPenaltiesMap[p.entry_id] = p;
            });
            const topPayouts = this.calculateWeeklyTierPrizes(eligibleSortedByPrize, [this.config.features.weekly_prize_amount || 200], this.selectedGW);
            if (topPayouts && topPayouts.length > 0) {
              weeklyWinnerPrize = topPayouts[0].prize;
            }
          }

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
              const label = (team.rank === 1 && eligibleTopWinners.length > 1) ? 'T1' : team.rank;
              rankBadge = this.getRankBadge(team.rank, label);
            } else {
              rankBadge = this.getRankBadge(rankDisplay, rankDisplay);
            }

            let penaltyBadgeHtml = '';
            let penaltyRowBg = '';
            if (this.config.features && this.config.features.has_weekly_penalties && isPrize && isStarted) {
              if (team.rank === 1) {
                penaltyBadgeHtml = `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 ml-1">🏆 +${weeklyWinnerPrize}</span>`;
              } else if (weeklyPenaltiesMap[team.entry_id]) {
                const p = weeklyPenaltiesMap[team.entry_id];
                const prefix = p.bottomTierIndex === 0 ? '💀' : '⚠️';
                const cardStyle = p.bottomTierIndex === 0 
                  ? 'bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-200' 
                  : (p.bottomTierIndex === 1
                      ? 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-300'
                      : 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-300');
                penaltyBadgeHtml = `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${cardStyle} ml-1">${prefix} -${p.fine.toLocaleString()}</span>`;
                penaltyRowBg = p.bottomTierIndex === 0 ? 'bg-rose-50/40 dark:bg-rose-950/20' : (p.bottomTierIndex === 1 ? 'bg-rose-50/20 dark:bg-rose-950/10' : '');
              }
            }

            mHtml += `
              <tr class="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors ${penaltyRowBg} ${isWinner ? 'bg-blue-50/20 dark:bg-blue-950/20 font-semibold' : ''}">
                <td class="py-2.5 px-1 sm:px-2 text-center font-display font-bold text-xs sm:text-sm">${rankBadge}</td>
                <td class="py-2.5 px-1.5 sm:px-3 min-w-0">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <button onclick="app.openTeamModal(${team.entry_id})" class="text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer max-w-[140px] sm:max-w-none truncate block">
                      <span class="truncate block">${this.escapeHtml(team.team_name)}</span>
                    </button>
                    ${chip}
                    ${prizeBadge}
                    ${penaltyBadgeHtml}
                  </div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <div class="truncate">${this.escapeHtml(team.player_name)}</div>
                    <div class="sm:hidden text-[10px] text-slate-600 dark:text-slate-400 font-medium mt-0.5 truncate">
                      (C) ${this.escapeHtml((team.captain || '-').replace(/\s*\(C\)/gi, '').trim())}
                    </div>
                  </div>
                </td>
                <td class="py-2.5 px-2 sm:px-3 text-center hidden sm:table-cell">
                  <span class="text-xs text-slate-600 dark:text-slate-300 font-medium">${team.captain && team.captain !== '-' ? this.escapeHtml(team.captain.replace(/\s*\(C\)/gi, '').trim()) + ' (C)' : '-'}</span>
                </td>
                <td class="py-2.5 px-1 sm:px-2 text-center font-display font-bold text-xs sm:text-sm ${isStarted ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}">${team.points}</td>
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
            } else {
              rankBadge = this.getRankBadge(team.overall_rank);
            }

            const rawScore = team.last_gw_raw !== undefined ? team.last_gw_raw : team.last_gw_pts;
            const hitsBadge = team.last_gw_hits > 0 ? `<span class="text-[10px] sm:text-[11px] font-bold text-rose-500 dark:text-rose-400 font-display ml-0.5">(-${team.last_gw_hits})</span>` : '';

            oHtml += `
              <tr class="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors ${team.overall_rank && team.overall_rank <= 3 && isPrize ? 'bg-blue-50/20 dark:bg-blue-950/20' : ''}">
                <td class="py-2.5 px-1 sm:px-2 text-center font-display font-bold text-xs sm:text-sm">${rankBadge}</td>
                <td class="py-2.5 px-1.5 sm:px-3 min-w-0">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <button onclick="app.openTeamModal(${team.entry_id})" class="text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 transition-colors block truncate cursor-pointer max-w-[140px] sm:max-w-none">
                      ${this.escapeHtml(team.team_name)}
                    </button>
                    ${prizeBadge}
                  </div>
                  <span class="text-[11px] text-slate-500 dark:text-slate-400 block truncate">${this.escapeHtml(team.player_name)}</span>
                </td>
                <td class="py-2.5 px-1 sm:px-3 text-center font-display text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap"><span class="font-semibold">${rawScore}</span>${hitsBadge}</td>
                <td class="py-2.5 px-1.5 sm:px-3 text-right font-display font-black text-xs sm:text-sm text-blue-900 dark:text-blue-400">${team.total_points}</td>
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

      getTeamPlayerScores(entryId, gw) {
        if (!this.data || !this.data.squads) return [];
        const key = `${entryId}_${gw}`;
        const sq = this.data.squads[key];
        if (!sq || !sq.starting) return [];
        const getPlayerScore = (p) => {
          if (p.raw_points !== undefined && p.raw_points !== null) return Number(p.raw_points) || 0;
          const mult = Number(p.multiplier) || (p.is_captain ? 2 : 1);
          const pts = Number(p.points) || 0;
          return mult > 1 ? Math.round(pts / mult) : pts;
        };
        const pts = sq.starting.map(getPlayerScore);
        const isBBoost = ['bboost', 'bench_boost'].includes(String(sq.chip || '').toLowerCase());
        if (isBBoost && sq.bench) {
          pts.push(...sq.bench.map(getPlayerScore));
        }
        return pts.sort((a, b) => b - a);
      }

      compareTeamPlayerScores(entryIdA, entryIdB, gw) {
        const scoresA = this.getTeamPlayerScores(entryIdA, gw);
        const scoresB = this.getTeamPlayerScores(entryIdB, gw);
        const maxLen = Math.max(scoresA.length, scoresB.length);
        for (let i = 0; i < maxLen; i++) {
          const valA = scoresA[i] !== undefined ? scoresA[i] : -Infinity;
          const valB = scoresB[i] !== undefined ? scoresB[i] : -Infinity;
          if (valA !== valB) {
            return valB - valA;
          }
        }
        return 0;
      }

      getTieBreakerExplanation(entryIdWinner, entryIdLoser, gw) {
        const scoresW = this.getTeamPlayerScores(entryIdWinner, gw);
        const scoresL = this.getTeamPlayerScores(entryIdLoser, gw);
        const maxLen = Math.max(scoresW.length, scoresL.length);
        for (let i = 0; i < maxLen; i++) {
          const valW = scoresW[i] !== undefined ? scoresW[i] : -Infinity;
          const valL = scoresL[i] !== undefined ? scoresL[i] : -Infinity;
          if (valW !== valL) {
            const rankLabel = i === 0 ? 'ตัวทำแต้มสูงสุด' : `ตัวทำแต้มอันดับ ${i + 1}`;
            return `ชนะ Tie-breaker ${rankLabel} (${valW} vs ${valL} pts)`;
          }
        }
        return null;
      }

      getWeeklyTierPrizes() {
        if (this.config && this.config.features && this.config.features.weekly_prizes) {
          return Object.values(this.config.features.weekly_prizes).map(Number);
        }
        if (this.config && this.config.features && this.config.features.weekly_prize_amount) {
          return [Number(this.config.features.weekly_prize_amount)];
        }
        return [300];
      }

      calculateWeeklyTierPrizes(eligibleSorted, tierPrizes, gw = null) {
        if (!tierPrizes || tierPrizes.length === 0) {
          tierPrizes = this.getWeeklyTierPrizes();
        }
        const effectiveGW = gw || this.selectedGW;
        const useTieBreaker = Boolean(this.config && this.config.features && this.config.features.tie_breaker === 'highest_player');

        const sortedTeams = [...eligibleSorted].sort((a, b) => {
          const scoreA = a.net_points !== undefined ? a.net_points : a.points;
          const scoreB = b.net_points !== undefined ? b.net_points : b.points;
          if (scoreB !== scoreA) return scoreB - scoreA;
          if (useTieBreaker) {
            return this.compareTeamPlayerScores(a.entry_id, b.entry_id, effectiveGW);
          }
          return 0;
        });

        const payouts = [];
        let currentTierIndex = 0;
        
        const groups = [];
        sortedTeams.forEach(team => {
          const score = team.net_points !== undefined ? team.net_points : team.points;
          const lastGroup = groups[groups.length - 1];
          let isSameGroup = false;
          if (lastGroup && lastGroup.score === score) {
            if (useTieBreaker) {
              const prevTeam = lastGroup.teams[0];
              if (this.compareTeamPlayerScores(team.entry_id, prevTeam.entry_id, effectiveGW) === 0) {
                isSameGroup = true;
              }
            } else {
              isSameGroup = true;
            }
          }
          if (isSameGroup) {
            lastGroup.teams.push(team);
          } else {
            groups.push({ score: score, teams: [team] });
          }
        });

        for (const group of groups) {
          if (currentTierIndex >= tierPrizes.length) break;
          
          const count = group.teams.length;
          let poolForGroup = 0;
          const startIndex = currentTierIndex;
          const endIndex = Math.min(currentTierIndex + count, tierPrizes.length);
          
          for (let i = startIndex; i < endIndex; i++) {
            poolForGroup += tierPrizes[i];
          }
          
          const prizePerTeam = poolForGroup > 0 ? Math.round(poolForGroup / count) : 0;
          const displayRank = startIndex + 1;
          const isJoint = count > 1;

          group.teams.forEach(team => {
            if (prizePerTeam > 0) {
              let tieBreakNote = null;
              if (useTieBreaker) {
                const teamScore = (team.net_points !== undefined ? team.net_points : team.points);
                const tiedScoreTeams = sortedTeams.filter(t => (t.net_points !== undefined ? t.net_points : t.points) === teamScore);
                if (tiedScoreTeams.length > 1) {
                  const lowerTeam = tiedScoreTeams.find(t => t.entry_id !== team.entry_id && this.compareTeamPlayerScores(team.entry_id, t.entry_id, effectiveGW) < 0);
                  if (lowerTeam) {
                    tieBreakNote = this.getTieBreakerExplanation(team.entry_id, lowerTeam.entry_id, effectiveGW);
                  }
                }
              }

              payouts.push({
                entry_id: team.entry_id,
                team_name: team.team_name,
                player_name: team.player_name,
                rank: displayRank,
                prize: prizePerTeam,
                isJoint: isJoint,
                jointCount: count,
                net_points: team.net_points,
                hits: team.hits || 0,
                points: team.points,
                tieBreakNote: tieBreakNote
              });
            }
          });

          currentTierIndex += count;
        }
        return payouts;
      }

      calculateWeeklyPenalties(eligibleSorted, gw = null) {
        if (!eligibleSorted || eligibleSorted.length === 0) return [];
        const effectiveGW = gw || this.selectedGW;
        const useTieBreaker = Boolean(this.config && this.config.features && this.config.features.tie_breaker === 'highest_player');

        // Sort ascending (lowest/worst score first)
        const sortedBottom = [...eligibleSorted].sort((a, b) => {
          const scoreA = a.net_points !== undefined ? a.net_points : a.points;
          const scoreB = b.net_points !== undefined ? b.net_points : b.points;
          if (scoreA !== scoreB) return scoreA - scoreB;
          if (useTieBreaker) {
            // compareTeamPlayerScores returns negative if A beats B (A is better/higher).
            // For ascending (worst first), if A beats B, B is worse, so B should come first.
            return -this.compareTeamPlayerScores(a.entry_id, b.entry_id, effectiveGW);
          }
          return 0;
        });

        let penaltyTiers = [600, 500, 400, 300, 200];
        if (this.config && this.config.features && this.config.features.weekly_penalty_tiers) {
          const tiersObj = this.config.features.weekly_penalty_tiers;
          penaltyTiers = [
            Number(tiersObj.last_1 !== undefined ? tiersObj.last_1 : 600),
            Number(tiersObj.last_2 !== undefined ? tiersObj.last_2 : 500),
            Number(tiersObj.last_3 !== undefined ? tiersObj.last_3 : 400),
            Number(tiersObj.last_4 !== undefined ? tiersObj.last_4 : 300),
            Number(tiersObj.last_5 !== undefined ? tiersObj.last_5 : 200)
          ];
        }
        const rankLabels = ['💀 บ๊วย', '⚠️ รองบ๊วย', '⚠️ ท้าย 3', '⚠️ ท้าย 4', '⚠️ ท้าย 5'];

        const groups = [];
        sortedBottom.forEach(team => {
          const score = team.net_points !== undefined ? team.net_points : team.points;
          const lastGroup = groups[groups.length - 1];
          let isSameGroup = false;
          if (lastGroup && lastGroup.score === score) {
            if (useTieBreaker) {
              const prevTeam = lastGroup.teams[0];
              if (this.compareTeamPlayerScores(team.entry_id, prevTeam.entry_id, effectiveGW) === 0) {
                isSameGroup = true;
              }
            } else {
              isSameGroup = true;
            }
          }
          if (isSameGroup) {
            lastGroup.teams.push(team);
          } else {
            groups.push({ score: score, teams: [team] });
          }
        });

        const penalties = [];
        let currentTierIndex = 0;

        for (const group of groups) {
          if (currentTierIndex >= penaltyTiers.length) break;

          const count = group.teams.length;
          let poolForGroup = 0;
          const startIndex = currentTierIndex;
          const endIndex = Math.min(currentTierIndex + count, penaltyTiers.length);

          for (let i = startIndex; i < endIndex; i++) {
            poolForGroup += penaltyTiers[i];
          }

          const finePerTeam = poolForGroup > 0 ? Math.round(poolForGroup / count) : 0;
          const isJoint = count > 1;
          const baseLabel = rankLabels[startIndex] || `⚠️ ท้าย ${startIndex + 1}`;
          const label = isJoint ? `${baseLabel}ร่วม` : baseLabel;

          group.teams.forEach(team => {
            if (finePerTeam > 0) {
              penalties.push({
                entry_id: team.entry_id,
                team_name: team.team_name,
                player_name: team.player_name,
                net_points: team.net_points !== undefined ? team.net_points : team.points,
                fine: finePerTeam,
                rankLabel: label,
                bottomTierIndex: startIndex,
                isJoint: isJoint,
                jointCount: count
              });
            }
          });

          currentTierIndex += count;
        }

        return penalties;
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

      getRankBadge(rank, label = null) {
        const num = Number(rank);
        if (num === 1) {
          const txt = label !== null ? label : '1';
          return `<span class="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black inline-flex items-center justify-center text-[10px] border border-amber-300 dark:border-amber-300/80 shadow-xs dark:shadow-[0_0_8px_rgba(251,191,36,0.6)] flex-shrink-0">${txt}</span>`;
        }
        if (num === 2) {
          const txt = label !== null ? label : '2';
          return `<span class="w-5 h-5 rounded-full bg-slate-200 text-slate-950 font-black inline-flex items-center justify-center text-[10px] border border-slate-300 dark:bg-slate-200 dark:text-slate-950 dark:border-slate-100 shadow-xs dark:shadow-[0_0_6px_rgba(226,232,240,0.5)] flex-shrink-0">${txt}</span>`;
        }
        if (num === 3) {
          const txt = label !== null ? label : '3';
          return `<span class="w-5 h-5 rounded-full bg-amber-700 text-white dark:bg-amber-600 dark:text-amber-50 font-black inline-flex items-center justify-center text-[10px] border border-amber-800 dark:border-amber-400 shadow-xs dark:shadow-[0_0_6px_rgba(217,119,6,0.5)] flex-shrink-0">${txt}</span>`;
        }
        const disp = label !== null ? label : (rank || '-');
        return `<span class="text-slate-500 dark:text-slate-400 font-bold">${disp}</span>`;
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
                <button onclick="app.openTeamModal(${cfg.winner.entry_id})" class="font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer truncate max-w-[130px] xs:max-w-[180px] sm:max-w-none">
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
        const isBBoostChip = (c) => ['bboost', 'bench_boost'].includes(String(c || '').toLowerCase());
        const benchTeams = results.filter(r => !isBBoostChip(r.chip) && (r.bench_points || 0) >= 20).sort((a, b) => (b.bench_points || 0) - (a.bench_points || 0));
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

      // ==================== TAB: COMPETITION VIEW ====================

      getLeaderboardTeams() {
        const leagueData = this.data;
        if (!leagueData) return [];
        const teams = leagueData.teams || [];
        const maxGW = Number(this.multiData.max_gw) || 1;

        const overallMap = {};
        teams.forEach(t => {
          overallMap[t.entry_id] = {
            ...t,
            entry_id: t.entry_id,
            entry_name: t.entry_name,
            player_name: t.player_name,
            fpl_rank: Number(t.rank) || 999,
            total_points: 0
          };
        });

        for (let g = 1; g <= maxGW; g++) {
          const gData = leagueData.gameweeks ? leagueData.gameweeks[String(g)] : null;
          if (gData && gData.results) {
            const gIsStarted = gData.is_started !== undefined 
              ? Boolean(gData.is_started) 
              : (Boolean(gData.is_finished) || gData.results.some(r => r.points > 0));

            if (gIsStarted) {
              const seenInGw = new Set();
              gData.results.forEach(r => {
                if (seenInGw.has(r.entry_id)) return;
                seenInGw.add(r.entry_id);
                if (overallMap[r.entry_id]) {
                  overallMap[r.entry_id].total_points += (r.net_points || 0);
                }
              });
            }
          }
        }

        const sorted = Object.values(overallMap).sort((a, b) => {
          const aEligible = this.isPrizeEligible(a.entry_id) ? 1 : 0;
          const bEligible = this.isPrizeEligible(b.entry_id) ? 1 : 0;
          if (aEligible !== bEligible) return bEligible - aEligible;
          return (b.total_points - a.total_points) || ((a.fpl_rank || 999) - (b.fpl_rank || 999));
        });

        let curRank = 1;
        let eligibleCount = 0;
        let prevPoints = null;
        sorted.forEach((team) => {
          const isPrize = this.isPrizeEligible(team.entry_id);
          if (!isPrize) {
            team.leaderboard_rank = null;
            return;
          }
          eligibleCount++;
          if (prevPoints !== null && team.total_points < prevPoints) {
            curRank = eligibleCount;
          }
          prevPoints = team.total_points;
          team.leaderboard_rank = curRank;
        });

        return sorted;
      }

      setCompCardFilter(filter) {
        this.compCardFilter = filter;
        this.updateCompCardFilterButtons();
        this.renderCompetitionCardsTableOnly();
      }

      updateCompCardFilterButtons() {
        const filter = this.compCardFilter || 'all';
        document.querySelectorAll('.comp-card-filter-btn').forEach(btn => {
          const bFilter = btn.getAttribute('data-filter');
          const isActive = (bFilter === filter);
          if (isActive) {
            let activeBg = 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/40';
            if (bFilter === 'tc') activeBg = 'bg-pink-600 text-white shadow-xs ring-2 ring-pink-500/40';
            else if (bFilter === 'bb') activeBg = 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/40';
            else if (bFilter === 'fh') activeBg = 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-500/40';
            else if (bFilter === 'wc1') activeBg = 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/40';
            btn.className = `comp-card-filter-btn flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${activeBg} cursor-pointer`;
          } else {
            btn.className = 'comp-card-filter-btn flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700/60 cursor-pointer';
          }
        });

        // Top summary cards active state
        ['wc1', 'fh', 'tc', 'bb'].forEach(k => {
          const cardEl = document.getElementById(`comp-summary-card-${k}`);
          if (cardEl) {
            if (k === filter) {
              cardEl.classList.add('ring-2', 'ring-blue-500', 'dark:ring-blue-400');
            } else {
              cardEl.classList.remove('ring-2', 'ring-blue-500', 'dark:ring-blue-400');
            }
          }
        });
      }

      setCompCardSearch(val) {
        this.compCardSearch = (val || '').toLowerCase().trim();
        this.renderCompetitionCardsTableOnly();
      }

      setCompDiffPosFilter(pos) {
        this.compDiffPosFilter = pos;
        this.renderCompetitionDiffPlayersOnly();
      }

      setCompDiffSearch(val) {
        this.compDiffSearch = (val || '').toLowerCase().trim();
        this.renderCompetitionDiffPlayersOnly();
      }

      setCompTransferTeam(entryId) {
        this.compTransferTeam = entryId ? String(entryId) : '';
        this.renderCompetitionTransfersOnly();
      }

      setCompTransferMobileView(view) {
        this.compTransferMobileView = view;
        const btnContainer = document.getElementById('comp-transfers-mobile-btns');
        if (btnContainer) {
          const btns = btnContainer.querySelectorAll('button');
          if (btns.length === 3) {
            const activeClasses = {
              both: 'bg-blue-600 text-white shadow-xs',
              best: 'bg-emerald-600 text-white shadow-xs',
              value: 'bg-indigo-600 text-white shadow-xs'
            };
            const inactiveClass = 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white';
            ['both', 'best', 'value'].forEach((v, idx) => {
              btns[idx].className = `flex-1 py-1.5 px-2 rounded-lg text-center transition-all ${view === v ? activeClasses[v] : inactiveClass}`;
            });
          }
        }
        this.renderCompetitionTransfersOnly();
      }

      showProjectedPointsModal() {
        const modal = document.getElementById('projected-points-modal');
        if (modal) {
          modal.classList.remove('hidden');
          document.body.classList.add('overflow-hidden');
        }
      }

      closeProjectedPointsModal() {
        const modal = document.getElementById('projected-points-modal');
        if (modal) {
          modal.classList.add('hidden');
          document.body.classList.remove('overflow-hidden');
        }
      }

      toggleImportantTeamList(pid) {
        const el = document.getElementById(`important-teams-${pid}`);
        const btn = document.getElementById(`important-btn-${pid}`);
        if (!el) return;
        if (el.classList.contains('hidden')) {
          el.classList.remove('hidden');
          if (btn) btn.innerText = '▲ ซ่อนรายชื่อทีม';
        } else {
          el.classList.add('hidden');
          if (btn) btn.innerText = '▼ ดูรายชื่อทีมที่เลือก';
        }
      }

      renderCompetitionView() {
        const leagueData = this.data;
        if (!leagueData) return;
        const teams = this.getLeaderboardTeams();
        const totalTeams = teams.length;
        if (totalTeams === 0) return;

        const currentGw = this.selectedGW;
        const maxGw = Number(this.multiData.max_gw) || currentGw;

        // Set state defaults
        this.compCardFilter = this.compCardFilter || 'all';
        this.compCardSearch = this.compCardSearch || '';
        this.compDiffPosFilter = this.compDiffPosFilter || 'ALL';
        this.compDiffSearch = this.compDiffSearch || '';
        this.compTransferTeam = this.compTransferTeam || '';
        this.compTransferMobileView = this.compTransferMobileView || 'both';

        // Update Header Badges
        const leagueBadge = document.getElementById('competition-league-badge');
        const gwBadge = document.getElementById('competition-gw-badge');
        if (leagueBadge) leagueBadge.innerText = leagueData.name || `League ${this.activeLeagueId}`;
        if (gwBadge) gwBadge.innerText = `Gameweek ${currentGw}`;

        // 1. Render Card Available
        this.renderCompetitionCards(teams, totalTeams, maxGw);

        // 2. Render Important & Differential Players
        this.renderCompetitionPlayers(teams, totalTeams, currentGw);

        // 3. Render Transfer Suggestions
        this.renderCompetitionTransfers(teams, totalTeams, currentGw);
      }

      // --- Part 1: Cards Available ---
      renderCompetitionCards(teams, totalTeams, maxGw) {
        const container = document.getElementById('competition-cards-section');
        if (!container) return;

        const sortedTeams = this.getLeaderboardTeams();
        const leagueData = this.data;

        // Compute chip usage map for all teams across all gameweeks
        const chipsByTeam = {};
        let totalWc1Avail = 0;
        let totalFhAvail = 0;
        let totalTcAvail = 0;
        let totalBbAvail = 0;

        sortedTeams.forEach(t => {
          const eid = Number(t.entry_id);
          const usage = { wc1: null, wc2: null, fh: null, tc: null, bb: null };

          for (let gw = 1; gw <= maxGw; gw++) {
            const gwData = leagueData.gameweeks ? leagueData.gameweeks[String(gw)] : null;
            if (gwData && gwData.results) {
              const r = gwData.results.find(res => Number(res.entry_id) === eid);
              if (r && r.chip) {
                const c = String(r.chip).toLowerCase().trim();
                if (c === 'wildcard') {
                  if (gw <= 19) usage.wc1 = gw;
                  else usage.wc2 = gw;
                } else if (c === 'freehit') {
                  usage.fh = gw;
                } else if (c === '3xc' || c === 'triple_captain') {
                  usage.tc = gw;
                } else if (c === 'bboost' || c === 'bench_boost') {
                  usage.bb = gw;
                }
              }
            }
            // Check squads as fallback for live active chip
            const sqKey = `${eid}_${gw}`;
            const sq = leagueData.squads ? leagueData.squads[sqKey] : null;
            if (sq && sq.chip) {
              const c = String(sq.chip).toLowerCase().trim();
              if (c === 'wildcard') {
                if (gw <= 19 && usage.wc1 === null) usage.wc1 = gw;
                else if (gw > 19 && usage.wc2 === null) usage.wc2 = gw;
              } else if (c === 'freehit' && usage.fh === null) {
                usage.fh = gw;
              } else if ((c === '3xc' || c === 'triple_captain') && usage.tc === null) {
                usage.tc = gw;
              } else if ((c === 'bboost' || c === 'bench_boost') && usage.bb === null) {
                usage.bb = gw;
              }
            }
          }

          chipsByTeam[eid] = usage;

          if (usage.wc1 === null && maxGw <= 19) totalWc1Avail++;
          if (usage.fh === null) totalFhAvail++;
          if (usage.tc === null) totalTcAvail++;
          if (usage.bb === null) totalBbAvail++;
        });

        this.cachedChipsByTeam = chipsByTeam;

        // Render Top 4 Summary Cards + Filter Tabs + Table Container
        container.innerHTML = `
          <!-- Section Title -->
          <div class="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
            <div>
              <h3 class="text-sm sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                Card Available <span class="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400 font-sans">(สถานะการ์ดคงเหลือของทุกทีมในลีก %)</span>
              </h3>
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400">
              รวม <strong class="text-slate-900 dark:text-white">${totalTeams}</strong> ทีม
            </div>
          </div>

          <!-- 4 Chip Summary Stats (Clickable to Filter) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            
            <!-- WC 1 -->
            <div id="comp-summary-card-wc1" onclick="app.setCompCardFilter('wc1')" class="glass-card rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-2xs cursor-pointer hover:border-slate-400 dark:hover:border-slate-600 transition-all">
              <div class="flex items-center justify-between">
                <span class="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Wildcard 1 (GW 1-19)</span>
                <span class="chip-badge badge-wildcard">WC</span>
              </div>
              <div class="mt-2 flex items-baseline gap-1.5">
                <span class="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-display">${totalWc1Avail}</span>
                <span class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">/ ${totalTeams} ทีม</span>
                <span class="ml-auto text-xs font-bold text-slate-700 dark:text-slate-300 font-display">${Math.round(totalWc1Avail / totalTeams * 100)}%</span>
              </div>
              <p class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">เปลี่ยนตัวฟรีไม่จำกัด (ถึง GW 19)</p>
            </div>

            <!-- Free Hit -->
            <div id="comp-summary-card-fh" onclick="app.setCompCardFilter('fh')" class="glass-card rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-2xs cursor-pointer hover:border-slate-400 dark:hover:border-slate-600 transition-all">
              <div class="flex items-center justify-between">
                <span class="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Free Hit</span>
                <span class="chip-badge badge-freehit">FH</span>
              </div>
              <div class="mt-2 flex items-baseline gap-1.5">
                <span class="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-display">${totalFhAvail}</span>
                <span class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">/ ${totalTeams} ทีม</span>
                <span class="ml-auto text-xs font-bold text-slate-700 dark:text-slate-300 font-display">${Math.round(totalFhAvail / totalTeams * 100)}%</span>
              </div>
              <p class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">จัดทีมใหม่ฟรี 1 วีค</p>
            </div>

            <!-- Triple Captain -->
            <div id="comp-summary-card-tc" onclick="app.setCompCardFilter('tc')" class="glass-card rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-2xs cursor-pointer hover:border-slate-400 dark:hover:border-slate-600 transition-all">
              <div class="flex items-center justify-between">
                <span class="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Triple Captain</span>
                <span class="chip-badge badge-3xc">3xC</span>
              </div>
              <div class="mt-2 flex items-baseline gap-1.5">
                <span class="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-display">${totalTcAvail}</span>
                <span class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">/ ${totalTeams} ทีม</span>
                <span class="ml-auto text-xs font-bold text-slate-700 dark:text-slate-300 font-display">${Math.round(totalTcAvail / totalTeams * 100)}%</span>
              </div>
              <p class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">คะแนนกัปตันคูณ 3 แต้ม</p>
            </div>

            <!-- Bench Boost -->
            <div id="comp-summary-card-bb" onclick="app.setCompCardFilter('bb')" class="glass-card rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-2xs cursor-pointer hover:border-slate-400 dark:hover:border-slate-600 transition-all">
              <div class="flex items-center justify-between">
                <span class="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bench Boost</span>
                <span class="chip-badge badge-bboost">BB</span>
              </div>
              <div class="mt-2 flex items-baseline gap-1.5">
                <span class="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-display">${totalBbAvail}</span>
                <span class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">/ ${totalTeams} ทีม</span>
                <span class="ml-auto text-xs font-bold text-slate-700 dark:text-slate-300 font-display">${Math.round(totalBbAvail / totalTeams * 100)}%</span>
              </div>
              <p class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">นับแต้มผู้เล่นสำรองทั้ง 4 ตัว</p>
            </div>

          </div>

          <!-- Controls: Filters & Search -->
          <div class="glass-card rounded-2xl p-2.5 sm:p-4 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
            <!-- Filter Pills (Scrollable on Mobile) -->
            <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-scroll py-0.5 -mx-1 px-1">
              <button onclick="app.setCompCardFilter('all')" data-filter="all" class="comp-card-filter-btn flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${this.compCardFilter === 'all' ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/40' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700/60'} cursor-pointer">
                ทั้งหมด (${totalTeams})
              </button>
              <button onclick="app.setCompCardFilter('tc')" data-filter="tc" class="comp-card-filter-btn flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${this.compCardFilter === 'tc' ? 'bg-pink-600 text-white shadow-xs ring-2 ring-pink-500/40' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700/60'} cursor-pointer">
                3xC (${totalTcAvail})
              </button>
              <button onclick="app.setCompCardFilter('bb')" data-filter="bb" class="comp-card-filter-btn flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${this.compCardFilter === 'bb' ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/40' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700/60'} cursor-pointer">
                BB (${totalBbAvail})
              </button>
              <button onclick="app.setCompCardFilter('fh')" data-filter="fh" class="comp-card-filter-btn flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${this.compCardFilter === 'fh' ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-500/40' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700/60'} cursor-pointer">
                Free Hit (${totalFhAvail})
              </button>
              <button onclick="app.setCompCardFilter('wc1')" data-filter="wc1" class="comp-card-filter-btn flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${this.compCardFilter === 'wc1' ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/40' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700/60'} cursor-pointer">
                Wildcard 1 (${totalWc1Avail})
              </button>
            </div>

            <!-- Search Box -->
            <div class="relative w-full sm:w-64">
              <input 
                type="text" 
                id="comp-card-search-input" 
                placeholder="ค้นหาชื่อทีม หรือ ผู้จัดการ..." 
                value="${this.escapeHtml(this.compCardSearch)}"
                oninput="app.setCompCardSearch(this.value)"
                class="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              ${this.compCardSearch ? `<button onclick="document.getElementById('comp-card-search-input').value=''; app.setCompCardSearch('')" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer">✕</button>` : ''}
            </div>
          </div>

          <!-- Cards Table Container -->
          <div id="comp-cards-table-container" class="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
            <!-- Table body populated by renderCompetitionCardsTableOnly -->
          </div>
        `;

        this.renderCompetitionCardsTableOnly();
      }

      renderCompetitionCardsTableOnly() {
        const tableContainer = document.getElementById('comp-cards-table-container');
        if (!tableContainer) return;

        const maxGw = Number(this.multiData.max_gw) || this.selectedGW;
        const showWc2 = maxGw >= 20;
        const totalCardsPossible = showWc2 ? 5 : 4;

        const allTeams = this.getLeaderboardTeams();
        const chipsByTeam = this.cachedChipsByTeam || {};

        const search = this.compCardSearch || '';
        const filter = this.compCardFilter || 'all';

        let filteredTeams = allTeams;

        if (search) {
          filteredTeams = filteredTeams.filter(t => 
            (t.entry_name || '').toLowerCase().includes(search) || 
            (t.player_name || '').toLowerCase().includes(search)
          );
        }

        if (filter === 'tc') {
          filteredTeams = filteredTeams.filter(t => chipsByTeam[t.entry_id]?.tc === null);
        } else if (filter === 'bb') {
          filteredTeams = filteredTeams.filter(t => chipsByTeam[t.entry_id]?.bb === null);
        } else if (filter === 'fh') {
          filteredTeams = filteredTeams.filter(t => chipsByTeam[t.entry_id]?.fh === null);
        } else if (filter === 'wc1') {
          filteredTeams = filteredTeams.filter(t => chipsByTeam[t.entry_id]?.wc1 === null && maxGw <= 19);
        }

        if (filteredTeams.length === 0) {
          tableContainer.innerHTML = `
            <div class="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
              ไม่พบทีมที่ตรงกับเงื่อนไขการค้นหา
            </div>
          `;
          return;
        }

        const badgeAvail = `
          <span class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 whitespace-nowrap">
            <svg class="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            Available
          </span>
        `;

        const badgeUsed = (gw) => `
          <span class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 whitespace-nowrap line-through decoration-slate-400">
            <span class="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0"></span>
            GW ${gw}
          </span>
        `;

        const badgeWc2Upcoming = `
          <span class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800 whitespace-nowrap">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
            เริ่มใช้ GW 20
          </span>
        `;

        const badgeExpired = `
          <span class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-medium bg-slate-100 text-slate-400 border border-slate-200 dark:bg-slate-800 dark:text-slate-500 whitespace-nowrap">
            หมดอายุ
          </span>
        `;

        let rowsHtml = '';
        let hasRenderedNonPrizeHeader = false;
        filteredTeams.forEach((t) => {
          const isEligible = this.isPrizeEligible(t.entry_id);
          if (!isEligible && !hasRenderedNonPrizeHeader) {
            hasRenderedNonPrizeHeader = true;
            rowsHtml += `
              <tr class="bg-slate-100/75 dark:bg-slate-800/60 border-y border-slate-200/80 dark:border-slate-700/80">
                <td colspan="${showWc2 ? 8 : 7}" class="py-2 px-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-display sticky left-0 bg-slate-100 dark:bg-slate-800 z-10">
                  ทีมร่วมสนุก (ไม่นำมาคิดคำนวณเงินรางวัล)
                </td>
              </tr>
            `;
          }

          const usage = chipsByTeam[t.entry_id] || { wc1: null, wc2: null, fh: null, tc: null, bb: null };

          // Remaining cards count (Season total in-play)
          const remainingCount = (usage.wc1 ? 0 : 1) + 
                                 (showWc2 ? (usage.wc2 ? 0 : 1) : 0) + 
                                 (usage.fh ? 0 : 1) + 
                                 (usage.tc ? 0 : 1) + 
                                 (usage.bb ? 0 : 1);

          // Wildcard 1
          let wc1Badge = badgeAvail;
          if (usage.wc1) wc1Badge = badgeUsed(usage.wc1);
          else if (maxGw > 19) wc1Badge = badgeExpired;

          // Wildcard 2 (rendered only if showWc2 is true)
          let wc2Badge = badgeWc2Upcoming;
          if (usage.wc2) wc2Badge = badgeUsed(usage.wc2);
          else if (maxGw >= 20) wc2Badge = badgeAvail;

          // Free Hit
          const fhBadge = usage.fh ? badgeUsed(usage.fh) : badgeAvail;

          // Triple Captain
          const tcBadge = usage.tc ? badgeUsed(usage.tc) : badgeAvail;

          // Bench Boost
          const bbBadge = usage.bb ? badgeUsed(usage.bb) : badgeAvail;

          const meterColor = remainingCount >= (totalCardsPossible * 0.75) ? 'bg-emerald-500' : (remainingCount >= (totalCardsPossible * 0.5) ? 'bg-amber-500' : 'bg-rose-500');

          // Medal / Rank styling from Total Leaderboard
          let rankBadge = '';
          if (!isEligible) {
            rankBadge = this.getNonPrizeRankBadge();
          } else {
            rankBadge = this.getRankBadge(t.leaderboard_rank);
          }

          const prizeBadge = this.getPrizeBadge(t.entry_id);

          rowsHtml += `
            <tr class="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800/80">
              <td class="py-2.5 px-2 text-center text-xs font-bold w-8 sm:w-10 sticky left-0 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/60 z-10">
                ${rankBadge}
              </td>
              <td class="py-2.5 px-2.5 sm:px-3 min-w-[130px] sm:min-w-[180px] max-w-[160px] sm:max-w-[220px] sticky left-8 sm:left-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/60 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] dark:shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">
                <button onclick="app.openTeamModal(${t.entry_id})" class="text-left group cursor-pointer block truncate w-full">
                  <div class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate flex items-center gap-1.5 flex-wrap">
                    <span class="truncate">${this.escapeHtml(t.entry_name)}</span>
                    ${prizeBadge}
                  </div>
                  <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
                    <span>${this.escapeHtml(t.player_name)}</span>
                    <span class="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">(${t.total_points} pts)</span>
                  </div>
                </button>
              </td>
              <td class="py-2.5 px-2 sm:px-3 text-center whitespace-nowrap">
                <div class="inline-flex flex-col items-center">
                  <span class="text-xs font-bold text-slate-900 dark:text-white font-display">${remainingCount} / ${totalCardsPossible}</span>
                  <div class="w-14 sm:w-16 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
                    <div class="${meterColor} h-full" style="width: ${(remainingCount / totalCardsPossible) * 100}%"></div>
                  </div>
                </div>
              </td>
              <td class="py-2.5 px-2 sm:px-3 text-center">
                ${wc1Badge}
              </td>
              ${showWc2 ? `<td class="py-2.5 px-2 sm:px-3 text-center">${wc2Badge}</td>` : ''}
              <td class="py-2.5 px-2 sm:px-3 text-center">
                ${fhBadge}
              </td>
              <td class="py-2.5 px-2 sm:px-3 text-center">
                ${tcBadge}
              </td>
              <td class="py-2.5 px-2 sm:px-3 text-center">
                ${bbBadge}
              </td>
            </tr>
          `;
        });

        tableContainer.innerHTML = `
          <!-- Mobile Scroll Affordance Bar -->
          <div class="sm:hidden flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-3 py-1.5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            <span class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              เรียงตาม Total Leaderboard
            </span>
            <span class="text-[10px] text-slate-400 font-medium">👉 เลื่อนขวาดูสถานะการ์ด</span>
          </div>

          <div class="overflow-x-auto touch-scroll no-scrollbar">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 font-display uppercase tracking-wider">
                  <th class="py-2.5 px-2 text-center w-8 sm:w-10 sticky left-0 bg-slate-50 dark:bg-slate-800 z-20">#</th>
                  <th class="py-2.5 px-2.5 sm:px-3 sticky left-8 sm:left-10 bg-slate-50 dark:bg-slate-800 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] dark:shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">ทีม & ผู้จัดการ</th>
                  <th class="py-2.5 px-2 sm:px-3 text-center whitespace-nowrap">การ์ดคงเหลือ</th>
                  <th class="py-2.5 px-2 sm:px-3 text-center whitespace-nowrap">Wildcard 1</th>
                  ${showWc2 ? '<th class="py-2.5 px-2 sm:px-3 text-center whitespace-nowrap">Wildcard 2</th>' : ''}
                  <th class="py-2.5 px-2 sm:px-3 text-center whitespace-nowrap">Free Hit</th>
                  <th class="py-2.5 px-2 sm:px-3 text-center whitespace-nowrap">Triple Capt</th>
                  <th class="py-2.5 px-2 sm:px-3 text-center whitespace-nowrap">Bench Boost</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80">
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        `;
      }

      // --- Part 2: Important & Differential Players ---
      renderCompetitionPlayers(teams, totalTeams, currentGw) {
        const leagueData = this.data;
        const maxGw = Number(this.multiData.max_gw) || currentGw;

        // Compute player counts across all teams in the active league
        const pCounts = {};

        teams.forEach(t => {
          const eid = Number(t.entry_id);
          let sq = leagueData.squads ? leagueData.squads[`${eid}_${currentGw}`] : null;
          if (!sq && leagueData.squads) {
            sq = leagueData.squads[`${eid}_${maxGw}`];
          }
          if (!sq) return;

          const allPicks = (sq.starting || []).concat(sq.bench || []);
          allPicks.forEach(p => {
            const pid = p.id;
            if (!pCounts[pid]) {
              pCounts[pid] = {
                id: pid,
                name: p.name,
                pos: p.pos || 'MID',
                team: p.team || 'UNK',
                team_code: p.team_code || FPL_TEAM_CODES[p.team] || 0,
                count: 0,
                teams: []
              };
            }
            pCounts[pid].count += 1;
            pCounts[pid].teams.push({
              entry_id: eid,
              team_name: t.entry_name,
              player_name: t.player_name
            });
          });
        });

        this.cachedPlayerCounts = pCounts;

        // 1. Important Players (> 70%)
        const importantSection = document.getElementById('competition-important-section');
        if (importantSection) {
          const importantList = Object.values(pCounts)
            .filter(p => (p.count / totalTeams) > 0.70)
            .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

          let impHtml = `
            <div>
              <!-- Header -->
              <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <div>
                  <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                    Important Players <span class="text-xs font-normal text-slate-500 dark:text-slate-400 font-sans">(มหาชน > 70%)</span>
                  </h3>
                </div>
                <span class="px-2.5 py-1 rounded-xl text-xs font-bold font-display bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  ${importantList.length} คน
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mb-3.5">
                นักเตะที่ถูกเลือกมากกว่า 70% ของลีก เป็นตัวหลักที่ต้องมีเพื่อรักษาระยะห่างแต้ม
              </p>

              <!-- Players List -->
              <div class="space-y-3">
          `;

          if (importantList.length === 0) {
            impHtml += `
              <div class="p-6 text-center text-slate-400 dark:text-slate-500 text-xs bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                ไม่มีนักเตะที่ถูกเลือกเกิน 70% ใน Gameweek นี้
              </div>
            `;
          } else {
            const posBadgeColors = {
              'GKP': 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
              'DEF': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
              'MID': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
              'FWD': 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            };

            importantList.forEach(p => {
              const pct = (p.count / totalTeams) * 100;
              const shirtUrl = this.getPlayerShirtUrl(p);
              const posColor = posBadgeColors[p.pos] || 'bg-slate-100 text-slate-800';

              impHtml += `
                <div class="bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 transition-all">
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2.5 min-w-0">
                      <img src="${shirtUrl}" alt="${p.team}" class="w-8 h-8 object-contain flex-shrink-0" onerror="this.onerror=null; this.src='https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_0-66.webp';" />
                      <div class="min-w-0">
                        <div class="flex items-center gap-1.5 flex-wrap">
                          <span class="font-bold text-slate-900 dark:text-white text-sm truncate">${this.escapeHtml(p.name)}</span>
                          <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${posColor}">${p.pos}</span>
                          <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">${p.team}</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-right flex-shrink-0">
                      <div class="text-xs font-black text-blue-600 dark:text-blue-400 font-display">${pct.toFixed(1)}%</div>
                      <div class="text-[10px] text-slate-500 dark:text-slate-400">${p.count}/${totalTeams} ทีม</div>
                    </div>
                  </div>

                  <!-- Progress Bar -->
                  <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-2.5">
                    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                  </div>

                  <!-- Collapsible Teams List Toggle -->
                  <div class="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <button id="important-btn-${p.id}" onclick="app.toggleImportantTeamList(${p.id})" class="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                      ▼ ดูรายชื่อทีมที่เลือก (${p.teams.length} ทีม)
                    </button>
                    <span class="text-[10px] text-slate-400">มหาชนตัวจริง</span>
                  </div>

                  <!-- Team tags list (hidden by default) -->
                  <div id="important-teams-${p.id}" class="hidden mt-2 pt-1 flex flex-wrap gap-1.5">
                    ${p.teams.map(t => `
                      <button onclick="app.openTeamModal(${t.entry_id})" class="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors cursor-pointer truncate max-w-[150px]">
                        ${this.escapeHtml(t.team_name)}
                      </button>
                    `).join('')}
                  </div>

                </div>
              `;
            });
          }

          impHtml += `
              </div>
            </div>
          `;
          importantSection.innerHTML = impHtml;
        }

        // 2. Differential Players (< 20%)
        this.renderCompetitionDiffPlayersOnly();
      }

      renderCompetitionDiffPlayersOnly() {
        const diffSection = document.getElementById('competition-differential-section');
        if (!diffSection) return;

        const pCounts = this.cachedPlayerCounts || {};
        const teams = this.data.teams || [];
        const totalTeams = teams.length;

        const posFilter = this.compDiffPosFilter || 'ALL';
        const search = this.compDiffSearch || '';

        let diffList = Object.values(pCounts)
          .filter(p => (p.count / totalTeams) < 0.20 && p.count > 0)
          .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

        const countsByPos = {
          'ALL': diffList.length,
          'GKP': diffList.filter(p => p.pos === 'GKP').length,
          'DEF': diffList.filter(p => p.pos === 'DEF').length,
          'MID': diffList.filter(p => p.pos === 'MID').length,
          'FWD': diffList.filter(p => p.pos === 'FWD').length
        };

        if (posFilter !== 'ALL') {
          diffList = diffList.filter(p => p.pos === posFilter);
        }

        if (search) {
          diffList = diffList.filter(p => 
            p.name.toLowerCase().includes(search) || 
            p.team.toLowerCase().includes(search)
          );
        }

        const posBadgeColors = {
          'GKP': 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
          'DEF': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
          'MID': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
          'FWD': 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
        };

        let diffHtml = `
          <div>
            <!-- Header -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <div>
                <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                  Differential Players <span class="text-xs font-normal text-slate-500 dark:text-slate-400 font-sans">(ทีเด็ด < 20%)</span>
                </h3>
              </div>
              <span class="px-2.5 py-1 rounded-xl text-xs font-bold font-display bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                ${countsByPos.ALL} คน
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">
              นักเตะที่ถูกเลือกน้อยกว่า 20% ในลีก มีอย่างน้อย 1 ทีมเลือกใช้ แต้มมาเมื่อไหร่อันดับพุ่งฉีกคู่แข่ง!
            </p>

            <!-- Position Filter Pills & Search -->
            <div class="space-y-2 mb-3.5">
              <div class="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                ${['ALL', 'GKP', 'DEF', 'MID', 'FWD'].map(pos => `
                  <button onclick="app.setCompDiffPosFilter('${pos}')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${this.compDiffPosFilter === pos ? 'bg-slate-900 text-white dark:bg-amber-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}">
                    ${pos} (${countsByPos[pos]})
                  </button>
                `).join('')}
              </div>
              <div class="relative">
                <input 
                  type="text" 
                  placeholder="ค้นหานักเตะทีเด็ด..." 
                  value="${this.escapeHtml(this.compDiffSearch)}"
                  oninput="app.setCompDiffSearch(this.value)"
                  class="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <!-- Scrollable List of Differentials -->
            <div class="max-h-[520px] overflow-y-auto space-y-2.5 pr-1 touch-scroll">
        `;

        if (diffList.length === 0) {
          diffHtml += `
            <div class="p-6 text-center text-slate-400 dark:text-slate-500 text-xs bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              ไม่พบนักเตะทีเด็ดตามเงื่อนไขที่เลือก
            </div>
          `;
        } else {
          diffList.forEach(p => {
            const pct = (p.count / totalTeams) * 100;
            const shirtUrl = this.getPlayerShirtUrl(p);
            const posColor = posBadgeColors[p.pos] || 'bg-slate-100 text-slate-800';

            diffHtml += `
              <div class="bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl p-2.5 sm:p-3 border border-slate-200/80 dark:border-slate-800 transition-all hover:border-amber-400/50">
                <div class="flex items-center justify-between gap-2.5">
                  <div class="flex items-center gap-2 min-w-0">
                    <img src="${shirtUrl}" alt="${p.team}" class="w-7 h-7 object-contain flex-shrink-0" onerror="this.onerror=null; this.src='https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_0-66.webp';" />
                    <div class="min-w-0">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">${this.escapeHtml(p.name)}</span>
                        <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${posColor}">${p.pos}</span>
                        <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">${p.team}</span>
                      </div>
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <div class="text-xs font-black text-amber-600 dark:text-amber-400 font-display">${pct.toFixed(1)}%</div>
                    <div class="text-[10px] text-slate-500 dark:text-slate-400">${p.count}/${totalTeams} ทีม</div>
                  </div>
                </div>

                <!-- Teams that picked this differential -->
                <div class="mt-2 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center gap-1.5 flex-wrap">
                  <span class="text-[10px] text-slate-400 dark:text-slate-500">ทีมที่ถือครอง:</span>
                  ${p.teams.map(t => `
                    <button onclick="app.openTeamModal(${t.entry_id})" class="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors cursor-pointer truncate max-w-[130px]" title="${this.escapeHtml(t.player_name)}">
                      ${this.escapeHtml(t.team_name)}
                    </button>
                  `).join('')}
                </div>
              </div>
            `;
          });
        }

        diffHtml += `
            </div>
          </div>
        `;
        diffSection.innerHTML = diffHtml;
      }

      // --- Part 3: Transfer Suggestions ---
      renderCompetitionTransfers(teams, totalTeams, currentGw) {
        const container = document.getElementById('competition-transfers-section');
        if (!container) return;

        const sugg = this.multiData.transfer_suggestions || {};
        const suggGw = sugg.gw || (currentGw + 1);
        const sortedTeams = this.getLeaderboardTeams();

        container.innerHTML = `
          <!-- Section Container with Light/Dark Mode support -->
          <div class="glass-card rounded-2xl p-3.5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs dark:shadow-xl space-y-3 sm:space-y-4">
            
            <!-- Header Row -->
            <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                  Transfer Suggestions <span class="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400 font-sans">(คำแนะนำการย้ายตัว)</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-sans">
                    GW ${suggGw}
                  </span>
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  วิเคราะห์ตัวเลือกที่ดีที่สุด (Best Players) และตัวเลือกสุดคุ้มค่า (Best Value) พร้อมคะแนนคาดการณ์ประจำสัปดาห์
                </p>
              </div>

              <!-- Team Highlighter Selector (Ordered by Total Leaderboard) -->
              <div class="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <label for="comp-transfers-team-select" class="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  ไฮไลท์นักเตะในทีม:
                </label>
                <select 
                  id="comp-transfers-team-select" 
                  onchange="app.setCompTransferTeam(this.value)"
                  class="w-full sm:w-auto bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
                >
                  <option value="">-- ภาพรวมทั้งลีก (แสดง % ถือครองในลีก) --</option>
                  ${sortedTeams.map(t => {
                    const isPrize = this.isPrizeEligible(t.entry_id);
                    const rankLabel = isPrize ? `#${t.leaderboard_rank}` : `[ร่วมสนุก]`;
                    return `
                      <option value="${t.entry_id}" ${String(this.compTransferTeam) === String(t.entry_id) ? 'selected' : ''}>
                        ${rankLabel} ${this.escapeHtml(t.entry_name)} (${this.escapeHtml(t.player_name)})
                      </option>
                    `;
                  }).join('')}
                </select>
              </div>
            </div>

            <!-- Mobile View Switcher (< sm screens) -->
            <div id="comp-transfers-mobile-btns" class="sm:hidden flex items-center p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl text-xs font-bold border border-slate-200/80 dark:border-slate-700/60">
              <button onclick="app.setCompTransferMobileView('both')" class="flex-1 py-1.5 px-2 rounded-lg text-center transition-all ${this.compTransferMobileView === 'both' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}">
                ตารางคู่ (เลื่อนข้าง)
              </button>
              <button onclick="app.setCompTransferMobileView('best')" class="flex-1 py-1.5 px-2 rounded-lg text-center transition-all ${this.compTransferMobileView === 'best' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}">
                Best Players
              </button>
              <button onclick="app.setCompTransferMobileView('value')" class="flex-1 py-1.5 px-2 rounded-lg text-center transition-all ${this.compTransferMobileView === 'value' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}">
                Best Value
              </button>
            </div>

            <!-- Table Container -->
            <div id="comp-transfers-table-container">
              <!-- Rendered by renderCompetitionTransfersOnly -->
            </div>

          </div>
        `;

        this.renderCompetitionTransfersOnly();
      }

      renderCompetitionTransfersOnly() {
        const tableContainer = document.getElementById('comp-transfers-table-container');
        if (!tableContainer) return;

        const sugg = this.multiData.transfer_suggestions || {};
        const teams = this.getLeaderboardTeams();
        const totalTeams = teams.length;
        const currentGw = this.selectedGW;
        const maxGw = Number(this.multiData.max_gw) || currentGw;
        const pCounts = this.cachedPlayerCounts || {};
        const mobileView = this.compTransferMobileView || 'both';

        // If a team is selected, get its squad for highlighting
        let selectedTeamPlayerIds = new Set();
        let selectedTeamName = '';
        if (this.compTransferTeam) {
          const tEid = Number(this.compTransferTeam);
          const tObj = teams.find(t => Number(t.entry_id) === tEid);
          if (tObj) selectedTeamName = tObj.entry_name;
          const sq = this.data.squads ? (this.data.squads[`${tEid}_${currentGw}`] || this.data.squads[`${tEid}_${maxGw}`]) : null;
          if (sq) {
            (sq.starting || []).concat(sq.bench || []).forEach(p => selectedTeamPlayerIds.add(Number(p.id)));
          }
        }

        const formatCost = (c) => {
          if (c == null) return '-';
          const n = Number(c);
          return (n % 1 === 0 ? n : n.toFixed(1)) + 'm';
        };

        const formatPts = (pts) => {
          if (pts == null) return '-';
          return Number(pts).toFixed(1);
        };

        const categories = [
          { key: 'GoalKeepers', title: 'Goalkeepers', pos: 'GKP' },
          { key: 'Defenders', title: 'Defenders', pos: 'DEF' },
          { key: 'Midfielders', title: 'Midfielders', pos: 'MID' },
          { key: 'Forwards', title: 'Forwards', pos: 'FWD' }
        ];

        const hasAnyItems = categories.some(cat => (sugg[cat.key] || []).length > 0);
        if (!hasAnyItems) {
          tableContainer.innerHTML = `
            <div class="py-8 px-4 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <span class="text-3xl block mb-2">⏳</span>
              <p class="font-bold text-sm text-slate-700 dark:text-slate-300">กำลังประมวลผลคำแนะนำการย้ายตัวสำหรับ Gameweek ถัดไป</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">ระบบจะแสดงรายชื่อ Best Players และ Best Value อัตโนมัติเมื่อข้อมูลโปรแกรมแข่งขันและสถิติอัปเดตเรียบร้อย</p>
            </div>
          `;
          return;
        }

        // 1. Single-column Mobile View: Best Players Only
        if (mobileView === 'best') {
          let rowsHtml = '';
          categories.forEach(cat => {
            const items = sugg[cat.key] || [];
            if (items.length === 0) return;

            rowsHtml += `
              <tr class="bg-slate-100/90 dark:bg-slate-800/90 border-y border-slate-200/80 dark:border-slate-700/60">
                <td colspan="3" class="py-2.5 px-3 text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider font-display">
                  ${cat.title}
                </td>
              </tr>
            `;

            items.forEach(item => {
              const best = item.ValuePlayer || {};
              const isBestInTeam = best.Id ? selectedTeamPlayerIds.has(Number(best.Id)) : false;
              const bestOwnerCount = best.Id && pCounts[best.Id] ? pCounts[best.Id].count : 0;
              const bestOwnerPct = totalTeams > 0 ? ((bestOwnerCount / totalTeams) * 100).toFixed(0) : 0;
              const bestShirtUrl = this.getPlayerShirtUrl({ pos: cat.pos, team: best.TeamName });

              const bestNameClass = isBestInTeam 
                ? 'font-bold text-emerald-900 dark:text-white bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-500/40 px-1.5 py-0.5 rounded text-xs' 
                : 'text-slate-800 dark:text-slate-200 text-xs';

              const bestLeagueTag = (this.compTransferTeam === '') 
                ? `<span class="text-[10px] text-slate-500 dark:text-slate-400 font-normal ml-1.5 font-display" title="ถือครองในลีกนี้ ${bestOwnerCount}/${totalTeams} ทีม">${bestOwnerCount > 0 ? `${bestOwnerPct}%` : '0%'}</span>`
                : (isBestInTeam ? `<span class="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold ml-1">● ในทีม</span>` : '');

              rowsHtml += `
                <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800/60 text-xs">
                  <td class="py-2.5 px-2.5 text-left">
                    <div class="flex items-center gap-2 min-w-0">
                      <img src="${bestShirtUrl}" alt="${best.TeamName || ''}" class="w-6 h-6 object-contain flex-shrink-0" onerror="this.onerror=null; this.src='https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_0-66.webp';" />
                      <span class="${bestNameClass} truncate" title="${best.PlayerWebName || ''}">
                        ${best.PlayerWebName || '-'}
                      </span>
                      ${bestLeagueTag}
                    </div>
                  </td>
                  <td class="py-2.5 px-2 text-right font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    ${formatCost(best.Cost)}
                  </td>
                  <td class="py-2.5 px-2 text-right font-mono font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    ${formatPts(best.ExpectedPoints)}
                  </td>
                </tr>
              `;
            });
          });

          tableContainer.innerHTML = `
            <div class="w-full">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-display uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
                    <th style="width: 60%;" class="py-2 px-2.5 text-left">Best players</th>
                    <th style="width: 20%;" class="py-2 px-2 text-right">Price</th>
                    <th style="width: 20%;" class="py-2 px-2 text-right">
                      <span class="inline-flex items-center justify-end gap-1">
                        Pts
                        <button onclick="app.showProjectedPointsModal()" class="w-4 h-4 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center text-[10px] cursor-pointer" title="Projected Points Info">?</button>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/40">
                  ${rowsHtml}
                </tbody>
              </table>
            </div>
          `;
          return;
        }

        // 2. Single-column Mobile View: Best Value Only
        if (mobileView === 'value') {
          let rowsHtml = '';
          categories.forEach(cat => {
            const items = sugg[cat.key] || [];
            if (items.length === 0) return;

            rowsHtml += `
              <tr class="bg-slate-100/90 dark:bg-slate-800/90 border-y border-slate-200/80 dark:border-slate-700/60">
                <td colspan="3" class="py-2.5 px-3 text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider font-display">
                  ${cat.title}
                </td>
              </tr>
            `;

            items.forEach(item => {
              const val = item.GoodPlayer || {};
              const isValInTeam = val.Id ? selectedTeamPlayerIds.has(Number(val.Id)) : false;
              const valOwnerCount = val.Id && pCounts[val.Id] ? pCounts[val.Id].count : 0;
              const valOwnerPct = totalTeams > 0 ? ((valOwnerCount / totalTeams) * 100).toFixed(0) : 0;
              const valShirtUrl = this.getPlayerShirtUrl({ pos: cat.pos, team: val.TeamName });

              const valNameClass = isValInTeam 
                ? 'font-bold text-emerald-900 dark:text-white bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-500/40 px-1.5 py-0.5 rounded text-xs' 
                : 'text-slate-800 dark:text-slate-200 text-xs';

              const valLeagueTag = (this.compTransferTeam === '') 
                ? `<span class="text-[10px] text-slate-500 dark:text-slate-400 font-normal ml-1.5 font-display" title="ถือครองในลีกนี้ ${valOwnerCount}/${totalTeams} ทีม">${valOwnerCount > 0 ? `${valOwnerPct}%` : '0%'}</span>`
                : (isValInTeam ? `<span class="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold ml-1">● ในทีม</span>` : '');

              rowsHtml += `
                <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800/60 text-xs">
                  <td class="py-2.5 px-2.5 text-left">
                    <div class="flex items-center gap-2 min-w-0">
                      <img src="${valShirtUrl}" alt="${val.TeamName || ''}" class="w-6 h-6 object-contain flex-shrink-0" onerror="this.onerror=null; this.src='https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_0-66.webp';" />
                      <span class="${valNameClass} truncate" title="${val.PlayerWebName || ''}">
                        ${val.PlayerWebName || '-'}
                      </span>
                      ${valLeagueTag}
                    </div>
                  </td>
                  <td class="py-2.5 px-2 text-right font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    ${formatCost(val.Cost)}
                  </td>
                  <td class="py-2.5 px-2 text-right font-mono font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    ${formatPts(val.ExpectedPoints)}
                  </td>
                </tr>
              `;
            });
          });

          tableContainer.innerHTML = `
            <div class="w-full">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-display uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
                    <th style="width: 60%;" class="py-2 px-2.5 text-left">Best Value</th>
                    <th style="width: 20%;" class="py-2 px-2 text-right">Price</th>
                    <th style="width: 20%;" class="py-2 px-2 text-right">
                      <span class="inline-flex items-center justify-end gap-1">
                        Pts
                        <button onclick="app.showProjectedPointsModal()" class="w-4 h-4 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center text-[10px] cursor-pointer" title="Projected Points Info">?</button>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/40">
                  ${rowsHtml}
                </tbody>
              </table>
            </div>
          `;
          return;
        }

        // 3. Side-by-Side Dual Comparison Table (Default & Desktop)
        let tableRowsHtml = '';

        categories.forEach(cat => {
          const items = sugg[cat.key] || [];
          if (items.length === 0) return;

          // Category Subheader Row
          tableRowsHtml += `
            <tr class="bg-slate-100/90 dark:bg-slate-800/90 border-y border-slate-200/80 dark:border-slate-700/60">
              <td colspan="7" class="py-2.5 px-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider font-display">
                ${cat.title}
              </td>
            </tr>
          `;

          items.forEach(item => {
            const best = item.ValuePlayer || {};
            const val = item.GoodPlayer || {};

            const isBestInTeam = best.Id ? selectedTeamPlayerIds.has(Number(best.Id)) : false;
            const isValInTeam = val.Id ? selectedTeamPlayerIds.has(Number(val.Id)) : false;

            const bestOwnerCount = best.Id && pCounts[best.Id] ? pCounts[best.Id].count : 0;
            const bestOwnerPct = totalTeams > 0 ? ((bestOwnerCount / totalTeams) * 100).toFixed(0) : 0;

            const valOwnerCount = val.Id && pCounts[val.Id] ? pCounts[val.Id].count : 0;
            const valOwnerPct = totalTeams > 0 ? ((valOwnerCount / totalTeams) * 100).toFixed(0) : 0;

            // Shirt URLs
            const bestShirtUrl = this.getPlayerShirtUrl({ pos: cat.pos, team: best.TeamName });
            const valShirtUrl = this.getPlayerShirtUrl({ pos: cat.pos, team: val.TeamName });

            // Badges or text highlighting
            const bestNameClass = isBestInTeam 
              ? 'font-bold text-emerald-900 dark:text-white bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-500/40 px-1.5 py-0.5 rounded text-xs' 
              : 'text-slate-800 dark:text-slate-200 text-xs';
            
            const valNameClass = isValInTeam 
              ? 'font-bold text-emerald-900 dark:text-white bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-500/40 px-1.5 py-0.5 rounded text-xs' 
              : 'text-slate-800 dark:text-slate-200 text-xs';

            const bestLeagueTag = (this.compTransferTeam === '') 
              ? `<span class="text-[10px] text-slate-500 dark:text-slate-400 font-normal ml-1.5 font-display" title="ถือครองในลีกนี้ ${bestOwnerCount}/${totalTeams} ทีม">${bestOwnerCount > 0 ? `${bestOwnerPct}%` : '0%'}</span>`
              : (isBestInTeam ? `<span class="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold ml-1">● ในทีม</span>` : '');

            const valLeagueTag = (this.compTransferTeam === '') 
              ? `<span class="text-[10px] text-slate-500 dark:text-slate-400 font-normal ml-1.5 font-display" title="ถือครองในลีกนี้ ${valOwnerCount}/${totalTeams} ทีม">${valOwnerCount > 0 ? `${valOwnerPct}%` : '0%'}</span>`
              : (isValInTeam ? `<span class="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold ml-1">● ในทีม</span>` : '');

            tableRowsHtml += `
              <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800/60 text-xs">
                
                <!-- Best Player: Shirt + Name -->
                <td class="py-2.5 px-2.5 sm:px-3 text-left">
                  <div class="flex items-center gap-2 min-w-0">
                    <img src="${bestShirtUrl}" alt="${best.TeamName || ''}" class="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0" onerror="this.onerror=null; this.src='https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_0-66.webp';" />
                    <span class="${bestNameClass} truncate" title="${best.PlayerWebName || ''}">
                      ${best.PlayerWebName || '-'}
                    </span>
                    ${bestLeagueTag}
                  </div>
                </td>

                <!-- Best Player: Price -->
                <td class="py-2.5 px-2 text-right font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  ${formatCost(best.Cost)}
                </td>

                <!-- Best Player: Pts -->
                <td class="py-2.5 px-2 text-right font-mono font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                  ${formatPts(best.ExpectedPoints)}
                </td>

                <!-- Divider Column -->
                <td class="py-2.5 px-1 sm:px-2 border-r border-slate-200 dark:border-slate-800"></td>

                <!-- Best Value: Shirt + Name -->
                <td class="py-2.5 px-2.5 sm:px-3 text-left">
                  <div class="flex items-center gap-2 min-w-0">
                    <img src="${valShirtUrl}" alt="${val.TeamName || ''}" class="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0" onerror="this.onerror=null; this.src='https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_0-66.webp';" />
                    <span class="${valNameClass} truncate" title="${val.PlayerWebName || ''}">
                      ${val.PlayerWebName || '-'}
                    </span>
                    ${valLeagueTag}
                  </div>
                </td>

                <!-- Best Value: Price -->
                <td class="py-2.5 px-2 text-right font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  ${formatCost(val.Cost)}
                </td>

                <!-- Best Value: Pts -->
                <td class="py-2.5 px-2 text-right font-mono font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                  ${formatPts(val.ExpectedPoints)}
                </td>

              </tr>
            `;
          });
        });

        tableContainer.innerHTML = `
          <!-- Mobile Scroll Hint -->
          <div class="sm:hidden flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pb-1.5 border-b border-slate-200 dark:border-slate-800 px-1">
            <span>เปรียบเทียบทั้งคู่</span>
            <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">👈 เลื่อนดู Best Value 👉</span>
          </div>

          <div class="overflow-x-auto touch-scroll no-scrollbar -mx-2 sm:mx-0">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-display uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
                  <th style="width: 28%;" class="py-2 px-2.5 sm:px-3 text-left">Best players</th>
                  <th style="width: 10%;" class="py-2 px-2 text-right">Price</th>
                  <th style="width: 11%;" class="py-2 px-2 text-right">
                    <span class="inline-flex items-center justify-end gap-1">
                      Pts
                      <button onclick="app.showProjectedPointsModal()" class="w-4 h-4 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center text-[10px] cursor-pointer" title="Projected Points Info">?</button>
                    </span>
                  </th>
                  <th style="width: 2%;" class="py-2 px-1 border-r border-slate-200 dark:border-slate-800"></th>
                  <th style="width: 28%;" class="py-2 px-2.5 sm:px-3 text-left">Best Value</th>
                  <th style="width: 10%;" class="py-2 px-2 text-right">Price</th>
                  <th style="width: 11%;" class="py-2 px-2 text-right">
                    <span class="inline-flex items-center justify-end gap-1">
                      Pts
                      <button onclick="app.showProjectedPointsModal()" class="w-4 h-4 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center text-[10px] cursor-pointer" title="Projected Points Info">?</button>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/40">
                ${tableRowsHtml}
              </tbody>
            </table>
          </div>
        `;
      }

      renderPrizesView() {
        const titleEl = document.getElementById('prizes-overview-title');
        const subEl = document.getElementById('prizes-overview-subtitle');
        const poolBadge = document.getElementById('prizes-pool-badge');
        const mainContainer = document.getElementById('prizes-main-content');
        const tagEl = document.getElementById('prizes-overview-tag');
        const topBanner = document.getElementById('prizes-top-banner');

        const isAnnualZeroSum = Boolean(this.config && this.config.features && (this.config.features.prize_model === 'annual_zero_sum' || this.config.features.prize_model === 'annual'));

        if (topBanner) {
          if (isAnnualZeroSum) {
            topBanner.classList.add('hidden');
          } else {
            topBanner.classList.remove('hidden');
          }
        }

        if (poolBadge) poolBadge.innerText = this.config.total_pool || 'เงินรางวัล';

        const isWeekly = (this.config.features.prize_model === 'weekly');

        if (isWeekly) {
          const weeklyPrizesConfig = this.config.features.weekly_prizes;
          const hasWeeklyPenalties = Boolean(this.config.features && this.config.features.has_weekly_penalties);
          const hasMultiTier = Boolean(weeklyPrizesConfig && Object.keys(weeklyPrizesConfig).length > 1);

          const tierPrizes = weeklyPrizesConfig 
            ? Object.values(weeklyPrizesConfig).map(Number)
            : [this.config.features.weekly_prize_amount || (hasWeeklyPenalties ? 200 : 300)];
          const weeklyAmount = tierPrizes.reduce((a, b) => a + b, 0);
          const weeklyTotal = weeklyAmount * 38;

          const penaltyTiersList = (hasWeeklyPenalties && this.config.features.weekly_penalty_tiers)
            ? Object.values(this.config.features.weekly_penalty_tiers).map(Number)
            : [600, 500, 400, 300, 200];
          const totalWeeklyFines = penaltyTiersList.reduce((a, b) => a + b, 0);
          const weeklyChampPrize = this.config.features.weekly_prize_amount || 200;
          const weeklyNetPot = totalWeeklyFines - weeklyChampPrize;
          const seasonNetTotal = weeklyNetPot * 38;

          if (tagEl) {
            tagEl.innerText = hasWeeklyPenalties ? 'WEEKLY FINES & ACCUMULATED POT' : 'WEEKLY PRIZES';
          }
          if (titleEl && hasWeeklyPenalties) {
            titleEl.innerText = 'สรุปแชมป์สัปดาห์ & กองกลางสะสมค่าปรับ';
          }

          if (subEl) {
            if (hasWeeklyPenalties) {
              subEl.innerText = `รางวัลแชมป์สัปดาห์ ${weeklyChampPrize.toLocaleString()} THB • ค่าปรับ 5 อันดับท้ายรวม ${totalWeeklyFines.toLocaleString()} THB/วีค (สะสมเข้ากองกลางสุทธิ ${weeklyNetPot.toLocaleString()} THB/วีค x 38 วีค = ${seasonNetTotal.toLocaleString()} THB)`;
            } else if (weeklyPrizesConfig) {
              subEl.innerText = `ชิงเงินรางวัลรวม ${this.config.total_pool || '103,200 THB'} (รางวัลประจำสัปดาห์ 3 อันดับ: ที่ 1: ${weeklyPrizesConfig['1st'].toLocaleString()} / ที่ 2: ${weeklyPrizesConfig['2nd'].toLocaleString()} / ที่ 3: ${weeklyPrizesConfig['3rd'].toLocaleString()} THB รวมวีคละ ${weeklyAmount.toLocaleString()} THB x 38 วีค = ${weeklyTotal.toLocaleString()} THB)`;
            } else {
              subEl.innerText = `ชิงเงินรางวัลรวม ${this.config.total_pool} (แชมป์สัปดาห์ละ ${weeklyAmount.toLocaleString()} THB x 38 สัปดาห์ = ${weeklyTotal.toLocaleString()} THB)`;
            }
          }

          const maxGW = Number(this.multiData.max_gw) || 2;
          const winsCount = {};
          const prizeEarnings = {};
          const tierCounts = {};
          const finesPaid = {};
          const dangerCount = {};
          const multiTierGWEntries = [];
          const penaltyHistoryEntries = [];
          let finishedGWCount = 0;

          (this.data.teams || []).forEach(t => {
            winsCount[t.entry_id] = 0;
            prizeEarnings[t.entry_id] = 0;
            tierCounts[t.entry_id] = { 1: 0, 2: 0, 3: 0 };
            finesPaid[t.entry_id] = 0;
            dangerCount[t.entry_id] = 0;
          });

          for (let g = 1; g <= maxGW; g++) {
            const gData = this.data.gameweeks ? this.data.gameweeks[String(g)] : null;
            if (gData && gData.results && gData.is_finished) {
              finishedGWCount++;
              const eligibleResults = gData.results.filter(r => this.isPrizeEligible(r.entry_id));
              const useTieBreaker = Boolean(this.config && this.config.features && this.config.features.tie_breaker === 'highest_player');
              const sorted = [...eligibleResults].sort((a, b) => {
                const diff = b.net_points - a.net_points;
                if (diff !== 0) return diff;
                if (useTieBreaker) {
                  return this.compareTeamPlayerScores(a.entry_id, b.entry_id, g);
                }
                return 0;
              });

              if (sorted.length > 0) {
                if (hasWeeklyPenalties) {
                  const winnerPayouts = this.calculateWeeklyTierPrizes(sorted, [weeklyChampPrize], g);
                  winnerPayouts.forEach(p => {
                    winsCount[p.entry_id] = (winsCount[p.entry_id] || 0) + (1 / p.jointCount);
                    prizeEarnings[p.entry_id] = (prizeEarnings[p.entry_id] || 0) + p.prize;
                  });
                  const winner = sorted[0];

                  const weeklyPenalties = this.calculateWeeklyPenalties(sorted, g);
                  const bottomList = [];
                  weeklyPenalties.forEach(p => {
                    finesPaid[p.entry_id] = (finesPaid[p.entry_id] || 0) + p.fine;
                    dangerCount[p.entry_id] = (dangerCount[p.entry_id] || 0) + 1;
                    bottomList.push({
                      rankLabel: p.rankLabel,
                      fine: p.fine,
                      team_name: p.team_name,
                      player_name: p.player_name,
                      net_points: p.net_points,
                      entry_id: p.entry_id,
                      bottomTierIndex: p.bottomTierIndex
                    });
                  });
                  penaltyHistoryEntries.push({
                    gw: g,
                    winner: winner,
                    bottomList: bottomList,
                    netPot: weeklyNetPot
                  });
                } else {
                  const payouts = this.calculateWeeklyTierPrizes(sorted, tierPrizes, g);
                  if (hasMultiTier) {
                    multiTierGWEntries.push({
                      gw: g,
                      payouts: payouts
                    });
                  }
                  payouts.forEach(p => {
                    if (winsCount[p.entry_id] === undefined) {
                      winsCount[p.entry_id] = 0;
                      prizeEarnings[p.entry_id] = 0;
                      tierCounts[p.entry_id] = { 1: 0, 2: 0, 3: 0 };
                    }
                    if (p.rank === 1) {
                      winsCount[p.entry_id] += (1 / p.jointCount);
                    }
                    tierCounts[p.entry_id][p.rank] = (tierCounts[p.entry_id][p.rank] || 0) + (1 / p.jointCount);
                    prizeEarnings[p.entry_id] += p.prize;
                  });
                }
              }
            }
          }

          const sortedTeams = [...(this.data.teams || [])].sort((a, b) => {
            const aEligible = this.isPrizeEligible(a.entry_id) ? 1 : 0;
            const bEligible = this.isPrizeEligible(b.entry_id) ? 1 : 0;
            if (aEligible !== bEligible) return bEligible - aEligible;
            if (hasWeeklyPenalties) {
              const netA = (prizeEarnings[a.entry_id] || 0) - (finesPaid[a.entry_id] || 0);
              const netB = (prizeEarnings[b.entry_id] || 0) - (finesPaid[b.entry_id] || 0);
              if (netB !== netA) return netB - netA;
              if ((winsCount[b.entry_id] || 0) !== (winsCount[a.entry_id] || 0)) {
                return (winsCount[b.entry_id] || 0) - (winsCount[a.entry_id] || 0);
              }
              return (finesPaid[a.entry_id] || 0) - (finesPaid[b.entry_id] || 0);
            }
            if ((prizeEarnings[b.entry_id] || 0) !== (prizeEarnings[a.entry_id] || 0)) {
              return (prizeEarnings[b.entry_id] || 0) - (prizeEarnings[a.entry_id] || 0);
            }
            if (hasMultiTier) {
              if ((tierCounts[b.entry_id]?.[1] || 0) !== (tierCounts[a.entry_id]?.[1] || 0)) {
                return (tierCounts[b.entry_id]?.[1] || 0) - (tierCounts[a.entry_id]?.[1] || 0);
              }
              if ((tierCounts[b.entry_id]?.[2] || 0) !== (tierCounts[a.entry_id]?.[2] || 0)) {
                return (tierCounts[b.entry_id]?.[2] || 0) - (tierCounts[a.entry_id]?.[2] || 0);
              }
              return (tierCounts[b.entry_id]?.[3] || 0) - (tierCounts[a.entry_id]?.[3] || 0);
            }
            return (winsCount[b.entry_id] || 0) - (winsCount[a.entry_id] || 0);
          });

          let tableRows = '';
          let hasRenderedNonPrizeHeader = false;
          let totalDistributedWins = 0;
          let totalDistributedPrize = 0;
          let totalFinesPaid = 0;
          let totalDangerCount = 0;

          sortedTeams.forEach((t, idx) => {
            const isEligible = this.isPrizeEligible(t.entry_id);
            const wins = winsCount[t.entry_id] || 0;
            const actualPrize = prizeEarnings[t.entry_id] || 0;
            const fines = finesPaid[t.entry_id] || 0;
            const danger = dangerCount[t.entry_id] || 0;
            const netBalance = actualPrize - fines;

            if (isEligible) {
              totalDistributedWins += wins;
              totalDistributedPrize += actualPrize;
              totalFinesPaid += fines;
              totalDangerCount += danger;
            }

            if (!isEligible && !hasRenderedNonPrizeHeader) {
              hasRenderedNonPrizeHeader = true;
              tableRows += `
                <tr class="bg-slate-100/75 dark:bg-slate-800/60 border-y border-slate-200/80 dark:border-slate-700/80">
                  <td colspan="${hasWeeklyPenalties ? 7 : (hasMultiTier ? 6 : 4)}" class="py-2 px-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-display">
                    ทีมร่วมสนุก (ไม่นำมาคิดคำนวณเงินรางวัลและค่าปรับ)
                  </td>
                </tr>
              `;
            }

            const winsDisplay = isEligible ? ((wins % 1 === 0) ? wins : wins.toFixed(1)) : '-';
            const prizeDisplay = isEligible ? `${actualPrize.toLocaleString()} THB` : '<span class="text-slate-400 font-normal">ร่วมสนุก (ไม่มีรางวัล)</span>';

            let countCellsHtml = '';
            if (hasWeeklyPenalties) {
              const winsHtml = isEligible 
                ? (wins > 0 ? `<span class="inline-flex items-center justify-center font-black font-display text-xs bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg min-w-[24px] shadow-2xs">${wins}</span>` : '<span class="text-slate-300 dark:text-slate-600 font-normal text-xs">-</span>')
                : '-';
              const dangerHtml = isEligible
                ? (danger > 0 ? `<span class="inline-flex items-center justify-center font-bold font-display text-xs bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-300/40 px-2 py-0.5 rounded-lg min-w-[24px]">${danger}</span>` : '<span class="text-emerald-500 font-bold text-xs">รอด</span>')
                : '-';
              const finesDisplay = isEligible
                ? (fines > 0 ? `<span class="font-bold text-rose-600 dark:text-rose-400 font-display">-${fines.toLocaleString()} THB</span>` : '<span class="text-slate-400 font-display">0 THB</span>')
                : '-';
              const prizeDisplayCell = isEligible
                ? (actualPrize > 0 ? `<span class="font-bold text-emerald-600 dark:text-emerald-400 font-display">+${actualPrize.toLocaleString()} THB</span>` : '<span class="text-slate-400 font-display">0 THB</span>')
                : '-';
              const netDisplayCell = isEligible
                ? (netBalance > 0 
                    ? `<span class="font-black text-emerald-600 dark:text-emerald-400 font-display">+${netBalance.toLocaleString()} THB</span>` 
                    : (netBalance < 0 
                        ? `<span class="font-black text-rose-600 dark:text-rose-400 font-display">${netBalance.toLocaleString()} THB</span>` 
                        : `<span class="font-bold text-slate-500 font-display">0 THB</span>`))
                : '<span class="text-slate-400 font-normal">ร่วมสนุก</span>';

              countCellsHtml = `
                <td class="py-2.5 px-1 sm:px-2 text-center font-display">${winsHtml}</td>
                <td class="py-2.5 px-1 sm:px-2 text-center font-display">${dangerHtml}</td>
                <td class="py-2.5 px-2 sm:px-3 text-right font-display text-xs sm:text-sm">${finesDisplay}</td>
                <td class="py-2.5 px-2 sm:px-3 text-right font-display text-xs sm:text-sm">${prizeDisplayCell}</td>
                <td class="py-2.5 px-2 sm:px-3 text-right font-display font-black text-xs sm:text-sm">${netDisplayCell}</td>
              `;
            } else if (hasMultiTier) {
              const r1 = tierCounts[t.entry_id]?.[1] || 0;
              const r2 = tierCounts[t.entry_id]?.[2] || 0;
              const r3 = tierCounts[t.entry_id]?.[3] || 0;

              const formatTierBadge = (cnt, badgeStyle) => {
                if (!isEligible) return '<span class="text-slate-400 font-normal">-</span>';
                if (cnt === 0) return '<span class="text-slate-300 dark:text-slate-600 font-normal text-xs">-</span>';
                const disp = (cnt % 1 === 0) ? cnt : cnt.toFixed(1);
                return `<span class="inline-flex items-center justify-center font-black font-display text-xs ${badgeStyle} px-2 py-0.5 rounded-lg min-w-[24px] shadow-2xs">${disp}</span>`;
              };

              const r1Html = formatTierBadge(r1, 'bg-amber-400 text-slate-950 border border-amber-300 dark:border-amber-300/80');
              const r2Html = formatTierBadge(r2, 'bg-slate-200 text-slate-950 dark:bg-slate-200 dark:text-slate-950 border border-slate-300 dark:border-slate-100');
              const r3Html = formatTierBadge(r3, 'bg-amber-700 text-white dark:bg-amber-600 dark:text-amber-50 border border-amber-800 dark:border-amber-400');

              countCellsHtml = `
                <td class="py-2.5 px-1 sm:px-2 text-center font-display">${r1Html}</td>
                <td class="py-2.5 px-1 sm:px-2 text-center font-display">${r2Html}</td>
                <td class="py-2.5 px-1 sm:px-2 text-center font-display">${r3Html}</td>
                <td class="py-2.5 px-2 sm:px-3 text-right font-display font-black text-emerald-600">${prizeDisplay}</td>
              `;
            } else {
              countCellsHtml = `
                <td class="py-2.5 px-2 sm:px-3 text-center font-display font-bold text-slate-800 dark:text-slate-200">${winsDisplay}</td>
                <td class="py-2.5 px-2 sm:px-3 text-right font-display font-black text-emerald-600">${prizeDisplay}</td>
              `;
            }

            tableRows += `
              <tr class="hover:bg-slate-50 transition-colors ${idx < 3 && (wins > 0 || actualPrize > 0) && isEligible ? 'bg-amber-50/20' : ''}">
                <td class="py-2.5 px-1 sm:px-2 text-center font-display font-bold text-slate-500">${isEligible ? (idx + 1) : this.getNonPrizeRankBadge()}</td>
                <td class="py-2.5 px-2 sm:px-3 min-w-0">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <button onclick="app.openTeamModal(${t.entry_id})" class="text-left font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-700 transition-colors cursor-pointer block truncate max-w-[130px] xs:max-w-[180px] sm:max-w-none">${this.escapeHtml(t.entry_name)}</button>
                    ${this.getPrizeBadge(t.entry_id)}
                  </div>
                  <div class="text-[11px] text-slate-500">${this.escapeHtml(t.player_name)}</div>
                </td>
                ${countCellsHtml}
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
              let finishedGWCountInPhase = 0;

              for (let g = startGW; g <= endGW; g++) {
                const gData = this.data.gameweeks ? this.data.gameweeks[String(g)] : null;
                if (gData && gData.results && gData.is_finished) {
                  finishedGWCountInPhase++;
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

              const isPhaseFinished = (finishedGWCountInPhase >= (endGW - startGW + 1));
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

          let multiTierHistoryHtml = '';
          if (hasMultiTier && multiTierGWEntries.length > 0) {
            multiTierHistoryHtml = multiTierGWEntries.map(entry => {
              return `
                <div class="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200/80 dark:border-slate-700/80">
                      <span class="text-xs font-black text-slate-900 dark:text-white font-display">Gameweek ${entry.gw}</span>
                      <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">จบการแข่งขัน</span>
                    </div>
                    <div class="space-y-1.5 text-xs">
                      ${entry.payouts.map(p => {
                        const medal = p.rank === 1 ? '🥇 ที่ 1' : (p.rank === 2 ? '🥈 ที่ 2' : '🥉 ที่ 3');
                        const cardBg = p.rank === 1 
                          ? 'bg-amber-100/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700/60' 
                          : (p.rank === 2 
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 border-slate-200 dark:border-slate-700' 
                            : 'bg-amber-50/60 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40');
                        return `
                          <div class="p-2 rounded-xl border ${cardBg} flex items-center justify-between shadow-2xs">
                            <div class="truncate pr-2">
                              <span class="font-bold text-[10px] block">${medal}${p.isJoint ? ` (เสมอ ${p.jointCount})` : ''}</span>
                              <span class="font-bold truncate block text-xs">${this.escapeHtml(p.team_name)}</span>
                              <span class="text-[10px] text-slate-500 dark:text-slate-400 block truncate">${this.escapeHtml(p.player_name)} (${p.net_points} pts)${p.tieBreakNote ? ` • <span class="text-amber-600 dark:text-amber-400">⚡ Tie-break</span>` : ''}</span>
                            </div>
                            <span class="font-black font-display text-emerald-700 dark:text-emerald-400 text-xs flex-shrink-0">${p.prize.toLocaleString()} THB</span>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                </div>
              `;
            }).join('');
          }

          let penaltyHistoryHtml = '';
          if (hasWeeklyPenalties && penaltyHistoryEntries.length > 0) {
            penaltyHistoryHtml = penaltyHistoryEntries.map(entry => {
              return `
                <div class="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80 dark:border-slate-700/80">
                      <span class="font-bold text-xs sm:text-sm font-display text-slate-900 dark:text-white">Gameweek ${entry.gw}</span>
                      <span class="text-[11px] font-black text-emerald-600 dark:text-emerald-400 font-display bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">+${(entry.netPot || weeklyNetPot).toLocaleString()} THB กองกลาง</span>
                    </div>
                    
                    <div class="mb-2 p-2 rounded-xl bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between">
                      <div class="truncate pr-2">
                        <span class="font-bold text-[10px] text-amber-950 dark:text-amber-200 block">🏆 แชมป์สัปดาห์</span>
                        <span class="font-bold truncate block text-xs text-slate-900 dark:text-white">${this.escapeHtml(entry.winner.team_name)}</span>
                        <span class="text-[10px] text-slate-500 dark:text-slate-400 block truncate">${this.escapeHtml(entry.winner.player_name)} (${entry.winner.net_points} pts)</span>
                      </div>
                      <span class="font-black font-display text-emerald-700 dark:text-emerald-400 text-xs flex-shrink-0">+${weeklyChampPrize.toLocaleString()} THB</span>
                    </div>

                    <div class="space-y-1">
                      <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ผู้เสียค่าปรับ 5 อันดับท้าย:</div>
                      ${entry.bottomList.map(b => {
                        const isLast = b.bottomTierIndex === 0;
                        return `
                          <div class="px-2 py-1.5 rounded-lg border ${isLast ? 'bg-rose-100/70 dark:bg-rose-950/40 border-rose-300 text-rose-950 dark:text-rose-200' : 'bg-slate-100/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-300'} flex items-center justify-between text-xs">
                            <div class="truncate pr-2">
                              <span class="font-bold text-[10px]">${b.rankLabel}:</span>
                              <span class="font-medium text-xs text-slate-900 dark:text-white">${this.escapeHtml(b.team_name)}</span>
                              <span class="text-[10px] text-slate-500 dark:text-slate-400">(${b.net_points} pts)</span>
                            </div>
                            <span class="font-black font-display text-rose-600 dark:text-rose-400 text-xs flex-shrink-0">-${b.fine.toLocaleString()} THB</span>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                </div>
              `;
            }).join('');
          }

          let total1st = 0, total2nd = 0, total3rd = 0;
          if (hasMultiTier) {
            sortedTeams.forEach(t => {
              if (this.isPrizeEligible(t.entry_id)) {
                total1st += tierCounts[t.entry_id]?.[1] || 0;
                total2nd += tierCounts[t.entry_id]?.[2] || 0;
                total3rd += tierCounts[t.entry_id]?.[3] || 0;
              }
            });
          }

          if (mainContainer) {
            mainContainer.innerHTML = `
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200">
                <h3 class="text-sm sm:text-base font-bold text-slate-900 mb-3 font-display">${hasWeeklyPenalties ? 'ตารางเงินรางวัลสะสม & ยอดค่าปรับเข้ากองกลาง' : 'ตารางเงินรางวัลสะสมของสมาชิก'}</h3>
                <div class="overflow-x-auto no-scrollbar -mx-4 sm:mx-0 touch-scroll">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="border-b border-slate-100 text-[11px] font-bold text-slate-400 font-display bg-slate-50/50">
                        <th class="py-2 px-1 sm:px-2 text-center w-8">#</th>
                        <th class="py-2 px-2 sm:px-3">ทีม & ผู้จัดการ</th>
                        ${hasWeeklyPenalties ? `
                        <th class="py-2 px-1 sm:px-2 text-center w-14">แชมป์</th>
                        <th class="py-2 px-1 sm:px-2 text-center w-14">โดนปรับ</th>
                        <th class="py-2 px-2 sm:px-3 text-right">ค่าปรับสะสม</th>
                        <th class="py-2 px-2 sm:px-3 text-right">รางวัลสะสม</th>
                        <th class="py-2 px-2 sm:px-3 text-right font-black">ยอดสุทธิ Net</th>
                        ` : (hasMultiTier ? `
                        <th class="py-2 px-1 sm:px-2 text-center w-12 sm:w-16">
                          <span class="hidden sm:inline">🥇 ที่ 1</span>
                          <span class="sm:hidden">🥇 1</span>
                        </th>
                        <th class="py-2 px-1 sm:px-2 text-center w-12 sm:w-16">
                          <span class="hidden sm:inline">🥈 ที่ 2</span>
                          <span class="sm:hidden">🥈 2</span>
                        </th>
                        <th class="py-2 px-1 sm:px-2 text-center w-12 sm:w-16">
                          <span class="hidden sm:inline">🥉 ที่ 3</span>
                          <span class="sm:hidden">🥉 3</span>
                        </th>
                        <th class="py-2 px-2 sm:px-3 text-right">เงินรางวัลสะสม</th>
                        ` : `
                        <th class="py-2 px-2 sm:px-3 text-center">แชมป์วีค</th>
                        <th class="py-2 px-2 sm:px-3 text-right">เงินรางวัลสะสม</th>
                        `)}
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-xs sm:text-sm">
                      ${tableRows}
                    </tbody>
                    <tfoot class="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 font-display text-xs sm:text-sm font-bold">
                      <tr>
                        <td colspan="2" class="py-3 px-2 sm:px-3 text-slate-700 dark:text-slate-300">
                          <div class="flex items-center gap-1.5 flex-wrap">
                            <span>${hasWeeklyPenalties ? 'ยอดเงินกองกลางสะสมสุทธิ' : 'ยอดรวมเงินรางวัลสะสมที่มอบไปแล้ว'}</span>
                            <span class="text-[11px] font-normal text-slate-500 font-display">(จบแล้ว ${finishedGWCount} วีค)</span>
                          </div>
                        </td>
                        ${hasWeeklyPenalties ? `
                        <td class="py-3 px-1 sm:px-2 text-center text-amber-600 dark:text-amber-400 font-black font-display">${totalDistributedWins}</td>
                        <td class="py-3 px-1 sm:px-2 text-center text-rose-600 dark:text-rose-400 font-black font-display">${totalDangerCount}</td>
                        <td class="py-3 px-2 sm:px-3 text-right font-black text-rose-600 dark:text-rose-400 font-display">-${totalFinesPaid.toLocaleString()} THB</td>
                        <td class="py-3 px-2 sm:px-3 text-right font-black text-emerald-600 dark:text-emerald-400 font-display">+${totalDistributedPrize.toLocaleString()} THB</td>
                        <td class="py-3 px-2 sm:px-3 text-right font-black text-emerald-600 dark:text-emerald-400 font-display text-sm sm:text-base">+${(finishedGWCount * weeklyNetPot).toLocaleString()} THB</td>
                        ` : (hasMultiTier ? `
                        <td class="py-3 px-1 sm:px-2 text-center text-amber-600 dark:text-amber-400 font-black font-display">${total1st % 1 === 0 ? total1st : total1st.toFixed(1)}</td>
                        <td class="py-3 px-1 sm:px-2 text-center text-slate-700 dark:text-slate-300 font-black font-display">${total2nd % 1 === 0 ? total2nd : total2nd.toFixed(1)}</td>
                        <td class="py-3 px-1 sm:px-2 text-center text-amber-800 dark:text-amber-300 font-black font-display">${total3rd % 1 === 0 ? total3rd : total3rd.toFixed(1)}</td>
                        <td class="py-3 px-2 sm:px-3 text-right font-black text-emerald-600 dark:text-emerald-400">${totalDistributedPrize.toLocaleString()} THB</td>
                        ` : `
                        <td class="py-3 px-2 sm:px-3 text-center text-slate-800 dark:text-slate-200 font-bold">${totalDistributedWins % 1 === 0 ? totalDistributedWins : totalDistributedWins.toFixed(1)}</td>
                        <td class="py-3 px-2 sm:px-3 text-right font-black text-emerald-600 dark:text-emerald-400">${totalDistributedPrize.toLocaleString()} THB</td>
                        `)}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              ${hasWeeklyPenalties ? `
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200">
                <h3 class="text-sm sm:text-base font-bold text-slate-900 mb-3 font-display">โครงสร้างเงินกองกลางสะสม & ค่าปรับประจำสัปดาห์ (${this.config.total_pool || `${seasonNetTotal.toLocaleString()} THB`})</h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">ยอดเงินกองกลางสะสมสุทธิปัจจุบัน</span>
                    <div class="text-xl font-black text-emerald-600 mt-1 font-display">${(finishedGWCount * weeklyNetPot).toLocaleString()} <span class="text-xs">THB</span></div>
                    <div class="text-xs text-slate-600 mt-0.5 font-medium">จบแล้ว ${finishedGWCount} วีค x ${weeklyNetPot.toLocaleString()} THB (เป้าหมาย 38 วีค = ${seasonNetTotal.toLocaleString()} THB)</div>
                  </div>
                  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">รางวัลแชมป์ประจำสัปดาห์ (38 สัปดาห์)</span>
                    <div class="text-xl font-black text-slate-900 mt-1 font-display">${(weeklyChampPrize * 38).toLocaleString()} <span class="text-xs">THB</span></div>
                    <div class="text-xs text-slate-600 mt-0.5 font-medium">สัปดาห์ละ ${weeklyChampPrize.toLocaleString()} THB (หักจากค่าปรับ ${totalWeeklyFines.toLocaleString()} THB ในแต่ละวีค)</div>
                  </div>
                  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">ค่าปรับ 5 อันดับท้ายจากบ๊วย</span>
                    <div class="text-xl font-black text-rose-600 mt-1 font-display">${totalWeeklyFines.toLocaleString()} <span class="text-xs">THB / วีค</span></div>
                    <div class="text-xs text-slate-600 mt-0.5 font-medium">บ๊วย 600 / รองบ๊วย 500 / อันดับ 3 400 / อันดับ 4 300 / อันดับ 5 200 THB</div>
                  </div>
                </div>
              </div>` : (phasesHtml ? `
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
                <h3 class="text-sm sm:text-base font-bold text-slate-900 mb-3 font-display">โครงสร้างเงินรางวัลประจำฤดูกาล & การบริหารกองกลาง (${this.config.total_pool || 'กองกลาง'})</h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${weeklyPrizesConfig ? 'รางวัลประจำสัปดาห์ 3 อันดับ (38 สัปดาห์)' : 'แชมป์ประจำสัปดาห์ (38 สัปดาห์)'}</span>
                    <div class="text-xl font-black text-slate-900 mt-1 font-display">${weeklyTotal.toLocaleString()} <span class="text-xs">THB</span></div>
                    <div class="text-xs text-slate-600 mt-0.5 font-medium">${weeklyPrizesConfig ? `ที่ 1: ${weeklyPrizesConfig['1st'].toLocaleString()} / ที่ 2: ${weeklyPrizesConfig['2nd'].toLocaleString()} / ที่ 3: ${weeklyPrizesConfig['3rd'].toLocaleString()} (สัปดาห์ละ ${weeklyAmount.toLocaleString()} THB)` : `สัปดาห์ละ ${weeklyAmount.toLocaleString()} THB x 38 สัปดาห์`}</div>
                  </div>
                  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${this.config.season_prizes && Object.keys(this.config.season_prizes).length ? `แชมป์ฤดูกาล (รวม ${Object.keys(this.config.season_prizes).length} อันดับ)` : 'แชมป์ฤดูกาล'}</span>
                    <div class="text-xl font-black text-slate-900 mt-1 font-display">${this.config.season_total_prize || (this.activeLeagueId === '1101958' ? '12,000' : '9,000')} <span class="text-xs">THB</span></div>
                    <div class="text-xs text-slate-600 mt-0.5 font-medium">${this.config.season_prize_desc || (this.activeLeagueId === '1101958' ? 'ที่ 1: 6,000 / ที่ 2: 3,600 / ที่ 3: 2,400 THB' : 'แชมป์ 4,500 / รอง 2,500 / ที่ 3 1,000 / ที่ 4-5 500')}</div>
                  </div>
                  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${this.config.coordinator ? 'ผู้ประสานงาน & ดูแลกองกลาง' : 'ค่าสมัคร & กองกลางรวม'}</span>
                    <div class="${this.config.coordinator ? 'text-base font-bold' : 'text-xl font-black text-emerald-600'} text-slate-900 mt-1">${this.config.coordinator || (this.config.total_pool || '103,200 THB')}</div>
                    <div class="text-xs text-slate-600 mt-0.5 font-medium">${this.config.payment_method || (this.config.entry_fee || '8,600 THB/ทีม')}</div>
                  </div>
                </div>
              </div>`)}
            `;
          }

        } else if (this.config && this.config.features && this.config.features.prize_model === 'monthly') {
          const feat = (this.config && this.config.features) || {};
          const champPrize = feat.monthly_champion_prize || 600;
          const runnerPrize = feat.monthly_runner_up_prize || 400;
          const totalMonthly = feat.total_monthly_budget || '10,000 THB';

          if (tagEl) tagEl.innerText = 'MONTHLY AWARDS (10 MONTHS) & SEASON POOL';
          if (titleEl) titleEl.innerText = 'สรุปรางวัลประจำเดือน & กองกลางการกุศล';
          if (subEl) subEl.innerText = `รางวัลประจำเดือน: แชมป์ ${champPrize} THB • รองแชมป์ ${runnerPrize} THB (10 เดือน = ${totalMonthly}) • กองกลางรวม ${this.config.total_pool || '36,000 THB'}`;

          const curMonth = (this.config.monthly_schedule || []).find(m => m.id === this.selectedMonthId) || (this.config.monthly_schedule && this.config.monthly_schedule.length > 0 ? this.config.monthly_schedule[0] : null);
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
            return (b.month_total - a.month_total) || (a.team_name || '').localeCompare(b.team_name || '') || (a.entry_id - b.entry_id);
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
          const eligibleMonthSorted = curMonthIsStarted ? monthlySorted.filter(x => this.isPrizeEligible(x.entry_id)) : [];
          const hasPositiveScores = eligibleMonthSorted.length > 0 && eligibleMonthSorted[0].month_total > 0;
          const topChampsInMonth = hasPositiveScores ? eligibleMonthSorted.filter(x => x.eligible_monthly_rank === 1) : [];
          const topRunnersInMonth = hasPositiveScores ? eligibleMonthSorted.filter(x => x.eligible_monthly_rank === 2) : [];
          const leaderCount = topChampsInMonth.length;
          const runnerCount = topRunnersInMonth.length;
          const rawSplitChampAmt = leaderCount > 0 ? ((champPrize + (leaderCount > 1 ? runnerPrize : 0)) / leaderCount) : champPrize;
          const splitChampDisplay = (leaderCount > 1 && (champPrize + runnerPrize) % leaderCount !== 0)
            ? `${rawSplitChampAmt.toFixed(2)} THB`
            : `${rawSplitChampAmt.toLocaleString()} THB`;
          const rawSplitRunnerAmt = runnerCount > 0 ? (runnerPrize / runnerCount) : runnerPrize;
          const splitRunnerDisplay = (runnerCount > 1 && runnerPrize % runnerCount !== 0)
            ? `${rawSplitRunnerAmt.toFixed(2)} THB`
            : `${rawSplitRunnerAmt.toLocaleString()} THB`;

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
            const isLeader = isEligible && curMonthIsStarted && hasPositiveScores && (t.eligible_monthly_rank === 1);
            const isRunnerUp = isEligible && curMonthIsStarted && hasPositiveScores && (t.eligible_monthly_rank === 2);
            let rankBadge = '';
            let prizePill = '';

            if (!isEligible) {
              rankBadge = this.getNonPrizeRankBadge();
            } else if (isLeader) {
              rankBadge = this.getRankBadge(1);
              if (curMonthIsFinished) {
                if (leaderCount > 1) {
                  prizePill = `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-600/50 font-display flex-shrink-0">แชมป์ร่วม (หาร ${leaderCount}) ${splitChampDisplay}</span>`;
                } else {
                  prizePill = `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-600/50 font-display flex-shrink-0">แชมป์เดือน ${champPrize.toLocaleString()} THB</span>`;
                }
              } else {
                if (leaderCount > 1) {
                  prizePill = `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600/50 font-display flex-shrink-0 animate-pulse">ผู้นำร่วมสด (หาร ${leaderCount}) ${splitChampDisplay}</span>`;
                } else {
                  prizePill = `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600/50 font-display flex-shrink-0 animate-pulse">ผู้นำสด ${champPrize.toLocaleString()} THB</span>`;
                }
              }
            } else if (isRunnerUp) {
              rankBadge = this.getRankBadge(2);
              if (curMonthIsFinished) {
                if (runnerCount > 1) {
                  prizePill = `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-600/50 font-display flex-shrink-0">รองแชมป์ร่วม (หาร ${runnerCount}) ${splitRunnerDisplay}</span>`;
                } else {
                  prizePill = `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-600/50 font-display flex-shrink-0">รองแชมป์ ${runnerPrize.toLocaleString()} THB</span>`;
                }
              } else {
                if (runnerCount > 1) {
                  prizePill = `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-600/50 font-display flex-shrink-0">รองผู้นำร่วมสด (หาร ${runnerCount}) ${splitRunnerDisplay}</span>`;
                } else {
                  prizePill = `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-600/50 font-display flex-shrink-0">รองผู้นำสด ${runnerPrize.toLocaleString()} THB</span>`;
                }
              }
            } else {
              rankBadge = this.getRankBadge(t.eligible_monthly_rank || t.rank || '-');
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
                <td class="py-2.5 px-2 min-w-0">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <button onclick="app.openTeamModal(${t.entry_id})" class="text-left font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-700 transition-colors cursor-pointer block truncate max-w-[130px] xs:max-w-[180px] sm:max-w-none">${this.escapeHtml(t.team_name)}</button>
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

            const sortedMonthTeams = Object.values(monthTeamMap).sort((a, b) => {
              return (b.total - a.total) || (a.team_name || '').localeCompare(b.team_name || '') || (a.entry_id - b.entry_id);
            });
            const eligibleMonthTeams = sortedMonthTeams.filter(t => this.isPrizeEligible(t.entry_id));

            let winnersSummaryHtml = '';
            if (isMonthFinished && eligibleMonthTeams.length > 0 && eligibleMonthTeams[0].total > 0) {
              const topPts = eligibleMonthTeams[0].total;
              const topChamps = eligibleMonthTeams.filter(t => t.total === topPts);

              let champRows = '';
              let runnerRows = '';
              let totalPaidThisMonth = 0;

              if (topChamps.length > 1) {
                const rawSplitAmt = (champPrize + runnerPrize) / topChamps.length;
                const splitDisplay = ((champPrize + runnerPrize) % topChamps.length !== 0)
                  ? `${rawSplitAmt.toFixed(2)} THB`
                  : `${rawSplitAmt.toLocaleString()} THB`;
                totalPaidThisMonth = champPrize + runnerPrize;
                champRows = topChamps.map(c => `
                  <div class="flex items-center justify-between text-xs py-0.5">
                    <div class="truncate pr-2">
                      <span class="font-bold text-amber-700 dark:text-amber-400">🥇 แชมป์ร่วม (หาร ${topChamps.length}): ${this.escapeHtml(c.team_name)}</span>
                      <span class="text-[10px] text-slate-500">(${c.total} pts)</span>
                    </div>
                    <span class="font-bold font-display text-emerald-700 flex-shrink-0">${splitDisplay}</span>
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
                  const rawSplitRunnerAmt = (runnerPrize / topRunners.length);
                  const splitRunnerDisplay = (topRunners.length > 1 && runnerPrize % topRunners.length !== 0)
                    ? `${rawSplitRunnerAmt.toFixed(2)} THB`
                    : `${rawSplitRunnerAmt.toLocaleString()} THB`;
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
              const topPts = eligibleMonthTeams[0].total;
              const liveLeaders = eligibleMonthTeams.filter(t => t.total === topPts);
              const isJoint = liveLeaders.length > 1;
              const leadersHtml = liveLeaders.map(l => `
                <div class="flex items-center justify-between text-xs py-0.5">
                  <span class="font-bold text-slate-900 truncate pr-2">${this.escapeHtml(l.team_name)}</span>
                  <span class="font-bold text-emerald-700 font-display flex-shrink-0">${l.total} pts</span>
                </div>
              `).join('');

              winnersSummaryHtml = `
                <div class="mt-2.5 pt-2.5 border-t border-slate-200/80 space-y-1">
                  <div class="text-[10px] font-bold text-emerald-700 uppercase font-display flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    ${isJoint ? `ผู้นำร่วมคะแนนสดชิงรางวัล (${liveLeaders.length} ทีม):` : 'ผู้นำคะแนนสดชิงรางวัล:'}
                  </div>
                  ${leadersHtml}
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
        } else if (this.config && this.config.features && (this.config.features.prize_model === 'annual_zero_sum' || this.config.features.prize_model === 'annual')) {
          const feat = (this.config && this.config.features) || {};
          const isShi62 = String(this.activeLeagueId) === '187827' || Boolean(feat.has_shi62_special);
          const tiers = feat.annual_payout_tiers || {
            "1": 1000, "2": 800, "3": 600, "4": 400, "5": 200, "6": 100,
            "7": -100, "8": -200, "9": -400, "10": -600, "11": -800, "12": -1000
          };

          const totalPositive = Object.values(tiers).filter(v => Number(v) > 0).reduce((a, b) => a + Number(b), 0);
          const totalNegative = Math.abs(Object.values(tiers).filter(v => Number(v) < 0).reduce((a, b) => a + Number(b), 0));

          if (tagEl) tagEl.innerText = isShi62 ? "SHI'62 ANNUAL ZERO-SUM & EXTRA" : 'ANNUAL ZERO-SUM SETTLEMENT (จ่ายตังทีเดียวสิ้นฤดูกาล)';
          if (titleEl) titleEl.innerText = 'ตารางสรุปยอดจ่าย-รับเงินรางวัลสิ้นฤดูกาล';
          if (subEl) subEl.innerText = isShi62
            ? `สรุปยอดรางวัลจบฤดูกาล (อันดับ 1-6 รับ +3,100 บ. / อันดับ 7-12 จ่าย -3,100 บ.) และยอดสะสมมินิเกม Extra • ตัดสิน GW 1 - 38`
            : `ตัดสินจากคะแนนรวมสะสมสุทธิ GW 1 - 38 • อันดับ 1-6 รับเงินรางวัลรวม ${totalPositive.toLocaleString()} THB • อันดับ 7-12 ร่วมจ่ายเงินค่าปรับรวม ${totalNegative.toLocaleString()} THB (Zero-Sum Balance)`;

          // Extra map and short names for League 187827
          const extraMapByEntryId = {};
          const extraMapByName = {};
          if (this.shi62Data && this.shi62Data.cumulative_standings) {
            this.shi62Data.cumulative_standings.forEach(c => {
              if (c.player) {
                if (c.player.entry_id) extraMapByEntryId[c.player.entry_id] = Number(c.net) || 0;
                if (c.player.display_name) extraMapByName[c.player.display_name.toLowerCase()] = Number(c.net) || 0;
              }
            });
          }

          const shi62ShortNames = {
            1309919: "Tong",
            837763: "Oo",
            2342390: "Riin",
            720631: "Totti",
            1153245: "Poang",
            7601484: "Oan",
            3508212: "Sia",
            1312974: "Mai",
            2804957: "Boy",
            5463640: "Dow",
            4549514: "Bert",
            5340913: "Pong+"
          };

          // Calculate current overall standings
          const overallMap = {};
          const maxGW = Number(this.multiData.max_gw) || 2;
          (this.data.teams || []).forEach(t => {
            overallMap[t.entry_id] = {
              entry_id: t.entry_id,
              team_name: t.entry_name,
              player_name: t.player_name,
              fpl_rank: t.rank || 999,
              total_points: 0
            };
          });

          for (let g = 1; g <= maxGW; g++) {
            const gData = this.data.gameweeks ? this.data.gameweeks[String(g)] : null;
            if (gData && gData.results) {
              const gIsStarted = gData.is_started !== undefined 
                ? Boolean(gData.is_started) 
                : (Boolean(gData.is_finished) || gData.results.some(r => r.points > 0));
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
                      total_points: 0
                    };
                  }
                  overallMap[r.entry_id].total_points += r.net_points;
                });
              }
            }
          }

          const overallSorted = Object.values(overallMap).sort((a, b) => {
            const aEligible = this.isPrizeEligible(a.entry_id) ? 1 : 0;
            const bEligible = this.isPrizeEligible(b.entry_id) ? 1 : 0;
            if (aEligible !== bEligible) return bEligible - aEligible;
            return (b.total_points - a.total_points) || ((a.fpl_rank || 999) - (b.fpl_rank || 999));
          });

          // Group eligible teams and resolve tie-pooled payouts to preserve perfect zero-sum balance
          const eligibleTeams = overallSorted.filter(t => this.isPrizeEligible(t.entry_id));
          const eligibleCount = eligibleTeams.length;
          let currentIdx = 0;
          while (currentIdx < eligibleTeams.length) {
            let nextIdx = currentIdx + 1;
            while (nextIdx < eligibleTeams.length && eligibleTeams[nextIdx].total_points === eligibleTeams[currentIdx].total_points) {
              nextIdx++;
            }
            const count = nextIdx - currentIdx;
            const rankStart = currentIdx + 1;
            const rankEnd = currentIdx + count;

            let tierSum = 0;
            for (let rPos = rankStart; rPos <= rankEnd; rPos++) {
              tierSum += Number(tiers[String(rPos)] || 0);
            }
            const avgPayout = count > 0 ? (tierSum / count) : 0;

            for (let i = currentIdx; i < nextIdx; i++) {
              const tm = eligibleTeams[i];
              tm.overall_rank = rankStart;
              tm.is_joint = count > 1;
              tm.joint_count = count;
              tm.pos_start = rankStart;
              tm.pos_end = rankEnd;
              tm.payout = avgPayout;
            }
            currentIdx = nextIdx;
          }

          overallSorted.forEach(team => {
            if (!this.isPrizeEligible(team.entry_id)) {
              team.overall_rank = null;
              team.is_joint = false;
              team.payout = 0;
            }
          });

          let tableRowsHtml = '';
          let sumTotalPoints = 0;
          let sumSeasonPrize = 0;
          let sumExtraNet = 0;
          let sumGrandTotal = 0;

          overallSorted.forEach((team) => {
            const isPrize = this.isPrizeEligible(team.entry_id);
            const prizeBadge = this.getPrizeBadge(team.entry_id);
            const r = team.overall_rank;
            const payout = isPrize ? team.payout : 0;
            const extraNet = (extraMapByEntryId[team.entry_id] !== undefined)
              ? extraMapByEntryId[team.entry_id]
              : (extraMapByName[(team.player_name || '').toLowerCase()] || 0);
            const grandTotal = isPrize ? (payout + extraNet) : 0;

            if (isPrize) {
              sumSeasonPrize += payout;
              sumExtraNet += extraNet;
              sumGrandTotal += grandTotal;
              sumTotalPoints += team.total_points;
            }

            let rankBadge = '';
            let rowBg = '';

            if (!isPrize) {
              rankBadge = this.getNonPrizeRankBadge();
            } else if (team.is_joint) {
              rankBadge = `<span class="text-slate-600 dark:text-slate-300 font-bold" title="แต้มเท่ากัน ${team.joint_count} ทีม (เฉลี่ยอันดับ ${team.pos_start}-${team.pos_end})">${team.overall_rank} <span class="text-[9px] text-slate-400 font-normal">ร่วม</span></span>`;
              if (team.overall_rank === 1) rowBg = 'bg-amber-50/20 dark:bg-amber-950/10 font-semibold';
              else if (team.pos_end === eligibleCount) rowBg = 'bg-rose-50/20 dark:bg-rose-950/10 font-semibold';
            } else if (isShi62) {
              rankBadge = `<span class="text-slate-600 dark:text-slate-300 font-bold">${r}</span>`;
              if (r === 1) rowBg = 'bg-amber-50/20 dark:bg-amber-950/10 font-semibold';
              else if (r === eligibleCount) rowBg = 'bg-rose-50/20 dark:bg-rose-950/10 font-semibold';
            } else if (r === 1) {
              rankBadge = this.getRankBadge(1);
              rowBg = 'bg-amber-50/30 dark:bg-amber-950/10 font-semibold';
            } else if (r === 2) {
              rankBadge = this.getRankBadge(2);
              rowBg = 'bg-slate-50/40 dark:bg-slate-800/20';
            } else if (r === 3) {
              rankBadge = this.getRankBadge(3);
            } else if (r === eligibleCount) {
              rankBadge = `<span class="text-slate-500 font-bold">${r}</span>`;
              rowBg = 'bg-rose-50/30 dark:bg-rose-950/10 font-semibold';
            } else {
              rankBadge = `<span class="text-slate-500 font-bold">${r}</span>`;
            }

            if (isShi62) {
              const shortName = shi62ShortNames[team.entry_id];
              const dispManager = shortName
                ? `<span class="font-bold text-slate-700 dark:text-slate-300">${shortName}</span> <span class="text-slate-400">(${this.escapeHtml(team.player_name)})</span>`
                : this.escapeHtml(team.player_name);

              const fmtCol = (v) => {
                if (v > 0) return `<span class="text-emerald-600 dark:text-emerald-400 font-bold font-display">+${Number(v).toLocaleString()}</span>`;
                if (v < 0) return `<span class="text-rose-600 dark:text-rose-400 font-bold font-display">${Number(v).toLocaleString()}</span>`;
                return `<span class="text-slate-400 dark:text-slate-500 font-display">0</span>`;
              };
              tableRowsHtml += `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${rowBg}">
                  <td class="py-3 px-1 sm:px-2 text-center font-display font-bold text-xs sm:text-sm">${rankBadge}</td>
                  <td class="py-3 px-2 sm:px-3 min-w-0">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <button onclick="app.openTeamModal(${team.entry_id})" class="text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 transition-colors block truncate cursor-pointer">
                        ${this.escapeHtml(team.team_name)}
                      </button>
                      ${prizeBadge}
                    </div>
                    <span class="text-[11px] block truncate text-slate-500 dark:text-slate-400">${dispManager}</span>
                  </td>
                  <td class="py-3 px-2 sm:px-3 text-center font-display font-black text-xs sm:text-sm text-slate-900 dark:text-white">${team.total_points}</td>
                  <td class="py-3 px-2 sm:px-3 text-right font-display text-xs sm:text-sm">${isPrize ? fmtCol(payout) : '<span class="text-slate-400">-</span>'}</td>
                  <td class="py-3 px-2 sm:px-3 text-right font-display text-xs sm:text-sm">${isPrize ? fmtCol(extraNet) : '<span class="text-slate-400">-</span>'}</td>
                </tr>
              `;
            } else {
              let payoutHtml = '';
              if (!isPrize) {
                payoutHtml = `<span class="text-slate-400 font-normal text-xs">-</span>`;
              } else if (payout > 0) {
                payoutHtml = `<span class="font-black font-display text-emerald-600 dark:text-emerald-400 text-sm sm:text-base">+${payout.toLocaleString()} THB</span>`;
              } else {
                payoutHtml = `<span class="font-black font-display text-rose-600 dark:text-rose-400 text-sm sm:text-base">${payout.toLocaleString()} THB</span>`;
              }

              tableRowsHtml += `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${rowBg}">
                  <td class="py-3 px-1 sm:px-2 text-center font-display font-bold text-xs sm:text-sm">${rankBadge}</td>
                  <td class="py-3 px-2 sm:px-3 min-w-0">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <button onclick="app.openTeamModal(${team.entry_id})" class="text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 transition-colors block truncate cursor-pointer">
                        ${this.escapeHtml(team.team_name)}
                      </button>
                      ${prizeBadge}
                    </div>
                    <span class="text-[11px] text-slate-500 dark:text-slate-400 block truncate">${this.escapeHtml(team.player_name)}</span>
                  </td>
                  <td class="py-3 px-2 sm:px-3 text-center font-display font-black text-xs sm:text-sm text-slate-900 dark:text-white">${team.total_points}</td>
                  <td class="py-3 px-2 sm:px-3 text-right font-display">${payoutHtml}</td>
                </tr>
              `;
            }
          });

          // Guest row for Shi'62 (Nod)
          if (isShi62) {
            const nodCum = (this.shi62Data && this.shi62Data.cumulative_standings)
              ? this.shi62Data.cumulative_standings.find(c => c.player && c.player.is_guest)
              : null;
            if (nodCum) {
              const nodNet = Number(nodCum.net) || 0;
              sumExtraNet += nodNet;
              const fmtNodNet = nodNet > 0 
                ? `<span class="text-emerald-600 dark:text-emerald-400 font-bold font-display">+${Number(nodNet).toLocaleString()}</span>`
                : (nodNet < 0 ? `<span class="text-rose-600 dark:text-rose-400 font-bold font-display">${Number(nodNet).toLocaleString()}</span>` : '<span class="text-slate-400 font-display">0</span>');

              tableRowsHtml += `
                <tr class="bg-slate-50/40 dark:bg-slate-800/20 text-slate-500 border-t border-dashed border-slate-200 dark:border-slate-800">
                  <td class="py-3 px-1 sm:px-2 text-center font-display font-bold text-xs sm:text-sm text-slate-400">•</td>
                  <td class="py-3 px-2 sm:px-3 min-w-0">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">Nod</span>
                      <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">Guest</span>
                    </div>
                    <span class="text-[11px] text-slate-400 block truncate">เล่นเฉพาะ Extra</span>
                  </td>
                  <td class="py-3 px-2 sm:px-3 text-center font-display text-xs sm:text-sm text-slate-400">-</td>
                  <td class="py-3 px-2 sm:px-3 text-right font-display text-xs sm:text-sm text-slate-400">-</td>
                  <td class="py-3 px-2 sm:px-3 text-right font-display text-xs sm:text-sm">${fmtNodNet}</td>
                </tr>
              `;
            }
          }

          let tableHeadersHtml = '';
          let tableFootHtml = '';

          if (isShi62) {
            tableHeadersHtml = `
              <tr class="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 font-display bg-slate-50/50 dark:bg-slate-800/30">
                <th class="py-2.5 px-1 sm:px-2 text-center w-8">#</th>
                <th class="py-2.5 px-2 sm:px-3 min-w-[140px]">ทีม & ผู้จัดการ</th>
                <th class="py-2.5 px-2 sm:px-3 text-center w-16">คะแนนรวม</th>
                <th class="py-2.5 px-2 sm:px-3 text-right min-w-[100px]">FPL</th>
                <th class="py-2.5 px-2 sm:px-3 text-right min-w-[100px]">ยอดรวม Extra</th>
              </tr>
            `;

            tableFootHtml = `
              <tr class="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 font-display text-xs sm:text-sm font-bold">
                <td colspan="2" class="py-3 px-2 sm:px-3 text-slate-700 dark:text-slate-300">
                  ยอดรวมสุทธิทั้งลีก (Net Zero-Sum Balance)
                </td>
                <td class="py-3 px-2 sm:px-3 text-center text-slate-900 dark:text-white font-black">${sumTotalPoints}</td>
                <td class="py-3 px-2 sm:px-3 text-right font-black text-slate-900 dark:text-white text-xs sm:text-sm">${sumSeasonPrize === 0 ? '0' : sumSeasonPrize.toLocaleString()} THB</td>
                <td class="py-3 px-2 sm:px-3 text-right font-black text-slate-900 dark:text-white text-xs sm:text-sm">${sumExtraNet === 0 ? '0' : sumExtraNet.toLocaleString()} THB</td>
              </tr>
            `;
          } else {
            tableHeadersHtml = `
              <tr class="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 font-display bg-slate-50/50 dark:bg-slate-800/30">
                <th class="py-2.5 px-1 sm:px-2 text-center w-8">#</th>
                <th class="py-2.5 px-2 sm:px-3">ทีม & ผู้จัดการ</th>
                <th class="py-2.5 px-2 sm:px-3 text-center">คะแนนรวม</th>
                <th class="py-2.5 px-2 sm:px-3 text-right">ยอดเงินสุทธิสิ้นฤดูกาล</th>
              </tr>
            `;

            tableFootHtml = `
              <tr class="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 font-display text-xs sm:text-sm font-bold">
                <td colspan="2" class="py-3 px-2 sm:px-3 text-slate-700 dark:text-slate-300">
                  ยอดรวมสุทธิทั้งลีก (Net Zero-Sum Balance)
                </td>
                <td class="py-3 px-2 sm:px-3 text-center text-slate-900 dark:text-white font-black">${sumTotalPoints}</td>
                <td class="py-3 px-2 sm:px-3 text-right font-black text-slate-900 dark:text-white text-sm sm:text-base">
                  0 THB
                </td>
              </tr>
            `;
          }

          if (mainContainer) {
            mainContainer.innerHTML = `
              <!-- Main Table Card -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800">
                <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">ตารางสรุปยอดเงินรางวัล & ค่าปรับสิ้นฤดูกาล (GW 1 - ${maxGW})</h3>
                    <span class="text-[11px] font-bold text-slate-500 font-display">อัปเดตตามอันดับคะแนนรวมปัจจุบัน (แข่งจบแล้ว ${maxGW} สัปดาห์)</span>
                  </div>
                  ${isShi62 ? `
                    <button onclick="app.copyShi62PrizesLINEResult()" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#06C755]/10 hover:bg-[#06C755]/20 dark:bg-[#06C755]/15 dark:hover:bg-[#06C755]/25 text-[#04a044] dark:text-[#06C755] border border-[#06C755]/25 dark:border-[#06C755]/30 shadow-2xs transition-all cursor-pointer active:scale-95 whitespace-nowrap" title="คัดลอกสรุปผลสำหรับส่ง LINE">
                      <svg class="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 5.82 2 10.5c0 2.93 1.76 5.51 4.44 7.04-.19.7-.68 2.53-.78 2.92-.12.47.17.46.36.33.25-.17 2.92-1.99 4.09-2.79.62.09 1.25.14 1.89.14 5.52 0 10-3.82 10-8.5S17.52 2 12 2z"/>
                      </svg>
                      <span>คัดลอก LINE</span>
                    </button>
                  ` : ''}
                </div>
                <div class="overflow-x-auto no-scrollbar -mx-4 sm:mx-0 touch-scroll">
                  <table class="w-full text-left border-collapse ${isShi62 ? 'min-w-[560px]' : ''}">
                    <thead>
                      ${tableHeadersHtml}
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                      ${tableRowsHtml}
                    </tbody>
                    <tfoot class="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 font-display text-xs sm:text-sm font-bold">
                      ${tableFootHtml}
                    </tfoot>
                  </table>
                </div>
              </div>
            `;
          }
        } else {
          if (tagEl) tagEl.innerText = 'OFFICIAL PRIZES & RULES PENDING';
          if (titleEl) titleEl.innerText = 'โครงสร้างเงินรางวัล & กติกาการแข่งขัน';
          if (subEl) subEl.innerText = 'อยู่ระหว่างรอยืนยันรายละเอียดกติกาและเงินรางวัลจากผู้จัดการลีก';
          if (mainContainer) {
            mainContainer.innerHTML = `
              <div class="glass-card rounded-2xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 text-center space-y-4">
                <div class="w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl border border-amber-200/80 dark:border-amber-800/80 shadow-2xs">
                  ⏳
                </div>
                <div class="space-y-1.5">
                  <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 font-display">อยู่ระหว่างรอการประกาศกติกาและโครงสร้างเงินรางวัล</h3>
                  <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                    รายละเอียดกติกา เงื่อนไขการแข่งขัน และการจัดสรรเงินรางวัลของลีก <strong>${this.escapeHtml(this.data.name)}</strong> อยู่ระหว่างการสรุปรายละเอียดจากผู้จัดการลีก (เว้นไว้ก่อน เดี๋ยวเข้ามาอธิบาย) ระบบจะนำมาอัปเดตให้ทราบในหน้านี้ทันทีหลังการประกาศอย่างเป็นทางการ
                  </p>
                </div>
                <div class="pt-2 flex items-center justify-center gap-2 flex-wrap">
                  <span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                    League ID: ${this.activeLeagueId}
                  </span>
                  <span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    สมาชิก ${(this.data.teams || []).length} ทีม
                  </span>
                  <span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                    กติกา: รอยืนยัน
                  </span>
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
              const useTieBreaker = Boolean(this.config && this.config.features && this.config.features.tie_breaker === 'highest_player');
              const eligibleSorted = [...eligibleResults].sort((a, b) => {
                const diff = b.net_points - a.net_points;
                if (diff !== 0) return diff;
                if (useTieBreaker) {
                  return this.compareTeamPlayerScores(a.entry_id, b.entry_id, g);
                }
                return 0;
              });
              const highEligiblePts = eligibleSorted.length > 0 ? eligibleSorted[0].net_points : 0;
              let topEligibleWinners = [];
              if (eligibleSorted.length > 0) {
                const topLeader = eligibleSorted[0];
                if (useTieBreaker) {
                  topEligibleWinners = eligibleSorted.filter(x => 
                    x.net_points === highEligiblePts && 
                    this.compareTeamPlayerScores(x.entry_id, topLeader.entry_id, g) === 0
                  );
                } else {
                  topEligibleWinners = eligibleSorted.filter(x => x.net_points === highEligiblePts);
                }
              }
              const winCredit = topEligibleWinners.length > 0 ? 1 / topEligibleWinners.length : 0;

              const sorted = [...gData.results].sort((a, b) => {
                const diff = b.net_points - a.net_points;
                if (diff !== 0) return diff;
                if (useTieBreaker) {
                  return this.compareTeamPlayerScores(a.entry_id, b.entry_id, g);
                }
                return 0;
              });
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
                if (this.isPrizeEligible(r.entry_id) && topEligibleWinners.some(w => w.entry_id === r.entry_id)) {
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
                    <button onclick="app.openTeamModal(${t.entry_id})" class="text-left font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-700 transition-colors cursor-pointer block truncate max-w-[130px] xs:max-w-[180px] sm:max-w-none">${this.escapeHtml(t.team_name)}</button>
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

      renderGlobalRadarView() {
        const headerPill = document.getElementById('global-radar-header-pill');
        const recordsContainer = document.getElementById('global-radar-records');
        const benchmarksContainer = document.getElementById('global-radar-league-benchmarks');
        const pillsContainer = document.getElementById('global-radar-league-pills');
        const tableBody = document.getElementById('global-radar-table-body');
        if (!tableBody) return;

        const maxGW = Number(this.multiData.max_gw) || 2;
        const leaguesObj = this.multiData.leagues || {};
        const leaguesConfig = this.configs || {};

        // 1. Compute League Benchmarks
        const leagueOrder = (this.multiData && this.multiData.league_order) || Object.keys(leaguesObj);
        const leagueBenchmarks = [];
        leagueOrder.forEach(lid => {
          const lData = leaguesObj[lid];
          if (!lData) return;
          const teams = lData.teams || [];
          const gws = lData.gameweeks || {};
          let totalNet = 0;
          let finGWCount = 0;
          for (let g = 1; g <= maxGW; g++) {
            const gData = gws[String(g)];
            if (gData && gData.is_finished) {
              finGWCount++;
              (gData.results || []).forEach(r => {
                totalNet += (r.net_points || 0);
              });
            }
          }
          const totalEntries = teams.length * Math.max(finGWCount, 1);
          const avgPts = totalEntries > 0 ? (totalNet / totalEntries).toFixed(1) : '0.0';
          leagueBenchmarks.push({
            id: lid,
            name: lData.name,
            short_name: (leaguesConfig[lid] && leaguesConfig[lid].short_name) || lData.name,
            team_count: teams.length,
            avg: Number(avgPts),
            total_net: totalNet
          });
        });

        // Render Benchmarks (Top-to-Bottom Ranking Leaderboard)
        if (benchmarksContainer) {
          const sortedBenchmarks = [...leagueBenchmarks].sort((a, b) => b.avg - a.avg);
          const topAvg = sortedBenchmarks.length > 0 ? sortedBenchmarks[0].avg : 70;
          const minScale = Math.max(0, topAvg - 12);
          const activeFilter = this.radarLeagueFilter || 'all';
          const activeLid = String(this.activeLeagueId);
          
          const clearBtn = document.getElementById('benchmark-clear-filter');
          if (clearBtn) {
            if (activeFilter !== 'all') {
              clearBtn.classList.remove('hidden');
            } else {
              clearBtn.classList.add('hidden');
            }
          }

          benchmarksContainer.innerHTML = sortedBenchmarks.map((lb, idx) => {
            const rank = idx + 1;
            const isSelected = (activeFilter === String(lb.id));
            const isCurrentLeague = (String(lb.id) === activeLid);
            const pct = Math.round(((lb.avg - minScale) / (topAvg - minScale)) * 100);

            // Uniform clean rank badge (no medals)
            const rankBadge = `<span class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold inline-flex items-center justify-center text-[10px] sm:text-xs border border-slate-200 dark:border-slate-700/80 flex-shrink-0 font-display">${rank}</span>`;

            const currentBadge = isCurrentLeague
              ? '<span class="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/30 font-display">ลีกที่คุณอยู่</span>'
              : '';

            const selectedBorder = isSelected
              ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/40 dark:bg-blue-950/40 shadow-xs'
              : isCurrentLeague
                ? 'border-blue-400/50 dark:border-blue-500/40 bg-white/80 dark:bg-slate-900/50 hover:border-blue-400'
                : 'border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 hover:border-blue-400 dark:hover:border-blue-500';

            return `
              <div onclick="app.setRadarLeagueFilter('${isSelected ? 'all' : lb.id}')" 
                   class="group relative overflow-hidden rounded-xl border ${selectedBorder} p-2.5 sm:p-3 transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99]"
                   title="${isSelected ? 'คลิกเพื่อยกเลิกการกรอง' : 'คลิกเพื่อกรองเฉพาะลีกนี้'}">
                
                <!-- Power Bar Background -->
                <div class="absolute left-0 top-0 bottom-0 bg-slate-200 dark:bg-slate-700/80 pointer-events-none transition-all group-hover:bg-slate-300/80 dark:group-hover:bg-slate-600/80" style="width: ${pct}%"></div>

                <!-- Left info: Uniform Rank + League Name + Current League Badge -->
                <div class="relative flex items-center gap-2.5 sm:gap-3 min-w-0">
                  ${rankBadge}
                  <div class="min-w-0 flex items-center gap-2 flex-wrap">
                    <span class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-display truncate">${this.escapeHtml(lb.short_name)}</span>
                    ${currentBadge}
                    ${isSelected ? '<span class="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">กำลังกรอง</span>' : ''}
                  </div>
                </div>

                <!-- Right Score: Only Average Score pts -->
                <div class="relative text-right flex-shrink-0">
                  <span class="text-sm sm:text-base font-black text-slate-900 dark:text-white font-display">${lb.avg.toFixed(1)}</span>
                  <span class="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-display"> pts</span>
                </div>
              </div>
            `;
          }).join('');
        }

        // 2. Aggregate all teams across all leagues (deduplicated by entry_id)
        const teamsMap = {};
        Object.keys(leaguesObj).forEach(lid => {
          const lData = leaguesObj[lid];
          const lName = (leaguesConfig[lid] && leaguesConfig[lid].short_name) || lData.name || `League ${lid}`;
          (lData.teams || []).forEach(t => {
            const eid = Number(t.entry_id);
            if (!teamsMap[eid]) {
              teamsMap[eid] = {
                entry_id: eid,
                team_name: t.entry_name,
                player_name: t.player_name,
                leagues: [],
                scores_by_gw: {},
                hits_by_gw: {},
                bench_by_gw: {},
                total_hits: 0,
                total_bench: 0
              };
            }
            if (!teamsMap[eid].leagues.some(item => String(item.id) === String(lid))) {
              teamsMap[eid].leagues.push({ id: lid, name: lName });
            }
          });

          // Gameweek results
          const gws = lData.gameweeks || {};
          for (let g = 1; g <= maxGW; g++) {
            const gData = gws[String(g)];
            if (!gData || !gData.results) continue;
            
            gData.results.forEach(r => {
              const eid = Number(r.entry_id);
              if (teamsMap[eid]) {
                if (gData.is_finished) {
                  if (teamsMap[eid].hits_by_gw[g] === undefined) {
                    teamsMap[eid].hits_by_gw[g] = (r.hits || 0);
                  }
                  if (teamsMap[eid].scores_by_gw[g] === undefined) {
                    teamsMap[eid].scores_by_gw[g] = r.net_points;
                    teamsMap[eid].bench_by_gw[g] = (r.bench_points || 0);
                  }
                }
              }
            });
          }
        });

        // Determine last completed gameweek across all leagues
        let lastFinishedGW = 0;
        Object.values(leaguesObj).forEach(lData => {
          const gws = (lData && lData.gameweeks) || {};
          for (let g = 1; g <= maxGW; g++) {
            if (gws[String(g)] && gws[String(g)].is_finished && g > lastFinishedGW) {
              lastFinishedGW = g;
            }
          }
        });

        const statusBadgeEl = document.getElementById('radar-gw-status-badge');
        if (statusBadgeEl) {
          statusBadgeEl.innerText = lastFinishedGW > 0 ? `(GW 1 - ${lastFinishedGW} จบสมบูรณ์)` : `(รอผล GW 1)`;
        }

        // 3. Compute stats for each team
        let globalTopScore = { score: 0, team: '-', player: '-', gw: 1, league: '-' };
        let globalTopAvg = { avg: 0, team: '-', player: '-', total: 0, league: '-' };
        let globalMostConsistent = { spread: 999, floor: 0, team: '-', player: '-', avg: 0, league: '-' };
        let globalBestBench = { bench: 0, team: '-', player: '-', league: '-' };

        const teamList = Object.values(teamsMap).map(t => {
          const finishedScores = Object.entries(t.scores_by_gw).map(([gw, pts]) => ({ gw: Number(gw), pts }));
          const ptsArray = finishedScores.map(x => x.pts);
          const totalNet = ptsArray.reduce((acc, v) => acc + v, 0);
          const count = ptsArray.length;
          const avg = count > 0 ? totalNet / count : 0;
          const highObj = finishedScores.reduce((m, x) => (x.pts > m.pts ? x : m), { gw: 1, pts: 0 });
          const lowObj = finishedScores.reduce((m, x) => (x.pts < m.pts ? x : m), { gw: 1, pts: count > 0 ? ptsArray[0] : 0 });
          const high = count > 0 ? highObj.pts : 0;
          const low = count > 0 ? lowObj.pts : 0;
          const spread = high - low;
          const totalHits = Object.values(t.hits_by_gw).reduce((acc, v) => acc + v, 0);
          const totalBench = Object.values(t.bench_by_gw).reduce((acc, v) => acc + v, 0);

          const primaryLeague = t.leagues[0] ? t.leagues[0].name : '-';

          // Update records
          if (high > globalTopScore.score) {
            globalTopScore = { score: high, team: t.team_name, player: t.player_name, gw: highObj.gw, league: primaryLeague };
          }
          if (avg > globalTopAvg.avg) {
            globalTopAvg = { avg: avg, team: t.team_name, player: t.player_name, total: totalNet, league: primaryLeague };
          }
          if (count >= 4 && avg >= 60) {
            if (spread < globalMostConsistent.spread || (spread === globalMostConsistent.spread && low > globalMostConsistent.floor)) {
              globalMostConsistent = { spread: spread, floor: low, team: t.team_name, player: t.player_name, avg: avg, league: primaryLeague };
            }
          }
          if (totalBench > globalBestBench.bench) {
            globalBestBench = { bench: totalBench, team: t.team_name, player: t.player_name, league: primaryLeague };
          }

          // Consistency Tier Badge
          let tierBadge = '';
          let tierWeight = 0;
          if (count > 0) {
            const isSTier = (avg >= 72 && low >= 48 && spread <= 60) || (avg >= 67 && spread <= 30 && low >= 50);
            const isVolatile = (spread >= 65) || (high >= 100 && low < 45);
            const isATier = avg >= 65 && low >= 40;
            const isBTier = avg >= 58;

            if (isSTier) {
              tierWeight = 5;
              tierBadge = '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-gradient-to-r from-amber-300/40 via-yellow-200/60 to-amber-300/40 text-amber-950 dark:text-amber-100 border border-amber-400 dark:border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.5)] dark:shadow-[0_0_12px_rgba(251,191,36,0.45)] ring-1 ring-amber-400/50" title="💎 S-Tier: แต้มเฉลี่ยสูงมากและนิ่งจริง (Avg ≥ 72, Floor ≥ 48, Spread ≤ 60 หรือ Avg ≥ 67, Spread ≤ 30)">💎 S-Tier</span>';
            } else if (isVolatile) {
              tierWeight = 2;
              tierBadge = '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800/80" title="⚡ Volatile: แต้มสวิงสูง มีสัปดาห์ระเบิดฟอร์มแต่วีคอื่นดรอป (Spread ≥ 65 หรือ High ≥ 100 และ Low < 45)">⚡ Volatile</span>';
            } else if (isATier) {
              tierWeight = 4;
              tierBadge = '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800" title="🟢 A-Tier: ฟอร์มดีมาตรฐานสูงสม่ำเสมอ (Avg ≥ 65, Floor ≥ 40)">🟢 A-Tier</span>';
            } else if (isBTier) {
              tierWeight = 3;
              tierBadge = '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-950/60 dark:text-yellow-200 dark:border-yellow-800" title="🟡 B-Tier: ฟอร์มคงที่ระดับกลาง (Avg ≥ 58)">🟡 B-Tier</span>';
            } else {
              tierWeight = 1;
              tierBadge = '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700" title="⚪ C-Tier: ระดับพัฒนาการ (Avg < 58)">⚪ C-Tier</span>';
            }
          }

          return {
            ...t,
            total_net: totalNet,
            total_hits: totalHits,
            total_bench: totalBench,
            avg: avg,
            high: high,
            high_gw: highObj.gw,
            low: low,
            low_gw: lowObj.gw,
            spread: spread,
            tier_badge: tierBadge,
            tier_weight: tierWeight
          };
        });

        // Fallback for most consistent if condition was empty
        if (globalMostConsistent.spread === 999 && teamList.length > 0) {
          const sortedBySpread = [...teamList].sort((a, b) => a.spread - b.spread);
          const topC = sortedBySpread[0];
          globalMostConsistent = { spread: topC.spread, floor: topC.low, team: topC.team_name, player: topC.player_name, avg: topC.avg, league: topC.leagues[0] ? topC.leagues[0].name : '-' };
        }

        // Sort teamList by total_net descending, avg descending, spread ascending, team name
        teamList.sort((a, b) => {
          const dNet = b.total_net - a.total_net;
          if (dNet !== 0) return dNet;
          const dAvg = b.avg - a.avg;
          if (dAvg !== 0) return dAvg;
          const dSpread = a.spread - b.spread;
          if (dSpread !== 0) return dSpread;
          return a.team_name.localeCompare(b.team_name);
        });

        // Assign permanent global_rank based on total_net across all teams
        teamList.forEach((t, idx) => {
          t.global_rank = idx + 1;
        });

        // Cache team list on instance for fast filtering and searching
        this._radarTeamList = teamList;

        if (headerPill) {
          headerPill.innerText = `${leagueOrder.length} ลีก • ${teamList.length} ทีม`;
        }

        // Render Record Cards (Mobile: 2x2 grid, Desktop: 4 columns)
        if (recordsContainer) {
          recordsContainer.innerHTML = `
            <div class="glass-card rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span class="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block font-display truncate">แต้มเฉลี่ยสูงสุดในระบบ</span>
                <div class="text-base sm:text-xl font-black text-slate-900 dark:text-white mt-0.5 sm:mt-1 font-display leading-tight">${globalTopAvg.avg.toFixed(1)} <span class="text-[10px] sm:text-xs font-normal">PTS/GW</span></div>
              </div>
              <div class="mt-1 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <div class="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title="${this.escapeHtml(globalTopAvg.team)}">${this.escapeHtml(globalTopAvg.team)}</div>
                <div class="text-[9px] sm:text-[10px] text-slate-500 font-display">รวม ${globalTopAvg.total} pts</div>
              </div>
            </div>

            <div class="glass-card rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span class="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block font-display truncate">ความนิ่งสูงสุด (Spread)</span>
                <div class="text-base sm:text-xl font-black text-slate-900 dark:text-white mt-0.5 sm:mt-1 font-display leading-tight">±${globalMostConsistent.spread} <span class="text-[10px] sm:text-xs font-normal">PTS</span></div>
              </div>
              <div class="mt-1 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <div class="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title="${this.escapeHtml(globalMostConsistent.team)}">${this.escapeHtml(globalMostConsistent.team)}</div>
                <div class="text-[9px] sm:text-[10px] text-slate-500 font-display">Floor ${globalMostConsistent.floor} pts</div>
              </div>
            </div>

            <div class="glass-card rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span class="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block font-display truncate">ระเบิดฟอร์มสูงสุด</span>
                <div class="text-base sm:text-xl font-black text-slate-900 dark:text-white mt-0.5 sm:mt-1 font-display leading-tight">${globalTopScore.score} <span class="text-[10px] sm:text-xs font-normal">PTS</span></div>
              </div>
              <div class="mt-1 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <div class="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title="${this.escapeHtml(globalTopScore.team)}">${this.escapeHtml(globalTopScore.team)}</div>
                <div class="text-[9px] sm:text-[10px] text-slate-500 font-display">GW ${globalTopScore.gw}</div>
              </div>
            </div>

            <div class="glass-card rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span class="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block font-display truncate">แต้มสำรองสูงสุด (Bench)</span>
                <div class="text-base sm:text-xl font-black text-slate-900 dark:text-white mt-0.5 sm:mt-1 font-display leading-tight">${globalBestBench.bench} <span class="text-[10px] sm:text-xs font-normal">PTS</span></div>
              </div>
              <div class="mt-1 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <div class="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title="${this.escapeHtml(globalBestBench.team)}">${this.escapeHtml(globalBestBench.team)}</div>
                <div class="text-[9px] sm:text-[10px] text-slate-500 font-display">ตกน้ำสะสม</div>
              </div>
            </div>
          `;
        }

        // Render Filter Pills
        if (pillsContainer) {
          const curFilter = this.radarLeagueFilter || 'all';
          let phtml = `
            <button onclick="app.setRadarLeagueFilter('all')" class="px-2.5 py-1 rounded-lg font-bold font-display text-xs transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 ${curFilter === 'all' ? 'bg-slate-900 text-white dark:bg-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}">
              ทุกลีก (${teamList.length})
            </button>
          `;
          leagueOrder.forEach(lid => {
            const lData = leaguesObj[lid];
            if (!lData) return;
            const sName = (leaguesConfig[lid] && leaguesConfig[lid].short_name) || lData.name;
            const count = (lData.teams || []).length;
            const isAct = curFilter === String(lid);
            phtml += `
              <button onclick="app.setRadarLeagueFilter('${lid}')" class="px-2.5 py-1 rounded-lg font-bold font-display text-xs transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 ${isAct ? 'bg-slate-900 text-white dark:bg-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}">
                ${this.escapeHtml(sName)} (${count})
              </button>
            `;
          });
          pillsContainer.innerHTML = phtml;
        }

        this.renderGlobalRadarTable();
      }

      renderGlobalRadarTable() {
        const tableBody = document.getElementById('global-radar-table-body');
        if (!tableBody || !this._radarTeamList) return;

        const activeSort = this.radarSortBy || 'total_net';
        const activeOrder = this.radarSortOrder || (activeSort === 'spread' || activeSort === 'hits' ? 'asc' : 'desc');

        const sortKeys = ['total_net', 'avg', 'high', 'low', 'spread', 'hits', 'bench', 'tier', 'team_name'];
        const sortLabels = {
          'total_net': { full: 'คะแนนรวม', short: 'แต้มรวม' },
          'avg': { full: 'แต้มเฉลี่ย', short: 'เฉลี่ย' },
          'high': { full: 'สูงสุด', short: 'สูงสุด' },
          'low': { full: 'ต่ำสุด (Floor)', short: 'ต่ำสุด' },
          'spread': { full: 'ความแกว่ง (Spread)', short: 'แกว่ง' },
          'hits': { full: 'แต้มลบ', short: 'ลบ' },
          'bench': { full: 'สำรอง', short: 'สำรอง' },
          'tier': { full: 'ระดับความสม่ำเสมอ', short: 'ระดับ' },
          'team_name': { full: 'ทีม & ผู้จัดการ', short: 'ทีม & ผู้จัดการ' }
        };

        const arrow = (activeOrder === 'asc') ? ' ▲' : ' ▼';

        sortKeys.forEach(k => {
          const el = document.getElementById('th-radar-' + k);
          if (el) {
            const labelObj = sortLabels[k] || { full: k, short: k };
            const isAct = (k === activeSort);
            const aStr = isAct ? arrow : '';
            el.innerHTML = `<span class="hidden sm:inline">${labelObj.full}${aStr}</span><span class="sm:hidden">${labelObj.short}${aStr}</span>`;
            const th = el.closest('th');
            if (th) {
              if (isAct) {
                th.classList.add('text-blue-600', 'dark:text-blue-400', 'font-black');
                th.classList.remove('text-slate-500', 'dark:text-slate-400');
              } else {
                th.classList.remove('text-blue-600', 'dark:text-blue-400', 'font-black');
                th.classList.add('text-slate-500', 'dark:text-slate-400');
              }
            }
          }
        });

        // Sync mobile sort select dropdown & affordance bar
        const sel = document.getElementById('global-radar-sort-select');
        if (sel && sel.value !== activeSort) {
          sel.value = activeSort;
        }
        const mobileSortLabel = document.getElementById('mobile-radar-sort-label');
        if (mobileSortLabel) {
          const textMap = {
            'total_net': 'เรียงตามคะแนนรวม',
            'avg': 'เรียงตามแต้มเฉลี่ย',
            'high': 'เรียงตามแต้มสูงสุด',
            'low': 'เรียงตามต่ำสุด (Floor)',
            'spread': 'เรียงตามความนิ่ง (แกว่ง)',
            'hits': 'เรียงตามแต้มลบ',
            'bench': 'เรียงตามแต้มสำรอง',
            'tier': 'เรียงตามระดับความสม่ำเสมอ',
            'team_name': 'เรียงตามชื่อทีม'
          };
          const dirIndicator = (activeOrder === 'asc') ? ' ▲ (น้อยไปมาก)' : ' ▼ (มากไปน้อย)';
          mobileSortLabel.innerText = `${textMap[activeSort] || 'เรียงตามคะแนนรวม'}${dirIndicator}`;
        }

        let filtered = [...this._radarTeamList];
        if (this.radarLeagueFilter && this.radarLeagueFilter !== 'all') {
          filtered = filtered.filter(t => t.leagues.some(l => String(l.id) === String(this.radarLeagueFilter)));
        }
        if (this.radarSearchQuery) {
          const q = this.radarSearchQuery.toLowerCase().trim();
          filtered = filtered.filter(t => t.team_name.toLowerCase().includes(q) || (t.player_name || '').toLowerCase().includes(q));
        }

        filtered.sort((a, b) => {
          let diff = 0;
          if (activeSort === 'avg') {
            diff = (activeOrder === 'asc') ? (a.avg - b.avg) : (b.avg - a.avg);
          } else if (activeSort === 'spread') {
            diff = (activeOrder === 'asc') ? (a.spread - b.spread) : (b.spread - a.spread);
          } else if (activeSort === 'high') {
            diff = (activeOrder === 'asc') ? (a.high - b.high) : (b.high - a.high);
          } else if (activeSort === 'low') {
            diff = (activeOrder === 'asc') ? (a.low - b.low) : (b.low - a.low);
          } else if (activeSort === 'hits') {
            diff = (activeOrder === 'asc') ? (a.total_hits - b.total_hits) : (b.total_hits - a.total_hits);
          } else if (activeSort === 'bench') {
            diff = (activeOrder === 'asc') ? (a.total_bench - b.total_bench) : (b.total_bench - a.total_bench);
          } else if (activeSort === 'tier') {
            diff = (activeOrder === 'asc') ? (a.tier_weight - b.tier_weight) : (b.tier_weight - a.tier_weight);
          } else if (activeSort === 'team_name') {
            diff = (activeOrder === 'asc') ? a.team_name.localeCompare(b.team_name) : b.team_name.localeCompare(a.team_name);
          } else {
            // default total_net
            diff = (activeOrder === 'asc') ? (a.total_net - b.total_net) : (b.total_net - a.total_net);
          }

          if (diff !== 0) return diff;
          // Tie-breakers
          const dNet = b.total_net - a.total_net;
          if (dNet !== 0) return dNet;
          const dAvg = b.avg - a.avg;
          if (dAvg !== 0) return dAvg;
          return a.spread - b.spread;
        });

        if (filtered.length === 0) {
          tableBody.innerHTML = `
            <tr>
              <td colspan="10" class="py-8 text-center text-slate-400 dark:text-slate-500 font-display">
                ไม่พบทีมที่ตรงกับเงื่อนไขค้นหา
              </td>
            </tr>
          `;
          return;
        }

        let html = '';
        filtered.forEach((t) => {
          const spreadColor = t.spread <= 30 ? 'text-emerald-600 font-bold' : (t.spread <= 45 ? 'text-slate-700 dark:text-slate-300' : 'text-amber-600 font-bold');

          html += `
            <tr class="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800/80">
              <td class="py-2.5 px-1 sm:px-2 text-center font-display font-bold text-slate-500 whitespace-nowrap w-[28px] min-w-[28px] max-w-[28px] sm:w-[36px] sm:min-w-[36px] sticky left-0 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/90 z-10">${t.global_rank}</td>
              <td class="py-2.5 px-2 sm:px-3 min-w-[125px] sm:min-w-0 max-w-[150px] sm:max-w-none sticky left-[28px] sm:left-[36px] bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/90 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] dark:shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">
                <button onclick="app.openTeamModal(${t.entry_id})" class="text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block truncate w-full">
                  ${this.escapeHtml(t.team_name)}
                </button>
                <div class="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5">${this.escapeHtml(t.player_name || '')}</div>
              </td>
              <td class="py-2.5 px-1.5 sm:px-2 text-center font-display font-black text-slate-900 dark:text-white whitespace-nowrap">${t.total_net}</td>
              <td class="py-2.5 px-1.5 sm:px-2 text-center font-display font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">${t.avg.toFixed(1)}</td>
              <td class="py-2.5 px-1.5 sm:px-2 text-center font-display text-emerald-600 font-bold whitespace-nowrap" title="Gameweek ${t.high_gw}">${t.high}</td>
              <td class="py-2.5 px-1.5 sm:px-2 text-center font-display text-slate-500 whitespace-nowrap" title="Gameweek ${t.low_gw}">${t.low}</td>
              <td class="py-2.5 px-1.5 sm:px-2 text-center font-display whitespace-nowrap ${spreadColor}" title="ส่วนต่างแต้มสูงสุด - ต่ำสุด">±${t.spread}</td>
              <td class="py-2.5 px-1.5 sm:px-2 text-center font-display whitespace-nowrap ${t.total_hits > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'}">${t.total_hits > 0 ? `-${t.total_hits}` : '-'}</td>
              <td class="py-2.5 px-1.5 sm:px-2 text-center font-display text-slate-500 whitespace-nowrap">${t.total_bench > 0 ? t.total_bench : '-'}</td>
              <td class="py-2.5 px-2 sm:px-3 text-center font-display whitespace-nowrap">${t.tier_badge}</td>
            </tr>
          `;
        });

        tableBody.innerHTML = html;
      }

      setRadarLeagueFilter(lid) {
        this.radarLeagueFilter = String(lid);
        if (typeof this.renderGlobalRadarView === 'function') {
          this.renderGlobalRadarView();
          return;
        }
        const pillsContainer = document.getElementById('global-radar-league-pills');
        if (pillsContainer && this._radarTeamList) {
          const leaguesObj = this.multiData.leagues || {};
          const leaguesConfig = this.configs || {};
          const leagueOrder = (this.multiData && this.multiData.league_order) || Object.keys(leaguesObj);
          let phtml = `
            <button onclick="app.setRadarLeagueFilter('all')" class="px-2.5 py-1 rounded-lg font-bold font-display text-xs transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 ${this.radarLeagueFilter === 'all' ? 'bg-slate-900 text-white dark:bg-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}">
              ทุกลีก (${this._radarTeamList.length})
            </button>
          `;
          leagueOrder.forEach(id => {
            const lData = leaguesObj[id];
            if (!lData) return;
            const sName = (leaguesConfig[id] && leaguesConfig[id].short_name) || lData.name;
            const count = (lData.teams || []).length;
            const isAct = this.radarLeagueFilter === String(id);
            phtml += `
              <button onclick="app.setRadarLeagueFilter('${id}')" class="px-2.5 py-1 rounded-lg font-bold font-display text-xs transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 ${isAct ? 'bg-slate-900 text-white dark:bg-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}">
                ${this.escapeHtml(sName)} (${count})
              </button>
            `;
          });
          pillsContainer.innerHTML = phtml;
        }
        this.renderGlobalRadarTable();
      }

      setRadarSortBy(sortKey, forceOrder = null) {
        if (forceOrder) {
          this.radarSortBy = sortKey;
          this.radarSortOrder = forceOrder;
        } else if (this.radarSortBy === sortKey) {
          this.radarSortOrder = (this.radarSortOrder === 'asc') ? 'desc' : 'asc';
        } else {
          this.radarSortBy = sortKey;
          if (sortKey === 'spread' || sortKey === 'hits') {
            this.radarSortOrder = 'asc';
          } else {
            this.radarSortOrder = 'desc';
          }
        }
        this.renderGlobalRadarTable();
      }

      handleRadarSearch(val) {
        this.radarSearchQuery = val || '';
        this.renderGlobalRadarTable();
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

        if (descEl) {
          descEl.innerHTML = `
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2 text-xs">
              <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200/60 dark:border-blue-800/60">League ID: ${this.activeLeagueId}</span>
              <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">${teamDesc}</span>
              <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200/60 dark:border-emerald-800/60">ค่าสมัคร: ${this.config.entry_fee}</span>
              <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold border border-amber-200/60 dark:border-amber-800/60">กองกลาง: ${this.config.total_pool}</span>
            </div>
          `;
        }
        if (badgeEl) badgeEl.innerText = this.config.total_pool || 'OFFICIAL RULES';

        if (cardsContainer && this.config.rules_cards) {
          let html = '';
          this.config.rules_cards.forEach((card, idx) => {
            let itemsHtml = '';
            card.items.forEach(item => {
              let formattedDesc = '';
              if (item.desc) {
                const lines = item.desc.split('\\n').map(l => l.trim()).filter(Boolean);
                if (lines.length > 1) {
                  const listItems = lines.map(line => {
                    const isBullet = line.startsWith('•') || line.startsWith('-');
                    const content = isBullet ? line.replace(/^[•\\-]\\s*/, '') : line;
                    return `
                      <li class="flex items-start gap-2 leading-relaxed text-xs sm:text-[13px] text-slate-600 dark:text-slate-300">
                        <span class="text-blue-500 dark:text-blue-400 font-bold leading-tight select-none mt-0.5">•</span>
                        <span class="flex-1">${content}</span>
                      </li>
                    `;
                  }).join('');
                  formattedDesc = `<ul class="space-y-1.5 mt-2 pl-0.5">${listItems}</ul>`;
                } else {
                  formattedDesc = `<p class="mt-1.5 leading-relaxed text-xs sm:text-[13px] text-slate-600 dark:text-slate-300">${item.desc}</p>`;
                }
              }

              itemsHtml += `
                <div class="bg-slate-50/90 dark:bg-slate-900/60 p-3.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 transition-colors shadow-2xs">
                  <div class="flex items-center gap-2 border-b border-slate-200/40 dark:border-slate-800/60 pb-1.5">
                    <span class="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0"></span>
                    <strong class="text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm tracking-tight">${item.label}</strong>
                  </div>
                  ${formattedDesc}
                </div>
              `;
            });

            html += `
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3.5 shadow-2xs">
                <div>
                  <div class="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                    <span class="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center font-display border border-blue-200/50 dark:border-blue-800/50">${idx + 1}</span>
                    <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-[15px] tracking-tight">${card.title}</h3>
                  </div>
                  <div class="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    ${itemsHtml}
                  </div>
                </div>
                <div class="text-[11px] text-slate-400 dark:text-slate-500 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 leading-normal">
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
          } else {
            chipBadge.className = 'hidden';
            chipBadge.innerText = '';
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
          if (modal) {
            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
          }
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

          const gwKey = String(this.selectedGW);
          const gwData = this.data.gameweeks ? this.data.gameweeks[gwKey] : null;
          const isGwFinished = gwData ? Boolean(gwData.is_finished) : false;
          const unstartedTeams = (gwData && gwData.unstarted_teams) ? gwData.unstarted_teams : [];

          const isPlayerUnstarted = (p) => {
            if (isGwFinished) return false;
            if (p.not_played_yet !== undefined && p.not_played_yet !== null) {
              return Boolean(p.not_played_yet);
            }
            return unstartedTeams.includes(p.team) || unstartedTeams.includes(p.team_code);
          };

          const renderPlayerCard = (p, count) => {
            const isCap = Boolean(p.is_captain);
            const isVice = Boolean(p.is_vice);
            const shirtUrl = this.getPlayerShirtUrl(p);
            const notPlayed = isPlayerUnstarted(p);

            return `
              <div class="flex flex-col items-center justify-center p-0.5 text-center min-w-0 transition-transform active:scale-95 group" style="width: ${100 / Math.max(count, 3)}%; max-width: 76px;">
                <div class="relative flex items-center justify-center mb-0.5">
                  <img 
                    src="${shirtUrl}" 
                    alt="${this.escapeHtml(p.team || '')}" 
                    width="44"
                    height="52"
                    decoding="async"
                    class="w-8 h-9 xs:w-9 xs:h-10 sm:w-11 sm:h-12 md:w-12 md:h-14 object-contain drop-shadow-md transition-transform group-hover:scale-105"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_0-66.webp';"
                  />
                  ${isCap ? '<span class="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-[7.5px] xs:text-[8px] sm:text-[9px] w-3.5 h-3.5 xs:w-4 xs:h-4 rounded-full flex items-center justify-center font-display shadow-md border border-amber-300 z-10">C</span>' : ''}
                  ${isVice ? '<span class="absolute -top-1 -right-1 bg-slate-200 text-slate-950 font-black text-[7.5px] xs:text-[8px] sm:text-[9px] w-3.5 h-3.5 xs:w-4 xs:h-4 rounded-full flex items-center justify-center font-display shadow-md border border-slate-300 z-10">V</span>' : ''}
                </div>

                <div class="bg-slate-950/90 text-white font-bold text-[8.5px] xs:text-[9px] sm:text-[10px] px-1 py-0.5 rounded shadow-sm w-full truncate text-center border border-white/10 leading-tight">
                  ${this.escapeHtml(p.name)}
                </div>

                ${notPlayed ? '' : `
                  <div class="bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-[8px] xs:text-[8.5px] sm:text-[9.5px] font-black font-display px-1 sm:px-1.5 py-0.5 rounded mt-0.5 shadow-xs whitespace-nowrap">
                    ${p.points} pts
                  </div>
                `}
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
          const gwKey = String(this.selectedGW);
          const gwData = this.data.gameweeks ? this.data.gameweeks[gwKey] : null;
          const isGwFinished = gwData ? Boolean(gwData.is_finished) : false;
          const unstartedTeams = (gwData && gwData.unstarted_teams) ? gwData.unstarted_teams : [];

          const isPlayerUnstarted = (p) => {
            if (isGwFinished) return false;
            if (p.not_played_yet !== undefined && p.not_played_yet !== null) {
              return Boolean(p.not_played_yet);
            }
            return unstartedTeams.includes(p.team) || unstartedTeams.includes(p.team_code);
          };

          squad.bench.forEach((p, idx) => {
            const notPlayed = isPlayerUnstarted(p);
            if (!notPlayed) {
              bPoints += (p.points || 0);
            }
            const shirtUrl = this.getPlayerShirtUrl(p);
            const subLabel = p.pos === 'GKP' ? 'GK' : `Sub ${idx}`;
            bHtml += `
              <div class="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-2 sm:p-2.5 flex items-center justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                <div class="flex items-center gap-1.5 sm:gap-2 min-w-0 pr-1.5 sm:pr-2">
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
                  <span class="text-[9px] sm:text-[10px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-md font-display flex-shrink-0">${p.pos}</span>
                  <span class="text-[9px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-200/50 dark:border-slate-700/50 font-display flex-shrink-0">${subLabel}</span>
                  <span class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">${this.escapeHtml(p.name)}</span>
                  ${p.is_captain ? `<span class="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 px-1 py-0.5 rounded font-display flex-shrink-0">C</span>` : ''}
                  ${p.is_vice ? `<span class="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 px-1 py-0.5 rounded font-display flex-shrink-0">V</span>` : ''}
                </div>
                ${notPlayed
                  ? `<span class="text-xs text-slate-400 font-bold font-display flex-shrink-0 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-lg">-</span>`
                  : `<span class="text-xs sm:text-xs font-bold text-slate-700 dark:text-slate-300 font-display flex-shrink-0 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-lg">${p.points} pts</span>`
                }
              </div>
            `;
          });
          if (benchContainer) benchContainer.innerHTML = bHtml;
          if (benchTotal) {
            const isBBoost = ['bboost', 'bench_boost'].includes((matchdayRes.chip || '').toLowerCase());
            benchTotal.innerHTML = isBBoost 
              ? `<span class="text-emerald-600 dark:text-emerald-400 font-bold">รวม ${bPoints} pts (⚡ Bench Boost นับแต้ม)</span>`
              : `รวม ${bPoints} pts`;
          }
        }

        const modal = document.getElementById('team-modal');
        if (modal) {
          modal.classList.remove('hidden');
          document.body.classList.add('overflow-hidden');
        }
      }

      closeTeamModal() {
        const modal = document.getElementById('team-modal');
        if (modal) {
          modal.classList.add('hidden');
          document.body.classList.remove('overflow-hidden');
        }
      }

      regenerateLiveNote() {
        const gw = this.selectedGW;
        const gwData = this.data.gameweeks ? this.data.gameweeks[String(gw)] : null;
        const nonPrizeList = (this.config && this.config.non_prize_teams) || [];
        const isWeeklyPrize = (this.config && this.config.features && this.config.features.prize_model === 'weekly');
        const useTieBreaker = Boolean(this.config && this.config.features && this.config.features.tie_breaker === 'highest_player');
        const newNote = LiveCommentaryEngine.generateFreshNote(gw, gwData, this.data.name, true, nonPrizeList, this.data, isWeeklyPrize, useTieBreaker);
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
          const useHighestPlayerTieBreaker = Boolean(this.config && this.config.features && this.config.features.tie_breaker === 'highest_player');
          const sorted = [...gwData.results].sort((a, b) => {
            const diff = (b[scoreProp] - a[scoreProp]) || (b.net_points - a.net_points) || (b.points - a.points);
            if (diff !== 0) return diff;
            if (useHighestPlayerTieBreaker) {
              return this.compareTeamPlayerScores(a.entry_id, b.entry_id, Number(gwKey));
            }
            return 0;
          });
          const eligibleResults = sorted.filter(r => this.isPrizeEligible(r.entry_id));
          const eligibleHighestScore = eligibleResults.length > 0 ? eligibleResults[0][scoreProp] : 0;
          let eligibleWinners = [];
          if (eligibleResults.length > 0) {
            const topLeader = eligibleResults[0];
            if (useHighestPlayerTieBreaker) {
              eligibleWinners = eligibleResults.filter(r => 
                r[scoreProp] === topLeader[scoreProp] && 
                this.compareTeamPlayerScores(r.entry_id, topLeader.entry_id, Number(gwKey)) === 0
              );
            } else {
              eligibleWinners = eligibleResults.filter(r => r[scoreProp] === eligibleHighestScore);
            }
          }
          const isJointPrize = eligibleWinners.length > 1;
          const overallTop = sorted[0];
          const prizeLeader = eligibleWinners[0] || overallTop;
          const hasPassedPrize = !this.isPrizeEligible(overallTop.entry_id) && eligibleWinners.length > 0 && overallTop[scoreProp] > prizeLeader[scoreProp];

          const noteEl = document.getElementById('current-gw-note-text');
          let currentLiveNote = noteEl ? noteEl.innerText.replace(/^"|"$/g, '').trim() : '';
          if (!currentLiveNote) {
            const nonPrizeList = (this.config && this.config.non_prize_teams) || [];
            const cacheKey = `${this.activeLeagueId}_${this.selectedGW}`;
            const rawHtmlNote = this.liveNotesCache[cacheKey] || LiveCommentaryEngine.generateFreshNote(this.selectedGW, gwData, this.data.name, false, nonPrizeList, this.data, isWeekly, useHighestPlayerTieBreaker);
            currentLiveNote = String(rawHtmlNote).replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
          }

          let text = `${this.data.name} (League ${this.activeLeagueId})\n`;
          text += `สรุปผล Gameweek ${gwKey} (${isFinished ? 'จบการแข่งขัน' : 'กำลังแข่งขัน'})\n`;
          text += `----------------------------------------\n`;

          if (isFinished) {
            if (isWeekly) {
              const weeklyPrizesConfig = this.config.features.weekly_prizes;
              if (weeklyPrizesConfig) {
                const tierPrizes = Object.values(weeklyPrizesConfig).map(Number);
                const eligibleSorted = sorted.filter(r => this.isPrizeEligible(r.entry_id));
                const payouts = this.calculateWeeklyTierPrizes(eligibleSorted, tierPrizes, Number(gwKey));
                text += `🏆 สรุปเงินรางวัลประจำสัปดาห์ 3 อันดับ (GW ${gwKey}):\n`;
                payouts.forEach(p => {
                  const medal = p.rank === 1 ? '🥇 อันดับ 1' : (p.rank === 2 ? '🥈 อันดับ 2' : '🥉 อันดับ 3');
                  const jointText = p.isJoint ? ` (เสมอ ${p.jointCount} ทีม หารเท่า)` : '';
                  const tieText = p.tieBreakNote ? ` [${p.tieBreakNote}]` : '';
                  text += `• ${medal}: ${p.team_name} (${p.player_name}) • ${p.net_points} pts • ${p.prize.toLocaleString()} THB${jointText}${tieText}\n`;
                });
              } else {
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
              }
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
                .sort((a, b) => (b.pts - a.pts) || (a.name || '').localeCompare(b.name || ''));
              if (eligibleMonthly.length > 0 && eligibleMonthly[0].pts > 0) {
                const topScore = eligibleMonthly[0].pts;
                const topLeads = eligibleMonthly.filter(t => t.pts === topScore);
                text += `\n📅 สถานการณ์รางวัลประจำเดือน (${curMonth.month} - ชิง ${curMonth.budget}):\n`;
                if (topLeads.length > 1) {
                  const leadNames = topLeads.map(t => t.name).join(', ');
                  text += `• จ่าฝูงร่วมเดือนนี้ (${topLeads.length} ทีม): ${leadNames} (${topScore} pts)\n`;
                } else {
                  text += `• จ่าฝูงเดือนนี้: ${topLeads[0].name} (${topScore} pts)\n`;
                }
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
          if (modal) {
            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
          }

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
        if (modal) {
          modal.classList.add('hidden');
          document.body.classList.remove('overflow-hidden');
        }
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
            const scoreProp = (isFinished || isWeeklyPrize) ? 'net_points' : 'points';
            const useHighestPlayerTieBreaker = Boolean(this.config && this.config.features && this.config.features.tie_breaker === 'highest_player');
            const sortedGWResults = [...gwData.results].sort((a, b) => {
              const diff = (b[scoreProp] - a[scoreProp]) || (b.net_points - a.net_points) || (b.points - a.points);
              if (diff !== 0) return diff;
              if (useHighestPlayerTieBreaker) {
                return this.compareTeamPlayerScores(a.entry_id, b.entry_id, g);
              }
              return 0;
            });

            let prizeRank = 1;
            let eCount = 0;
            let prevScore = null;
            let prevTeam = null;
            const rankMap = {};

            sortedGWResults.forEach(r => {
              const isPrize = this.isPrizeEligible(r.entry_id);
              if (!isPrize) {
                rankMap[r.entry_id] = 'ร่วมสนุก';
                return;
              }
              eCount++;
              const score = r[scoreProp];
              let isTiedWithPrev = false;
              if (prevScore !== null && score === prevScore) {
                if (useHighestPlayerTieBreaker && prevTeam) {
                  isTiedWithPrev = (this.compareTeamPlayerScores(r.entry_id, prevTeam.entry_id, g) === 0);
                } else {
                  isTiedWithPrev = true;
                }
              }
              if (!isTiedWithPrev && prevScore !== null) {
                prizeRank = eCount;
              }
              prevScore = score;
              prevTeam = r;
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
          const hasWeeklyPenalties = Boolean(feat.has_weekly_penalties);

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
                total_prize: 0,
                fines_paid: 0,
                danger_count: 0
              };
            });

            const weeklyPrizesConfig = feat.weekly_prizes;
            const tierPrizes = weeklyPrizesConfig 
              ? Object.values(weeklyPrizesConfig).map(Number)
              : [feat.weekly_prize_amount || (this.activeLeagueId === '38491' ? 500 : 350)];

            for (let g = 1; g <= maxGW; g++) {
              const gwData = this.data.gameweeks ? this.data.gameweeks[String(g)] : null;
              if (!gwData || !gwData.results) continue;
              const isFin = Boolean(gwData.is_finished);
              const eligible = gwData.results.filter(r => this.isPrizeEligible(r.entry_id));

              if (eligible.length > 0) {
                const useTieBreaker = Boolean(this.config && this.config.features && this.config.features.tie_breaker === 'highest_player');
                const sortedEligible = [...eligible].sort((a, b) => {
                  const diff = b.net_points - a.net_points;
                  if (diff !== 0) return diff;
                  if (useTieBreaker) {
                    return this.compareTeamPlayerScores(a.entry_id, b.entry_id, g);
                  }
                  return 0;
                });
                const payouts = this.calculateWeeklyTierPrizes(sortedEligible, tierPrizes, g);

                payouts.forEach(p => {
                  if (isFin) {
                    if (teamWinnings[p.entry_id]) {
                      if (p.rank === 1) teamWinnings[p.entry_id].win_count += (1 / p.jointCount);
                      teamWinnings[p.entry_id].won_gws.push(`GW${g}${tierPrizes.length > 1 ? ` (อันดับ ${p.rank})` : ''}`);
                      teamWinnings[p.entry_id].total_prize += p.prize;
                    }
                  }
                  const tieText = p.tieBreakNote ? ` (${p.tieBreakNote})` : '';
                  const note = p.isJoint ? `ครองอันดับร่วม ${p.jointCount} ทีม (หารเท่า)` : (tierPrizes.length > 1 ? `อันดับ ${p.rank}${tieText}` : 'แชมป์เดี่ยว');

                  prizeRows.push([
                    `GW ${g}`,
                    isFin ? 'จบการแข่งขัน (รับรางวัลแล้ว)' : 'กำลังแข่งขัน (ผู้นำชั่วคราว)',
                    tierPrizes.length > 1 ? `อันดับ ${p.rank}: ${p.team_name}` : p.team_name,
                    p.player_name,
                    p.entry_id,
                    p.points,
                    p.hits || 0,
                    p.net_points,
                    isFin ? p.prize : 0,
                    note
                  ]);
                });

                if (hasWeeklyPenalties) {
                  const weeklyPenalties = this.calculateWeeklyPenalties(sortedEligible, g);
                  weeklyPenalties.forEach(pen => {
                    if (isFin && teamWinnings[pen.entry_id]) {
                      teamWinnings[pen.entry_id].fines_paid += pen.fine;
                      teamWinnings[pen.entry_id].danger_count += 1;
                    }
                  });
                }
              }
            }

            // Weekly Penalties Table (if enabled for this league, e.g. 438691)
            if (hasWeeklyPenalties) {
              prizeRows.push([]);
              prizeRows.push(['=== สรุปค่าปรับ 5 อันดับท้ายประจำสัปดาห์ (WEEKLY PENALTY FINES) ===']);
              prizeRows.push([
                'Gameweek',
                'สถานะ',
                'อันดับจากท้าย',
                'ทีมที่เสียค่าปรับ',
                'ผู้จัดการ',
                'FPL ID',
                'คะแนนดิบ',
                'แต้มลบ (Hits)',
                'คะแนนสุทธิ',
                'ค่าปรับ (THB)',
                'หมายเหตุ'
              ]);

              for (let g = 1; g <= maxGW; g++) {
                const gwData = this.data.gameweeks ? this.data.gameweeks[String(g)] : null;
                if (!gwData || !gwData.results) continue;
                const isFin = Boolean(gwData.is_finished);
                const eligible = gwData.results.filter(r => this.isPrizeEligible(r.entry_id));
                if (eligible.length > 0) {
                  const sortedEligible = [...eligible].sort((a, b) => b.net_points - a.net_points);
                  const weeklyPenalties = this.calculateWeeklyPenalties(sortedEligible, g);
                  weeklyPenalties.forEach(pen => {
                    const statusDesc = isFin ? 'จบการแข่งขัน (ชำระเข้ากองกลาง)' : 'กำลังแข่งขัน (อยู่ในโซนอันตราย)';
                    const note = pen.isJoint ? `แต้มเท่ากัน ${pen.jointCount} ทีม (เฉลี่ยค่าปรับ)` : (pen.tieBreakNote ? `ตัดสินด้วย ${pen.tieBreakNote}` : 'อันดับเดี่ยว');
                    prizeRows.push([
                      `GW ${g}`,
                      statusDesc,
                      pen.rankLabel || 'อันดับท้าย',
                      pen.team_name,
                      pen.player_name,
                      pen.entry_id,
                      pen.points !== undefined ? pen.points : '-',
                      pen.hits || 0,
                      pen.net_points,
                      isFin ? pen.fine : 0,
                      note
                    ]);
                  });
                }
              }
            }

            // Summary Table: Total Winnings by Team
            prizeRows.push([]);
            prizeRows.push([hasWeeklyPenalties ? '=== สรุปยอดเงินรางวัลและค่าปรับสุทธิรายทีม (NET BALANCE PER TEAM) ===' : '=== สรุปยอดเงินรางวัลสะสมรายทีม (TOTAL PRIZE WINNINGS PER TEAM) ===']);
            if (hasWeeklyPenalties) {
              prizeRows.push([
                'อันดับยอดสุทธิ',
                'ชื่อทีม',
                'ผู้จัดการ',
                'FPL ID',
                'สถานะ',
                'จำนวนแชมป์วีค (ครั้ง)',
                'เงินรางวัลรวม (THB)',
                'ค่าปรับรวม (THB)',
                'ติดโซนอันตราย (ครั้ง)',
                'ยอดสุทธิ (Net Balance THB)'
              ]);
            } else {
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
            }

            const sortedWinnings = Object.values(teamWinnings)
              .filter(t => t.is_prize)
              .sort((a, b) => {
                if (hasWeeklyPenalties) {
                  const netA = a.total_prize - a.fines_paid;
                  const netB = b.total_prize - b.fines_paid;
                  if (netB !== netA) return netB - netA;
                }
                return b.total_prize - a.total_prize;
              });

            sortedWinnings.forEach((t, idx) => {
              const winCountDisp = (t.win_count % 1 === 0) ? t.win_count : t.win_count.toFixed(1);
              if (hasWeeklyPenalties) {
                prizeRows.push([
                  idx + 1,
                  t.team_name,
                  t.player_name,
                  t.entry_id,
                  'แข่งขันชิงรางวัล',
                  winCountDisp,
                  t.total_prize,
                  t.fines_paid,
                  t.danger_count,
                  t.total_prize - t.fines_paid
                ]);
              } else {
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
              }
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

          } else if (feat.prize_model === 'monthly') {
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
                .sort((a, b) => (b.pts - a.pts) || (a.team_name || '').localeCompare(b.team_name || '') || (a.entry_id - b.entry_id));

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
                  const rawSplit = (champAmount + runnerAmount) / topChamps.length;
                  champPayout = ((champAmount + runnerAmount) % topChamps.length !== 0)
                    ? Number(rawSplit.toFixed(2))
                    : Math.round(rawSplit);
                  runnerPayout = 0;
                } else {
                  const secondScore = sortedMonth.find(t => t.pts < topScore)?.pts;
                  if (secondScore !== undefined && secondScore > 0) {
                    topRunners = sortedMonth.filter(t => t.pts === secondScore);
                    const rawSplit = runnerAmount / topRunners.length;
                    runnerPayout = (topRunners.length > 1 && runnerAmount % topRunners.length !== 0)
                      ? Number(rawSplit.toFixed(2))
                      : Math.round(rawSplit);
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
          } else if (feat.prize_model === 'annual_zero_sum' || feat.prize_model === 'annual') {
            prizeRows.push(['=== สรุปยอดเงินรางวัล & ค่าปรับคะแนนรวมสิ้นฤดูกาล (ANNUAL ZERO-SUM SETTLEMENT) ===']);
            prizeRows.push([
              'อันดับ',
              'ทีม',
              'ผู้จัดการ',
              'FPL ID',
              'คะแนนรวมสะสม',
              'ยอดเงินสุทธิสิ้นฤดูกาล (THB)'
            ]);

            const tiers = feat.annual_payout_tiers || {
              "1": 1000, "2": 800, "3": 600, "4": 400, "5": 200, "6": 100,
              "7": -100, "8": -200, "9": -400, "10": -600, "11": -800, "12": -1000
            };

            const overallMap = {};
            (this.data.teams || []).forEach(t => {
              overallMap[t.entry_id] = {
                entry_id: t.entry_id,
                team_name: t.entry_name,
                player_name: t.player_name,
                fpl_rank: t.rank || 999,
                total_points: 0
              };
            });

            for (let g = 1; g <= maxGW; g++) {
              const gData = this.data.gameweeks ? this.data.gameweeks[String(g)] : null;
              if (gData && gData.results) {
                const gIsStarted = gData.is_started !== undefined ? Boolean(gData.is_started) : (Boolean(gData.is_finished) || gData.results.some(r => r.points > 0));
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
                        total_points: 0
                      };
                    }
                    overallMap[r.entry_id].total_points += r.net_points;
                  });
                }
              }
            }

            const overallSorted = Object.values(overallMap).sort((a, b) => {
              const aEligible = this.isPrizeEligible(a.entry_id) ? 1 : 0;
              const bEligible = this.isPrizeEligible(b.entry_id) ? 1 : 0;
              if (aEligible !== bEligible) return bEligible - aEligible;
              return (b.total_points - a.total_points) || ((a.fpl_rank || 999) - (b.fpl_rank || 999));
            });

            const eligibleTeams = overallSorted.filter(t => this.isPrizeEligible(t.entry_id));
            let currentIdx = 0;
            while (currentIdx < eligibleTeams.length) {
              let nextIdx = currentIdx + 1;
              while (nextIdx < eligibleTeams.length && eligibleTeams[nextIdx].total_points === eligibleTeams[currentIdx].total_points) {
                nextIdx++;
              }
              const count = nextIdx - currentIdx;
              const rankStart = currentIdx + 1;
              const rankEnd = currentIdx + count;

              let tierSum = 0;
              for (let rPos = rankStart; rPos <= rankEnd; rPos++) {
                tierSum += Number(tiers[String(rPos)] || 0);
              }
              const avgPayout = count > 0 ? (tierSum / count) : 0;

              for (let i = currentIdx; i < nextIdx; i++) {
                const tm = eligibleTeams[i];
                tm.overall_rank = rankStart;
                tm.is_joint = count > 1;
                tm.joint_count = count;
                tm.pos_start = rankStart;
                tm.pos_end = rankEnd;
                tm.payout = avgPayout;
              }
              currentIdx = nextIdx;
            }

            overallSorted.forEach(team => {
              if (!this.isPrizeEligible(team.entry_id)) {
                team.overall_rank = null;
                team.is_joint = false;
                team.payout = 0;
              }
            });

            overallSorted.forEach(team => {
              const isPrize = this.isPrizeEligible(team.entry_id);
              const r = team.overall_rank;
              const payout = isPrize ? team.payout : 0;
              let payoutText = '-';

              if (isPrize && r) {
                if (payout > 0) {
                  payoutText = `+${payout.toLocaleString()}`;
                } else if (payout < 0) {
                  payoutText = `${payout.toLocaleString()}`;
                } else {
                  payoutText = '0';
                }
              }

              const rankLabel = isPrize ? (team.is_joint ? `อันดับ ${r} (ร่วม)` : `อันดับ ${r}`) : 'ร่วมสนุก';

              prizeRows.push([
                rankLabel,
                team.team_name,
                team.player_name,
                team.entry_id,
                team.total_points,
                payoutText
              ]);
            });
          } else {
            prizeRows.push(['=== ข้อมูลเงินรางวัลและกติกา (PRIZE & RULES MATRIX) ===']);
            prizeRows.push(['สถานะ', 'อยู่ระหว่างรอการประกาศกติกาและโครงสร้างเงินรางวัลอย่างเป็นทางการ (เว้นไว้ก่อน เดี๋ยวเข้ามาอธิบาย)']);
            prizeRows.push(['ลีก', this.data.name]);
            prizeRows.push(['League ID', String(this.activeLeagueId)]);
            prizeRows.push(['จำนวนสมาชิก', (this.data.teams || []).length + ' ทีม']);
          }

          // ====================================================
          // 4. WRITE EXCEL VIA SHEETJS OR FALLBACK
          // ====================================================
          const sanitizeCell = (v) => {
            if (typeof v === 'string' && /^[=+\-@]/.test(v)) return "'" + v;
            return v;
          };
          const sanitizeSheetRows = (rows) => rows.map(r => r.map(sanitizeCell));

          if (typeof XLSX !== 'undefined' && XLSX.utils && XLSX.writeFile) {
            const wb = XLSX.utils.book_new();

            const wsLeader = XLSX.utils.aoa_to_sheet(sanitizeSheetRows(leaderRows));
            const wsGW = XLSX.utils.aoa_to_sheet(sanitizeSheetRows(gwRows));
            const wsPrize = XLSX.utils.aoa_to_sheet(sanitizeSheetRows(prizeRows));

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
          let s = String(unsafe);
          if (typeof unsafe === 'string' && /^[=+\-@]/.test(s)) {
            s = "'" + s;
          }
          return s
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

        const blob = new Blob(['\uFEFF', xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
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
          window.app.closeProjectedPointsModal();
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

    unique_entry_ids = set()
    for l_obj in multi_data.get("leagues", {}).values():
        for t in l_obj.get("teams", []):
            if t.get("entry_id"):
                unique_entry_ids.add(t.get("entry_id"))
    radar_unique_teams = len(unique_entry_ids) or 135
    radar_total_leagues = len(multi_data.get("leagues", {})) or 7
    radar_banner_text = f"{radar_total_leagues} ลีก • {radar_unique_teams} ทีม"

    html = html_template.replace('__LAST_SYNC__', last_sync_str)
    html = html.replace('__RADAR_BANNER_TEXT__', radar_banner_text)
    html = html.replace('__MULTI_DATA_JSON__', multi_data_json_str)
    html = html.replace('__LEAGUES_CONFIG_JSON__', leagues_config_json_str)
    html = html.replace('__SHI62_SPECIAL_DATA_JSON__', shi62_data_json_str)
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

    # Performance Optimization: Deep-strip raw_picks and serialize JSON strings once
    pruned_data = {
        "last_sync": multi_data.get("last_sync"),
        "last_sync_iso": multi_data.get("last_sync_iso"),
        "sync_status": multi_data.get("sync_status"),
        "max_gw": multi_data.get("max_gw"),
        "league_order": list(leagues_config.keys()),
        "transfer_suggestions": multi_data.get("transfer_suggestions", {}),
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

    shi62_txt_path = os.path.join(base_dir, 'config', 'shi62_special.txt')
    shi62_special_data = parse_shi62_file(shi62_txt_path)
    shi62_special_json_str = json.dumps(shi62_special_data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\/')

    # 1. Generate root files
    root_html = generate_html(multi_data, leagues_config, default_league_id=None, precomputed_json_str=multi_data_json_str, precomputed_cfg_str=leagues_config_json_str, shi62_data_json_str=shi62_special_json_str)
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
        html_league = generate_html(multi_data, leagues_config, default_league_id=str(lid), precomputed_json_str=multi_data_json_str, precomputed_cfg_str=leagues_config_json_str, shi62_data_json_str=shi62_special_json_str)
        with open(os.path.join(dir_league, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(html_league)

    print("Successfully generated all HTML dashboard files on local!")

if __name__ == '__main__':
    main()
