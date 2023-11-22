import {BrowserRouter, Routes, Route} from "react-router-dom"
import Unknown from "./components/Unknown";
import LoginPage from "./pages/LoginPage/";
import RegistroPage from "./pages/RegistroPage/";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./PrivateRoute";
import FreeRoute from "./FreeRoute";
import RankingPage from "./pages/RankingPage";
import MinhaContaPage from "./pages/MinhaContaPage";
import EditarPerfilPage from "./pages/MinhaContaPage/EditarPerfilPage";
import AdminRoute from "./AdminRoute";
import GerenciarQuizzesPage from "./pages/MinhaContaPage/GerenciarQuizzesPage";
import MeuPerfilPage from "./pages/MinhaContaPage/MeuPerfilPage";
import JogarPage from "./pages/JogarPage";

function RoutesApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<FreeRoute Component={LoginPage} />} />
                <Route path="/registro" element={<RegistroPage/>} />
                <Route path="/home" element={<PrivateRoute Component={HomePage} />} />
                <Route path="/ranking" element={<PrivateRoute Component={RankingPage} />} />
                <Route path="/minha-conta" element={<PrivateRoute Component={MinhaContaPage} />}>
                    <Route index element={<PrivateRoute Component={EditarPerfilPage} />}/>
                    <Route path="editar-perfil" element={<PrivateRoute Component={EditarPerfilPage}/>} />
                    <Route path="gerenciar-quizzes" element={<AdminRoute Component={GerenciarQuizzesPage}/>} />
                    <Route path="meu-perfil" element={<PrivateRoute Component={MeuPerfilPage}/>} />
                </Route>
                <Route path="/jogar/:parametro" element={<PrivateRoute Component={JogarPage} />}></Route>
                <Route path="/jogar" element={<PrivateRoute Component={JogarPage} />}></Route>
                <Route path="*" element={<Unknown/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default RoutesApp;