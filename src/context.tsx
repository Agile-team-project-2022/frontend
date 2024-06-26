import React, {useReducer} from "react";
import {DeviceTypes} from "./hooks/useWindowSize";
import axios from "axios";

// ================================ Global app storage ================================ //

// Valid actions.
enum AppValidActions {
  LOG_IN = 'LOG_IN',
  LOG_OUT = 'LOG_OUT',
  CHANGE_SETTINGS = 'CHANGE_SETTINGS',
  SHOW_LOG_IN = 'SHOW_LOG_IN',
  CLOSE_LOG_IN = 'CLOSE_LOG_IN',
  MAP_CATEGORIES = 'MAP_CATEGORIES',
  SET_USER_DATA = 'SET_USER_DATA',
  UPDATE_OWNER_PICTURE = 'UPDATE_OWNER_PICTURE',
  SET_DEVICE_TYPE = 'SET_DEVICE_TYPE',
  UPDATE_HOME_POSTS = 'UPDATE_HOME_POSTS',
  UPDATE_PLANT_PICTURE = 'UPDATE_PLANT_PICTURE',
  CREATE_NEW_PLANT = 'CREATE_NEW_PLANT',
  DELETE_PLANT = 'DELETE_PLANT',
  DELETE_OWNER = 'DELETE_OWNER',
  UPDATE_USER_DATA = 'UPDATE_USER_DATA',
  UPDATE_USER_LOADING = 'UPDATE_USER_LOADING'
}

// Interfaces and Types definition.
interface AppContextInterface {
  state: AppState,
  dispatch: React.Dispatch<AppAction>
}

interface AppState {
  settings: {
    fontSize: number,
    contrast: number,
    brightness: number,
    grayscale: number
  },
  loadingUser: boolean,
  token: string,
  loggedIn: boolean,
  showLogIn: boolean,
  categoryIdMap: {[name: string]: number},
  userData: UserData,
  homePosts: PostData[],
  postsPerPage: number,
  deviceType?: DeviceTypes,
  BASE_URL: string,
  updateFetchUser: boolean
}

export interface UserData {
  updated: boolean,
  user: string,
  name: string,
  userId: number,
  email: string,
  imageFile: string,
  experience: number,
  typePlanter: string,
  plants: PlantData[],
  followedPlants: ThumbnailData[],
  friends: ThumbnailData[],
  pendingFriends: ThumbnailData[],
  posts: PostData[],
  count: CountData,
  createdAt: string
}

export interface PlantData {
  id: number,
  ownerId: number,
  name: string,
  species: string,
  initialAge: number,
  imageFile: string,
  schedule: string,
  caringInfo: string,
  location: string,
  createdAt: string,
  categoryId: 1,
  posts: PostData[],
  gallery: string[]
}

// Applies for Friends, Followed plants, Requests to take care of, Requests for being friends.
export interface ThumbnailData {
  id: number,
  imageFile: string,
  name: string,
  relationId?: number
}

