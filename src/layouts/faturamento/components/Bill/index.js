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
import React, { useEffect, useState } from "react";
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Envs from "components/Envs";
// Material Dashboard 2 React context
import { useMaterialUIController } from "context";



function Bill({ noGutter }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [plans, setPlans] = useState([]);

  const BACKEND_URL = Envs.BACKEND_URL;

  useEffect(() => {
    fetch(BACKEND_URL + "/admin/plans")
      .then(response => response.json())
      .then(data => setPlans(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      {plans.map((plan) => (
        <MDBox
          key={plan.id}
          component="li"
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          bgColor={darkMode ? "transparent" : "grey-100"}
          borderRadius="lg"
          p={3}
          mb={noGutter ? 0 : 1}
          mt={2}
        >
          <MDBox width="100%" display="flex" flexDirection="column">
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              flexDirection={{ xs: "column", sm: "row" }}
              mb={2}
            >
              <MDTypography variant="button" fontWeight="medium" textTransform="capitalize">
                {plan.display_name}
              </MDTypography>

              <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
                <MDBox mr={1}>
                  <MDButton variant="text" color="error">
                    <Icon>delete</Icon>&nbsp;delete
                  </MDButton>
                </MDBox>
                <MDButton variant="text" color={darkMode ? "white" : "dark"}>
                  <Icon>edit</Icon>&nbsp;edit
                </MDButton>
              </MDBox>
            </MDBox>
            <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
                Nome de expoisição:&nbsp;&nbsp;&nbsp;
                <MDTypography variant="caption" fontWeight="medium">
                  {plan.display_name}
                </MDTypography>
              </MDTypography>
            </MDBox>
            <MDBox mb={1} lineHeight={0}>
              <MDTypography variant="caption" color="text">
                Nome do plano:&nbsp;&nbsp;&nbsp;
                <MDTypography variant="caption" fontWeight="medium">
                  {plan.plan_name}
                </MDTypography>
              </MDTypography>
              </MDBox>
              <MDBox mb={1} lineHeight={0}>
              <MDTypography variant="caption" color="text">
                Preço:&nbsp;&nbsp;&nbsp;
                <MDTypography variant="caption" fontWeight="medium">
                  R$ {plan.price}
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      ))}
    </div>
  );
}

Bill.defaultProps = {
  noGutter: false,
};

Bill.propTypes = {
  noGutter: PropTypes.bool,
};

export default Bill;
