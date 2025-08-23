import type { UnlistenFn } from "@tauri-apps/api/event";

export interface BaseAdapter {
  initialize(): Promise<void>;
}

export interface BaseAdapterFactory<TAdapter extends BaseAdapter> {
  readonly name: string;
  create(): Promise<TAdapter>;
}

export interface BaseCommandAdapter extends BaseAdapter {
  query<T = unknown>(key: string): Promise<T>;
  mutate<T = unknown, P = unknown>(key: string, payload?: P): Promise<T>;
}

export interface BaseEventAdapter extends BaseAdapter {
  on<T = unknown>(key: string, callback: EventCallback<T>): Promise<UnlistenFn>;
  emit<T = unknown>(key: string, data: T): Promise<void>;
}

export type EventCallback<T = unknown> = (data: T) => void;

export type BaseCommandAdapterFactory = BaseAdapterFactory<BaseCommandAdapter>;

export type BaseEventAdapterFactory = BaseAdapterFactory<BaseEventAdapter>;
