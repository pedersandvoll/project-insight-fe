import { Box, Card, CardContent, Typography, Grid, Chip } from "@mui/material";
import { Gauge } from "@mui/x-charts/Gauge";
import type { ProjectDashboardDTO } from "../../types/api";
import { getStatusLabel } from "../../utils/getStatusLabel";
import { getStatusColor } from "../../utils/getStatusColor";
import { formatToCurrency } from "../../utils/formatToCurrency";
import { useNavigate } from "@tanstack/react-router";

interface DashboardProps {
  data: ProjectDashboardDTO;
}

export const Dashboard = (props: DashboardProps) => {
  const { data } = props;
  const navigate = useNavigate();

  const budgetPercentage =
    data.TotalEstimated > 0
      ? Math.round((data.TotalUsed / data.TotalEstimated) * 100)
      : 0;

  return (
    <Box>
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        Project Overview Dashboard
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            variant="outlined"
            sx={{ height: "100%" }}
            role="region"
            aria-label="Total projects metric"
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                Total Projects
              </Typography>
              <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                {data.TotalProjects}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            variant="outlined"
            sx={{ height: "100%" }}
            role="region"
            aria-label="Estimated budget metric"
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                Estimated Budget
              </Typography>
              <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                {formatToCurrency(data.TotalEstimated)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            variant="outlined"
            sx={{ height: "100%" }}
            role="region"
            aria-label="Used budget metric"
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                Used Budget
              </Typography>
              <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                {formatToCurrency(data.TotalUsed)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            variant="outlined"
            sx={{ height: "100%" }}
            role="region"
            aria-label="Budget utilization gauge"
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
                textAlign="center"
              >
                Budget Utilization
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 120, md: 150 },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Gauge
                  value={budgetPercentage}
                  startAngle={-110}
                  endAngle={110}
                  text={({ value }) => `${value}%`}
                  aria-label={`Budget utilization gauge showing ${budgetPercentage}% utilization`}
                  sx={(theme) => ({
                    [`& .MuiGauge-valueText`]: {
                      fontSize: { xs: "1.2rem", md: "1.5rem" },
                      fontWeight: "bold",
                    },
                    [`& .MuiGauge-referenceArc`]: {
                      fill: theme.palette.grey[300],
                    },
                    [`& .MuiGauge-valueArc`]: {
                      fill:
                        budgetPercentage < 75
                          ? theme.palette.success.main
                          : budgetPercentage < 90
                            ? theme.palette.warning.main
                            : theme.palette.error.main,
                    },
                  })}
                />
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Estimated vs. Used
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            variant="outlined"
            sx={{ height: "100%" }}
            role="region"
            aria-label="Projects by status"
          >
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Projects by Status
              </Typography>
              <Grid container spacing={1}>
                {data.ByStatus.map((statusData) => (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }} key={statusData.status}>
                    <Chip
                      label={`${getStatusLabel(statusData.status)} (${
                        statusData.count
                      })`}
                      color={getStatusColor(statusData.status)}
                      variant="outlined"
                      size="medium"
                      onClick={() =>
                        navigate({
                          to: "/projects",
                          search: { status: [statusData.status.toString()] },
                        })
                      }
                      aria-label={`Filter projects by ${getStatusLabel(statusData.status)} status (${statusData.count} projects)`}
                      sx={{
                        width: "100%",
                        justifyContent: "flex-start",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        "& .MuiChip-label": {
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          px: { xs: 1, sm: 2 },
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
