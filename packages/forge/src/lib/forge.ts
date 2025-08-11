export const buildForgeConfig = () =>
  /**
   *   options: any
   */
  {
    /// return a default Forge config object
    return {
      /// for salt and so on... ex: crypto.createHash("sha256").update(config.secret).digest("hex");
      secret: null,
      api: {
        command: null, /// CommandAdapter
        event: null, /// EventAdapter
        http: null, /// HttpAdapter
      },
      storage: {
        store: null, /// StoreAdapter
        stronghold: null, /// StrongholdAdapter
        sessionStorage: null, /// SessionStorageAdapter
        localStorage: null, /// LocalStorageAdapter
        indexedDB: null, /// IndexedDBAdapter
        inMemory: null, /// InMemoryAdapter
      },
      views: {
        root: {
          providers: null,
          layout: null,
          components: {
            header: null,
            footer: null,
            content: null,
          },
          children: [
            {
              providers: null,
              layout: null,
              components: {
                header: null,
                footer: null,
                content: null,
                aside: null,
              },
            },
          ],
        },
      },
    };
  };

// const config = buildForgeConfig(
//   /// add overrides here
//   {
//     api: {
//       /// add overrides here
//     },
//   }
// );

// class Forge {
//   /// add methods and properties for Forge instance
//   constructor(private config: any) {}

//   init() {
//     return this;
//   }

//   api: any;
// }

// const getForge = async (config: any) => {
//   /// create a logic for memory cache or initialize it forge.init()
//   /// return a Forge instance with methods and etc.
//   return new Forge(config);
// };

// const forge = await getForge(config);

// forge.api;

/**
 * ex usage:
 *
 * forge.config that return the config object
 *
 * forge.api.command.query("key", { param: "value" });
 * forge.api.command.mutate("key", { param: "value" });
 *
 * forge.database.store.query("key", { param: "value" });
 * forge.database.store.mutate("key", { param: "value" });
 *
 * forge.database.store.on("key", (data) => {
 *   console.log(data);
 * });
 *
 * forge.database.stronghold.openVault(args...);
 * forge.database.stronghold.mutateVault("key", { param: "value" });
 * forge.database.stronghold.closeVault();
 *
 */
