import './style.css';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import BotaoTematico from '../../components/BotaoTematico';

export const MinhaContaPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const isRouteActive = (route) => location.pathname.includes(route);

  const navegarHome = () => {
    navigate("/home");
  };
  
  const navegarEdicaoPerfil = () => {
    navigate("/minha-conta/editar-perfil");
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

  useEffect(() => {
    if(isRouteActive('/minha-conta/editar-perfil')){
      setBotaoEditarProps({
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
      setBotaoEditarProps({
        backgroundColor: 'white',
        color: '#b619b9',
      })
    }
  }, [location.pathname])

  useEffect(() => {
    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };
  
    window.addEventListener('resize', handleResize);
  
    return () => {
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  const botaoEditarPerfilProps = {
    backgroundColor: botaoEditarProps.backgroundColor,
    color: botaoEditarProps.color,
    label: "Editar Perfil",
    height: "50px",
    width: "150px",
    borderRadius: "6px",
  };

  const botaoMeuPerfilProps = {
    backgroundColor: botaoVisualizarPerfilProps.backgroundColor,
    color: botaoVisualizarPerfilProps.color,
    label: "Meu Perfil",
    height: "50px",
    width: "150px",
    borderRadius: "6px",
  };

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