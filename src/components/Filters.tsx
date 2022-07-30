import React, {useEffect, useState} from 'react';
import './Filters.css';
import 'react-lazy-load-image-component/src/effects/blur.css';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import searchImg from "../assets/search.png";
import treeImg from "../assets/logo.svg";
import sunImg from '../assets/category-sun.png';
import shadowImg from '../assets/category-shadow.png';
import Modal from "./Modal";
import useWindowSize, {DeviceTypes} from "../hooks/useWindowSize";
import axios from "axios";

export interface IFiltersProps {}

enum ValidFilters {
  SUN = 'SUN',
  SHADOW = 'SHADOW',
  FLOWER = 'FLOWER',
  TREE = 'TREE',
  FOOD = 'FOOD',
  EVERGREEN = 'EVERGREEN',
  AQUATIC = 'AQUATIC',
  PLANT = 'PLANT',
  OTHER = 'OTHER'
}

// TODO: Set all the filters (categories) correct images.
const filterImagesArr = {
  [ValidFilters.SUN] : sunImg,
  [ValidFilters.SHADOW] :  shadowImg,
  [ValidFilters.FLOWER] :  treeImg,
  [ValidFilters.TREE] :  treeImg,
  [ValidFilters.FOOD] :  treeImg,
  [ValidFilters.EVERGREEN] :  treeImg,
  [ValidFilters.AQUATIC] :  treeImg,
  [ValidFilters.PLANT] :  treeImg,
  [ValidFilters.OTHER] :  treeImg
};

const Filters: React.FunctionComponent<IFiltersProps> = (props) => {
  const [openFilters, setOpenFilters] = useState(false);
  const [filters, setFilters] = useState<ValidFilters[]>([]);
  const [preselectedFilters, setPreselectedFilters] = useState<ValidFilters[]>([]);
  const {deviceType} = useWindowSize();

  useEffect(() => {
    fetchFilters();
  }, []);

  /** Expands the section containing the options to select from. */
  const expandFilters = () => {
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
              {/* TODO: Add the correct categories img assets. */}
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
  };

  /** Applies all the selected filters. */
  const applyFilters = () => {
    setOpenFilters(false);
    setFilters(preselectedFilters);
  };

  /** TODO: Queries the database. */
  const fetchFilters = () => {
    const url = `${ process.env.REACT_APP_BASE_URL || '' }plant-category?page=1&count=10`;

    axios.get(url)
      .then((response) => {
        console.log(response.data);
      })
      .catch((e) => console.log(e));
  };

  /** Creates new filters. NOTE: By now, only used to initialize the 8 valid filters in the DB. */
  const createFilters = () => {
    const url = `${ process.env.REACT_APP_BASE_URL || '' }plant-category`;

    /*
    TODO: Uncomment and use only if the 'create new filters' functionality must be implemented for users.
    Object.keys(ValidFilters).forEach((filter, index) => {
      const data = {name: filter.toLowerCase()};
      axios.post(url, data)
        .then((response) => {
          console.log(`Successfully created filter category in Database: ${data.name}`);
        })
        .catch((e) => console.log(e));
    });
    */
  }

  return (
    <div className='filters-section-container'>
      <div className='filter-div-container filters'>
        {
          /** Tablet and Desktop views. */
          deviceType !== DeviceTypes.MOBILE?
            <>
              <h3 className='button-open-section' onClick={() => expandFilters()}>
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
              <div className='mobile-filters' onClick={() => expandFilters()}>
                Filter
                {/* TODO: Add the correct search img asset. */}
                <img src={searchImg} className="search-img" alt="Search." />
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
                  {/* TODO: Use correct images. */}
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