import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import type { ProjectDashboardDTO, ProjectDTO } from "../types/api";
import {
  getProjectById,
  getProjectDashboard,
  getProjects,
} from "../api/project";
import type { ProjectSearchFormSchema } from "../routes/projects";

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
