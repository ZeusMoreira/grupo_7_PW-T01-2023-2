import './style.css';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import BotaoTematico from '../../components/BotaoTematico';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';


export const MinhaContaPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const isRouteActive = (route) => location.pathname.includes(route);
  const [loading, setLoading] = useState(true);
  const [tipoUser, setTipoUser] = useState(null)
  const auth = getAuth()

  const navegarHome = () => {
    navigate("/home");
  };

  const navegarEdicaoPerfil = () => {
    navigate("/minha-conta/editar-perfil");
  };

  const navegarGerenciarQuizzesPerfil = () => {
    navigate('/minha-conta/gerenciar-quizzes');
  };

  const navegarVisualizacaoPerfil = () => {
    navigate('/minha-conta/meu-perfil');
  };

  const [botaoEditarProps, setBotaoEditarProps] = useState({
    backgroundColor: '#b619b9',
    color:'white',
  });
  const [botaoVisualizarPerfilProps, setBotaoVisualizarPerfilProps] = useState({
    backgroundColor: 'white',
    color: '#b619b9',
  });
  const [botaoGerenciarQuizzesProps, setBotaoGerenciarQuizzesProps] = useState({
    backgroundColor: 'white',
    color: '#b619b9',
  });


  useEffect(() => {
    if(isRouteActive('/minha-conta/gerenciar-quizzes')){
      setBotaoEditarProps({
        backgroundColor: 'white',
        color: '#b619b9',
      })
      setBotaoGerenciarQuizzesProps({
        backgroundColor: '#b619b9',
        color: 'white',
      })
      setBotaoVisualizarPerfilProps({
        backgroundColor: 'white',
        color: '#b619b9',
      })
    } else if(isRouteActive('/minha-conta/meu-perfil')) {
      setBotaoVisualizarPerfilProps({
        backgroundColor: '#b619b9',
        color: 'white',
      })
      setBotaoGerenciarQuizzesProps({
        backgroundColor: 'white',
        color: '#b619b9',
      })
      setBotaoEditarProps({
        backgroundColor: 'white',
        color: '#b619b9',
      })
    } else {
      setBotaoEditarProps({
        backgroundColor: '#b619b9',
        color: 'white',
      })
      setBotaoGerenciarQuizzesProps({
        backgroundColor: 'white',
        color: '#b619b9',
      })
      setBotaoVisualizarPerfilProps({
        backgroundColor: 'white',
        color: '#b619b9',
      })
    }
  }, [location.pathname])
  
  const buscarDadosUsuario = async (username) => {
    try {
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
      const querySnapshot = await getDocs(query(usersCollection, where('username', '==', username)));
      querySnapshot.forEach((doc) => {
        setTipoUser(doc.data().tipo);
      });
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        buscarDadosUsuario(user.displayName);
      } else {
        setLoading(false); 
      }
    });

    window.addEventListener('resize', handleResize);
  
    return () => {
        window.removeEventListener('resize', handleResize);
        unsubscribe();
    };
  }, []);

  const botaoEditarPerfilProps = {
    backgroundColor: botaoEditarProps.backgroundColor,
    color: botaoEditarProps.color,
    label: "Editar Perfil",
    height: "50px",
    width: "20%",
    borderRadius: "6px",
  };

  const botaoGerenciarQuizzesPerfilProps = {
    backgroundColor: botaoGerenciarQuizzesProps.backgroundColor,
    color: botaoGerenciarQuizzesProps.color,
    label: "Gerenciar Quizzes",
    height: "50px",
    width: "20%",
    borderRadius: "6px",
  };

  const botaoMeuPerfilProps = {
    backgroundColor: botaoVisualizarPerfilProps.backgroundColor,
    color: botaoVisualizarPerfilProps.color,
    label: "Meu Perfil",
    height: "50px",
    width: "20%",
    borderRadius: "6px",
  };

  if (loading) {
    return <div className="overlay">
        <div className="loader">
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
            <span>Loading...</span>
        </div>
    </div>
  } 

  return (
    <div className="container-minha-conta-page">
        <div className="header-minha-conta">
          <div className="logo-container-minha-conta">
              <h1 className="logo-minha-conta" onClick={navegarHome}>Quizz<span>ES</span></h1>
          </div>
        </div>
        {
          <div className="subheader-minha-conta">
            <div className="botoes-minha-conta">
              <BotaoTematico
                className="botao-editar-perfil" {...botaoEditarPerfilProps} onClick={navegarEdicaoPerfil}
              />
              {
                tipoUser === "admin" && <BotaoTematico
                className="botao-gerenciar-quizzes" {...botaoGerenciarQuizzesPerfilProps} onClick={navegarGerenciarQuizzesPerfil}
                />
              }
              <BotaoTematico
                className="botao-meu-perfil" {...botaoMeuPerfilProps} onClick={navegarVisualizacaoPerfil}
              />
            </div>
          </div>
        }
        <Outlet></Outlet>
    </div>
  );
}

export default MinhaContaPage; 