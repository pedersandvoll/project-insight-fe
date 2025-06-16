import type { ProjectStatus } from "../enums/projectStatus";
import type { UserRole } from "../enums/userRole";

interface BaseDTO {
  ID: string;
  CreatedAt: Date;
}

export interface UserDTO extends BaseDTO {
  FirstName: string;
  LastName: string;
  Email: string;
  Roles: string[] | null;
}

export interface ProjectDashboardDTO {
  ByStatus: DashboardStatus[];
  TotalEstimated: number;
  TotalProjects: number;
  TotalUsed: number;
  RecentProjects: DashboardProject[];
}

export interface DashboardStatus {
  status: ProjectStatus;
  count: number;
}

export interface DashboardProject extends BaseDTO {
  Name: string;
  Status: ProjectStatus;
  EstimatedCost: number;
  Budgets: BudgetDTO[];
  CreatedBy: string;
}

export interface ProjectDTO extends BaseDTO {
  Name: string;
  Description: string;
  Status: ProjectStatus;
  EstimatedCost: number;
  CreatedByID: string;
  CreatedBy: UserDTO;
  ModifiedAt: string;
  ModifiedByID: string;
  ModifiedBy: UserDTO;
  Budgets: BudgetDTO[];
  AssociatedUsers: AssociatedUserDTO[];
}

export interface BudgetDTO extends BaseDTO {
  BudgetUsed: number;
}

interface AssociatedUserDTO extends BaseDTO {
  ProjectID: string;
  UserID: string;
  User: UserDTO;
  Role: UserRole;
}
