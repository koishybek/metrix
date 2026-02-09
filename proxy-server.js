/**
 * Simple Node.js Proxy Server to bypass CORS
 * Usage: 
 * 1. Install dependencies: npm install express cors axios dotenv
 * 2. Run: node proxy-server.js
 * 3. Update frontend .env to point to http://localhost:3001
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const TARGET_API_URL = process.env.VITE_API_BASE_URL || 'https://sm.iot-exp.kz/api/v1/meter/';
const API_TOKEN = process.env.VITE_API_TOKEN || 'fc186709d0cf8bfa4bf5d8567c2456c3178abb51';

app.get('/api/meter/:serial', async (req, res) => {
  try {
    const { serial } = req.params;
    const response = await axios.get(`${TARGET_API_URL}${serial}`, {
      headers: {
        'Authorization': `Token ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
