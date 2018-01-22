import './schedule-event.scss';
import '../../fonts/fonts';

import MeetingInfo from '../meeting-info/meeting-info';

import React from 'react';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo/index';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';

const getTimeline = (date, roomId, capacity) => {
  return [
    {time: '08:00', flag: true, event_id: -1, new_event_id: -1, date: date, room_id: roomId, capacity: capacity},
    {time: '08:15', flag: true, event_id: -1, new_event_id: -1, date: date, room_id: roomId, capacity: capacity},
    {time: '08:30', flag: true, event_id: -1, new_event_id: -1, date: date, room_id: roomId, capacity: capacity},
    {time: '08:45', flag: true, event_id: -1, new_event_id: -1, date: date, room_id: roomId, capacity: capacity},
    {time: '09:00', flag: true, event_id: -1, new_event_id: -2, date: date, room_id: roomId, capacity: capacity},
    {time: '09:15', flag: true, event_id: -2, new_event_id: -2, date: date, room_id: roomId, capacity: capacity},
    {time: '09:30', flag: true, event_id: -2, new_event_id: -2, date: date, room_id: roomId, capacity: capacity},
    {time: '09:45', flag: true, event_id: -2, new_event_id: -2, date: date, room_id: roomId, capacity: capacity},
    {time: '10:00', flag: true, event_id: -2, new_event_id: -3, date: date, room_id: roomId, capacity: capacity},
    {time: '10:15', flag: true, event_id: -3, new_event_id: -3, date: date, room_id: roomId, capacity: capacity},
    {time: '10:30', flag: true, event_id: -3, new_event_id: -3, date: date, room_id: roomId, capacity: capacity},
    {time: '10:45', flag: true, event_id: -3, new_event_id: -3, date: date, room_id: roomId, capacity: capacity},
    {time: '11:00', flag: true, event_id: -3, new_event_id: -4, date: date, room_id: roomId, capacity: capacity},
    {time: '11:15', flag: true, event_id: -4, new_event_id: -4, date: date, room_id: roomId, capacity: capacity},
    {time: '11:30', flag: true, event_id: -4, new_event_id: -4, date: date, room_id: roomId, capacity: capacity},
    {time: '11:45', flag: true, event_id: -4, new_event_id: -4, date: date, room_id: roomId, capacity: capacity},
    {time: '12:00', flag: true, event_id: -4, new_event_id: -5, date: date, room_id: roomId, capacity: capacity},
    {time: '12:15', flag: true, event_id: -5, new_event_id: -5, date: date, room_id: roomId, capacity: capacity},
    {time: '12:30', flag: true, event_id: -5, new_event_id: -5, date: date, room_id: roomId, capacity: capacity},
    {time: '12:45', flag: true, event_id: -5, new_event_id: -5, date: date, room_id: roomId, capacity: capacity},
    {time: '13:00', flag: true, event_id: -5, new_event_id: -6, date: date, room_id: roomId, capacity: capacity},
    {time: '13:15', flag: true, event_id: -6, new_event_id: -6, date: date, room_id: roomId, capacity: capacity},
    {time: '13:30', flag: true, event_id: -6, new_event_id: -6, date: date, room_id: roomId, capacity: capacity},
    {time: '13:45', flag: true, event_id: -6, new_event_id: -6, date: date, room_id: roomId, capacity: capacity},
    {time: '14:00', flag: true, event_id: -6, new_event_id: -7, date: date, room_id: roomId, capacity: capacity},
    {time: '14:15', flag: true, event_id: -7, new_event_id: -7, date: date, room_id: roomId, capacity: capacity},
    {time: '14:30', flag: true, event_id: -7, new_event_id: -7, date: date, room_id: roomId, capacity: capacity},
    {time: '14:45', flag: true, event_id: -7, new_event_id: -7, date: date, room_id: roomId, capacity: capacity},
    {time: '15:00', flag: true, event_id: -7, new_event_id: -8, date: date, room_id: roomId, capacity: capacity},
    {time: '15:15', flag: true, event_id: -8, new_event_id: -8, date: date, room_id: roomId, capacity: capacity},
    {time: '15:30', flag: true, event_id: -8, new_event_id: -8, date: date, room_id: roomId, capacity: capacity},
    {time: '15:45', flag: true, event_id: -8, new_event_id: -8, date: date, room_id: roomId, capacity: capacity},
    {time: '16:00', flag: true, event_id: -8, new_event_id: -9, date: date, room_id: roomId, capacity: capacity},
    {time: '16:15', flag: true, event_id: -9, new_event_id: -9, date: date, room_id: roomId, capacity: capacity},
    {time: '16:30', flag: true, event_id: -9, new_event_id: -9, date: date, room_id: roomId, capacity: capacity},
    {time: '16:45', flag: true, event_id: -9, new_event_id: -9, date: date, room_id: roomId, capacity: capacity},
    {time: '17:00', flag: true, event_id: -9, new_event_id: -10, date: date, room_id: roomId, capacity: capacity},
    {time: '17:15', flag: true, event_id: -10, new_event_id: -10, date: date, room_id: roomId, capacity: capacity},
    {time: '17:30', flag: true, event_id: -10, new_event_id: -10, date: date, room_id: roomId, capacity: capacity},
    {time: '17:45', flag: true, event_id: -10, new_event_id: -10, date: date, room_id: roomId, capacity: capacity},
    {time: '18:00', flag: true, event_id: -10, new_event_id: -11, date: date, room_id: roomId, capacity: capacity},
    {time: '18:15', flag: true, event_id: -11, new_event_id: -11, date: date, room_id: roomId, capacity: capacity},
    {time: '18:30', flag: true, event_id: -11, new_event_id: -11, date: date, room_id: roomId, capacity: capacity},
    {time: '18:45', flag: true, event_id: -11, new_event_id: -11, date: date, room_id: roomId, capacity: capacity},
    {time: '19:00', flag: true, event_id: -11, new_event_id: -12, date: date, room_id: roomId, capacity: capacity},
    {time: '19:15', flag: true, event_id: -12, new_event_id: -12, date: date, room_id: roomId, capacity: capacity},
    {time: '19:30', flag: true, event_id: -12, new_event_id: -12, date: date, room_id: roomId, capacity: capacity},
    {time: '19:45', flag: true, event_id: -12, new_event_id: -12, date: date, room_id: roomId, capacity: capacity},
    {time: '20:00', flag: true, event_id: -12, new_event_id: -13, date: date, room_id: roomId, capacity: capacity},
    {time: '20:15', flag: true, event_id: -13, new_event_id: -13, date: date, room_id: roomId, capacity: capacity},
    {time: '20:30', flag: true, event_id: -13, new_event_id: -13, date: date, room_id: roomId, capacity: capacity},
    {time: '20:45', flag: true, event_id: -13, new_event_id: -13, date: date, room_id: roomId, capacity: capacity},
    {time: '21:00', flag: true, event_id: -13, new_event_id: -14, date: date, room_id: roomId, capacity: capacity},
    {time: '21:15', flag: true, event_id: -14, new_event_id: -14, date: date, room_id: roomId, capacity: capacity},
    {time: '21:30', flag: true, event_id: -14, new_event_id: -14, date: date, room_id: roomId, capacity: capacity},
    {time: '21:45', flag: true, event_id: -14, new_event_id: -14, date: date, room_id: roomId, capacity: capacity},
    {time: '22:00', flag: true, event_id: -14, new_event_id: -15, date: date, room_id: roomId, capacity: capacity},
    {time: '22:15', flag: true, event_id: -15, new_event_id: -15, date: date, room_id: roomId, capacity: capacity},
    {time: '22:30', flag: true, event_id: -15, new_event_id: -15, date: date, room_id: roomId, capacity: capacity},
    {time: '22:45', flag: true, event_id: -15, new_event_id: -15, date: date, room_id: roomId, capacity: capacity},
    {time: '23:00', flag: true, event_id: -15, new_event_id: -16, date: date, room_id: roomId, capacity: capacity}
  ];
};

