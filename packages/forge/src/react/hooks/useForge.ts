import type { BaseForge, SanitizedConfig } from "../../lib/types";
import { getForge } from "../../lib/forge";
import { useEffect, useState } from "react";
import { useIsMounted } from "./utils/useIsMounted";

export function useForge(config: SanitizedConfig) {
  const [forge, setForge] = useState<BaseForge | null>(null);

  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted()) {
      getForge({
        config,
      }).then(setForge);
    }
  }, [isMounted, config]);

  return forge;
}