export interface PostData {
  id: number,
  title: string,
  content: string,
  postFlag: {}[],
  published: boolean,
  imageFile: string,
  imagesArr?: string[],
  postlikes: {id: number, userId: number}[],
  comments: CommentData[],
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

export interface CommentData {
  id: number,
  content: string,
  createdAt: string,
  updatedAt: string,
  authorId: number,
  postId: number
}

export interface CreateCommentData {
  content: string,
  authorId: number,
  postId: number
}

export interface CountData {
  totalPosts: number,
  totalPlants: number,
  totalFriends: number,
  totalFollowedPlants: number
}

type AppAction = LogInAction | LogOutAction | ChangeSettingsAction
                | MapCategoryAction | SetUserDataAction |SetDeviceTypeAction
                | UpdateOwnerPictureAction | UpdateHomePostsAction | UpdatePlantPictureAction
                | CreateNewPlantAction | DeleteOwnerAction | UpdateUserLoadingAction;

interface LogInAction {
  type: AppValidActions,
  payload: {user: string, userId: number, token: string}
}

interface LogOutAction {
  type: AppValidActions
}

interface ChangeSettingsAction {
  type: AppValidActions,
  payload: {newSettings: {}}
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
      name: string,
      email: string,
      imageFile: string,
      experience: number,
      typePlanter: string,
      plants: PlantData[],
      followedPlants: ThumbnailData[],
      friends: ThumbnailData[],
      pendingFriends: ThumbnailData[],
      posts: PostData[],
      count: CountData,
      createdAt: string
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

interface UpdatePlantPictureAction {
  type: AppValidActions,
  payload: {userData: {plants: PlantData[]} }
}

interface CreateNewPlantAction {
  type: AppValidActions,
  payload: {newPlant: PlantData}
}

interface DeleteOwnerAction {
  type: AppValidActions
}

interface UpdateUserLoadingAction {
  type: AppValidActions,
  payload: {loading: boolean}
}

// Defines the default values to initialize the app.
const appInitialState = {
  settings: {
    fontSize: 1,
    contrast: 100,
    brightness: 100,
    grayscale: 0
  },
  loadingUser: false,
  loggedIn: false,
  showLogIn: false,
  categoryIdMap: {},
  userData: {
    updated: false,
    user: 'guest',
    name: '',
    userId: 0,
    email: '',
    imageFile: '',
    experience: 0,
    typePlanter: '-',
    plants: [],
    followedPlants: [],
    friends: [],
    pendingFriends: [],
    posts: [],
    count: {
      totalPlants: 0,
      totalFriends: 0,
      totalFollowedPlants: 0,
      totalPosts: 0
    },
    createdAt: ''
  },
  token: '',
  homePosts: [],
  postsPerPage: 10,
  deviceType: undefined,
  BASE_URL: 'https://interplant-b.herokuapp.com/',
  updateFetchUser: false
};

// Creates the reducer.
const reducer = (state: AppState, action: AppAction) => {
  switch(action.type) {
    case AppValidActions.LOG_IN:
      const data = {
        userId: (action as LogInAction).payload.userId,
        name: (action as LogInAction).payload.user,
        token: (action as LogInAction).payload.token,
        loggedIn: true
      };
      window.localStorage.setItem('InterPlantSessionData', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${(action as LogInAction).payload.token}`;
      return {
        ...state,
        userData: {
          ...state.userData,
          user: (action as LogInAction).payload.user,
          name: (action as LogInAction).payload.user,
          userId: (action as LogInAction).payload.userId
        },
        token: (action as LogInAction).payload.token,
        loggedIn: true,
        updateFetchUser: !state.updateFetchUser
      };

    case AppValidActions.LOG_OUT:
      window.localStorage.removeItem('InterPlantSessionData');
      delete axios.defaults.headers.common['Authorization'];
      return {
        ...state,
        userData: {
          ...state.userData,
          user: 'guest',
          userId: 0,
          name: 'guest'
        },
        loggedIn: false,
        token: ''
      };

    case AppValidActions.CHANGE_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...(action as ChangeSettingsAction).payload.newSettings
        }
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
      const posts: PostData[] = [];
      let imgPosts: string[] = [];
      let start = 0;
      (action as UpdateHomePostsAction).payload.homePosts.forEach((post, index) => {
        const startArrImages = (
          !post.title
          && index - 1 >= 0
          && index + 1 < (action as UpdateHomePostsAction).payload.homePosts.length
          && post.plantId === (action as UpdateHomePostsAction).payload.homePosts[index + 1].plantId
          && post.plantId !== (action as UpdateHomePostsAction).payload.homePosts[index - 1].plantId
        ) || (
          !post.title
          && (action as UpdateHomePostsAction).payload.homePosts[index - 1]
          && (action as UpdateHomePostsAction).payload.homePosts[index - 1].title
        ) || (
          !post.title
          && index === 0
        ) || (
          !post.title
          && index - 1 >= 0
          && post.plantId !== (action as UpdateHomePostsAction).payload.homePosts[index - 1].plantId
        );
        const middleArrImages = (
          !post.title
          && index + 1 < (action as UpdateHomePostsAction).payload.homePosts.length
          && post.plantId === (action as UpdateHomePostsAction).payload.homePosts[index + 1].plantId
        );
        const endArrImages = (
          !post.title
          && start > 0
          && index - 1 >= 0
          && index + 1 < (action as UpdateHomePostsAction).payload.homePosts.length
          && post.plantId !== (action as UpdateHomePostsAction).payload.homePosts[index + 1].plantId
          && post.plantId === (action as UpdateHomePostsAction).payload.homePosts[index - 1].plantId
        ) || (
          !post.title
          && (action as UpdateHomePostsAction).payload.homePosts[index + 1]
          && (action as UpdateHomePostsAction).payload.homePosts[index + 1].title
        ) || (
          !post.title
          && index + 1 === (action as UpdateHomePostsAction).payload.homePosts.length
        );

        if(startArrImages) {
          start = index;
          imgPosts = [];
          imgPosts.push(post.imageFile);
          if(
            index + 1 === (action as UpdateHomePostsAction).payload.homePosts.length
            || (action as UpdateHomePostsAction).payload.homePosts[index + 1].title
            || (
              index + 1 < (action as UpdateHomePostsAction).payload.homePosts.length
              && post.plantId !== (action as UpdateHomePostsAction).payload.homePosts[index + 1].plantId
            )
          ) {
            posts.push({...post, imagesArr: imgPosts.reverse()});
            start = index;
            imgPosts = [];
          }
        } else if(middleArrImages) {
          imgPosts.push(post.imageFile);
        } else if(endArrImages) {
          imgPosts.push(post.imageFile);
          posts.push(
            {...(action as UpdateHomePostsAction).payload.homePosts[start], imagesArr: imgPosts.reverse()}
          );
          start = index;
          imgPosts = [];
        } else {
          posts.push({...post, imagesArr: [post.imageFile]});
        }
      });

      return {
        ...state,
        homePosts: posts
      };

    case AppValidActions.UPDATE_PLANT_PICTURE:
      return {
        ...state,
        userData: {
          ...state.userData,
          plants: [
            ...(action as UpdatePlantPictureAction).payload.userData.plants
          ]
        }
      };

    case AppValidActions.CREATE_NEW_PLANT:
      return {
        ...state,
        userData: {
          ...state.userData,
          plants: [
            ...state.userData.plants,
            (action as CreateNewPlantAction).payload.newPlant
          ]
        }
      };

    case AppValidActions.DELETE_PLANT:
      return {
        ...state,
        updateFetchUser: !state.updateFetchUser
      };

    case AppValidActions.UPDATE_USER_DATA:
      return {
        ...state,
        updateFetchUser: !state.updateFetchUser
      };

    case AppValidActions.DELETE_OWNER:
      window.localStorage.removeItem('InterPlantSessionData');
      return {
        ...appInitialState
      };

    case AppValidActions.UPDATE_USER_LOADING:
      return {
        ...state,
        loadingUser: (action as UpdateUserLoadingAction).payload.loading
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