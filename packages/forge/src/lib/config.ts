import type { SanitizedConfig, ForgeConfig } from "@tauriforge/forge/lib/types";

export const buildConfig = (options?: ForgeConfig): SanitizedConfig => {
  return {
    stronghold: {
      enabled: options?.stronghold?.enabled ?? false,
    },
    command: {
      enabled: options?.command?.enabled ?? false,
    },
    event: {
      enabled: options?.event?.enabled ?? false,
    },
  };
};
