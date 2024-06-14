import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Images
import awsLogo from "assets/images/logos/aws.png";
import stripeLogo from "assets/images/logos/stripe.png";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

function PaymentMethod() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // States for modals and inputs
  const [openAWS, setOpenAWS] = useState(false);
  const [awsAccessKeyId, setAwsAccessKeyId] = useState("");
  const [awsSecretKey, setAwsSecretKey] = useState("");

  const [openStripe, setOpenStripe] = useState(false);
  const [stripeKey, setStripeKey] = useState("");

  // Handlers for opening and closing modals
  const handleOpenAWS = () => setOpenAWS(true);
  const handleCloseAWS = () => setOpenAWS(false);

  const handleOpenStripe = () => setOpenStripe(true);
  const handleCloseStripe = () => setOpenStripe(false);

  // Save AWS data to local storage
  const handleSaveAWS = () => {
    localStorage.setItem("awsAccessKeyId", awsAccessKeyId);
    localStorage.setItem("awsSecretKey", awsSecretKey);
    handleCloseAWS();
  };

  // Save Stripe data to local storage
  const handleSaveStripe = () => {
    localStorage.setItem("stripeKey", stripeKey);
    handleCloseStripe();
  };

  // Load AWS data from local storage
  useEffect(() => {
    if (openAWS) {
      setAwsAccessKeyId(localStorage.getItem("awsAccessKeyId") || "");
      setAwsSecretKey(localStorage.getItem("awsSecretKey") || "");
    }
  }, [openAWS]);

  // Load Stripe data from local storage
  useEffect(() => {
    if (openStripe) {
      setStripeKey(localStorage.getItem("stripeKey") || "");
    }
  }, [openStripe]);

  return (
    <Card id="delete-account">
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Gerenciar Integrações
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <MDBox
              borderRadius="lg"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={3}
              sx={{
                border: ({ borders: { borderWidth, borderColor } }) =>
                  `${borderWidth[1]} solid ${borderColor}`,
              }}
            >
              <MDBox component="img" src={awsLogo} alt="AWS" width="10%" mr={2} />
              <MDTypography variant="h6" fontWeight="medium">
                Amazon AWS
              </MDTypography>
              <MDBox ml="auto" lineHeight={0} color={darkMode ? "white" : "dark"}>
                <Tooltip title="Edit Card" placement="top">
                  <Icon sx={{ cursor: "pointer" }} fontSize="small" onClick={handleOpenAWS}>
                    edit
                  </Icon>
                </Tooltip>
              </MDBox>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <MDBox
              borderRadius="lg"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={3}
              sx={{
                border: ({ borders: { borderWidth, borderColor } }) =>
                  `${borderWidth[1]} solid ${borderColor}`,
              }}
            >
              <MDBox component="img" src={stripeLogo} alt="Stripe" width="10%" mr={2} />
              <MDTypography variant="h6" fontWeight="medium">
                Stripe
              </MDTypography>
              <MDBox ml="auto" lineHeight={0} color={darkMode ? "white" : "dark"}>
                <Tooltip title="Edit Card" placement="top">
                  <Icon sx={{ cursor: "pointer" }} fontSize="small" onClick={handleOpenStripe}>
                    edit
                  </Icon>
                </Tooltip>
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>

      {/* Modal AWS */}
      <Modal
        open={openAWS}
        onClose={handleCloseAWS}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <MDTypography id="modal-modal-title" variant="h6" component="h2">
            Editar Amazon AWS
          </MDTypography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="aws-access-key-id"
            label="AWS_ACCESS_KEY_ID"
            name="aws-access-key-id"
            autoComplete="aws-access-key-id"
            autoFocus
            value={awsAccessKeyId}
            onChange={(e) => setAwsAccessKeyId(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="aws-access-secret-key"
            label="AWS_ACCESS_SECRET_KEY"
            type="password"
            id="aws-access-secret-key"
            autoComplete="aws-access-secret-key"
            value={awsSecretKey}
            onChange={(e) => setAwsSecretKey(e.target.value)}
          />
          <MDBox mt={2}>
            <MDButton variant="gradient" color="dark" onClick={handleSaveAWS}>
              Salvar
            </MDButton>
          </MDBox>
        </Box>
      </Modal>

      {/* Modal Stripe */}
      <Modal
        open={openStripe}
        onClose={handleCloseStripe}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <MDTypography id="modal-modal-title" variant="h6" component="h2">
            Editar Stripe
          </MDTypography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="stripe-key"
            label="STRIPE_KEY"
            name="stripe-key"
            autoComplete="stripe-key"
            autoFocus
            value={stripeKey}
            onChange={(e) => setStripeKey(e.target.value)}
          />
          <MDBox mt={2}>
            <MDButton variant="gradient" color="dark" onClick={handleSaveStripe}>
              Salvar
            </MDButton>
          </MDBox>
        </Box>
      </Modal>
    </Card>
  );
}

export default PaymentMethod;
