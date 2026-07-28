const url = require('url');


// Полная база из 50 элитных User-Agent'ов (Июнь 2026)
const USER_AGENTS = [
  // --- WINDOWS ---
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.217 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.217 Safari/537.36 Edg/148.0.7778.217',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.217 Safari/537.36 Edg/149.0.4022.52',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.217 Safari/537.36 OPR/112.0.5196.0',
  'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.217 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7623.150 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7623.150 Safari/537.36 Edg/147.0.3230.85',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.7580.95 Safari/537.36 Brave/1.68.141',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.7580.95 Safari/537.36 Vivaldi/6.8.3447.54',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0',

  // --- MACOS ---
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.217 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:140.0) Gecko/20100101 Firefox/140.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.217 Safari/537.36 Edg/148.0.7778.217',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) Gecko/20100101 Firefox/128.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7623.150 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:135.0) Gecko/20100101 Firefox/135.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.7580.95 Safari/537.36 Brave/1.68.141',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.7580.95 Safari/537.36 OPR/112.0.5196.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',

  // --- LINUX ---
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.217 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0',
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.217 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7623.150 Safari/537.36',
  'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0',

  // --- ANDROID ---
  'Mozilla/5.0 (Linux; Android 16) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.217 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 16; SM-S926B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.217 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 16; Pixel 9 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.217 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 16; SM-A556B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.217 Mobile Safari/537.36',
  'Mozilla/5.0 (Android 16; Mobile; rv:151.0) Gecko/151.0 Firefox/151.0',
  'Mozilla/5.0 (Android 16; Mobile; rv:140.0) Gecko/140.0 Firefox/140.0',
  'Mozilla/5.0 (Linux; Android 16; SM-S938B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.217 Mobile Safari/537.36 SamsungBrowser/25.0',
  'Mozilla/5.0 (Linux; Android 16; SM-S926B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.217 Mobile Safari/537.36 OPR/112.0.5196.0',
  'Mozilla/5.0 (Linux; Android 15; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7623.150 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 15; Redmi Note 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.7580.95 Mobile Safari/537.36',

  // --- IOS / IPADOS ---
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/148.0.7778.217 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/148.0.7778.217 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/128.0 Mobile/15E148 Safari/605.1.15',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) EdgiOS/148.0.7778.217 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
];

const LANGUAGES = [
  'en-US,en;q=0.9',
  'en-GB,en;q=0.9,en-US;q=0.8',
  'es-ES,es;q=0.9,en;q=0.8',
  'es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7',
  'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
  'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
  'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
  'zh-CN,zh;q=0.9,en;q=0.8',
  'ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7',
  'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
  'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
  'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
  'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
];

const WORKING_DONOR = { origin: 'https://y2down.cc', referer: 'https://y2down.cc/' };
const API_KEY = 'dfcb6d76f2f6a9894gjkege8a4ab232222';
const AGENT_SECRET_KEY = '1234567';

function getIdentity(seedString) {
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
      hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return {
      userAgent: USER_AGENTS[hash % USER_AGENTS.length],
      acceptLanguage: LANGUAGES[hash % LANGUAGES.length],
      donor: WORKING_DONOR
  };
}

module.exports = async function handler(req, res) {
  // Функция отправки ответа с жестким запретом на кэширование
  const sendJson = (status, data) => {
    try {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.statusCode = status;
      res.end(JSON.stringify(data));
    } catch (e) {}
  };

  try {
    const requestKey = req.headers['x-agent-key'];
    if (requestKey !== AGENT_SECRET_KEY) {
      return sendJson(403, { success: false, message: 'Forbidden' });
    }

    const query = url.parse(req.url || '', true).query || {};
    const { id, format, progress_url } = query;
    
    const identity = getIdentity(id || progress_url || 'unknown');

    const fetchHeaders = {
      'User-Agent': identity.userAgent,
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': identity.acceptLanguage,
      'Origin': identity.donor.origin,
      'Referer': identity.donor.referer,
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site'
    };

    const fetchSafeJson = async (targetUrl) => {
      const resp = await fetch(targetUrl, { headers: fetchHeaders });
      const text = await resp.text();
      try {
        return { ok: true, json: JSON.parse(text) };
      } catch (err) {
        return { ok: false, raw: text.substring(0, 200) };
      }
    };

    if (progress_url) {
      const result = await fetchSafeJson(progress_url);
      if (!result.ok) {
        return sendJson(200, { success: false, status: 'error', message: 'Donor blocked request' });
      }

      const data = result.json;
      const statusText = data?.text?.toLowerCase() || '';

      if (data?.download_url && data.download_url !== "") {
        return sendJson(200, { success: true, status: 'finished', download_url: data.download_url });
      } else if (statusText === 'error' || (data?.success === 1 && !data?.download_url)) {
        return sendJson(200, { success: false, status: 'error', message: 'Donor Error' });
      }
      return sendJson(200, { success: true, status: 'processing', progress: data?.progress || 0 });
    }

    if (!id || !format) {
      return sendJson(200, { status: 'alive' });
    }

    const youtubeUrl = `https://www.youtube.com/watch?v=${id}`;
    const apiUrl = `https://p.savenow.to/api/v2/download?format=${format}&url=${encodeURIComponent(youtubeUrl)}&apikey=${API_KEY}`;

    const result = await fetchSafeJson(apiUrl);
    if (!result.ok) {
      return sendJson(200, { success: false, message: 'Init blocked by donor' });
    }

    const data = result.json;
    if (!data || !data.success || !data.id || !data.progress_url) {
      return sendJson(200, { success: false, message: 'Init Error', details: data });
    }

    return sendJson(200, { success: true, status: 'started', progress_url: data.progress_url });

  } catch (error) {
    return sendJson(500, { success: false, message: 'Exception: ' + error.message });
  }
};
