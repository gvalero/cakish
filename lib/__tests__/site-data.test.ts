import { describe, it, expect } from "vitest";
import { products, fillingOptions, finishOptions, getProductBySlug } from "../site-data";
import type { Product } from "../site-data";

describe("products data integrity", () => {
  it("has exactly 4 products", () => {
    expect(products).toHaveLength(4);
  });

  it.each(products.map((p) => [p.name, p]))("'%s' has all required fields", (_name, product) => {
    const p = product as Product;
    expect(p.id).toBeTruthy();
    expect(p.name).toBeTruthy();
    expect(p.slug).toBeTruthy();
    expect(p.tagline).toBeTruthy();
    expect(p.description).toBeTruthy();
    expect(p.image).toBeTruthy();
    expect(Array.isArray(p.gallery)).toBe(true);
    expect(p.sizes.length).toBeGreaterThanOrEqual(1);
    expect(typeof p.hasTopper).toBe("boolean");
    expect(typeof p.topperPrice).toBe("number");
    expect(typeof p.hasFinishOptions).toBe("boolean");
  });

  it("every size has a positive price", () => {
    for (const product of products) {
      for (const size of product.sizes) {
        expect(size.price).toBeGreaterThan(0);
        expect(size.id).toBeTruthy();
        expect(size.label).toBeTruthy();
        expect(size.diameter).toBeTruthy();
        expect(size.serves).toBeTruthy();
      }
    }
  });

  it("every product has a topperPrice of 5", () => {
    for (const product of products) {
      expect(product.topperPrice).toBe(5);
    }
  });

  it("only strawberry-pavlova has hasFinishOptions: true", () => {
    const withFinish = products.filter((p) => p.hasFinishOptions);
    expect(withFinish).toHaveLength(1);
    expect(withFinish[0].id).toBe("strawberry-pavlova");
  });

  it("product IDs are unique", () => {
    const ids = products.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("product slugs are unique", () => {
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getProductBySlug", () => {
  it("returns the correct product for a valid slug", () => {
    const p = getProductBySlug("heart-pavlova");
    expect(p).toBeDefined();
    expect(p!.id).toBe("heart-pavlova");
  });

  it("returns undefined for a non-existent slug", () => {
    expect(getProductBySlug("nonexistent")).toBeUndefined();
  });
});

describe("fillingOptions", () => {
  it("has exactly 2 options", () => {
    expect(fillingOptions).toHaveLength(2);
  });

  it("dulce-de-leche has surcharge 3", () => {
    const opt = fillingOptions.find((f) => f.id === "dulce-de-leche");
    expect(opt).toBeDefined();
    expect(opt!.surcharge).toBe(3);
  });

  it("nutella has surcharge 0", () => {
    const opt = fillingOptions.find((f) => f.id === "nutella");
    expect(opt).toBeDefined();
    expect(opt!.surcharge).toBe(0);
  });
});

describe("finishOptions", () => {
  it("has exactly 2 options", () => {
    expect(finishOptions).toHaveLength(2);
  });

  it("floral has surcharge 18", () => {
    const opt = finishOptions.find((f) => f.id === "floral");
    expect(opt).toBeDefined();
    expect(opt!.surcharge).toBe(18);
  });

  it("patisserie-sliced has surcharge 0", () => {
    const opt = finishOptions.find((f) => f.id === "patisserie-sliced");
    expect(opt).toBeDefined();
    expect(opt!.surcharge).toBe(0);
  });

  it("all options have id, label, surcharge, and description", () => {
    for (const opt of finishOptions) {
      expect(opt.id).toBeTruthy();
      expect(opt.label).toBeTruthy();
      expect(typeof opt.surcharge).toBe("number");
      expect(opt.description).toBeTruthy();
    }
  });
});
