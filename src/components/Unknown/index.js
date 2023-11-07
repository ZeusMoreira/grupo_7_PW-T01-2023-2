import React from "react";
import "./style.css"

function Unknown(){
    return(
        <div className="error">
            <img className="error-img" src="https://lh3.google.com/u/0/d/1Wx2-9ASRr18fHhV7Mq8OC1pR33WntEOk=w1920-h962-iv1" alt="imagem de página não encontrada."></img>
            <span>Lamentamos, parece que esse caminho não é válido.</span><br/>
            <span>Verifique se a URL está correta e tente novamente!</span>
        </div>
    );
}

export default Unknown