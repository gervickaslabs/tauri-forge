import { emit, listen } from "@tauri-apps/api/event";
import type { UnlistenFn } from "@tauri-apps/api/event";

import type {
  AdapterFactory,
  BaseEventAdapter,
  SanitizedEventConfig,
  EventOptions,
  BufferedEvent,
  EventCallback,
  EmitOptions,
  EventMetadata,
} from "@tauriforge/forge/adapters/types";

export class EventAdapter implements BaseEventAdapter {
  readonly name = "event";
  readonly version = "1.0.0";

  private config!: SanitizedEventConfig;

  private listeners = new Map<
    string,
    Set<{ callback: EventCallback; options: EventOptions }>
  >();

  private buffer: BufferedEvent[] = [];
  private sequence = 0;
  private flushTimer?: NodeJS.Timeout;

  async initialize(config: SanitizedEventConfig): Promise<void> {
    this.config = config;

    // Set up buffer flush interval
    if (this.config.buffer.enabled) {
      this.flushTimer = setInterval(
        () => this.flushBuffer(),
        this.config.buffer.flushInterval
      );
    }

    // Restore persisted events
    if (this.config.persistence.enabled) {
      await this.restoreEvents();
    }
  }

  async destroy(): Promise<void> {
    // Clean up timers
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    // Persist events if needed
    if (this.config.persistence.enabled && this.buffer.length > 0) {
      await this.persistEvents();
    }

    // Clean up listeners
    this.listeners.clear();
    this.buffer = [];
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Test by emitting and listening to a test event
      let received = false;
      const unlisten = await this.on("__health_check__", () => {
        received = true;
      });

      await this.emit("__health_check__", { test: true });

      // Wait a bit for the event to be processed
      await new Promise((resolve) => setTimeout(resolve, 100));

      await unlisten();
      return received;
    } catch {
      return false;
    }
  }

  async on<T = unknown>(
    key: string,
    callback: EventCallback<T>,
    options: EventOptions = {}
  ): Promise<UnlistenFn> {
    // Create listener set if it doesn't exist
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }

    const listenerInfo = { callback: callback as EventCallback, options };
    this.listeners.get(key)!.add(listenerInfo);

    // Set up Tauri event listener
    const tauriUnlisten = await listen<T>(key, (event) => {
      const metadata: EventMetadata = {
        timestamp: Date.now(),
        source: "tauri",
        sequence: this.sequence++,
      };

      try {
        callback(event.payload, metadata);

        // Remove one-time listeners
        if (options.once) {
          this.listeners.get(key)?.delete(listenerInfo);
        }
      } catch (error) {
        console.error(`Error in event callback for '${key}':`, error);
      }
    });

    // Return composite unlisten function
    return async () => {
      this.listeners.get(key)?.delete(listenerInfo);
      await tauriUnlisten();
    };
  }

  async emit<T = unknown>(
    key: string,
    data: T,
    options: EmitOptions = {}
  ): Promise<void> {
    const event: BufferedEvent = {
      key,
      data,
      timestamp: Date.now(),
      options,
    };

    // Add to buffer if buffering is enabled
    if (this.config.buffer.enabled) {
      this.buffer.push(event);

      // Check buffer size limit
      if (this.buffer.length >= this.config.buffer.maxSize) {
        await this.flushBuffer();
      }
    } else {
      // Emit immediately
      await this.emitDirect(event);
    }
  }

  async removeAllListeners(key?: string): Promise<void> {
    if (key) {
      this.listeners.delete(key);
    } else {
      this.listeners.clear();
    }
  }

  getActiveListeners(): string[] {
    return Array.from(this.listeners.keys());
  }

  // Private methods
  private async emitDirect(event: BufferedEvent): Promise<void> {
    try {
      await emit(event.key, event.data);
    } catch (error) {
      console.error(`Error emitting event '${event.key}':`, error);
      throw error;
    }
  }

  private async flushBuffer(): Promise<void> {
    if (this.buffer.length === 0) return;

    const eventsToFlush = [...this.buffer];
    this.buffer = [];

    // Emit all buffered events
    const emitPromises = eventsToFlush.map((event) => this.emitDirect(event));

    try {
      await Promise.all(emitPromises);
    } catch (error) {
      console.error("Error flushing event buffer:", error);
      // Re-add failed events to buffer (simple retry mechanism)
      this.buffer.unshift(...eventsToFlush);
    }
  }

  private async persistEvents(): Promise<void> {
    if (typeof localStorage === "undefined") return;

    try {
      const eventsData = JSON.stringify(this.buffer);
      localStorage.setItem(this.config.persistence.storageKey, eventsData);
    } catch (error) {
      console.error("Error persisting events:", error);
    }
  }

  private async restoreEvents(): Promise<void> {
    if (typeof localStorage === "undefined") return;

    try {
      const eventsData = localStorage.getItem(
        this.config.persistence.storageKey
      );
      if (eventsData) {
        this.buffer = JSON.parse(eventsData);
        localStorage.removeItem(this.config.persistence.storageKey);

        // Flush restored events
        await this.flushBuffer();
      }
    } catch (error) {
      console.error("Error restoring events:", error);
    }
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
  validateConfig(config: unknown): boolean {
    return typeof config === "object" && config !== null;
  },
};
