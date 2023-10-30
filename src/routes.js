import {BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegistroPage from "./pages/RegistroPage";

function RoutesApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/registro" element={<RegistroPage/>} />
                <Route path="/home" element={<div></div>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default RoutesApp;