import React, {useReducer} from "react";
import {DeviceTypes} from "./hooks/useWindowSize";

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
  SET_USER_DATA = 'SET_USER_DATA',
  SET_USER_BADGES_DATA = 'SET_USER_BADGES_DATA',
  SET_DEVICE_TYPE = 'SET_DEVICE_TYPE'
}

// Interfaces and Types definition.
interface AppContextInterface {
  state: AppState,
  dispatch: React.Dispatch<AppAction>
}

interface AppState {
  user: string,
  userId: number,
  language: string,
  fontSize: string,
  loggedIn: boolean,
  showLogIn: boolean,
  categoryIdMap: {[name: string]: number},
  userData: UserData,
  deviceType?: DeviceTypes,
  BASE_URL: string
}

interface UserData {
  updated: boolean,
  experience: number,
  typePlanter: string,
  badgesPreview: string[],
  badges: {name: string, id: number}[],
  totalBadges: number,
  plants: PlantCollectionData[],
  totalPlants: number
}

interface PlantCollectionData {
  name: string,
  species: string,
  age: string,
  imageFile: string,
  id: number
}

type AppAction = LogInAction | LogOutAction | ChangeLanguageAction | ChangeFontSizeAction
                | MapCategoryAction | SetUserDataAction | SetBadgesAction |SetDeviceTypeAction
                ;

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

interface SetUserDataAction {
  type: AppValidActions,
  payload: {userData: {
      updated: boolean,
      experience: number,
      typePlanter: string,
      plantsPreview: PlantCollectionData[],
      plants: PlantCollectionData[],
      totalPlants: number
  }}
}

interface SetBadgesAction {
  type: AppValidActions,
  payload: {userData: {
      badgesPreview?: string[],
      totalBadges?: number,
      badges?: {name: string, id: number}[]
    }}
}

interface SetDeviceTypeAction {
  type: AppValidActions,
  payload: {deviceType: DeviceTypes}
}

// Defines the default values to initialize the app.
const appInitialState = {
  user: 'guest',
  userId: 1, // TODO: use correct user id
  language: 'en',
  fontSize: 'normal',
  loggedIn: true, // TODO set to false
  showLogIn: false,
  categoryIdMap: {},
  userData: {
    updated: false,
    experience: 0,
    typePlanter: '-',
    badgesPreview: [],
    badges: [],
    totalBadges: 0,
    plants: [],
    totalPlants: 0
  },
  deviceType: undefined,
  BASE_URL: 'https://interplant-b.herokuapp.com/'
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

    case AppValidActions.SET_USER_DATA:
      return {
        ...state,
        userData: {
          ...state.userData,
          ...(action as SetUserDataAction).payload.userData
        }
      };

    case AppValidActions.SET_USER_BADGES_DATA:
      return {
        ...state,
        userData: {
          ...state.userData,
          ...(action as SetBadgesAction).payload.userData
        }
      };

    case AppValidActions.SET_DEVICE_TYPE:
      return {
        ...state,
        deviceType: (action as SetDeviceTypeAction).payload.deviceType
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