import { emit, listen } from "@tauri-apps/api/event";
import type { UnlistenFn } from "@tauri-apps/api/event";

import type {
  BaseAdapterFactory,
  BaseEventAdapter,
  EventCallback,
} from "@tauriforge/forge/adapters/types";

export class EventAdapter implements BaseEventAdapter {
  readonly name = "event";

  async initialize(): Promise<void> {}

  async on<T = unknown>(
    key: string,
    callback: EventCallback<T>,
  ): Promise<UnlistenFn> {
    return await listen<T>(key, (e) => callback(e.payload));
  }

  async emit<T = unknown>(key: string, data: T): Promise<void> {
    return await emit(key, data);
  }
}

export const EventAdapterFactory: BaseAdapterFactory<BaseEventAdapter> = {
  name: "event",
  async create(): Promise<EventAdapter> {
    return new EventAdapter();
  },
};
