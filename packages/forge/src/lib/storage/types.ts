export interface BaseStoreAdapter {
  retrieveRecord<T>(key: string): Promise<T | undefined>;
  insertRecord<T>(key: string, value: T): Promise<T>;
  deleteRecord(key: string): Promise<boolean>;
  save(): Promise<void>;
}

export type StrongholdInitOptions = {
  vaultName: string;
  vaultPassword: string;
  vaultExtension?: string;
};

export interface BaseStrongholdAdapter {
  load(options: StrongholdInitOptions): Promise<void>;
  unload(): Promise<void>;
  retrieveRecord<R = unknown>(key: string): Promise<R>;
  insertRecord<P = void, R = unknown>(key: string, record?: P): Promise<R>;
  deleteRecord(key: string): Promise<boolean>;
  save(): Promise<void>;
}
