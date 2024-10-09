import React from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ClassyMenu = ({ anchorEl, onClose, serviceId, onMenuItemClick, actionHandler }) => {

    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
        >
            <MenuItem onClick={() => onMenuItemClick('start', serviceId)}>Start Service</MenuItem>
            <MenuItem onClick={() => onMenuItemClick('stop', serviceId)}>Stop Service</MenuItem>
            <MenuItem onClick={() => onMenuItemClick('restart', serviceId)}>Restart Service</MenuItem>
        </Menu>
    );
};

export default ClassyMenu;
