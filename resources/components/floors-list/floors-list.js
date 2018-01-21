import './floors-list.scss';
import '../../fonts/fonts';

import RoomsList from '../rooms-list/rooms-list';

import React from 'react';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo/index';

const floorsListQuery = gql`
  query FloorsListQuery{
    floors {
      floor
    }
  }
`;

const FloorsList = (props) => {
  const {busy, hover, data: {loading, error, floors = []}} = props;

  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  return (
    <ul className='floors-list'>
      {floors.map(floor => (
        <li key={floor.floor} className='floors-list__item'>
          <h2 className='floors-list__title'>
            {floor.floor} этаж
          </h2>
          <RoomsList floor={floor.floor} busy={busy} hover={hover} />
        </li>
      ))}
    </ul>
  );
};

const FloorsListWithData = graphql(floorsListQuery)(FloorsList);

export default FloorsListWithData;
