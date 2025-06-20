import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { useGetProjects } from "../hooks/project.api";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
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
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { getStatusLabel } from "../utils/getStatusLabel";
import { formatToCurrency } from "../utils/formatToCurrency";
import { getStatusColor } from "../utils/getStatusColor";
import { stringAvatar } from "../utils/avatarColor";
import { ProjectStatus } from "../enums/projectStatus";
import { useGetUsers } from "../hooks/user.api";
import { useForm } from "@tanstack/react-form";
import { type ProjectNameSearchFormSchema } from "../schemas/project";
import CreateProjectForm from "../forms/createProject";

const projectsSearchSchema = z.object({
  status: fallback(z.array(z.string()), []).default([]),
  name: fallback(z.string(), "").default(""),
  createdBy: fallback(z.string(), "").default(""),
  associated: fallback(z.string(), "").default(""),
  newProject: fallback(z.boolean(), false).default(false),
});

export type ProjectSearchFormSchema = z.infer<typeof projectsSearchSchema>;

export const Route = createFileRoute({
  validateSearch: zodValidator(projectsSearchSchema),
  component: ProjectsPage,
});

function ProjectsPage() {
  const theme = useTheme();
  const navigate = Route.useNavigate();
  const { status, name, createdBy, associated, newProject } = Route.useSearch();
  const form = useForm({
    defaultValues: {
      name: name,
    } as ProjectNameSearchFormSchema,
    validators: {
      onChangeAsync: async ({ value }) => {
        navigate({
          search: (prev) => ({
            ...prev,
            name: value.name,
          }),
        });
        return undefined;
      },
    },
    asyncDebounceMs: 500,
  });
  const { data, isLoading, refetch } = useGetProjects({
    status,
    name,
    createdBy,
    associated,
    newProject,
  });
  const { data: usersData, isLoading: usersLoading } = useGetUsers();

  if (isLoading || usersLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        role="status"
        aria-label="Loading projects"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={3}>
        <Typography variant="h6" color="text.secondary">
          No project data available.
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
      aria-label="Projects page"
    >
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        Project Overview
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Grid container spacing={1}>
            <Grid>
              <form aria-label="Search projects by name">
                <form.Field
                  name="name"
                  children={(field) => (
                    <TextField
                      label="Search..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      inputProps={{ "aria-label": "Search projects by name" }}
                    />
                  )}
                />
              </form>
            </Grid>
            <Grid>
              <FormControl fullWidth sx={{ minWidth: 150, maxWidth: 300 }}>
                <InputLabel>Project status</InputLabel>
                <Select
                  multiple
                  label="Project status"
                  size="medium"
                  value={status}
                  onChange={(event) => {
                    const newStatus = event.target.value as string[];
                    navigate({
                      search: (prev) => ({
                        ...prev,
                        status: newStatus,
                      }),
                      replace: true,
                    });
                  }}
                  inputProps={{ "aria-label": "Filter projects by status" }}
                >
                  {Object.values(ProjectStatus)
                    .filter((value) => typeof value === "number")
                    .map((value) => (
                      <MenuItem key={value} value={value.toString()}>
                        {getStatusLabel(value as ProjectStatus)}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            {usersData && (
              <Grid>
                <Autocomplete
                  disablePortal
                  value={usersData.find((user) => user.ID === createdBy)}
                  options={usersData}
                  getOptionLabel={(option) =>
                    option.FirstName + " " + option.LastName
                  }
                  onChange={(_, newValue) => {
                    navigate({
                      search: (prev) => ({
                        ...prev,
                        createdBy: newValue ? newValue.ID : "",
                      }),
                      replace: true,
                    });
                  }}
                  sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Created by"
                      inputProps={{
                        ...params.inputProps,
                        "aria-label": "Filter projects by creator",
                      }}
                    />
                  )}
                />
              </Grid>
            )}
            {usersData && (
              <Grid>
                <Autocomplete
                  disablePortal
                  value={usersData.find((user) => user.ID === associated)}
                  options={usersData}
                  getOptionLabel={(option) =>
                    option.FirstName + " " + option.LastName
                  }
                  onChange={(_, newValue) => {
                    navigate({
                      search: (prev) => ({
                        ...prev,
                        associated: newValue ? newValue.ID : "",
                      }),
                      replace: true,
                    });
                  }}
                  sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Associated"
                      inputProps={{
                        ...params.inputProps,
                        "aria-label": "Filter projects by associated user",
                      }}
                    />
                  )}
                />
              </Grid>
            )}
            <Grid>
              <Button
                onClick={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      newProject: true,
                    }),
                    replace: true,
                  })
                }
                variant="outlined"
                sx={{
                  height: "56px",
                  textTransform: "none",
                }}
                aria-label="Open create new project dialog"
              >
                Create new project
              </Button>
            </Grid>
          </Grid>
          <Dialog
            open={newProject}
            onClose={() =>
              navigate({
                search: (prev) => ({
                  ...prev,
                  newProject: false,
                }),
                replace: true,
              })
            }
            maxWidth="sm"
            fullWidth
            aria-labelledby="create-project-dialog-title"
          >
            <DialogTitle id="create-project-dialog-title">
              Create new project
            </DialogTitle>
            <DialogContent>
              <CreateProjectForm refetch={refetch} />
            </DialogContent>
          </Dialog>

          <TableContainer
            sx={{
              backgroundColor: "white",
              overflowX: "auto",
              "& .MuiTable-root": {
                minWidth: { xs: 600, sm: 650 },
              },
            }}
            role="region"
            aria-label="Projects table"
          >
            <Table aria-label="Projects list">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Status
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      display: { xs: "none", sm: "table-cell" },
                    }}
                  >
                    Estimated Cost
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      display: { xs: "none", sm: "table-cell" },
                    }}
                  >
                    Budget Used
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Created By
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow
                    hover
                    tabIndex={0}
                    onClick={() =>
                      navigate({
                        to: "/$projectId",
                        params: { projectId: row.ID },
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        navigate({
                          to: "/$projectId",
                          params: { projectId: row.ID },
                        });
                      }
                    }}
                    key={row.ID}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:focus": {
                        backgroundColor: "action.hover",
                        outline: "2px solid",
                        outlineColor: "primary.main",
                        outlineOffset: "-2px",
                      },
                    }}
                    role="button"
                    aria-label={`View project ${row.Name} details`}
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
                      {row.Name}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={getStatusLabel(row.Status)}
                        color={getStatusColor(row.Status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ display: { xs: "none", sm: "table-cell" } }}
                    >
                      {formatToCurrency(row.EstimatedCost)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ display: { xs: "none", sm: "table-cell" } }}
                    >
                      {row.Budgets.length > 0
                        ? formatToCurrency(
                            row.Budgets.reduce(
                              (sum, item) => sum + item.BudgetUsed,
                              0,
                            ),
                          )
                        : formatToCurrency(0)}
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          width: "100%",
                          pr: 0,
                        }}
                      >
                        <Avatar
                          {...stringAvatar(
                            `${row.CreatedBy.FirstName} ${row.CreatedBy.LastName}`,
                          )}
                        />
                      </Box>
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
