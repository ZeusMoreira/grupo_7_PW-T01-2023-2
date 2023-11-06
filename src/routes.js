import {BrowserRouter, Routes, Route} from "react-router-dom";
import Unknown from "./components/Unknown";
import LoginPage from "./pages/LoginPage/";
import RegistroPage from "./pages/RegistroPage/";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./PrivateRoute";
import FreeRoute from "./FreeRoute";

function RoutesApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<FreeRoute Component={LoginPage} />} />
                <Route path="/registro" element={<RegistroPage/>} />
                <Route path="/home" element={<PrivateRoute Component={HomePage} />} />
                <Route path="*" element={<Unknown/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default RoutesApp;