import type {
  CommandAdapterConfig,
  EventAdapterConfig,
  SanitizedCommandConfig,
  SanitizedEventConfig,
} from "@tauriforge/forge/adapters/types";

import type {
  GlobalConfig,
  SanitizedGlobalConfig,
} from "@tauriforge/forge/globals/types";

import type {
  PluginConfig,
  SanitizedPluginConfig,
} from "@tauriforge/forge/plugins/types";

export interface Config {
  adapters?: {
    command?: CommandAdapterConfig | false;
    event?: EventAdapterConfig | false;
  };

  global?: GlobalConfig;
  plugins?: PluginConfig[];
}

export interface SanitizedConfig {
  adapters: {
    command: SanitizedCommandConfig;
    event: SanitizedEventConfig;
  };

  global: SanitizedGlobalConfig;
  plugins: SanitizedPluginConfig[];

  readonly activeAdapters: string[];
}
