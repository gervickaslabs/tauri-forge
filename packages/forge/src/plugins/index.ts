import type { Plugin } from "@tauriforge/forge/plugins/types";
import type { SanitizedConfig } from "@tauriforge/forge/config/types";
import type { ForgeInstance } from "@tauriforge/forge/instance/types";

export class PluginManager {
  private plugins = new Map<string, Plugin>();
  private loadOrder: string[] = [];

  register<TConfig = Record<string, unknown>>(plugin: Plugin<TConfig>): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin '${plugin.name}' is already registered`);
    }

    this.plugins.set(plugin.name, plugin as Plugin<Record<string, unknown>>);
  }

  async initializeAll(
    forge: ForgeInstance,
    config: SanitizedConfig
  ): Promise<void> {
    this.loadOrder = this.resolveDependencies();

    for (const pluginName of this.loadOrder) {
      const plugin = this.plugins.get(pluginName);
      if (!plugin) continue;

      const pluginConfig =
        config.plugins.find((p) => p.name === pluginName)?.config || {};

      try {
        await plugin.initialize(forge, pluginConfig);
      } catch (error) {
        console.error(`Failed to initialize plugin '${pluginName}':`, error);

        throw new Error(`Plugin initialization failed: ${pluginName}`);
      }
    }
  }

  async destroyAll(): Promise<void> {
    const reverseOrder = [...this.loadOrder].reverse();

    for (const pluginName of reverseOrder) {
      const plugin = this.plugins.get(pluginName);
      if (!plugin?.destroy) continue;

      try {
        await plugin.destroy();
      } catch (error) {
        console.error(`Error destroying plugin '${pluginName}':`, error);
      }
    }
  }

  async executeHook<
    K extends keyof Plugin,
    T extends Plugin[K] & ((...args: unknown[]) => Promise<void>),
  >(hookName: K, ...args: Parameters<NonNullable<T>>): Promise<void> {
    for (const pluginName of this.loadOrder) {
      const plugin = this.plugins.get(pluginName);

      const hook = plugin?.[hookName] as T;

      if (hook) {
        try {
          await hook.apply(plugin, args);
        } catch (error) {
          console.error(
            `Error in plugin hook '${hookName}' for plugin '${pluginName}':`,
            error
          );
        }
      }
    }
  }

  private resolveDependencies(): string[] {
    const visited = new Set<string>();

    const visiting = new Set<string>();

    const result: string[] = [];

    const visit = (pluginName: string) => {
      if (visiting.has(pluginName)) {
        throw new Error(
          `Circular dependency detected involving plugin '${pluginName}'`
        );
      }

      if (visited.has(pluginName)) {
        return;
      }

      const plugin = this.plugins.get(pluginName);
      if (!plugin) {
        throw new Error(`Plugin '${pluginName}' not found`);
      }

      visiting.add(pluginName);

      for (const dependency of plugin.dependencies || []) {
        if (!this.plugins.has(dependency)) {
          throw new Error(
            `Plugin '${pluginName}' depends on '${dependency}' which is not registered`
          );
        }

        visit(dependency);
      }

      visiting.delete(pluginName);
      visited.add(pluginName);
      result.push(pluginName);
    };

    // Visit all plugins
    for (const pluginName of this.plugins.keys()) {
      visit(pluginName);
    }

    return result;
  }
}
