import { describe, test, expect, vi, beforeEach } from "vitest";

import { Forge } from "@tauriforge/forge/instance";

import type { SanitizedConfig } from "@tauriforge/forge/config/types";

describe("Forge", () => {
  let defaultConfig = {};

  const commandAdapter = {
    initialize: vi.fn(),
  };

  const eventAdapter = {
    initialize: vi.fn(),
  };

  const commandFactory = {
    name: "command",
    create: vi.fn(() => commandAdapter),
  };

  const eventFactory = {
    name: "event",
    create: vi.fn(() => eventAdapter),
  };

  const loggerFactory = {
    create: vi.fn(() => console),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    defaultConfig = {
      adapters: {
        command: commandFactory,
        event: eventFactory,
      },
      logger: loggerFactory,
      global: { debug: true },
    };
  });

  test("throw error if initialized twice", async () => {
    const forge = new Forge();
    await forge.initialize(defaultConfig as SanitizedConfig);
  });
});
