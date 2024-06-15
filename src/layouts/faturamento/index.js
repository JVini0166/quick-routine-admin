import React, { useState, useEffect } from 'react';
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MasterCard from "examples/Cards/MasterCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import PaymentMethod from "layouts/faturamento/components/PaymentMethod";
import Invoices from "layouts/faturamento/components/Invoices";
import BillingInformation from "layouts/faturamento/components/BillingInformation";
import Transactions from "layouts/faturamento/components/Transactions";
import Values from "components/Values";

function Billing() {
  const [monthBilling, setMonthBilling] = useState(0);
  const [profit, setProfit] = useState(0);
  const amazonCost = Values.AMAZON_AWS_COST;
  const stripeGain = Values.STRIPE_GAIN;

  useEffect(() => {
    const billingCache = localStorage.getItem('billingCache');
    if (billingCache) {
      const data = JSON.parse(billingCache);
      if (data && data.monthBilling) {
        setMonthBilling(data.monthBilling);
      } else {
        setMonthBilling(stripeGain);
      }
    } else {
      setMonthBilling(stripeGain);
    }
  }, [stripeGain]);

  useEffect(() => {
    setProfit((monthBilling - amazonCost).toFixed(2));
  }, [monthBilling, amazonCost]);

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} xl={6}>
                  <MasterCard number={4562112245947852} holder="josé vinícius" expires="11/26" />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon="account_balance"
                    title="faturamento"
                    description="Receitas geradas ao total"
                    value={`R$ ${monthBilling}`}
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon="account_balance"
                    title="lucro"
                    description="Líquido ao final"
                    value={`R$ ${profit}`}
                  />
                </Grid>
                <Grid item xs={12}>
                  <PaymentMethod />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Invoices />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <BillingInformation />
            </Grid>
            <Grid item xs={12} md={5}>
              <Transactions />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
