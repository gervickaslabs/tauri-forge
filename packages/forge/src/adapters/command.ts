import { invoke } from "@tauri-apps/api/core";

import type {
  AdapterFactory,
  BaseCommandAdapter,
  SanitizedCommandConfig,
} from "@tauriforge/forge/adapters/types";

export class CommandAdapter implements BaseCommandAdapter {
  readonly name = "command";
  private config!: SanitizedCommandConfig;

  async initialize(config: SanitizedCommandConfig): Promise<void> {
    this.config = config;
  }

  async destroy(): Promise<void> {}

  async healthCheck(): Promise<boolean> {
    try {
      return true;
    } catch {
      return false;
    }
  }

  async query<T = unknown>(key: string): Promise<T> {
    return invoke<T>(key);
  }

  async mutate<T = unknown, P = unknown>(key: string, payload?: P): Promise<T> {
    return invoke<T>(key, payload as Record<string, unknown>);
  }
}

export const CommandAdapterFactory: AdapterFactory<
  CommandAdapter,
  SanitizedCommandConfig
> = {
  name: "command",
  async create(_: SanitizedCommandConfig): Promise<CommandAdapter> {
    return new CommandAdapter();
  },
  validateConfig(config: SanitizedCommandConfig): boolean {
    return typeof config === "object" && config !== null;
  },
};
