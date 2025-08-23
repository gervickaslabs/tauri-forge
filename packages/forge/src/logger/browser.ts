import type {
  BaseLogger,
  BaseLogggerFactory,
} from "@tauriforge/forge/logger/types";

export class BrowserLog implements BaseLogger {
  constructor() {}

  debug(...args: unknown[]): void {
    console.debug(...args);
  }

  info(...args: unknown[]): void {
    console.info(...args);
  }

  warn(...args: unknown[]): void {
    console.warn(...args);
  }

  error(...args: unknown[]): void {
    console.error(...args);
  }
}

export const LoggerFactory: BaseLogggerFactory<BrowserLog> = {
  create(): BrowserLog {
    return new BrowserLog();
  },
};
