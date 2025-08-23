export interface BaseLogggerFactory<TLogger extends BaseLogger> {
  create(): TLogger;
}

export interface BaseLogger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}
