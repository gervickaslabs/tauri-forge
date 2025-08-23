import type {
  BaseAdapterFactory,
  BaseCommandAdapter,
  BaseEventAdapter,
} from "@tauriforge/forge/adapters/types";

import type {
  GlobalConfig,
  SanitizedGlobalConfig,
} from "@tauriforge/forge/globals/types";

import type {
  BaseLogggerFactory,
  BaseLogger,
} from "@tauriforge/forge/logger/types";

export interface Config {
  adapters?: {
    command?: BaseAdapterFactory<BaseCommandAdapter>;
    event?: BaseAdapterFactory<BaseEventAdapter>;
  };

  logger?: BaseLogggerFactory<BaseLogger>;

  global?: GlobalConfig;
}

export interface SanitizedConfig {
  adapters: {
    command: BaseAdapterFactory<BaseCommandAdapter>;
    event: BaseAdapterFactory<BaseEventAdapter>;
  };

  logger: BaseLogggerFactory<BaseLogger>;

  global: SanitizedGlobalConfig;
}
