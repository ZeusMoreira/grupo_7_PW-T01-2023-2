import { useState } from "react"
import { Tooltip } from "react-tooltip"
import BotaoTematico from "../../../../../../../components/BotaoTematico/index.js"
import Combobox from "../Autocomplete.js"
import './formulario-edicao-quiz.css'

const FormularioEdicaoQuiz = ({tituloQuizEdicao, numeroPerguntasQuizEdicao, categoriaEdicao, dificuldadeEdicao,  onTituloQuizEdicaoSet, onSubmitCapaQuizEdicao}) => {
    const [tituloQuizEdicaoValido, setTituloQuizEdicaoValido] = useState(true)
    const [tituloQuizEdicaoFormatoValido, setTituloQuizEdicaoFormatoValido] = useState(true)
    
    const handleSubmitCapaQuizEdicao = async (event) => {
        event.preventDefault();
        if (tituloQuizEdicao !== '') {
          if(!ehTituloEdicaoValido(tituloQuizEdicao)){
            setTituloQuizEdicaoFormatoValido(false)
          } else {
            onSubmitCapaQuizEdicao()
          }
        } else {
          setTituloQuizEdicaoValido(false)
        }
    }

    const handleChange = (event) => {
        setTituloQuizEdicaoValido(true)
        setTituloQuizEdicaoFormatoValido(true)
    
        const { name, value } = event.target;
        if (name === "titulo-edicao") {
          onTituloQuizEdicaoSet(value);
        } 
    }

    const ehTituloEdicaoValido = (tituloEdicao) => {
        return tituloEdicao.length > 3;
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
        <form className="criacao-quiz-form" onSubmit={handleSubmitCapaQuizEdicao}>
            <div className="titulo-quiz-criacao">
                <span className="titulo-text">Título:</span>
                <div className="input-titulo-validation">
                <input
                    type="text"
                    name="titulo-edicao"
                    value={tituloQuizEdicao}
                    onChange={handleChange}
                    className={
                    tituloQuizEdicaoValido && tituloQuizEdicaoFormatoValido
                    ? 'input-titulo-criacao-quiz'
                    : 'input-titulo-criacao-quiz erro'           
                    }
                    placeholder="Digite um título para o quiz"
                />
                {tituloQuizEdicaoValido ? null : <div className="error-message-titulo-quiz">O campo deve ser preenchido.</div>}
                {tituloQuizEdicaoFormatoValido ? null : <div className="error-message-titulo-quiz">O título deve conter acima de 4 caracteres.</div>}
                </div>
            </div>
            <div className="categoria-quiz-criacao">
                <span>Categoria: </span>
                <Combobox
                options={[categoriaEdicao]}
                preselectedValue={categoriaEdicao}
                classNameSelect="categoria-combobox-criacao"
                classNameDiv="categoria-combobox-div-criacao"
                disabled={true}
                />
            </div>
            <div className="dificuldade-quiz-criacao">
                <span>Dificuldade: </span>
                <div className="tooltip-wrapper">
                <Combobox
                    options={['Fácil', 'Médio', 'Difícil']} 
                    preselectedValue={dificuldadeEdicao}
                    classNameSelect="dificuldade-combobox-criacao"
                    classNameDiv="dificuldade-combobox-div-criacao"
                    disabled={true}
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
                    value={numeroPerguntasQuizEdicao}
                    className="input-numero-perguntas-criacao-quiz"
                    placeholder="Nº de perguntas"
                    disabled
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

export default FormularioEdicaoQuiz