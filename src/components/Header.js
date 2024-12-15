import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Header() {
  const forDevs = ">/devs";
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <img
            src='https://bluejims.com/logo512.png'
            alt="Logo"
            style={{ height: '40px', marginRight: '10px' }}
          />
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/about">
          About
        </Button>
        <Button color="inherit" component={Link} to="/contact">
          Contact
        </Button>
        <Button color="inherit" component={Link} to="/for-devs">
          <Typography style={{ textTransform: 'none', color: 'whitesmoke' }} >
            {forDevs}
          </Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
