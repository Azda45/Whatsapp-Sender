// server.js
const express = require('express');
const { connectToWhatsApp } = require('./Connection');
const { sendMessage } = require('./Sender');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000; // Use PORT from env or default to 3000

// Middleware untuk parsing input JSON
app.use(express.json());

// Endpoint API untuk mengirim pesan
app.post('/api/send', async (req, res) => {
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
