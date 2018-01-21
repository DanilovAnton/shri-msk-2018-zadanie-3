import './meeting-info.scss';
import '../../fonts/fonts';

import ButtonEdit from '../button-edit/button-edit';

import React from 'react';
import {graphql} from 'react-apollo/index';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import moment from 'moment';

const meetingInfoQuery = gql`
  query InfoEvents($id: ID!){
    infoEvents(id: $id) {
      id
      title
      room
      dateStart
      dateEnd
    }
  }
`;

const getDate = (start, end) => {
  return moment(start).utc().locale('ru').format('DD MMMMM, kk:mm') + ' - ' + moment(end).utc().locale('ru').format('kk:mm');
};

const getCountUser = (count) => {
  count = count - 1;

  switch (Number(String(count).substr(String(count).length - 1, 1))) {
    case 1:
      return 'и ' + count + ' участник';
    case 2:
    case 3:
    case 4:
      return 'и ' + count + ' участника';
    default:
      return 'и ' + count + ' участников';
  }
};

const MeetingInfo = (props) => {
  const { top, id, data: { loading, error, infoEvents = [] } } = props;

  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  return (
    <div className='meeting-info' style={{top: (window.innerWidth <= 667 ? top + 'px' : '28px')}} >
      <div className='meeting-info__edit'>
        <ButtonEdit edit={`/meeting/${id}`} />
      </div>
      <h3 className='meeting-info__header'>
        {infoEvents[0].title}
      </h3>
      <div className='meeting-info__description'>
        <div className='meeting-info__date'>{getDate(infoEvents[0].dateStart, infoEvents[0].dateEnd)}</div>
        <div className='meeting-info__room'>{infoEvents[0].room}</div>
      </div>
      <UserEventsWithData event_id={infoEvents[0].id} />
    </div>
  );
};

const MeetingInfoWithData = graphql(meetingInfoQuery, {
  options: ({id}) => ({variables: {id}})
})(MeetingInfo);

const userEventsQuery = gql`
  query InfoEvents($event_id: Int!){
    userEvents(event_id: $event_id) {
      login
      avatarUrl
    }
    countUsers(event_id: $event_id)
  }
`;

const UserEvents = (props) => {
  const { data: { loading, error, userEvents = [], countUsers = 0 } } = props;

  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  return (
    <div className='meeting-info__user'>
      <div className='meeting-info__user-icon'>
        <div className='user-icon'>
          <img src={userEvents[0].avatarUrl} alt='Иконка пользователя' className='user-icon__img' />
        </div>
      </div>
      <div className='meeting-info__user-name'>
        {userEvents[0].login}
      </div>
      <div className='meeting-info__user-count'>
        {getCountUser(countUsers)}
      </div>
    </div>
  );
};

const UserEventsWithData = graphql(userEventsQuery, {
  options: ({event_id}) => ({variables: {event_id}})
})(UserEvents);

MeetingInfoWithData.propTypes = {
  id: PropTypes.number.isRequired
};

export default MeetingInfoWithData;
