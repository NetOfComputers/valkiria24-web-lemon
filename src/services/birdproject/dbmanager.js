import { io } from 'socket.io-client';

// Use the secure WebSocket URL (wss:// for secure WebSocket over HTTPS)
const SOCKET_SERVER_URL = 'wss://bluejims.com:5002';
let socket;
let isConnected = false;
let eventListeners = {};

// Initialize the connection and attach listeners (if not already connected)
export const connect = () => {
    if (!socket || !isConnected) {
        // Connect to the WebSocket server over HTTPS
        socket = io(SOCKET_SERVER_URL, {
            secure: true,  // Ensure secure WebSocket connection
            rejectUnauthorized: false,  // Optional: Disable this if you're testing with self-signed certificates
        });

        // Handle successful connection
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            isConnected = true;
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            isConnected = false;
        });
    }
    return socket;
};

// Generic function to add event listeners and prevent duplication
const addEventListener = (eventName, callback) => {
    if (!eventListeners[eventName]) {
        eventListeners[eventName] = callback;
        socket.on(eventName, callback);
    }
};

// Emit event to create a bird with appropriate action names
export const create_bird = (birdData, callOnEnd_callback, notifyAllAt_callback, callOnError_callback) => {
    if (!isConnected) connect();

    // Define the actions (customizable for each request)
    const action = {
        callOnEnd: 'bird_created',
        notifyAllAt: 'bird_created_all',
        callOnError: 'bird_not_created',
    };

    // Emit the create_bird event with the bird data and actions
    socket.emit('create_bird', {
        action,
        data: birdData
    });

    // Add the listeners for the response events, avoiding duplicate listeners
    addEventListener(action.callOnEnd, callOnEnd_callback);
    addEventListener(action.notifyAllAt, notifyAllAt_callback);
    addEventListener(action.callOnError, callOnError_callback);

    return socket;
};

// Emit event to fetch all birds, with action-based callbacks
export const find_all_birds = (action, successCallback) => {
    if (!isConnected) connect();

    console.warn('emit.all_birds');
    socket.emit('all_birds', {
        action: action,
        data: {}
    });

    // Add the listener for success action
    addEventListener(action.success, successCallback);

    return socket;
};

// Export the default socket instance
export default socket;


















// import { io } from 'socket.io-client';

// const SOCKET_SERVER_URL = 'wss://bluejims.com:5002';
// let socket;
// let isConnected = false;
// let eventListeners = {};

// // Initialize the connection and attach listeners (if not already connected)
// export const connect = () => {
//     if (!socket || !isConnected) {
//         socket = io(SOCKET_SERVER_URL);

//         // Handle successful connection
//         socket.on('connect', () => {
//             console.log('Socket connected:', socket.id);
//             isConnected = true;
//         });

//         // Handle disconnection
//         socket.on('disconnect', () => {
//             console.log('Socket disconnected');
//             isConnected = false;
//         });
//     }
//     return socket;
// };

// // Generic function to add event listeners and prevent duplication
// const addEventListener = (eventName, callback) => {
//     if (!eventListeners[eventName]) {
//         eventListeners[eventName] = callback;
//         socket.on(eventName, callback);
//     }
// };

// // Emit event to create a bird with appropriate action names
// export const create_bird = (birdData, callOnEnd_callback, notifyAllAt_callback, callOnError_callback) => {
//     if (!isConnected) connect();

//     // Define the actions (customizable for each request)
//     const action = {
//         callOnEnd: 'bird_created',
//         notifyAllAt: 'bird_created_all',
//         callOnError: 'bird_not_created',
//     };

//     // Emit the create_bird event with the bird data and actions
//     socket.emit('create_bird', {
//         action,
//         data: birdData
//     });

//     // Add the listeners for the response events, avoiding duplicate listeners
//     addEventListener(action.callOnEnd, callOnEnd_callback);
//     addEventListener(action.notifyAllAt, notifyAllAt_callback);
//     addEventListener(action.callOnError, callOnError_callback);

//     return socket;
// };

// // Emit event to fetch all birds, with action-based callbacks
// export const find_all_birds = (action, successCallback) => {
//     if (!isConnected) connect();

//     console.warn('emit.all_birds');
//     socket.emit('all_birds', {
//         action: action,
//         data: {}
//     });

//     // Add the listener for success action
//     addEventListener(action.success, successCallback);

//     return socket;
// };

// // Export the default socket instance
// export default socket;
