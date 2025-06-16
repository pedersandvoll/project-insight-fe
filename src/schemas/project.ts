import { z } from "zod";
import { UserRole } from "../enums/userRole";

export const projectNameSearchSchema = z.object({
  name: z.string(),
});

export type ProjectNameSearchFormSchema = z.infer<
  typeof projectNameSearchSchema
>;

export const assignUserToProjectSchema = z.object({
  role: z.nativeEnum(UserRole),
  userId: z.string(),
});

export type AssignUserToProjectFormSchema = z.infer<
  typeof assignUserToProjectSchema
>;
