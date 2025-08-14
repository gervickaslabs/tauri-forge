import {
  BaseCommandAdapter,
  CommandAdapter,
} from "@tauriforge/forge/lib/command";
import { buildConfig } from "@tauriforge/forge/lib/config";
import { BaseEventAdapter, EventAdapter } from "@tauriforge/forge/lib/event";
import {
  BaseStrongholdAdapter,
  Stronghold,
} from "@tauriforge/forge/lib/stronghold";

import type {
  InitOptions,
  BaseForge,
  SanitizedConfig,
} from "@tauriforge/forge/lib/types";

/// todo: refactory module and tests

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
