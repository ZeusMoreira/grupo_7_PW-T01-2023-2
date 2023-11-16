import { collection, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import BotaoTematico from '../../../../../components/BotaoTematico/index.js';
import Combobox from './components/Autocomplete.js/index.js';
import './style.css'

const Content = ({ toggleSidebar, isSidebarOpen, ehModoCriacao }) => {
  const [tituloQuiz, setTituloQuiz] = useState("");
  const [numeroPerguntasQuiz, setNumeroPerguntasQuiz] = useState(1)
  const [dificuldadeSelecionada, setDificuldadeSelecionada] = useState("Fácil")
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("")
  const [tituloQuizFormatoValido,setTituloQuizFormatoValido] = useState(true)
  const [tituloQuizValido, setTituloQuizValido] = useState(true)
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)

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
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoading(false); 
    }
  };
  
  useEffect(() => {    
    buscarCategorias();
  }, []);

  const contentStyles = {
    alignItems: ehModoCriacao ? 'stretch' : 'center',
    justifyContent: ehModoCriacao ? 'stretch' : 'center',
  };

  const handleKeyPress = (e) => {
    const inputValue = e.key;

    if (!/[0-9]/.test(inputValue)) {
      e.preventDefault();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "titulo") {
      setTituloQuiz(value);
    }
    if (name === "numeroPerguntas") {
      const newValue = isNaN(value) ? 1 : Math.max(1, Math.min(10, parseInt(value, 10)));
      setNumeroPerguntasQuiz(newValue);
    }
    if(name === "dificuldade"){
      setDificuldadeSelecionada(value)
    }
    if(name === "categoria"){
      setCategoriaSelecionada(value)
    }
  }

  const handleDificuldadeChange = (value) => {
    handleChange({ target: { name: "dificuldade", value } });
  };

  const handleCategoriaChange = (value) => {
    handleChange({ target: { name: "categoria", value } });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (tituloQuiz !== '') {
      if(!ehTituloValido(tituloQuiz)){
        setTituloQuizFormatoValido(false)
      } else {
        // método que vai salvar a capa do quiz
      }
    } else {
      setTituloQuizValido(false)
    }
  }

  const ehTituloValido = (email) => {
    return email.length > 3;
  };


  const botaoPropsSalvarEcontinuar = {
    backgroundColor: "#b619b9",
    color: "white",
    label: "Salvar e continuar",
    height: "45px",
    width: "150px",
    borderRadius: "14px",
  }

  return (
    <div className="content" style={contentStyles}>
      {!isSidebarOpen && 
        <i className="material-icons open-icon" onClick={toggleSidebar}>
          menu
        </i>
      }
      {
        !ehModoCriacao &&
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
              <h2>Criar</h2>
              {
                loading ? 
                <div className="local-spinner"><span className="spinner"></span></div> : 
                <form className="criacao-quiz-form" onSubmit={handleSubmit}>
                  <div className="titulo-quiz-criacao">
                    <span className="titulo-text">Título:</span>
                    <div className="input-titulo-validation">
                      <input
                      type="text"
                      name="titulo"
                      value={tituloQuiz}
                      onChange={handleChange}
                      className={
                        tituloQuizValido && tituloQuizFormatoValido
                        ? 'input-titulo-criacao-quiz'
                        : 'input-titulo-criacao-quiz erro'           
                      }
                      placeholder="Digite um título para o quiz"
                      />
                      {tituloQuizValido ? null : <div className="error-message-titulo-quiz">O campo deve ser preenchido.</div>}
                      {tituloQuizFormatoValido ? null : <div className="error-message-titulo-quiz">O usuário deve conter acima de 4 caracteres.</div>}
                    </div>
                    
                  </div>
                  <div className="categoria-quiz-criacao">
                    <span>Categoria: </span>
                    <Combobox
                      options={categorias} 
                      preselectedValue={categorias[0]}
                      classNameSelect="categoria-combobox-criacao"
                      classNameDiv="categoria-combobox-div-criacao"
                      onChange={handleCategoriaChange}
                    />
                  </div>
                  <div className="dificuldade-quiz-criacao">
                    <span>Dificuldade: </span>
                    <div className="tooltip-wrapper">
                      <Combobox
                        options={['Fácil', 'Médio', 'Difícil']} 
                        preselectedValue="Fácil"
                        classNameSelect="dificuldade-combobox-criacao"
                        classNameDiv="dificuldade-combobox-div-criacao"
                        onChange={handleDificuldadeChange}
                      />
                      <a data-tooltip-id="tooltip-numero-perguntas" 
                      data-tooltip-html="Pontos por questão:<br/>Difícil: 10 pontos.<br/>Médio: 7 pontos.<br/>Fácil: 3 pontos." data-tooltip-place="right" href="#tooltip-numero-perguntas">
                          <i className="material-icons help-icon" onClick={toggleSidebar}>
                            help
                          </i>
                      </a>
                      <Tooltip id="tooltip-numero-perguntas" /> 
                    </div>
                  </div>
                  <div className="numero-perguntas-quiz-criacao">
                    <span>Nº Perguntas:</span>
                    <div className="tooltip-wrapper">
                      <input
                        type="number"
                        name="numeroPerguntas"
                        value={numeroPerguntasQuiz}
                        onChange={handleChange}
                        className="input-numero-perguntas-criacao-quiz"
                        placeholder="Nº de perguntas"
                        onKeyPress={handleKeyPress}
                        min={1}
                        max={10}
                      />
                      <a data-tooltip-id="tooltip-numero-perguntas" data-tooltip-content="O número máximo de perguntas é 10" data-tooltip-place="right" href="#tooltip-numero-perguntas">
                          <i className="material-icons help-icon" onClick={toggleSidebar}>
                            help
                          </i>
                      </a>
                      <Tooltip id="tooltip-numero-perguntas" /> 
                    </div>   
                  </div>
                  <div className="botao-wrapper">
                    <BotaoTematico {...botaoPropsSalvarEcontinuar}></BotaoTematico>
                  </div>
                </form>
              }
  
            </div>
          }
        </div> 
      }
    </div>
  );
};

export default Content;