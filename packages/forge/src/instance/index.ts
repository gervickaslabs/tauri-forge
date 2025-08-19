import type { ForgeInstance } from "@tauriforge/forge/instance/types";
import type { SanitizedConfig } from "@tauriforge/forge/config/types";
import type { BaseAdapter } from "@tauriforge/forge/adapters/types";
import { PluginManager } from "@tauriforge/forge/plugins";

import { AdapterRegistry } from "@tauriforge/forge/adapters/registry";

export class Forge implements ForgeInstance {
  private _config: SanitizedConfig;
  private _adapters: AdapterRegistry;
  private _plugins: PluginManager;
  private _initialized = false;
  private _destroyed = false;

  constructor(config: SanitizedConfig) {
    this._config = config;
    this._adapters = new AdapterRegistry();
    this._plugins = new PluginManager();
  }

  get config(): SanitizedConfig {
    return this._config;
  }

  get adapters(): AdapterRegistry {
    return this._adapters;
  }

  get plugins(): PluginManager {
    return this._plugins;
  }

  get isDestroyed(): boolean {
    return this._destroyed;
  }

  async initialize(): Promise<void> {
    if (this._initialized) {
      throw Error("already initialized");
    }

    if (this._destroyed) {
      throw new Error("Cannot initialize destroyed Forge instance");
    }

    try {
      this.adapters.register(this.config.adapters.command.factory);
      this.adapters.register(this.config.adapters.event.factory);

      await this.initializePlugins();
      await this.initializeAdapters();

      this._initialized = true;
    } catch {
      /**
       * ...
       */
    }
  }

  getAdapter<T extends BaseAdapter>(name: string): T | null {
    this.ensureInitialized();
    return this._adapters.getInstance<T>(name);
  }

  async healthCheck(): Promise<Record<string, boolean>> {
    this.ensureInitialized();

    return this._adapters.healthCheckAll();
  }

  hasAdapter(name: string): boolean {
    return (
      this._config.activeAdapters.includes(name) &&
      this._adapters.hasAdapter(name)
    );
  }

  async isHealthy(): Promise<boolean> {
    const healthResults = await this.healthCheck();
    return Object.values(healthResults).every((healthy) => healthy);
  }

  async destroy(): Promise<void> {
    if (this._destroyed) {
      return;
    }

    try {
      // Destroy adapters
      await this._adapters.destroyAll();

      this._destroyed = true;
      this._initialized = false;
    } catch (error) {
      console.error("Error during Forge destruction:", error);
      throw error;
    }
  }

  private ensureInitialized(): void {
    if (!this._initialized) {
      throw new Error(
        "Forge instance not initialized. Call initialize() first."
      );
    }
    if (this._destroyed) {
      throw new Error("Forge instance has been destroyed.");
    }
  }

  private async initializeAdapters(): Promise<void> {
    const initPromises = this._config.activeAdapters.map(
      async (adapterName) => {
        try {
          /** todo */
        } catch {
          throw new Error(`Failed to initialize adapter '${adapterName}'`);
        }
      }
    );

    await Promise.all(initPromises);
  }

  private async initializePlugins(): Promise<void> {
    // Register plugins from config
    for (const pluginConfig of this._config.plugins) {
      if (pluginConfig.enabled) {
        /// todo
      }
    }

    await this._plugins.initializeAll(this, this._config);
  }
}
