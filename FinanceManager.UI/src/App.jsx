import { BrowserRouter, Route, Routes } from "react-router";
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Dashboard />}/>

                    {/* <Route path="expenses" element={<FixedExpenses />}/> */}
                    <Route path="*" element={<div>404 - Page not found</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;