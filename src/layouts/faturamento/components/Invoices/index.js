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
import "jspdf-autotable";

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
        dates.push(new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 5));
    }
    return dates;
  };

  const invoiceDates = generateDates().map(date => 
      date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })
  );

  function convertDateStringToDate(dateString) {
    const months = {
      janeiro: 0, fevereiro: 1, março: 2, abril: 3, maio: 4, junho: 5,
      julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11
    };
    const parts = dateString.match(/(\d+)\sde\s(\w+)\sde\s(\d+)/);
  
    if (parts && parts.length === 4) {
      const day = parseInt(parts[1], 10);
      const month = months[parts[2].toLowerCase()];
      const year = parseInt(parts[3], 10);
  
      return new Date(year, month, day);
    }
  
    throw new Error('Formato de data inválido.');
  }

  function generatePdfReport(billingData, accessData, monthYearString) {
    const pdf = new jsPDF();
  
    pdf.setFontSize(18);
    pdf.text('Relatório Mensal', 20, 20);
    pdf.setFontSize(14);
    pdf.text(`Mês: ${monthYearString}`, 20, 30); // Adicionando o mês e ano no relatório
  
    if (accessData) {
      pdf.setFontSize(14);
      pdf.text(`Acessos no Mês: ${accessData.register_count}`, 20, 40);
    }
  
    pdf.setFontSize(14);
    pdf.text('Detalhes de Faturamento:', 20, 50);
  
    // Configurações da tabela
    const tableColumnNames = ['Plano', 'Receita'];
    const tableRows = billingData.map(item => [item.plan_name, `R$ ${item.total_revenue}`]);
  
    // Adiciona a tabela ao PDF
    pdf.autoTable({
        head: [tableColumnNames],
        body: tableRows,
        startY: 60, // Ajuste este valor conforme necessário para posicionar a tabela
        styles: { fontSize: 12, cellPadding: 5, overflow: 'linebreak' },
        headStyles: { fillColor: [221, 221, 221] }, // Adiciona cor de fundo ao cabeçalho
    });
  
    // Salva o PDF
    pdf.save('relatorio_mensal.pdf');
}

  
  function generateReportForDate(dateString) {
    console.log('Data original:', dateString);
    const selectedDate = convertDateStringToDate(dateString);
    const selectedMonth = selectedDate.getMonth() + 1; // JavaScript months are 0-indexed
    const selectedYear = selectedDate.getFullYear();
    const monthYearString = `${selectedDate.toLocaleDateString('pt-BR', { month: 'long' })} de ${selectedYear}`;
  
    if (!dashboardData) return;
  
    const accessDataForMonth = (dashboardData.accessPerMonth.month === selectedMonth && dashboardData.accessPerMonth.year === selectedYear)
      ? dashboardData.accessPerMonth
      : null;
  
    const billingDataForMonth = dashboardData.billingPerMonth.filter(item => {
      const itemMonth = Math.round(item.month);
      const itemYear = Math.round(item.year);
      return itemMonth === selectedMonth && itemYear === selectedYear;
    });
  
    console.log('Selected Month:', selectedMonth, 'Selected Year:', selectedYear);
    console.log('Billing data for month:', billingDataForMonth);
    console.log('Access data for month:', accessDataForMonth);
  
    generatePdfReport(billingDataForMonth, accessDataForMonth, monthYearString);
  }




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
