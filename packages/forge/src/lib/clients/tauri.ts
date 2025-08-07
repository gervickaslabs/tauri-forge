import type { Client } from "@repo/forge/lib/clients/types";

import { invoke } from "@tauri-apps/api/core";

export class Tauri implements Client {
  query<T = unknown, Q = void>(key: string, payload?: Q): Promise<T> {
    return invoke<T>(key, payload as Record<string, unknown>);
  }
  mutate<T = unknown, Q = void>(key: string, payload?: Q): Promise<T> {
    return invoke<T>(key, payload as Record<string, unknown>);
  }
}
