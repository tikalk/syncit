import { createLogger, format, transports, transport } from 'winston';
import * as LogzioWinstonTransport from 'winston-logzio';

export const loggerCreator = (serviceName: string) => {
  const { LOGGER_TOKEN, NODE_ENV } = process.env;
  const loggerTransports = [
    new LogzioWinstonTransport({
      level: 'error',
      name: 'winston_logzio',
      token: LOGGER_TOKEN || 'mXaxYCXFkvovGmcEozeLlGERuuGosZTQ',
      host: 'listener.logz.io',
      extraFields: { serviceName },
    }) as transport,
  ];
  const isDevEnv = NODE_ENV === 'development';

  if (isDevEnv) {
    loggerTransports.push(
      new transports.Console({
        level: 'silly',
        format: format.combine(
          format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          format.colorize(),
          format.simple(),
          format.printf(
            ({ timestamp, level, message }) =>
              `${timestamp} [${level}] - ${message}`
          )
        ),
      })
    );
  }

  const logger = createLogger({ transports: loggerTransports });

  return {
    silly: (message: string, module?: string) =>
      logger.silly(message, { module }),
    debug: (message: string, module?: string) =>
      logger.debug(message, { module }),
    log: (message: string, module?: string) => logger.info(message, { module }),
    info: (message: string, module?: string) =>
      logger.info(message, { module }),
    warn: (message: string, module?: string) =>
      logger.warn(message, { module }),
    error: (message: string, module?: string) =>
      logger.error(message, { module }),
  };
};

export default loggerCreator;
