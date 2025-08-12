import { BaseCommandAdapter, CommandAdapter } from "./command";
import { BaseEventAdapter, EventAdapter } from "./event";
import { BaseStrongholdAdapter, Stronghold } from "./stronghold";

import type {
  InitOptions,
  BaseForge,
  SanitizedConfig,
  ForgeConfig,
} from "./types";

let cachedForge: Forge | null = null;

export const getForge = async (options: InitOptions): Promise<Forge> => {
  if (cachedForge) {
    return cachedForge;
  }

  return (cachedForge = await new Forge().init(options));
};

export class Forge implements BaseForge {
  #config: SanitizedConfig = buildConfig();

  #stronghold: BaseStrongholdAdapter | null = null;

  #command: BaseCommandAdapter | null = null;

  #event: BaseEventAdapter | null = null;

  async init(options: InitOptions) {
    const { config } = options;

    if (config?.stronghold?.enabled) {
      this.#stronghold = new Stronghold();
    }

    if (config?.command?.enabled) {
      this.#command = new CommandAdapter();
    }

    if (config?.event?.enabled) {
      this.#event = new EventAdapter();
    }

    this.#config = config;

    return this;
  }

  get config() {
    return this.#config;
  }

  get stronghold() {
    return this.#stronghold;
  }

  get event() {
    return this.#event;
  }

  get command() {
    return this.#command;
  }
}

export const buildConfig = (options?: ForgeConfig): SanitizedConfig => {
  return {
    ...options,
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
