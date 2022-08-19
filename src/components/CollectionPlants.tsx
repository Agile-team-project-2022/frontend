import React, {useContext, useState} from 'react';
import './CollectionPlants.css';
import CollectionCard from "./CollectionCard";
import {AppContext} from "../context";
import {CollectionView} from "./CollectionHeader";
import NewProfile from "./NewProfile";
import Modal from "./Modal";

export interface ICollectionPlantsProps {
  view: CollectionView,
  ownerId: string | number
}

const CollectionPlants: React.FunctionComponent<ICollectionPlantsProps> = ({view, ownerId}) => {
  /** TODO: Fetch plants from others instead of userData. */
  const {state: {userData: {plants, count: {totalPlants}}}} = useContext(AppContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="collection-plants">
      <h2>Collection of plants ({totalPlants})</h2>

      <div className='collection-cards-container'>
        {
          plants.map((item, index) => {
            return (
              <CollectionCard ownerId={ownerId} plant={item} key={`collection-card-${index}`} />
            );
          })
        }

        {view === CollectionView.OWNER? <div className='add-button' onClick={openModal}><div> </div><div> </div></div> : ''}
      </div>

      {
        modalIsOpen?
          <Modal onClose={closeModal}>
            <NewProfile onClose={closeModal} />
          </Modal>
          :
          ''
      }
    </div>
  );
}

export default CollectionPlants;