import type { SanitizedConfig } from "@tauriforge/forge/config";

import { AdapterRegistry } from "@tauriforge/forge/adapters";
import { BaseLogger } from "@tauriforge/forge/logger";

export interface ForgeInstance {
  config: SanitizedConfig;
  adapters: AdapterRegistry;
  initialize(config: SanitizedConfig): Promise<void>;
  logger: BaseLogger;
}
