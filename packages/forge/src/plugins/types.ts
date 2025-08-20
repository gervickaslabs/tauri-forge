import type { BaseAdapter } from "@tauriforge/forge/adapters/types";
import type { ForgeInstance } from "@tauriforge/forge/instance/types";

export interface PluginConfig {
  name: string;
  config?: Record<string, unknown>;
  enabled?: boolean;
  priority?: number;
}

export interface SanitizedPluginConfig extends Required<PluginConfig> {
  name: string;
}

export interface Plugin<TConfig = Record<string, unknown>> {
  name: string;

  version: string;

  dependencies?: string[];

  initialize(forge: ForgeInstance, config: TConfig): Promise<void>;

  destroy?(): Promise<void>;

  beforeAdapterInit?(adapterName: string, config: unknown): Promise<void>;

  afterAdapterInit?(adapterName: string, adapter: BaseAdapter): Promise<void>;
}
