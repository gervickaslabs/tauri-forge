export * from "@tauriforge/forge/config/types";

import merge from "lodash/merge.js";

import type { Config, SanitizedConfig } from "@tauriforge/forge/config/types";

import type {
  SanitizedCommandConfig,
  SanitizedEventConfig,
} from "@tauriforge/forge/adapters/types";

import type { SanitizedGlobalConfig } from "@tauriforge/forge/globals/types";

import { CommandAdapterFactory } from "@tauriforge/forge/adapters/command";
import { EventAdapterFactory } from "@tauriforge/forge/adapters/event";

export const DEFAULT_COMMAND_CONFIG: SanitizedCommandConfig = {
  enabled: true,
  factory: CommandAdapterFactory,
};

export const DEFAULT_EVENT_CONFIG: SanitizedEventConfig = {
  enabled: true,
  factory: EventAdapterFactory,
};

export const DEFAULT_GLOBAL_CONFIG: SanitizedGlobalConfig = {
  debug: false,
};

export function buildConfig(customConfig?: Config): SanitizedConfig {
  const sanitized: SanitizedConfig = {
    adapters: {
      command: buildAdapterConfig(
        DEFAULT_COMMAND_CONFIG,
        customConfig?.adapters?.command,
      ),
      event: buildAdapterConfig(
        DEFAULT_EVENT_CONFIG,
        customConfig?.adapters?.event,
      ),
    },

    get activeAdapters() {
      return Object.entries(this.adapters)
        .filter(([_, config]) => config.enabled)
        .map(([name]) => name);
    },

    global: {
      ...DEFAULT_GLOBAL_CONFIG,
      ...customConfig?.global,
    },

    plugins: (customConfig?.plugins || [])
      .map((plugin) => ({
        name: plugin.name,
        config: plugin.config || {},
        enabled: plugin.enabled !== false,
        priority: plugin.priority || 0,
      }))
      .sort((a, b) => b.priority - a.priority), // Sort by priority descending
  };

  return sanitized;
}

function buildAdapterConfig<T extends { enabled: boolean }, C = unknown>(
  defaultConfig: T,
  customConfig: C,
): T {
  if (customConfig === false) {
    return { ...defaultConfig, enabled: false };
  }

  if (!customConfig) {
    return defaultConfig;
  }

  return merge(defaultConfig, { ...customConfig, enabled: true });
}
