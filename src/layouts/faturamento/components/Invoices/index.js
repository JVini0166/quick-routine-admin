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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import React, { useEffect, useState } from 'react';
import Envs from "components/Envs"

// Billing page components
import Invoice from "layouts/faturamento/components/Invoice";
import jsPDF from 'jspdf';


function Invoices() {

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);


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
      

        setDashboardData(data);
      } catch (error) {
        setError(error.toString());
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [BACKEND_URL]);

  const generateDates = () => {
    let dates = [];
    let currentDate = new Date();
    for (let i = 0; i < 5; i++) {
        currentDate.setMonth(currentDate.getMonth() - 1);
        dates.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), 5));
    }
    return dates;
};

const invoiceDates = generateDates().map(date => 
    date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })
);

function generatePdfReport(billingData, accessData) {
  const pdf = new jsPDF();

  pdf.setFontSize(18);
  pdf.text('Relatório Mensal', 20, 20);

  if (accessData) {
    pdf.setFontSize(14);
    pdf.text(`Acessos no Mês: ${accessData.register_count}`, 20, 40);
  }

  pdf.setFontSize(14);
  pdf.text('Detalhes de Faturamento:', 20, 60);

  let currentHeight = 70;
  billingData.forEach((item, index) => {
    pdf.setFontSize(12);
    pdf.text(`Plano: ${item.plan_name} - Receita: R$ ${item.total_revenue}`, 20, currentHeight);
    currentHeight += 10;
  });

  // Salva o PDF
  pdf.save('relatorio_mensal.pdf');
}

function generateReportForDate(dateString) {
  const selectedMonth = new Date(dateString).getMonth() + 1; // JavaScript months are 0-indexed
  const selectedYear = new Date(dateString).getFullYear();
  
  if (!dashboardData) return;
  
  const { billingPerMonth, accessPerMonth } = dashboardData;
  
  const billingDataForMonth = billingPerMonth.filter(item => item.month === selectedMonth && item.year === selectedYear);
  const accessDataForMonth = accessPerMonth.month === selectedMonth && accessPerMonth.year === selectedYear ? accessPerMonth : null;

  // Agora você pode gerar o PDF com `billingDataForMonth` e `accessDataForMonth`
  generatePdfReport(billingDataForMonth, accessDataForMonth);
}

// Atualize a parte onde os Invoice components são renderizados para passar a nova função
{invoiceDates.map((date, index) => (
  <Invoice key={index} date={date} id={`#ID-${index}`} price={`R$ ???`} onPdfClick={() => generateReportForDate(date)}/>
))}

return (
  <Card sx={{ height: "100%" }}>
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
              Relatórios
          </MDTypography>
          <MDButton variant="outlined" color="info" size="small">
              Ver todos
          </MDButton>
      </MDBox>
      <MDBox p={2}>
          <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
              {invoiceDates.map((date, index) => (
                  <Invoice key={index} date={date} id={`#ID-${index}`} price={`R$ ???`} onPdfClick={() => {generateReportForDate(date)}}/>
              ))}
          </MDBox>
      </MDBox>
  </Card>
);
}

export default Invoices;
