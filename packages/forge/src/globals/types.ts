export interface GlobalConfig {
  debug?: boolean;
}

export interface SanitizedGlobalConfig extends Required<GlobalConfig> {
  debug: boolean;
}
