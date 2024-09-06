const fs = require('fs');
const { delay } = require('./utils');
const dotenv = require('dotenv');
dotenv.config();

const PREFIX = process.env.PREFIX || '!';
const commands = JSON.parse(fs.readFileSync('./commands.json', 'utf-8'));

async function handleIncomingMessage(m, sock) {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const messageContent = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    const remoteJid = msg.key.remoteJid;

    let commandObj = commands.find(cmd =>
        cmd.commands.some(command => messageContent.toLowerCase() === command.toLowerCase())
    );

    if (!commandObj && messageContent.startsWith(PREFIX)) {
        const commandWithoutPrefix = messageContent.slice(PREFIX.length).trim();
        commandObj = commands.find(cmd =>
            cmd.commands.some(command => commandWithoutPrefix.toLowerCase() === command.toLowerCase())
        );
    }

    if (commandObj) {
        await sock.presenceSubscribe(remoteJid);
        await delay(1000); // Delay sebelum mengetik
        await sock.sendPresenceUpdate('composing', remoteJid);
        await delay(commandObj.typingDelay); // Delay saat mengetik
        await sock.sendPresenceUpdate('paused', remoteJid);
        await delay(commandObj.sendDelay); // Delay sebelum pesan terkirim

        // Mengirim pesan berdasarkan tipe
        if (commandObj.type === 'text') {
            await sock.sendMessage(remoteJid, { text: commandObj.response });
        } else if (commandObj.type === 'image' && commandObj.media) {
            await sock.sendMessage(remoteJid, {
                image: { url: commandObj.media }, // Mengirim gambar dari path yang ditentukan
                caption: commandObj.response || '', // Mengirim caption jika tersedia
            });
        }
    } else {
        const helpMessage = commands
            .map(cmd => `*${cmd.commands.join(', ')}*: ${cmd.description}`)
            .join('\n');

        await sock.presenceSubscribe(remoteJid);
        await delay(1000); // Delay sebelum mengetik
        await sock.sendPresenceUpdate('composing', remoteJid);
        await delay(3000); // Delay saat mengetik
        await sock.sendPresenceUpdate('paused', remoteJid);
        await delay(1000); // Delay sebelum pesan terkirim

        await sock.sendMessage(remoteJid, {
            text: `Gunakan prefix '${PREFIX}'. \n\n Daftar Perintah:\n\n${helpMessage}`
        });
    }
}

module.exports = { handleIncomingMessage };
