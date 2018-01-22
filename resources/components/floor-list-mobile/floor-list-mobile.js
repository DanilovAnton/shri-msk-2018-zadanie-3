import './floor-list-mobile.scss';
import '../../fonts/fonts';

import RoomsListMobile from '../rooms-list-mobile/rooms-list-mobile';

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

const FloorsListMobile = (props) => {
  const {date, hover, data: {loading, error, floors = []}} = props;

  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  return (
    <ul className='floor-list-mobile'>
      {floors.map(floor => (
        <li key={floor.floor} className='floor-list-mobile__item'>
          <h2 className='floor-list-mobile__title'>
            {floor.floor} этаж
          </h2>
          <RoomsListMobile date={date} floor={floor.floor} hover={hover} />
        </li>
      ))}
    </ul>
  );
};

const FloorsListMobileWithData = graphql(floorsListQuery)(FloorsListMobile);

export default FloorsListMobileWithData;
