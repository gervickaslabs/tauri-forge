import { Forge } from "@tauriforge/forge/instance";

import type { SanitizedConfig } from "@tauriforge/forge/config";

const cached = new WeakMap<SanitizedConfig, Forge>();

export const getForge = async (config: SanitizedConfig): Promise<Forge> => {
  if (cached.has(config)) {
    return cached.get(config) as Forge;
  }

  const forge = new Forge(config);

  await forge.initialize();

  cached.set(config, forge);

  return forge;
};
