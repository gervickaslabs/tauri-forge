import { Forge } from ".";
import type { InitOptions, BaseForge } from "./types";

type ForgeConstructor = new () => BaseForge;

/**
 * Cache Forge instances by their exact config object reference.
 */
const cached = new WeakMap<InitOptions["config"], BaseForge>();

export const getForge = async (
  options: InitOptions,
  CustomForge?: ForgeConstructor
): Promise<BaseForge> => {
  const { config } = options;

  // Return from cache if same config object was used before
  if (cached.has(config)) {
    return cached.get(config)!;
  }

  // Create and cache new Forge instance
  let forge: BaseForge;

  if (CustomForge) {
    forge = new CustomForge();
  } else {
    forge = new Forge();
  }

  await forge.init(options);
  cached.set(config, forge);

  return forge;
};
