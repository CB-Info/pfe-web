import { createContext, useContext } from "react";
import { User } from "../data/models/user.model";

type UsersListerAction = 
| { type: 'UPDATE_USER'; payload: User | undefined }

interface UsersListerLocalState {
    currentUser: User | undefined;
}

export const UsersListerInitialState: UsersListerLocalState = {
    currentUser: undefined
}

export const usersListerlocalReducer = (state: UsersListerLocalState, action: UsersListerAction): UsersListerLocalState => {
    switch (action.type) {
      case 'UPDATE_USER':
          return { ...state, currentUser: action.payload }
  
      default:
          return state
    }
  };

  // Définissez le type pour le dispatch
type UsersListerDispatch = (action: UsersListerAction) => void;

// Créez les contextes pour l'état et le dispatch
export const UsersListerStateContext = createContext<UsersListerLocalState | undefined>(undefined);
export const UsersListerDispatchContext = createContext<UsersListerDispatch | undefined>(undefined);

// Hook personnalisé pour l'état
export function useUsersListerStateContext() {
    const context = useContext(UsersListerStateContext);
    if (context === undefined) {
      throw new Error('useStateContext must be used within a MyProvider');
    }
    return context;
  }
  
// Hook personnalisé pour le dispatch
export function useUsersListerDispatchContext() {
    const context = useContext(UsersListerDispatchContext);
    if (context === undefined) {
        throw new Error('useDispatchContext must be used within a MyProvider');
    }
    return context;
}