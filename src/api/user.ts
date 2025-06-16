import type { UserDTO } from "../types/api";
import { apiFetch, createHeaders } from "./client";

export async function getUsers() {
  const responseData = await apiFetch<UserDTO[]>("user", {
    method: "GET",
    headers: createHeaders(),
  });

  return responseData;
}
