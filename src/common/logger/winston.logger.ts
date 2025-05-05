import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const winstonLogger = winston.createLogger({
  level: 'info',
  format: combine(colorize(), timestamp(), customFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'application.log' }),
  ],
});

export class WinstonLogger implements LoggerService {
  log(message: string) {
    winstonLogger.info(message);
  }

  error(message: string, trace?: string) {
    winstonLogger.error(`${message} - Trace: ${trace}`);
  }

  warn(message: string) {
    winstonLogger.warn(message);
  }

  debug(message: string) {
    winstonLogger.debug(message);
  }

  verbose(message: string) {
    winstonLogger.verbose(message);
  }
}

export const logger = new WinstonLogger();