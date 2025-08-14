import type { BaseForge, SanitizedConfig } from "@tauriforge/forge/lib/types";
import { getForge } from "@tauriforge/forge/lib/forge";
import { useEffect, useState } from "react";
import { useIsMounted } from "@tauriforge/forge/react/hooks/utils/useIsMounted";

export function useForge(config: SanitizedConfig) {
  const [forge, setForge] = useState<BaseForge | null>(null);
  const isMounted = useIsMounted();

  useEffect(() => {
    getForge({ config }).then((instance) => {
      if (isMounted()) {
        setForge(instance);
      }
    });
  }, [isMounted, config]);

  return forge;
}
