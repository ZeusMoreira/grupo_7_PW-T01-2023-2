import {BrowserRouter, Routes, Route } from "react-router-dom";
import Unknown from "./components/Unknown";
import LoginPage from "./pages/LoginPage/";
import RegistroPage from "./pages/RegistroPage/";

function RoutesApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/registro" element={<RegistroPage/>} />
                <Route path="/home" element={<div></div>}/>
                <Route path="*" element={<Unknown/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default RoutesApp;