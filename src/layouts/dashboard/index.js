/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
// import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import React, { useEffect, useState } from 'react';
import Envs from "components/Envs";
  


function Dashboard() {
  const { sales, tasks } = reportsLineChartData;

  const [dashboardData, setDashboardData] = useState(null);
  const [reportsBarChartData, setReportsBarChartData] = useState({ labels: [], datasets: [] });
  const [billingChartData, setBillingChartData] = useState({ labels: [], datasets: [] });
  const [todayData, setTodayData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const BACKEND_URL = Envs.BACKEND_URL;
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(BACKEND_URL + '/admin/dashboard');
        if (!response.ok) throw new Error('A resposta não foi 200.');
        const data = await response.json();

        // Mapeia os dados para as arrays de labels e data
         // Apenas a primeira letra do dia
        const datasetData = data.accessPerWeekDay.map(item => item.register_count);
        
        setReportsBarChartData({
          labels: ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
          datasets: { label: "Acessos por dia da semana", data: datasetData }
        });

        const monthsMap = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        let revenuePerMonth = Array(12).fill(0); // Inicializa um array com 12 meses

        data.billingPerMonth.forEach(item => {
          if (item.month && item.total_revenue) {
            revenuePerMonth[Math.floor(item.month) - 1] += item.total_revenue;
          }
        });

        setBillingChartData({
          labels: monthsMap,
          datasets: { label: "Faturamento por mês", data: revenuePerMonth }
        });

        setDashboardData(data);
      } catch (error) {
        setError(error.toString());
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [BACKEND_URL]);

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Ativos no momento"
                count={0}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "que semana passada",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Acessos de hoje"
                count={
                  isLoading ? "Carregando..." : dashboardData?.todayAccessAmount ?? "Carregando..."
                }
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "que o mês passado",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Faturamento do mês"
                count={
                  isLoading ? "Carregando..." : dashboardData?.monthBilling + " R$" ?? "Carregando..."
                }
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "mais que ontem",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Novos Registros no mês"
                count={
                  isLoading ? "Carregando..." : dashboardData?.monthNewRegister ?? "Carregando..."
                }
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Atualizado agora",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Acessos por dia de semana"
                  description="Quantidade de acessos por dia da semana."
                  date="atualizado agora"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Faturamento aos meses"
                  description={
                    <>
                      (<strong>+15%</strong>) de aumento de conversões.
                    </>
                  }
                  date="atualizado agora"
                  chart={billingChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Acessos mensais"
                  description="Quantidade de acessos durante os meses."
                  date="atualizado agora"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
