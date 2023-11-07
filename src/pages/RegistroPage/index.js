import './style.css';
import React from 'react';
import { Link } from 'react-router-dom';
import BotaoTematico from '../../components/BotaoTematico';
import FormularioRegistro from '../../components/FormularioRegistro';

export const RegistroPage = () => {
  const botaoCriarContaProps = {
    backgroundColor: "white",
    color: "#b619b9",
    label: "Entrar",
    height: "45px",
    width: "150px",
    borderRadius: "14px",
  };

  return (
    <div className="container">
      <div className="header">
        <div className="sizedbox"></div>
        <div className="logo-container">
          <h1 className="logo">Quizz<span>ES</span></h1>
        </div>
        <Link className="botao-login" to="/">
          <BotaoTematico {...botaoCriarContaProps} />
        </Link>
      </div>
      <FormularioRegistro />
    </div>
  );
}

export default RegistroPage;