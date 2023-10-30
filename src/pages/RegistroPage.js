import './RegistroPage.css';
import BotaoTematico from '../components/BotaoTematico';
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import FormularioRegistro from '../components/FormularioRegistro';

class RegistroPage extends Component {
    handleCriarContaClick = () => {
      console.log("Botão 'Criar Conta' clicado!");
    }
  
    render() {
      const botaoCriarContaProps = {
        backgroundColor: "white",
        color: "#b619b9",
        label: "Entrar ",
        height: "45px",
        width: "150px",
        borderRadius: "14px",
      };
  
      return(
        <div className="container">
          <div className="header"> 
            <div className="sizedbox"></div>
            <h1 className="logo">Quizz<span>ES</span></h1>
            <Link className="botao-login" to="/"><BotaoTematico {...botaoCriarContaProps}></BotaoTematico></Link>
          </div>
          <FormularioRegistro></FormularioRegistro>
        </div>
      );
    }
}

export default RegistroPage;