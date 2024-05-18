export const config = {
  telegramToken: process.env.TG_TOKEN || '', // Default to empty string if environment variable is not set
  telegramGroup: process.env.TG_GROUP || '', // Default to empty string if environment variable is not set
  telegramUserTag: process.env.TG_USER_TAG || '', // Default to empty string if environment variable is not set
  bioauthStatusUrl: process.env.BIO_AUTH_URL || 'http://127.0.0.1:9933', // Default to local URL if environment variable is not set,
  validatorName: process.env.VALIDATOR_NAME || ''
}
