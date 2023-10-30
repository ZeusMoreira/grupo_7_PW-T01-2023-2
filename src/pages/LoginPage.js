import './LoginPage.css';
import BotaoTematico from '../components/BotaoTematico';
import React, { Component } from "react";
import FormularioLogin from '../components/FormularioLogin';
import { Link } from 'react-router-dom';

class LoginPage extends Component {
    handleCriarContaClick = () => {
      console.log("Botão 'Criar Conta' clicado!");
    }
  
    render() {
      const botaoCriarContaProps = {
        backgroundColor: "white",
        color: "#b619b9",
        label: "Criar Conta",
        height: "45px",
        width: "150px",
        borderRadius: "14px",
      };
  
      return(
        <div className="container">
          <div className="header"> 
            <div className="sizedbox"></div>
            <h1 className="logo">Quizz<span>ES</span></h1>
            <Link className="botao-criar-conta" to="/registro"><BotaoTematico onClick={this.handleCriarContaClick}  {...botaoCriarContaProps}></BotaoTematico></Link>
          </div>
          <FormularioLogin></FormularioLogin>
        </div>
      );
    }
}

export default LoginPage;