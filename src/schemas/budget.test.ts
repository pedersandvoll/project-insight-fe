import { describe, expect, it } from "vitest";
import { updateBudgetSchema } from "./budget";

describe("newProjectSchema", () => {
  it("should validate a valid budget object", () => {
    const validAssignment = {
      budgetUsed: 999,
    };

    const result = updateBudgetSchema.safeParse(validAssignment);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validAssignment);
    }
  });

  it("should reject non-number budgetUsed field", () => {
    const invalidAssignment = {
      budgetUsed: "999",
    };

    const result = updateBudgetSchema.safeParse(invalidAssignment);
    expect(result.success).toBe(false);
  });

  it("should reject missing budgetUsed field", () => {
    const invalidAssignment = {};

    const result = updateBudgetSchema.safeParse(invalidAssignment);
    expect(result.success).toBe(false);
  });
});
