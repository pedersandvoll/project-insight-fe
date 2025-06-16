import { ProjectStatus } from "../enums/projectStatus";

export const getStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.Completed:
      return "success";
    case ProjectStatus.InProgress:
      return "primary";
    case ProjectStatus.Issues:
    case ProjectStatus.Delayed:
      return "error";
    case ProjectStatus.OnHold:
      return "warning";
    case ProjectStatus.Cancelled:
      return "default";
    default:
      return "info";
  }
};
