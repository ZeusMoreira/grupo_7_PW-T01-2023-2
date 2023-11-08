import React, { useState } from "react";
import BotaoTematico from "../BotaoTematico";
import './style.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth';

function FormularioLogin() {
  const navigate = useNavigate();
  const [erros, setErros] = useState({
    mostrarErro: false,
    mensagemErro: ""
  });
  const [recuperacaoEmail, setRecuperacaoEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [emailValido, setEmailValido] = useState(true);
  const [senhaValida, setSenhaValida] = useState(true);
  const [emailRecuperacao, setEmailRecuperacao] = useState("")
  const [emailRecuperacaoValido, setEmailRecuperacaoValido] = useState(true);
  const [emailRecuperacaoFormatoValido, setEmailRecuperacaoFormatoValido] = useState(true);
  const [enviandoRedefinicaoSenha, setEnviandoRedefinicaoSenha] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [requisicaoEmAndamento, setRequisicaoEmAndamento] = useState(false)

  const alternarVisibilidadeSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
      setEmailValido(true);
    }
    if (name === "senha") {
      setSenha(value);
      setSenhaValida(true);
    }
  }

  const handleChangeRecuperacao = (event) => {
    const { value } = event.target;
    setEmailRecuperacaoValido(true)
    setEmailRecuperacaoFormatoValido(true)
    setEmailRecuperacao(value)
  }

  const handleSubmitRecuperacao = async (event) => {
    event.preventDefault()

    if (emailRecuperacao !== '') {
      if(!ehEmailValido(emailRecuperacao)){
        setEmailRecuperacaoFormatoValido(false)
      } else {
        enviarRedefinicaoSenha()
      }
    } else {
      setEmailRecuperacaoValido(false)
    }
  }

  const ehEmailValido = (email) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return regex.test(email);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (email === "" || senha === "") {
      if (email === "") {
        setEmailValido(false);
      }
      if (senha === "") {
        setSenhaValida(false);
      }
      return;
    }

    const auth = getAuth();

    setRequisicaoEmAndamento(true)
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate('/home');
    } catch (error) {
      setRequisicaoEmAndamento(false)
      if (error.code === 'auth/invalid-login-credentials') {
        setErros({
          mostrarErro: true,
          mensagemErro: 'Email ou senha inválidos.',
        });
        return;
      }
      setErros({
        mostrarErro: true,
        mensagemErro: 'Ocorreu um erro durante o login. Por favor, tente novamente.',
      });
    }
    setRequisicaoEmAndamento(false)
  }

  const enviarRedefinicaoSenha = async () => {
    fecharModalRedefinicao()
    setEnviandoRedefinicaoSenha(true);
  
    const auth = getAuth();

    setRequisicaoEmAndamento(true)
    try {
      await sendPasswordResetEmail(auth, emailRecuperacao);
      setErros({
        mostrarErro: true,
        mensagemErro: 'Um e-mail de redefinição de senha foi enviado caso esteja vinculado a alguma conta. Verifique sua caixa de entrada.',
      });
    } catch (error) {
      setRequisicaoEmAndamento(false)
        setErros({
          mostrarErro: true,
          mensagemErro: 'Ocorreu um erro ao enviar o e-mail de redefinição de senha. Por favor, tente novamente.',
        });
    }
    setRequisicaoEmAndamento(false)
    setEnviandoRedefinicaoSenha(false);
  };

  const ehFormularioValido = () => {
    return emailValido && senhaValida;
  }

  const fecharModalErro = () => {
    setErros({
      mostrarErro: false,
      mensagemErro: '',
    });
  };

  const fecharModalRedefinicao = () => {
    setEmailRecuperacao("")
    setEmailRecuperacaoValido(true)
    setEmailRecuperacaoFormatoValido(true)
    setRecuperacaoEmail(false);
  };

  const abrirModalRedefinicaoSenha = () => {
    setRecuperacaoEmail(true);
  };

  const botaoDesabilitado = ehFormularioValido() ? false : true;

  const botaoEntrarProps = {
    backgroundColor: "#b619b9",
    color: "white",
    label: "Entrar",
    height: "50px",
    width: "98%",
    borderRadius: "12px",
    disabled: botaoDesabilitado
  };

  const botaoEnviarProps = {
    backgroundColor: "#b619b9",
    color: "white",
    label: "Enviar",
    width: "20%",
    height: "35px",
    borderRadius: "6px",
    disabled: enviandoRedefinicaoSenha
  };

  return (
    <div className="login">
      {requisicaoEmAndamento && 
        <div className="overlay">
            <div class="loader">
              <div class="ball"></div>
              <div class="ball"></div>
              <div class="ball"></div>
              <span>Loading...</span>
            </div>
        </div>
      }
      <h2>Login</h2>
      <form className="formulario" onSubmit={handleSubmit}>
        <div className="email">
          <h3 className="login-label-email">Email</h3>
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleChange}
            className={emailValido ? "input-email" : "input-email erro"}
            placeholder="Digite seu e-mail"
          />
          {!emailValido ? (
            <div className="error-message">O campo deve ser preenchido.</div>
          ) : null}
        </div>
        <div className="senha">
          <h3 className="login-label-senha">Senha</h3>
          <div class="password-container">
              <input
                type={mostrarSenha ? "text" : "password"}
                name="senha"
                value={senha}
                onChange={handleChange}
                className={senhaValida ? "input-senha" : "input-senha erro"}
                placeholder="Digite sua senha"
            />
            <i className="material-icons show-password" onClick={alternarVisibilidadeSenha}>{mostrarSenha ? "visibility" : "visibility_off"}</i>
          </div>
          {!senhaValida ? (
            <div className="error-message">O campo deve ser preenchido.</div>
          ) : null}
        </div>
        <BotaoTematico className="botao-entrar" {...botaoEntrarProps}></BotaoTematico>
        <span onClick={abrirModalRedefinicaoSenha} className="senha-esquecida">Esqueci minha senha</span>
      </form>
      {erros.mostrarErro && <div className="overlay" onClick={fecharModalErro}></div>}
      {erros.mostrarErro && (
        <div className="modal">
          <p>{erros.mensagemErro}</p>
          <button className="botao-erro" onClick={fecharModalErro}>
            Fechar
          </button>
        </div>
      )}
      {recuperacaoEmail && <div className="overlay" onClick={fecharModalRedefinicao}></div>}
      {recuperacaoEmail && (
        <div className="modal">
          <form onSubmit={handleSubmitRecuperacao}>
            <h3 className="redefinicao-label-email">Digite seu email</h3>
            <input
              type="text"
              name="email"
              value={emailRecuperacao}
              onChange={handleChangeRecuperacao}
              className={emailRecuperacaoValido && emailRecuperacaoFormatoValido ? "redefinicao-input-email" : "redefinicao-input-email erro"}
              placeholder="Digite seu e-mail"
            />

            {emailRecuperacaoValido ? null : <div className="error-message">O campo deve ser preenchido.</div>}
            {emailRecuperacaoFormatoValido ? null : <div className="error-message">O formato do email preenchido não é válido.</div>}
            <BotaoTematico className="botao-enviar" {...botaoEnviarProps}></BotaoTematico>
          </form>
          
        </div>
      )}
    </div>
  );
}

export default FormularioLogin;