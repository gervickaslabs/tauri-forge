import { emit, listen } from "@tauri-apps/api/event";
import type { UnlistenFn } from "@tauri-apps/api/event";

import type {
  AdapterFactory,
  BaseEventAdapter,
  SanitizedEventConfig,
  EventOptions,
  EventCallback,
  EmitOptions,
} from "@tauriforge/forge/adapters/types";

export class EventAdapter implements BaseEventAdapter {
  readonly name = "event";
  readonly version = "1.0.0";

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
    _options: EventOptions = {},
  ): Promise<UnlistenFn> {
    return await listen<T>(key, (e) => callback(e.payload));
  }

  async emit<T = unknown>(
    key: string,
    data: T,
    _options: EmitOptions = {},
  ): Promise<void> {
    return await emit(key, data);
  }
}

export const EventAdapterFactory: AdapterFactory<
  EventAdapter,
  SanitizedEventConfig
> = {
  name: "event",
  version: "0.0.1",
  async create(_: SanitizedEventConfig): Promise<EventAdapter> {
    return new EventAdapter();
  },
  validateConfig(config: SanitizedEventConfig): boolean {
    return typeof config === "object" && config !== null;
  },
};
