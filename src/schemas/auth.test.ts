import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "./auth";

describe("loginSchema", () => {
  it("should validate a valid login object", () => {
    const validLogin = {
      email: "email@email.com",
      password: "password",
    };

    const result = loginSchema.safeParse(validLogin);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validLogin);
    }
  });

  it("should reject empty email", () => {
    const invalidLogin = {
      email: "",
      password: "password",
    };

    const result = loginSchema.safeParse(invalidLogin);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Email is required");
    }
  });

  it("should reject invalid email format", () => {
    const invalidLogin = {
      email: "not-an-email",
      password: "password",
    };

    const result = loginSchema.safeParse(invalidLogin);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("This is not a valid email");
    }
  });

  it("should reject empty password", () => {
    const invalidLogin = {
      email: "email@email.com",
      password: "",
    };

    const result = loginSchema.safeParse(invalidLogin);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Password is required");
    }
  });

  it("should reject missing fields", () => {
    const invalidLogin1 = { email: "email@email.com" };
    const invalidLogin2 = { password: "password" };

    const result1 = loginSchema.safeParse(invalidLogin1);
    const result2 = loginSchema.safeParse(invalidLogin2);

    expect(result1.success).toBe(false);
    expect(result2.success).toBe(false);
  });

  it("should accept various valid email formats", () => {
    const validEmails = [
      "user@example.com",
      "test.email@domain.co.uk",
      "name+tag@example.org",
      "123@numbers.com"
    ];

    validEmails.forEach(email => {
      const login = { email, password: "password" };
      const result = loginSchema.safeParse(login);
      expect(result.success).toBe(true);
    });
  });
});

describe("registerSchema", () => {
  it("should validate a valid register object", () => {
    const validRegister = {
      email: "user@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "password123",
    };

    const result = registerSchema.safeParse(validRegister);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validRegister);
    }
  });

  it("should reject empty email", () => {
    const invalidRegister = {
      email: "",
      firstName: "John",
      lastName: "Doe",
      password: "password123",
    };

    const result = registerSchema.safeParse(invalidRegister);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Email is required");
    }
  });

  it("should reject invalid email format", () => {
    const invalidRegister = {
      email: "invalid-email",
      firstName: "John",
      lastName: "Doe",
      password: "password123",
    };

    const result = registerSchema.safeParse(invalidRegister);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("This is not a valid email");
    }
  });

  it("should reject empty firstName", () => {
    const invalidRegister = {
      email: "user@example.com",
      firstName: "",
      lastName: "Doe",
      password: "password123",
    };

    const result = registerSchema.safeParse(invalidRegister);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("First name is required");
    }
  });

  it("should reject empty lastName", () => {
    const invalidRegister = {
      email: "user@example.com",
      firstName: "John",
      lastName: "",
      password: "password123",
    };

    const result = registerSchema.safeParse(invalidRegister);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Last name is required");
    }
  });

  it("should reject empty password", () => {
    const invalidRegister = {
      email: "user@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "",
    };

    const result = registerSchema.safeParse(invalidRegister);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Password is required");
    }
  });

  it("should reject missing required fields", () => {
    const incompleteData = [
      { firstName: "John", lastName: "Doe", password: "password123" }, // missing email
      { email: "user@example.com", lastName: "Doe", password: "password123" }, // missing firstName
      { email: "user@example.com", firstName: "John", password: "password123" }, // missing lastName
      { email: "user@example.com", firstName: "John", lastName: "Doe" }, // missing password
    ];

    incompleteData.forEach(data => {
      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  it("should handle names with spaces and special characters", () => {
    const validRegister = {
      email: "user@example.com",
      firstName: "Jean-Pierre",
      lastName: "O'Connor Smith",
      password: "password123",
    };

    const result = registerSchema.safeParse(validRegister);
    expect(result.success).toBe(true);
  });

  it("should reject non-string field types", () => {
    const invalidRegister = {
      email: 123,
      firstName: ["John"],
      lastName: { name: "Doe" },
      password: true,
    };

    const result = registerSchema.safeParse(invalidRegister);
    expect(result.success).toBe(false);
  });
});
