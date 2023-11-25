import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormularioCriacaoQuiz from './components/FormularioCriacaoQuiz/index.js';
import FormularioPerguntaCriacaoQuiz from './components/FormularioPerguntaCriacaoQuiz/index.js';
import FormularioEdicaoQuiz from './components/FormularioEdicaoQuiz/index.js';
import './style.css'
import FormularioPerguntaEdicaoQuiz from './components/FormularioPerguntaEdicaoQuiz/index.js';

const Content = ({ toggleSidebar, isSidebarOpen, ehModoCriacao, ehModoEdicao, quizIdSelecionado}) => {
  const navigate = useNavigate();
  const [tituloQuiz, setTituloQuiz] = useState("");
  const [numeroPerguntasQuiz, setNumeroPerguntasQuiz] = useState(1)
  const [dificuldadeSelecionada, setDificuldadeSelecionada] = useState("Fácil")
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("")
  const [categorias, setCategorias] = useState([])
  const [etapaAtual, setEtapaAtual] = useState(1)
  const [perguntaConteudo, setPerguntaConteudo] = useState("")
  const [respostaA, setRespostaA] = useState("")
  const [respostaB, setRespostaB] = useState("")
  const [respostaC, setRespostaC] = useState("")
  const [respostaD, setRespostaD] = useState("")
  const [respostas, setRespostas] = useState(['A', 'B', 'C', 'D'])
  const [respostaCorreta, setRespostaCorreta] = useState("A")
  const [perguntas, setPerguntas] = useState([])
  const [loading, setLoading] = useState(true)
  const [tituloQuizEdicao, setTituloQuizEdicao] = useState("");
  const [categoriaEdicao, setCategoriaEdicao] = useState("");
  const [dificuldadeEdicao, setDificuldadeEdicao] = useState("");
  const [numeroPerguntasQuizEdicao, setNumeroPerguntasQuizEdicao] = useState(1)
  const [perguntasEdicao, setPerguntasEdicao] = useState([])
  const [indicePerguntaAtual, setIndicePerguntaAtual] = useState(0)
  
  const handlePerguntasEdicaoQuiz = (perguntasEdicao) => {
    setPerguntasEdicao(perguntasEdicao)
  }

  const handleSubmitCapaQuizEdicao = () => {
    editarPerguntaCapa()
  }

  const handleTituloQuizEdicao = (tituloQuizEdicao) => {
    setTituloQuizEdicao(tituloQuizEdicao);
  };

  const handleTituloQuiz = (tituloQuiz) => {
    setTituloQuiz(tituloQuiz);
  };

  const handleNumeroPerguntasQuiz = (numeroPerguntas) => {
    setNumeroPerguntasQuiz(numeroPerguntas);
  };

  const handleCategoriaQuiz = (categoria) => {
    setCategoriaSelecionada(categoria);
  };

  const handleDificuldadeQuiz = (dificuldade) => {
    setDificuldadeSelecionada(dificuldade);
  };

  const handleSubmitCapaQuiz = (etapa) => {
    setEtapaAtual(etapa)
  }

  const handlePerguntaConteudoQuiz = (perguntaConteudo) => {
    setPerguntaConteudo(perguntaConteudo)
  }

  const handleRespostaAQuiz = (respostaA) => {
    setRespostaA(respostaA)
  }

  const handleRespostaBQuiz = (respostaB) => {
    setRespostaB(respostaB)
  }

  const handleRespostaCQuiz = (respostaC) => {
    setRespostaC(respostaC)
  }

  const handleRespostaDQuiz = (respostaD) => {
    setRespostaD(respostaD)
  }

  const handleRespostaCorretaQuiz = (respostaCorreta) => {
    setRespostaCorreta(respostaCorreta)
  }

  const handleSubmitPerguntaQuizEdicao = () => {
    preparacaoSubmitPerguntaEdicao()    
  }
  
  const handleSubmitPerguntaQuiz = () => {
    preparacaoSubmitPergunta()    
  }

  const preparacaoSubmitPerguntaEdicao = async () => {
    setLoading(true)
    try {
      const db = getFirestore();
      const quizDocRef = doc(db, 'quizzes', quizIdSelecionado);
      const quizDoc = await getDoc(quizDocRef);
      if (quizDoc.exists()) {
        const novasPerguntas = [...quizDoc.data().perguntas];
        novasPerguntas[indicePerguntaAtual] = perguntasEdicao[indicePerguntaAtual];
        await updateDoc(quizDocRef, { perguntas: novasPerguntas });
        if(indicePerguntaAtual+1 < numeroPerguntasQuizEdicao){
          setIndicePerguntaAtual(indicePerguntaAtual+1)
        } else {
          navigate('/minha-conta')
        }
        toast.success("Pergunta atualizada com sucesso!");
      } else {
        toast.error("O documento do quiz não foi encontrado!");
      }
    } catch(error) {
      toast.error("Ocorreu um erro ao atualizar a pergunta!");
    }
    setLoading(false)
  }

  const preparacaoSubmitPergunta = () => {
    const pergunta = {
      indice: perguntas.length + 1,
      pergunta: perguntaConteudo,
      respostaA: respostaA,
      respostaB: respostaB,
      respostaC: respostaC,
      respostaD: respostaD,
      respostaCorreta: respostaCorreta,
    }
    setPerguntas(prevPerguntas => [...prevPerguntas, pergunta]);
  }

  useEffect(() => {
    if (perguntas.length === numeroPerguntasQuiz) {
      registrarPergunta();
    } else {
      limparCamposPergunta()
    }
  }, [perguntas]);

  const registrarPergunta = async () => {
    const quiz = {
      tituloQuiz: tituloQuiz,
      numeroPerguntas: numeroPerguntasQuiz,
      categoria: categoriaSelecionada,
      dificuldade: dificuldadeSelecionada,
      perguntas: perguntas,
      id: null,
    }

    setLoading(true)
    const db = getFirestore();
    try {    
      const quizzesCollection = collection(db, 'quizzes');
      const docRef = await addDoc(quizzesCollection, quiz);
      quiz.id = docRef.id
      const quizDocRef = doc(db, 'quizzes', docRef.id);
      await updateDoc(quizDocRef, { id: docRef.id });
    } catch (error) {
      toast.error('Erro ao adicionar documento')
    }

    try {
      const categoriasCollection = collection(db, 'categorias');
      const querySnapshot = await getDocs(query(categoriasCollection, where('nome', '==', quiz.categoria)));
      querySnapshot.forEach(async (doc) => {
        const categoriaRef = doc.ref;
        const atualNumeroQuizzes = doc.data().numeroQuizzes || 0;
        await updateDoc(categoriaRef, { numeroQuizzes: atualNumeroQuizzes + 1 });
      });
      limparCamposPergunta()
      limparCamposCapa()
      navigate("/minha-conta")
      toast.success("O quiz foi registrado com sucesso!")
    } catch (error) {
      toast.error('Erro ao adicionar documento')
    }
    setLoading(false)
  }

  const buscarCategorias = async () => {
    try {
      const db = getFirestore();
      const categoriasCollection = collection(db, 'categorias');
      const querySnapshot = await getDocs(query(categoriasCollection));
      let categorias = []
      querySnapshot.forEach((doc) => {
        categorias.push(doc.data().nome)
      });
      setCategorias(categorias)
      setCategoriaSelecionada(categorias[0])
      setEtapaAtual(1)   
    } catch (error) {
      toast.error('Erro ao buscar categorias:')
    } finally {
      setLoading(false); 
    }
  };

  const buscarDadosQuiz = async () => {
    setLoading(true)
    try {
      const db = getFirestore();
      const quizzesCollection = collection(db, 'quizzes');
      const querySnapshot = await getDocs(query(quizzesCollection, where('id', '==', quizIdSelecionado)));
      querySnapshot.forEach((doc) => {
        setNumeroPerguntasQuizEdicao(doc.data().numeroPerguntas)
        setTituloQuizEdicao(doc.data().tituloQuiz)
        setCategoriaEdicao(doc.data().categoria)
        setDificuldadeEdicao(doc.data().dificuldade)
        setPerguntasEdicao(doc.data().perguntas)
      });
    } catch(error) {
      toast.error('Ocorreu um erro ao buscar o quiz!')
    }
    setLoading(false)
  }
  
  useEffect(() => { 
    buscarCategorias();
  }, []);

  useEffect(() => {
    limparCamposPergunta()
    limparCamposCapa()
    setIndicePerguntaAtual(0)
    setEtapaAtual(1)
    if(quizIdSelecionado){
      buscarDadosQuiz()
    }
  }, [quizIdSelecionado])

  useEffect(() => {
    limparCamposPergunta()
    limparCamposCapa()
    setIndicePerguntaAtual(0)
    setEtapaAtual(1)
  }, [ehModoCriacao, ehModoEdicao])
  
  const editarPerguntaCapa = async () => {
    const dadosCapaQuizEdicao = {
      tituloQuiz: tituloQuizEdicao,
      dificuldade: dificuldadeEdicao,
      id: quizIdSelecionado,
      numeroPerguntas: numeroPerguntasQuizEdicao,
      categoria: categoriaEdicao,
      perguntas: perguntasEdicao,
    }

    setLoading(true)
    try {  
      const db = getFirestore();
      const quizDocRef = doc(db, 'quizzes', quizIdSelecionado);
      await updateDoc(quizDocRef, dadosCapaQuizEdicao);
      toast.success("O quiz foi atualizado com sucesso!");
      setEtapaAtual(2)
    } catch (error) {
      toast.error('Erro ao atualizar o quiz!');
    }
    setLoading(false)
  }

  const limparCamposPergunta = () => {
    setPerguntaConteudo("")
    setRespostaA("")
    setRespostaB("")
    setRespostaC("")
    setRespostaD("")
    setRespostaCorreta('A')
    setRespostas(['A','B','C','D'])
    setPerguntasEdicao([])
  }


  const limparCamposCapa = () => {
    setTituloQuiz("")
    setCategoriaSelecionada(categorias[0])
    setDificuldadeSelecionada("Fácil")
    setNumeroPerguntasQuiz(1)
    setPerguntas([])
    setTituloQuizEdicao("")
    setCategoriaEdicao("")
    setDificuldadeEdicao("")
    setNumeroPerguntasQuizEdicao(1)  
  }  

  return (
    <div className="content">
      {
        (!ehModoCriacao && !ehModoEdicao) &&
        <p className="intro-edicao-criacao">
          Aperte em Criar Quiz<br/>
          ou<br/>
          Selecione um Quiz para editar
        </p>
      }
      { ehModoCriacao && 
        <div className={`conteudo-principal ${!isSidebarOpen ? 'open-bar' : ''}`}>
          {
            ehModoCriacao && 
            <div className="criacao-quiz-wrapper">
              {
                etapaAtual === 1 && 
                <div className="etapa-um-wrapper">
                  <h2>Criar</h2>
                  {
                    loading ? 
                    <div className="local-spinner"><span className="spinner"></span></div> : 
                    <FormularioCriacaoQuiz
                      categorias={categorias}
                      tituloQuiz={tituloQuiz}
                      onTituloQuizSet={handleTituloQuiz}
                      numeroPerguntasQuiz={numeroPerguntasQuiz}
                      onNumeroPerguntasQuizSet={handleNumeroPerguntasQuiz}
                      onCategoriaQuizSet={handleCategoriaQuiz}
                      onDificuldadeQuizSet={handleDificuldadeQuiz}
                      onSubmitCapaQuiz={handleSubmitCapaQuiz}
                    />
                  }
                  </div>
                }  
                {
                  etapaAtual > 1 &&
                  <div className="pergunta">
                    {
                      perguntas.length + 1 <= numeroPerguntasQuiz ?
                      <h2>Pergunta {perguntas.length + 1}</h2> : null
                    }
                    {
                      loading ? 
                      <div className="local-spinner"><span className="spinner"></span></div> :
                      <FormularioPerguntaCriacaoQuiz
                        respostas={respostas}
                        perguntaConteudo={perguntaConteudo}
                        respostaA={respostaA}
                        onRespostaAQuizSet={handleRespostaAQuiz}
                        respostaB={respostaB}
                        onRespostaBQuizSet={handleRespostaBQuiz}
                        respostaC={respostaC}
                        onRespostaCQuizSet={handleRespostaCQuiz}
                        respostaD={respostaD}
                        onRespostaDQuizSet={handleRespostaDQuiz}
                        respostaCorreta={respostaCorreta}
                        onPerguntaConteudoQuizSet={handlePerguntaConteudoQuiz}
                        onRespostaCorretaQuizSet={handleRespostaCorretaQuiz}
                        onSubmitPerguntaQuiz={handleSubmitPerguntaQuiz}
                      />
                    }
                  </div>      
                }
            </div>
          }
        </div> 
      }
      {
        ehModoEdicao && 
        <div className={`conteudo-principal ${!isSidebarOpen ? 'open-bar' : ''}`}> 
          <div className="criacao-quiz-wrapper">
            {
              etapaAtual === 1 && 
              <div className="etapa-um-wrapper">
                <h2>Editar</h2>
                {
                  loading ? 
                  <div className="local-spinner"><span className="spinner"></span></div> : 
                  <FormularioEdicaoQuiz
                    tituloQuizEdicao={tituloQuizEdicao}
                    numeroPerguntasQuizEdicao={numeroPerguntasQuizEdicao}
                    categoriaEdicao={categoriaEdicao}
                    dificuldadeEdicao={dificuldadeEdicao}
                    onTituloQuizEdicaoSet={handleTituloQuizEdicao}
                    onSubmitCapaQuizEdicao={handleSubmitCapaQuizEdicao}
                  />
                }
                </div>
              }  
              {
                etapaAtual > 1 &&
                <div className="pergunta">
                  <h2>Pergunta {indicePerguntaAtual + 1}</h2>
                  {
                    loading ? 
                    <div className="local-spinner"><span className="spinner"></span></div> :
                    <FormularioPerguntaEdicaoQuiz
                      respostas={respostas}
                      perguntasEdicao={perguntasEdicao}
                      indicePerguntaAtual={indicePerguntaAtual}
                      onPerguntasEdicaoSet={handlePerguntasEdicaoQuiz}
                      onSubmitPerguntaQuizEdicao={handleSubmitPerguntaQuizEdicao}
                    />
                 }
                </div>      
              }
          </div>
        </div> 
      }
    </div>
  );
};

export default Content;
