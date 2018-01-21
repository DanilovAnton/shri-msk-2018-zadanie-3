import './participants.scss';

import UserList from '../user-list/user-list';

import React from 'react';
import InputSelect from '../input-select/input-select';
import PropTypes from 'prop-types';
import InputTime from '../input-time/input-time';

class Participants extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      data: (props.id ? props.id : [])
    };

    this.addParticipant = this.addParticipant.bind(this);
    this.deleteParticipant = this.deleteParticipant.bind(this);
  }

  addParticipant (event) {
    event.preventDefault();

    if (this.state.data.indexOf(Number(event.target.dataset.user_id)) === -1) {
      const data = [].concat(this.state.data, Number(event.target.dataset.user_id));

      this.setState({data: data}, () => {
        this.props.setUsers(data);
      });
    }
  }

  deleteParticipant (event) {
    event.preventDefault();

    let data = this.state.data.slice();

    data.splice(data.indexOf(Number(event.target.dataset.user_id)), 1);

    if (this.state.data.indexOf(Number(event.target.dataset.user_id)) !== -1) {
      this.setState({data: data});
      this.props.setUsers(data);
    }
  }

  render () {
    return (
      <div className='participants'>
        <div className='participants__input'>
          <InputSelect
            label='Участники'
            placeholder='Например, Тор Одинович'
            addParticipant={this.addParticipant}
          />
        </div>
        <div className='participants__user'>
          <UserList user_id={this.state.data} deleteParticipant={this.deleteParticipant} />
        </div>
      </div>
    );
  }
}

Participants.propTypes = {
  setUsers: PropTypes.func.isRequired,
  id: PropTypes.array
};

InputTime.defaultProps = {
  id: []
};

export default Participants;
