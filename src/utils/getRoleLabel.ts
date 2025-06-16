import { UserRole } from "../enums/userRole";

export const getRoleLabel = (status: UserRole): string => {
  switch (status) {
    case UserRole.Projectlead:
      return "Project lead";
    case UserRole.Contactperson:
      return "Contact person";
    case UserRole.Techlead:
      return "Tech lead";
    case UserRole.Developer:
      return "Developer";
    case UserRole.Designer:
      return "Designer";
    default:
      return "Unknown";
  }
};
