import { emit, listen } from "@tauri-apps/api/event";
import type { UnlistenFn } from "@tauri-apps/api/event";

import type {
  AdapterFactory,
  BaseEventAdapter,
  SanitizedEventConfig,
  EventCallback,
} from "@tauriforge/forge/adapters/types";

export class EventAdapter implements BaseEventAdapter {
  readonly name = "event";

  private config!: SanitizedEventConfig;

  async initialize(config: SanitizedEventConfig): Promise<void> {
    this.config = config;
  }

  async destroy(): Promise<void> {}

  async healthCheck(): Promise<boolean> {
    return true;
  }

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

export const EventAdapterFactory: AdapterFactory<
  EventAdapter,
  SanitizedEventConfig
> = {
  name: "event",
  async create(_: SanitizedEventConfig): Promise<EventAdapter> {
    return new EventAdapter();
  },
  validateConfig(config: SanitizedEventConfig): boolean {
    return typeof config === "object" && config !== null;
  },
};
