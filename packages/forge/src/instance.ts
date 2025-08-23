import type { ForgeInstance } from "@tauriforge/forge/types";
import type { SanitizedConfig } from "@tauriforge/forge/config/types";

import { AdapterRegistry } from "@tauriforge/forge/adapters";
import type { BaseLogger } from "@tauriforge/forge/logger";

export class Forge implements ForgeInstance {
  private _config: SanitizedConfig;
  private _adapters: AdapterRegistry;
  private _logger: BaseLogger;
  private _initialized = false;

  constructor(config: SanitizedConfig) {
    this._config = config;
    this._adapters = new AdapterRegistry();
    this._logger = config.logger.create();
  }

  get initialized(): boolean {
    return this._initialized;
  }

  get config(): SanitizedConfig {
    return this._config;
  }

  get adapters(): AdapterRegistry {
    return this._adapters;
  }

  get logger(): BaseLogger {
    return this._logger;
  }

  async initialize(): Promise<void> {
    if (this._initialized) {
      throw Error("already initialized forge instance");
    }

    try {
      this.registerDefaultAdaptersFactory();
      this.logger.info("default adapters registered");

      await this.resolveDefaultAdapters();
      this.logger.info("default adapters resolved");

      this._initialized = true;
      this.logger.info("forge initialized");
    } catch (e) {
      console.log(e);
      throw new Error(`forge initialize failed`);
    }
  }

  private registerDefaultAdaptersFactory() {
    this.adapters.register(this.config.adapters.command);
    this.adapters.register(this.config.adapters.event);
  }

  private async resolveDefaultAdapters(): Promise<void> {
    await Promise.all([
      await this._adapters.resolve(this.config.adapters.command.name),
      await this._adapters.resolve(this.config.adapters.event.name),
    ]);
  }
}
