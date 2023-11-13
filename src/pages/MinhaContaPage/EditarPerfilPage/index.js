import './style.css';
import {  useNavigate } from "react-router-dom";
import React, { useEffect } from 'react';
import FormularioEdicaoConta from './FormularioEdicaoConta';

export const EditarPerfilPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/minha-conta/editar-perfil");
  }, [])


  return (
    <div className="container-editar-perfil">
        <FormularioEdicaoConta></FormularioEdicaoConta>
    </div>
  );
}

export default EditarPerfilPage; 