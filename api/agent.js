const axios = require('axios');


module.exports = async (req, res) => {

    if (!req.query.id && !req.query.format) {
        return res.status(200).json({ status: 'alive', timestamp: Date.now() });
    }

   
    const AGENT_SECRET_KEY = process.env.AGENT_SECRET_KEY || '1234567';
    const requestKey = req.headers['x-agent-key'];
    if (requestKey !== AGENT_SECRET_KEY) {
        return res.status(403).json({ success: false, message: 'Forbidden: Invalid Agent Key' });
    }

    const { id: videoId, format: requestedFormat } = req.query;
    if (!videoId || !requestedFormat) {
        return res.status(400).json({ success: false, message: 'Error: Missing video ID or format.' });
    }

    try {
      
        const result = await handle_mp3youtube_cc(videoId, requestedFormat);
        res.status(200).json(result);
    } catch (error) {
        console.error("Agent Error:", error.message);
        res.status(500).json({ success: false, message: `Agent Error: ${error.message}` });
    }
};


async function handle_mp3youtube_cc(videoId, requestedFormat) {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const commonHeaders = {
        'Origin': 'https://iframe.y2meta-uk.com',
        'Referer': 'https://iframe.y2meta-uk.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    };

    try {
        
        const keyResponse = await axios.get('https://api.mp3youtube.cc/v2/sanity/key', {
            headers: commonHeaders,
            timeout: 10000 // 10 секунд
        });
        const apiKey = keyResponse.data?.key;
        if (!apiKey) {
            return { success: false, message: 'Donor Error (y2meta): Could not extract API key.' };
        }

        
        const converterUrl = 'https://api.mp3youtube.cc/v2/converter';
        const converterHeaders = { ...commonHeaders, 'Key': apiKey };
        
        let postData = {};
        if (requestedFormat === 'mp3') {
            postData = { link: youtubeUrl, format: 'mp3', audioBitrate: '320', filenameStyle: 'pretty' };
        } else if (requestedFormat === '720') {
            postData = { link: youtubeUrl, format: 'mp4', audioBitrate: '128', videoQuality: '720', filenameStyle: 'pretty', vCodec: 'h264' };
        } else {
            return { success: false, message: 'Unsupported format requested.' };
        }

        const convertResponse = await axios.post(converterUrl, new URLSearchParams(postData).toString(), {
            headers: { ...converterHeaders, 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 60000 
        });
        
        const resultData = convertResponse.data;

       
        if (resultData?.status === 'tunnel' && resultData?.url) {
            return { success: true, download_url: resultData.url };
        } else {
            return { success: false, message: 'Donor Error (y2meta): Failed to get final link.', details: resultData };
        }

    } catch (error) {
        
        console.error('Error in y2meta handler:', error.message);
        return { success: false, message: `Donor Error (y2meta): Request failed - ${error.message}` };
    }
}
