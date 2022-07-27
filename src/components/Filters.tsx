import React, {useState} from 'react';
import './Filters.css';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import searchImg from "../assets/logo.svg";
import treeImg from "../assets/logo.svg";
import sunImg from '../assets/settings.png';
import evergreenImg from '../assets/help.png';
import Modal from "./Modal";
import useWindowSize, {DeviceTypes} from "../hooks/useWindowSize";

export interface IFiltersProps {}

// TODO: Set all the filters (categories).
enum ValidFilters {
  SUN = 'SUN',
  EVERGREEN = 'EVERGREEN',
  TREE = 'TREE',
}

const filterImagesArr = {
  [ValidFilters.SUN] : sunImg,
  [ValidFilters.EVERGREEN] :  evergreenImg,
  [ValidFilters.TREE] :  treeImg
};

const Filters: React.FunctionComponent<IFiltersProps> = (props) => {
  const [openFilters, setOpenFilters] = useState(false);
  const [filters, setFilters] = useState<ValidFilters[]>([]);
  const {deviceType} = useWindowSize();

  /** Expands the section containing the options to select from. */
  const expandFilters = () => {
    setOpenFilters(prevState => !prevState);
  };

  /** Returns the option filters to select from. */
  const getExpandedFilters = () => {
    return (
      Object.keys(ValidFilters).map((filter, index) => {
        return (
          <div className='filter-item-container'
               key={`filter-item-${filter.toLowerCase()}`}
               onClick={(e) => selectFilter(e, filter as ValidFilters)}
          >
            <div className='filter-img-container'>
              {/* TODO: Add the correct categories img assets. */}
              <LazyLoadImage src={filterImagesArr[filter as ValidFilters]}
                             alt={`Category ${filter.toLowerCase()}`}
              />
            </div>
            <p> {filter.charAt(0) + filter.substring(1).toLowerCase()} </p>
          </div>
        );
      })
    );
  };

  /** Applies or removes a filter based on its previous state. */
  const selectFilter = (event: React.MouseEvent<HTMLDivElement>, filter: ValidFilters) => {
    event.stopPropagation();

    // Deselects the filter if it is already marked.
    if(filters.includes(filter)) {
      const index = filters.indexOf(filter);
      setFilters(prevState => {
        return [
          ...prevState.slice(0, index),
          ...prevState.slice(index + 1)
        ]
      });
    } else {
      // Selects the filter.
      setFilters(prevState => {
        return [
          ...prevState,
          filter
        ]
      });
    }
  };

  return (
    <div className='filters-section-container'>
      <div className='filter-div-container filters'
           onClick={() => expandFilters()}
      >
        <h3 className='button-open-section'>Filter by category</h3>

        <div className='mobile-filters'>
          Filter
          {/* TODO: Add the correct search img asset. */}
          <img src={searchImg} className="search-img" alt="Search." />
        </div>

        {
          // Tablet and Desktop views.
          openFilters && deviceType !== DeviceTypes.MOBILE?
            <div className='expanded-filters'>
              { getExpandedFilters() }

              <div className='filter-buttons'>
                <button className='button-action'> Clear </button>
                <button className='button-action'> Apply </button>
              </div>
            </div>
            :
            ''
        }
      </div>

      <div className='filter-div-container current-applied-filters'>
        <h3 className='button-open-section'>Currently filtering by</h3>

        <div className='current-filters'>
          {
            filters.map((filter, index) => {
              return (
                <div className='current-filter-container'
                     key={`current-filter-${filter.toLowerCase()}`}
                >
                  {/* TODO: Use correct images. */}
                  <LazyLoadImage src={filterImagesArr[filter as ValidFilters]}
                                 alt={`Applied filter ${filter.toLowerCase()}`}
                  />
                </div>
              );
            })
          }
        </div>
      </div>

      {
        deviceType === DeviceTypes.MOBILE && openFilters?
          <Modal onClose={expandFilters}>
            <>
              <div className='expanded-filters'> {getExpandedFilters()} </div>

              <div className='filter-buttons'>
                <button className='button-action'> Clear </button>
                <button className='button-action'> Apply </button>
              </div>
            </>
          </Modal>
          :
          ''
      }
    </div>
  );
}

export default Filters;