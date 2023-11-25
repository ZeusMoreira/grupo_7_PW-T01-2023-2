import React, { useEffect, useState } from "react";
import './style.css';
import BotaoTematico from "../../../../components/BotaoTematico";
import { getAuth, updatePassword, updateProfile } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { Tooltip } from 'react-tooltip'

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
  // eslint-disable-next-line
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
        if(state.senha !== '' && state.senhaRepetida === '') {
          setRepetirSenhaValida(false)
        } else if(state.senha === '' && state.senhaRepetida !== '') {
          setSenhaValida(false)
        }
        if(!ehUsuarioValido(state.usuario)){
          setUsuarioFormatoValido(false)
        }
    } else{
        if(state.senha === '' && state.senhaRepetida === ''){
          setUsuarioValido(false)
          setSenhaValida(false)
          setRepetirSenhaValida(false)
        } else {
          setUsuarioValido(true)
        }
    }

    if(state.senha !== ''){
        if(state.senhaRepetida === ''){
          setRepetirSenhaValida(false)
        }
        if(!ehSenhaValida(state.senha)){
          setTamanhoSenhaValido(false)
        }
    } else {
        if(state.senhaRepetida === '' && state.usuario !== ''){
          setSenhaValida(true)
        }
    }

    if (state.senha !== '' && state.senhaRepetida !== '') {
        if (state.senha !== state.senhaRepetida) {
            setSenhasIguais(false)
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
    if (verificacaoConcluida && ehFormularioValido()) {
      if(state.usuario !== '' && state.senha === '' && state.senhaRepetida === '') {
        alterarDadosApenasUsuario()
      } else if(state.usuario !== '' && state.senha !== '' && state.senhaRepetida !== '') {
        alterarDadosUsuarioEsenha()
      } else if(state.usuario === '' && state.senha !== '' && state.senhaRepetida !== ''){
        alterarDadosApenasSenha()
      }
    }
    setVerificacaoConcluida(false)

  }, [verificacaoConcluida]);

  const buscarDadosUsuario = async () => {
    const auth = getAuth();
    const db = getFirestore();
    const usersCollection = collection(db, 'users');
    const querySnapshot = await getDocs(query(usersCollection, where('uid', '==', auth.currentUser.uid)));
    const docRef = doc(db, 'users', auth.currentUser.uid);
    return {
      auth: auth,
      usuarioAuth: auth.currentUser,
      usuarioFirestore: querySnapshot.docs[0].data(),
      docRef: docRef,
    }
  }

  const alterarDadosApenasUsuario = async () => {
    setRequisicaoEmAndamento(true)
    const dados = await buscarDadosUsuario()

    await updateDoc(dados.docRef, {
      username: state.usuario,
    }).catch(() => {
      toast.error('Não foi possível alterar o nome de usuário, tente novamente mais tarde!')
      return
    })

    await updateProfile(dados.usuarioAuth, {
        displayName: state.usuario,
    }).catch(async () => {
      await updateDoc(dados.docRef, {
        username: dados.usuarioAuth.displayName,
      })
      toast.error('Não foi possível alterar o nome de usuário, tente novamente mais tarde!')
      return
    })
    
    toast.success('Nome de usuário atualizado com sucesso!')
    setRequisicaoEmAndamento(false)
  }

  const alterarDadosUsuarioEsenha = async () => {
    setRequisicaoEmAndamento(true)

    await alterarDadosApenasUsuario()
    await alterarDadosApenasSenha()
      
    setRequisicaoEmAndamento(false)
  }

  const alterarDadosApenasSenha = async () => {
    setRequisicaoEmAndamento(true)
    const dados = await buscarDadosUsuario()

    await updatePassword(dados.usuarioAuth, state.senha).then(() => {
      toast.success('Senha atualizada com sucesso!')
    }).catch(async () => {
      await updateProfile(dados.usuarioAuth, {
        displayName: dados.usuarioAuth.displayName,
      })
      await updateDoc(dados.docRef, {
        username: dados.usuarioAuth.displayName,
      })
      toast.error('Não foi possível alterar a senha de usuário, tente relogar ou tente novamente mais tarde!')
      return
    })

    setRequisicaoEmAndamento(false)
  }
 
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
            <div className="loader">
              <div className="ball"></div>
              <div className="ball"></div>
              <div className="ball"></div>
              <span>Loading...</span>
            </div>
        </div>
      }
      <form className="formulario-edicao-conta" onSubmit={handleSubmit}>
        <div className="usuario-edicao-conta">
            <div className="row-campos-edicao">
              <h3 className="label-usuario-edicao-conta">Usuário</h3>
              <a data-tooltip-id="my-tooltip" data-tooltip-content="Você pode atualizar o usuário preenchendo apenas este campo e mais nenhum, ou atualizar a senha e o usuário juntos." href="#my-tooltip">
              <i className="material-icons info-campos-edicao">info</i>
              </a>
              <Tooltip id="my-tooltip" className="tooltip-edicao" />
            </div>
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
            <div className="row-campos-edicao">
              <h3 className="edicao-conta-label-senha">Senha</h3>
              <a data-tooltip-id="my-tooltip" data-tooltip-content="Você pode atualizar a senha preenchendo este campo e repetindo a senha, não é obrigatório o campo usuário." href="#my-tooltip">
              <i className="material-icons info-campos-edicao">info</i>
              </a>
              <Tooltip id="my-tooltip" className="tooltip-edicao" />
            </div>
            <div className="password-container-edicao-conta">
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
            <div className="password-container-edicao-conta">
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