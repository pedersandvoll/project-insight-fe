import { describe, it, expect } from "vitest";
import { stringAvatar } from "./avatarColor";

describe("stringAvatar", () => {
  it("should generate consistent colors for the same name", () => {
    const avatar1 = stringAvatar("John Doe");
    const avatar2 = stringAvatar("John Doe");

    expect(avatar1.sx.bgcolor).toBe(avatar2.sx.bgcolor);
  });

  it("should generate different colors for different names", () => {
    const avatar1 = stringAvatar("John Doe");
    const avatar2 = stringAvatar("Jane Smith");

    expect(avatar1.sx.bgcolor).not.toBe(avatar2.sx.bgcolor);
  });

  it("should generate valid hex colors", () => {
    const avatar = stringAvatar("John Doe");

    expect(avatar.sx.bgcolor).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("should generate correct initials for two-word names", () => {
    const avatar = stringAvatar("John Doe");

    expect(avatar.children).toBe("JD");
  });

  it("should generate correct initials for multiple names", () => {
    const avatar = stringAvatar("John Michael Doe");

    expect(avatar.children).toBe("JM");
  });

  it("should handle single character names", () => {
    const avatar = stringAvatar("J D");

    expect(avatar.children).toBe("JD");
  });

  it("should handle names with extra spaces", () => {
    const avatar = stringAvatar("John  Doe");

    expect(avatar.children).toBe("JD");
  });

  it("should return object with correct structure", () => {
    const avatar = stringAvatar("Test User");

    expect(avatar).toHaveProperty("sx");
    expect(avatar).toHaveProperty("children");
    expect(avatar.sx).toHaveProperty("bgcolor");
    expect(typeof avatar.sx.bgcolor).toBe("string");
    expect(typeof avatar.children).toBe("string");
  });
});

