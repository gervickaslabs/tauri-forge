import type {
  BaseAdapterConfig,
  AdapterFactory,
  BaseAdapter,
} from "@tauriforge/forge/adapters/types";

export class AdapterRegistry {
  private factories = new Map<string, AdapterFactory<BaseAdapter, unknown>>();
  private instances = new Map<string, BaseAdapter>();

  register<TAdapter extends BaseAdapter, TConfig = unknown>(
    factory: AdapterFactory<TAdapter, TConfig>,
  ): void {
    if (this.factories.has(factory.name)) {
      throw new Error(
        `Adapter factory '${factory.name}' is already registered`,
      );
    }

    this.factories.set(factory.name, factory);
  }

  async resolve<TAdapter extends BaseAdapter, C extends BaseAdapterConfig>(
    name: string,
    config: C,
  ): Promise<TAdapter> {
    if (this.instances.has(name)) {
      return this.instances.get(name) as TAdapter;
    }

    const factory = this.factories.get(name);

    if (!factory) {
      throw new Error(`No adapter factory registered for '${name}'`);
    }

    if (factory.validateConfig && !factory.validateConfig(config)) {
      throw new Error(`Invalid configuration for adapter '${name}'`);
    }

    const adapter = await factory.create(config);
    await adapter.initialize(config);

    this.instances.set(name, adapter);

    return adapter as TAdapter;
  }

  getInstance<TAdapter extends BaseAdapter>(name: string): TAdapter | null {
    return (this.instances.get(name) as TAdapter) || null;
  }

  hasAdapter(name: string): boolean {
    return this.factories.has(name);
  }

  getAvailableAdapters(): string[] {
    return Array.from(this.factories.keys());
  }

  async destroyAll(): Promise<void> {
    const destroyPromises = Array.from(this.instances.values()).map((adapter) =>
      adapter.destroy().catch((error) => {
        console.error(`Error destroying adapter '${adapter.name}':`, error);
      }),
    );

    await Promise.all(destroyPromises);

    this.instances.clear();
  }

  async healthCheckAll(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const [name, adapter] of this.instances) {
      try {
        results[name] = await adapter.healthCheck();
      } catch (error) {
        console.error(`Health check failed for adapter '${name}':`, error);
        results[name] = false;
      }
    }

    return results;
  }
}
