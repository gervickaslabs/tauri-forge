import { invoke } from "@tauri-apps/api/core";

export interface BaseCommandAdapter {
  query<T = unknown>(key: string): Promise<T>;
  mutate<T = unknown, Q = void>(key: string, payload?: Q): Promise<T>;
}

export class CommandAdapter implements BaseCommandAdapter {
  query<T = unknown>(key: string): Promise<T> {
    return invoke<T>(key);
  }
  mutate<T = unknown, Q = void>(key: string, payload?: Q): Promise<T> {
    return invoke<T>(key, payload as Record<string, unknown>);
  }
}
