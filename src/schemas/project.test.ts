import { describe, it, expect } from "vitest";
import {
  newProjectSchema,
  projectNameSearchSchema,
  assignUserToProjectSchema,
} from "./project";
import { ProjectStatus } from "../enums/projectStatus";
import { UserRole } from "../enums/userRole";

describe("newProjectSchema", () => {
  it("should validate a valid project object", () => {
    const validProject = {
      name: "Test Project",
      description: "A test project description",
      status: ProjectStatus.Concept,
      estimatedCost: 50000,
    };

    const result = newProjectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validProject);
    }
  });

  it("should reject project with empty name", () => {
    const invalidProject = {
      name: "",
      description: "A test project description",
      status: ProjectStatus.Concept,
      estimatedCost: 50000,
    };

    const result = newProjectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name is required");
    }
  });

  it("should reject project with empty description", () => {
    const invalidProject = {
      name: "Test Project",
      description: "",
      status: ProjectStatus.Concept,
      estimatedCost: 50000,
    };

    const result = newProjectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Description is required");
    }
  });

  it("should reject project with invalid status", () => {
    const invalidProject = {
      name: "Test Project",
      description: "A test project description",
      status: 999,
      estimatedCost: 50000,
    };

    const result = newProjectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
  });

  it("should reject project with non-number estimatedCost", () => {
    const invalidProject = {
      name: "Test Project",
      description: "A test project description",
      status: ProjectStatus.Concept,
      estimatedCost: "not a number",
    };

    const result = newProjectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
  });

  it("should accept all valid ProjectStatus enum values", () => {
    const statuses = [
      ProjectStatus.Concept,
      ProjectStatus.Planning,
      ProjectStatus.ReadyToStart,
      ProjectStatus.InProgress,
      ProjectStatus.OnHold,
      ProjectStatus.Delayed,
      ProjectStatus.Issues,
      ProjectStatus.Completed,
      ProjectStatus.Cancelled,
    ];

    statuses.forEach((status) => {
      const project = {
        name: "Test Project",
        description: "A test project description",
        status,
        estimatedCost: 50000,
      };

      const result = newProjectSchema.safeParse(project);
      expect(result.success).toBe(true);
    });
  });
});

describe("projectNameSearchSchema", () => {
  it("should validate a valid search object", () => {
    const validSearch = { name: "test project" };

    const result = projectNameSearchSchema.safeParse(validSearch);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validSearch);
    }
  });

  it("should validate empty string", () => {
    const validSearch = { name: "" };

    const result = projectNameSearchSchema.safeParse(validSearch);
    expect(result.success).toBe(true);
  });

  it("should reject non-string name", () => {
    const invalidSearch = { name: 123 };

    const result = projectNameSearchSchema.safeParse(invalidSearch);
    expect(result.success).toBe(false);
  });

  it("should reject missing name field", () => {
    const invalidSearch = {};

    const result = projectNameSearchSchema.safeParse(invalidSearch);
    expect(result.success).toBe(false);
  });
});

describe("assignUserToProjectSchema", () => {
  it("should validate a valid assignment object", () => {
    const validAssignment = {
      role: UserRole.Developer,
      userId: "user-123",
    };

    const result = assignUserToProjectSchema.safeParse(validAssignment);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validAssignment);
    }
  });

  it("should accept all valid UserRole enum values", () => {
    const roles = [
      UserRole.Projectlead,
      UserRole.Contactperson,
      UserRole.Techlead,
      UserRole.Developer,
      UserRole.Designer,
    ];

    roles.forEach((role) => {
      const assignment = {
        role,
        userId: "user-123",
      };

      const result = assignUserToProjectSchema.safeParse(assignment);
      expect(result.success).toBe(true);
    });
  });

  it("should reject invalid role", () => {
    const invalidAssignment = {
      role: 999,
      userId: "user-123",
    };

    const result = assignUserToProjectSchema.safeParse(invalidAssignment);
    expect(result.success).toBe(false);
  });

  it("should reject non-string userId", () => {
    const invalidAssignment = {
      role: UserRole.Developer,
      userId: 123,
    };

    const result = assignUserToProjectSchema.safeParse(invalidAssignment);
    expect(result.success).toBe(false);
  });

  it("should reject missing fields", () => {
    const invalidAssignment1 = { role: UserRole.Developer };
    const invalidAssignment2 = { userId: "user-123" };

    const result1 = assignUserToProjectSchema.safeParse(invalidAssignment1);
    const result2 = assignUserToProjectSchema.safeParse(invalidAssignment2);

    expect(result1.success).toBe(false);
    expect(result2.success).toBe(false);
  });
});

