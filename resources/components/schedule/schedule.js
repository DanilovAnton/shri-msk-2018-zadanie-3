import './schedule.scss';
import '../../fonts/fonts';
import '../message-background/message-background';

import Header from '../header/header';
import ButtonPrev from '../button-prev/button-prev';
import ButtonNext from '../button-next/button-next';
import MessageWithData from '../message-info/message-info';
import FloorsListWithData from '../floors-list/floors-list';
import Timeline from '../timeline/timeline';
import ScheduleEvent from '../schedule-event/schedule-event';
import CurrentHour from '../current-hour/current-hour';
import Swipeable from 'react-swipeable';
import FloorsListMobileWithData from '../floor-list-mobile/floor-list-mobile';
import ThreeMonths from '../three-months/three-months';

import React from 'react';
import moment from 'moment';

class Schedule extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      date: moment().format('YYYY-MM-DD'),
      text: moment().locale('ru').format('DD MMM').replace('.', ''),
      dayPlus: 0,
      busy: '',
      hover: '',
      displayNum: 1,
      showScheduleRooms: true,
      swipe: true,
      showCalendar: false
    };

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.busy = this.busy.bind(this);
    this.hover = this.hover.bind(this);
    this.swipingLeft = this.swipingLeft.bind(this);
    this.swipingRight = this.swipingRight.bind(this);
    this.swipingState = this.swipingState.bind(this);
    this.clearStyle = this.clearStyle.bind(this);
    this.setDate = this.setDate.bind(this);
    this.showCalendarClick = this.showCalendarClick.bind(this);
  }

  swipingState (showScheduleRooms, marginLeft, token) {
    const swipeElement = document.getElementById('swipeElement');

    this.setState({showScheduleRooms: showScheduleRooms});
    if (marginLeft) {
      swipeElement.style.marginLeft = marginLeft;
    }
    if (token === '+') this.setState({displayNum: this.state.displayNum + 1});
    else if (token === '-') this.setState({displayNum: this.state.displayNum - 1});

    let swipe = setTimeout(() => { this.setState({swipe: true}); }, 150);

    if (this.state.swipe) clearTimeout(swipe);
  }

  swipingLeft (e, absX) {
    const swipeElement = document.getElementById('swipeElement');
    const swipeContainer = document.getElementById('swipeContainer');

    if (window.innerWidth <= 667 && this.state.swipe) {
      if (absX >= 150) {
        this.setState({swipe: false}, () => {
          switch (this.state.displayNum) {
            case 1:
              this.swipingState(false, null, '+');
              swipeElement.style.width = '600%';
              swipeContainer.style.width = '70%';
              break;
            case 2:
              this.swipingState(false, '-150%', '+');
              break;
            case 3:
              this.swipingState(false, '-300%', '+');
              break;
            case 4:
              this.swipingState(false, '-450%', null);
              break;
          }
        });
      }
    }
  }

  swipingRight (e, absX) {
    const swipeElement = document.getElementById('swipeElement');
    const swipeContainer = document.getElementById('swipeContainer');

    if (window.innerWidth <= 667 && this.state.swipe) {
      if (absX >= 150) {
        this.setState({swipe: false}, () => {
          switch (this.state.displayNum) {
            case 1:
              this.swipingState(true, null, null);
              swipeElement.style.width = '800%';
              swipeContainer.style.width = '58%';
              break;
            case 2:
              this.swipingState(false, '0', '-');
              break;
            case 3:
              this.swipingState(false, '-150%', '-');
              break;
            case 4:
              this.swipingState(false, '-300%', '-');
              break;
          }
        });
      }
    }
  }

  clearStyle () {
    const swipeElement = document.getElementById('swipeElement');
    const swipeContainer = document.getElementById('swipeContainer');

    swipeElement.removeAttribute('style');
    swipeContainer.removeAttribute('style');
    this.setState({displayNum: 1});
    this.setState({showScheduleRooms: true});
    this.setState({swipe: true});
  }

  componentDidMount () {
    window.addEventListener('resize', this.clearStyle, false);
  }

  componentWillUnmount () {
    document.removeEventListener('resize', this.clearStyle, false);
  }

  busy (status) {
    this.setState({busy: status});
  }

  hover (status) {
    this.setState({hover: status});
  }

  next (event) {
    event.preventDefault();

    let dayPlus = this.state.dayPlus + 1;
    this.setState({
      dayPlus: dayPlus,
      date: moment().add(dayPlus, 'day').format('YYYY-MM-DD'),
      text: moment().add(dayPlus, 'day').locale('ru').format('DD MMM').replace('.', '')
    });
  }

  previous (event) {
    event.preventDefault();

    let dayPlus = this.state.dayPlus - 1;

    if (dayPlus >= 0) {
      this.setState({
        dayPlus: dayPlus,
        date: moment().add(dayPlus, 'day').format('YYYY-MM-DD'),
        text: moment().add(dayPlus, 'day').locale('ru').format('DD MMM').replace('.', '')
      });
    } else {
      this.setState({
        dayPlus: dayPlus,
        date: moment().subtract(-dayPlus, 'day').format('YYYY-MM-DD'),
        text: moment().subtract(-dayPlus, 'day').locale('ru').format('DD MMM').replace('.', '')
      });
    }
  }

  setDate (newDate, newDbDate) {
    this.setState({date: newDbDate, text: newDate, showCalendar: false});
  }

  showCalendarClick () {
    this.setState({showCalendar: !this.state.showCalendar});
  }

  render () {
    return (
      <div className='schedule'>
        {this.props.match.params.id && <MessageWithData id={Number(this.props.match.params.id)} />}
        {this.props.match.params.id && <div className='message-background' />}
        <Header type='schedule' />
        <section className='schedule__gantt-chart'>
          <div className='schedule__date'>
            <ButtonPrev previous={this.previous} title='Предыдущий месяц' />
            <div className='schedule__date-text' onClick={this.showCalendarClick}>
              {this.state.text}
              {this.state.date === moment().format('YYYY-MM-DD') && <span className='schedule__date-today'> &#183; Сегодня</span>}
              {this.state.date !== moment().format('YYYY-MM-DD') && <span className='schedule__date-today'>, {moment(this.state.date, 'YYYY-MM-DD').format('YYYY')}</span>}
            </div>
            <ButtonNext next={this.next} title='Следующий месяц' />
          </div>
          {this.state.showCalendar && <ThreeMonths setDate={this.setDate} />}
          {
            this.state.showScheduleRooms &&
            <div className='schedule__rooms'>
              <FloorsListWithData busy={this.state.busy} hover={this.state.hover} />
            </div>
          }
          {
            !this.state.showScheduleRooms &&
            <div className='schedule__rooms schedule__rooms_mobile'>
              <FloorsListMobileWithData busy={this.state.busy} hover={this.state.hover} />
            </div>
          }
          <Swipeable id='swipeContainer' className='schedule__swipe' onSwipingLeft={this.swipingLeft} onSwipingRight={this.swipingRight}>
            <div id='swipeElement' className='schedule__chart'>
              <CurrentHour />
              <Timeline />
              <ScheduleEvent date={this.state.date} hover={this.hover} busy={this.busy} />
            </div>
          </Swipeable>
        </section>
      </div>
    );
  }
}

export default Schedule;
