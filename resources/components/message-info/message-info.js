import './message-info.scss';

import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import moment from 'moment/moment';

const getDate = (dateStart, dateEnd) => {
  return moment(dateStart).utc().locale('ru').format('DD MMMM') + ', ' +
    moment(dateStart).utc().format('kk:mm') + ' - ' +
    moment(dateEnd).utc().format('kk:mm');
};

const Room = (props) => {
  const { data: { loading, error, event = '' } } = props;

  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  if (event) {
    return (
      <div className='message-info'>
        <div className='message-info__icon'>
          🎉
        </div>
        <h3 className='message-info__header'>
          Встреча создана!
        </h3>
        <div className='message-info__date'>
          {getDate(event.dateStart, event.dateEnd)}
        </div>
        <div className='message-info__floor'>
          {event.room.title} &middot; {event.room.floor} этаж
        </div>
        <div className='message-info__button'>
          <Link to='/' className='button' title='Хорошо'>Хорошо</Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className='message-info message-info_delete'>
        <div className='message-info__icon'>
          🎉
        </div>
        <h3 className='message-info__header'>
          Встреча Удалена!
        </h3>
        <div className='message-info__button'>
          <Link to='/' className='button' title='Хорошо'>Хорошо</Link>
        </div>
      </div>
    );
  }
};

const eventQuery = gql`
  query  EventQuery($id: ID!){
    event(id: $id) {
      dateEnd
      dateStart
      room {
        title
        floor
      }
    }
  }
`;

const MessageWithData = graphql(eventQuery, {
  options: ({ id }) => ({ variables: { id } })
})(Room);

MessageWithData.propTypes = {
  id: PropTypes.number.isRequired
};

export default MessageWithData;
