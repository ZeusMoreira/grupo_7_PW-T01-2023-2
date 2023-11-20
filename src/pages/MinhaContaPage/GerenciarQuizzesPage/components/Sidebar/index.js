import { collection, deleteDoc, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import BotaoCriarQuiz from './components/BotaoCriarQuiz';
import './style.css'

const Sidebar = ({toggleSidebar, ehModoCriacao, setEhModoCriacao, setEhModoEdicao, ehModoEdicao, onQuizSelect, onCriarSelect}) => {
  const navigate = useNavigate()
  const [listagemQuizzes, setListagemQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [quizSelecionado, setQuizSelecionado] = useState(null)
  const [mostrarModalExcluirQuiz, setMostrarModalExcluirQuiz] = useState(false)

  const handleCriarQuizClick = () => {
    setEhModoCriacao(true)
    setEhModoEdicao(false)
    onCriarSelect();
    setQuizSelecionado(null)
  }

  const fecharModalExcluirQuiz = () => {
    setMostrarModalExcluirQuiz(false)
  }

  const buscarQuizzes = async () => {
    try {
      const db = getFirestore();
      const quizzesCollection = collection(db, 'quizzes');
      const querySnapshot = await getDocs(query(quizzesCollection));
      let quizzes = []
      querySnapshot.forEach((doc) => {
        quizzes.push(doc.data())
      });
      setListagemQuizzes(quizzes)
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if(window.innerWidth > 768){
      checarAltura()
    }
  }, [ehModoCriacao, setEhModoCriacao, ehModoEdicao, setEhModoEdicao])

  const checarAltura = () => {
    if(!ehModoCriacao && !ehModoEdicao){
      const alturaDesejada = `calc(100vh - 300px)`;
      const divListagemQuizzes = document.querySelector('.listagem-quizzes');
      if (divListagemQuizzes) {
          divListagemQuizzes.style.height = alturaDesejada;
      }
    }
    else {
      var alturaTotal = Math.max(
        document.body.scrollHeight, 
        document.body.offsetHeight, 
        document.documentElement.clientHeight, 
        document.documentElement.scrollHeight, 
        document.documentElement.offsetHeight
      );

      const divListagemQuizzes = document.querySelector('.listagem-quizzes');
      if (divListagemQuizzes) {
          divListagemQuizzes.style.height = `${alturaTotal - 300}px`;
      }
    }
  }

  useEffect(() => {    
    buscarQuizzes();
  }, []);

  const botaoCriarQuizProps = {
    backgroundColor: ehModoCriacao ? 'white' : 'transparent',
    color: ehModoCriacao ? '#393434' : 'white',
  }

  const handleDeleteClick = (quizId) => {
    setMostrarModalExcluirQuiz(true)
  };

  const handleQuizClick = (quizId) => {
    setQuizSelecionado(quizId);
    setEhModoCriacao(false)
    setEhModoEdicao(true)
    onQuizSelect(quizId);
  };

  const excluirQuiz = async () => {
    setLoading(true)
    const db = getFirestore();
    const quizAtual = listagemQuizzes.find(quiz => quiz.id === quizSelecionado)
    const categoriasCollection = collection(db, 'categorias');
    const querySnapshot = await getDocs(query(categoriasCollection, where('nome', '==', quizAtual.categoria)));
    querySnapshot.forEach(async (doc) => {
      const categoriaRef = doc.ref;
      const atualNumeroQuizzes = doc.data().numeroQuizzes ;
      await updateDoc(categoriaRef, { numeroQuizzes: atualNumeroQuizzes - 1 });
    });

    const docRef = doc(db, "quizzes", quizSelecionado);
    await deleteDoc(docRef);

    const novoArrayQuizzes = listagemQuizzes.filter(quiz => quiz.id !== quizSelecionado);
    setListagemQuizzes(novoArrayQuizzes)
    setQuizSelecionado(null)
    setMostrarModalExcluirQuiz(false)
    setLoading(false)
    navigate('/minha-conta')
    toast.success("O Quiz foi excluído com sucesso!")
  }

  return (
    <div className="sidebar">
        <div className="abrir-criar">
            {
                (!ehModoCriacao && !ehModoEdicao) && 
                <div className="menu-icone-fechar">
                   <a data-tooltip-id="tooltip-quiz-criacao" data-tooltip-content="O fechamento do menu só está disponível com a criação ou edição de quiz habilitada." data-tooltip-place="right" href="#tooltip-quiz-criacao" className="a-tooltip">
                        <i className="material-icons close-icon" onClick={toggleSidebar}>
                          menu
                        </i>
                    </a>
                    <Tooltip id="tooltip-quiz-criacao" /> 
                </div>  
            }
            {
                (ehModoCriacao || ehModoEdicao) && 
                <i className="material-icons close-icon" onClick={toggleSidebar}>
                    menu
                </i>
            }
            <BotaoCriarQuiz onClick={handleCriarQuizClick} {...botaoCriarQuizProps}/>  
        </div>
        <div className="listagem-quizzes">
          {loading ? (
            <div className="local-spinner">
              <span className="spinner"></span>
            </div>
          ) : (
            <ul className="lista-quiz">
              {listagemQuizzes.map((quiz, index) => (
                <li 
                key={quiz.id} onClick={() => handleQuizClick(quiz.id)}
                className={quizSelecionado === quiz.id ? 'quiz-selecionado' : ''}
                >
                  <div className="titulo-categoria-quiz">
                    <span className="titulo-text-quiz">{quiz.tituloQuiz}</span> 
                    <span className="categoria-text-quiz">{quiz.categoria}</span>
                  </div>
                  {quizSelecionado === quiz.id && (
                    <div className="wrapper-icon">
                      <i
                        className="material-icons delete-icon"
                        onClick={() => handleDeleteClick()}
                      >
                        delete
                      </i>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        {mostrarModalExcluirQuiz && <div className="overlay-registro" onClick={fecharModalExcluirQuiz}></div>}
          {mostrarModalExcluirQuiz && (
            <div className="modal-excluir">
              <i className="material-icons warning-icon">
                warning
              </i>
              <span className="titulo-modal-exclusao">Deseja realmente excluir este quiz?</span>
              <p className="texto-modal-exclusao">
                O quiz não poderá ser recuperado.<br/>
                Deseja realmente confirmar essa ação?
              </p>
              {
                loading ? (
                  <div className="local-spinner">
                    <span className="spinner"></span>
                  </div>
                ) : 
                <div className="botoes-acao-modal-excluir">
                  <button className="botao-nao-excluir-quiz" onClick={fecharModalExcluirQuiz}>
                    Não
                  </button>
                  <button className="botao-sim-excluir-quiz" onClick={excluirQuiz}>
                    Sim
                  </button>
                </div>
              }
            </div>
          )}
    </div>
  );
};

export default Sidebar;