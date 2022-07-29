import React, {useReducer} from "react";

// ================================ Global app storage ================================ //

// Valid actions.
enum AppValidActions {
  LOG_IN = 'LOG_IN',
  LOG_OUT = 'LOG_OUT',
  CHANGE_LANGUAGE = 'CHANGE_LANGUAGE',
  CHANGE_FONT_SIZE = 'CHANGE_FONT_SIZE',
  SHOW_LOG_IN = 'SHOW_LOG_IN',
  CLOSE_LOG_IN = 'CLOSE_LOG_IN'
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
  showLogIn: boolean
}

type Props = {
  children?: React.ReactNode
};

type AppAction = LogInAction | LogOutAction | ChangeLanguageAction | ChangeFontSizeAction;

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

// Defines the default values to initialize the app.
const appInitialState = {
  user: 'guest',
  language: 'en',
  fontSize: 'normal',
  loggedIn: false,
  showLogIn: true
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

    default:
      return state;
  }
};

// Sets the context.
const AppContext = React.createContext<AppContextInterface>({state: appInitialState, dispatch: () => null});

const AppProvider: React.FC<Props> = ({children}) => {
  const [state, dispatch] = useReducer(reducer, appInitialState);

  return(
    <AppContext.Provider value={{state, dispatch}}>
      {children}
    </AppContext.Provider>
  );
};

export {AppContext, AppProvider, AppValidActions};