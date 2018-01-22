import './rooms-list-mobile.scss';
import '../../fonts/fonts';

import React from 'react';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo/index';

const roomsIdToArray = (rooms) => {
  let arr = [];

  rooms.map(room => {
    arr.push(Number(room.id));
  });

  return arr;
};

const roomsListQuery = gql`
  query RoomsListQuery($floor: Int!, $date: String!){
    roomsByFloor(floor: $floor) {
      id
      title
      capacity
      floor
    }
    busyRoom(date: $date) {
      id
    }
  }
`;

class RoomsListMobile extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      data: []
    };
  }

  render () {
    const { hover, data: { loading, error, roomsByFloor = [], busyRoom = [] } } = this.props;
    const rooms = roomsIdToArray(busyRoom);

    if (loading) {
      return <p>Loading ...</p>;
    }
    if (error) {
      return <p>{error.message}</p>;
    }
    return (
      <ul className='rooms-list-mobile'>
        {roomsByFloor.map(room => {
          return (
            <li key={room.id} className={rooms.indexOf(Number(room.id)) > -1 ? 'rooms-list-mobile__item rooms-list-mobile__item_disabled' : 'rooms-list-mobile__item'} >
              <div className={room.id === hover ? 'rooms-list-mobile__title rooms-list-mobile__title_hover' : 'rooms-list-mobile__title'}>{room.title}</div>
            </li>
          );
        })}
      </ul>
    );
  }
}

const RoomsListMobileWithData = graphql(roomsListQuery, {
  options: ({floor, date}) => ({variables: {floor, date}, pollInterval: 5000})
})(RoomsListMobile);

export default RoomsListMobileWithData;
