import pino, { Logger } from 'pino';

import discord from '@be/modules/discord';

const prettyConsoleLogger: any = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'yyyy-mm-dd HH:MM:ss',
    },
  },
});

function log(level: keyof Logger, ...args: any[]): void {
  if (prettyConsoleLogger[level]) {
    prettyConsoleLogger[level](...args);
  }
}

function formatErrorMessage(args: any[]): string {
  return args
    .map((arg) => {
      if (arg instanceof Error) {
        return `Error: ${arg.message}\nStack: ${arg.stack}`;
      }
      if (typeof arg === 'object') {
        return JSON.stringify(arg, null, 2);
      }
      return arg;
    })
    .join(' ');
}

export const logger = {
  info: (...args: any[]): void => log('info', ...args),
  error: (...args: any[]): void => {
    discord.alert(`[ERROR] ${formatErrorMessage(args)}`);
    log('error', ...args);
  },
};
