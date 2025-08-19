import type { UnlistenFn } from "@tauri-apps/api/event";

export interface BaseAdapter {
  readonly name: string;
  readonly version: string;

  initialize(config: unknown): Promise<void>;
  destroy(): Promise<void>;
  healthCheck(): Promise<boolean>;
}

export interface AdapterFactory<
  TAdapter extends BaseAdapter,
  TConfig = unknown,
> {
  name: string;
  version: string;
  create(config: TConfig): Promise<TAdapter>;
  validateConfig?(config: unknown): boolean;
}

export interface BaseAdapterConfig {
  enabled?: boolean;
  retryAttempts?: number;
  timeout?: number;
  factory?: AdapterFactory<BaseAdapter, BaseAdapterConfig>;
}

export interface CommandAdapterConfig extends BaseAdapterConfig {
  cache?: {
    enabled?: boolean;
    ttl?: number;
    maxSize?: number;
  };
  deduplication?: {
    enabled?: boolean;
    window?: number;
  };
}
export interface EventAdapterConfig extends BaseAdapterConfig {
  buffer?: {
    enabled?: boolean;
    maxSize?: number;
    flushInterval?: number;
  };
  persistence?: {
    enabled?: boolean;
    storageKey?: string;
  };
}

export interface SanitizedCommandConfig
  extends Required<Omit<CommandAdapterConfig, "enabled">> {
  enabled: true;
  factory: AdapterFactory<BaseAdapter, CommandAdapterConfig>;
}

export interface SanitizedEventConfig
  extends Required<Omit<EventAdapterConfig, "enabled">> {
  enabled: true;
  factory: AdapterFactory<BaseAdapter, EventAdapterConfig>;
}

export interface BaseCommandAdapter extends BaseAdapter {
  query<T = unknown>(key: string, options?: QueryOptions): Promise<T>;
  mutate<T = unknown, P = unknown>(
    key: string,
    payload?: P,
    options?: MutationOptions
  ): Promise<T>;

  batchQuery<T = unknown>(queries: BatchQuery[]): Promise<BatchResult<T>[]>;
  batchMutate<T = unknown>(
    mutations: BatchMutation[]
  ): Promise<BatchResult<T>[]>;
}

export interface BaseEventAdapter extends BaseAdapter {
  on<T = unknown>(
    key: string,
    callback: EventCallback<T>,
    options?: EventOptions
  ): Promise<UnlistenFn>;
  emit<T = unknown>(key: string, data: T, options?: EmitOptions): Promise<void>;

  removeAllListeners(key?: string): Promise<void>;
  getActiveListeners(): string[];
}

export interface QueryOptions {
  timeout?: number;
  cache?: boolean;
  retries?: number;
}

export interface MutationOptions extends QueryOptions {
  optimistic?: boolean;
  rollback?: boolean;
}

export interface EventOptions {
  once?: boolean;
  priority?: number;
}

export interface EmitOptions {
  broadcast?: boolean;
  persist?: boolean;
}

export interface BatchQuery {
  id: string;
  key: string;
  options?: QueryOptions;
}

export interface BatchMutation {
  id: string;
  key: string;
  payload?: unknown;
  options?: MutationOptions;
}

export interface BatchResult<T = unknown> {
  id: string;
  success: boolean;
  data?: T;
  error?: string;
}

export type EventCallback<T = unknown> = (
  data: T,
  metadata: EventMetadata
) => void;

export interface EventMetadata {
  timestamp: number;
  source: string;
  sequence?: number;
}

export interface BufferedEvent {
  key: string;
  data: unknown;
  timestamp: number;
  options: EmitOptions;
}

export interface CacheEntry {
  data: unknown;
  createdAt: number;
  expiresAt: number;
}
