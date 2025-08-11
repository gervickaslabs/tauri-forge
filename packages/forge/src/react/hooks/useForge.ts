import type { BaseForge, SanitizedConfig } from "../../lib/types";
import { getForge } from "../../lib/forge";
import { useEffect, useState } from "react";

export type Forge = BaseForge;

export function useForge(config: SanitizedConfig) {
  const [forge, setForge] = useState<Forge | null>(null);

  useEffect(() => {
    getForge({
      config,
    }).then(setForge);
  }, [config]);

  return forge;
}
