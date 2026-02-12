import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import LandingPage from './pages/Landing';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem('isAuthenticated');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = () => {
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
    };

    return (
        <BrowserRouter>
            <Routes>
                {isAuthenticated ? (
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<Dashboard />}/>
                        <Route path="expenses" element={<Expenses />}/>
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                ) : (
                    <>
                        <Route path="/" element={<LandingPage onLogin={handleLogin} />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </>
                )}
            </Routes>
        </BrowserRouter>
    )
}

export default App;