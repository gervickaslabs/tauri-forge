import type { Store } from "@repo/forge/lib/stores/types";

import {
  appDataDir,
  // tempDir,
  // appLocalDataDir,
  // pictureDir,
  // dirname,
} from "@tauri-apps/api/path";

import {
  Client,
  Stronghold as PluginStronghold,
} from "@tauri-apps/plugin-stronghold";

export class Stronghold implements Store {
  #client: Client | null = null;
  #stronghold: PluginStronghold | null = null;

  async init(): Promise<void> {
    console.log("init stronghold");
    const vaultName = "tauriforge.0001";
    const vaultFilename = `${vaultName}.hold`;

    const vaultPath = `${await appDataDir()}/${vaultFilename}`;

    const vaultPassword = "vault_password_1234";
    const stronghold = await PluginStronghold.load(vaultPath, vaultPassword);
    console.log("stronghold", stronghold);

    try {
      this.#client = await stronghold.loadClient(vaultName);
    } catch {
      this.#client = await stronghold.createClient(vaultName);
    }

    this.#stronghold = stronghold;
  }

  async retrieveRecord<P, R>(key: string, _?: P): Promise<R> {
    const store = this.#client?.getStore();

    console.log("store", store);

    if (!store) await this.init();

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
