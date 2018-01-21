import './rooms-list-mobile.scss';
import '../../fonts/fonts';

import React from 'react';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo/index';

const roomsListQuery = gql`
  query RoomsListQuery($floor: Int!){
    roomsByFloor(floor: $floor) {
      id
      title
      capacity
      floor
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
    const { busy, hover, data: { loading, error, roomsByFloor = [] } } = this.props;

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
            <li key={room.id} className={busy === room.id ? 'rooms-list-mobile__item rooms-list-mobile__item_disabled' : 'rooms-list-mobile__item'} >
              <div className={room.id === hover ? 'rooms-list-mobile__title rooms-list-mobile__title_hover' : 'rooms-list-mobile__title'}>{room.title}</div>
            </li>
          );
        })}
      </ul>
    );
  }
}

const RoomsListMobileWithData = graphql(roomsListQuery, {
  options: ({floor}) => ({variables: {floor}})
})(RoomsListMobile);

export default RoomsListMobileWithData;
