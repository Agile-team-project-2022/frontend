import React, {useReducer} from "react";

// ================================ Global app storage ================================ //

// Valid actions.
enum AppValidActions {
  LOG_IN = 'LOG_IN',
  LOG_OUT = 'LOG_OUT',
  CHANGE_LANGUAGE = 'CHANGE_LANGUAGE',
  CHANGE_FONT_SIZE = 'CHANGE_FONT_SIZE',
  SHOW_LOG_IN = 'SHOW_LOG_IN',
  CLOSE_LOG_IN = 'CLOSE_LOG_IN',
  MAP_CATEGORIES = 'MAP_CATEGORIES',
  GET_USER_DATA = 'GET_USER_DATA'
}

// Interfaces and Types definition.
interface AppContextInterface {
  state: AppState,
  dispatch: React.Dispatch<AppAction>
}

interface AppState {
  user: string,
  language: string,
  fontSize: string,
  loggedIn: boolean,
  showLogIn: boolean,
  categoryIdMap: {[name: string]: number},
  userData: UserData
}

interface UserData {
  updated: boolean,
  totalPlants: number,
  experience: number,
  typePlanter: string,
  badgesPreviewIds: number[],
  totalBadges: number
}

type AppAction = LogInAction | LogOutAction | ChangeLanguageAction | ChangeFontSizeAction
                | MapCategoryAction | GetUserDataAction;

interface LogInAction {
  type: AppValidActions,
  payload: {user: string}
}

interface LogOutAction {
  type: AppValidActions
}

interface ChangeLanguageAction {
  type: AppValidActions,
  payload: {language: string}
}

interface ChangeFontSizeAction {
  type: AppValidActions,
  payload: {fontSize: string}
}

interface MapCategoryAction {
  type: AppValidActions,
  payload: {categoryIdMap: {[name: string]: number}}
}

interface GetUserDataAction {
  type: AppValidActions,
  payload: {userData: UserData}
}

// Defines the default values to initialize the app.
const appInitialState = {
  user: 'guest',
  language: 'en',
  fontSize: 'normal',
  loggedIn: false,
  showLogIn: false,
  categoryIdMap: {},
  userData: {
    updated: false,
    totalPlants: 0,
    experience: 0,
    typePlanter: '-',
    badgesPreviewIds: [],
    totalBadges: 0
  }
};

// Creates the reducer.
const reducer = (state: AppState, action: AppAction) => {
  switch(action.type) {
    case AppValidActions.LOG_IN:
      return {
        ...state,
        user: (action as LogInAction).payload.user,
        loggedIn: true
      };

    case AppValidActions.LOG_OUT:
      return {
        ...state,
        user: 'guest',
        loggedIn: false
      };

    case AppValidActions.CHANGE_LANGUAGE:
      return {
        ...state,
        language: (action as ChangeLanguageAction).payload.language
      };

    case AppValidActions.CHANGE_FONT_SIZE:
      return {
        ...state,
        fontSize: (action as ChangeFontSizeAction).payload.fontSize
      };

    case AppValidActions.SHOW_LOG_IN:
      return {
        ...state,
        showLogIn: true
      };

    case AppValidActions.CLOSE_LOG_IN:
      return {
        ...state,
        showLogIn: false
      };

    case AppValidActions.MAP_CATEGORIES:
      return {
        ...state,
        categoryIdMap: (action as MapCategoryAction).payload.categoryIdMap
      };

    case AppValidActions.GET_USER_DATA:
      return {
        ...state,
        userData: (action as GetUserDataAction).payload.userData
      };

    default:
      return state;
  }
};

// Sets the context.
const AppContext = React.createContext<AppContextInterface>({state: appInitialState, dispatch: () => null});

const AppProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [state, dispatch] = useReducer(reducer, appInitialState);

  return(
    <AppContext.Provider value={{state, dispatch}}>
      {children}
    </AppContext.Provider>
  );
};

export {AppContext, AppProvider, AppValidActions};