import { ProjectStatus } from "../enums/projectStatus";

export const getStatusLabel = (status: ProjectStatus): string => {
  switch (status) {
    case ProjectStatus.Concept:
      return "Concept";
    case ProjectStatus.Planning:
      return "Planning";
    case ProjectStatus.ReadyToStart:
      return "Ready to Start";
    case ProjectStatus.InProgress:
      return "In Progress";
    case ProjectStatus.OnHold:
      return "On Hold";
    case ProjectStatus.Delayed:
      return "Delayed";
    case ProjectStatus.Issues:
      return "Issues";
    case ProjectStatus.Completed:
      return "Completed";
    case ProjectStatus.Cancelled:
      return "Cancelled";
    default:
      return "Unknown";
  }
};
