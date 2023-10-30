import React, { Component } from "react";
import "./BotaoTematico.css"

class BotaoTematico extends Component {
    handleButtonClick = () => {
        if (this.props.onClick) {
          this.props.onClick(); // Chama a função de clique passada como prop
        }
    }

    render() { 
      const { backgroundColor, color, label, height, width, borderRadius, fontWeight,cursor, transition, disabled , className } = this.props;

      const buttonStyle = {
        backgroundColor: disabled ? "#b5b5b5" : backgroundColor,
        color: color,
        height: height,
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

      return (
        <button
          className={`button ${className} `}
          style={buttonStyle}
          onClick={this.handleButtonClick}
          disabled={disabled}
        >
          {label}
        </button>
      );
    }
}

BotaoTematico.defaultProps = {
    backgroundColor: "white", // Valor padrão para backgroundColor
    color: "#b619b9", // Valor padrão para color
    label: "Clique", // Valor padrão para label
    height: "40px", // Valor padrão para height
    width: "100px", // Valor padrão para width
    borderRadius: "5px", // Valor padrão para borderRadius
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    disabled: false,
};

export default BotaoTematico