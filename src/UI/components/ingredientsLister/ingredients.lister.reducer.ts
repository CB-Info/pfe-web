import { createContext, useContext } from "react";
import { Ingredient } from "../../../data/models/ingredient.model";

export enum NavigationModal {
    HOME,
    CREATION_INGREDIENT,
    UNITY
}

// Actions et état que le reducer va gérer
type IngredientsListerAction =
  | { type: 'UPDATE_CURRENT_INGREDIENT'; payload: Ingredient | undefined }
  | { type: 'UPDATE_SUGGEST_INGREDIENTS'; payload: Ingredient[] }
  | { type: 'SET_SEARCH_INPUT'; payload: string }
  | { type: 'SET_USER_INGREDIENT_NAME_INPUT'; payload: string }
  | { type: 'SET_USER_INGREDIENT_VALUE_INPUT'; payload: string }
  | { type: 'SET_USER_SEARCH_UNITY'; payload: string }
  | { type: 'SET_NAVIGATION_MODAL'; payload: NavigationModal | undefined };

interface IngredientsListerLocalState {
  currentIngredient: Ingredient | undefined;
  suggestIngredients: Ingredient[]
  searchIngredientInput: string;
  userIngredientNameInput: string;
  userIngredientValueInput: string;
  userSearchUnity: string;
  navigationModal: NavigationModal | undefined;
}

export const ingredientsListerInitialState: IngredientsListerLocalState = {
  currentIngredient: undefined,
  suggestIngredients: [],
  searchIngredientInput: '',
  userIngredientNameInput: '',
  userIngredientValueInput: '',
  userSearchUnity: '',
  navigationModal: undefined,
};

export const ingredientsListerlocalReducer = (state: IngredientsListerLocalState, action: IngredientsListerAction): IngredientsListerLocalState => {
  switch (action.type) {
    case 'SET_SEARCH_INPUT':
        return { ...state, searchIngredientInput: action.payload }

    case 'UPDATE_SUGGEST_INGREDIENTS':
      return { ...state, suggestIngredients: action.payload }

    case 'SET_NAVIGATION_MODAL':
        return { ...state, navigationModal: action.payload }
    
    case 'SET_USER_INGREDIENT_NAME_INPUT':
        return { ...state, userIngredientNameInput: action.payload }

    case 'SET_USER_INGREDIENT_VALUE_INPUT':
        return { ...state, userIngredientValueInput: action.payload }

    case 'UPDATE_CURRENT_INGREDIENT':
        return { ...state, currentIngredient: action.payload }

    case 'SET_USER_SEARCH_UNITY':
        return { ...state, userSearchUnity: action.payload }

    default:
        return state
  }
};

// Définissez le type pour le dispatch
type IngredientsListerDispatch = (action: IngredientsListerAction) => void;

// Créez les contextes pour l'état et le dispatch
export const IngredientsListerStateContext = createContext<IngredientsListerLocalState | undefined>(undefined);
export const IngredientsListerDispatchContext = createContext<IngredientsListerDispatch | undefined>(undefined);

// Hook personnalisé pour l'état
export function useIngredientsListerStateContext() {
    const context = useContext(IngredientsListerStateContext);
    if (context === undefined) {
      throw new Error('useStateContext must be used within a MyProvider');
    }
    return context;
  }
  
// Hook personnalisé pour le dispatch
export function useIngredientsListerDispatchContext() {
    const context = useContext(IngredientsListerDispatchContext);
    if (context === undefined) {
        throw new Error('useDispatchContext must be used within a MyProvider');
    }
    return context;
}