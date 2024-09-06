// server.js
const express = require('express');
const cors = require('cors');
const { connectToWhatsApp } = require('./Connection');
const { sendMessage } = require('./Sender');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT;
const API_KEY = process.env.API_KEY; // Load API key from .env

// Middleware untuk parsing input JSON
app.use(express.json());

// Middleware untuk cek API Key
function checkApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key']; // Ambil API key dari header
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(403).json({ message: 'API Key tidak valid atau tidak disertakan.' });
  }
  next();
}

// Endpoint API untuk mengirim pesan dengan validasi API key
app.post('/api/send', checkApiKey, async (req, res) => {
  const { number, message } = req.body;
  try {
    const result = await sendMessage(number, message);
    res.json(result);
  } catch (error) {
    console.error('Gagal mengirim pesan:', error);
    res.status(500).json({ message: `Gagal mengirim pesan: ${error.message}` });
  }
});

// Mulai koneksi ke WhatsApp
connectToWhatsApp();

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan pada http://localhost:${port}`);
});
