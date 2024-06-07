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
import Card from "@mui/material/Card";
// import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
// import MDButton from "components/MDButton";

// Billing page components
import Transaction from "layouts/faturamento/components/Transaction";

function Transactions() {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Transações do Mês
        </MDTypography>
        <MDBox display="flex" alignItems="flex-start">
          <MDBox color="text" mr={0.5} lineHeight={0}>
            <Icon color="inherit" fontSize="small">
              date_range
            </Icon>
          </MDBox>
          <MDTypography variant="button" color="text" fontWeight="regular">
            23 - 30 March 2020
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox pt={3} pb={2} px={2}>
        <MDBox mb={2}>
          <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
            Recentes
          </MDTypography>
        </MDBox>
        <MDBox
          component="ul"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
          sx={{ listStyle: "none" }}
        >
          <Transaction
            color="error"
            icon="expand_more"
            name="Amazon AWS"
            description="04 Jun 2024"
            value="- R$ 204,32"
          />
          <Transaction
            color="success"
            icon="expand_less"
            name="Stripe"
            description="04 Jun 2024"
            value="+ R$ 29.98"
          />
        </MDBox>
        <MDBox mt={1} mb={2}>
          <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
            Ontem
          </MDTypography>
        </MDBox>
        <MDBox
          component="ul"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
          sx={{ listStyle: "none" }}
        >
          <Transaction
            color="success"
            icon="expand_less"
            name="Stripe"
            description="04 Jun 2024"
            value="+ R$ 0"
          />
          <Transaction
            color="success"
            icon="expand_less"
            name="Stripe"
            description="04 Jun 2024"
            value="+ R$ 0"
          />
          <Transaction
            color="success"
            icon="expand_less"
            name="Boleto"
            description="26 March 2020, at 08:30 AM"
            value="+ R$ 0"
          />
          <Transaction
            color="dark"
            icon="priority_high"
            name="Webflow"
            description="26 March 2020, at 05:00 AM"
            value="Pending"
          />
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Transactions;
