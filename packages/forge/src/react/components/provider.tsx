import { createContext, useContext } from "react";
import { SanitizedConfig } from "@tauriforge/forge/config/types";
import { Forge } from "@tauriforge/forge/instance";
import { useForge } from "@tauriforge/forge/react/hooks/useForge";

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
