const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');
const Aria2 = require('aria2');

const app = express();
const port = process.env.PORT || 3001;

// Telegram Bot Token
const token = "7386982670:AAE82tjBCYBOEP1jVK2UU-2lwRhPiPKrvAw";
const bot = new TelegramBot(token, { polling: true });

// Aria2 Configuration
const aria2 = new Aria2({
  host: 'localhost',
  port: 6800,
  secure: false,
  secret: '',
  path: '/jsonrpc'
});

aria2.open().then(() => console.log('Aria2 connection opened')).catch(err => {
  console.error('Failed to open Aria2 connection:', err);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text.startsWith('magnet:')) {
    aria2.call('addUri', [[text]])
      .then(response => {
        bot.sendMessage(chatId, 'Download started: ' + text);
      })
      .catch(err => {
        console.error('Error handling magnet link:', err);
        bot.sendMessage(chatId, 'Failed to start download: ' + err.message);
      });
  } else {
    bot.sendMessage(chatId, 'Send me a magnet link to start the download.');
  }
});

app.listen(port, () => {
  console.log(`Telegram bot listening at http://localhost:${port}`);
});
