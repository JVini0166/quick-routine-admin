import React, { useEffect, useState } from 'react';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Simulação de imagens, substitua conforme necessário
import defaultUserImage from "assets/images/default-user.jpg";
import CircularProgress from '@mui/material/CircularProgress';
import Envs from 'components/Envs'

export default function AdminUsersTable() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const BACKEND_URL = Envs.BACKEND_URL;

  useEffect(() => {
  setIsLoading(true); // Inicia o carregamento
  fetch(BACKEND_URL + '/admin/get-app-users')
    .then(response => response.json())
    .then(data => {
      setUsers(data);
      setIsLoading(false); // Finaliza o carregamento
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setIsLoading(false); // Finaliza o carregamento mesmo em caso de erro
    });
}, []);


  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image || defaultUserImage} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
    </MDBox>
  );

  const rows = users.map(user => ({
    username: <Author image={defaultUserImage} name={`${user.name} ${user.surname}`} email={user.email} />,
    role: <Job title={user.plan} />,
    status: (
      <MDBox ml={-1}>
        <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
      </MDBox>
    ),
    dateCreated: "N/A", // Você precisará adicionar um campo de data na sua API se quiser mostrar datas
    action: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        Edit
      </MDTypography>
    ),
  }));

  return {
    columns: [
      { Header: "usuario", accessor: "username", width: "45%", align: "left" },
      { Header: "plano", accessor: "role", align: "left" },
      // { Header: "status", accessor: "status", align: "center" },
      { Header: "criado em", accessor: "dateCreated", align: "center" },
      { Header: "ação", accessor: "action", align: "center" },
    ],
    rows: rows,
  };
}
