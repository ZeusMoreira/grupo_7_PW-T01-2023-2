import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "./PrivateRoute.css"
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";

const AdminRoute = ({Component}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tipoUser, setTipoUser] = useState(null)
    const auth = getAuth()

    const buscarDadosUsuario = async (username) => {
        try {
          const db = getFirestore();
          const usersCollection = collection(db, 'users');
          const querySnapshot = await getDocs(query(usersCollection, where('username', '==', username)));
          querySnapshot.forEach((doc) => {
            setTipoUser(doc.data().tipo);
          });
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        } finally {
          setLoading(false); // Define o estado de carregamento como false, indicando que os dados foram carregados
        }
      };

      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(true);
            buscarDadosUsuario(user.displayName);
          } else {
            setUser(false);
            setLoading(false); // Se não houver usuário, define o estado de carregamento como false
          }
        });
    
        return () => {
          unsubscribe();
        };
      }, [auth]);

    if (loading) {
        return <div className="overlay">
            <div class="loader">
                <div class="ball"></div>
                <div class="ball"></div>
                <div class="ball"></div>
                <span>Loading...</span>
            </div>
        </div>
    } 
    
    if (user === false) {
        return <Navigate to="/" />;
    } 

    return tipoUser === "admin" ? <Component/> : <Navigate to="/minha-conta" />
}

export default AdminRoute
