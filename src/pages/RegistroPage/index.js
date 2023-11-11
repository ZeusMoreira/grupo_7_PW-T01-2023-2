import './style.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BotaoTematico from '../../components/BotaoTematico';
import FormularioRegistro from '../../components/FormularioRegistro';
import { isMobile } from 'react-device-detect';

export const RegistroPage = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const botaoCriarContaProps = {
    backgroundColor: "white",
    color: "#b619b9",
    label: "Entrar",
    height: "45px",
    width: "150px",
    borderRadius: "14px",
  };

  return (
    <div className="container-registro">
      <div className="header-registro">
        {
          (isMobile || windowWidth <= 710) ?
            null: <div className="sizedbox-login-registro"></div>
        }
        <div className="logo-container-registro">
          <h1 className="logo-registro">Quizz<span>ES</span></h1>
        </div>
        {
          windowWidth > 710 &&
          <Link className="botao-login" to="/">
            <BotaoTematico {...botaoCriarContaProps} />
          </Link>
        }
        
      </div>
      <FormularioRegistro />
    </div>
  );
}

export default RegistroPage;