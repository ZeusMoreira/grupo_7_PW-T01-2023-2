import React from "react";
import "./style.css"

function Unknown(){
    return(
        <div className="error">
            <img className="error-img" src="https://firebasestorage.googleapis.com/v0/b/quizzes-f7aec.appspot.com/o/not.png?alt=media&token=fde70a71-e1e4-4385-bb49-b9532bb03928&_gl=1*19fh5ko*_ga*ODU3MDEwNTIxLjE2OTgzOTYzMjk.*_ga_CW55HF8NVT*MTY5OTMzMjQ2MS4xMS4xLjE2OTkzMzM3NDkuMjguMC4w" alt="imagem de página não encontrada."></img>
            <span>Lamentamos, parece que esse caminho não é válido.</span><br/>
            <span>Verifique se a URL está correta e tente novamente!</span>
        </div>
    );
}

export default Unknown