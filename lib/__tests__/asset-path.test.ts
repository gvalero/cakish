import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { assetPath } from "../asset-path";

/**
 * We need to manipulate process.env.NEXT_PUBLIC_BASE_PATH.
 * Since asset-path.ts captures it at module-load time, we use
 * vitest's module re-import to test different env values.
 */

describe("assetPath", () => {
  const originalEnv = process.env.NEXT_PUBLIC_BASE_PATH;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.NEXT_PUBLIC_BASE_PATH;
    } else {
      process.env.NEXT_PUBLIC_BASE_PATH = originalEnv;
    }
  });

  describe("when NEXT_PUBLIC_BASE_PATH is empty/undefined", () => {
    beforeEach(() => {
      delete process.env.NEXT_PUBLIC_BASE_PATH;
    });

    it("returns path with leading slash as-is", async () => {
      const mod = await import("../asset-path?v=1");
      expect(mod.assetPath("/images/hero.jpg")).toBe("/images/hero.jpg");
    });

    it("returns path without leading slash as-is", async () => {
      const mod = await import("../asset-path?v=2");
      expect(mod.assetPath("images/hero.jpg")).toBe("images/hero.jpg");
    });

    it("returns empty string for empty input", async () => {
      const mod = await import("../asset-path?v=3");
      expect(mod.assetPath("")).toBe("");
    });
  });

  describe("when NEXT_PUBLIC_BASE_PATH is set to /cakish", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_BASE_PATH = "/cakish";
    });

    it("prepends basePath to path with leading slash", async () => {
      const mod = await import("../asset-path?v=4");
      expect(mod.assetPath("/images/hero.jpg")).toBe("/cakish/images/hero.jpg");
    });

    it("prepends basePath to path without leading slash", async () => {
      const mod = await import("../asset-path?v=5");
      expect(mod.assetPath("images/hero.jpg")).toBe("/cakishimages/hero.jpg");
    });

    it("returns just basePath for empty input", async () => {
      const mod = await import("../asset-path?v=6");
      expect(mod.assetPath("")).toBe("/cakish");
    });
  });

  // Test with the currently loaded module (basePath from env at test start)
  describe("static import (current env)", () => {
    it("is a function", () => {
      expect(typeof assetPath).toBe("function");
    });

    it("returns a string", () => {
      expect(typeof assetPath("/test")).toBe("string");
    });
  });
});
