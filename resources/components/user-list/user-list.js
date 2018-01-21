import './user-list.scss';

import UserIcon from '../user-icon/user-icon';

import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const UserList = (props) => {
  const { deleteParticipant, data: { loading, error, usersById = [] } } = props;

  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  return (
    <ul className='user-list'>
      {usersById.map(users => (
        <li key={users.id} className='user-list__item'>
          <div className='user-list__icon'>
            <UserIcon src={users.avatarUrl} />
          </div>
          <div className='user-list__username'>{users.login}</div>
          <a href='#' className='user-list__delete' onClick={deleteParticipant} data-user_id={users.id}>
            <svg className='user-list__delete-icon'version='1.1' width='16' height='16' viewBox='0 0 16 16' data-user_id={users.id}>
              <path data-user_id={users.id} d='M8.02081528,6.62132034 L5.19238816,3.79289322 C4.80186386,3.40236893 4.16869888,3.40236893 3.77817459,3.79289322 L3.77817459,3.79289322 L3.77817459,3.79289322 C3.3876503,4.18341751 3.3876503,4.81658249 3.77817459,5.20710678 L3.77817459,5.20710678 L6.60660172,8.03553391 L3.77817459,10.863961 C3.3876503,11.2544853 3.3876503,11.8876503 3.77817459,12.2781746 L3.77817459,12.2781746 L3.77817459,12.2781746 C4.16869888,12.6686989 4.80186386,12.6686989 5.19238816,12.2781746 L5.19238816,12.2781746 L8.02081528,9.44974747 L10.8492424,12.2781746 C11.2397667,12.6686989 11.8729317,12.6686989 12.263456,12.2781746 C12.6539803,11.8876503 12.6539803,11.2544853 12.263456,10.863961 L9.43502884,8.03553391 L12.263456,5.20710678 C12.6539803,4.81658249 12.6539803,4.18341751 12.263456,3.79289322 C11.8729317,3.40236893 11.2397667,3.40236893 10.8492424,3.79289322 L8.02081528,6.62132034 Z' />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
};

const usersListQuery = gql`
  query UsersListQuery($user_id: [ID]!) {
    usersById(id: $user_id) {
      id
      login
      avatarUrl
    }
  }
`;

const UserListWithData = graphql(usersListQuery, {
  options: ({ user_id }) => ({ variables: { user_id } })
})(UserList);

export default UserListWithData;
