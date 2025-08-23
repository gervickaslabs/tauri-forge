export type { ForgeInstance } from "@tauriforge/forge/types";

import type { SanitizedConfig } from "@tauriforge/forge/config";

import { Forge } from "@tauriforge/forge/instance";

const cached = new WeakMap<SanitizedConfig, Forge>();

export const getForge = async (config: SanitizedConfig): Promise<Forge> => {
  if (cached.has(config)) {
    return cached.get(config) as Forge;
  }

  const forge = new Forge();

  await forge.initialize(config);

  cached.set(config, forge);

  return forge;
};
