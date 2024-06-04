// @mui material components
import React, { useState } from "react";
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
import googleplayLogo from "assets/images/logos/googleplay.png";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

function PaymentMethod() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // States for modals
  const [openAWS, setOpenAWS] = useState(false);
  const handleOpenAWS = () => setOpenAWS(true);
  const handleCloseAWS = () => setOpenAWS(false);

  const [openGooglePlay, setOpenGooglePlay] = useState(false);
  const handleOpenGooglePlay = () => setOpenGooglePlay(true);
  const handleCloseGooglePlay = () => setOpenGooglePlay(false);

  return (
    <Card id="delete-account">
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Gerenciar Integrações
        </MDTypography>
        <MDButton variant="gradient" color="dark">
          <Icon sx={{ fontWeight: "bold" }}>add</Icon>
          &nbsp;adicionar integração
        </MDButton>
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
              <MDBox component="img" src={googleplayLogo} alt="Google Play" width="10%" mr={2} />
              <MDTypography variant="h6" fontWeight="medium">
                Google Play
              </MDTypography>
              <MDBox ml="auto" lineHeight={0} color={darkMode ? "white" : "dark"}>
                <Tooltip title="Edit Card" placement="top">
                  <Icon sx={{ cursor: "pointer" }} fontSize="small" onClick={handleOpenGooglePlay}>
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
          />
          <MDBox mt={2}>
            <MDButton variant="gradient" color="dark" onClick={handleCloseAWS}>
              Salvar
            </MDButton>
          </MDBox>
        </Box>
      </Modal>

      {/* Modal Google Play */}
      <Modal
        open={openGooglePlay}
        onClose={handleCloseGooglePlay}
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
            Editar Google Play
          </MDTypography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="google-play-key"
            label="GOOGLE_PLAY_KEY"
            name="google-play-key"
            autoComplete="google-play-key"
            autoFocus
          />
          <MDBox mt={2}>
            <MDButton variant="gradient" color="dark" onClick={handleCloseGooglePlay}>
              Salvar
            </MDButton>
          </MDBox>
        </Box>
      </Modal>
    </Card>
  );
}

export default PaymentMethod;
