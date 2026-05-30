// Base URL for the backend API
const API_BASE = 'http://localhost:8081/api';

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // important for session cookies
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(API_BASE + endpoint, options);

    // If unauthorized, redirect to login (except on login/register pages)
    if (response.status === 401) {
        if (!window.location.pathname.includes('index.html') && 
            !window.location.pathname.includes('register.html') &&
            !window.location.pathname.endsWith('/')) {
            window.location.href = 'index.html';
        }
        throw new Error('Please login to continue');
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}
