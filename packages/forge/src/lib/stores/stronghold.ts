import type { Store } from "@repo/forge/lib/stores/types";

import { appDataDir } from "@tauri-apps/api/path";

import {
  Client,
  Stronghold as PluginStronghold,
} from "@tauri-apps/plugin-stronghold";

export class Stronghold implements Store {
  #client: Client | null = null;
  #stronghold: PluginStronghold | null = null;

  async init(): Promise<void> {
    const vaultName = "root";
    const vaultFilename = `${vaultName}.hold`;

    const vaultPath = `${await appDataDir()}/${vaultFilename}`;

    const vaultPassword = "vault_password_1234";
    const stronghold = await PluginStronghold.load(vaultPath, vaultPassword);

    try {
      this.#client = await stronghold.loadClient(vaultName);
    } catch {
      this.#client = await stronghold.createClient(vaultName);
    }

    this.#stronghold = stronghold;
  }

  async retrieveRecord<P, R>(key: string, _?: P): Promise<R> {
    const store = this.#client?.getStore();

    const data = await store?.get(key);

    return JSON.parse(new TextDecoder().decode(new Uint8Array(data || [])));
  }

  async insertRecord<P = void, R = unknown>(
    key: string,
    record?: P
  ): Promise<R> {
    const store = this.#client?.getStore();

    const data = Array.from(new TextEncoder().encode(JSON.stringify(record)));

    await store?.insert(key, data);

    await this.#stronghold?.save();

    return JSON.parse(new TextDecoder().decode(new Uint8Array(data || [])));
  }
}
