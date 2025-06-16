import { ProjectStatus } from "../enums/projectStatus";
import {
  useGetProjectById,
  useGetProjectByIdOptions,
  useUpdateProjectStatus,
} from "../hooks/project.api";
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Stack,
  Card,
  CardContent,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Divider,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { getStatusLabel } from "../utils/getStatusLabel";
import { formatToCurrency } from "../utils/formatToCurrency";
import { Gauge } from "@mui/x-charts/Gauge";
import z from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import BudgetForm from "../forms/updateBudget";
import { useNavigate } from "@tanstack/react-router";
import { getRoleLabel } from "../utils/getRoleLabel";
import AssignUserForm from "../forms/assignUserRow";
import { useGetCurrentUser } from "../hooks/auth.api";
import { useGetUsers } from "../hooks/user.api";

const projectSchema = z.object({
  updateBudget: fallback(z.boolean(), false).default(false),
  assignUser: fallback(z.boolean(), false).default(false),
});

export const Route = createFileRoute({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      useGetProjectByIdOptions(params.projectId),
    );
  },
  validateSearch: zodValidator(projectSchema),
});

function RouteComponent() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { projectId } = Route.useParams();
  const { updateBudget, assignUser } = Route.useSearch();
  const { data, isLoading, refetch } = useGetProjectById(projectId);
  const { data: currentUser, isLoading: currentUserLoading } =
    useGetCurrentUser();
  const { data: usersData, isLoading: usersLoading } = useGetUsers();
  const { mutateAsync: updateProjectStatus } = useUpdateProjectStatus(refetch);

  if (isLoading || currentUserLoading || usersLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
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

  if (!currentUser || !usersData) {
    return navigate({ to: "/login" });
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 2, sm: 3 },
        minHeight: "100vh",
        backgroundColor: theme.palette.grey[50],
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        {data.Name}
      </Typography>
      <Stack gap={3}>
        <Card variant="outlined">
          <CardContent>
            <Stack direction="row" alignItems="center">
              <Typography variant="h6" gutterBottom>
                Project Details
              </Typography>
              <FormControl sx={{ marginLeft: "auto" }}>
                <Select
                  size="small"
                  value={data.Status}
                  onChange={(event) => {
                    updateProjectStatus({
                      projectId: projectId,
                      status: event.target.value,
                    });
                  }}
                >
                  {Object.values(ProjectStatus)
                    .filter((value) => typeof value === "number")
                    .map((value) => (
                      <MenuItem key={value} value={value}>
                        {getStatusLabel(value as ProjectStatus)}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Stack>
            <Box sx={{ maxWidth: "900px" }}>
              <Typography variant="subtitle2">{data.Description}</Typography>
            </Box>
            <Divider sx={{ marginTop: 2 }} />
            <Stack direction="row" alignItems="center">
              <Typography variant="h6" marginTop={2}>
                Budget Details
              </Typography>
              <Button
                onClick={() =>
                  navigate({
                    to: "/$projectId",
                    params: { projectId: projectId },
                    search: { updateBudget: true },
                  })
                }
                variant="outlined"
                size="medium"
                sx={{
                  marginLeft: "auto",
                  marginTop: 2,
                  color: "black",
                  textTransform: "none",
                  borderColor: "#C4C4C4",
                }}
              >
                Add Budget Entry
              </Button>
            </Stack>
            <Grid container spacing={3}>
              <Grid>
                <Typography variant="body2" color="text.secondary">
                  Estimated Cost
                </Typography>
                <Typography variant="h6">
                  {formatToCurrency(data.EstimatedCost)}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="body2" color="text.secondary">
                  Budget Used
                </Typography>
                <Typography variant="h6">
                  {data.Budgets.length > 0
                    ? formatToCurrency(
                        data.Budgets.reduce(
                          (sum, item) => sum + item.BudgetUsed,
                          0,
                        ),
                      )
                    : formatToCurrency(0)}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="body2" color="text.secondary">
                  Remaining Budget
                </Typography>
                <Typography
                  variant="h6"
                  color={(() => {
                    const budgetUsed =
                      data.Budgets.length > 0
                        ? data.Budgets.reduce(
                            (sum, item) => sum + item.BudgetUsed,
                            0,
                          )
                        : 0;
                    const percentage =
                      data.EstimatedCost > 0
                        ? Math.round((budgetUsed / data.EstimatedCost) * 100)
                        : 0;
                    if (percentage >= 90) return "error.main";
                    if (percentage >= 75) return "warning.main";
                    return "success.main";
                  })()}
                >
                  {formatToCurrency(
                    data.EstimatedCost -
                      (data.Budgets.length > 0
                        ? data.Budgets.reduce(
                            (sum, item) => sum + item.BudgetUsed,
                            0,
                          )
                        : 0),
                  )}
                </Typography>
              </Grid>
              <Grid>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Budget Usage
                  </Typography>
                  <Gauge
                    width={120}
                    height={120}
                    value={
                      data.EstimatedCost > 0
                        ? Math.round(
                            ((data.Budgets.length > 0
                              ? data.Budgets.reduce(
                                  (sum, item) => sum + item.BudgetUsed,
                                  0,
                                )
                              : 0) /
                              data.EstimatedCost) *
                              100,
                          )
                        : 0
                    }
                    startAngle={-110}
                    endAngle={110}
                    text={({ value }) => `${value}%`}
                    sx={(theme) => {
                      const percentage =
                        data.EstimatedCost > 0
                          ? Math.round(
                              ((data.Budgets.length > 0
                                ? data.Budgets.reduce(
                                    (sum, item) => sum + item.BudgetUsed,
                                    0,
                                  )
                                : 0) /
                                data.EstimatedCost) *
                                100,
                            )
                          : 0;
                      return {
                        [`& .MuiGauge-valueText`]: {
                          fontSize: "1rem",
                          fontWeight: "bold",
                        },
                        [`& .MuiGauge-referenceArc`]: {
                          fill: theme.palette.grey[200],
                        },
                        [`& .MuiGauge-valueArc`]: {
                          fill:
                            percentage < 75
                              ? theme.palette.success.main
                              : percentage < 90
                                ? theme.palette.warning.main
                                : theme.palette.error.main,
                        },
                      };
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
            <Dialog
              open={updateBudget}
              onClose={() =>
                navigate({
                  to: "/$projectId",
                  params: { projectId: projectId },
                  search: { updateBudget: false },
                })
              }
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Add Budget Entry</DialogTitle>
              <DialogContent>
                <BudgetForm
                  refetch={refetch}
                  projectId={projectId}
                  estimatedCost={data.EstimatedCost}
                  currentBudgetUsed={
                    data.Budgets.length > 0
                      ? data.Budgets.reduce(
                          (sum, item) => sum + item.BudgetUsed,
                          0,
                        )
                      : 0
                  }
                />
              </DialogContent>
            </Dialog>
            <Divider sx={{ marginTop: 2 }} />
            <Stack direction="row" alignItems="center">
              <Typography variant="h6" marginTop={2}>
                Resource Details
              </Typography>
              <Button
                onClick={() =>
                  navigate({
                    to: "/$projectId",
                    params: { projectId: projectId },
                    search: { assignUser: true },
                  })
                }
                variant="outlined"
                size="medium"
                sx={{
                  marginLeft: "auto",
                  marginTop: 2,
                  color: "black",
                  textTransform: "none",
                  borderColor: "#C4C4C4",
                }}
              >
                Assign user to project
              </Button>
            </Stack>
            <TableContainer
              sx={{
                backgroundColor: "white",
                overflowX: "auto",
                "& .MuiTable-root": {
                  minWidth: { xs: 600, sm: 650 },
                },
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Role
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      Joined project
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.AssociatedUsers.map((user) => (
                    <TableRow
                      hover
                      // onClick={() =>
                      //   navigate({
                      //     to: "/$projectId",
                      //     params: { projectId: row.ID },
                      //   })
                      // }
                      key={user.ID}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
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
                        {user.User.FirstName + " " + user.User.LastName}
                      </TableCell>
                      <TableCell align="right">
                        {getRoleLabel(user.Role)}
                      </TableCell>
                      <TableCell align="right">
                        {new Date(user.CreatedAt).toLocaleDateString("nb-NO")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Dialog
              open={assignUser}
              onClose={() =>
                navigate({
                  to: "/$projectId",
                  params: { projectId: projectId },
                  search: { assignUser: false },
                })
              }
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Assign user</DialogTitle>
              <DialogContent>
                <AssignUserForm
                  refetch={refetch}
                  projectId={projectId}
                  currentUser={currentUser}
                  usersData={usersData}
                />
              </DialogContent>
            </Dialog>
            <Divider sx={{ marginTop: 2 }} />
            <Grid container spacing={3} marginTop={2}>
              <Grid>
                <Typography variant="caption" color="text.secondary">
                  Created:{" "}
                  {new Date(data.CreatedAt).toLocaleDateString("nb-NO")} -{" "}
                  {data.CreatedBy.FirstName + " " + data.CreatedBy.LastName}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="caption" color="text.secondary">
                  Modified:{" "}
                  {new Date(data.ModifiedAt).toLocaleDateString("nb-NO")} -{" "}
                  {data.ModifiedBy.FirstName + " " + data.ModifiedBy.LastName}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
