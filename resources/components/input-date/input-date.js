import '../input-date/input-date.scss';
import '../input-group/input-group';
import '../../fonts/fonts';

import InputError from '../input-error/input-error';
import InputLabel from '../input-label/input-label';
import Calendar from '../calendar/calendar';

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import moment from 'moment/moment';

class InputDate extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      date: (props.value ? moment(props.value).locale('ru').format('DD MMMM, YYYY') : ''),
      data: (props.value ? props.value : ''),
      show: false,
      error: false
    };

    this.setDate = this.setDate.bind(this);
    this.calendarShow = this.calendarShow.bind(this);
    this.calendarHide = this.calendarHide.bind(this);
    this.calendarShowHide = this.calendarShowHide.bind(this);
    this.checkError = this.checkError.bind(this);
  }

  setDate (newDate, newData) {
    this.setState({date: newDate, data: newData, error: false, show: false});
    this.props.setDate(newData);
  }

  calendarShow () {
    this.setState({show: true});
  }

  calendarShowHide () {
    this.setState({show: !this.state.show});
  }

  checkError (event) {
    if (this.props.required) {
      if (event.target.value === '') this.setState({error: true});
      else this.setState({error: false});
    }
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.calendarHide, false);
  }

  componentWillMount () {
    document.addEventListener('click', this.calendarHide, false);
  }

  calendarHide (event) {
    const domNode = ReactDOM.findDOMNode(this);

    if ((!domNode || !domNode.contains(event.target))) {
      this.setState({show: false});
    }
  }

  componentWillUpdate (nextProps) {
    if (
      nextProps.data !== this.props.data
    ) {
      this.setState({date: (nextProps.value ? moment(nextProps.value).locale('ru').format('DD MMMM, YYYY') : ''),
        data: (nextProps.value ? nextProps.value : '')});
    }
  }

  render () {
    const { label, placeholder, required } = this.props;

    return (
      <div className='input-group'>
        <InputLabel label={label} from='date' mobileLabel='Дата и время' />
        <div className='input-date'>
          <input
            id='date'
            type='text'
            className='input-date__field'
            placeholder={placeholder}
            value={this.state.date}
            required={required}
            onFocus={this.calendarShow}
            onBlur={this.checkError}
            onChange={() => {}}
          />
          <span className='input-date__decoration' onClick={this.calendarShowHide}>
            <svg className='input-date__decoration-icon' version='1.1' width='16' height='16' viewBox='0 0 16 16'>
              <path d='M3,6 L3,13 L13,13 L13,6 L3,6 Z M12,3 L14,3 L14,14 L2,14 L2,3 L4,3 L4,2 L6,2 L6,3 L10,3 L10,2 L12,2 L12,3 Z M4,7 L4,9 L6,9 L6,7 L4,7 Z M7,7 L7,9 L9,9 L9,7 L7,7 Z M4,10 L4,12 L6,12 L6,10 L4,10 Z' />
            </svg>
          </span>
          { this.state.show && <div className='input-date__calendar'><Calendar setDate={this.setDate} /></div> }
        </div>
        { this.state.error && <InputError label={label} /> }
      </div>
    );
  }
}

InputDate.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string
};

InputDate.defaultProps = {
  required: false,
  value: ''
};

export default InputDate;
