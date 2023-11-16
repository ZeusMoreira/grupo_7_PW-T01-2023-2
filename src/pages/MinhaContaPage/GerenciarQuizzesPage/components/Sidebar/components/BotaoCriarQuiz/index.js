import React from "react";
import "./style.css"

function BotaoCriarQuiz(props) {
    const handleButtonClick = () => {
        if (props.onClick) {
          props.onClick(); // Chama a função de clique passada como prop
        }
    }

    const { backgroundColor, color, disabled, className } = props;

    const buttonStyle = {
        backgroundColor: backgroundColor,
        color: color,
    };

    return (
        <button
            className={`botao-criar-quiz ${className} `}
            onClick={handleButtonClick}
            style={buttonStyle}
            disabled={disabled}
        >
            <i className="material-icons icon-add">
                add
            </i>
            <span className="span-criar-quiz">Criar Quiz</span>
        </button>
    );
}

BotaoCriarQuiz.defaultProps = {
    backgroundColor: 'transparent',
    color: 'white',
    disabled: false,
};

export default BotaoCriarQuiz;