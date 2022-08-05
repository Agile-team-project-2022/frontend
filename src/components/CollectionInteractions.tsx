import React, {useEffect, useState} from 'react';
import './CollectionInteractions.css';

export interface ICollectionInteractionsProps {}

const CollectionInteractions: React.FunctionComponent<ICollectionInteractionsProps> = (props) => {
  // TODO: Hardcoded. Must be replaced with the endpoint. Check if it will be implemented in backend or will be pending.
  const [carePlants, setCarePlants] = useState<{id: number, imageFile: string}[]>([]);
  const [carePlantsPending, setCarePlantsPending] = useState<{id: number, imageFile: string}[]>([]);
  const [friends, setFriends] = useState<{id: number, imageFile: string}[]>([]);
  const [careFriendsPending, setFriendsPending] = useState<{id: number, imageFile: string}[]>([]);

  useEffect(() => {
    // TODO: Must be replaced with the endpoint.
    setCarePlants([
      {id: 1, imageFile: ''},
      {id: 2, imageFile: ''},
      {id: 3, imageFile: ''}
    ]);

    setCarePlantsPending([
      {id: 4, imageFile: ''},
      {id: 5, imageFile: ''},
    ]);

    setFriends([
      {id: 1, imageFile: ''},
      {id: 2, imageFile: ''},
      {id: 3, imageFile: ''}
    ]);

    setFriendsPending([
      {id: 4, imageFile: ''},
      {id: 5, imageFile: ''}
    ]);
  }, []);

  return (
    <div className="collection-interactions">
      <div className='mobile-section-container'>
        Pending
      </div>

      <div className='mobile-section-container'>
        I am an interaction! :D
      </div>
    </div>
  );
}

export default CollectionInteractions;