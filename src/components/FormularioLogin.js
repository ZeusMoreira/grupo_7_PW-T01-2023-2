import React, { Component } from "react";
import BotaoTematico from "./BotaoTematico";
import './FormularioLogin.css';

class FormularioLogin extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          email: "",
          senha: "",
          emailValido: true,
          senhaValida: true,
        };
    }
    
    handleChange = (event) => {
        const { name, value } = event.target;
        if(name === "email"){
            this.setState({
                [name]: value,
                emailValido: true,
            });
        }
        if(name === "senha"){
            this.setState({
                [name]: value,
                senhaValida: true,
            });
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if(this.state.email === "" || this.state.senha === ""){
            if (this.state.email === "") {
                this.setState({
                    emailValido: false
                })
            } 
            if (this.state.senha === "") {
                this.setState({
                    senhaValida: false
                })
            } 
            return
        }
        // Enviar....
    }
    
    ehFormularioValido = () => {
        return this.state.emailValido && this.state.senhaValida
    }

    render() { 
      const botaoDesabilitado = this.ehFormularioValido() ? false : true;

      const botaoEntrarProps = {
        backgroundColor: "#b619b9",
        color: "white",
        label: "Entrar",
        height: "50px",
        width: "98%",
        borderRadius: "12px",
        disabled: botaoDesabilitado
      };
  
      return (
        <div className="login">
          <h2>Login</h2>
          <form className="formulario" onSubmit={this.handleSubmit}>
            <div className="email">
              <h3 className="login-label-email">Email</h3>
              <input 
                type="text" 
                name="email" 
                value={this.state.email} 
                onChange={this.handleChange}
                className={this.state.emailValido ? "input-email" : "input-email error"}
                placeholder="Digite seu e-mail">
               </input>
               {this.state.emailValido ? null : (
                    <div className="error-message">O campo deve ser preenchido.</div>
                )}
            </div>
            <div className="senha">
              <h3 className="login-label-senha">Senha</h3>
              <input 
                type="password" 
                name="senha" 
                value={this.state.senha} 
                onChange={this.handleChange}
                className={this.state.senhaValida? "input-senha" : "input-senha error"}  
                placeholder="Digite sua senha">
                </input>
                {this.state.senhaValida ? null : (
                    <div className="error-message">O campo deve ser preenchido.</div>
                )}
            </div>
            <BotaoTematico className="botao-entrar" {...botaoEntrarProps}></BotaoTematico>
            <span className="senha-esquecida">Esqueci minha senha</span>
          </form>
        </div>
      );
    }
}

export default FormularioLogin
