import type { BaseStrongholdAdapter } from "./storage/types";

import type { BaseCommandAdapter, BaseEventAdapter } from "./api/types";

import { CommandAdapter, EventAdapter } from "./api";

import { Stronghold } from "./storage";

import type {
  InitOptions,
  BaseForge,
  SanitizedConfig,
  ForgeConfig,
} from "./types";

export class Forge implements BaseForge {
  #config!: SanitizedConfig;

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

export const buildConfig = (options: ForgeConfig): SanitizedConfig => {
  return {
    ...options,
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

export const getForge = async (options: InitOptions) => {
  const forge = new Forge();
  return await forge.init(options);
};
