import { useEffect, useState } from "react"
import BotaoTematico from "../../../../../../../components/BotaoTematico/index.js"
import Combobox from "../Autocomplete.js"
import './formulario-pergunta-criacao-quiz.css'

const FormularioPerguntaCriacaoQuiz = ({perguntaConteudo, onPerguntaConteudoQuizSet, respostaA, onRespostaAQuizSet, respostaB, onRespostaBQuizSet,respostaC, onRespostaCQuizSet, respostaD, onRespostaDQuizSet, respostas, respostaCorreta, onRespostaCorretaQuizSet, onSubmitPerguntaQuiz}) =>  {
    const [perguntaValida, setPerguntaValida] = useState(true)
    const [respostaAValida, setRespostaAValida] = useState(true)
    const [respostaBValida, setRespostaBValida] = useState(true)
    const [respostaCValida, setRespostaCValida] = useState(true)
    const [respostaDValida, setRespostaDValida] = useState(true)
    
    const ehFormularioValido = () => {
        return (
            perguntaValida && 
            respostaAValida &&
            respostaBValida &&
            respostaCValida &&
            respostaDValida   
        );  
    }

    const handleSubmitPerguntaQuiz = async (event) => {
        event.preventDefault();
        setPerguntaValida(perguntaConteudo === '' ? false : true);
        setRespostaAValida(respostaA === '' ? false : true);
        setRespostaBValida(respostaB === '' ? false : true);
        setRespostaCValida(respostaC === '' ? false : true);
        setRespostaDValida(respostaD === '' ? false : true);
        
        if (ehFormularioValido()) {
            onSubmitPerguntaQuiz()
        }
    }

    const handleChange = (event) => {
        setPerguntaValida(true)
        setRespostaAValida(true)
        setRespostaBValida(true)
        setRespostaCValida(true)
        setRespostaDValida(true)

    
        const { name, value } = event.target;
        if(name === "pergunta-conteudo") {
            onPerguntaConteudoQuizSet(value);
        } 
        if(name === "primeira-resposta"){
            onRespostaAQuizSet(value)
        }
        if(name === "segunda-resposta"){
            onRespostaBQuizSet(value)
        }
        if(name === "terceira-resposta") {
            onRespostaCQuizSet(value);
        }   
        if(name === "quarta-resposta") {
            onRespostaDQuizSet(value);
        }  
        if(name === "resposta-correta"){
            onRespostaCorretaQuizSet(value)
        }
    }

    const handleRespostaCorretaChange = (value) => {
        handleChange({ target: { name: "resposta-correta", value } });
    };

    const botaoPropsContinuarOuSalvar = {
        backgroundColor: "#b619b9",
        color: "white",
        label: 'Continuar',
        height: "45px",
        width: "150px",
        borderRadius: "14px",
    }

    return (
        <form className="formulario-pergunta" onSubmit={handleSubmitPerguntaQuiz}>
            <div className="pergunta-conteudo">
                <textarea
                    type="text"
                    className={
                        perguntaValida ?
                        'textarea-estilizado' : 'textarea-estilizado erro'
                    }
                    placeholder="Digite aqui sua pergunta..."
                    name="pergunta-conteudo"
                    value={perguntaConteudo}
                    onChange={handleChange}
                    spellCheck="false"
                />
                {!perguntaValida? (
                <div className="error-message-pergunta">O campo deve ser preenchido.</div>
                ) : null}
            </div>
            <div className="respostas">
                <div className="wrapper-a-b">
                    <div className="resposta-a">
                    <span className="resposta-a-text">A:</span>
                    <div className="input-resposta-validation">
                        <input
                        type="text"
                        name="primeira-resposta"
                        value={respostaA}
                        onChange={handleChange}
                        className={respostaAValida ?'input-resposta-a' : 'input-resposta-a erro'}
                        placeholder="Digite uma resposta"
                        />
                        {respostaAValida ? null : <div className="error-message-pergunta">O campo deve ser preenchido.</div>}
                    </div>
                    </div>
                    <div className="resposta-b">
                    <span className="resposta-b-text">B:</span>
                    <div className="input-resposta-validation">
                        <input
                        type="text"
                        name="segunda-resposta"
                        value={respostaB}
                        onChange={handleChange}
                        className={respostaBValida ? 'input-resposta-b' : 'input-resposta-b erro'}
                        placeholder="Digite uma resposta"
                        />
                        {respostaBValida ? null : <div className="error-message-pergunta">O campo deve ser preenchido.</div>}
                    </div>
                    </div>
                </div>
                <div className="wrapper-c-d">
                <div className="resposta-c">
                    <span className="resposta-c-text">C:</span>
                    <div className="input-resposta-validation">
                    <input
                        type="text"
                        name="terceira-resposta"
                        value={respostaC}
                        onChange={handleChange}
                        className={respostaCValida ?'input-resposta-c' : 'input-resposta-c erro'}
                        placeholder="Digite uma resposta"
                    />
                    {respostaCValida ? null : <div className="error-message-pergunta">O campo deve ser preenchido.</div>}
                    </div>
                </div>
                <div className="resposta-d">
                    <span className="resposta-d-text">D:</span>
                    <div className="input-resposta-validation">
                    <input
                    type="text"
                    name="quarta-resposta"
                    value={respostaD}
                    onChange={handleChange}
                    className={respostaDValida ? 'input-resposta-d' : 'input-resposta-d erro'}
                    placeholder="Digite uma resposta"
                    />
                    {respostaDValida ? null : <div className="error-message-pergunta">O campo deve ser preenchido.</div>}
                    </div>
                </div>
                </div>
            </div>
            <div className="resposta-correta">
                <span>Resposta correta: </span>
                <Combobox
                    options={respostas} 
                    preselectedValue={respostaCorreta}
                    classNameSelect="resposta-correta-combobox-criacao"
                    classNameDiv="resposta-correta-combobox-div-criacao"
                    onChange={handleRespostaCorretaChange}
                />
            </div>
            <div className="botao-wrapper-respostas">
                <BotaoTematico {...botaoPropsContinuarOuSalvar}></BotaoTematico>
            </div>
        </form>
    );
}

export default FormularioPerguntaCriacaoQuiz