import {
  Card,
  CardContent,
  Typography,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
} from "@mui/material";
import type { ProjectDashboardDTO, UserDTO } from "../../types/api";
import { getStatusLabel } from "../../utils/getStatusLabel";
import { getStatusColor } from "../../utils/getStatusColor";
import { formatToCurrency } from "../../utils/formatToCurrency";
import { useNavigate } from "@tanstack/react-router";

interface DashboardProps {
  data: ProjectDashboardDTO;
  currentUser: UserDTO;
}

export const DashboardTable = (props: DashboardProps) => {
  const { data, currentUser } = props;
  const navigate = useNavigate();

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2 }}>
          Recent Projects
        </Typography>
        <Grid container spacing={1}>
          <Grid>
            <Chip
              label="View all projects"
              color="primary"
              variant="outlined"
              size="medium"
              onClick={() =>
                navigate({
                  to: "/projects",
                })
              }
            />
          </Grid>
          <Grid>
            <Chip
              label="View projects associated to you"
              color="primary"
              variant="outlined"
              size="medium"
              onClick={() =>
                navigate({
                  to: "/projects",
                  search: { associated: currentUser.ID },
                })
              }
            />
          </Grid>
          <Grid>
            <Chip
              label="View projects created by you"
              color="primary"
              variant="outlined"
              size="medium"
              onClick={() =>
                navigate({
                  to: "/projects",
                  search: { createdBy: currentUser.ID },
                })
              }
            />
          </Grid>
        </Grid>
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
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Budget Used
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.RecentProjects.map((row) => (
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
                      outlineOffset: "-2px"
                    }
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
                  <TableCell align="right">
                    {row.Budgets.length > 0
                      ? formatToCurrency(
                          row.Budgets.reduce(
                            (sum, item) => sum + item.BudgetUsed,
                            0,
                          ),
                        )
                      : formatToCurrency(0)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
