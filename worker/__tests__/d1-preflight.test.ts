import { describe, expect, it } from "vitest";
import { validateD1Binding } from "../../scripts/check-d1-binding.mjs";

describe("D1 deployment preflight", () => {
  it("rejects a commented, missing, or placeholder DB binding", () => {
    expect(() => validateD1Binding(`
# [[d1_databases]]
# binding = "DB"
# database_id = "replace-with-real-d1-id"
`)).toThrow(/active.*DB/i);
    expect(() => validateD1Binding(`
[[d1_databases]]
binding = "DB"
database_id = "replace-with-real-d1-id"
`)).toThrow(/database_id/i);
  });

  it("accepts an active DB binding with a real-shaped database ID", () => {
    expect(validateD1Binding(`
[[d1_databases]]
binding = "DB"
database_name = "cakish-orders-production"
database_id = "12345678-1234-4abc-8def-1234567890ab"
migrations_dir = "migrations"
`)).toBe(true);
  });
});
