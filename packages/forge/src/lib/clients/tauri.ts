import type { Client } from "@repo/forge/lib/clients/types";

import { invoke } from "@tauri-apps/api/core";
// import { listen, UnlistenFn } from "@tauri-apps/api/event";

export class Tauri implements Client {
  query<T = unknown, Q = void>(key: string, payload?: Q): Promise<T> {
    return invoke<T>(key, payload as Record<string, unknown>);
  }
  mutate<T = unknown, Q = void>(key: string, payload?: Q): Promise<T> {
    return invoke<T>(key, payload as Record<string, unknown>);
  }

  // on<T = unknown>(
  //   key: string,
  //   callback: (data: T) => void
  // ): Promise<UnlistenFn> {
  //   return listen<T>(key, (event) => callback(event.payload));
  // }
}
