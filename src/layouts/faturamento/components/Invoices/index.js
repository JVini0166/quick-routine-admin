import React, { useEffect, useState } from 'react';
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Envs from "components/Envs";
import Invoice from "layouts/faturamento/components/Invoice";
import jsPDF from 'jspdf';
import "jspdf-autotable";

function drawBarChart(pdf, labels, data, x, y, width, height) {
  const maxData = Math.max(...data);
  const barWidth = width / data.length;
  
  for (let i = 0; i < data.length; i++) {
    const barHeight = (data[i] / maxData) * height;
    pdf.setFillColor(75, 192, 192);
    pdf.rect(x + i * barWidth, y + height - barHeight, barWidth * 0.8, barHeight, 'F');
    pdf.text(data[i].toString(), x + i * barWidth + barWidth * 0.4, y + height - barHeight - 5, { align: 'center' });
  }

  // Draw labels
  pdf.setFontSize(10);
  for (let i = 0; i < labels.length; i++) {
    pdf.text(labels[i], x + i * barWidth + barWidth * 0.4, y + height + 5, { align: 'center' });
  }
}

async function generatePdfReport(billingData, accessData, monthYearString) {
  console.log('Gerando relatório para:', monthYearString);
  const pdf = new jsPDF();

  // Capa
  pdf.setFontSize(24);
  pdf.text('Relatório Quick Routine', 105, 40, { align: 'center' });
  pdf.setFontSize(18);
  pdf.text(`${monthYearString}`, 105, 50, { align: 'center' });

  // Resumo Executivo
  pdf.setFontSize(18);
  pdf.text('Resumo Executivo', 20, 60);
  pdf.setFontSize(14);
  pdf.text('Este relatório apresenta um resumo detalhado do desempenho financeiro da empresa, incluindo dados de faturamento, lucro e custos com serviços AWS.', 20, 70, { maxWidth: 170 });

  // Faturamento
  pdf.setFontSize(18);
  pdf.text('Faturamento', 20, 90);
  pdf.setFontSize(14);
  pdf.text(`O faturamento total no mês de ${monthYearString} foi de R$ 200,000.`, 20, 100);

  const revenueData = [40000, 35000, 50000, 45000, 30000]; // Dados de exemplo
  drawBarChart(pdf, ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'], revenueData, 20, 130, 160, 80);

  // Lucro
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.text('Lucro', 20, 20);
  pdf.setFontSize(14);
  pdf.text(`O lucro total no mês de ${monthYearString} foi de R$ 50,000.`, 20, 30);

  const profitData = [10000, 12000, 15000, 8000, 5000]; // Dados de exemplo
  drawBarChart(pdf, ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'], profitData, 20, 50, 160, 80);

  // Billing da AWS
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.text('Dados de Billing da AWS', 20, 20);

  const awsBillingData = [
    { service: 'EC2', cost: 'R$ 10,000' },
    { service: 'S3', cost: 'R$ 5,000' },
    { service: 'RDS', cost: 'R$ 7,000' },
    { service: 'Lambda', cost: 'R$ 3,000' },
    { service: 'CloudFront', cost: 'R$ 2,000' }
  ];

  const awsTableColumnNames = ['Serviço', 'Custo'];
  const awsTableRows = awsBillingData.map(item => [item.service, item.cost]);

  pdf.autoTable({
    head: [awsTableColumnNames],
    body: awsTableRows,
    startY: 30,
    styles: { fontSize: 12, cellPadding: 5, overflow: 'linebreak' },
    headStyles: { fillColor: [221, 221, 221] }
  });

  // Assinaturas
  pdf.setFontSize(14);
  pdf.text('______________________________', 20, 40);
  pdf.text('Assinatura do Administrador', 20, 50);
  pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 60);

  // Salva o PDF
  pdf.save('relatorio_empresarial.pdf');
  console.log('PDF gerado e salvo.');
}

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
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i);
      dates.push(date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' }));
    }
    return dates;
  };

  const invoiceDates = generateDates();

  function convertDateStringToDate(dateString) {
    const months = {
      janeiro: 0, fevereiro: 1, março: 2, abril: 3, maio: 4, junho: 5,
      julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11
    };
    const parts = dateString.match(/(\w+)\sde\s(\d+)/);

    if (parts && parts.length === 3) {
      const month = months[parts[1].toLowerCase()];
      const year = parseInt(parts[2], 10);

      return new Date(year, month);
    }

    throw new Error('Formato de data inválido.');
  }

  async function generateReportForDate(dateString) {
    console.log('Data original:', dateString);
    const selectedDate = convertDateStringToDate(dateString);
    const selectedMonth = selectedDate.getMonth() + 1; // JavaScript months are 0-indexed
    const selectedYear = selectedDate.getFullYear();
    const monthYearString = `${selectedDate.toLocaleDateString('pt-BR', { month: 'long' })} de ${selectedYear}`;

    if (!dashboardData) {
      console.log('Nenhum dado de dashboard disponível.');
      alert('Aguarde, estou atualizando os dados');
      return;
    }

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

    await generatePdfReport(billingDataForMonth, accessDataForMonth, monthYearString);
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
            <Invoice key={index} date={date} id={`#ID-${index}`} price={``} onPdfClick={() => {generateReportForDate(date)}} />
          ))}
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Invoices;
