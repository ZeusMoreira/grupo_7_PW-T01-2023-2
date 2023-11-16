import './style.css';
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Content from './components/Content';

export const GerenciarQuizzesPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [ehModoCriacao, setEhModoCriacao] = useState(false);
  
  const toggleSidebar = () => {
    if(!ehModoCriacao){
      return
    }
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`gerenciar-quiz-content ${isSidebarOpen ? 'open' : ''}`}>
      <Sidebar 
        toggleSidebar={toggleSidebar}
        ehModoCriacao={ehModoCriacao}
        setEhModoCriacao={setEhModoCriacao} />
      <Content 
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        ehModoCriacao={ehModoCriacao}/>
    </div>
  );
}

export default GerenciarQuizzesPage; 