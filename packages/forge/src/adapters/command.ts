import { invoke } from "@tauri-apps/api/core";

import type {
  AdapterFactory,
  BaseCommandAdapter,
  SanitizedCommandConfig,
  CacheEntry,
  QueryOptions,
  MutationOptions,
  BatchResult,
  BatchMutation,
  BatchQuery,
} from "@tauriforge/forge/adapters/types";

export class CommandAdapter implements BaseCommandAdapter {
  readonly name = "command";
  readonly version = "1.0.0";

  private config!: SanitizedCommandConfig;
  private cache = new Map<string, CacheEntry>();
  private pendingQueries = new Map<string, Promise<unknown>>();

  async initialize(config: SanitizedCommandConfig): Promise<void> {
    this.config = config;

    // Set up cache cleanup interval
    if (this.config.cache.enabled) {
      setInterval(() => this.cleanupCache(), this.config.cache.ttl / 10);
    }
  }

  async destroy(): Promise<void> {
    this.cache.clear();
    this.pendingQueries.clear();
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Test with a simple command that should always exist
      await invoke("ping", undefined);
      return true;
    } catch {
      return false;
    }
  }

  async query<T = unknown>(key: string, options?: QueryOptions): Promise<T> {
    const cacheKey = `query:${key}`;
    const effectiveOptions = { ...this.getDefaultOptions(), ...options };

    // Check cache first
    if (this.config.cache.enabled && effectiveOptions.cache !== false) {
      const cached = this.getCachedResult<T>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Check for duplicate in-flight requests
    if (
      this.config.deduplication.enabled &&
      this.pendingQueries.has(cacheKey)
    ) {
      return this.pendingQueries.get(cacheKey)!;
    }

    // Execute query with retry logic
    const queryPromise = this.executeWithRetry(
      () => invoke<T>(key),
      effectiveOptions.retries || this.config.retryAttempts
    );

    // Store in-flight query for deduplication
    if (this.config.deduplication.enabled) {
      this.pendingQueries.set(cacheKey, queryPromise);
    }

    try {
      const result = await queryPromise;

      // Cache result
      if (this.config.cache.enabled && effectiveOptions.cache !== false) {
        this.setCachedResult(cacheKey, result);
      }

      return result;
    } finally {
      // Clean up pending query
      if (this.config.deduplication.enabled) {
        this.pendingQueries.delete(cacheKey);
      }
    }
  }

  async mutate<T = unknown, P = unknown>(
    key: string,
    payload?: P,
    options?: MutationOptions
  ): Promise<T> {
    const effectiveOptions = { ...this.getDefaultOptions(), ...options };

    // Invalidate related cache entries
    if (this.config.cache.enabled) {
      this.invalidateCache(`query:${key}`);
    }

    // Execute mutation with retry logic
    return this.executeWithRetry(
      () => invoke<T>(key, payload as Record<string, unknown>),
      effectiveOptions.retries || this.config.retryAttempts
    );
  }

  async batchQuery<T = unknown>(
    queries: BatchQuery[]
  ): Promise<BatchResult<T>[]> {
    // Process queries in parallel
    const queryPromises = queries.map(
      async (query): Promise<BatchResult<T>> => {
        try {
          const data = await this.query<T>(query.key, query.options);
          return { id: query.id, success: true, data };
        } catch (error) {
          return {
            id: query.id,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }
    );

    return Promise.all(queryPromises);
  }

  async batchMutate<T = unknown>(
    mutations: BatchMutation[]
  ): Promise<BatchResult<T>[]> {
    const results: BatchResult<T>[] = [];

    // Process mutations in parallel
    const mutationPromises = mutations.map(
      async (mutation): Promise<BatchResult<T>> => {
        try {
          const data = await this.mutate<T>(
            mutation.key,
            mutation.payload,
            mutation.options
          );
          return { id: mutation.id, success: true, data };
        } catch (error) {
          return {
            id: mutation.id,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }
    );

    return Promise.all(mutationPromises);
  }

  // Private methods
  private getDefaultOptions(): QueryOptions {
    return {
      timeout: this.config.timeout,
      cache: true,
      retries: this.config.retryAttempts,
    };
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on the last attempt
        if (attempt < maxRetries) {
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  }

  private getCachedResult<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  private setCachedResult<T>(key: string, data: T): void {
    // Check cache size limit
    if (this.cache.size >= this.config.cache.maxSize) {
      // Remove oldest entry
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.config.cache.ttl,
    });
  }

  private invalidateCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern) || pattern.includes(key)) {
        this.cache.delete(key);
      }
    }
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

export const CommandAdapterFactory: AdapterFactory<
  CommandAdapter,
  SanitizedCommandConfig
> = {
  name: "command",
  version: "0.0.1",
  async create(_: SanitizedCommandConfig): Promise<CommandAdapter> {
    return new CommandAdapter();
  },
  validateConfig(config: unknown): boolean {
    return typeof config === "object" && config !== null;
  },
};
