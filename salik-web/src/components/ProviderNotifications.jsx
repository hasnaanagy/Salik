
import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

export const ProviderNotifications = () => {
  const [requests, setRequests] = useState([]);
  const socket = io("http://localhost:5000");

  useEffect(() => {
    socket.emit("registerProvider", { serviceType: "mechanic" });

    socket.on("newRequest", (data) => {
      setRequests((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div>
      <Typography variant="h4" gutterBottom>New Service Requests</Typography>
      {requests.map((req, index) => (
        <div key={index}>
          <p><strong>Problem:</strong> {req.problem}</p>
          <p><strong>Location:</strong> {req.location.lat}, {req.location.lng}</p>
        </div>
      ))}
    </div>
  );
};