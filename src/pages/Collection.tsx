import React from 'react';
import './Collection.css';

export interface ICollectionProps {}

const Collection: React.FunctionComponent<ICollectionProps> = (props) => {
  return (
    <main className="collection">
      <h2>Collection Page</h2>
    </main>
  );
}

export default Collection;