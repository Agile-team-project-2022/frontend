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
  UPDATE_OWNER_PICTURE = 'UPDATE_OWNER_PICTURE',
  SET_DEVICE_TYPE = 'SET_DEVICE_TYPE',
  UPDATE_HOME_POSTS = 'UPDATE_HOME_POSTS',
}

// Interfaces and Types definition.
interface AppContextInterface {
  state: AppState,
  dispatch: React.Dispatch<AppAction>
}

interface AppState {
  language: string,
  fontSize: string,
  loggedIn: boolean,
  showLogIn: boolean,
  categoryIdMap: {[name: string]: number},
  userData: UserData,
  homePosts: PostData[],
  deviceType?: DeviceTypes,
  BASE_URL: string
}

export interface UserData {
  updated: boolean,
  user: string,
  userId: number,
  email: string,
  imageFile: string,
  experience: number,
  typePlanter: string,
  badgesPreview: string[],
  badges: {name: string, id: number}[],
  totalBadges: number,
  plants: PlantData[],
  followedPlants: ThumbnailData[],
  friends: ThumbnailData[],
  posts: PostData[],
  count: CountData,
  createdAt: string
}

export interface PlantData {
  id: number,
  ownerId: number,
  name: string,
  species: string,
  age: string,
  imageFile: string,
  schedule: string,
  caringInfo: string,
  location: string,
  createdAt: string,
  categoryId: 1
}

// Applies for Friends, Followed plants, Requests to take care of, Requests for being friends.
export interface ThumbnailData {
  id: number,
  imageFile: string, // TODO: Add img property.
  name: string // TODO: Add name property in endpoint to avoid fetching all the plant's data.
}

export interface PostData {
  id: number,
  title: string,
  content: string,
  flag: boolean,
  published: boolean,
  imageFile: string,
  postlikes: {id: number, userId: number}[],
  comments: {}[],
  createdAt: string,
  updatedAt: string,
  authorId: number,
  plantId: number
}

export interface CreatePostData {
  title: string,
  content: string,
  imageFile: string,
  authorId: number,
  plantId: number
}

export interface CountData {
  totalPosts: number,
  totalPlants: number,
  totalFriends: number,
  totalFollowedPlants: number
}

type AppAction = LogInAction | LogOutAction | ChangeLanguageAction | ChangeFontSizeAction
                | MapCategoryAction | SetUserDataAction | SetBadgesAction |SetDeviceTypeAction
                | UpdateOwnerPictureAction | UpdateHomePostsAction;

interface LogInAction {
  type: AppValidActions,
  payload: {user: string, userId: number}
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
      user: string,
      email: string,
      imageFile: string,
      experience: number,
      typePlanter: string,
      plants: PlantData[],
      followedPlants: ThumbnailData[],
      friends: ThumbnailData[],
      posts: PostData[],
      count: CountData,
      createdAt: string
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

interface UpdateOwnerPictureAction {
  type: AppValidActions,
  payload: {userData: {imageFile: string}}
}

interface SetDeviceTypeAction {
  type: AppValidActions,
  payload: {deviceType: DeviceTypes}
}

interface UpdateHomePostsAction {
  type: AppValidActions,
  payload: {homePosts: PostData[]}
}

// Defines the default values to initialize the app.
const appInitialState = {
  language: 'en',
  fontSize: 'normal',
  loggedIn: true, // TODO set to false
  showLogIn: false,
  categoryIdMap: {},
  userData: {
    updated: false,
    user: 'guest',
    userId: 1, // TODO: use correct user id
    email: '',
    imageFile: '',
    experience: 0,
    typePlanter: '-',
    badgesPreview: [],
    badges: [],
    totalBadges: 0,
    plants: [],
    followedPlants: [],
    friends: [],
    posts: [],
    count: {
      totalPlants: 0,
      totalFriends: 0,
      totalFollowedPlants: 0,
      totalPosts: 0
    },
    createdAt: ''
  },
  homePosts: [],
  deviceType: undefined,
  BASE_URL: 'http://localhost:5000/'
};

// Creates the reducer.
const reducer = (state: AppState, action: AppAction) => {
  switch(action.type) {
    case AppValidActions.LOG_IN:
      return {
        ...state,
        userData: {
          ...state.userData,
          user: (action as LogInAction).payload.user
        },
        loggedIn: true
      };

    case AppValidActions.LOG_OUT:
      return {
        ...state,
        userData: {
          ...state.userData,
          user: 'guest'
        },
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

    case AppValidActions.UPDATE_OWNER_PICTURE:
      return {
        ...state,
        userData: {
          ...state.userData,
          imageFile: (action as UpdateOwnerPictureAction).payload.userData.imageFile
        }
      };

    case AppValidActions.SET_DEVICE_TYPE:
      return {
        ...state,
        deviceType: (action as SetDeviceTypeAction).payload.deviceType
      };

    case AppValidActions.UPDATE_HOME_POSTS:
      return {
        ...state,
        homePosts: (action as UpdateHomePostsAction).payload.homePosts
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