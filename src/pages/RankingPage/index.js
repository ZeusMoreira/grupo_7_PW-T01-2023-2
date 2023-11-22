import React, { useEffect, useMemo, useState } from "react";
import "./style.css"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Tabela from "./Tabela";
import { collection, getDocs, getFirestore, orderBy, query, where } from "firebase/firestore";

export const RankingPage = () => {
    const navigate = useNavigate();
    const [usuarioAtual, setUsuarioAtual] = useState(null);
    const [data, setData] = useState([])
    const [requisicaoEmAndamento, setRequisicaoEmAndamento] = useState(false)
    const [posicaoUsuarioAtual, setPosicaoUsuarioAtual] = useState(null)

    useEffect(() => {
        const auth = getAuth();
        setRequisicaoEmAndamento(true)
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const db = getFirestore();
                const usersCollection = collection(db, 'users');
                const querySnapshot = await getDocs(query(usersCollection, where('uid', '==', user.uid)));
                setUsuarioAtual(querySnapshot.docs[0].data())
            } 
        });
        setRequisicaoEmAndamento(false)
        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if(usuarioAtual){
            buscarDadosRanking()
        }
    }, [usuarioAtual])

    const buscarDadosRanking = async () => {
        setRequisicaoEmAndamento(true)
        const db = getFirestore();
        const usersCollection = collection(db, 'users');
        const querySnapshot = await getDocs(query(usersCollection, orderBy('score', 'desc')));
        let topUsers = []
        querySnapshot.docs.forEach((doc, index) => {
            const posicaoComSimbolo = (index+1) + "º"; 
            const userData = { ...doc.data(), posicao: posicaoComSimbolo };
            topUsers.push(userData);
            if (usuarioAtual && usuarioAtual.uid === userData.uid) {
                setPosicaoUsuarioAtual(index + 1);
            }
        })
        topUsers = topUsers.slice(0, 50);
        setData(topUsers)
        setRequisicaoEmAndamento(false)
    }

    const navegarHome = () => {
        navigate("/home")
    }
    
    const columns = useMemo(() => [
      {
        Header: "Posição",
        accessor: "posicao"
      },
      {
        Header: "Nome",
        accessor: "username"
      },
      {
        Header: "Score",
        accessor: "score"
      }
    ],
    []
  );

    return (
        <div className="container-ranking-page">
            <div className="header-ranking">
                <div className="logo-container-ranking">
                    <h1 className="logo-ranking" onClick={navegarHome}>Quizz<span>ES</span></h1>
                </div>
            </div>
            <div className="container-ranking-table">
                <div className="ranking-span">Ranking</div>
                {requisicaoEmAndamento ? <div className="local-spinner"><span className="spinner"></span></div> : <Tabela columns={columns} data={data}></Tabela>}
                {!requisicaoEmAndamento &&
                    <div className="ranking-atual">
                        <span>
                            Seu ranking atual: <span className="ranking-atual-texto-numero">{` #${posicaoUsuarioAtual}`}</span>
                        </span>
                    </div>
                }
            </div>
        </div>
    )
}

export default RankingPage;