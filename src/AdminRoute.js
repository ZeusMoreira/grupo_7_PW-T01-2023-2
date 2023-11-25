import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "./PrivateRoute.css"
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { toast } from "react-toastify";

const AdminRoute = ({Component}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tipoUser, setTipoUser] = useState(null)
    const auth = getAuth()

    const buscarDadosUsuario = async (uid) => {
        try {
          const db = getFirestore();
          const usersCollection = collection(db, 'users');
          const querySnapshot = await getDocs(query(usersCollection, where('uid', '==', uid)));
          querySnapshot.forEach((doc) => {
            setTipoUser(doc.data().tipo);
          });
        } catch (error) {
          toast.error(`Erro ao buscar dados do usuário: ${error}`)
        } finally {
          setLoading(false); 
        }
      };

      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(true);
            buscarDadosUsuario(user.uid);
          } else {
            setUser(false);
            setLoading(false);
          }
        });
    
        return () => {
          unsubscribe();
        };
      }, [auth]);

    if (loading) {
        return <div className="overlay">
            <div className="loader">
                <div className="ball"></div>
                <div className="ball"></div>
                <div className="ball"></div>
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
