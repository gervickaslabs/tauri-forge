import { createContext, useContext } from "react";

import { Forge } from "../../lib";
import { SanitizedConfig } from "../../lib/types";
import { useForge } from "../hooks";

export interface ForgeContextValue {
  forge: Forge | null;
}

export const ForgeContext = createContext<ForgeContextValue>({
  forge: null,
});

export const ForgeProvider = ({
  config,
  children,
}: {
  config: SanitizedConfig;
  children: React.ReactNode;
}) => {
  const forge = useForge(config);

  return (
    <ForgeContext.Provider value={{ forge }}>{children}</ForgeContext.Provider>
  );
};

export function useForgeContext() {
  const ctx = useContext(ForgeContext);

  if (!ctx) throw new Error(`ForgeContext must be used inside ForgeProvider`);
  return ctx;
}
