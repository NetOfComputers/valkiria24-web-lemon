import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CardActionArea, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';

// URL for the Socket.io server
const SOCKET_SERVER_URL = 'http://95.217.178.151:5000';  // Ensure to include the protocol (http or https)

function ActiveWorkersAdmin() {
  const navigate = useNavigate();
  const { workerId } = useParams();
  const [socket, setSocket] = useState(null);
  const [activeServices, setActiveServices] = useState([]);

  useEffect(() => {
    // Create a connection to the socket.io server
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Register this client as a controller
    newSocket.emit('register_controller', "developer");

    // Define the event listener for catching active services
    const catchActiveServices = (services) => {
      setActiveServices(services);
      console.log('The active services...', services);
    };

    // Listen for active services updates
    newSocket.on('listed_services', catchActiveServices);

    // Request the list of active services
    newSocket.emit('get_active_services', workerId);

    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, [workerId]);

  const handleServiceClick = (serviceId) => {
    // Navigate to the admin interface for the clicked worker
    navigate(`/active-workers/${workerId}/service/${serviceId}`);
  };

  return (
    <Container>
      <Typography variant="h2" gutterBottom>
        Active Workers Admin
      </Typography>
      <Typography variant="body1" gutterBottom>
        Available services for this worker:
      </Typography>

      {/* Display services as a grid of cards */}
      <Grid container spacing={3}>
        {activeServices.map(serviceId => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={serviceId}>
            <Card>
              <CardActionArea onClick={() => handleServiceClick(serviceId)}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {serviceId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    manage service
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default ActiveWorkersAdmin;
