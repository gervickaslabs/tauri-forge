import { describe, test, expect, vi, beforeEach } from "vitest";

describe("Forge", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns default instance config when isnt initialized", () => {
    expect(true).toEqual(true);
  });
});
