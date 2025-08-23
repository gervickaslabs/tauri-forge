import { invoke } from "@tauri-apps/api/core";

import type {
  BaseAdapterFactory,
  BaseCommandAdapter,
} from "@tauriforge/forge/adapters/types";

export class CommandAdapter implements BaseCommandAdapter {
  async initialize(): Promise<void> {}

  async query<T = unknown>(key: string): Promise<T> {
    return invoke<T>(key);
  }

  async mutate<T = unknown, P = unknown>(key: string, payload?: P): Promise<T> {
    return invoke<T>(key, payload as Record<string, unknown>);
  }
}

export const CommandAdapterFactory: BaseAdapterFactory<CommandAdapter> = {
  name: "command",
  async create(): Promise<CommandAdapter> {
    return new CommandAdapter();
  },
};
