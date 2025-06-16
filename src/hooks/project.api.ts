import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import type { ProjectDashboardDTO, ProjectDTO } from "../types/api";
import {
  getProjectById,
  getProjectDashboard,
  getProjects,
  postAssignUserToProject,
  postProject,
  updateProjectStatus,
} from "../api/project";
import type { ProjectSearchFormSchema } from "../routes/projects";
import type { ProjectStatus } from "../enums/projectStatus";
import type {
  AssignUserToProjectFormSchema,
  NewProjectFormSchema,
} from "../schemas/project";

export const useGetProjectDashboard = () => {
  return useQuery({
    queryKey: ["ProjectDashboard"],
    queryFn: (): Promise<ProjectDashboardDTO> => getProjectDashboard(),
  });
};

export const useGetProjects = (filters: ProjectSearchFormSchema) => {
  return useQuery({
    queryKey: ["Projects", filters],
    queryFn: (): Promise<ProjectDTO[]> => getProjects(filters),
    staleTime: 1000,
    placeholderData: keepPreviousData,
  });
};

export const useGetProjectByIdOptions = (projectId: string) => {
  return queryOptions({
    queryKey: ["ProjectById", projectId],
    queryFn: (): Promise<ProjectDTO> => getProjectById(projectId),
  });
};

export const useGetProjectById = (projectId: string) => {
  return useQuery(useGetProjectByIdOptions(projectId));
};

export const useUpdateProjectStatus = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: (model: {
      projectId: string;
      status: ProjectStatus;
    }): Promise<ProjectDTO> =>
      updateProjectStatus(model.projectId, model.status),
    onSuccess: () => onSuccess(),
  });
};

export const usePostAssignUserToProject = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: (model: {
      projectId: string;
      form: AssignUserToProjectFormSchema;
    }): Promise<ProjectDTO> =>
      postAssignUserToProject(model.projectId, model.form),
    onSuccess: () => onSuccess(),
  });
};

export const usePostProject = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: (
      model: NewProjectFormSchema,
    ): Promise<{ message: string; budgetId: string }> => postProject(model),
    onSuccess: () => onSuccess(),
  });
};
