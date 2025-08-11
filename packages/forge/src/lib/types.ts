import type { BaseStrongholdAdapter } from "@repo/forge/lib/storage/types";

import type {
  BaseCommandAdapter,
  BaseEventAdapter,
} from "@repo/forge/lib/api/types";

export interface ForgeConfig {
  storage?: {
    stronghold?: {
      enabled?: boolean;
    };
  };
  api?: {
    command?: {
      enabled?: boolean;
    };
    event?: {
      enabled?: boolean;
    };
  };
}

export interface SanitizedConfig {
  storage: {
    stronghold: {
      enabled: boolean;
    };
  };
  api: {
    command: {
      enabled: boolean;
    };
    event: {
      enabled: boolean;
    };
  };
}

export interface InitOptions {
  config: SanitizedConfig;
}

export interface BaseForge {
  config: SanitizedConfig;
  storage: {
    stronghold: BaseStrongholdAdapter | null;
  };
  api: {
    command: BaseCommandAdapter | null;
    event: BaseEventAdapter | null;
  };
}
