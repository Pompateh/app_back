"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.WinstonLogger = void 0;
const winston = require("winston");
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
class WinstonLogger {
    log(message) {
        winstonLogger.info(message);
    }
    error(message, trace) {
        winstonLogger.error(`${message} - Trace: ${trace}`);
    }
    warn(message) {
        winstonLogger.warn(message);
    }
    debug(message) {
        winstonLogger.debug(message);
    }
    verbose(message) {
        winstonLogger.verbose(message);
    }
}
exports.WinstonLogger = WinstonLogger;
exports.logger = new WinstonLogger();
//# sourceMappingURL=winston.logger.js.map