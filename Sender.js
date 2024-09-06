// Sender.js
const { getSock } = require('./Connection');
const { delay, getRandomDelay } = require('./utils');

// Fungsi untuk mengirim pesan
async function sendMessage(number, message) {
    const sock = getSock();
    if (!sock || !sock.user) {
        throw new Error('WhatsApp belum terhubung. Coba lagi nanti.');
    }

    const jid = `${number}@s.whatsapp.net`;

    await sock.presenceSubscribe(jid);
    await sock.sendPresenceUpdate('composing', jid);

    const typingDelay = getRandomDelay(5 * 1000, 15 * 1000);
    await delay(typingDelay);
    await sock.sendPresenceUpdate('paused', jid);

    const sendDelay = getRandomDelay(10 * 1000, 30 * 1000);
    await delay(sendDelay);
    await sock.sendMessage(jid, { text: message });

    const postSendDelay = getRandomDelay(10 * 1000, 25 * 1000);
    console.log(`Pesan berhasil dikirim ke ${jid}. Menunggu ${postSendDelay / 1 * 1000} detik sebelum dapat mengirim lagi.`);

    return {
        message: `Pesan berhasil dikirim ke ${number}.`,
        cooldown: postSendDelay / 1 * 1000,
    };
}

module.exports = { sendMessage };