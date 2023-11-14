import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "./PrivateRoute.css"

const PrivateRoute = ({Component}) => {
    const [user, setUser] = useState(null);
    const auth = getAuth()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userData = {
                    uid: user.uid,
                    email: user.email,
                };
                localStorage.setItem("@detailUser", JSON.stringify(userData));
                setUser(true)
            } else {
                const userData = {
                    uid: "",
                    email: "",
                };
                localStorage.setItem("@detailUser", JSON.stringify(userData));
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
        return <Navigate to="/" />;
    }

    return user ? <Component/> : <Navigate to="/" />
}

export default PrivateRoute
