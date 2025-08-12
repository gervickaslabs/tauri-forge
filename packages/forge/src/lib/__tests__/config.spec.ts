// config.spec.ts
import { expect, test, describe } from "vitest";
import { buildConfig } from "../config";
import type { ForgeConfig, SanitizedConfig } from "../types";

describe("buildConfig", () => {
  test("returns defaults when no options are provided", () => {
    const config = buildConfig();
    const expected: SanitizedConfig = {
      stronghold: { enabled: false },
      command: { enabled: false },
      event: { enabled: false },
    };
    expect(config).toEqual(expected);
  });

  test("respects provided true values", () => {
    const options: ForgeConfig = {
      stronghold: { enabled: true },
      command: { enabled: true },
      event: { enabled: true },
    };
    const config = buildConfig(options);
    expect(config).toEqual(options);
  });

  test("respects provided false values", () => {
    const options: ForgeConfig = {
      stronghold: { enabled: false },
      command: { enabled: false },
      event: { enabled: false },
    };
    const config = buildConfig(options);
    expect(config).toEqual(options);
  });

  test("merges defaults for missing properties", () => {
    const options: ForgeConfig = {
      stronghold: { enabled: false },
    };
    const config = buildConfig(options);
    expect(config).toEqual({
      stronghold: { enabled: false },
      command: { enabled: false },
      event: { enabled: false },
    });
  });

  test("ignores extra properties in options", () => {
    const options = {
      stronghold: { enabled: true },
      extra: { something: 123 },
    } as unknown as ForgeConfig;

    const config = buildConfig(options);
    expect(config).toEqual({
      stronghold: { enabled: true },
      command: { enabled: false },
      event: { enabled: false },
    });
  });
});
