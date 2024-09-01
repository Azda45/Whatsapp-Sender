// whatsappConnection.js
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const pino = require('pino');

const sessionName = 'kanjut';
let sock;

// Fungsi untuk menghubungkan ke WhatsApp
async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(`./${sessionName}`);

    try {
        sock = makeWASocket({
            auth: state,
            printQRInTerminal: true,
            logger: pino({ level: 'silent' }),
        });

        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect, qr } = update;
            if (qr) {
                console.log('Scan QR code berikut untuk menghubungkan ke WhatsApp:');
                qrcode.generate(qr, { small: false });
            }

            if (connection === 'close') {
                const shouldReconnect = new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log('Koneksi terputus karena', lastDisconnect?.error, ', menghubungkan kembali:', shouldReconnect);
                if (shouldReconnect) {
                    connectToWhatsApp();
                } else {
                    console.error('Koneksi gagal. Silakan cek koneksi internet atau coba lagi nanti.');
                }
            } else if (connection === 'open') {
                console.log('Koneksi berhasil dibuka.');
            }
        });

        sock.ev.on('creds.update', saveCreds);
    } catch (error) {
        console.error('Error connecting to WhatsApp:', error);
    }
}

module.exports = { connectToWhatsApp, getSock: () => sock };
