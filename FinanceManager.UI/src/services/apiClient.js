const API_BASE = import.meta.env.VITE_API_URL || 'https://localhost:7021/api';

const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('authToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const handleResponse = async (response) => {
    if (response.status === 401) {
        // Token expired or invalid — auto logout
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/';
        return;
    }
    if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Error ${response.status}: ${errorText}`);
    }
    const text = await response.text();
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        // Backend returned plain text (e.g. "Goal added successfully!")
        return text;
    }
};

export const apiGet = async (path) => {
    const response = await fetch(`${API_BASE}${path}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(response);
};

export const apiPost = async (path, body) => {
    const response = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(response);
};

export const apiPut = async (path, body) => {
    const response = await fetch(`${API_BASE}${path}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(response);
};

export const apiDelete = async (path) => {
    const response = await fetch(`${API_BASE}${path}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    return handleResponse(response);
};
