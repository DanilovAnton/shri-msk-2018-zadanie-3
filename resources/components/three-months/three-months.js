import './three-months.scss';
import '../../fonts/fonts';

import React from 'react';
import moment from 'moment';

import PropTypes from 'prop-types';

class ThreeMonths extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      month: moment(),
      selected: moment().startOf('day')
    };
  }

  select (day) {
    this.setState({
      selected: day.date
    });
  }

  renderWeeks (plus) {
    let weeks = [];
    let done = false;

    let date = this.state.month.clone().startOf('month').add('w' - 1).add(plus, 'month').day(1);

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

  renderMonthLabel (plus) {
    const date = this.state.month.clone();

    return <span className='calendar__month-label'>{date.locale('ru').add(plus, 'month').format('MMMM YYYY')}</span>;
  }

  render () {
    return (
      <div className='three-months'>
        <div className='three-months__one'>
          <div className='three-months__header'>
            <div className='three-months__month-display'>
              {this.renderMonthLabel(0)}
            </div>
            <DayNames />
          </div>
          {this.renderWeeks(0)}
        </div>
        <div className='three-months__one'>
          <div className='three-months__header'>
            <div className='three-months__month-display'>
              {this.renderMonthLabel(1)}
            </div>
            <DayNames />
          </div>
          {this.renderWeeks(1)}
        </div>
        <div className='three-months__one'>
          <div className='three-months__header'>
            <div className='three-months__month-display'>
              {this.renderMonthLabel(2)}
            </div>
            <DayNames />
          </div>
          {this.renderWeeks(2)}
        </div>
      </div>
    );
  }
}

ThreeMonths.propTypes = {
  setDate: PropTypes.func.isRequired
};

const DayNames = () => {
  return (
    <ul className='three-months__day-names'>
      <li className='three-months__day' key={'Mon'}>Пн</li>
      <li className='three-months__day' key={'Tue'}>Вт</li>
      <li className='three-months__day' key={'Wed'}>Ср</li>
      <li className='three-months__day' key={'Thu'}>Чт</li>
      <li className='three-months__day' key={'Fri'}>Пт</li>
      <li className='three-months__day' key={'Sat'}>Сб</li>
      <li className='three-months__day' key={'Sun'}>Вс</li>
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
    <ul className='three-months__week' key={days[0]}>
      {days}
    </ul>
  );
};

const Day = (props) => {
  const setDate = () => {
    const newDate = moment(props.day.date).locale('ru').format('DD MMM').replace('.', '');
    const newDbDate = moment(props.day.date).format('YYYY-MM-DD');

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
      className={'three-months__day' + (isToday ? ' three-months__today' : '') + (isCurrentMonth ? '' : ' three-months__different-month') + (date.isSame(selected) ? ' three-months__selected' : '')}
      onClick={setDate}
    >
      {number}
    </li>
  );
};

export default ThreeMonths;
