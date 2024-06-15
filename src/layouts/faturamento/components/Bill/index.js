import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TimelineItem from "examples/Timeline/TimelineItem";
import Envs from "components/Envs";

const BACKEND_URL = Envs.BACKEND_URL; // Substitua pelo seu URL de backend

function OrdersOverview() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(BACKEND_URL + "/admin/last-five-events")
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

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
            <MDTypography variant="button" color="text" fontWeight="medium">
              24%
            </MDTypography>{" "}
            this month
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
              title={event.event_name}
              dateTime={new Date(event.event_date).toLocaleString()}
            />
          ))
        ) : (
          <MDTypography variant="body2" color="text">
            Nenhum evento encontrado.
          </MDTypography>
        )}
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
