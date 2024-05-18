import 'dotenv/config';
import { waitSeconds } from './lib/utils.js';
import { checkHumanodeStatus, getBioauthStatus } from './lib/humanode.js';

async function main() {
  try {
    await checkHumanodeStatus();
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

async function scheduleMain() {
  while (true) {
    await main();
    await waitSeconds(60); // 3 hours
  }
}

scheduleMain();
