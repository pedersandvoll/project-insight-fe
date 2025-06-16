import { useQuery } from "@tanstack/react-query";
import type { UserDTO } from "../types/api";
import { getUsers, getUsersFromRole } from "../api/user";
import type { UserRole } from "../enums/userRole";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["Users"],
    queryFn: (): Promise<UserDTO[]> => getUsers(),
  });
};

export const useGetUsersByRole = (role: UserRole) => {
  return useQuery({
    queryKey: ["UsersByRole", role],
    queryFn: (): Promise<UserDTO[]> => getUsersFromRole(role),
  });
};
