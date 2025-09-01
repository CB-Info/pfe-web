import {
  FC,
  ReactNode,
  useEffect,
  useReducer,
  useState,
  useMemo,
  useCallback,
} from "react";
import FirebaseAuthManager from "../network/authentication/firebase.auth.manager";
import {
  UsersListerDispatchContext,
  UsersListerInitialState,
  usersListerlocalReducer,
  UsersListerStateContext,
} from "../reducers/auth.reducer";
import LoginPage from "../UI/pages/authentication/login.page";
import Loading from "../UI/components/common/loading.component";
import { UserRepositoryImpl } from "../network/repositories/user.respository";

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [state, dispatch] = useReducer(
    usersListerlocalReducer,
    UsersListerInitialState
  );

  // Instances stables pour éviter les re-créations
  const firebaseAuthManager = useMemo(
    () => FirebaseAuthManager.getInstance(),
    []
  );
  const userRepository = useMemo(() => new UserRepositoryImpl(), []);

  // Fonction stable pour charger les données utilisateur
  const loadUserData = useCallback(async () => {
    try {
      const userData = await userRepository.getMe();
      dispatch({ type: "UPDATE_USER", payload: userData });
    } catch (error) {
      console.warn(
        "Erreur lors du chargement des données utilisateur, utilisation du fallback:",
        error
      );
      // En cas d'erreur de l'API /me, créer un utilisateur par défaut avec le rôle CUSTOMER
      const firebaseUser = firebaseAuthManager.getCurrentUser();
      if (firebaseUser) {
        const fallbackUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "unknown@example.com",
          firstname: firebaseUser.displayName?.split(" ")[0] || "Utilisateur",
          lastname: firebaseUser.displayName?.split(" ")[1] || "",
          role: "CUSTOMER" as const,
        };
        dispatch({ type: "UPDATE_USER", payload: fallbackUser });
      }
    } finally {
      setIsLoading(false);
    }
  }, [userRepository, firebaseAuthManager, dispatch]);

  useEffect(() => {
    const unsubscribe = firebaseAuthManager.monitorAuthState(async (user) => {
      setIsLogin(!!user);

      if (user) {
        // Si l'utilisateur est connecté, charger ses données
        await loadUserData();
      } else {
        // Si l'utilisateur n'est pas connecté, nettoyer le contexte
        dispatch({ type: "UPDATE_USER", payload: undefined });
        setIsLoading(false);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [firebaseAuthManager, loadUserData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading
          variant="sandy"
          size="large"
          text="Chargement de votre espace..."
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
