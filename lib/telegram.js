import { config } from '../config/config.js';

export const sendTelegramMessage = async (message) => {
  if (!message || message === 'NULL') {
    console.error('Invalid message content');
    return;
  }

  // Prepend the current date and time in Asia/Jakarta timezone
  const timeZone = 'Asia/Jakarta';
  const date = new Date().toLocaleString('en-US', { timeZone, hour12: false });
  const formattedDate = date.replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+):\d+/, '$3-$1-$2 $4');
  const fullMessage = `[${formattedDate}] ${message}`;

  try {
    const queryParams = new URLSearchParams({
      chat_id: config.telegramGroup,
      text: fullMessage,
      parse_mode: 'HTML'
    }).toString();
    const telegramBotUrl = `https://api.telegram.org/bot${config.telegramToken}/sendMessage?${queryParams}`;

    const options = {
      method: 'GET',
    };

    const response = await fetch(telegramBotUrl, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(`Message sent successfully: ${data.result.text}`);
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
  }
}

