const express = require('express');
const path = require('path');
const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Robust API Key loading
let apiKey = '';
let kakaoMapKey = '';

// 1. Try to load using custom parsing to handle duplicate Key entries under section headers
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split(/\r?\n/).map(line => line.trim());
    let currentSection = '';
    
    for (const line of lines) {
      if (!line) continue;
      // If the line is a section header (does not contain '=')
      if (!line.includes('=')) {
        currentSection = line.toUpperCase();
        continue;
      }
      
      const parts = line.split('=');
      if (parts.length > 1) {
        const keyName = parts[0].trim().toLowerCase();
        const val = parts[1].trim().replace(/^["']|["']$/g, ''); // strip quotes
        
        if (currentSection === 'APT' && keyName.includes('key')) {
          apiKey = val;
        } else if (currentSection === 'KAKAO') {
          // Prefer JS key for client-side Kakao Map loading
          if (keyName.includes('js') && keyName.includes('key')) {
            kakaoMapKey = val;
          } else if (keyName.includes('key') && !kakaoMapKey) {
            kakaoMapKey = val;
          }
        }
      }
    }
  } catch (err) {
    console.error('Error reading .env file manually:', err);
  }
}

// 2. Fallback to process.env if manual parser fails
if (!apiKey) {
  require('dotenv').config();
  apiKey = process.env.Key || process.env.KEY || process.env.APT_KEY || '';
  kakaoMapKey = kakaoMapKey || process.env.KAKAO_KEY || '';
}

console.log('MOLIT API Key loaded successfully:', apiKey ? 'Loaded (Length: ' + apiKey.length + ')' : 'Not Found');
console.log('Kakao Map API Key loaded successfully:', kakaoMapKey ? 'Loaded (Length: ' + kakaoMapKey.length + ')' : 'Not Found');

// API Endpoint to fetch apartment transaction data
app.get('/api/transactions', async (req, res) => {
  const { lawdCd, dealYmd } = req.query;

  if (!lawdCd || !dealYmd) {
    return res.status(400).json({ error: 'Missing required parameters: lawdCd, dealYmd' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured in .env' });
  }

  // MOLIT Apartment Transaction Price Open API URL
  const apiUrl = 'http://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade';
  
  // Construct parameters
  const params = new URLSearchParams({
    serviceKey: apiKey,
    pageNo: '1',
    numOfRows: '1000', // Retrieve up to 1000 items to get all transactions in that month
    LAWD_CD: lawdCd,
    DEAL_YMD: dealYmd
  });

  const fullUrl = `${apiUrl}?${params.toString()}`;
  console.log(`[API Call] Fetching data for region:${lawdCd}, month:${dealYmd}`);

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlData = await response.text();

    // Parse XML to JSON
    const parser = new XMLParser({
      ignoreAttributes: true,
      parseTagValue: true,
      trimValues: true
    });
    
    const jsonObj = parser.parse(xmlData);

    // Validate MOLIT API response format
    const root = jsonObj.response;
    if (!root) {
      console.error('[API Error] Unexpected XML response:', xmlData.substring(0, 500));
      return res.status(500).json({ error: 'Invalid response format from government API' });
    }

    const header = root.header;
    if (header && header.resultCode !== '000' && header.resultCode !== 0) {
      console.error('[API Error] Government API returned error:', header.resultMsg);
      return res.status(500).json({ error: header.resultMsg || 'Government API Error' });
    }

    const body = root.body;
    if (!body || !body.items) {
      return res.json([]);
    }

    let items = body.items.item || [];
    // If there is only one transaction, fast-xml-parser parses it as a single object, not an array
    if (items && !Array.isArray(items)) {
      items = [items];
    }

    console.log(`[API Success] Found ${items.length} transactions for region:${lawdCd}, month:${dealYmd}`);
    res.json(items);

  } catch (error) {
    console.error('[API Fetch Error]:', error);
    res.status(500).json({ error: 'Failed to fetch apartment data: ' + error.message });
  }
});

// API Endpoint to serve Kakao Map API Key
app.get('/api/map-key', (req, res) => {
  if (!kakaoMapKey) {
    return res.status(500).json({ error: 'Kakao Map API key not configured in .env' });
  }
  res.json({ kakaoKey: kakaoMapKey });
});

// Run server locally if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  Apartment Actual Transaction Dashboard Server      `);
    console.log(`  Running on http://localhost:${PORT}                `);
    console.log(`====================================================`);
  });
}

module.exports = app;
