import { buildConfig } from "@repo/forge/lib/forge";

export const config = buildConfig({
  api: {
    command: {
      enabled: true,
    },
    event: {
      enabled: true,
    },
  },
  storage: {
    stronghold: {
      enabled: true,
    },
  },
});

export default config;
