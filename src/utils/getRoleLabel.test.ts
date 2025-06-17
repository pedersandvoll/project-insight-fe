import { describe, it, expect } from "vitest";
import { getRoleLabel } from "./getRoleLabel";
import { UserRole } from "../enums/userRole";

describe("getRoleLabel", () => {
  it('should return "Unknown" for invalid role values', () => {
    expect(getRoleLabel(999 as UserRole)).toBe("Unknown");
    expect(getRoleLabel(-1 as UserRole)).toBe("Unknown");
  });

  it("should handle all enum values", () => {
    const allRoles = [
      { role: UserRole.Projectlead, expected: "Project lead" },
      { role: UserRole.Contactperson, expected: "Contact person" },
      { role: UserRole.Techlead, expected: "Tech lead" },
      { role: UserRole.Developer, expected: "Developer" },
      { role: UserRole.Designer, expected: "Designer" },
    ];

    allRoles.forEach(({ role, expected }) => {
      expect(getRoleLabel(role)).toBe(expected);
    });
  });

  it("should return string type for all inputs", () => {
    expect(typeof getRoleLabel(UserRole.Developer)).toBe("string");
    expect(typeof getRoleLabel(999 as UserRole)).toBe("string");
  });
});

