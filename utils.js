// utils.js

// Fungsi delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fungsi untuk mendapatkan delay acak antara min dan max
const getRandomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

module.exports = { delay, getRandomDelay };