import type { SanitizedConfig } from "../../lib/types";
import { Forge, getForge } from "../../lib/forge";
import { useEffect, useState } from "react";

export function useForge(config: SanitizedConfig) {
  const [forge, setForge] = useState<Forge | null>(null);

  useEffect(() => {
    getForge({
      config,
    }).then(setForge);
  }, [config]);

  return forge;
}
