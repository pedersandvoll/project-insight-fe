import { useQuery } from "@tanstack/react-query";
import type { UserDTO } from "../types/api";
import { getUsers } from "../api/user";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["Users"],
    queryFn: (): Promise<UserDTO[]> => getUsers(),
  });
};
