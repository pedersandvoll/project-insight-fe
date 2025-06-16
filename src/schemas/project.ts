import { z } from "zod";
import { UserRole } from "../enums/userRole";
import { ProjectStatus } from "../enums/projectStatus";

export const newProjectSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  status: z.nativeEnum(ProjectStatus),
  estimatedCost: z.number(),
});

export type NewProjectFormSchema = z.infer<typeof newProjectSchema>;

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
