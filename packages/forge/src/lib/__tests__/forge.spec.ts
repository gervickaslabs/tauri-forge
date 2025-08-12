import { describe, test, expect, vi, beforeEach } from "vitest";
import { getForge } from "../forge";
import { Forge } from "..";
import { SanitizedConfig } from "../types";

describe("getForge", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls init once for same config reference", async () => {
    const config = {
      event: {
        enabled: true,
      },
    } as SanitizedConfig;

    const options = { config };

    vi.spyOn(Forge.prototype, "init");

    let forgeInstance = await getForge(options);
    forgeInstance = await getForge(options);

    expect(forgeInstance.init).toHaveBeenCalledTimes(1);
  });

  test("return same instance for same config reference", async () => {
    const config = {
      event: {
        enabled: true,
      },
    } as SanitizedConfig;

    const options = { config };

    const forgeInstance = await getForge(options);
    const forgeInstance2 = await getForge(options);

    expect(forgeInstance).toBe(forgeInstance2);
  });

  test("return different instance for different config reference", async () => {
    const config = {
      event: {
        enabled: true,
      },
    } as SanitizedConfig;

    const options = { config };

    const forgeInstance = await getForge(options);

    const config2 = {
      event: {
        enabled: false,
      },
    } as SanitizedConfig;

    const options2 = { config: config2 };

    const forgeInstance2 = await getForge(options2);

    expect(forgeInstance).not.toBe(forgeInstance2);
  });

  test('return a custom instance if "CustomForge" is provided', async () => {
    const config = {
      event: {
        enabled: true,
      },
    } as SanitizedConfig;

    const options = { config };

    class MyCustomForge extends Forge {}

    const forgeInstance = await getForge(options, MyCustomForge);

    expect(forgeInstance).toBeInstanceOf(MyCustomForge);
  });
});
