import { UnlistenFn } from "@tauri-apps/api/event";

export interface BaseCommandAdapter {
  query<T = unknown>(key: string): Promise<T>;
  mutate<T = unknown, Q = void>(key: string, payload?: Q): Promise<T>;
}

export interface BaseEventAdapter {
  on<T = unknown>(
    key: string,
    callback: (data: T) => void
  ): Promise<UnlistenFn>;

  emit<T = unknown>(key: string, data: T): Promise<void>;
}
