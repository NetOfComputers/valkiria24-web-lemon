import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CardActionArea, Grid, Paper, Box, Button, TextField, IconButton, Collapse } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import BoltIcon from '@mui/icons-material/Bolt';
// URL for the Socket.io server
const SOCKET_SERVER_URL = 'wss://bluejims.com:5000';  // Ensure to include the protocol (http or https)

function ActiveWorkersAdmin() {
  const navigate = useNavigate();
  const { workerId } = useParams();
  const [socket, setSocket] = useState(null);
  const [activeServices, setActiveServices] = useState([]);
  const [additionalMethods, setAdditionalMethods] = useState([]);
  const [showAdditionalMethods, setShowAdditionalMethods] = useState(false); // State to control showing additional methods
  const [advancedMode, setAdvancedMode] = useState(false); // State to control showing advanced mode
  const [outputs, setOutputs] = useState([]); // State for storing output messages
  useEffect(() => {
    // Create a connection to the socket.io server
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Register this client as a controller
    newSocket.emit('mg25_reg_as_controller', localStorage.getItem('hash'));

    // Define the event listener for catching active services
    const catchActiveServices = (services) => {
      console.log('received active services', services);
      setActiveServices(services.stdout.get_services);
      console.warn('get_active_services', services);
    };

    // Listen for active services updates
    newSocket.on('get_worker_services', catchActiveServices);

    // Request the list of active services
    newSocket.emit('main_service_send', {
      "workerId": workerId,
      "workerName": "ukn",
      "service_method": "get_worker_services",
      "callsback": "get_worker_services",
      "data": {},
      "metadata": { "fake": "metadata" },
    });




    /*
    newSocket.on('worker_methods_return', (dto) => {
      console.warn('worker_standard_send\n\t<list_worker_methods>\n\t\tworker_methods_return', dto['stdout'])

      setAdditionalMethods(dto['stdout'])
    })*/

    /*const workerMethods = {
      'workerId': workerId,
      'serviceId': null,
      'catchEventOn': 'worker_methods_return',
      'type': 'standard',
      'call': 'list_worker_methods',
      'args': null,
      'feedback': null,
      'shell': true
    };*/
    const get_worker_methods = {
      "workerId": workerId,
      "workerName": "ukn",
      "service_method": "get_worker_methods",
      "callsback": "get_worker_methods",
      "data": {},
      "metadata": { "fake": "metadata" },
    }
    newSocket.emit('main_service_send', get_worker_methods);
    newSocket.on('get_worker_methods', (dto) => {
      console.warn('worker_standard_send\n\t<list_worker_methods>\n\t\tworker_methods_return', dto['stdout'])
      setAdditionalMethods(dto['stdout']['get_worker_methods'])
    })





    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, [workerId]);

  const handleServiceClick = (serviceId) => {
    // Navigate to the admin interface for the clicked worker
    navigate(`/active-workers/${workerId}/service/${serviceId}`);
  };
  const handleWorkerOperation = (type, methodName) => {

    // Emit request for the selected method
    socket.emit('worker_standard_send', {
      'workerId': workerId,
      'serviceId': 'serviceId',
      'catchEventOn': 'main_worker_return',
      'type': type,
      'call': methodName,
      'args': null,
      'feedback': null,
      'shell': true
    });

    // Listen for the output and update state
    socket.once('main_worker_return', (dto) => {
      console.log('Received', dto);

      // Prepare output message based on stdout and stderr
      const newOutput = {
        type: dto.stderr ? 'error' : 'success',
        message: dto.stderr || dto.stdout
      };

      // Do not accumulate outputs
      setOutputs(newOutput);
    });
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
        {activeServices.map(({ id, running }) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
            <Card>
              <CardActionArea onClick={() => handleServiceClick(id)}>
                <CardContent>
                  <Typography variant="h5" component="div" style={{ display: 'flex', alignItems: 'center' }}>
                    {id}
                    {/* Conditionally render icon based on the state */}
                    {running ? (
                      <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#84dd84', marginLeft: 8 }} />
                    ) : (
                      <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef5252', marginLeft: 8 }} />
                    )}
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


      {/* Display output */}
      <Box mt={4} style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Output
        </Typography>
        <Paper elevation={3} style={{ padding: 16, backgroundColor: '#333' }}>
          {outputs && (
            <Typography
              variant="body2"
              component="pre"
              style={{ color: outputs.type === 'error' ? 'red' : 'lightgreen' }}
            >
              {outputs.message}
            </Typography>
          )}
        </Paper>
      </Box>


      {/* Toggle Additional Methods */}
      <Box mt={4}>
        <Button
          variant="contained"
          color="#BAE1FF" sx={{
            bgcolor: "#BAE1FF"
          }}
          onClick={() => setShowAdditionalMethods(!showAdditionalMethods)}
        >
          {showAdditionalMethods ? 'Hide Additional Methods' : 'Show Additional Methods'}
        </Button>
      </Box>

      {/* Display additional methods if toggled */}

      <Collapse in={showAdditionalMethods}>
        <Grid container spacing={1} mt={1}>
          {additionalMethods.map(({ methodName, type }) => {
            // Define a pastel color palette
            const pastelColors = [
              '#FFB3BA', // Pastel pink
              '#FFDFBA', // Pastel orange
              '#FFFFBA', // Pastel yellow
              '#BAFFC9', // Pastel green
              '#BAE1FF', // Pastel blue
              '#D6BAFF', // Pastel purple
              '#C4E0E5', // Pastel teal
              '#F2D8C2', // Pastel beige
            ];

            // Use modulo operator to cycle through colors
            // const cardColor = pastelColors[index % pastelColors.length];
            const cardColor = pastelColors[pastelColors.length];

            return (
              <Grid item xs={6} sm={4} md={3} lg={2} key={methodName}>
                <Card
                  sx={{
                    maxWidth: 200,
                    minWidth: 120,
                    mx: 'auto',
                    bgcolor: cardColor,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: 2,
                  }}
                >
                  <CardActionArea
                    onClick={() => handleWorkerOperation(type, methodName)}
                    sx={{ bgcolor: cardColor, '&:hover': { opacity: 0.9 } }} // Slightly darker effect on hover
                  >
                    <CardContent sx={{ p: 1 }}>
                      <Typography
                        variant="h6"
                        component="div"
                        align="center"
                        sx={{ color: '#333333' }} // Darker text color for contrast
                      >
                        {methodName}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Collapse>






    </Container>
  );
}

export default ActiveWorkersAdmin;
