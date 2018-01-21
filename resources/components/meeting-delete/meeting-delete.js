import './meeting-delete.scss';
import '../../fonts/fonts';
import '../button/button';

import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const EventDelete = (props) => {
  const handleDelete = (event) => {
    event.preventDefault();

    if (props.id) {
      props.mutate({
        variables: {
          id: Number(props.id)
        }
      }).then(({ data }) => {
        props.history.push(`/${data.removeEvent.id}`);
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
        Встреча будет <br /> удалена безвозвратно
      </h3>
      <div className='meeting-delete__button'>
        <a href='#' className='button button_color_gray' title='Отмена' onClick={props.handleClose}>
          Отмена
        </a>
        <a href='#' className='button button_color_gray' title='Удалить' onClick={handleDelete}>
          Удалить
        </a>
      </div>
    </div>
  );
};

const eventDeleteQuery = gql`
  mutation EventDeleteQuery($id: ID!){
    removeEvent(id: $id) {
      id
    }
  }
`;

const EventDeleteWithData = graphql(eventDeleteQuery, {
  options: ({id}) => ({variables: { id }})
})(EventDelete);

EventDelete.propTypes = {
  id: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default withRouter(EventDeleteWithData);
