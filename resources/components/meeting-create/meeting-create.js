import './meeting-create.scss';
import '../meeting/meeting';
import '../button-close/button-close';
import '../input-group/input-group';
import '../input-label/input-label';
import '../button/button';
import '../footer/footer';

import InputText from '../input-text/input-text';
import InputDate from '../input-date/input-date';
import InputTime from '../input-time/input-time';
import Participants from '../participants/participants';
import RecommendedRoom from '../recommended-room/recommended-room';
import Header from '../header/header';

import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

const createDateTime = (date, time) => {
  return moment(new Date(date + ' ' + time)).format('YYYY-MM-DDTkk:mm') + ':00.000Z';
};

const getTime = (time) => {
  let hour = time.substr(0, 2);
  let minute = Math.ceil(time.substr(3, 2) / 15) * 15;

  if (minute === 60) {
    hour++;
    minute = '00';
  }

  return hour + ':' + minute;
};

const createEvent = gql`
  mutation CreateEvent($theme: String!, $dateTimeStart: Date!, $dateTimeEnd: Date!, $users: [ID]!, $room: ID!){
  createEvent(
    input: {
      title: $theme
      dateStart: $dateTimeStart
      dateEnd: $dateTimeEnd
    }
    usersIds: $users
    roomId: $room
  ) {
    id
  }
}
`;

class MeetingCreate extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      save: false,
      data: {
        theme: '',
        date: this.props.match.params.date ? this.props.match.params.date : '',
        timeStart: this.props.match.params.timeStart ? this.props.match.params.timeStart : '',
        timeEnd: this.props.match.params.timeEnd ? this.props.match.params.timeEnd : '',
        dateTimeStart: this.props.match.params.timeStart && this.props.match.params.date
          ? createDateTime(this.props.match.params.date, this.props.match.params.timeStart) : '',
        dateTimeEnd: this.props.match.params.timeEnd && this.props.match.params.date
          ? createDateTime(this.props.match.params.date, this.props.match.params.timeEnd)
          : '',
        users: [],
        room: this.props.match.params.room_id ? Number(this.props.match.params.room_id) : ''
      }
    };

    this.setTheme = this.setTheme.bind(this);
    this.setRoom = this.setRoom.bind(this);
    this.setUsers = this.setUsers.bind(this);
    this.setDate = this.setDate.bind(this);
    this.setTime = this.setTime.bind(this);
    this.setDateTime = this.setDateTime.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setTheme (theme) {
    let data = Object.assign({}, this.state.data);

    data.theme = theme;
    this.setState({data: data});
  }

  setRoom (id, start, end, date) {
    let data = Object.assign({}, this.state.data);
    data.room = id;

    if (id && start && end && date) {
      data.date = new Date(date).toDateString();
      data.timeStart = getTime(start);
      data.timeEnd = getTime(end);

      this.setState({data: data}, () => {
        this.setDateTime();
      });
    }

    if (id === '') {
      this.setState({data: data});
    }
  }

  setUsers (id) {
    let data = Object.assign({}, this.state.data);

    data.users = id;
    this.setState({data: data});
  }

  setDate (date) {
    let data = Object.assign({}, this.state.data);

    data.date = new Date(date).toDateString();

    this.setState({data: data}, () => {
      this.setDateTime();
    });
  }

  setTime (timeStart, timeEnd) {
    let data = Object.assign({}, this.state.data);

    data.timeStart = getTime(timeStart);
    data.timeEnd = getTime(timeEnd);

    this.setState({data: data}, () => {
      this.setDateTime();
    });
  }

  setDateTime () {
    if (this.state.data.date !== '' && this.state.data.timeStart !== '' && this.state.data.timeEnd !== '') {
      let data = Object.assign({}, this.state.data);

      data.dateTimeStart = moment(new Date(this.state.data.date + ' ' + this.state.data.timeStart)).format('YYYY-MM-DDTkk:mm') + ':00.000Z';
      data.dateTimeEnd = moment(new Date(this.state.data.date + ' ' + this.state.data.timeEnd)).format('YYYY-MM-DDTkk:mm') + ':00.000Z';

      this.setState({data: data});
    }
  }

  handleSubmit (event) {
    event.preventDefault();

    if (this.state.save) {
      this.props.mutate({
        variables: {
          theme: this.state.data.theme,
          dateTimeStart: this.state.data.dateTimeStart,
          dateTimeEnd: this.state.data.dateTimeEnd,
          users: this.state.data.users,
          room: this.state.data.room
        }
      })
        .then(({ data }) => {
          this.props.history.push(`/${data.createEvent.id}`);
        }).catch((error) => {
          console.log('there was an error sending the query', error);
        });
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.data !== prevState.data) {
      if (
        this.state.data.theme !== '' &&
        this.state.data.dateTimeStart !== '' &&
        this.state.data.dateTimeEnd !== '' &&
        this.state.data.users !== [] &&
        this.state.data.room !== ''
      ) {
        this.setState({save: true});
      } else {
        this.setState({save: false});
      }
    }
  }

  render () {
    return (
      <div className='meeting'>
        <div className={this.state.data.room !== '' ? 'meeting__wrapper' : 'meeting__wrapper meeting__wrapper_message'}>
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
                <InputText label='Тема' placeholder='О чём будете говорить?' required minLength={1} maxLength={100} setTheme={this.setTheme} />
              </div>
              <div className='meeting-create__date'>
                <InputDate label='Дата' placeholder='Дата встречи' required
                  setDate={this.setDate}
                  value={this.props.match.params.date
                    ? (this.state.data.date ? this.state.data.date : this.props.match.params.date)
                    : this.props.match.params.date}
                />
                <InputTime required setTime={this.setTime}
                  dateStart={this.props.match.params.timeStart
                    ? (this.state.data.timeStart ? this.state.data.timeStart : this.props.match.params.timeStart)
                    : this.state.data.timeStart}
                  dateEnd={this.props.match.params.timeEnd
                    ? (this.state.data.timeEnd ? this.state.data.timeEnd : this.props.match.params.timeEnd)
                    : this.state.data.timeEnd}
                />
              </div>
              <div className='meeting-create__participants'>
                <Participants setUsers={this.setUsers} />
              </div>
              <div className='meeting-create__recommended-room'>
                <RecommendedRoom
                  userCount={this.props.match.params.capacity
                    ? (this.state.data.users.length > 0 ? this.state.data.users.length : Number(this.props.match.params.capacity))
                    : this.state.data.users.length}
                  dateStart={this.state.data.dateTimeStart}
                  dateEnd={this.state.data.dateTimeEnd}
                  setRoom={this.setRoom}
                  id={Number(this.state.data.room)}
                  users={this.state.data.users}
                />
              </div>
            </form>
          </section>
        </div>
        <footer className={this.state.data.room !== '' ? 'footer' : 'footer footer__message'}>
          <div className='footer__button'>
            <div className='footer__button'>
              <Link to='/' className='button button_color_gray' title='Отмена'>
                Отмена
              </Link>
            </div>
            <button
              className={this.state.save ? 'button' : 'button button_disabled'} disabled={!this.state.save}
              onClick={this.handleSubmit}
            >
              Создать встречу
            </button>
          </div>
        </footer>
      </div>
    );
  }
}

const MeetingCreateWithData = graphql(createEvent, {
  options: ({ theme, dateTimeStart, dateTimeEnd, users, room }) => ({ variables: { theme, dateTimeStart, dateTimeEnd, users, room } })
})(MeetingCreate);

export default withRouter(MeetingCreateWithData);
