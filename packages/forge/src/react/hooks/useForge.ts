import { SanitizedConfig } from "@tauriforge/forge/config/types";
import { Forge } from "@tauriforge/forge/instance";

import { getForge } from "@tauriforge/forge";
import { useEffect, useState } from "react";
import { useIsMounted } from "@tauriforge/forge/react/hooks/utils/useIsMounted";

export function useForge(config: SanitizedConfig) {
  const [forge, setForge] = useState<Forge | null>(null);
  const isMounted = useIsMounted();

  useEffect(() => {
    const initForge = async () => {
      const instance = await getForge(config);
      if (instance && isMounted()) {
        setForge(instance);
      }
    };

    initForge();
  }, [isMounted, config]);

  return forge;
}
