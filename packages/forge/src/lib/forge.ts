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

  #storage: {
    stronghold: BaseStrongholdAdapter | null;
  } = {
    stronghold: null,
  };

  #api: {
    command: BaseCommandAdapter | null;
    event: BaseEventAdapter | null;
  } = {
    command: null,
    event: null,
  };

  async init(options: InitOptions) {
    const { config } = options;

    if (config.storage?.stronghold?.enabled) {
      this.#storage.stronghold = new Stronghold();
    }

    if (config.api?.command?.enabled) {
      this.#api.command = new CommandAdapter();
    }

    if (config.api?.event?.enabled) {
      this.#api.event = new EventAdapter();
    }

    this.#config = config;

    return this;
  }

  get config() {
    return this.#config;
  }

  get storage() {
    return this.#storage;
  }

  get api() {
    return this.#api;
  }
}

export const buildConfig = (options: ForgeConfig): SanitizedConfig => {
  return {
    ...options,
    storage: {
      stronghold: {
        enabled: options.storage?.stronghold?.enabled ?? false,
      },
    },
    api: {
      command: {
        enabled: options.api?.command?.enabled ?? false,
      },
      event: {
        enabled: options.api?.event?.enabled ?? false,
      },
    },
  };
};

export const getForge = async (options: InitOptions) => {
  const forge = new Forge();
  return await forge.init(options);
};
