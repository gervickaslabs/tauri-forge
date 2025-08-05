// import { UnlistenFn } from "@tauri-apps/api/event";

export interface Client {
  query<P = void, R = unknown>(key: string, payload?: P): Promise<R>;
  mutate<P = void, R = unknown>(key: string, payload?: P): Promise<R>;

  // on(key: string, callback: (data: P) => void): Promise<UnlistenFn>;
}
