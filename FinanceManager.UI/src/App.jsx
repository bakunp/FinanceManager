import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import LandingPage from './pages/Landing';
import { isLoggedIn, logout as authLogout, getStoredUser } from './services/authService';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => isLoggedIn());
    const [user, setUser] = useState(() => getStoredUser());

    useEffect(() => {
        // Check token validity on mount
        if (!isLoggedIn()) {
            setIsAuthenticated(false);
            setUser(null);
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
        setUser(getStoredUser());
    };

    const handleLogout = () => {
        authLogout();
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <Routes>
            {isAuthenticated ? (
                <Route path="/" element={<Layout onLogout={handleLogout} user={user} />}>
                    <Route index element={<Dashboard />} />
                    <Route path="expenses" element={<Expenses />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            ) : (
                <>
                    <Route path="/" element={<LandingPage onLogin={handleLogin} />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </>
            )}
        </Routes>
    )
}

export default App;