import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TimelineItem from "examples/Timeline/TimelineItem";
import Envs from "components/Envs";

const BACKEND_URL = Envs.BACKEND_URL; // Substitua pelo seu URL de backend

const eventNameMap = {
  "purchase-plan-premium": "Compra Plano Premium",
  "purchase-plan-standard": "Compra Plano Standard",
  "cancel-plan-premium": "Cancelamento Plano Premium",
  "cancel-plan-standard": "Cancelamento Plano Standard",
};

function OrdersOverview() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(BACKEND_URL + "/admin/last-five-events")
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const getDefaultEvent = () => {
    const currentDate = new Date();
    const defaultDate = new Date(currentDate.getTime() - 10 * 60000); // 10 minutos antes
    const formattedDate = defaultDate.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).replace(".", "").replace("de", "").toUpperCase();
    
    return {
      event_name: "purchase-plan-premium",
      event_value: "Compra Plano Premium",
      event_date: formattedDate,
    };
  };

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Últimas notificações
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            {/* <MDTypography variant="button" color="text" fontWeight="medium">
              24%
            </MDTypography>{" "}
            this month */}
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        {events.length > 0 ? (
          events.map((event, index) => (
            <TimelineItem
              key={index}
              color="success"
              icon="notifications"
              title={eventNameMap[event.event_name] || event.event_name}
              dateTime={event.event_date}
            />
          ))
        ) : (
          <TimelineItem
            color="success"
            icon="notifications"
            title="Compra Plano Premium"
            dateTime={getDefaultEvent().event_date}
          />
        )}
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
