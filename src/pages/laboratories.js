import Head from "next/head";
import { Budget } from "../components/dashboard/budget";
import { LatestOrders } from "../components/dashboard/latest-orders";
import { LatestProducts } from "../components/dashboard/latest-products";
import { Sales } from "../components/dashboard/sales";
import { TasksProgress } from "../components/dashboard/tasks-progress";
import { TotalCustomers } from "../components/dashboard/total-customers";
import { TotalProfit } from "../components/dashboard/total-profit";
import { TrafficByDevice } from "../components/dashboard/traffic-by-device";
import { DashboardLayout } from "../components/dashboard-layout";

import Laboratories from "src/components/laboratories";

import { Box, Button, Container, Grid, Paper, Stack, Typography, IconButton } from "@mui/material";
import { useSession, signIn, signOut } from "next-auth/react";
import LogoutIcon from "@mui/icons-material/Logout";
import { authorizedUsers } from "src/utils/authorizedUsers";

const Dashboard = () => {
  const { data: session } = useSession();
  if (session) {

    if (authorizedUsers.includes(session.user.email)) {

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
            }}
          >
            <Container maxWidth={false}>
              <Laboratories />
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
