import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Combobox from '../../MinhaContaPage/GerenciarQuizzesPage/components/Content/components/Autocomplete.js';
import { useNavigate, useParams } from 'react-router-dom';
import './sidebar-jogar.css'
import { Tooltip } from 'react-tooltip';

const SidebarJogar = ({toggleSidebar, onQuizSelect}) => {
  const {parametro} = useParams()
  const navigate = useNavigate()
  const [listagemQuizzes, setListagemQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [quizSelecionado, setQuizSelecionado] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Selecione")
  const [dificuldadeSelecionada, setDificuldadeSelecionada] = useState("Selecione")
  
  const buscarQuizzesComFiltros = async (categoria, dificuldade) => {
    setLoading(true);
    try {
      const db = getFirestore();
      const quizzesCollection = collection(db, 'quizzes');
      let queryFilters = [];
      setListagemQuizzes([])

      if (categoria !== 'Selecione') {
        queryFilters.push(where('categoria', '==', categoria));
      }

      if (dificuldade !== 'Selecione') {
        queryFilters.push(where('dificuldade', '==', dificuldade));
      }

      const querySnapshot = await getDocs(query(quizzesCollection, ...queryFilters));
      let quizzes = [];
      querySnapshot.forEach((doc) => {
        quizzes.push(doc.data());
      });
      setListagemQuizzes(quizzes);
    } catch (error) {
      console.error('Erro ao buscar quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const param = parseInt(parametro, 10)
    if (param >= 1 && param <= 4) {
      buscarCategoriaSelecionada(Number(parametro))
    } else {
      navigate("/jogar")
    }
    // eslint-disable-next-line
  }, [])

  const buscarCategoriaSelecionada = async (topCategoria) => {
    setLoading(true)
    try {
      const db = getFirestore();
      const categoriasCollection = collection(db, 'categorias');
      const querySnapshot = await getDocs(query(categoriasCollection, orderBy('numeroQuizzes', 'desc')));
      setCategoriaSelecionada(querySnapshot.docs[topCategoria-1].data().nome)
    } catch(error){
      toast.error("Ocorre um erro ao buscar a categoria selecionada.")
    } finally {
      setLoading(false)
    }
  }

  const buscarCategorias = async () => {
    setLoading(true)
    try {
      const db = getFirestore();
      const categoriasCollection = collection(db, 'categorias');
      const querySnapshot = await getDocs(query(categoriasCollection));
      let categorias = ['Selecione']
      querySnapshot.forEach((doc) => {
        categorias.push(doc.data().nome)
      });
      setCategorias(categorias)
    } catch (error) {
      toast.error('Erro ao buscar categorias:')
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if(window.innerWidth > 768){
      checarAltura()
    }
    // eslint-disable-next-line
  }, [quizSelecionado])

  const checarAltura = () => {    
    if(quizSelecionado === null){
      const alturaDesejada = `calc(100vh - 350px)`;
      const divListagemQuizzes = document.querySelector('.listagem-quizzes-jogar');
      if (divListagemQuizzes) {
          divListagemQuizzes.style.height = alturaDesejada;
      }
    } else {
      var alturaTotal = Math.max(
        document.body.scrollHeight, 
        document.body.offsetHeight, 
        document.documentElement.clientHeight, 
        document.documentElement.scrollHeight, 
        document.documentElement.offsetHeight
      );
      const divListagemQuizzes = document.querySelector('.listagem-quizzes-jogar');
      if (divListagemQuizzes) {
          divListagemQuizzes.style.height = `${alturaTotal - 350}px`;
      }
    }
  }

  useEffect(() => {
    buscarCategorias();
    buscarQuizzesComFiltros(categoriaSelecionada, dificuldadeSelecionada);
  }, [categoriaSelecionada, dificuldadeSelecionada]);

  const handleQuizClick = (quizId) => {
    setQuizSelecionado(quizId);
    onQuizSelect(quizId);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setQuizSelecionado(null)
    onQuizSelect(null)
    if(name === "categoria"){
      setCategoriaSelecionada(value)
    }
    if(name === "dificuldade"){
      setDificuldadeSelecionada(value)
    }
  }

  const handleCategoriaChange = (value) => {
      handleChange({ target: { name: "categoria", value } });
  };

  const handleDificuldadeChange = (value) => {
      handleChange({ target: { name: "dificuldade", value } });
  };
  
  return (
    <div className="sidebar-jogar">
        <div className="abrir-criar-jogar">
          {
                (quizSelecionado === null) && 
                <div className="menu-icone-fechar">
                   <a data-tooltip-id="tooltip-quiz-criacao" data-tooltip-content="O fechamento do menu só está disponível com algum quiz selecionado." data-tooltip-place="right" href="#tooltip-quiz-criacao" className="a-tooltip">
                        <i className="material-icons close-icon">
                          menu
                        </i>
                    </a>
                    <Tooltip id="tooltip-quiz-criacao" /> 
                </div>  
            }
            {
                (quizSelecionado !== null) &&
                <div className="menu-icone-fechar">
                    <i className="material-icons close-icon" onClick={toggleSidebar}>
                        menu
                    </i>
                </div> 
            }
             
            <div className="filtro-quizzes">
                <span className="filtro-text">Filtrar por:</span>
                <div>
                    <span className="filtro-text">Categoria</span>
                    <Combobox
                        placeholder="Selecione"
                        options={categorias} 
                        preselectedValue={categoriaSelecionada !== "Selecione" ? categoriaSelecionada : null}
                        classNameSelect="categoria-combobox-jogar"
                        classNameDiv="categoria-combobox-div-jogar"
                        onChange={handleCategoriaChange}
                    /> 
                </div>
                <div>
                    <span className="filtro-text">Dificuldade</span>
                    <Combobox
                        placeholder="Selecione"
                        options={['Selecione','Fácil', 'Médio', 'Difícil']} 
                        classNameSelect="dificuldade-combobox-jogar"
                        classNameDiv="dificuldade-combobox-div-jogar"
                        onChange={handleDificuldadeChange}
                    />
                </div>
                
            </div>  
        </div>
        <div className="listagem-quizzes-jogar">
          {loading ? (
            <div className="local-spinner">
              <span className="spinner"></span>
            </div>
          ) : (
            listagemQuizzes.length > 0 ? (
              <ul className="lista-quiz-jogar">
                {listagemQuizzes.map((quiz, index) => (
                  <li 
                    key={quiz.id} 
                    onClick={() => handleQuizClick(quiz.id)}
                    className={quizSelecionado === quiz.id ? 'quiz-selecionado-jogar' : ''}
                  >
                    <div className="titulo-categoria-quiz-jogar">
                      <span className="titulo-text-quiz-jogar">{quiz.tituloQuiz}</span> 
                      <span className="categoria-text-quiz-jogar">{quiz.categoria}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="texto-sem-elemento">
                <span>Nenhum quiz disponível com essa configuração</span>
              </div>
            )
          )}
        </div>
        
    </div>
  );
};

export default SidebarJogar;