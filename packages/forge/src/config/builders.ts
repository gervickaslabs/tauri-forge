import merge from "lodash/merge.js";

import type { Config, SanitizedConfig } from "@tauriforge/forge/config/types";

import { CommandAdapterFactory } from "@tauriforge/forge/adapters/command";

import { EventAdapterFactory } from "@tauriforge/forge/adapters/event";

import { LoggerFactory } from "@tauriforge/forge/logger";

import type { SanitizedGlobalConfig } from "@tauriforge/forge/globals/types";

export const DEFAULT_GLOBAL_CONFIG: SanitizedGlobalConfig = {
  debug: true,
};

export function buildConfig(customConfig?: Config): SanitizedConfig {
  const sanitized: SanitizedConfig = {
    adapters: {
      command: customConfig?.adapters?.command || CommandAdapterFactory,
      event: customConfig?.adapters?.event || EventAdapterFactory,
    },

    logger: customConfig?.logger || LoggerFactory,

    global: merge(DEFAULT_GLOBAL_CONFIG, customConfig?.global),
  };

  return sanitized;
}
