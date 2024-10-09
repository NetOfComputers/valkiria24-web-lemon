import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, TextField, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

// URL for the Socket.io server
const SOCKET_SERVER_URL = 'wss://bluejims.com:5000';

function ActiveWorkers() {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [activeWorkers, setActiveWorkers] = useState({});

  useEffect(() => {
    // Create a connection to the socket.io server
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Register this client as a controller
    newSocket.emit('reg_as_controller', localStorage.getItem('hash'));

    // Define the event listener for catching active workers
    const catchActiveWorkers = (workers) => {
      setActiveWorkers(workers);
      console.log('The active workers...', workers);
    };

    // Listen for active workers updates
    newSocket.on('catch_active_workers', catchActiveWorkers);

    // Request the list of active workers
    newSocket.emit('get_active_workers');

    newSocket.on('ret_service_call_stdout', (stdout)=>{
      console.log('Execution Results', stdout)
      // setMessageOut(stdout)
    })
    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket && message) {
      // Emit the message to the server
      socket.emit('send_command', message);
      console.log('Message sent:', message);
    }
  };

  const handleWorkerClick = (workerId) => {
    // Navigate to the admin interface for the clicked worker
    navigate(`/active-workers/${workerId}`);
  };

  return (
    <Container>
      <Typography variant="h2">Active Workers</Typography>
      {/* <Typography variant="body1">Allows me to see my 'perejiles' online</Typography> */}

      {/* Input field for writing messages */}
      {/* <TextField
        label="Server input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        margin="normal"
      />

      <Button onClick={sendMessage} variant="contained" color="primary">
        Send Message
      </Button> */}

      {/* List of active workers */}
      <List>
        {Object.keys(activeWorkers).map((workerId) => (
          <ListItem 
            key={workerId} 
            button 
            onClick={() => handleWorkerClick(workerId)} // Make each list item clickable
          >
            <ListItemText 
              primary={`Worker ID: ${workerId}`} 
              secondary={activeWorkers[workerId] ? 'Active' : 'Inactive'} 
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default ActiveWorkers;
