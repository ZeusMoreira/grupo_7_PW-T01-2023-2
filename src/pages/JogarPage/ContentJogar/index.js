import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BotaoTematico from '../../../components/BotaoTematico';
import './content-jogar.css'

const ContentJogar = ({ toggleSidebar, isSidebarOpen, quizIdSelecionado}) => {
  const navigate = useNavigate();
  const [etapaAtual, setEtapaAtual] = useState(1)
  const [loading, setLoading] = useState(true)
  const [numeroPerguntasQuizJogar, setNumeroPerguntasQuizJogar] = useState(1)
  const [categoriaJogar, setCategoriaJogar] = useState("")
  const [perguntasJogar, setPerguntasJogar] = useState([])
  const [indicePerguntaAtual, setIndicePerguntaAtual] = useState(0)
  const [numeroAcertosAtual, setNumeroAcertosAtual] = useState(0)
  const [pontuacaoPerguntas, setPontuacaoPerguntas] = useState(0)
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [feedbackResposta, setFeedbackResposta] = useState(null);
  const [usuarioAtual, setUsuarioAtual] = useState({})
  const [abrirVerMais, setAbrirVerMais] = useState(false)
  const [respostaVerMais, setRespostaVerMais] = useState("")

  const buscarDadosQuiz = async () => {
    const auth = getAuth()
    setLoading(true)
    onAuthStateChanged(auth, async (user) => {
      if (user) {
          const usersCollection = collection(getFirestore(), 'users');
          const querySnapshot = await getDocs(query(usersCollection, where('uid', '==', user.uid)));
          if (querySnapshot.docs.length > 0) {
            setUsuarioAtual(querySnapshot.docs[0].data());
          }
      } 
    });
    try {
      const db = getFirestore();
      const quizzesCollection = collection(db, 'quizzes');
      const querySnapshot = await getDocs(query(quizzesCollection, where('id', '==', quizIdSelecionado)));
      querySnapshot.forEach((doc) => {
        setNumeroPerguntasQuizJogar(doc.data().numeroPerguntas)
        setCategoriaJogar(doc.data().categoria)
        setPerguntasJogar(doc.data().perguntas)
        const dificuldadeValores = {
          'Difícil': 10,
          'Médio': 7,
          'Fácil': 3,
        };
        const valorDificuldade = dificuldadeValores[doc.data().dificuldade] || 0
        setPontuacaoPerguntas(valorDificuldade)
      });
    } catch(error) {
      toast.error('Ocorreu um erro ao buscar o quiz!')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async () => {
    const db = getFirestore();
    setLoading(true)
    
    const pontuacaoAdicional = numeroAcertosAtual * pontuacaoPerguntas;
    const userDocRef = doc(db, 'users', usuarioAtual.uid); 
    try {
      await updateDoc(userDocRef, {
        score: usuarioAtual.score + pontuacaoAdicional,
        categoriaFavorita: categoriaJogar,
      });
    } catch (error) {
      console.error('Erro ao atualizar o usuário no Firestore:', error);
    }
    setLoading(false)
  };

  const handleSelecionarResposta = (resposta) => {
    setRespostaSelecionada(resposta);

    const respostasDaPergunta = [
      perguntasJogar[indicePerguntaAtual].respostaA,
      perguntasJogar[indicePerguntaAtual].respostaB,
      perguntasJogar[indicePerguntaAtual].respostaC,
      perguntasJogar[indicePerguntaAtual].respostaD,
    ];

    const indiceRespostaSelecionada = respostasDaPergunta.indexOf(resposta);
    const indiceRespostaCorreta = ['A', 'B', 'C', 'D'].indexOf(perguntasJogar[indicePerguntaAtual].respostaCorreta);
    const respostaCorretaEstaSelecionada = indiceRespostaSelecionada === indiceRespostaCorreta;

    setFeedbackResposta(respostaCorretaEstaSelecionada ? 'correta' : 'incorreta');

    if (respostaCorretaEstaSelecionada) {
      setNumeroAcertosAtual(numeroAcertosAtual + 1);
    }

    setTimeout(() => {
      setIndicePerguntaAtual(indicePerguntaAtual + 1);
      setFeedbackResposta(null);
      setRespostaSelecionada(null);
    }, 1000);
  };

  useEffect(() => {
    if(indicePerguntaAtual === numeroPerguntasQuizJogar && perguntasJogar.length > 0){
      handleUpdateUser();
      setEtapaAtual(2)
    }
    // eslint-disable-next-line
  }, [indicePerguntaAtual])

  
  useEffect(() => { 
    setIndicePerguntaAtual(0)
    setNumeroAcertosAtual(0)
    setEtapaAtual(1)
    buscarDadosQuiz();
    // eslint-disable-next-line
  }, [quizIdSelecionado]);

  const getClassFeedbackResposta = (resposta, indiceResposta) => {
    const respostaCorreta = perguntasJogar[indicePerguntaAtual].respostaCorreta;
    
    if (feedbackResposta === 'correta' && indiceResposta === respostaCorreta) {
      return 'resposta-correta-jogar';
    } else if (feedbackResposta === 'incorreta' && resposta === respostaSelecionada) {
      return 'resposta-incorreta-jogar';
    } else {
      return '';
    }
  };

  const handleRetornarClick = () => {
    navigate("/home")
  }

  const contentStyles = {
    alignItems: (quizIdSelecionado !== null) ? 'stretch' : 'center',
    justifyContent: (quizIdSelecionado !== null) ? 'stretch' : 'center',
  };

  const botaoRetornarProps = {
    backgroundColor: "#f4b831",
    color: "white",
    label: "Retornar",
    width: "55%",
    height: "60px",
    borderRadius: "6px",
  };

  const expandirTexto = (resposta) => {
    setRespostaVerMais(resposta)
    setAbrirVerMais(true)
  }

  const fecharVerMais = () => {
    setRespostaVerMais("")
    setAbrirVerMais(false)
  }

  return (
    <div className="content-jogar" style={contentStyles}>
        {abrirVerMais && <div className="overlay-login" onClick={fecharVerMais}></div>}
        {abrirVerMais && (
          <div className="modal-login">
            <p>{respostaVerMais}</p>
            <button className="botao-erro" onClick={fecharVerMais}>
              Fechar
            </button>
          </div>
        )}
        {!isSidebarOpen && 
            <i className="material-icons open-icon" onClick={toggleSidebar}>
              menu
            </i>
        }
        {
            (quizIdSelecionado === null) &&
            <p className="intro-jogar">
                Selecione um Quiz para<br/>
                responder
            </p>
        }
        {
            (quizIdSelecionado !== null) && 
            <div className={`conteudo-principal-jogar ${!isSidebarOpen ? 'open-bar' : ''}`}>
              <div className="jogar-quiz-wrapper">
                {
                (etapaAtual === 1 && indicePerguntaAtual < numeroPerguntasQuizJogar) && 
                <div className="etapa-um-wrapper-jogar">
                    <h2>Pergunta {indicePerguntaAtual+1}/{numeroPerguntasQuizJogar}</h2>
                    {
                      loading ? 
                      <div className="local-spinner"><span className="spinner"></span></div> : 
                      <div className="pergunta-wrapper-jogar">
                        {
                          perguntasJogar.length > 0 &&
                          
                            <textarea
                              type="text"
                              className="textarea-estilizado-jogar"
                              value={perguntasJogar[indicePerguntaAtual].pergunta}
                              disabled
                            />
                          
                        } 
                        {
                          perguntasJogar.length > 0 && 
                          <div className="respostas-jogar">
                            <div className="wrapper-a-b-jogar">
                                <div className="resposta-a-jogar">
                                  <span className="resposta-a-jogar-text">A:</span>
                                  <div className="input-resposta-validation">
                                      <input
                                        type="text"
                                        value={perguntasJogar[indicePerguntaAtual].respostaA}
                                        className={`input-resposta-a-jogar ${getClassFeedbackResposta(perguntasJogar[indicePerguntaAtual].respostaA, 'A')}`}
                                        onClick={() => handleSelecionarResposta(perguntasJogar[indicePerguntaAtual].respostaA)}
                                        readOnly
                                        disabled={respostaSelecionada !== null}
                                      />
                                  </div>
                                  {
                                    perguntasJogar[indicePerguntaAtual].respostaA.length > 34 ? <span className="ver-mais" onClick={() => expandirTexto(perguntasJogar[indicePerguntaAtual].respostaA)}>Ver mais</span> : null
                                  }
                                </div>
                                <div className="resposta-b-jogar">
                                  <span className="resposta-b-jogar-text">B:</span>
                                  <div className="input-resposta-validation">
                                      <input
                                      type="text"
                                      value={perguntasJogar[indicePerguntaAtual].respostaB}
                                      className={`input-resposta-b-jogar ${getClassFeedbackResposta(perguntasJogar[indicePerguntaAtual].respostaB, 'B')}`} 
                                      onClick={() => handleSelecionarResposta(perguntasJogar[indicePerguntaAtual].respostaB)}
                                      readOnly
                                      disabled={respostaSelecionada !== null}
                                      />
                                  </div>
                                  {
                                    perguntasJogar[indicePerguntaAtual].respostaB.length > 34 ? <span className="ver-mais" onClick={() => expandirTexto(perguntasJogar[indicePerguntaAtual].respostaB)}>Ver mais</span> : null
                                  }
                                </div>
                            </div>
                            <div className="wrapper-c-d">
                              <div className="resposta-c-jogar">
                                  <span className="resposta-c-jogar-text">C:</span>
                                  <div className="input-resposta-validation">
                                  <input
                                      type="text"
                                      value={perguntasJogar[indicePerguntaAtual].respostaC}
                                      className={`input-resposta-c-jogar ${getClassFeedbackResposta(perguntasJogar[indicePerguntaAtual].respostaC, 'C')}`}
                                      onClick={() => handleSelecionarResposta(perguntasJogar[indicePerguntaAtual].respostaC)}
                                      readOnly
                                      disabled={respostaSelecionada !== null}
                                  />
                                  </div>
                                  {
                                    perguntasJogar[indicePerguntaAtual].respostaC.length > 34 ? <span className="ver-mais" onClick={() => expandirTexto(perguntasJogar[indicePerguntaAtual].respostaC)}>Ver mais</span> : null
                                  }
                              </div>
                              <div className="resposta-d-jogar">
                                  <span className="resposta-d-jogar-text">D:</span>
                                  <div className="input-resposta-validation">
                                  <input
                                    type="text"
                                    value={perguntasJogar[indicePerguntaAtual].respostaD}
                                    className={`input-resposta-d-jogar ${getClassFeedbackResposta(perguntasJogar[indicePerguntaAtual].respostaD, 'D')}`}
                                    onClick={() => handleSelecionarResposta(perguntasJogar[indicePerguntaAtual].respostaD)}
                                    readOnly
                                    disabled={respostaSelecionada !== null}
                                  />
                                  </div>
                                  {
                                    perguntasJogar[indicePerguntaAtual].respostaD.length > 34 ? <span className="ver-mais" onClick={() => expandirTexto(perguntasJogar[indicePerguntaAtual].respostaD)}>Ver mais</span> : null
                                  }    
                              </div>
                            </div>
                          </div>    
                        }  
                      </div>
                    }
                    </div>
                }  
                {
                  etapaAtual > 1 &&
                  <div className="resultado">
                    <span className="text-resultado">Você acertou {numeroAcertosAtual} questões!</span>
                    <div className="icon-result">
                      <i className="material-icons task-alt-icon" onClick={toggleSidebar}>
                        task_alt
                      </i>
                      <span className="valor-resultado">{numeroAcertosAtual} / {numeroPerguntasQuizJogar}</span>
                    </div>
                    <span className="text-resultado">Uma pontuação {numeroAcertosAtual*pontuacaoPerguntas} foi adicionada ao<br/> seu score!</span>
                    <BotaoTematico className="botao-retornar" onClick={handleRetornarClick} {...botaoRetornarProps}/>
                  </div>      
                }
            </div>
        </div> 
        }
    </div>
  );
};

export default ContentJogar;
