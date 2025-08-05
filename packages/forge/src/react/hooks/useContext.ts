import { createContext, useContext as useReactContext } from "react";
import type { Client } from "@repo/forge/lib/clients/types";
import type { Store } from "@repo/forge/lib/stores/types";

export interface ForgeContextValue {
  client: Client | null;
  store: Store | null;
}

export const ForgeContext = createContext<ForgeContextValue>({
  client: null,
  store: null,
});

export function useContext() {
  const ctx = useReactContext(ForgeContext);
  if (!ctx) throw new Error(`Forge context must be used inside forge provider`);
  return ctx;
}
