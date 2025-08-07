export interface Store {
  retrieveRecord<P = void, R = unknown>(key: string, record?: P): Promise<R>;
  insertRecord<P = void, R = unknown>(key: string, record?: P): Promise<R>;
}
