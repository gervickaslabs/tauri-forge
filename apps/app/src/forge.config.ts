import { buildConfig } from "@tauriforge/forge/lib/config";

export const config = buildConfig({
  command: {
    enabled: true,
  },
  event: {
    enabled: true,
  },
  stronghold: {
    enabled: true,
  },
});

export default config;
