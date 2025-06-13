import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import type { LoginFormSchema, RegisterFormSchema } from "../schemas/auth";
import { getCurrentUser, loginUser, registerUser } from "../api/auth";
import type { UserDTO } from "../types/api";

export const useLoginUser = (onSuccess: () => void) => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (model: LoginFormSchema): Promise<string> => loginUser(model),
    onSuccess: (token) => {
      login(token);
      onSuccess();
    },
  });
};

export const useRegisterUser = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: (model: RegisterFormSchema): Promise<number> =>
      registerUser(model),
    onSuccess: () => onSuccess(),
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["CurrentUser"],
    queryFn: (): Promise<UserDTO> => getCurrentUser(),
  });
};
