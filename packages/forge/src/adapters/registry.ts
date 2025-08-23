import type {
  BaseAdapterFactory,
  BaseAdapter,
} from "@tauriforge/forge/adapters/types";

export class AdapterRegistry {
  private factories = new Map<string, BaseAdapterFactory<BaseAdapter>>();

  private instances = new Map<string, BaseAdapter>();

  register<TAdapter extends BaseAdapter>(
    factory: BaseAdapterFactory<TAdapter>,
  ): void {
    if (this.factories.has(factory.name)) {
      throw new Error(
        `Adapter factory '${factory.name}' is already registered`,
      );
    }

    this.factories.set(factory.name, factory);
  }

  async resolve<TAdapter extends BaseAdapter>(name: string): Promise<TAdapter> {
    if (this.instances.has(name)) {
      return this.instances.get(name) as TAdapter;
    }

    const factory = this.factories.get(name);

    if (!factory) {
      throw new Error(`No adapter factory registered for '${name}'`);
    }

    const adapter = await factory.create();

    await adapter.initialize();

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
}
