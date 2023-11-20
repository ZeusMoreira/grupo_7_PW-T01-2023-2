import { useState } from "react";
import { Tooltip } from "react-tooltip";
import BotaoTematico from "../../../../../../../components/BotaoTematico/index.js";
import Combobox from "../Autocomplete.js";
import './formulario-criacao-quiz.css'

const FormularioCriacaoQuiz = ({categorias, tituloQuiz, onTituloQuizSet, numeroPerguntasQuiz, onNumeroPerguntasQuizSet, onDificuldadeQuizSet, onCategoriaQuizSet, onSubmitCapaQuiz}) => {
    const [tituloQuizValido, setTituloQuizValido] = useState(true)
    const [tituloQuizFormatoValido, setTituloQuizFormatoValido] = useState(true)

    const handleSubmitCapaQuiz = async (event) => {
        event.preventDefault();
        console.log('inicio')
        if (tituloQuiz !== '') {
            console.log('meio')
          if(!ehTituloValido(tituloQuiz)){
            setTituloQuizFormatoValido(false)
          } else {
            onSubmitCapaQuiz(2)
          }
        } else {
          setTituloQuizValido(false)
        }
    }

    const handleChange = (event) => {
        setTituloQuizValido(true)
        setTituloQuizFormatoValido(true)
    
        const { name, value } = event.target;
        if (name === "titulo") {
          onTituloQuizSet(value);
        } 
        if(name === "categoria"){
          onCategoriaQuizSet(value)
        }
        if(name === "dificuldade"){
          onDificuldadeQuizSet(value)
        }
        if (name === "numeroPerguntas") {
          const newValue = isNaN(value) ? 1 : Math.max(1, Math.min(10, parseInt(value, 10)));
          onNumeroPerguntasQuizSet(newValue);
        }   
    }

    const handleCategoriaChange = (value) => {
        handleChange({ target: { name: "categoria", value } });
    };

    const handleDificuldadeChange = (value) => {
        handleChange({ target: { name: "dificuldade", value } });
    };

    const ehTituloValido = (titulo) => {
        return titulo.length > 3;
    };

    const handleKeyPress = (e) => {
        const inputValue = e.key;
    
        if (!/[0-9]/.test(inputValue)) {
          e.preventDefault();
        }
    };
    
    const botaoPropsContinuar = {
        backgroundColor: "#b619b9",
        color: "white",
        label: 'Continuar',
        height: "45px",
        width: "150px",
        borderRadius: "14px",
    }

    return (
        <form className="criacao-quiz-form" onSubmit={handleSubmitCapaQuiz}>
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
                    {tituloQuizFormatoValido ? null : <div className="error-message-titulo-quiz">O título deve conter acima de 4 caracteres.</div>}
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
                        <i className="material-icons help-icon">
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
                        <i className="material-icons help-icon">
                        help
                        </i>
                    </a>
                    <Tooltip id="tooltip-numero-perguntas" /> 
                </div>   
            </div>
            <div className="botao-wrapper">
                <BotaoTematico {...botaoPropsContinuar}></BotaoTematico>
            </div>
      </form>
    );
}

export default FormularioCriacaoQuiz;