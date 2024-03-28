import { FC, ReactNode, useEffect, useReducer, useState } from "react";
import { auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { UsersListerDispatchContext, UsersListerInitialState, usersListerlocalReducer, UsersListerStateContext } from "./auth.reducer";
import LoginPage from "../pages/login.page";

const AuthProvider: FC<{children:ReactNode}> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    const [state, dispatch] = useReducer(usersListerlocalReducer, UsersListerInitialState);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLogin(true);
            } else {
                setIsLogin(false);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <UsersListerStateContext.Provider value={state}>
            <UsersListerDispatchContext.Provider value={dispatch}>
                {isLogin ? children : <LoginPage />}
            </UsersListerDispatchContext.Provider>
        </UsersListerStateContext.Provider>
    );
}

export default AuthProvider;
