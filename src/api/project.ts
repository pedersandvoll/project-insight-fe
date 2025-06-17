import type { ProjectStatus } from "../enums/projectStatus";
import type { ProjectSearchFormSchema } from "../routes/projects";
import type {
  AssignUserToProjectFormSchema,
  NewProjectFormSchema,
} from "../schemas/project";
import type { ProjectDashboardDTO, ProjectDTO } from "../types/api";
import { apiFetch, createHeaders } from "./client";

const addParam = (params: URLSearchParams, key: string, value: string) => {
  if (value) {
    params.append(key, value);
  }
};

const addArrayParam = (
  params: URLSearchParams,
  key: string,
  values: string[],
) => {
  if (values.length > 0) {
    params.set(key, values.join(","));
  }
};

export async function getProjectDashboard() {
  const responseData = await apiFetch<ProjectDashboardDTO>(
    "project/dashboard",
    {
      method: "GET",
      headers: createHeaders(),
    },
  );

  return responseData;
}

export async function getProjects(filters: ProjectSearchFormSchema) {
  const params = new URLSearchParams();

  addArrayParam(params, "status", filters.status);
  addParam(params, "name", filters.name);
  addParam(params, "createdBy", filters.createdBy);
  addParam(params, "associated", filters.associated);

  const endpoint = `project?${params.toString()}`;

  const responseData = await apiFetch<ProjectDTO[]>(endpoint, {
    method: "GET",
    headers: createHeaders(),
  });

  return responseData;
}

export async function getProjectById(projectId: string) {
  const responseData = await apiFetch<ProjectDTO>(`project/${projectId}`, {
    method: "GET",
    headers: createHeaders(),
  });

  return responseData;
}

export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus,
) {
  const responseData = await apiFetch<ProjectDTO>(
    `project/status/${projectId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ status: status }),
      headers: createHeaders(),
    },
  );

  return responseData;
}

export async function postAssignUserToProject(
  projectId: string,
  model: AssignUserToProjectFormSchema,
) {
  const responseData = await apiFetch<ProjectDTO>(
    `project/assign/${projectId}`,
    {
      method: "POST",
      body: JSON.stringify(model),
      headers: createHeaders(),
    },
  );

  return responseData;
}

export async function postProject(model: NewProjectFormSchema) {
  const responseData = await apiFetch<{ message: string; budgetId: string }>(
    "project/create",
    {
      method: "POST",
      body: JSON.stringify(model),
      headers: createHeaders(),
    },
  );

  return responseData;
}
