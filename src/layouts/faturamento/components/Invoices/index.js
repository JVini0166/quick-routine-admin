import React, { useEffect, useState } from 'react';
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Envs from "components/Envs";
import Invoice from "layouts/faturamento/components/Invoice";
import jsPDF from 'jspdf';
import "jspdf-autotable";
import Values from "components/Values";

function drawBarChart(pdf, labels, data, x, y, width, height) {
  const maxData = Math.max(...data);
  const barWidth = width / data.length;
  
  for (let i = 0; i < data.length; i++) {
    const barHeight = (data[i] / maxData) * height;
    pdf.setFillColor(75, 192, 192);
    if (!isNaN(x + i * barWidth) && !isNaN(y + height - barHeight) && !isNaN(barWidth * 0.8) && !isNaN(barHeight)) {
      pdf.rect(x + i * barWidth, y + height - barHeight, barWidth * 0.8, barHeight, 'F');
      pdf.text(data[i].toString(), x + i * barWidth + barWidth * 0.4, y + height - barHeight - 5, { align: 'center' });
    }
  }

  // Draw labels
  pdf.setFontSize(10);
  for (let i = 0; i < labels.length; i++) {
    if (!isNaN(x + i * barWidth + barWidth * 0.4) && !isNaN(y + height + 5)) {
      pdf.text(labels[i], x + i * barWidth + barWidth * 0.4, y + height + 5, { align: 'center' });
    }
  }
}

