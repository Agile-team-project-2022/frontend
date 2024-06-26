import React, {useContext, useEffect, useState} from 'react';
import './Filters.css';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import searchImg from "../assets/search.png";
import searchImgWEBP from "../assets/search.webp";
import sunImg from '../assets/category-sun.jpg';
import shadowImg from '../assets/category-shadow.jpeg';
import flowerImg from '../assets/category-flower.jpg';
import treeImg from "../assets/category-tree.jpeg";
import foodImg from '../assets/category-food.jpg';
import evergreenImg from '../assets/category-evergreen.jpeg';
import aquaticImg from '../assets/category-aquatic.jpg';
import plantImg from '../assets/category-plant.jpg';
import otherImg from '../assets/category-other.jpeg';
import Modal from "./Modal";
import axios from "axios";
import {AppContext, AppValidActions, PostData} from "../context";
import {DeviceTypes} from "../hooks/useWindowSize";

export interface IFiltersProps {
  onLoading?: (loading: boolean) => void
}

enum ValidFilters {
  SUN = 'SUN',
  SHADOW = 'SHADOW',
  FLOWER = 'FLOWER',
  TREE = 'TREE',
  FOOD = 'FOOD',
  EVERGREEN = 'EVERGREEN',
  AQUATIC = 'AQUATIC',
  OTHER = 'OTHER',
  PLANT = 'PLANT'
}

interface CategoryData {
  id: number,
  name: string,
  createdAt: string,
  updatedAt: string,
  plants: {}[]
}

const filterImagesArr = {
  [ValidFilters.SUN] : sunImg,
  [ValidFilters.SHADOW] :  shadowImg,
  [ValidFilters.FLOWER] :  flowerImg,
  [ValidFilters.TREE] :  treeImg,
  [ValidFilters.FOOD] :  foodImg,
  [ValidFilters.EVERGREEN] :  evergreenImg,
  [ValidFilters.AQUATIC] :  aquaticImg,
  [ValidFilters.OTHER] :  otherImg,
  [ValidFilters.PLANT] :  plantImg
};

