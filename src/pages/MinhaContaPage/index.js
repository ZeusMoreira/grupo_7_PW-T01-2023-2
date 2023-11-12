import './style.css';
import React from 'react';
import { Link } from 'react-router-dom';
import FormularioLogin from '../../components/FormularioLogin';
import BotaoTematico from '../../components/BotaoTematico';

export const MinhaContaPage = () => {
  const handleCriarContaClick = () => {
  }

  const botaoCriarContaProps = {
    backgroundColor: "white",
    color: "#b619b9",
    label: "Criar Conta",
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
        <Link className="botao-criar-conta" to="/registro">
          <BotaoTematico onClick={handleCriarContaClick} {...botaoCriarContaProps} />
        </Link>
      </div>
      <FormularioLogin />
    </div>
  );
}

export default MinhaContaPage;