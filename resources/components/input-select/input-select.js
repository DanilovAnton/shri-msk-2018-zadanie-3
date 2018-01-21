import './input-select.scss';
import '../input-group/input-group';
import '../../fonts/fonts';

import InputLabel from '../input-label/input-label';
import UserIcon from '../user-icon/user-icon';

import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import ReactDOM from 'react-dom';

const UsersList = (props) => {
  const { inputLogin, addParticipant, userListSetUsername, data: { loading, error, users = [] } } = props;

  const handleClick = (event) => {
    addParticipant(event);
    userListSetUsername(event);
  };

  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  return (
    <ul className='input-select__user-list'>
      {users.map(users => (

        <li key={users.id}
          className={'input-select__user-item' + (users.login.toLowerCase().search(inputLogin.toLowerCase()) !== -1 && inputLogin !== '' ? ' input-select__user-item_active' : '')}
        >
          <a href='#' onClick={handleClick}
            data-user_id={users.id}
            data-login={users.login}
            className='input-select__user'
          />
          <UserIcon src={users.avatarUrl} />
          <span className='input-select__username'>
            {users.login}
          </span>
          <span className='input-select__user-floor'>
            {users.homeFloor} этаж
          </span>
        </li>
      ))}
    </ul>
  );
};

const usersListQuery = gql`
  query UsersListQuery {
    users {
      id
      login
      homeFloor
      avatarUrl
    }
  }
`;

const UsersListWithData = graphql(usersListQuery)(UsersList);

const Arrow = (props) => {
  const {showHide} = props;

  Arrow.propTypes = {
    showHide: PropTypes.func
  };

  return (
    <span className='input-select__arrow' onClick={showHide}>
      <svg className='input-select__arrow-icon' version='1.1' viewBox='0 0 1000 1000'>
        <path d='M761.5,180.8L447,499.5l314.5,318.7c9.7,9.7,17,20.8,21.9,33.3c4.9,12.5,7.3,25.2,7.3,38c0,12.8-2.4,25.3-7.3,37.5c-4.9,12.1-12.1,23.1-21.9,32.8C742,979.9,718.8,990,691.7,990c-27.1,0-50.3-10.1-69.8-30.2L241.8,576.5c-9.7-9.7-17.4-21.3-22.9-34.9c-5.6-13.5-8.7-27.3-9.4-41.1c-0.7-13.9,1-27.2,5.2-40.1c4.2-12.8,11.1-23.4,20.8-31.8L621.9,39.2C641.4,19.7,664.6,10,691.7,10c27.1,0,50.3,9.7,69.8,29.2c9.7,9.7,17,20.8,21.9,33.3c4.9,12.5,7.3,25.2,7.3,38c0,12.8-2.4,25.3-7.3,37.5C778.5,160.1,771.2,171.1,761.5,180.8L761.5,180.8z' />
      </svg>
    </span>
  );
};

class InputSelect extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      show: false,
      search: ''
    };

    this.searchUser = this.searchUser.bind(this);
    this.userListShow = this.userListShow.bind(this);
    this.userListShowHide = this.userListShowHide.bind(this);
    this.userListHide = this.userListHide.bind(this);
    this.userListSetUsername = this.userListSetUsername.bind(this);
  }

  userListSetUsername (event) {
    this.setState({search: event.target.dataset.login, show: false});
  }

  searchUser (event) {
    this.setState({search: event.target.value.substr(0, 100)});
  }

  userListShow () {
    this.setState({show: true});
  }

  userListShowHide () {
    this.setState({show: !this.state.show});
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.userListHide, false);
  }

  componentWillMount () {
    document.addEventListener('click', this.userListHide, false);
  }

  userListHide (event) {
    const domNode = ReactDOM.findDOMNode(this);

    if ((!domNode || !domNode.contains(event.target))) {
      this.setState({show: false});
    }
  }

  render () {
    const { label, placeholder, addParticipant } = this.props;

    return (
      <div className='input-group'>
        <InputLabel label={label} from='user' />
        <div className='input-select'>
          <input
            id='user'
            type='text'
            className='input-select__field'
            placeholder={placeholder}
            value={this.state.search}
            onChange={this.searchUser}
            onFocus={this.userListShow}
          />
          { this.state.show && <Arrow show={this.userListShowHide} /> }
          {
            this.state.show &&
            <UsersListWithData
              inputLogin={this.state.search}
              addParticipant={addParticipant}
              userListSetUsername={this.userListSetUsername}
            />
          }
        </div>
      </div>
    );
  }
}

InputSelect.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  addParticipant: PropTypes.func.isRequired
};

export default InputSelect;