async function generatePdfReport(billingData, accessData, stripeDataForMonth, monthYearString) {
  const amazonCost = Values.AMAZON_AWS_COST;
  const stripeGain = Values.STRIPE_GAIN;
  
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
  pdf.text('Este relatório apresenta um resumo detalhado do desempenho financeiro da empresa, incluindo dados de faturamento, lucro e custos com serviços AWS e Stripe.', 20, 70, { maxWidth: 170 });

  // Faturamento
  const totalRevenue = billingData.reduce((total, item) => total + item.total_faturamento, 0);
  pdf.setFontSize(18);
  pdf.text('Faturamento', 20, 90);
  pdf.setFontSize(14);
  pdf.text(`O faturamento total no mês de ${monthYearString} foi de R$ ${totalRevenue.toFixed(2)}.`, 20, 100);

  const revenueData = billingData.map(week => week.total_faturamento);
  while (revenueData.length < 5) {
    revenueData.push(0);
  }
  drawBarChart(pdf, ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'], revenueData, 20, 130, 160, 80);

  // Lucro
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.text('Lucro', 20, 20);
  pdf.setFontSize(14);
  pdf.text(`O lucro total no mês de ${monthYearString} foi de R$ ${(totalRevenue - amazonCost).toFixed(2)}.`, 20, 30);

  const profitData = revenueData.map((revenue) => (revenue - (revenue / totalRevenue) * amazonCost).toFixed(2)).map(Number);
  drawBarChart(pdf, ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'], profitData, 20, 50, 160, 80);

  // Faturamento por Plano
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.text('Faturamento por Plano', 20, 20);

  const standardRevenue = billingData.reduce((total, item) => total + (9.99 * item.total_purchase_standard) - (9.99 * item.total_cancel_standard), 0);
  const premiumRevenue = billingData.reduce((total, item) => total + (14.99 * item.total_purchase_premium) - (14.99 * item.total_cancel_premium), 0);

  const planRevenueData = [
    { plan: 'Standard', revenue: `R$ ${standardRevenue.toFixed(2)}` },
    { plan: 'Premium', revenue: `R$ ${premiumRevenue.toFixed(2)}` }
  ];

  const planRevenueTableColumns = ['Plano', 'Faturamento'];
  const planRevenueTableRows = planRevenueData.map(item => [item.plan, item.revenue]);

  pdf.autoTable({
    head: [planRevenueTableColumns],
    body: planRevenueTableRows,
    startY: 30,
    styles: { fontSize: 12, cellPadding: 5, overflow: 'linebreak' },
    headStyles: { fillColor: [221, 221, 221] }
  });

  // Lucro por Plano
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.text('Lucro por Plano', 20, 20);

  const planProfitData = [
    { plan: 'Standard', profit: `R$ ${(standardRevenue - (standardRevenue / totalRevenue) * amazonCost).toFixed(2)}` },
    { plan: 'Premium', profit: `R$ ${(premiumRevenue - (premiumRevenue / totalRevenue) * amazonCost).toFixed(2)}` }
  ];

  const planProfitTableColumns = ['Plano', 'Lucro'];
  const planProfitTableRows = planProfitData.map(item => [item.plan, item.profit]);

  pdf.autoTable({
    head: [planProfitTableColumns],
    body: planProfitTableRows,
    startY: 30,
    styles: { fontSize: 12, cellPadding: 5, overflow: 'linebreak' },
    headStyles: { fillColor: [221, 221, 221] }
  });

  // Transações do Mês
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.text('Transações do Mês', 20, 20);

  const transactionData = [
    { type: 'Compra Plano Standard', count: billingData.reduce((total, item) => total + item.total_purchase_standard, 0) },
    { type: 'Cancelamento Plano Standard', count: billingData.reduce((total, item) => total + item.total_cancel_standard, 0) },
    { type: 'Compra Plano Premium', count: billingData.reduce((total, item) => total + item.total_purchase_premium, 0) },
    { type: 'Cancelamento Plano Premium', count: billingData.reduce((total, item) => total + item.total_cancel_premium, 0) },
  ];

  const transactionTableColumns = ['Tipo de Transação', 'Quantidade'];
  const transactionTableRows = transactionData.map(item => [item.type, item.count]);

  pdf.autoTable({
    head: [transactionTableColumns],
    body: transactionTableRows,
    startY: 30,
    styles: { fontSize: 12, cellPadding: 5, overflow: 'linebreak' },
    headStyles: { fillColor: [221, 221, 221] }
  });

  // Estatísticas de Usuários
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.text('Estatísticas de Usuários', 20, 20);

  const userStatsData = [
    { metric: 'Total de Acessos', value: 235 },
    { metric: 'Novos Registros', value: 12 }
  ];

  const userStatsTableColumns = ['Métrica', 'Valor'];
  const userStatsTableRows = userStatsData.map(item => [item.metric, item.value]);

  pdf.autoTable({
    head: [userStatsTableColumns],
    body: userStatsTableRows,
    startY: 30,
    styles: { fontSize: 12, cellPadding: 5, overflow: 'linebreak' },
    headStyles: { fillColor: [221, 221, 221] }
  });

  // Fatura da AWS
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.text('Fatura da AWS', 20, 20);

  const awsBillingData = [
    { service: 'EC2', cost: 'R$ 2,22' },
    { service: 'S3', cost: 'R$ 0,72' },
    { service: 'RDS', cost: 'R$ 13,01' },
    { service: 'Lambda', cost: 'R$ 27,41' },
    { service: 'Taxas', cost: 'R$ 0' }
  ];

  const awsTableColumns = ['Serviço', 'Custo'];
  const awsTableRows = awsBillingData.map(item => [item.service, item.cost]);

  pdf.autoTable({
    head: [awsTableColumns],
    body: awsTableRows,
    startY: 30,
    styles: { fontSize: 12, cellPadding: 5, overflow: 'linebreak' },
    headStyles: { fillColor: [221, 221, 221] }
  });

  // Dados do Stripe
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.text('Dados do Stripe', 20, 20);

  const stripeData = [
    { description: 'Faturamento Total', amount: `R$ ${totalRevenue.toFixed(2)}` },
    { description: 'Total de Transações', amount: 100 },
    { description: 'Taxas do Stripe', amount: 'R$ 10,72' }
  ];

  const stripeTableColumns = ['Descrição', 'Valor'];
  const stripeTableRows = stripeData.map(item => [item.description, item.amount]);

  pdf.autoTable({
    head: [stripeTableColumns],
    body: stripeTableRows,
    startY: 30,
    styles: { fontSize: 12, cellPadding: 5, overflow: 'linebreak' },
    headStyles: { fillColor: [221, 221, 221] }
  });

  // Assinaturas
  pdf.setFontSize(14);
  pdf.text('______________________________', 20, 150);
  pdf.text('Assinatura do Administrador', 20, 160);
  pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 170);

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

    try {
      const response = await fetch(BACKEND_URL + '/admin/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ month: selectedMonth }),
      });

      if (!response.ok) throw new Error('Erro ao buscar os dados do relatório.');

      const reportData = await response.json();
      const completeReportData = [];

      // Preencher semanas vazias com zero
      for (let i = 1; i <= 5; i++) {
        const weekData = reportData.find(week => week.week_number === i) || {
          week_number: i,
          total_cancel_premium: 0,
          total_cancel_standard: 0,
          total_faturamento: 0,
          total_purchase_premium: 0,
          total_purchase_standard: 0,
        };
        completeReportData.push(weekData);
      }

      console.log('Selected Month:', selectedMonth, 'Selected Year:', selectedYear);
      console.log('Complete Report Data:', completeReportData);

      await generatePdfReport(completeReportData, null, null, monthYearString);
    } catch (error) {
      console.error(error);
      // Em caso de erro, gerar relatório com os dados locais
      const billingCache = localStorage.getItem('billingCache');
      let cachedData = null;
      if (billingCache) {
        cachedData = JSON.parse(billingCache);
      }

      if (!dashboardData && !cachedData) {
        console.log('Nenhum dado de dashboard disponível.');
        alert('Aguarde, estou atualizando os dados');
        return;
      }

      const dataToUse = dashboardData || cachedData;

      const accessDataForMonth = (dataToUse.accessPerMonth && dataToUse.accessPerMonth.month === selectedMonth && dataToUse.accessPerMonth.year === selectedYear)
        ? dataToUse.accessPerMonth
        : null;

      const billingDataForMonth = dataToUse.billingPerMonth ? dataToUse.billingPerMonth.filter(item => {
        const itemMonth = Math.round(item.month);
        const itemYear = Math.round(item.year);
        return itemMonth === selectedMonth && itemYear === selectedYear;
      }) : [];

      const stripeDataForMonth = dataToUse.stripeData ? dataToUse.stripeData.filter(item => {
        const itemMonth = Math.round(item.month);
        const itemYear = Math.round(item.year);
        return itemMonth === selectedMonth && itemYear === selectedYear;
      }) : [];

      console.log('Selected Month:', selectedMonth, 'Selected Year:', selectedYear);
      console.log('Billing data for month:', billingDataForMonth);
      console.log('Access data for month:', accessDataForMonth);
      console.log('Stripe data for month:', stripeDataForMonth);

      const completeReportData = [];

      // Preencher semanas vazias com zero
      for (let i = 1; i <= 5; i++) {
        const weekData = billingDataForMonth.find(week => week.week_number === i) || {
          week_number: i,
          total_cancel_premium: 0,
          total_cancel_standard: 0,
          total_faturamento: 0,
          total_purchase_premium: 0,
          total_purchase_standard: 0,
        };
        completeReportData.push(weekData);
      }

      await generatePdfReport(completeReportData, accessDataForMonth, stripeDataForMonth, monthYearString);
    }
  }

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Relatórios
        </MDTypography>
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