const setReservationTimeline = (timeLine, start, end, eventId) => {
  for (let i = 0; i < timeLine.length; i++) {
    if (start <= timeLine[i].time && end >= timeLine[i].time) {
      if (i === 0) {
        timeLine[i].event_id = eventId;
        timeLine[i].new_event_id = eventId;
      } else if (timeLine[i].time === '23:00') {
        timeLine[i].event_id = eventId;
        timeLine[i].new_event_id = eventId;
      } else if (end === timeLine[i].time) {
        timeLine[i].event_id = eventId;
      } else if (timeLine[i - 1].new_event_id === eventId) {
        timeLine[i].event_id = eventId;
        timeLine[i].new_event_id = eventId;
      } else {
        timeLine[i].new_event_id = eventId;
      }
    }
    timeLine[i].time_end = '';
  }

  return timeLine;
};

const calcStyle = (timeLine) => {
  let timeToStyle = {'00': 0, '15': 1, '30': 2, '45': 3};

  for (let i = 0, j = 0; i < timeLine.length - 1; i++) {
    while (timeLine[i].event_id === timeLine[i].new_event_id && i < timeLine.length - 1) {
      i++;
      timeLine[i].flag = false;
    }
    if (i !== timeLine.length - 1) timeLine[i].flag = true;
    else if (i === timeLine.length - 1 && timeLine[i].new_event_id > 0) timeLine[i].flag = true;

    if (timeLine[i].event_id !== timeLine[i].new_event_id) timeLine[i].event_id = timeLine[i].new_event_id;
    else timeLine[i].event_id = '';
    timeLine[j].left = 0;
    timeLine[j].width = (Number(timeLine[i].time.substr(0, 2)) - Number(timeLine[j].time.substr(0, 2))) * 6.25 + Number(timeToStyle[timeLine[i].time.substr(3, 2)] - timeToStyle[timeLine[j].time.substr(3, 2)]) * 1.5625;
    timeLine[j].time_end = timeLine[i].time;
    j = i;
    i--;
  }

  return timeLine;
};

