import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import ContentJogar from "./ContentJogar";
import "./jogar-page.css"
import SidebarJogar from "./SidebarJogar";

export const JogarPage = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [quizIdSelecionado, setQuizIdSelecionado] = useState(null);

    const navegarHome = () => {
        navigate("/home")
    }

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleQuizSelection = (selectedQuizId) => {
        setQuizIdSelecionado(selectedQuizId);
    };

    return (
        <div className="container-jogar-page">
            <div className="header-jogar">
                <div className="logo-container-jogar">
                    <h1 className="logo-jogar" onClick={navegarHome}>Quizz<span>ES</span></h1>
                </div>
            </div>
            <div className={`jogar-content ${isSidebarOpen ? 'open' : ''}`}>
                <SidebarJogar
                    toggleSidebar={toggleSidebar}
                    onQuizSelect={handleQuizSelection}
                />
                <ContentJogar
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                    quizIdSelecionado={quizIdSelecionado}  
                    onQuizSelect={handleQuizSelection}
                /> 
            </div>
        </div>
    );
}

export default JogarPage