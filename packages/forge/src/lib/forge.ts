import { Forge } from ".";
import type { InitOptions } from "./types";

/**
 * Cache Forge instances by their exact config object reference.
 */
const cached = new WeakMap<InitOptions["config"], Forge>();

export const getForge = async (options: InitOptions): Promise<Forge> => {
  const { config } = options;

  // Return from cache if same config object was used before
  if (cached.has(config)) {
    return cached.get(config)!;
  }

  // Create and cache new Forge instance
  const forge = await new Forge().init(options);
  cached.set(config, forge);

  return forge;
};
