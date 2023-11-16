import React, { useEffect, useState } from "react";
import "./style.css"

function BotaoCategoria(props) {
    const [imagemCarregada, setImagemCarregada] = useState(false);

    const handleImageLoad = () => {
        setImagemCarregada(true);
    };

    const handleButtonClick = () => {
        if (props.onClick) {
          props.onClick(); // Chama a função de clique passada como prop
        }
    }

    const { backgroundColor, color, label, width, borderRadius, fontWeight, cursor, transition, disabled, className, link } = props;

    const buttonStyle = {
        backgroundColor: disabled ? "#b5b5b5" : backgroundColor,
        color: color,
        width: width,
        borderRadius: borderRadius,
        fontWeight: fontWeight,
        cursor: disabled ? "default" : cursor,
        transition: transition,
    };

    // Remova o efeito de hover quando o botão estiver desabilitado
    if (disabled) {
        buttonStyle.transform = "none";
        buttonStyle.boxShadow = "none";
    }

    useEffect(() => {
        const image = new Image();
        image.src = link;
        image.onload = handleImageLoad;

        return () => {
            image.onload = null;
        };
    }, [link]);

    return (
        <div className="init">
            {
            !imagemCarregada && 
                <div className="overlay-main">
                    <div className="loader">
                    <div className="ball"></div>
                    <div className="ball"></div>
                    <div className="ball"></div>
                    <span>Loading...</span>
                    </div>
                </div>
             }
            <button
            className={`button-categoria ${className} `}
            style={buttonStyle}
            onClick={handleButtonClick}
            disabled={disabled}
            >
                <span>{label}</span>
                {imagemCarregada && (
                    <img className="img-categoria" src={link} alt="imagem referente a categoria" />
                )}
            </button>
        </div>
        
    );
}

BotaoCategoria.defaultProps = {
    backgroundColor: "white", // Valor padrão para backgroundColor
    color: "#b619b9", // Valor padrão para color
    label: "Clique", // Valor padrão para label
    width: "100px", // Valor padrão para width
    borderRadius: "5px", // Valor padrão para borderRadius
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    disabled: false,
    link: ""
};

export default BotaoCategoria;