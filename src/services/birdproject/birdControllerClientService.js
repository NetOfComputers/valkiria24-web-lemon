// src/api/birdApi.js
//Maybe we can make something to autogenerate this

const API_URL = 'https://bluejims.com:5005/bird'; // Change to your actual API URL

// Function to handle API errors
function handleApiError(error) {
    console.error('API error:', error);
    return error.message || 'An unexpected error occurred';
}

// Crear un nuevo pájaro
export const createBird = async (birdData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(birdData),
        });

        // Check if the response was not okay (error case)
        if (!response.ok) {
            const errorText = await response.text();
            return { success: false, error: errorText }; // Return error information
        }

        const data = await response.json();
        return { success: true, data }; // Return success information
    } catch (error) {
        return { success: false, error: handleApiError(error) }; // Handle unexpected errors
    }
};


// Leer un pájaro por ID
export const getBird = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error(await response.text());
        }

        return await response.json();
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export const getAllBirds = async (page = 1, limit = 10) => {
    console.warn('Getting all bird from database using pagination')
    try {
        const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`);

        if (!response.ok) {
            const errorText = await response.text();
            return { success: false, error: errorText }; // Return error information
        }

        const data = await response.json();
        return { success: true, data }; // Return success information
    } catch (error) {
        return { success: false, error: handleApiError(error) }; // Handle unexpected errors
    }
};

// Actualizar un pájaro por ID
export const updateBird = async (id, birdData) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(birdData),
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        return await response.json();
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

// Eliminar un pájaro por ID
export const deleteBird = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};
