import './style.css';
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Content from './components/Content';

export const GerenciarQuizzesPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [ehModoCriacao, setEhModoCriacao] = useState(false);
  const [ehModoEdicao, setEhModoEdicao] = useState(false)
  const [quizIdSelecionado, setQuizIdSelecionado] = useState(null);

  const handleQuizSelection = (selectedQuizId) => {
    setQuizIdSelecionado(selectedQuizId);
    setEhModoCriacao(false);
    setEhModoEdicao(true);
  };

  const handleCriarSelection = () => {
    setQuizIdSelecionado(null);
    setEhModoCriacao(true);
    setEhModoEdicao(false);
  };
  
  const toggleSidebar = () => {
    if(!ehModoCriacao && !ehModoEdicao){
      return
    }
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`gerenciar-quiz-content ${isSidebarOpen ? 'open' : ''}`}>
      <Sidebar 
        toggleSidebar={toggleSidebar}
        ehModoCriacao={ehModoCriacao}
        setEhModoCriacao={setEhModoCriacao} 
        ehModoEdicao={ehModoEdicao}  
        setEhModoEdicao={setEhModoEdicao}
        onQuizSelect={handleQuizSelection}
        onCriarSelect={handleCriarSelection}
      />
      <Content 
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        ehModoCriacao={ehModoCriacao}
        ehModoEdicao={ehModoEdicao}
        quizIdSelecionado={quizIdSelecionado}  
      />
    </div>
  );
}

export default GerenciarQuizzesPage; 