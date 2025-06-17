import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import z from "zod";
import { UserRole } from "../enums/userRole";
import { useGetUsersByRole } from "../hooks/user.api";
import { getRoleLabel } from "../utils/getRoleLabel";

const usersSearchSchema = z.object({
  role: fallback(z.nativeEnum(UserRole), UserRole.Projectlead).default(
    UserRole.Projectlead,
  ),
});

export const Route = createFileRoute({
  validateSearch: zodValidator(usersSearchSchema),
  component: UsersPage,
});

function UsersPage() {
  const theme = useTheme();
  const navigate = Route.useNavigate();
  const { role } = Route.useSearch();
  const { data, isLoading } = useGetUsersByRole(role);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        role="status"
        aria-label="Loading users"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={3}>
        <Typography variant="h6" color="text.secondary">
          No user data available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 2, sm: 3 },
        minHeight: "100vh",
        backgroundColor: theme.palette.grey[50],
      }}
      role="main"
      aria-label="Users page"
    >
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        User Overview
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Grid container spacing={1}>
            <FormControl fullWidth sx={{ minWidth: 150, maxWidth: 300 }}>
              <InputLabel>User role</InputLabel>
              <Select
                label="User role"
                size="medium"
                value={role}
                onChange={(event) => {
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      role: event.target.value,
                    }),
                    replace: true,
                  });
                }}
                inputProps={{ "aria-label": "Filter users by role" }}
              >
                {Object.values(UserRole)
                  .filter((value) => typeof value === "number")
                  .map((value) => (
                    <MenuItem key={value} value={value}>
                      {getRoleLabel(value)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <TableContainer
            sx={{
              backgroundColor: "white",
              overflowX: "auto",
              "& .MuiTable-root": {
                minWidth: { xs: 600, sm: 650 },
              },
            }}
            role="region"
            aria-label="Users table"
          >
            <Table aria-label="Users list">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      display: { xs: "none", sm: "table-cell" },
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    Created at
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((user) => (
                  <TableRow
                    key={user.ID}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        maxWidth: { xs: 120, sm: 200 },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.FirstName + " " + user.LastName}
                    </TableCell>
                    <TableCell align="right">{user.Email}</TableCell>
                    <TableCell align="right">
                      {new Date(user.CreatedAt).toLocaleDateString("nb-NO")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
