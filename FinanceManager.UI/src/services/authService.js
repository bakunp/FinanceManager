const API_BASE = import.meta.env.VITE_API_URL || 'https://localhost:7021/api';

export const googleLogin = async (idToken) => {
    const response = await fetch(`${API_BASE}/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => 'Login failed');
        throw new Error(errorText);
    }

    const data = await response.json();

    // Store JWT token
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('isAuthenticated', 'true');

    return data;
};

export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
};

export const getStoredUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
        // Decode JWT and check expiration
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000;
        if (Date.now() > expiry) {
            logout();
            return false;
        }
        return true;
    } catch {
        logout();
        return false;
    }
};
