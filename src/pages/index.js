import Head from "next/head";
import { Box, Button, Container, Grid, Paper, Stack, Typography, IconButton } from "@mui/material";
import { Budget } from "../components/dashboard/budget";
import { LatestOrders } from "../components/dashboard/latest-orders";
import { LatestProducts } from "../components/dashboard/latest-products";
import { Sales } from "../components/dashboard/sales";
import { TasksProgress } from "../components/dashboard/tasks-progress";
import { TotalCustomers } from "../components/dashboard/total-customers";
import { TotalProfit } from "../components/dashboard/total-profit";
import { TrafficByDevice } from "../components/dashboard/traffic-by-device";
import { DashboardLayout } from "../components/dashboard-layout";
import Sites from "src/components/sites";
import { useSession, signIn, signOut } from "next-auth/react";
import LogoutIcon from "@mui/icons-material/Logout";

const Dashboard = () => {
  const { data: session } = useSession();

  if (session) {
    if (
      session.user.email == "axel.laget@gmail.com" ||
      session.user.email == "labvince@gmail.com"
    ) {
      return (
        <>
          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={3}>
            <Typography color="primary"> {session.user.email}</Typography>
            <IconButton color="primary" onClick={() => signOut()}>
              <LogoutIcon fontSize="large"></LogoutIcon>
            </IconButton>
          </Stack>
          <Head>
            <title>Dendro UI</title>
          </Head>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 8,
            }}
          >
            <Container maxWidth={false}>
              <Sites />
            </Container>
          </Box>
        </>
      );
    }
    return (
      <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={3}>
        <Typography color="error"> You are not authorized {session.user.email}</Typography>
        <IconButton color="error" onClick={() => signOut()}>
          <LogoutIcon fontSize="large"></LogoutIcon>
        </IconButton>
      </Stack>
    );
  }
  return (
    <>
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={4}>
        <Typography variant="h4">Not signed in</Typography>

        <Button size="large" variant="outlined" onClick={() => signIn()}>
          Sign in
        </Button>
      </Stack>
    </>
  );
};
Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Dashboard;
