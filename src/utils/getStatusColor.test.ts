import { describe, it, expect } from "vitest";
import { getStatusColor } from "./getStatusColor";
import { ProjectStatus } from "../enums/projectStatus";

describe("getStatusColor", () => {
  it('should return "Info" for invalid status values', () => {
    expect(getStatusColor(999 as ProjectStatus)).toBe("info");
    expect(getStatusColor(-1 as ProjectStatus)).toBe("info");
  });

  it("should handle all enum values", () => {
    const allRoles = [
      { role: ProjectStatus.Concept, expected: "info" },
      { role: ProjectStatus.Planning, expected: "info" },
      { role: ProjectStatus.ReadyToStart, expected: "info" },
      { role: ProjectStatus.InProgress, expected: "primary" },
      { role: ProjectStatus.OnHold, expected: "warning" },
      { role: ProjectStatus.Delayed, expected: "error" },
      { role: ProjectStatus.Issues, expected: "error" },
      { role: ProjectStatus.Completed, expected: "success" },
      { role: ProjectStatus.Cancelled, expected: "default" },
    ];

    allRoles.forEach(({ role, expected }) => {
      expect(getStatusColor(role)).toBe(expected);
    });
  });

  it("should return string type for all inputs", () => {
    expect(typeof getStatusColor(ProjectStatus.Concept)).toBe("string");
    expect(typeof getStatusColor(999 as ProjectStatus)).toBe("string");
  });
});
