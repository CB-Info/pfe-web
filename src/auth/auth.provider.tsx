import React, { FC, ReactNode, useEffect, useReducer, useState } from "react";
import FirebaseAuthManager from "../firebase.auth.manager";
import { UsersListerDispatchContext, UsersListerInitialState, usersListerlocalReducer, UsersListerStateContext } from "./auth.reducer";
import LoginPage from "../pages/login.page";

const AuthProvider: FC<{children: ReactNode}> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    const [state, dispatch] = useReducer(usersListerlocalReducer, UsersListerInitialState);
    const firebaseAuthManager = FirebaseAuthManager.getInstance();

    useEffect(() => {
        const unsubscribe = firebaseAuthManager.monitorAuthState((user) => {
            setIsLogin(!!user);
            setIsLoading(false);
        });

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [firebaseAuthManager]);

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
