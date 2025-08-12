import { BaseCommandAdapter, CommandAdapter } from "./command";
import { buildConfig } from "./config";
import { BaseEventAdapter, EventAdapter } from "./event";
import { BaseStrongholdAdapter, Stronghold } from "./stronghold";

import type { InitOptions, BaseForge, SanitizedConfig } from "./types";

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
