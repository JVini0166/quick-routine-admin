// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/manageadmin/data/authorsTableData";
import projectsTableData from "layouts/manageadmin/data/projectsTableData";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import React, { useEffect, useState } from 'react';

import Envs from 'components/Envs';

function ManageAdmin() {
  const { columns, rows: originalRows } = authorsTableData();
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [rows, setRows] = useState(originalRows);
  const { columns: pColumns, rows: pRows } = projectsTableData();

  const [openCreate, setOpenCreate] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    surname: '',
    role: ''
  });

  const [permissionError, setPermissionError] = useState(false);

  const handleOpenCreate = () => {
    const userInfo = JSON.parse(localStorage.getItem('user_info'));
    if (userInfo.role === 'operator' || userInfo.role === 'viewer') {
      setPermissionError(true);
    } else {
      setOpenCreate(true);
    }
  };

  const handleCloseCreate = () => setOpenCreate(false);

  const handleCreate = () => {
    console.log('Criando usuário:', newUser);
    const url = BACKEND_URL + '/admin/create-user';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Sucesso na criação:', data);
        handleCloseCreate();
      })
      .catch((error) => {
        console.error('Erro na criação:', error);
      });
  };

  // Função para atualizar os campos do novo usuário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const BACKEND_URL = Envs.BACKEND_URL;

  const handleOpen = (user) => {
    const userInfo = JSON.parse(localStorage.getItem('user_info'));
    if (userInfo.role === 'operator' || userInfo.role === 'viewer') {
      setPermissionError(true);
    } else {
      setCurrentUser({
        name: user.username.props.name,
        email: user.username.props.email,
        role: user.role.props.title
      });
      setOpen(true);
    }
  };

  const handleUpdate = () => {
    console.log('Atualizando usuário:', currentUser);

    const url = BACKEND_URL + '/admin/update-user-role';
    const data = {
      email: currentUser.email,
      new_role: currentUser.role
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Sucesso na atualização:', data);
      })
      .catch((error) => {
        console.error('Erro na atualização:', error);
      })
      .finally(() => {
        handleClose();
      });
  };

  const handleDelete = () => {
    console.log('Excluindo usuário:', currentUser);

    const url = BACKEND_URL + '/admin/delete-admin-user';
    const data = { email: currentUser.email };

    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Sucesso na exclusão:', data);
      })
      .catch((error) => {
        console.error('Erro na exclusão:', error);
      })
      .finally(() => {
        handleClose();
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClosePermissionError = () => {
    setPermissionError(false);
  };

  // Mapeamento dos valores para rótulos
  const roleMapping = {
    admin: 'Admin',
    operator: 'Operador',
    viewer: 'Visualizador'
  };

  // Função para obter a chave do mapeamento pelo valor
  const getKeyByValue = (object, value) => Object.keys(object).find(key => object[key] === value);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    const updatedRows = originalRows.map(row => ({
      ...row,
      action: (
        <Button
          onClick={() => handleOpen(row)}
          variant="contained"
          color="primary"
          style={{ color: 'white' }}
        >
          Edit
        </Button>
      ),
    }));
    setRows(updatedRows);
  }, [originalRows]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Usuários do Admin
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>

            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <h2 id="modal-title">Editar Role</h2>
          <form>
            <TextField
              label="Name"
              value={currentUser.name || ''}
              margin="normal"
              fullWidth
              disabled
            />
            <TextField
              label="Email"
              value={currentUser.email || ''}
              margin="normal"
              fullWidth
              disabled
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-select-label">Função</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={roleMapping[currentUser.role] || ''}
                label="Função"
                onChange={(e) => setCurrentUser({ ...currentUser, role: getKeyByValue(roleMapping, e.target.value) })}
                sx={{ height: 48 }}
              >
                {Object.entries(roleMapping).map(([key, value]) => (
                  <MenuItem key={key} value={value}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ mt: 2 }}>
              <Button onClick={handleUpdate} color="primary" variant="contained" style={{ color: 'white' }}>
                Atualizar
              </Button>
              <Button onClick={handleDelete} color="error" variant="contained" sx={{ ml: 2 }}>
                Excluir
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      <MDBox pt={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleOpenCreate} color="primary" variant="contained" style={{ color: 'white' }}>
          Criar Usuário
        </Button>
      </MDBox>
      <Modal
        open={openCreate}
        onClose={handleCloseCreate}
        aria-labelledby="modal-create-title"
      >
        <Box sx={style}>
          <h2 id="modal-create-title">Criar Novo Usuário</h2>
          <form>
            <TextField
              label="Nome de Usuário"
              name="username"
              value={newUser.username}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Senha"
              name="password"
              type="password"
              value={newUser.password}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              label="E-mail"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Nome"
              name="name"
              value={newUser.name}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Sobrenome"
              name="surname"
              value={newUser.surname}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-create-select-label">Função</InputLabel>
              <Select
                labelId="role-create-select-label"
                id="role-create-select"
                name="role"
                value={newUser.role}
                label="Função"
                onChange={handleChange}
                sx={{ height: 48 }}
              >
                {Object.entries(roleMapping).map(([key, value]) => (
                  <MenuItem key={key} value={key}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ mt: 2 }}>
              <Button onClick={handleCreate} color="primary" variant="contained" style={{ color: 'white' }}>
                Criar
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      <Modal
        open={permissionError}
        onClose={handleClosePermissionError}
        aria-labelledby="modal-permission-error-title"
      >
        <Box sx={style}>
          <h2 id="modal-permission-error-title">Permissão Insuficiente</h2>
          <p>Você não tem permissão suficiente para realizar esta ação.</p>
          <Box sx={{ mt: 2 }}>
            <Button onClick={handleClosePermissionError} color="primary" variant="contained">
              Fechar
            </Button>
          </Box>
        </Box>
      </Modal>
      <Footer />
    </DashboardLayout>
  );
}

export default ManageAdmin;
