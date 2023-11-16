import './style.css';
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';


export const MeuPerfilPage = () => {
  const [dadosUsuario, setDadosUsuario] = useState({})
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [loading, setLoading] = useState(true);
  const auth = getAuth()

  const buscarDadosUsuario = async (username) => {
    try {
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
      const querySnapshot = await getDocs(query(usersCollection, where('username', '==', username)));
      querySnapshot.forEach((doc) => {
        setDadosUsuario(doc.data());
      });
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    } finally {
      setLoading(false); 
    }
  };

  
  useEffect(() => {
    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        buscarDadosUsuario(user.displayName);
      } else {
        setLoading(false); 
      }
    });

    window.addEventListener('resize', handleResize);
  
    return () => {
        window.removeEventListener('resize', handleResize);
        unsubscribe();
    };
  }, []);

  return (
    <div className="container-meu-perfil">
        <div className="visualizacao-conta">
            <div className="informacoes-conta">
                <h2 className="informacoes-title">Informações</h2>
                <div>
                    {
                        loading ? <div className="local-spinner-profile"><span className="spinner"></span></div> :
                        <div className="dados-usuario">
                            <span>Usuário:<span className="info-user"> {dadosUsuario.username}</span></span>
                            <span>Categoria favorita:<span className="info-user"> {dadosUsuario.categoria ? dadosUsuario.categoria : 'Nenhuma'}</span></span>
                            <span>Score:<span className="info-user"> {dadosUsuario.score}</span></span>
                            <span>Posição no ranking:<span className="info-user"> #{dadosUsuario.posicao}</span></span> 
                        </div>
                    }
                </div>
            </div>
            
        </div>
    </div>
  );
}

export default MeuPerfilPage; 