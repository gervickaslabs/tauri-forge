export interface Client {
  query<P = void, R = unknown>(key: string, payload?: P): Promise<R>;
  mutate<P = void, R = unknown>(key: string, payload?: P): Promise<R>;
}
