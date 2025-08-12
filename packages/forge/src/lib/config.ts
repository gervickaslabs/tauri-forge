import type { SanitizedConfig, ForgeConfig } from "./types";

export const buildConfig = (options?: ForgeConfig): SanitizedConfig => {
  return {
    stronghold: {
      enabled: options?.stronghold?.enabled ?? true,
    },
    command: {
      enabled: options?.command?.enabled ?? true,
    },
    event: {
      enabled: options?.event?.enabled ?? true,
    },
  };
};
