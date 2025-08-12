import { Forge } from ".";

import type { InitOptions } from "./types";

const cached = new Map<string, Forge>();

export const getForge = async (options: InitOptions): Promise<Forge> => {
  const { config } = options;

  /**
   * Cache the Forge instance by its config
   */
  const key = JSON.stringify(config);

  if (cached.has(key)) {
    return cached.get(key)!;
  }

  return cached.set(key, await new Forge().init(options)).get(key)!;
};
