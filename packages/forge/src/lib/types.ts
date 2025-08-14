import { BaseCommandAdapter } from "@tauriforge/forge/lib/command";
import { BaseEventAdapter } from "@tauriforge/forge/lib/event";
import { BaseStrongholdAdapter } from "@tauriforge/forge/lib/stronghold";

export interface ForgeConfig {
  stronghold?: {
    enabled?: boolean;
  };
  command?: {
    enabled?: boolean;
  };
  event?: {
    enabled?: boolean;
  };
}

export interface SanitizedConfig {
  stronghold: {
    enabled: boolean;
  };
  command: {
    enabled: boolean;
  };
  event: {
    enabled: boolean;
  };
}

export interface InitOptions {
  config: SanitizedConfig;
  /// @dev: todo
  // onInit
}

export interface BaseForge {
  init: (options: InitOptions) => Promise<BaseForge>;
  config: SanitizedConfig;
  stronghold: BaseStrongholdAdapter | null;
  command: BaseCommandAdapter | null;
  event: BaseEventAdapter | null;
}
