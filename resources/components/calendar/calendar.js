import './calendar.scss';
import '../../fonts/fonts';

import React from 'react';
import moment from 'moment';

import ButtonPrev from '../button-prev/button-prev';
import ButtonNext from '../button-next/button-next';
import PropTypes from 'prop-types';

class Calendar extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      month: moment(),
      selected: moment().startOf('day')
    };

    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
  }

  previous () {
    const {
      month
    } = this.state;

    this.setState({
      month: month.subtract(1, 'month')
    });
  }

  next () {
    const {
      month
    } = this.state;

    this.setState({
      month: month.add(1, 'month')
    });
  }

  select (day) {
    this.setState({
      selected: day.date,
      month: day.date.clone()
    });
  }

  renderWeeks () {
    let weeks = [];
    let done = false;

    let date = this.state.month.clone().startOf('month').add('w' - 1).day(1);

    let count = 0;
    let monthIndex = date.month();

    const {
      selected,
      month
    } = this.state;

    while (!done) {
      weeks.push(
        <Week key={'week' + date}
          date={date.clone()}
          month={month}
          select={(day) => this.select(day)}
          selected={selected}
          setDate={this.props.setDate}
        />
      );

      date.add(1, 'w');

      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }

    return weeks;
  }

  renderMonthLabel () {
    const {
      month
    } = this.state;

    return <span className='calendar__month-label'>{month.locale('ru').format('MMMM YYYY')}</span>;
  }

  render () {
    return (
      <div className='calendar'>
        <div className='calendar__header'>
          <div className='calendar__month-display'>
            <ButtonPrev previous={this.previous} title='Предыдущий месяц' />
            {this.renderMonthLabel()}
            <ButtonNext next={this.next} title='Следующий месяц' />
          </div>
          <DayNames />
        </div>
        {this.renderWeeks()}
      </div>
    );
  }
}

Calendar.propTypes = {
  setDate: PropTypes.func.isRequired
};

const DayNames = () => {
  return (
    <ul className='calendar__day-names'>
      <li className='calendar__day' key={'Mon'}>Пн</li>
      <li className='calendar__day' key={'Tue'}>Вт</li>
      <li className='calendar__day' key={'Wed'}>Ср</li>
      <li className='calendar__day' key={'Thu'}>Чт</li>
      <li className='calendar__day' key={'Fri'}>Пт</li>
      <li className='calendar__day' key={'Sat'}>Сб</li>
      <li className='calendar__day' key={'Sun'}>Вс</li>
    </ul>
  );
};

const Week = (props) => {
  let days = [];
  let {
    date
  } = props;

  const {
    month,
    selected,
    select
  } = props;

  for (let i = 0; i < 7; i++) {
    let day = {
      name: date.format('dd').substring(0, 1),
      number: date.date(),
      isCurrentMonth: date.month() === month.month(),
      isToday: date.isSame(new Date(), 'day'),
      date: date
    };
    days.push(
      <Day day={day}
        selected={selected}
        select={select}
        key={'day' + date}
        setDate={props.setDate}
      />
    );

    date = date.clone();
    date.add(1, 'day');
  }

  Week.propTypes = {
    setDate: PropTypes.func.isRequired
  };

  return (
    <ul className='calendar__week' key={days[0]}>
      {days}
    </ul>
  );
};

const Day = (props) => {
  const setDate = () => {
    const newDate = moment(props.day.date).locale('ru').format('DD MMMM, YYYY');
    const newDbDate = new Date(props.day.date);

    props.setDate(newDate, newDbDate);
    props.select(props.day);
  };

  const {
    day: {
      date,
      isCurrentMonth,
      isToday,
      number
    },
    selected
  } = props;

  Day.propTypes = {
    setDate: PropTypes.func.isRequired
  };

  return (
    <li
      key={date.toString()}
      className={'calendar__day' + (isToday ? ' calendar__today' : '') + (isCurrentMonth ? '' : ' calendar__different-month') + (date.isSame(selected) ? ' calendar__selected' : '')}
      onClick={setDate}
    >
      {number}
    </li>
  );
};

export default Calendar;
