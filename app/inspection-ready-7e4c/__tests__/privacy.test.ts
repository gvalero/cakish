import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { metadata } from "../layout";

const privatePath = "/inspection-ready-7e4c/";

describe("inspection pack privacy controls", () => {
  it("sets route metadata to noindex and nofollow", () => {
    expect(metadata.robots).toMatchObject({
      index: false,
      follow: false,
      nocache: true,
    });
  });

  it("blocks the route in crawler and AI guidance files", () => {
    const robots = readFileSync(resolve("public", "robots.txt"), "utf8");
    const llms = readFileSync(resolve("public", "llms.txt"), "utf8");
    const headers = readFileSync(resolve("public", "_headers"), "utf8");

    expect(robots).toContain(`Disallow: ${privatePath}`);
    expect(llms).toContain(privatePath);
    expect(headers).toContain(`${privatePath}*`);
    expect(headers).toContain("X-Robots-Tag: noindex, nofollow");
  });

  it("does not expose the route through the sitemap", () => {
    const sitemap = readFileSync(resolve("public", "sitemap.xml"), "utf8");

    expect(sitemap).not.toContain(privatePath);
  });
});
