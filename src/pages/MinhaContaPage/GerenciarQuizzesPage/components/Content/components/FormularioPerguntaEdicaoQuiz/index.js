import { useState } from "react";
import BotaoTematico from "../../../../../../../components/BotaoTematico/index.js";
import Combobox from "../Autocomplete.js";
import './formulario-pergunta-edicao-quiz.css'

const FormularioPerguntaEdicaoQuiz = ({perguntasEdicao, indicePerguntaAtual, onPerguntasEdicaoSet, respostas, onSubmitPerguntaQuizEdicao}) => {
    const [perguntaValidaEdicao, setPerguntaValidaEdicao] = useState(true)
    const [respostaAEdicaoValida, setRespostaAEdicaoValida] = useState(true)
    const [respostaBEdicaoValida, setRespostaBEdicaoValida] = useState(true)
    const [respostaCEdicaoValida, setRespostaCEdicaoValida] = useState(true)
    const [respostaDEdicaoValida, setRespostaDEdicaoValida] = useState(true)


    const ehFormularioValido = () => {
        return (
            perguntaValidaEdicao && 
            respostaAEdicaoValida &&
            respostaBEdicaoValida &&
            respostaCEdicaoValida &&
            respostaDEdicaoValida   
        );  
    }

    const handleChangeEdicao = (event) => {
        setPerguntaValidaEdicao(true)
        setRespostaAEdicaoValida(true)
        setRespostaBEdicaoValida(true)
        setRespostaCEdicaoValida(true)
        setRespostaDEdicaoValida(true)

        const { name, value } = event.target;
        const novasPerguntasEdicao = [...perguntasEdicao];

        if(name === "pergunta-conteudo-edicao"){
            novasPerguntasEdicao[indicePerguntaAtual].pergunta = value;
        }
        if(name === "primeira-resposta-edicao"){
            novasPerguntasEdicao[indicePerguntaAtual].respostaA = value;
        }
        if(name === "segunda-resposta-edicao"){
            novasPerguntasEdicao[indicePerguntaAtual].respostaB = value;
        }
        if(name === "terceira-resposta-edicao"){
            novasPerguntasEdicao[indicePerguntaAtual].respostaC = value;
        }
        if(name === "quarta-resposta-edicao"){
            novasPerguntasEdicao[indicePerguntaAtual].respostaD = value;
        }
        if(name === "resposta-correta-edicao"){
            novasPerguntasEdicao[indicePerguntaAtual].respostaCorreta = value;
        }

        onPerguntasEdicaoSet(novasPerguntasEdicao)
    }

    const handleRespostaCorretaEdicaoChange = (value) => {
        handleChangeEdicao({ target: { name: "resposta-correta-edicao", value } });
    }

    const handleSubmitPerguntaQuizEdicao = (event) => {
        event.preventDefault();
        setPerguntaValidaEdicao(perguntasEdicao[indicePerguntaAtual].pergunta === '' ? false : true);
        setRespostaAEdicaoValida(perguntasEdicao[indicePerguntaAtual].respostaA === '' ? false : true);
        setRespostaBEdicaoValida(perguntasEdicao[indicePerguntaAtual].respostaB === '' ? false : true);
        setRespostaCEdicaoValida(perguntasEdicao[indicePerguntaAtual].respostaC === '' ? false : true);
        setRespostaDEdicaoValida(perguntasEdicao[indicePerguntaAtual].respostaD === '' ? false : true);
        
        if (ehFormularioValido()) {
            onSubmitPerguntaQuizEdicao()
        }
    }

    const botaoPropsSalvar = {
        backgroundColor: "#b619b9",
        color: "white",
        label: 'Salvar',
        height: "45px",
        width: "150px",
        borderRadius: "14px",
    }

    return (
        <form className="formulario-pergunta" onSubmit={handleSubmitPerguntaQuizEdicao}>
            <div className="pergunta-conteudo">
                <textarea
                    type="text"
                    className={
                    perguntaValidaEdicao ?
                    'textarea-estilizado' : 'textarea-estilizado erro'
                    }
                    placeholder="Digite aqui sua pergunta..."
                    name="pergunta-conteudo-edicao"
                    value={perguntasEdicao[indicePerguntaAtual].pergunta}
                    onChange={handleChangeEdicao}
                    spellCheck="false"
                />
                {!perguntaValidaEdicao? (
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
                        name="primeira-resposta-edicao"
                        value={perguntasEdicao[indicePerguntaAtual].respostaA}
                        onChange={handleChangeEdicao}
                        className={respostaAEdicaoValida? 'input-resposta-a' : 'input-resposta-a erro'}
                        placeholder="Digite uma resposta"
                    />
                    {respostaAEdicaoValida ? null : <div className="error-message-pergunta">O campo deve ser preenchido.</div>}
                    </div>
                </div>
                <div className="resposta-b">
                    <span className="resposta-b-text">B:</span>
                    <div className="input-resposta-validation">
                    <input
                        type="text"
                        name="segunda-resposta-edicao"
                        value={perguntasEdicao[indicePerguntaAtual].respostaB}
                        onChange={handleChangeEdicao}
                        className={respostaBEdicaoValida? 'input-resposta-b' : 'input-resposta-b erro'}
                        placeholder="Digite uma resposta"
                    />
                    {respostaBEdicaoValida ? null : <div className="error-message-pergunta">O campo deve ser preenchido.</div>}
                    </div>
                </div>
            </div>
            <div className="wrapper-c-d">
                <div className="resposta-c">
                <span className="resposta-c-text">C:</span>
                <div className="input-resposta-validation">
                    <input
                    type="text"
                    name="terceira-resposta-edicao"
                    value={perguntasEdicao[indicePerguntaAtual].respostaC}
                    onChange={handleChangeEdicao}
                    className={respostaCEdicaoValida ? 'input-resposta-c' : 'input-resposta-c erro'}
                    placeholder="Digite uma resposta"
                    />
                    {respostaCEdicaoValida ? null : <div className="error-message-pergunta">O campo deve ser preenchido.</div>}
                </div>
                </div>
                <div className="resposta-d">
                <span className="resposta-d-text">D:</span>
                <div className="input-resposta-validation">
                    <input
                    type="text"
                    name="quarta-resposta-edicao"
                    value={perguntasEdicao[indicePerguntaAtual].respostaD}
                    onChange={handleChangeEdicao}
                    className={respostaDEdicaoValida ? 'input-resposta-d' : 'input-resposta-d erro'}
                    placeholder="Digite uma resposta"
                    />
                    {respostaDEdicaoValida ? null : <div className="error-message-pergunta">O campo deve ser preenchido.</div>}
                </div>
                </div>
            </div>
            </div>
            <div className="resposta-correta">
                <span>Resposta correta: </span>
                <Combobox
                    options={respostas} 
                    preselectedValue={perguntasEdicao[indicePerguntaAtual].respostaCorreta}
                    classNameSelect="resposta-correta-combobox-criacao"
                    classNameDiv="resposta-correta-combobox-div-criacao"
                    onChange={handleRespostaCorretaEdicaoChange}
                />
            </div>
            <div className="botao-wrapper-respostas">
                <BotaoTematico {...botaoPropsSalvar}></BotaoTematico>
            </div>
      </form>
    );
}

export default FormularioPerguntaEdicaoQuiz