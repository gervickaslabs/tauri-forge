import type { BaseStrongholdAdapter } from "./storage/types";

import type { BaseCommandAdapter, BaseEventAdapter } from "./api/types";

export interface ForgeConfig {
  stronghold?: {
    enabled?: boolean;
  };
  command?: {
    enabled?: boolean;
  };
  event?: {
    enabled?: boolean;
  };
}

export interface SanitizedConfig {
  stronghold: {
    enabled: boolean;
  };
  command: {
    enabled: boolean;
  };
  event: {
    enabled: boolean;
  };
}

export interface InitOptions {
  config: SanitizedConfig;
}

export interface BaseForge {
  config: SanitizedConfig;
  stronghold: BaseStrongholdAdapter | null;
  command: BaseCommandAdapter | null;
  event: BaseEventAdapter | null;
}
