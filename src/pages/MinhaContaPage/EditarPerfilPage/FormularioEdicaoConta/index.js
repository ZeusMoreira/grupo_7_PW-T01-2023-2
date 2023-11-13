import React, { useEffect, useState } from "react";
import './style.css';
import { isMobile } from 'react-device-detect';
import BotaoTematico from "../../../../components/BotaoTematico";
import { getAuth, updateProfile } from "firebase/auth";


function FormularioEdicaoConta() {
  const [senhaValida, setSenhaValida] = useState(true);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarSenhaRepetida, setMostrarSenhaRepetida] = useState(false)
  const [requisicaoEmAndamento, setRequisicaoEmAndamento] = useState(false)
  const [tamanhoSenhaValido, setTamanhoSenhaValido] = useState(true)
  const [repetirSenhaValida, setRepetirSenhaValida] = useState(true)
  const [senhasIguais, setSenhasIguais] = useState(true)
  const [usuarioValido, setUsuarioValido] = useState(true)
  const [usuarioFormatoValido, setUsuarioFormatoValido] = useState(true)
  const [state, setState] = useState({
    usuario: '',
    senha: '',
    senhaRepetida: '',
  });
  const [verificacaoConcluida, setVerificacaoConcluida] = useState(false)
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

  const alternarVisibilidadeSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const alternarVisibilidadeSenhaRepetida = () => {
    setMostrarSenhaRepetida(!mostrarSenhaRepetida);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setTamanhoSenhaValido(true)
    setRepetirSenhaValida(true)
    setSenhaValida(true)
    setSenhasIguais(true)
    setUsuarioValido(true)
    setUsuarioFormatoValido(true)

    setState({
      ...state,
      [name]: value,
    });
  };

  const ehUsuarioValido = (usuario) => {
    return usuario.trim().length >= 4;
  };

  const ehSenhaValida = (senha) => {
    return senha.length >= 6
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (state.usuario !== '') {
        if(!ehUsuarioValido(state.usuario)){
            setUsuarioFormatoValido(false)
        }
    } else {
        setUsuarioValido(true)
    }

    if(state.senha !== ''){
        if(!ehSenhaValida(state.senha)){
            setTamanhoSenhaValido(false)
        }
    } else {
        if(state.senhaRepetida === ''){
            setSenhaValida(true)
        } else {
            setSenhaValida(false)
        }
    }

    if (state.senha !== '' && state.senhaRepetida !== '') {
        if (state.senha !== state.senhaRepetida) {
            setSenhasIguais(false)
        }
    }

    if (state.senhaRepetida === '') {
        if(state.senha === '') {
            setRepetirSenhaValida(true) 
        } else {
            setRepetirSenhaValida(false) 
        } 
    }

    setVerificacaoConcluida(true)
  }

  const ehFormularioValido = () => {
    return tamanhoSenhaValido &&
    repetirSenhaValida &&
    senhaValida &&
    senhasIguais &&
    usuarioValido &&
    usuarioFormatoValido
  }

  useEffect(() => {
    if (verificacaoConcluida) {
        if(state.usuario !== '' && state.senha === '' && state.senhaRepetida === '') {
            // método que atualiza apenas o username e também no banco
        } else if(state.usuario !== '' && state.senha !== '' && state.senhaRepetida !== '') {
            // método que atualiza o username e senha
        } else if(state.usuario === '' && state.senha !== '' && state.senhaRepetida !== ''){
            // métod que atualiza apenas a senha
        }
      setVerificacaoConcluida(false)
    }

  }, [verificacaoConcluida]);

  const botaoDesabilitado = ehFormularioValido() ? false : true;

  const botaoSalvarContaProps = {
    backgroundColor: "#b619b9",
    color: "white",
    label: "Salvar",
    height: "50px",
    width: "98%",
    borderRadius: "12px",
    disabled: botaoDesabilitado
  };

  return (
    <div className="edicao-conta">
      {requisicaoEmAndamento && 
        <div className="overlay-edicao-conta">
            <div class="loader">
              <div class="ball"></div>
              <div class="ball"></div>
              <div class="ball"></div>
              <span>Loading...</span>
            </div>
        </div>
      }
      <form className="formulario-edicao-conta" onSubmit={handleSubmit}>
        <div className="usuario-edicao-conta">
            <h3 className="label-usuario-edicao-conta">Usuário</h3>
            <input
                maxLength={16}
                type="text"
                name="usuario"
                value={state.usuario}
                onChange={handleChange}
                className={
                usuarioValido && usuarioFormatoValido
                    ? 'input-usuario-edicao-conta'
                    : 'input-usuario-edicao-conta erro'                                                                    
                }
                placeholder="Digite seu usuário"
                disabled={requisicaoEmAndamento}
            />
            {usuarioValido ? null : <div className="error-message-edicao-conta">O campo deve ser preenchido.</div>}
            {usuarioFormatoValido ? null : <div className="error-message-edicao-conta">O usuário deve conter acima de 4 caracteres.</div>}
        </div>

        <div className="senha-edicao-conta">
            <h3 className="edicao-conta-label-senha">Senha</h3>
            <div class="password-container-edicao-conta">
                <input
                    type={mostrarSenha ? "text" : "password"}
                    name="senha"
                    value={state.senha}
                    onChange={handleChange}
                    className={senhaValida ? "input-senha-edicao-conta" : "input-senha-edicao-conta erro"}
                    placeholder="Digite sua senha"
                />
            <i className="material-icons show-password" onClick={alternarVisibilidadeSenha}>{mostrarSenha ? "visibility" : "visibility_off"}</i>
            </div>
            {senhaValida ? null : <div className="error-message-edicao-conta">O campo deve ser preenchido.</div>}
            {tamanhoSenhaValido ? null : <div className="error-message-edicao-conta">A senha deve conter pelo menos 6 caracteres.</div>}
        </div>

        <div className="repetir-senha-edicao-conta">
            <h3 className="label-repetir-senha-edicao-conta">Repetir Senha</h3>
            <div class="password-container-edicao-conta">
                <input
                    type={mostrarSenhaRepetida ? "text" : "password"}
                    name="senhaRepetida"
                    value={state.senhaRepetida}
                    onChange={handleChange}
                    className={
                    repetirSenhaValida && senhasIguais ? 'input-senha-edicao-conta' : 'input-senha-edicao-conta erro'
                    }
                    placeholder="Repetir senha"
                    disabled={requisicaoEmAndamento}
                />
                <i className="material-icons show-password" onClick={alternarVisibilidadeSenhaRepetida}>{mostrarSenhaRepetida ? "visibility" : "visibility_off"}</i>
            </div>
            {repetirSenhaValida ? null : <div className="error-message-edicao-conta">O campo deve ser preenchido.</div>}
            {senhasIguais ? null : <div className="error-message-edicao-conta">As senhas informadas não coincidem.</div>}
        </div>
        {requisicaoEmAndamento ? <span className="spinner-registro"></span> : <BotaoTematico className="botao-salvar-conta" {...botaoSalvarContaProps}></BotaoTematico>}
      </form>
    </div>
  );
}

export default FormularioEdicaoConta;