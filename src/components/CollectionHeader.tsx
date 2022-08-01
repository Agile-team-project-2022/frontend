import React from 'react';
import './CollectionHeader.css';

export interface ICollectionHeaderProps {}

const CollectionHeader: React.FunctionComponent<ICollectionHeaderProps> = (props) => {
  return (
    <header className="collection-header collection-profile-header">
      <h2>Owner's Name (You)</h2>
    </header>
  );
}

export default CollectionHeader;