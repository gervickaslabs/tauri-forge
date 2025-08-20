import { SanitizedConfig } from "@tauriforge/forge/config/types";
import { Forge } from "@tauriforge/forge/instance";

import { getForge } from "@tauriforge/forge";
import { useEffect, useState } from "react";
import { useIsMounted } from "@tauriforge/forge/react/hooks/utils/useIsMounted";

export function useForge(config: SanitizedConfig) {
  const [forge, setForge] = useState<Forge | null>(null);
  const isMounted = useIsMounted();

  useEffect(() => {
    getForge(config).then((instance) => {
      if (isMounted()) {
        setForge(instance);
      }
    });
  }, [isMounted, config]);

  return forge;
}
