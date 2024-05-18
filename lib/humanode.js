import { sendTelegramMessage } from "./telegram.js";
import { config } from "../config/config.js";

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
    const status = data.result ? 'active' : 'inactive'
    return { status, active: data.result.Active };
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
  if (difference > 25 && difference < 31) {
    sendTelegramMessage(`🟡Your Humanode ${config.validatorName} will be deactivated in 30 minutes, please prepare for re-authentication ${config.telegramUserTag} please make verification in ${config.bioAuthVerificationUrl}`);
  } else if (difference > 0 && difference < 6) {
    sendTelegramMessage(`Your Humanode ${config.validatorName} will be deactivated in 5 minutes, please prepare for re-authentication ${config.telegramUserTag} please make verification in ${config.bioAuthVerificationUrl}`);
  } else {
    console.log(`You Humanode ${config.validatorName} still have ${parseInt(difference / 60)} hours ${parseInt(difference / 60) % 60} munites left to be deactivated`)
  }
};

export const checkHumanodeStatus = async () => {
  try {
    const { status, active } = await getBioauthStatus();
    if (status === 'inactive') {
      sendTelegramMessage(`Your Humanode ${config.validatorName} is not active, please proceed to do re-authentication ${config.telegramUserTag} please make verification in ${config.bioAuthVerificationUrl}`);
    } else if (status === 'active') {
      const currentTimestamp = Date.now();
      const expiresAt = active.expires_at;
      const difference = (expiresAt - currentTimestamp) / (60 * 1000);
      sendExpiryWarning(difference);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
