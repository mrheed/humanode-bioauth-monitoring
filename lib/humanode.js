import { sendTelegramMessage } from "./telegram.js";
import { config } from "../config/config.js";
import fs from 'fs'
import { getState, setState } from "../config/state.js";

const createRequestOptions = (body) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: body
});

const createPostData = () => JSON.stringify({
  jsonrpc: '2.0',
  method: 'bioauth_status',
  params: [],
  id: 1,
});

const handleResponse = async (response) => {
  const data = await response.json();
  if (data && data.result) {
    const status = typeof data.result === 'string' ? 'inactive' : 'active';
    return { status, active: data.result };
  }
  return { status: null, active: null };
};

export const getBioauthStatus = () => {
  const postData = createPostData();
  const options = createRequestOptions(postData);

  return new Promise((resolve, reject) => {
    fetch(config.bioauthStatusUrl, options)
      .then(response => handleResponse(response))
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

const sendExpiryWarning = (difference) => {
  let message;
  let emoji;

  if (difference <= 25) {
    emoji = '🔴'; // Red for urgency
  } else if (difference <= 40) {
    emoji = '🟡'; // Yellow as a warning
  } else if (difference <= 50) {
    emoji = '🟢'; // Green for less urgency
  } else {
    emoji = '🟢'; // Default to green if none of the above conditions are met
  }

  message = `${emoji}Your Humanode ${config.validatorName} still has ${parseInt(difference / 60)} hours ${parseInt(difference % 60)} minutes left to be deactivated ${config.telegramUserTag}`;

  if (config.alwaysSendToTelegram || difference <= 50) {
    sendTelegramMessage(`${message}, you can re-authenticate <a href="${getState('wsTunnelURL')}">here</a>`);
  } else {
    console.log(message);
  }
};

export const checkHumanodeStatus = async () => {
  try {
    const { status, active } = await getBioauthStatus();
    setState('wsTunnelURL', `${config.bioAuthVerificationUrl}/${readWsTunnelURL()}`)
    if (status === 'inactive') {
      sendTelegramMessage(`Your Humanode ${config.validatorName} is not active, please proceed to do re-authentication ${config.telegramUserTag} in <a href="${getState('wsTunnelURL')}">here</a>`);
    } else if (status === 'active') {
      const currentTimestamp = Date.now();
      const expiresAt = active.Active.expires_at;
      const difference = (expiresAt - currentTimestamp) / (60 * 1000);
      sendExpiryWarning(difference);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

export const readWsTunnelURL = () => {
  try {
    const logData = fs.readFileSync(`${config.humanodeDir}/tunnel/logs.txt`, 'utf8');
    const lastLine = logData.split('\n')
      .filter(line => line.includes('obtained tunnel URL'))
      .pop();
    const urlPart = lastLine.split('=')[1].trim().match(/wss:\/\/[\w-]+\.ws1\.htunnel\.app/g)[0]
    return encodeURIComponent(urlPart)
  } catch (error) {
    console.log(`Error: cant find ws tunnel url ${error.message}`)
  }
  return null
}

