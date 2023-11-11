import './style.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FormularioLogin from '../../components/FormularioLogin';
import BotaoTematico from '../../components/BotaoTematico';
import { isMobile } from 'react-device-detect';

export const LoginPage = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

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
    label: "Criar Conta",
    height: "45px",
    width: "150px",
    borderRadius: "14px",
  };

  return (
    <div className="container-login">
      <div className="header-login">
        {
          (isMobile || windowWidth <= 710) ?
            null: <div className="sizedbox-login"></div>
        }
        <div className="logo-container-login">     
          <h1 className="logo-login">Quizz<span>ES</span></h1>
        </div>
        { windowWidth > 710 &&
          <Link className="botao-criar-conta" to="/registro">
            <BotaoTematico {...botaoCriarContaProps} />
          </Link>
        }
      </div>
      <FormularioLogin />
    </div>
  );
}

export default LoginPage;