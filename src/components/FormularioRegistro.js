import React, { useState, useEffect } from 'react';
import BotaoTematico from './BotaoTematico';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import './FormularioRegistro.css';

function FormularioRegistro() {
  const navigate = useNavigate();

  const [state, setState] = useState({
    usuario: '',
    email: '',
    senha: '',
    senhaRepetida: '',
    emailValido: true,
    emailFormatoValido: true,
    senhaValida: true,
    repetirSenhaValida: true,
    usuarioValido: true,
    usuarioFormatoValido: true,
    senhasIguais: true,
    requisicaoEmAndamento: false,
    mostrarErro: false,
    tamanhoSenhaValida: true,
    mensagemErro: '',
  });

  // useEffect(() => {
  //   // Este código será executado sempre que o estado for atualizado

  //   console.log(state); // Acesso ao estado atualizado
  // }, [state]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setState({
      ...state,
      [name]: value,
      emailValido: true,
      emailFormatoValido: true,
      tamanhoSenhaValida: true,
      repetirSenhaValida: true,
      senhaValida: true,
      senhasIguais: true,
      usuarioValido: true,
      usuarioFormatoValido: true,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newState = { ...state };

    if (state.email !== '' && !ehEmailValido(state.email)) {
      newState.emailFormatoValido = false
      console.log(newState)
      setState(newState);
    }

    if (state.usuario !== '' && !ehUsuarioValido(state.usuario)) {
      newState.usuarioFormatoValido = false
      setState(newState);
    }

    if(state.senha !== '' && !ehSenhaValida(state.senha)){
      newState.tamanhoSenhaValida = false
      setState(newState);
    }

    if (state.senha !== '' && state.senhaRepetida !== '') {
      if (state.senha !== state.senhaRepetida) {
        newState.senhasIguais = false
        setState(newState);
      }
    }

    if (state.email === '' || state.senha === '' || state.usuario === '' || state.senhaRepetida === '') {
      console.log(state)
      if (state.email === '') {
        newState.emailValido = false
      }
      if (state.senha === '') {
        newState.senhaValida = false
      }
      if (state.usuario === '') {
        newState.usuarioValido = false
      }
      if (state.senhaRepetida === '') {
        newState.repetirSenhaValida = false
      }
      setState(newState);
      console.log(newState)
      return;
    }

    const { email, senha, usuario } = state;
    const auth = getAuth();
    const db = getFirestore();

    try {
      setState({
        ...state,
        requisicaoEmAndamento: true,
      });

      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      const userData = {
        username: usuario,
        score: 0,
        posicao: null,
        categoriaFavorita: null,
      };
      const userDocRef = doc(db, 'users', user.uid);

      await setDoc(userDocRef, userData);

      setState({
        ...state,
        requisicaoEmAndamento: false,
      });

      navigate('/');
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      setState({
        ...state,
        mostrarErro: true,
        mensagemErro: 'Ocorreu um erro durante o registro. Por favor, tente novamente.',
      });
    }
  };

  const fecharModalErro = () => {
    setState({
      ...state,
      mostrarErro: false,
      mensagemErro: '',
      requisicaoEmAndamento: false,
    });
  };

  const ehEmailValido = (email) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return regex.test(email);
  };

  const ehUsuarioValido = (usuario) => {
    return usuario.trim().length >= 4;
  };

  const ehSenhaValida = (senha) => {
    return senha.length >= 6
  }

  const ehFormularioValido = () => {
    return (
      state.emailValido &&
      state.senhaValida &&
      state.repetirSenhaValida &&
      state.usuarioValido &&
      state.emailFormatoValido &&
      state.usuarioFormatoValido &&
      state.senhasIguais &&
      state.tamanhoSenhaValida
    );
  };

  const botaoDesabilitado = ehFormularioValido() ? false : true;

  const botaoRegistrarProps = {
    backgroundColor: '#b619b9',
    color: 'white',
    label: 'Registrar',
    height: '50px',
    width: '98%',
    borderRadius: '12px',
    disabled: botaoDesabilitado,
  };

  return (
    <div className="cadastro">
      <h2>Registrar</h2>
      <form className="formulario" onSubmit={handleSubmit}>
        <div className="usuario">
          <h3 className="label-usuario">Usuário</h3>
          <input
            type="text"
            name="usuario"
            value={state.usuario}
            onChange={handleChange}
            className={
              state.usuarioValido && state.usuarioFormatoValido
                ? 'input-usuario'
                : 'input-usuario error'
            }
            placeholder="Digite seu usuário"
            disabled={state.requisicaoEmAndamento}
          />
          {state.usuarioValido ? null : <div className="error-message">O campo deve ser preenchido.</div>}
          {state.usuarioFormatoValido ? null : <div className="error-message">O usuário deve conter acima de 4 caracteres.</div>}
        </div>
        <div className="registro-senha">
          <h3 className="registro-label-senha">Senha</h3>
          <input
            type="password"
            name="senha"
            value={state.senha}
            onChange={handleChange}
            className={
              state.senhaValida && state.tamanhoSenhaValida ? 'input-senha' : 'input-senha error'
            }
            placeholder="Digite sua senha"
            disabled={state.requisicaoEmAndamento}
          />
          {state.senhaValida ? null : <div className="error-message">O campo deve ser preenchido.</div>}
          {state.tamanhoSenhaValida ? null : <div className="error-message">A senha deve conter pelo menos 6 caracteres.</div>}
        </div>
        <div className="repetir-senha">
          <h3 className="label-repetir-senha">Repetir Senha</h3>
          <input
            type="password"
            name="senhaRepetida"
            value={state.senhaRepetida}
            onChange={handleChange}
            className={
              state.repetirSenhaValida && state.senhasIguais ? 'input-senha' : 'input-senha error'
            }
            placeholder="Repetir senha"
            disabled={state.requisicaoEmAndamento}
          />
          {state.repetirSenhaValida ? null : <div className="error-message">O campo deve ser preenchido.</div>}
          {state.senhasIguais ? null : <div className="error-message">As senhas informadas não coincidem.</div>}
        </div>
        <div className="registro-email">
          <h3 className="registro-label-email">Email</h3>
          <input
            type="text"
            name="email"
            value={state.email}
            onChange={handleChange}
            className={
              state.emailValido && state.emailFormatoValido ? 'input-email' : 'input-email error'
            }
            placeholder="Digite seu e-mail"
            disabled={state.requisicaoEmAndamento}
          />
          {state.emailValido ? null : <div className="error-message">O campo deve ser preenchido.</div>}
          {state.emailFormatoValido ? null : <div className="error-message">O formato do email preenchido não é válido.</div>}
        </div>
        {state.requisicaoEmAndamento ? <span className="spinner"></span> : <BotaoTematico className="botao-registrar" {...botaoRegistrarProps}></BotaoTematico>}
      </form>
      {state.mostrarErro && <div className="overlay" onClick={fecharModalErro}></div>}
      {state.mostrarErro && (
        <div className="modal">
          <p>{state.mensagemErro}</p>
          <button className="botaoerro" onClick={fecharModalErro}>
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}

export default FormularioRegistro;