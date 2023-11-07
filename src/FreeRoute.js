import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "./PrivateRoute.css"

const FreeRoute = ({Component}) => {
    const [user, setUser] = useState(null);
    const auth = getAuth()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(true)
            } else {
                setUser(false)
            }
          });
    }, [auth]);

    if (user === null) {
        return <div className="overlay">
            <div class="loader">
                <div class="ball"></div>
                <div class="ball"></div>
                <div class="ball"></div>
                <span>Loading...</span>
            </div>
        </div>
    } else if (user === false) {
        return <Component/>
    }

    return user ? <Navigate to="/home" /> : <Component/>
}

export default FreeRoute
