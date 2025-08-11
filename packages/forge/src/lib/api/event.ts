import type { BaseEventAdapter } from "./types";

import { emit, listen, UnlistenFn } from "@tauri-apps/api/event";

export class EventAdapter implements BaseEventAdapter {
  emit<T = unknown>(key: string, payload?: T): Promise<void> {
    return emit(key, payload);
  }

  on<T = unknown>(
    key: string,
    callback: (data: T) => void
  ): Promise<UnlistenFn> {
    return listen<T>(key, (event) => callback(event.payload));
  }
}
