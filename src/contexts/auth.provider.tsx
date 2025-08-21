import { FC, ReactNode, useEffect, useReducer, useState } from "react";
import FirebaseAuthManager from "../network/authentication/firebase.auth.manager";
import {
  UsersListerDispatchContext,
  UsersListerInitialState,
  usersListerlocalReducer,
  UsersListerStateContext,
} from "../reducers/auth.reducer";
import LoginPage from "../UI/pages/authentication/login.page";
import Loading from "../UI/components/common/loading.component";

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [state, dispatch] = useReducer(
    usersListerlocalReducer,
    UsersListerInitialState
  );
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading
          variant="sandy"
          size="large"
          text="Authentification en cours..."
        />
      </div>
    );
  }

  return (
    <UsersListerStateContext.Provider value={state}>
      <UsersListerDispatchContext.Provider value={dispatch}>
        {isLogin ? children : <LoginPage />}
      </UsersListerDispatchContext.Provider>
    </UsersListerStateContext.Provider>
  );
};

export default AuthProvider;
