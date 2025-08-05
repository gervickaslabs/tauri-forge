import { createContext, useContext } from "react";
import type { Client } from "@repo/forge/lib/clients/types";
import type { Store } from "@repo/forge/lib/stores/types";

const ForgeContext = createContext<{
  client: Client | null;
  store: Store | null;
}>({
  client: null,
  store: null,
});

export const ForgeProvider = ({
  client,
  store,
  children,
}: {
  client: Client;
  store: Store;
  children: React.ReactNode;
}) => {
  return (
    <ForgeContext.Provider value={{ client, store }}>
      {children}
    </ForgeContext.Provider>
  );
};

export function useForgeContext() {
  const ctx = useContext(ForgeContext);
  if (!ctx) throw new Error(`Forge context must be used inside forge provider`);
  return ctx;
}
