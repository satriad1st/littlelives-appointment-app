import axios from 'axios';

async function alert(message: string): Promise<void> {
  if (!process.env.DISCORD_LOG) {
    return;
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK;
  if (!webhookUrl) {
    console.error('No webhook url configured.');
    return;
  }

  try {
    await axios.post(webhookUrl, {
      content: message,
      username: process.env.DISCORD_SERVICE,
    });
  } catch (err) {
    console.error(err, `Failed to send to discord`);
  }
}

export default { alert };
