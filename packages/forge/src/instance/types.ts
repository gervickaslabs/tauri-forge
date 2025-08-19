import type { BaseAdapter } from "@tauriforge/forge/adapters/types";
import type { SanitizedConfig } from "@tauriforge/forge/config/types";

import { AdapterRegistry } from "@tauriforge/forge/adapters/registry";

export interface ForgeInstance {
  config: SanitizedConfig;
  adapters: AdapterRegistry;
  getAdapter<T extends BaseAdapter>(name: string): T | null;
  isHealthy(): Promise<boolean>;
  destroy(): Promise<void>;
}
