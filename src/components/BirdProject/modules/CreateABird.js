import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    IconButton,
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { toast, ToastContainer } from 'react-toastify'
// import {create_bird, connect} from '../../../services/birdproject/dbmanager'
import { createBird } from '../../../services/birdproject/birdControllerClientService';
function CreateABird({ sx }) {
    // Pro Config
    // const [socket, setSocket] = useState(null);
    const [birdName, setBirdName] = useState('');
    const [activationKey, setActivationKey] = useState('');
    // const [color, setColor] = useState('');  // State for selected color
    // const [speed, setSpeed] = useState('');  // State for selected speed
    // const [dialogOpen, setDialogOpen] = useState(false);
    // const [gifSrc, setGifSrc] = useState(''); // State for GIF source

    //Local Test Config
    const [socket, setSocket] = useState(null);
    // const [birdName, setBirdName] = useState('cebollo');
    // const [activationKey, setActivationKey] = useState('by-pass');
    const [color, setColor] = useState('nightorange');  // State for selected color
    const [speed, setSpeed] = useState('normal');  // State for selected speed
    const [dialogOpen, setDialogOpen] = useState(false);
    const [gifSrc, setGifSrc] = useState(`./multibirdse/color_speed_gif/${color}-${speed}.gif`);
    // Define color options
    const colorOptions = [
        "calmred",
        "deepblue",
        "diamondblue",
        "diamondgreen",
        "green",
        "lightgreen",
        "nightblue",
        "nightgreen",
        "nightmois",
        "nightorange",
        "nightred",
        "orange",
        "pink",
        "purple",
    ];

    useEffect(() => {
        // Connect to the WebSocket server
        // const newSocket = connect()
        // setSocket(newSocket);

        // newSocket.on('bird_created', (event) => {
        //     console.warn('BirdCreated!', event)
        //     console.warn('Closing the dialog, this causes socket disconnection')
        //     // Clear inputs and close dialog
        //     // setBirdName('');
        //     // setActivationKey('');
        //     // setColor('');
        //     // setSpeed('');
        //     // setGifSrc('');
        //     setDialogOpen(false); 
        // })

        // newSocket.on('bird_not_created', (event) => {
        //     console.error('BirdNotCreated!', event)
        //     toast.error("message", {
        //         position: toast.POSITION.TOP_RIGHT,
        //         autoClose: 3000,
        //     });
        // })

        // // Cleanup socket connection on unmount
        // return () => {

        //     newSocket.disconnect();
        // };
    }, []);

    useEffect(() => {
        // Update GIF source based on selected parameters
        if (color && speed) {
            const newGifSrc = `./multibirdse/color_speed_gif/${color}-${speed}.gif`; // Update this URL accordingly
            setGifSrc(newGifSrc);
        } else {
            setGifSrc('');
        }
    }, [color, speed]);

    const handleCreateBird = async () => {
        if (birdName && activationKey && color && speed) {
            console.warn('sending message to dbmanager to create a bird')
            createBird({
                name: birdName,
                hash: activationKey,
                color: color,
                speed: speed
            }).then(result => {
                if (result.success) {
                    console.warn("Bird created successfully:", result.data);
                    
                    setBirdName('');
                    setActivationKey('');
                    setDialogOpen(false);

                    console.warn('Unmounting component')
                } else {
                    console.warn("Error creating bird:", result.error);
                }
            })
            .catch(error => {
                console.warn("Unexpected error:", error);
                /*toast.error("message", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });*/
            });
            console.warn('Request-Response is a promise model and they will manage their own behaviour')
        }
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    // Function to change color forward
    const changeColorForward = () => {
        const currentIndex = colorOptions.indexOf(color);
        const nextIndex = (currentIndex + 1) % colorOptions.length; // Wrap around
        setColor(colorOptions[nextIndex]);
    };

    // Function to change color backward
    const changeColorBackward = () => {
        const currentIndex = colorOptions.indexOf(color);
        const prevIndex = (currentIndex - 1 + colorOptions.length) % colorOptions.length; // Wrap around
        setColor(colorOptions[prevIndex]);
    };

    return (
        <Box sx={sx}>
            {/* Button to open the dialog */}
            <Button variant="contained" color="primary" onClick={handleDialogOpen} sx={{ backgroundColor: 'transparent', color: 'whitesmoke' }}>
                Create a New Bird
            </Button>

            {/* Dialog (modal) for bird creation */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Crea tu propio peQuirito</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Para crear tu propio pajarincho debes usar tu <strong>clave de un uso</strong>.
                    </DialogContentText>

                    {/* Activation Key Input */}
                    <TextField
                        margin="dense"
                        label="Activation Key"
                        fullWidth
                        variant="outlined"
                        value={activationKey}
                        onChange={(e) => setActivationKey(e.target.value)}
                    />

                    {/* Bird Name Input */}
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Bird Name"
                        fullWidth
                        variant="outlined"
                        value={birdName}
                        onChange={(e) => setBirdName(e.target.value)}
                    />

                    {/* Speed Selection */}
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="speed-label">Speed</InputLabel>
                        <Select
                            labelId="speed-label"
                            value={speed}
                            onChange={(e) => setSpeed(e.target.value)}
                            label="Speed"  // Ensure the label is set correctly
                        >
                            <MenuItem value="slow">Slow</MenuItem>
                            <MenuItem value="normal">Normal</MenuItem>
                            <MenuItem value="fast">Fast</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Color Selection */}
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="color-label">Color</InputLabel>
                        <Select
                            labelId="color-label"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            label="Color"  // Ensure the label is set correctly
                        >
                            {colorOptions.map((colorOption) => (
                                <MenuItem key={colorOption} value={colorOption}>
                                    {colorOption}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* GIF Preview */}
                    <Typography variant="h6">Preview:</Typography>

                    {gifSrc && (
                        <Box mt={2} textAlign="center" sx={videoContainerStyles}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: `85px`,
                                    left: `250px`,
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    color: 'white',
                                    padding: '5px',
                                    borderRadius: '5px',
                                    zIndex: 10,
                                }}
                            >
                                {birdName}
                            </Box>
                            <IconButton sx={{ ...arrowButtonStyles, left: '10px' }} onClick={changeColorBackward}>
                                <ArrowBack />
                            </IconButton>
                            <img src={gifSrc} alt="Bird Preview" style={{ maxWidth: '100%', height: 'auto' }} />
                            <IconButton sx={{ ...arrowButtonStyles, right: '10px' }} onClick={changeColorForward}>
                                <ArrowForward />
                            </IconButton>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateBird} variant="contained" color="primary">
                        Create Bird
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

const arrowButtonStyles = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    zIndex: 2,  // Asegura que los botones de flecha estén por encima del video
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
};
const videoContainerStyles = {
    position: 'relative',
    width: '100%',
    height: '500px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    mb: 4,
};

export default CreateABird;
