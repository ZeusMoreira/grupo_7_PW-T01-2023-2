
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import './style.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BotaoCategoria from './BotaoCategoria';
import BotaoTematico from '../../components/BotaoTematico';
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';

export const HomePage = () => {
    const navigate = useNavigate();
    const [balaoVisivel, setBalaoVisivel] = useState(false);
    const [userName, setUserName] = useState('');
    const [imagemCategoriaTopUm, setImagemCategoriaTopUm] = useState({
        label: "",
        link: "",
    });
    const [imagemCategoriaTopDois, setImagemCategoriaTopDois] = useState({
        label: "",
        link: "",
    });
    const [imagemCategoriaTopTres, setImagemCategoriaTopTres] = useState({
        label: "",
        link: "",
    });

    const handleInside = (event) => {
        event.stopPropagation();
        setBalaoVisivel(true);
    };

    const handleOutside = (event) => {
        setBalaoVisivel(false);
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
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserName(user.displayName || 'Usuário'); 
            } else {
                setUserName('Usuário'); 
            }
        });
        buscarCategorias();
        return () => {
            unsubscribe();
        };
    }, []);

    const buscarCategorias = async () => {
        const db = getFirestore();
        const categoriasCollection = collection(db, 'categorias');
        const querySnapshot = await getDocs(query(categoriasCollection, orderBy('numeroQuizzes', 'desc')));
        let topCategorias = []
        querySnapshot.forEach((doc) => {
            topCategorias.push(doc.data()) 
        })
        setImagemCategoriaTopUm({
            label: topCategorias[0].nome,
            link: topCategorias[0].link,
        })
        setImagemCategoriaTopDois({
            label: topCategorias[1].nome,
            link: topCategorias[1].link,
        })
        setImagemCategoriaTopTres({
            label: topCategorias[2].nome,
            link: topCategorias[2].link,
        })
    }

    const acessarRanking = async (event) => {
        navigate("/ranking")
    }

    const iconStyle = {
        fontSize: '35px', 
        padding: '0',
        margin: '0'
    };

    const botaoCategoriaTopUm = {
        backgroundColor: "#b619b9",
        color: "white",
        label: imagemCategoriaTopUm.label,
        width: window.innerWidth < 620 ? "80%" : "45%",
        borderRadius: "6px",
        link: imagemCategoriaTopUm.link,
    };

    const botaoCategoriaTopDois = {
        backgroundColor: "#b619b9",
        color: "white",
        label: imagemCategoriaTopDois.label,
        width: window.innerWidth < 620 ? "80%" : "45%",
        borderRadius: "6px",
        link: imagemCategoriaTopDois.link,
    };

    const botaoCategoriaTopTres = {
        backgroundColor: "#b619b9",
        color: "white",
        label: imagemCategoriaTopTres.label,
        width: window.innerWidth < 620 ? "80%" : "45%",
        borderRadius: "6px",
        link: imagemCategoriaTopTres.link,
    };

    const botaoJogarProps = {
        backgroundColor: "#f4b831",
        color: "white",
        label: "Jogar",
        width: "35%",
        height: "70px",
        borderRadius: "6px",
    };

    return (
        <div className="container">
            { balaoVisivel &&
                <div id="overlay" onMouseEnter={handleOutside}></div>
            }
            <div className="header">
                <div className="sizedbox"></div>
                <div className="logo-container">
                    <h1 className="logo">Quizz<span>ES</span></h1>
                </div>
                <div id="menu-options">
                    <span className="user-text" onMouseEnter={handleInside}>
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
            <div className="container-primary">
                <div className="ranking-container" onClick={acessarRanking}>
                    <span>Acesse o nosso ranking!</span>
                    <img className="ranking-img" src="https://firebasestorage.googleapis.com/v0/b/quizzes-f7aec.appspot.com/o/ranking.png?alt=media&token=ba723bff-5ee7-4834-92d5-35f6906e1013&_gl=1*zufyba*_ga*ODU3MDEwNTIxLjE2OTgzOTYzMjk.*_ga_CW55HF8NVT*MTY5OTMzMjQ2MS4xMS4xLjE2OTkzMzQ0OTAuNTAuMC4w" alt="imagem de página não encontrada."></img>   
                </div>
            </div>
            <div className="categorias-populares">
                <span>Categorias populares</span>
                <div className="botoes-categoria">
                    <BotaoCategoria {...botaoCategoriaTopUm}></BotaoCategoria>
                    <BotaoCategoria {...botaoCategoriaTopDois}></BotaoCategoria>
                    <BotaoCategoria {...botaoCategoriaTopTres}></BotaoCategoria>
                </div>
            </div>
            <div className="container-botao">
                <BotaoTematico className="botao-text" {...botaoJogarProps}></BotaoTematico>
            </div>
             
        </div>
    );
};

export default HomePage;