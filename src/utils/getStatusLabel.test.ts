import { describe, it, expect } from "vitest";
import { getStatusLabel } from "./getStatusLabel";
import { ProjectStatus } from "../enums/projectStatus";

describe("getStatusLabel", () => {
  it('should return "Unknown" for invalid status values', () => {
    expect(getStatusLabel(999 as ProjectStatus)).toBe("Unknown");
    expect(getStatusLabel(-1 as ProjectStatus)).toBe("Unknown");
  });

  it("should handle all enum values", () => {
    const allRoles = [
      { role: ProjectStatus.Concept, expected: "Concept" },
      { role: ProjectStatus.Planning, expected: "Planning" },
      { role: ProjectStatus.ReadyToStart, expected: "Ready to Start" },
      { role: ProjectStatus.InProgress, expected: "In Progress" },
      { role: ProjectStatus.OnHold, expected: "On Hold" },
      { role: ProjectStatus.Delayed, expected: "Delayed" },
      { role: ProjectStatus.Issues, expected: "Issues" },
      { role: ProjectStatus.Completed, expected: "Completed" },
      { role: ProjectStatus.Cancelled, expected: "Cancelled" },
    ];

    allRoles.forEach(({ role, expected }) => {
      expect(getStatusLabel(role)).toBe(expected);
    });
  });

  it("should return string type for all inputs", () => {
    expect(typeof getStatusLabel(ProjectStatus.Concept)).toBe("string");
    expect(typeof getStatusLabel(999 as ProjectStatus)).toBe("string");
  });
});
