import './meeting-update.scss';
import '../../fonts/fonts';
import '../button/button';

import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const EventUpdate = (props) => {
  const handleUpdate = (event) => {
    event.preventDefault();

    if (props.id && props.title &&
      props.dateStart && props.dateEnd && props.roomId &&
      props.removeUsersId && props.addUsersId) {
      props.mutate({
        variables: {
          id: Number(props.id),
          title: props.title,
          dateStart: props.dateStart,
          dateEnd: props.dateEnd,
          roomId: Number(props.roomId),
          removeUsersId: props.removeUsersId,
          addUsersId: props.addUsersId
        }
      }).then(({ data }) => {
        props.history.push(`/${data.updateEvent.id}`);
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });
    }
  };

  return (
    <div className='meeting-delete'>
      <div className='meeting-delete__icon'>
        🙅🏻
      </div>
      <h3 className='meeting-delete__header'>
        Встреча будет <br /> изменена
      </h3>
      <div className='meeting-delete__button'>
        <a href='#' className='button button_color_gray' title='Отмена' onClick={props.handleClose}>
          Отмена
        </a>
        <a href='#' className='button button_color_gray' title='Изменить' onClick={handleUpdate}>
          Изменить
        </a>
      </div>
    </div>
  );
};

const eventUpdateQuery = gql`
  mutation EventUpdateQuery(
  $id: ID!, 
    $title: String, 
    $dateStart: Date, 
    $dateEnd: Date, 
    $roomId: ID!
    $removeUsersId: [ID]!
    $addUsersId: [ID]!
    ){
    updateEvent(
      id: $id
      input: {
        title: $title
        dateStart: $dateStart
        dateEnd: $dateEnd
      }
    ) {
      id
    }
    changeEventRoom(
      id: $id
      roomId: $roomId
    ) {
      id
    }
    removeUsersFromEvent(
      id: $id
      usersIds: $removeUsersId
    ) {
      id
    }
    addUsersToEvent(
      id: $id
      usersIds: $addUsersId
    ) {
      id
    }
  }
`;

const EventUpdateWithData = graphql(eventUpdateQuery, {
  options: ({id, title, dateStart, dateEnd}) => ({variables: { id, title, dateStart, dateEnd }})
})(EventUpdate);

EventUpdate.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  dateStart: PropTypes.string.isRequired,
  dateEnd: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  roomId: PropTypes.number.isRequired,
  removeUsersId: PropTypes.array.isRequired,
  addUsersId: PropTypes.array.isRequired
};

export default withRouter(EventUpdateWithData);
