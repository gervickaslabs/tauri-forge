import type { BaseStrongholdAdapter, StrongholdInitOptions } from "./types";

import { appDataDir } from "@tauri-apps/api/path";

import {
  Client,
  Stronghold as PluginStronghold,
} from "@tauri-apps/plugin-stronghold";

export class Stronghold implements BaseStrongholdAdapter {
  #client: Client | null = null;
  #stronghold: PluginStronghold | null = null;

  async load(options: StrongholdInitOptions) {
    const { vaultName, vaultPassword, vaultExtension = "hold" } = options;

    const vaultFilename = `${vaultName}.${vaultExtension}`;
    const vaultPath = `${await appDataDir()}/${vaultFilename}`;

    const stronghold = await PluginStronghold.load(vaultPath, vaultPassword);

    try {
      this.#client = await stronghold.loadClient(vaultName);
    } catch {
      this.#client = await stronghold.createClient(vaultName);
    }

    this.#stronghold = stronghold;
  }

  async unload() {
    await this.#stronghold?.unload();
  }

  async save() {
    await this.#stronghold?.save();
  }

  async retrieveRecord<R = unknown>(key: string): Promise<R> {
    const store = this.#client?.getStore();

    const data = await store?.get(key);

    return Stronghold.decode(data);
  }

  async insertRecord<P = void, R = unknown>(
    key: string,
    record?: P
  ): Promise<R> {
    const store = this.#client?.getStore();

    const data = Stronghold.encode(record);

    await store?.insert(key, data);

    return record as R;
  }

  async deleteRecord(key: string) {
    const store = this.#client?.getStore();

    await store?.remove(key);

    return true;
  }

  static encode<P>(data: P): number[] {
    return Array.from(new TextEncoder().encode(JSON.stringify(data)));
  }

  static decode<R>(data?: Uint8Array | null): R {
    return JSON.parse(new TextDecoder().decode(new Uint8Array(data || [])));
  }
}
