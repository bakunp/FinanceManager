import { BrowserRouter, Route, Routes } from "react-router";
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Dashboard />}/>

                    <Route path="expenses" element={<Expenses />}/>
                    <Route path="*" element={<div>404 - Page not found</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;