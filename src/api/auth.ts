import type { LoginFormSchema, RegisterFormSchema } from "../schemas/auth";
import type { UserDTO } from "../types/api";
import { apiFetch, createHeaders } from "./client";

export async function loginUser(model: LoginFormSchema): Promise<string> {
  const responseData = await apiFetch<{ token: string }>("auth/login", {
    method: "POST",
    body: JSON.stringify(model),
    headers: createHeaders(false),
  });

  return responseData.token;
}

export async function registerUser(model: RegisterFormSchema): Promise<number> {
  const responseData = await apiFetch<{ userid: number }>("auth/register", {
    method: "POST",
    body: JSON.stringify(model),
    headers: createHeaders(false),
  });

  return responseData.userid;
}

export async function getCurrentUser() {
  const responseData = await apiFetch<UserDTO>("auth/currentuser", {
    method: "GET",
    headers: createHeaders(),
  });

  return responseData;
}
