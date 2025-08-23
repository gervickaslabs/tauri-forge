import type { ForgeInstance } from "@tauriforge/forge";
import type { SanitizedConfig } from "@tauriforge/forge/config";
import type { BaseLogger } from "@tauriforge/forge/logger";

import { AdapterRegistry } from "@tauriforge/forge/adapters";

export class Forge implements ForgeInstance {
  private _config!: SanitizedConfig;
  private _adapters!: AdapterRegistry;
  private _logger!: BaseLogger;
  private _initialized = false;

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

  async initialize(config: SanitizedConfig): Promise<void> {
    if (this._initialized) {
      this._logger.warn("Forge already initialized");
      return;
    }

    if (!config) {
      throw new Error("Error: config is required to initialize Forge");
    }

    try {
      this._config = config;
      this._logger = this._config.logger.create();

      this._adapters = new AdapterRegistry();

      this.registerDefaultAdaptersFactory();

      await this.resolveDefaultAdapters();

      this._initialized = true;

      this.logger.info("Forge has been initialized");
    } catch (e) {
      this.logger.error(e);
      throw new Error("Error: Forge failed to initialize");
    }
  }

  private registerDefaultAdaptersFactory() {
    this.adapters.register(this.config.adapters.command);
    this.adapters.register(this.config.adapters.event);
  }

  private async resolveDefaultAdapters(): Promise<void> {
    await Promise.all([
      this._adapters.resolve(this.config.adapters.command.name),
      this._adapters.resolve(this.config.adapters.event.name),
    ]);
  }
}
