import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, setDoc, doc, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import BotaoTematico from '../BotaoTematico';
import { toast } from "react-toastify";

import './style.css';

function FormularioRegistro() {
  const navigate = useNavigate();
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarSenhaRepetida, setMostrarSenhaRepetida] = useState(false)
  const [requisicaoEmAndamento, setRequisicaoEmAndamento] = useState(false)
  const [emailValido, setEmailValido] = useState(true)
  const [emailFormatoValido, setEmailFormatoValido] = useState(true)
  const [tamanhoSenhaValido, setTamanhoSenhaValido] = useState(true)
  const [repetirSenhaValida, setRepetirSenhaValida] = useState(true)
  const [senhaValida, setSenhaValida] = useState(true)
  const [senhasIguais, setSenhasIguais] = useState(true)
  const [usuarioValido, setUsuarioValido] = useState(true)
  const [usuarioFormatoValido, setUsuarioFormatoValido] = useState(true)
  const [erros, setErros] = useState({
    mostrarErro: false,
    mensagemErro: ""
  })
  const [verificacaoConcluida, setVerificacaoConcluida] = useState(false)
  
  const alternarVisibilidadeSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const alternarVisibilidadeSenhaRepetida = () => {
    setMostrarSenhaRepetida(!mostrarSenhaRepetida);
  };
  
  const [state, setState] = useState({
    usuario: '',
    email: '',
    senha: '',
    senhaRepetida: '',
  });

  useEffect(() => {
    if (verificacaoConcluida) {
      registrarUsuario()
    }
  }, [verificacaoConcluida]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setEmailValido(true)
    setEmailFormatoValido(true)
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (state.email !== '') {
      if(!ehEmailValido(state.email)){
        setEmailFormatoValido(false)
      }
    } else {
      setEmailValido(false)
    }

    if (state.usuario !== '') {
      if(!ehUsuarioValido(state.usuario)){
        setUsuarioFormatoValido(false)
      }
    } else {
      setUsuarioValido(false)
    }

    if(state.senha !== ''){
      if(!ehSenhaValida(state.senha)){
        setTamanhoSenhaValido(false)
      }
    } else {
      setSenhaValida(false)
    }

    if (state.senha !== '' && state.senhaRepetida !== '') {
      if (state.senha !== state.senhaRepetida) {
        setSenhasIguais(false)
      }
    }

    if (state.senhaRepetida === '') {
      setRepetirSenhaValida(false)
    }

    setVerificacaoConcluida(true)
  };

  const registrarUsuario = async () => {
    if(!ehFormularioValido()){
      setVerificacaoConcluida(false)
      return;
    }

    const { email, senha, usuario } = state;
    const auth = getAuth();
    const db = getFirestore();

    const usersCollection = collection(db, 'users');
    let querySnapshot = await getDocs(query(usersCollection, where('username', '==', usuario)));
    
    
    if (!querySnapshot.empty) {
      setVerificacaoConcluida(false);
      setErros({
        mostrarErro: true,
        mensagemErro: 'O nome de usuário já está em uso. Escolha outro nome de usuário.',
      });
      return;
    }

    querySnapshot = await getDocs(query(usersCollection, orderBy('posicao', 'asc')));
    let posicaoRanking = 1

    if (!querySnapshot.empty) {
      const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
      const posicao = lastDocument.data().posicao;
      posicaoRanking = posicao + 1
    }
  
    setRequisicaoEmAndamento(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      
      await updateProfile(user, {
        displayName: usuario,
      });

      const userData = {
        username: usuario,
        score: 0,
        posicao: posicaoRanking,
        categoriaFavorita: null,
        tipo: "comum",
        uid: user.uid
      };

      const userDocRef = doc(db, 'users', user.uid);

      await setDoc(userDocRef, userData);

      navigate('/');
      toast.success("Registro realizado com sucesso.");
    } catch (error) {
      setVerificacaoConcluida(false)
      setRequisicaoEmAndamento(false)
      if (error.code === 'auth/email-already-in-use') {
        setErros({
          mostrarErro: true,
          mensagemErro: 'O email informado já está vinculado a outro cadastro.',
        });
        return;
      }
      setErros({
        mostrarErro: true,
        mensagemErro: 'Ocorreu um erro durante o registro. Por favor, tente novamente.',
      });
    }
    setRequisicaoEmAndamento(false)
    setVerificacaoConcluida(false)
  }

  const fecharModalErro = () => {
    setErros({
      mostrarErro: false,
      mensagemErro: '',
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
      emailValido &&
      emailFormatoValido &&
      tamanhoSenhaValido &&
      repetirSenhaValida &&
      senhaValida &&
      senhasIguais &&
      usuarioValido &&
      usuarioFormatoValido
    );
  };

  const botaoDesabilitado = ehFormularioValido(state) ? false : true;

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
      <h2>Registrar</h2>
      <form className="formulario" onSubmit={handleSubmit}>
        <div className="usuario">
          <h3 className="label-usuario">Usuário</h3>
          <input
            maxLength={16}
            type="text"
            name="usuario"
            value={state.usuario}
            onChange={handleChange}
            className={
              usuarioValido && usuarioFormatoValido
                ? 'input-usuario'
                : 'input-usuario erro'                                                                    
            }
            placeholder="Digite seu usuário"
            disabled={requisicaoEmAndamento}
          />
          {usuarioValido ? null : <div className="error-message">O campo deve ser preenchido.</div>}
          {usuarioFormatoValido ? null : <div className="error-message">O usuário deve conter acima de 4 caracteres.</div>}
        </div>
        <div className="registro-senha">
          <h3 className="registro-label-senha">Senha</h3>
          <div class="password-container">
              <input
                type={mostrarSenha ? "text" : "password"}
                name="senha"
                value={state.senha}
                onChange={handleChange}
                className={
                  senhaValida && tamanhoSenhaValido ? 'input-senha' : 'input-senha erro'
                }
                placeholder="Digite sua senha"
                disabled={requisicaoEmAndamento}
            />
            <i className="material-icons show-password" onClick={alternarVisibilidadeSenha}>{mostrarSenha ? "visibility" : "visibility_off"}</i>
          </div>
          {senhaValida ? null : <div className="error-message">O campo deve ser preenchido.</div>}
          {tamanhoSenhaValido ? null : <div className="error-message">A senha deve conter pelo menos 6 caracteres.</div>}
        </div>
        <div className="repetir-senha">
          <h3 className="label-repetir-senha">Repetir Senha</h3>
          <div class="password-container">
              <input
                type={mostrarSenhaRepetida ? "text" : "password"}
                name="senhaRepetida"
                value={state.senhaRepetida}
                onChange={handleChange}
                className={
                  repetirSenhaValida && senhasIguais ? 'input-senha' : 'input-senha erro'
                }
                placeholder="Repetir senha"
                disabled={requisicaoEmAndamento}
            />
            <i className="material-icons show-password" onClick={alternarVisibilidadeSenhaRepetida}>{mostrarSenhaRepetida ? "visibility" : "visibility_off"}</i>
          </div>
          {repetirSenhaValida ? null : <div className="error-message">O campo deve ser preenchido.</div>}
          {senhasIguais ? null : <div className="error-message">As senhas informadas não coincidem.</div>}
        </div>
        <div className="registro-email">
          <h3 className="registro-label-email">Email</h3>
          <input
            type="text"
            name="email"
            value={state.email}
            onChange={handleChange}
            className={
              emailValido && emailFormatoValido ? 'input-email' : 'input-email erro'
            }
            placeholder="Digite seu e-mail"
            disabled={requisicaoEmAndamento}
          />
          {emailValido ? null : <div className="error-message">O campo deve ser preenchido.</div>}
          {emailFormatoValido ? null : <div className="error-message">O formato do email preenchido não é válido.</div>}
        </div>
        {requisicaoEmAndamento ? <span className="spinner"></span> : <BotaoTematico className="botao-registrar" {...botaoRegistrarProps}></BotaoTematico>}
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
    </div>
  );
}

export default FormularioRegistro