
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import './style.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
    const navigate = useNavigate();
    const [balaoVisivel, setBalaoVisivel] = useState(false);
    const [userName, setUserName] = useState('');

    const handleUserTextClick = (event) => {
        event.stopPropagation();
        setBalaoVisivel(!balaoVisivel);
    };

    const handleOutsideClick = (event) => {
        if (balaoVisivel) {
            if (!document.getElementById('container-menu').contains(event.target)) {
                setBalaoVisivel(false);
            }
        }
    };

    const sair = async () => {
        const auth = getAuth();
        try {
          await signOut(auth);
          navigate('/');
        } catch (error) {
          console.error('Ocorreu um erro durante o logout:', error);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserName(user.displayName || 'Usuário'); 
            } else {
                setUserName('Usuário'); 
            }
        });
        return () => {
            document.removeEventListener('click', handleOutsideClick);
            unsubscribe();
        };
    });

    const iconStyle = {
        fontSize: '35px', 
        padding: '0',
        margin: '0'
    };

    return (
        <div className="container">
            <div className="header">
                <div className="sizedbox"></div>
                <div className="logo-container">
                    <h1 className="logo">Quizz<span>ES</span></h1>
                </div>
                <div className="menu-options">
                    <span className="user-text" onClick={handleUserTextClick}>
                        Olá, {userName}! 
                        { balaoVisivel &&
                            <i className="material-icons" style={iconStyle}>arrow_drop_up</i>
                        }
                        { !balaoVisivel &&
                            <i className="material-icons" style={iconStyle}>arrow_drop_down</i>
                        }
                    </span>     
                    {balaoVisivel &&
                        <div id="container-menu">
                            <div className="telhado"></div>
                            <div id="balao-retangular">
                                <div className="minha-conta">
                                    <i className="material-icons">person</i>
                                    <span>Minha Conta</span>
                                </div>
                                <div className="sair" onClick={sair}>
                                    <i className="material-icons">exit_to_app</i>
                                    <span>Sair</span>
                                </div>
                            </div>
                        </div>
                    }   
                </div>
            </div>
            <div>oi</div>
        </div>
    );
};

export default HomePage;