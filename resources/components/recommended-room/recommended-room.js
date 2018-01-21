import './recommended-room.scss';
import '../../fonts/fonts';

import InputLabel from '../input-label/input-label';

import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import moment from 'moment';
import InputText from '../input-text/input-text';

const getTime = (date) => {
  return moment(date, 'YYYY-MM-DD HH:mm:ss.SSS Z').utc().format('kk:mm');
};

const getDate = (date) => {
  return moment(date, 'YYYY-MM-DD HH:mm:ss.SSS Z').utc().format('YYYY-MM-DD');
};

const createDateTime = (date, time) => {
  return moment(new Date(date + ' ' + time)).format('YYYY-MM-DDTkk:mm') + ':00.000Z';
};

class RoomsList extends React.Component {
  render () {
    const { setRoom, data: { loading, error, getRecommendation = [] } } = this.props;

    if (loading) {
      return <p>Loading ...</p>;
    }
    if (error) {
      return <p>{error.message}</p>;
    }
    return (
      <ul className='recommended-room__list' id='room'>
        {getRecommendation.map(room => (
          <li key={room.id} className='recommended-room__item' >
            <span className='recommended-room__time'>
              {getTime(room.dateStart) + ' - ' + getTime(room.dateEnd)}
            </span>
            <span className='recommended-room__name'>
              {room.title}
            </span>
            <span className='recommended-room__floor'>
              {room.floor} этаж
          </span>
            <a href='#' onClick={setRoom}
              data-room_id={room.id}
              data-start={getTime(room.dateStart)}
              data-end={getTime(room.dateEnd)}
              data-date={getDate(room.dateStart)}
              className='recommended-room__link'
            />
          </li>
        ))}
      </ul>
    );
  }
}

const roomsListQuery = gql`
  query RoomsListQuery($capacityIn: Int!, $dateStartIn: Date!, $dateEndIn: Date!, $users: [Int!]) {
    getRecommendation(
      capacityIn: $capacityIn, 
      dateStartIn: $dateStartIn, 
      dateEndIn: $dateEndIn
      users: $users
    ) {
      id
      title
      floor
      dateStart
      dateEnd
    }
  }
`;

const RoomsListWithData = graphql(roomsListQuery, {
  options: ({capacityIn, dateStartIn, dateEndIn, users}) => ({variables: {capacityIn, dateStartIn, dateEndIn, users}})
})(RoomsList);

const Room = (props) => {
  const { dateStartIn, dateEndIn, setClear, data: { loading, error, room = '' } } = props;

  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  return (
    <div className='recommended-room__item recommended-room_active'>
      <span className='recommended-room__time'>
        {getTime(dateStartIn) + ' - ' + getTime(dateEndIn)}
      </span>
      <span className='recommended-room__name'>
        {room.title}
      </span>
      <span className='recommended-room__floor'>
        {room.floor} этаж
      </span>
      <a href='#' className='recommended-room__close' onClick={setClear}>
        <svg className='recommended-room__close-icon' version='1.1' width='16' height='16' viewBox='0 0 16 16'>
          <path d='M8.02081528,6.62132034 L5.19238816,3.79289322 C4.80186386,3.40236893 4.16869888,3.40236893 3.77817459,3.79289322 L3.77817459,3.79289322 L3.77817459,3.79289322 C3.3876503,4.18341751 3.3876503,4.81658249 3.77817459,5.20710678 L3.77817459,5.20710678 L6.60660172,8.03553391 L3.77817459,10.863961 C3.3876503,11.2544853 3.3876503,11.8876503 3.77817459,12.2781746 L3.77817459,12.2781746 L3.77817459,12.2781746 C4.16869888,12.6686989 4.80186386,12.6686989 5.19238816,12.2781746 L5.19238816,12.2781746 L8.02081528,9.44974747 L10.8492424,12.2781746 C11.2397667,12.6686989 11.8729317,12.6686989 12.263456,12.2781746 C12.6539803,11.8876503 12.6539803,11.2544853 12.263456,10.863961 L9.43502884,8.03553391 L12.263456,5.20710678 C12.6539803,4.81658249 12.6539803,4.18341751 12.263456,3.79289322 C11.8729317,3.40236893 11.2397667,3.40236893 10.8492424,3.79289322 L8.02081528,6.62132034 Z' />
        </svg>
      </a>
    </div>
  );
};

const roomQuery = gql`
  query RoomsListQuery($room_id: ID!) {
    room(id: $room_id) {
      id
      title
      floor
    }
  }
`;

const RoomWithData = graphql(roomQuery, {
  options: ({ room_id }) => ({ variables: { room_id } })
})(Room);

class RecommendedRoom extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      data: (props.id ? props.id : ''),
      dateStart: '',
      dateEnd: ''
    };

    this.setRoom = this.setRoom.bind(this);
    this.setClear = this.setClear.bind(this);
  }

  setRoom (event) {
    event.preventDefault();

    const id = event.target.dataset.room_id;
    const start = event.target.dataset.start;
    const end = event.target.dataset.end;
    const date = event.target.dataset.date;

    this.setState({data: id, dateStart: createDateTime(date, start), dateEnd: createDateTime(date, end)}, () => {
      this.props.setRoom(id, start, end, date);
    });
  }

  setClear (event) {
    event.preventDefault();

    this.setState({data: ''}, () => {
      this.props.setRoom('');
    });
  }

  componentWillUpdate (nextProps) {
    if (this.state.dateStart !== nextProps.dateStart ||
      this.state.dateEnd !== nextProps.dateEnd ||
      nextProps.userCount !== this.props.userCount) {
      if (
        nextProps.userCount !== this.props.userCount ||
        nextProps.dateStart !== this.props.dateStart ||
        nextProps.dateEnd !== this.props.dateEnd
      ) {
        this.setState({data: '', dateStart: '', dateEnd: ''}, () => {
          this.props.setRoom('');
        });
      }
    }
  }

  render () {
    return (
      <div className='recommended-room'>
        <InputLabel label='Рекомендованные переговорки' from='room' />
        {
          (this.state.data === '' && this.props.userCount > 0 && this.props.dateStart !== '' && this.props.dateEnd !== '') &&
          <RoomsListWithData
            setRoom={this.setRoom}
            capacityIn={this.props.userCount}
            dateStartIn={this.props.dateStart}
            dateEndIn={this.props.dateEnd}
            users={this.props.users}
          />
        }
        {
          (this.state.data !== '' && this.props.userCount > 0 && this.props.dateStart !== '' && this.props.dateEnd !== '') &&
          <RoomWithData
            room_id={this.state.data}
            setClear={this.setClear}
            dateStartIn={this.props.dateStart}
            dateEndIn={this.props.dateEnd}
          />
        }
      </div>
    );
  }
}

RecommendedRoom.propTypes = {
  userCount: PropTypes.number.isRequired,
  users: PropTypes.array.isRequired,
  dateStart: PropTypes.string.isRequired,
  dateEnd: PropTypes.string.isRequired,
  setRoom: PropTypes.func.isRequired,
  id: PropTypes.number
};

InputText.defaultProps = {
  id: ''
};

export default RecommendedRoom;
