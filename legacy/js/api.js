/**
 * FPL API Client with Multi-Tier CORS Proxy Fallback & Local Caching
 */

class FPLApiClient {
  constructor(config) {
    this.config = config || window.LEAGUE_CONFIG;
    this.currentProxyIndex = 0;
    this.cachePrefix = 'fpl_league_40700_';
    this.cacheTTL = 3 * 60 * 1000; // 3 minutes cache for live data
  }

  /**
   * สร้าง URL ผ่าน Proxy
   */
  getProxiedUrl(targetUrl, proxyIndex = this.currentProxyIndex) {
    const proxy = this.config.corsProxies[proxyIndex % this.config.corsProxies.length];
    return proxy.url(targetUrl);
  }

  /**
   * ดึงข้อมูลจาก Cache ใน LocalStorage
   */
  getFromCache(key) {
    try {
      const cached = localStorage.getItem(this.cachePrefix + key);
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < this.cacheTTL) {
        return parsed.data;
      }
      return null;
    } catch (e) {
      console.warn('Cache read error:', e);
      return null;
    }
  }

  /**
   * บันทึกข้อมูลลง Cache ใน LocalStorage
   */
  saveToCache(key, data) {
    try {
      localStorage.setItem(this.cachePrefix + key, JSON.stringify({
        timestamp: Date.now(),
        data: data
      }));
    } catch (e) {
      console.warn('Cache write error:', e);
    }
  }

  /**
   * Fetch with automatic proxy fallback & timeout
   */
  async fetchWithProxy(targetUrl, cacheKey = null, forceRefresh = false) {
    if (!forceRefresh && cacheKey) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        console.log(`[FPL API] Serving from cache: ${cacheKey}`);
        return { data: cached, isCached: true, isMock: false };
      }
    }

    const proxies = this.config.corsProxies;
    let lastError = null;

    for (let i = 0; i < proxies.length; i++) {
      const proxyIdx = (this.currentProxyIndex + i) % proxies.length;
      const proxy = proxies[proxyIdx];
      const url = proxy.url(targetUrl);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000); // 9 sec timeout

        const response = await fetch(url, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} from proxy ${proxy.name}`);
        }

        let data = await response.json();
        // บาง proxy เช่น AllOrigins get endpoint ห่อผลลัพธ์ใน contents
        if (data.contents && typeof data.contents === 'string') {
          try { data = JSON.parse(data.contents); } catch (e) {}
        }

        // หากสำเร็จ จำ proxy นี้ไว้เป็นตัวหลัก
        this.currentProxyIndex = proxyIdx;
        if (cacheKey) {
          this.saveToCache(cacheKey, data);
        }

        return { data, isCached: false, isMock: false, proxyName: proxy.name };
      } catch (err) {
        console.warn(`[FPL API] Proxy ${proxy.name} failed:`, err.message);
        lastError = err;
      }
    }

    // หาก Proxy ทั้งหมดไม่สำเร็จ ให้ดึงจาก Mock Data
    console.warn('[FPL API] All proxies failed. Falling back to Mock Standby Data.', lastError);
    return { data: null, isCached: false, isMock: true, error: lastError?.message };
  }

  /**
   * 1. ดึงข้อมูล League Standings ของลีก 40700
   */
  async getLeagueStandings(leagueId = this.config.leagueId, forceRefresh = false) {
    const url = `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/`;
    const res = await this.fetchWithProxy(url, `standings_${leagueId}`, forceRefresh);

    if (res.isMock || !res.data || !res.data.standings) {
      return {
        success: true,
        isMock: true,
        data: window.MOCK_LEAGUE_DATA
      };
    }

    return {
      success: true,
      isMock: false,
      isCached: res.isCached,
      data: res.data
    };
  }

  /**
   * 2. ดึงข้อมูล Bootstrap-static (ข้อมูล Gameweeks, นักเตะ และสถานะลีกโดยรวม)
   */
  async getBootstrapStatic(forceRefresh = false) {
    const url = `https://fantasy.premierleague.com/api/bootstrap-static/`;
    const res = await this.fetchWithProxy(url, 'bootstrap_static', forceRefresh);
    return res;
  }

  /**
   * 3. ดึงข้อมูล Team Picks ของแต่ละทีมในสัปดาห์นั้นๆ
   */
  async getTeamPicks(entryId, gameweek, forceRefresh = false) {
    const url = `https://fantasy.premierleague.com/api/entry/${entryId}/event/${gameweek}/picks/`;
    const res = await this.fetchWithProxy(url, `picks_${entryId}_gw${gameweek}`, forceRefresh);
    return res;
  }

  /**
   * 4. ดึงข้อมูลประวัติย้อนหลังของทีม (History & Chips)
   */
  async getTeamHistory(entryId, forceRefresh = false) {
    const url = `https://fantasy.premierleague.com/api/entry/${entryId}/history/`;
    const res = await this.fetchWithProxy(url, `history_${entryId}`, forceRefresh);
    return res;
  }
}

window.FPLApiClient = FPLApiClient;
