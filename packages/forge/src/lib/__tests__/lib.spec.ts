import { describe, test, expect, vi, beforeEach } from "vitest";
import { Forge } from "..";

describe("Forge", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns default instance config when isnt initialized", () => {
    const forge = new Forge();

    expect(forge.config).toEqual({
      stronghold: { enabled: false },
      command: { enabled: false },
      event: { enabled: false },
    });
  });

  test("returns null for common APIs when instance isnt initialized yet", () => {
    const forge = new Forge();

    expect(forge.stronghold).toBeNull();
    expect(forge.command).toBeNull();
    expect(forge.event).toBeNull();
  });

  test("set config on instance after initialization", async () => {
    const config = {
      stronghold: { enabled: false },
      command: { enabled: true },
      event: { enabled: false },
    };
    const forge = await new Forge().init({ config });

    expect(forge.config).toEqual(config);
  });

  test("returns common APIs implementation after initialization if enabled", async () => {
    const config = {
      stronghold: { enabled: true },
      command: { enabled: true },
      event: { enabled: true },
    };

    const forge = await new Forge().init({ config });

    expect(forge.stronghold).not.toBeNull();
    expect(forge.event).not.toBeNull();
    expect(forge.command).not.toBeNull();
  });
});
