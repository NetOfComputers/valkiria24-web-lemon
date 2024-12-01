import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CardActionArea, Grid, Paper, Box, Button, TextField, IconButton, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';

// URL for the Socket.io server
const SOCKET_SERVER_URL = 'wss://bluejims.com:5000';  // Ensure to include the protocol (http or https)

function ActiveServiceAdmin() {
    const navigate = useNavigate();
    const { workerId, serviceId } = useParams();
    const [socket, setSocket] = useState(null);
    const [activeMethods, setActiveMethods] = useState([]);
    const [additionalMethods, setAdditionalMethods] = useState([]);
    const [outputs, setOutputs] = useState([]); // State for storing output messages
    const [intervalId, setIntervalId] = useState(null); // State for storing interval ID
    const [isPolling, setIsPolling] = useState(false); // State to track polling status
    const [message, setMessage] = useState('');
    const [showAdditionalMethods, setShowAdditionalMethods] = useState(false); // State to control showing additional methods
    const [advancedMode, setAdvancedMode] = useState(false); // State to control showing advanced mode

    useEffect(() => {
        // Create a connection to the socket.io server
        const newSocket = io(SOCKET_SERVER_URL);
        setSocket(newSocket);

        // Register this client as a controller
        newSocket.emit('mg25_reg_as_controller', localStorage.getItem('hash'));

        // Listen for active services updates
        newSocket.on('get_service_methods', (dto) => {
            console.log('Received Active Methods', dto);
            setActiveMethods(dto.stdout.get_service_methods);
        });

        // Listen for additional methods updates
        newSocket.on('additional_methods_service_return', (dto) => {
            console.log('Received Additional Methods', dto);
            setAdditionalMethods(dto.stdout);
        });

        // Request the list of active services
        newSocket.emit('main_service_send', {
            "workerId": workerId,
            "workerName": "ukn",
            "service_method": "get_service_methods",
            "callsback": "get_service_methods",
            "data": {
                'service_name': "vOut",
                'stdout': {},
                'stderr': {}
            },
            "metadata": { "fake": "metadata" },
        });
        /*
        // Request additional methods
        const additionalMethodsPayload = {
            'workerId': workerId,
            'serviceId': serviceId,
            'catchEventOn': 'additional_methods_service_return',
            'type': 'standard',
            'call': 'list_additional',
            'args': null,
            'feedback': null,
            'shell': true
        };
        newSocket.emit('service_standard_send', additionalMethodsPayload);*/

        // Clean up the socket connection when the component unmounts
        return () => {
            newSocket.disconnect();
            if (intervalId) {
                clearInterval(intervalId); // Clear interval on unmount
            }
        };
    }, [workerId, serviceId]);

    const startPolling = () => {
        if (isPolling) return; // Prevent starting multiple intervals
        const id = setInterval(() => {
            handleServiceMethodCall('outhist');
        }, 2000); // Execute every 2 seconds

        setIntervalId(id);
        setIsPolling(true);
    };

    const stopPolling = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
            setIsPolling(false);
        }
    };

    const sendMessage = () => {
        if (socket && message) {
            // Emit the message to the server
            socket.emit('send_command', message);
            console.log('Message sent:', message);
        }
    };

    /*const handleServiceAdditionalMethodCall = (methodName) => {
        // Emit request for the selected method
        socket.emit('service_standard_send', {
            'workerId': workerId,
            'serviceId': serviceId,
            'catchEventOn': 'main_service_return',
            'type': 'git',
            'call': methodName,
            'args': null,
            'feedback': null,
            'shell': true
        });

        // Listen for the output and update state
        socket.once('main_service_return', (dto) => {
            console.log('Received', dto);

            // Prepare output message based on stdout and stderr
            const newOutput = {
                type: dto.stderr ? 'error' : 'success',
                message: dto.stderr || dto.stdout
            };

            // Do not accumulate outputs
            setOutputs(newOutput);
        });
    };*/
    const handleServiceMethodCall = (methodName) => {
        // Emit request for the selected method
        socket.emit('main_service_send', {
            "workerId": workerId,
            "workerName": "ukn",
            "service_method": methodName,
            "callsback": "handledMethodCall",
            "data": {
                'service_name': serviceId,
                'stdout': {},
                'stderr': {},
                'requires_pumps': [
                    'udpVideoPump',
                    'wssControlPump'
                ],
            },
            "metadata": { "fake": "metadata" },
        });

        // Listen for the output and update state
        socket.once('handledMethodCall', (dto) => {
            console.log('Received', dto);
            
            if(JSON.stringify(dto.stderr) == '{}'){
                dto.stderr = null;
            }
            
            // Prepare output message based on stdout and stderr
            const newOutput = {
                type: dto.stderr ? 'error' : 'success',
                message: dto.stderr || JSON.stringify(dto.stdout, null, 4)
            };

            // Do not accumulate outputs
            setOutputs(newOutput);
        });
    };

    return (
        <Container>
            <Typography variant="h2" gutterBottom>
                {serviceId} methods
            </Typography>
            <Typography variant="body1" gutterBottom>
                Service method manager
            </Typography>

            {/* Display active methods as a grid of cards */}
            <Grid container spacing={3}>
                {activeMethods.map(({ methodName }) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={methodName}>
                        <Card>
                            <CardActionArea onClick={() => handleServiceMethodCall(methodName)}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {methodName}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

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

            {/* <Collapse in={showAdditionalMethods}>
                <Grid container spacing={1} mt={1}>
                    {additionalMethods.map((methodName, index) => {
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
                        const cardColor = pastelColors[index % pastelColors.length];

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
                                        onClick={() => handleServiceAdditionalMethodCall(methodName)}
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
            </Collapse> */}

            {/* Buttons to start and stop polling */}
            <Box mt={4}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={startPolling}
                    disabled={isPolling}
                >
                    Start Polling
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={stopPolling}
                    disabled={!isPolling}
                    style={{ marginLeft: 8 }}
                >
                    Stop Polling
                </Button>
            </Box>

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

            {/* Advanced Mode Toggle */}
            <Box mt={4}>
                <IconButton onClick={() => setAdvancedMode(!advancedMode)}>
                    <ExpandMoreIcon />
                </IconButton>
                <Collapse in={advancedMode}>
                    <TextField
                        label="Server input"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    {/* Button to send the message */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={sendMessage}
                        sx={{ margin: "10px" }}
                    >
                        Send Message
                    </Button>
                </Collapse>
            </Box>
        </Container>
    );
}

export default ActiveServiceAdmin;
