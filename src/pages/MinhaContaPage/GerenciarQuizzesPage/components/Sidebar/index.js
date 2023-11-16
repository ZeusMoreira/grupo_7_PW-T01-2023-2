import React from 'react';
import { Tooltip } from 'react-tooltip';
import BotaoCriarQuiz from './components/BotaoCriarQuiz';
import './style.css'

const Sidebar = ({toggleSidebar, ehModoCriacao, setEhModoCriacao}) => {
  const handleCriarQuizClick = () => {
    setEhModoCriacao(true)
  }

  const botaoCriarQuizProps = {
    backgroundColor: ehModoCriacao ? 'white' : 'transparent',
    color: ehModoCriacao ? '#393434' : 'white',
  }

  return (
    <div className="sidebar">
        <div className="abrir-criar">
            {
                !ehModoCriacao && 
                <div className="menu-icone-fechar">
                   <a data-tooltip-id="tooltip-quiz-criacao" data-tooltip-content="O fechamento do menu só está disponível com a criação ou edição de quiz habilitada." data-tooltip-place="right" href="#tooltip-quiz-criacao" className="a-tooltip">
                        <i className="material-icons close-icon" onClick={toggleSidebar}>
                            menu
                        </i>
                    </a>
                    <Tooltip id="tooltip-quiz-criacao" /> 
                </div>  
            }
            {
                ehModoCriacao && 
                <i className="material-icons close-icon" onClick={toggleSidebar}>
                    menu
                </i>
            }
            <BotaoCriarQuiz onClick={handleCriarQuizClick} {...botaoCriarQuizProps}/>
        </div>
        
    </div>
  );
};

export default Sidebar;