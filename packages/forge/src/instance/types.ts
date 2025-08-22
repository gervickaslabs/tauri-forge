import type { BaseAdapter } from "@tauriforge/forge/adapters";
import type { SanitizedConfig } from "@tauriforge/forge/config";
import { AdapterRegistry } from "@tauriforge/forge/adapters";

export interface ForgeInstance {
  config: SanitizedConfig;
  adapters: AdapterRegistry;
  getAdapter<T extends BaseAdapter>(name: string): T | null;
  isHealthy(): Promise<boolean>;
  destroy(): Promise<void>;
}