const scheduleEventQuery = gql`
  query ScheduleEventsQuery($room_id: Int!, $date: String!){
    scheduleEvents(room_id: $room_id, date: $date) {
      room_id
      capacity
      floor
      event_id
      start
      end
      date
    }
  }
`;

class ScheduleEvent extends React.Component {
  constructor (props) {
    super(props);

    this.busy = this.busy.bind(this);
    this.hover = this.hover.bind(this);
    this.blur = this.blur.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    const {room_id, capacity, date, data: {scheduleEvents = []}} = nextProps;
    let arr = [];

    arr = getTimeline(date, room_id, capacity);

    scheduleEvents.map(event => {
      arr = setReservationTimeline(arr, event.start.substr(0, 5), event.end.substr(0, 5), event.event_id);
    });

    arr = calcStyle(arr);

    this.busy(arr);
  }

  busy (arr) {
    let flag = 0;

    arr.map(time => {
      if (time.flag && time.event_id < 0) {
        flag = '-1';
      } else if (time.flag && time.event_id > 0 && flag === 0) {
        flag = time.room_id;
      }
    });

    this.props.busy(flag);
  }

  hover (event) {
    this.props.hover(event.target.dataset.room_id);
  }

  blur () {
    this.props.hover('');
  }

  render () {
    const {capacity, room_id, date, data: {loading, error, scheduleEvents = []}} = this.props;
    let timeLine = getTimeline(date, room_id, capacity);

    scheduleEvents.map(event => {
      timeLine = setReservationTimeline(timeLine, event.start.substr(0, 5), event.end.substr(0, 5), event.event_id);
    });

    timeLine = calcStyle(timeLine);

    if (loading) {
      return <p>Loading ...</p>;
    }
    if (error) {
      return <p>{error.message}</p>;
    }
    return (
      <div>
        <div className='schedule-event__char schedule-event__char_busy' style={{width: '3.125%', left: 0}} />
        {timeLine.map(time => {
          if (time.flag && time.event_id < 0) {
            return (
              <Link key={time.time} to={`meeting/${time.date}/${time.time}/${time.time_end}/${time.room_id}/${time.capacity}`}
                className='schedule-event__char schedule-event__char_free'
                title='Создать встречу'
                style={{width: time.width + '%', left: time.left + '%'}}
                data-room_id={time.room_id}
                onMouseEnter={this.hover}
                onMouseLeave={this.blur}
              />
            );
          } else if (time.flag && time.event_id > 0) {
            return (
              <Event key={time.time} time={time} hover={this.hover} blur={this.blur} />
            );
          }
        })}
        <div className='schedule-event__char schedule-event__char_busy' style={{width: '3.125%', left: 0}} />
      </div>
    );
  }
}

class Event extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      info: false,
      top: 0
    };

    this.handelClick = this.handelClick.bind(this);
    this.infoHide = this.infoHide.bind(this);
  }

  handelClick (event) {
    let top = event.target.getBoundingClientRect().top + 60;

    this.setState({info: !this.state.info, top: top});
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.infoHide, false);
  }

  componentWillMount () {
    document.addEventListener('click', this.infoHide, false);
  }

  infoHide (event) {
    const domNode = ReactDOM.findDOMNode(this);

    if ((!domNode || !domNode.contains(event.target))) {
      this.setState({info: false});
    }
  }

  render () {
    const { time, hover, blur } = this.props;

    return (
      <div data-room_id={time.room_id}
        className='schedule-event__char schedule-event__char_busy'
        style={{width: time.width + '%', left: time.left + '%'}}
        onMouseEnter={hover}
        onMouseLeave={blur}
        onClick={this.handelClick}
      >
        {this.state.info && <MeetingInfo id={time.event_id} top={this.state.top} />}
      </div>
    );
  }
}

const ScheduleEventByFloorWithData = graphql(scheduleEventQuery, {
  options: ({room_id, date}) => ({variables: {room_id, date}, pollInterval: 5000})
})(ScheduleEvent);

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

const RoomsList = (props) => {
  const {hover, busy, date, data: {loading, error, roomsByFloor = []}} = props;

  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  return (
    <ul className='schedule-event__rooms'>
      {roomsByFloor.map(room => (
        <li key={room.id} className='schedule-event__room'>
          <ScheduleEventByFloorWithData date={date} room_id={room.id} hover={hover} busy={busy} capacity={room.capacity} />
        </li>
      ))}
    </ul>
  );
};

const RoomsListWithData = graphql(roomsListQuery, {
  options: ({floor}) => ({variables: {floor}})
})(RoomsList);

const floorsListQuery = gql`
  query FloorsListQuery{
    floors {
      floor
    }
  }
`;

const FloorsList = (props) => {
  const {hover, busy, date, data: {loading, error, floors = []}} = props;

  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  return (
    <ul className='schedule-event' >
      {floors.map(floor => (
        <li key={floor.floor} className='schedule-event__floor'>
          <RoomsListWithData floor={floor.floor} date={date} hover={hover} busy={busy} />
        </li>
        ))}
    </ul>
  );
};

const ScheduleEventsWithData = graphql(floorsListQuery)(FloorsList);

export default ScheduleEventsWithData;
