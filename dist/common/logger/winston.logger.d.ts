import { LoggerService } from '@nestjs/common';
export declare class WinstonLogger implements LoggerService {
    log(message: string): void;
    error(message: string, trace?: string): void;
    warn(message: string): void;
    debug(message: string): void;
    verbose(message: string): void;
}
export declare const logger: WinstonLogger;