const Filters: React.FunctionComponent<IFiltersProps> = ({onLoading}) => {
  const {state, dispatch} = useContext(AppContext);
  const [openFilters, setOpenFilters] = useState(false);
  const [filters, setFilters] = useState<ValidFilters[]>([]);
  const [preselectedFilters, setPreselectedFilters] = useState<ValidFilters[]>([]);
  const [filtersResponse, setFiltersResponse] = useState<{}[]>([]);

  /** Gets all the data associated to all the filters once the component is rendered. */
  useEffect(() => {
    fetchAllFilters();
    // eslint-disable-next-line
  }, [state.updateFetchUser]);

  /** Maps the categories and IDs only if not done yet. */
  useEffect(() => {
    setMappedIds();
    // eslint-disable-next-line
  }, [filtersResponse]);

  /** Expands the section containing the options to select from. */
  const expandFilters = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenFilters(prevState => !prevState);
    setPreselectedFilters(filters);
  };

  /** Returns the option filters to select from. */
  const getExpandedFilters = () => {
    return (
      Object.keys(ValidFilters).map((filter, index) => {
        return (
          <div className={`list-item-container ${filters.includes(filter as ValidFilters)? 'selected-filter-item' : ''}`}
               key={`filter-item-${filter.toLowerCase()}`}
               id={`filter-item-${filter.toLowerCase()}`}
               onClick={(e) => selectFilter(e, filter as ValidFilters)}
          >
            <div className='list-img-container'>
              <LazyLoadImage src={filterImagesArr[filter as ValidFilters]}
                             effect="black-and-white"
                             alt={`Category ${filter.toLowerCase()}`}
              />
              <div> </div>
            </div>
            <p> {filter.charAt(0) + filter.substring(1).toLowerCase()} </p>
          </div>
        );
      })
    );
  };

  /** Returns the control buttons 'Clear' and 'Apply'. */
  const getControlButtons = () => {
    return (
      <div className='filter-buttons'>
        <button className='button-action' onClick={() => clearFilters()}> Clear </button>
        <button className='button-action' onClick={() => applyFilters()}> Apply </button>
      </div>
    );
  };

  /** Selects or removes a filter based on its previous state. They are effective only once 'apply' button is clicked. */
  const selectFilter = (event: React.MouseEvent<HTMLDivElement>, filter: ValidFilters) => {
    event.preventDefault();
    const elem = document.getElementById(`filter-item-${filter.toLowerCase()}`);

    // Deselects the filter if it is already marked.
    if(preselectedFilters.includes(filter)) {
      if(elem && elem.classList.contains('selected-filter-item')) elem.classList.remove('selected-filter-item');

      const index = preselectedFilters.indexOf(filter);
      setPreselectedFilters(prevState => {
        return [
          ...prevState.slice(0, index),
          ...prevState.slice(index + 1)
        ]
      });
    } else {
      // Selects the filter.
      if(elem) elem.classList.add('selected-filter-item');

      setPreselectedFilters(prevState => {
        return [
          ...prevState,
          filter
        ]
      });
    }
  };

  /** Clears all the previously selected filters. */
  const clearFilters = () => {
    setOpenFilters(false);
    setFilters([]);
    fetchAllFilters();
  };

  /** Applies all the selected filters. */
  const applyFilters = () => {
    setOpenFilters(false);
    setFilters(preselectedFilters);
    if(onLoading) onLoading(true);
    console.log('fetching...')
    if(preselectedFilters.length === 0) {
      fetchAllFilters();
    } else {
      // Query for each selected filter.
      const allPosts: PostData[] = [];
      Promise.all(preselectedFilters.map(async (filter, index) => {
        const filterPosts = await fetchFilter(state.categoryIdMap[filter.toLowerCase()]);
        await Promise.all(filterPosts).then(() => {
          allPosts.push(...filterPosts);
        });
      })).then(() => {
        if(onLoading) onLoading(false);
        dispatch({type: AppValidActions.UPDATE_HOME_POSTS, payload: {homePosts: allPosts}});
      });
    }
  };

  /** Queries all the filters (to get all posts) if no filter is selected yet. */
  const fetchAllFilters = () => {
    if(!state.loggedIn) return [];

    const url = `${ state.BASE_URL }plant-category?page=1&count=10000`;
    if(onLoading) onLoading(true);
    axios.get(url)
      .then((response) => {
        setFiltersResponse(response.data);
        // Gets the posts of the linked plants with the selected category.
        const posts: PostData[] = [];
        response.data.forEach((item: any) => {
          item.plants.forEach((plantItem: any) => {
            if(plantItem.posts && plantItem.posts.length > 0) posts.push(...plantItem.posts);
          });
        });

        if(onLoading) onLoading(false);
        // Orders the posts by timestamp.
        posts.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        dispatch({type: AppValidActions.UPDATE_HOME_POSTS, payload: {homePosts: posts}});
      })
      .catch((e) => {
        if(onLoading && e.message !== 'Network Error') onLoading(false);
        if(e.message.includes('Request failed with status code 401')) dispatch({type: AppValidActions.LOG_OUT});
        else console.log(e.message);
      });
  };

  /** Initializes the mapping between category name and ID from database if not done yet. */
  const setMappedIds = () => {
    if(Object.keys(state.categoryIdMap).length === 0) {
      console.log('Setting the IDs for categories...')
      const mappedIds: {[name: string]: number} = {};
      Array(...filtersResponse).forEach((item, index) => {
        mappedIds[(item as CategoryData).name] = (item as CategoryData).id
      });

      dispatch({
        type: AppValidActions.MAP_CATEGORIES,
        payload: {categoryIdMap: mappedIds}
      });
    }
  };

  /** Queries the selected filter to database. */
  const fetchFilter = async (id: number) => {
    if(!state.loggedIn) return [];

    try {
      const url = `${ state.BASE_URL }plant-category/${id}`;
      const response = await axios.get(url);
      const postsAsArr: PostData[][] = await
        [response.data.plants
          .map((item: any) => item.posts)][0]
          .filter((item: any) => item.length > 0);
      const posts: PostData[] = await ([] as PostData[]).concat(...postsAsArr.map((item) => item));
      // Orders the posts by timestamp.
      posts.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      return posts;
    } catch(e: any) {
      console.log(e);
      return [];
    }
  };

  /** Creates new filters. NOTE: By now, only used to initialize the 8 valid filters in the DB. */
  /*
  TODO: Uncomment and use only if the 'create new filters' functionality must be implemented for users.
  const createFilters = () => {
    const url = `${ state.BASE_URL }plant-category`;

    Object.keys(ValidFilters).forEach((filter, index) => {
      const data = {name: filter.toLowerCase()};
      axios.post(url, data)
        .then((response) => {
          console.log(`Successfully created filter category in Database: ${data.name}`);
        })
        .catch((e) => console.log(e));
    });
  };
  */

  return (
    <div className='filters-section-container'>
      <div className='filter-div-container filters'>
        {
          /** Tablet and Desktop views. */
          state.deviceType !== DeviceTypes.MOBILE?
            <>
              <h3 className='button-open-section' onClick={expandFilters}>
                Filter by category
              </h3>

              {
                openFilters?
                  <div className='expanded-filters'>
                    { getExpandedFilters() }
                    { getControlButtons() }
                  </div>
                  :
                  ''
              }
            </>
            :
            /** Mobile view. */
            <>
              <div className='mobile-filters' onClick={expandFilters}>
                Filter
                <picture>
                  <source srcSet={searchImgWEBP} type="image/webp"/>
                  <img src={searchImg} className="search-img" alt="Search." />
                </picture>
              </div>

              {
                openFilters?
                  <Modal onClose={expandFilters}>
                    <>
                      <div className='expanded-filters'> {getExpandedFilters()} </div>
                      { getControlButtons() }
                    </>
                  </Modal>
                  :
                  ''
              }
            </>
        }
      </div>

      <div className='filter-div-container current-applied-filters'>
        <h3 className='button-open-section'>Currently filtering by</h3>

        <div className={`current-filters ${filters.length > 0? 'filled-current-filters' : ''}`}>
          {
            filters.map((filter, index) => {
              return (
                <div className='current-filter-container'
                     key={`current-filter-${filter.toLowerCase()}`}
                >
                  <img src={filterImagesArr[filter as ValidFilters]}
                       alt={`Applied filter ${filter.toLowerCase()}`}
                  />
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
}

export default Filters;