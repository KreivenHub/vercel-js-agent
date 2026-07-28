<?php if($show_vid_embed): ?>
                <div class="embed-responsive embed-responsive-16by9">
                    <iframe 
  src="https://www.youtube.com/embed/<?php echo htmlspecialchars($video_data['videoId']); ?>?rel=0&modestbranding=1" 
  frameborder="0" 
  allowfullscreen
  width="560" 
  height="315"
  referrerpolicy="strict-origin-when-cross-origin">
</iframe></div>
                <br>
            <?php endif; ?>

const LANGUAGES = ['en-US,en;q=0.9', 'es-ES,es;q=0.9,en;q=0.8', 'fr-FR,fr;q=0.9', 'de-DE,de;q=0.9'];
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

// ИСПРАВЛЕНО: Стандартный экспорт CommonJS для Vercel Node.js
module.exports = async function handler(req, res) {
  const requestKey = req.headers['x-agent-key'];
  if (requestKey !== AGENT_SECRET_KEY) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const { id, format, progress_url } = req.query;
  const identity = getIdentity(id || progress_url || 'unknown');

  const headers = {
    'User-Agent': identity.userAgent,
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': identity.acceptLanguage,
    'Origin': identity.donor.origin,
    'Referer': identity.donor.referer,
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'cross-site'
  };

  try {
    if (progress_url) {
      const response = await fetch(progress_url, { headers });
      const data = await response.json();
      const statusText = data?.text?.toLowerCase() || '';

      if (data?.download_url && data.download_url !== "") {
        return res.status(200).json({ success: true, status: 'finished', download_url: data.download_url });
      } else if (statusText === 'error' || (data?.success === 1 && !data?.download_url)) {
        return res.status(200).json({ success: false, status: 'error', message: 'Donor Error' });
      }
      return res.status(200).json({ success: true, status: 'processing', progress: data?.progress || 0 });
    }

    if (!id || !format) {
      return res.status(200).json({ status: 'alive' });
    }

    const youtubeUrl = `https://www.youtube.com/watch?v=${id}`;
    const apiUrl = `https://p.savenow.to/api/v2/download?format=${format}&url=${encodeURIComponent(youtubeUrl)}&apikey=${API_KEY}`;

    const response = await fetch(apiUrl, { headers });
    const data = await response.json();

    if (!data || !data.success || !data.id || !data.progress_url) {
      return res.status(200).json({ success: false, message: 'Init Error', details: data });
    }

    return res.status(200).json({ success: true, status: 'started', progress_url: data.progress_url });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
