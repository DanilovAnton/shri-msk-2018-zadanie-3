import './meeting-edit.scss';
import '../meeting-create/meeting-create.scss';
import '../meeting/meeting';
import '../button-close/button-close';
import '../input-group/input-group';
import '../input-label/input-label';
import '../button/button';
import '../footer/footer';
import '../message-background/message-background';

import InputText from '../input-text/input-text';
import InputDate from '../input-date/input-date';
import InputTime from '../input-time/input-time';
import Participants from '../participants/participants';
import RecommendedRoom from '../recommended-room/recommended-room';
import EventDelete from '../meeting-delete/meeting-delete';
import EventUpdate from '../meeting-update/meeting-update';
import Header from '../header/header';

import React from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

const getTime = (time) => {
  let hour = time.substr(0, 2);
  let minute = Math.ceil(time.substr(3, 2) / 15) * 15;

  if (minute === 60) {
    hour++;
    minute = '00';
  }

  return hour + ':' + minute;
};

const usersIdToArray = (users) => {
  let arr = [];

  users.map(user => {
    arr.push(Number(user.id));
  });

  return arr;
};

class MeetingEdit extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      delete: false,
      update: false,
      save: true,
      id: props.match.params.id,
      data: {
        theme: '',
        date: '',
        timeStart: '',
        timeEnd: '',
        dateTimeStart: '',
        dateTimeEnd: '',
        users: [],
        room: ''
      }
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.setTheme = this.setTheme.bind(this);
    this.setRoom = this.setRoom.bind(this);
    this.setUsers = this.setUsers.bind(this);
    this.setDate = this.setDate.bind(this);
    this.setTime = this.setTime.bind(this);
    this.setDateTime = this.setDateTime.bind(this);
  }

  setTheme (theme) {
    let data = Object.assign({}, this.state.data);

    data.theme = theme;
    this.setState({data: data});
  }

  // setRoom (id) {
  //   let data = Object.assign({}, this.state.data);
  //
  //   data.room = id;
  //   this.setState({data: data}, () => {
  //     if (data.room) { this.setState({save: true}); }
  //   });
  // }

  setRoom (id, start, end, date) {
    let data = Object.assign({}, this.state.data);
    data.room = id;

    if (id && start && end && date) {
      data.date = new Date(date).toDateString();
      data.timeStart = getTime(start);
      data.timeEnd = getTime(end);

      this.setState({data: data}, () => {
        this.setDateTime();

        if (data.room) { this.setState({save: true}); }
      });
    }

    if (id === '') {
      this.setState({data: data});
    }
  }

  setUsers (id) {
    let data = Object.assign({}, this.state.data);

    data.users = id;
    this.setState({data: data}, () => {
      this.setState({save: false});
    });
  }

  setDate (date) {
    let data = Object.assign({}, this.state.data);

    data.date = new Date(date).toDateString();

    this.setState({data: data}, () => {
      this.setDateTime();
      this.setState({save: false});
    });
  }

  setTime (timeStart, timeEnd) {
    let data = Object.assign({}, this.state.data);

    data.timeStart = getTime(timeStart);
    data.timeEnd = getTime(timeEnd);

    this.setState({data: data}, () => {
      this.setDateTime();
      this.setState({save: false});
    });
  }

  setDateTime () {
    let data = Object.assign({}, this.state.data);
    let dateTimeStart = '';
    let dateTimeEnd = '';

    if (this.state.data.date === '') {
      data.date = new Date(this.props.data.event.dateStart).toDateString();
      dateTimeStart = data.date;
      dateTimeEnd = data.date;
    } else {
      dateTimeStart = this.state.data.date;
      dateTimeEnd = this.state.data.date;
    }

    if (this.state.data.timeStart === '') {
      data.timeStart = String(moment(this.props.data.event.dateStart).utc().format('kk:mm'));
      dateTimeStart = dateTimeStart + ' ' + data.timeStart;
    } else {
      dateTimeStart = dateTimeStart + ' ' + this.state.data.timeStart;
    }

    if (this.state.data.timeEnd === '') {
      data.timeStart = String(moment(this.props.data.event.dateEnd).utc().format('kk:mm'));
      dateTimeEnd = dateTimeEnd + ' ' + data.timeStart;
    } else {
      dateTimeEnd = dateTimeEnd + ' ' + this.state.data.timeEnd;
    }

    data.dateTimeStart = moment(new Date(dateTimeStart)).format('YYYY-MM-DDTkk:mm') + ':00.000Z';
    data.dateTimeEnd = moment(new Date(dateTimeEnd)).format('YYYY-MM-DDTkk:mm') + ':00.000Z';

    this.setState({data: data});
  }

  handleClose (event) {
    event.preventDefault();

    this.setState({delete: false, update: false});
  }

  handleDelete (event) {
    event.preventDefault();

    this.setState({delete: true});
  }

  handleUpdate (event) {
    event.preventDefault();

    this.setState({update: true});
  }

  render () {
    const { data: { loading, error, event = '' } } = this.props;

    if (loading) {
      return <p>Loading ...</p>;
    }
    if (error) {
      return <p>{error.message}</p>;
    }
    return (
      <div className='meeting'>
        {(this.state.delete || this.state.update) && <div className='message-background' />}
        {this.state.delete && <EventDelete id={Number(this.state.id)} handleClose={this.handleClose} />}
        {
          this.state.update &&
          <EventUpdate
            id={Number(this.state.id)}
            title={this.state.data.theme ? this.state.data.theme : event.title}
            dateStart={this.state.data.dateTimeStart ? this.state.data.dateTimeStart : event.dateStart}
            dateEnd={this.state.data.dateTimeEnd ? this.state.data.dateTimeEnd : event.dateEnd}
            roomId={this.state.data.room ? Number(this.state.data.room) : Number(event.room.id)}
            removeUsersId={usersIdToArray(event.users)}
            addUsersId={this.state.data.users ? this.state.data.users : usersIdToArray(event.users)}
            handleClose={this.handleClose} />
        }
        <div className='meeting__wrapper'>
          <Header type='meeting' />
          <section className='meeting-create'>
            <div className='meeting-create__header'>
              <h1 className='meeting-create__title'>Новая встреча</h1>
              <div className='meeting-create__button'>
                <Link to='/' className='button-close' title='Закрыть'>
                  <svg className='button-close__icon' version='1.1' width='16' height='16' viewBox='0 0 16 16'>
                    <path d='M8.02081528,6.62132034 L5.19238816,3.79289322 C4.80186386,3.40236893 4.16869888,3.40236893 3.77817459,3.79289322 L3.77817459,3.79289322 L3.77817459,3.79289322 C3.3876503,4.18341751 3.3876503,4.81658249 3.77817459,5.20710678 L3.77817459,5.20710678 L6.60660172,8.03553391 L3.77817459,10.863961 C3.3876503,11.2544853 3.3876503,11.8876503 3.77817459,12.2781746 L3.77817459,12.2781746 L3.77817459,12.2781746 C4.16869888,12.6686989 4.80186386,12.6686989 5.19238816,12.2781746 L5.19238816,12.2781746 L8.02081528,9.44974747 L10.8492424,12.2781746 C11.2397667,12.6686989 11.8729317,12.6686989 12.263456,12.2781746 C12.6539803,11.8876503 12.6539803,11.2544853 12.263456,10.863961 L9.43502884,8.03553391 L12.263456,5.20710678 C12.6539803,4.81658249 12.6539803,4.18341751 12.263456,3.79289322 C11.8729317,3.40236893 11.2397667,3.40236893 10.8492424,3.79289322 L8.02081528,6.62132034 Z' />
                  </svg>
                </Link>
              </div>
            </div>
            <form className='meeting-create__body' onSubmit={this.handleSubmit}>
              <div className='meeting-create__theme'>
                <InputText label='Тема' placeholder='О чём будете говорить?'
                  required minLength={1} maxLength={100} setTheme={this.setTheme}
                  value={this.state.data.title ? this.state.data.title : event.title}
                />
              </div>
              <div className='meeting-create__date'>
                <InputDate label='Дата' placeholder='Дата встречи' required
                  setDate={this.setDate} value={this.state.data.date ? this.state.data.date : event.dateStart}
                />
                <InputTime required
                  setTime={this.setTime}
                  dateEnd={this.state.data.timeEnd ? this.state.data.timeEnd : String(moment(event.dateEnd).utc().format('kk:mm'))}
                  dateStart={this.state.data.timeStart ? this.state.data.timeStart : String(moment(event.dateStart).utc().format('kk:mm'))}
                />
              </div>
              <div className='meeting-create__participants'>
                <Participants setUsers={this.setUsers} id={this.state.data.users.length > 0 ? this.state.data.users : usersIdToArray(event.users)} />
              </div>
              <div className='meeting-create__recommended-room'>
                <RecommendedRoom
                  userCount={this.state.data.users.length > 0 ? this.state.data.users.length : usersIdToArray(event.users).length}
                  dateStart={this.state.data.dateTimeStart ? this.state.data.dateTimeStart : event.dateStart}
                  dateEnd={this.state.data.dateTimeEnd ? this.state.data.dateTimeEnd : event.dateEnd}
                  setRoom={this.setRoom}
                  id={this.state.data.room ? Number(this.state.data.room) : Number(event.room.id)}
                  users={this.state.data.users.length > 0 ? this.state.data.users : usersIdToArray(event.users)}
                />
              </div>
            </form>
          </section>
        </div>
        <footer className='footer footer_edit'>
          <div className='footer__button footer__button_cancel'>
            <Link to='/' className='button button_color_gray' title='Отмена'>
              Отмена
            </Link>
          </div>
          <div className='footer__button footer__button_delete'>
            <a href='#' className='button button_warning button_size_big' title='Удалить встречу' onClick={this.handleDelete}>
              Удалить встречу
            </a>
          </div>
          <div className='footer__button footer__button_update'>
            <button className={this.state.save ? 'button' : 'button button_disabled'} disabled={!this.state.save} title='Сохранить' onClick={this.handleUpdate}>
              Сохранить
            </button>
          </div>
        </footer>
      </div>
    );
  }
}

const eventQuery = gql`
  query EventQuery($id: ID!) {
    event(id: $id) {
      id
      title
      dateEnd
      dateStart
      room {
        id
      }
      users {
        id
      }
    }
  }
`;

const MeetingEditWithData = graphql(eventQuery, {
  options: (props) => {
    let id = Number(props.match.params.id);
    return {variables: { id }};
  }
})(MeetingEdit);

export default MeetingEditWithData;
