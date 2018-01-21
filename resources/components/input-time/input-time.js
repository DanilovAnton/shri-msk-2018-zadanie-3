import './input-time.scss';
import '../../fonts/fonts';
import '../input-group/input-group';

import InputError from '../input-error/input-error';
import InputLabel from '../input-label/input-label';

import React from 'react';
import PropTypes from 'prop-types';

class InputTime extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      start: (props.dateStart ? props.dateStart : ''),
      end: (props.dateEnd ? props.dateEnd : ''),
      error: false
    };

    this.updateStart = this.updateStart.bind(this);
    this.updateEnd = this.updateEnd.bind(this);
    this.checkError = this.checkError.bind(this);
    this.setTime = this.setTime.bind(this);
  }

  updateStart (event) {
    let value = event.target.value;

    value = (value.substr(0, 2).replace(/[^\d]/g, '') <= 24 ? value.substr(0, 2).replace(/[^\d]/g, '') : '') +
      value.substr(2, 1).replace(/[^.]/g, ':') +
      (value.substr(3, 2).replace(/[^\d]/g, '') <= 59 ? value.substr(3, 2).replace(/[^\d]/g, '') : '');

    this.setState({start: value.substr(0, 5)}, () => {
      this.setTime();
    });
  }

  updateEnd (event) {
    let value = event.target.value;

    value = (value.substr(0, 2).replace(/[^\d]/g, '') <= 24 ? value.substr(0, 2).replace(/[^\d]/g, '') : '') +
      value.substr(2, 1).replace(/[^.]/g, ':') +
      (value.substr(3, 2).replace(/[^\d]/g, '') <= 59 ? value.substr(3, 2).replace(/[^\d]/g, '') : '');

    this.setState({end: value.substr(0, 5)}, () => {
      this.setTime();
    });
  }

  setTime () {
    if (this.state.start.length >= 4 && this.state.end.length >= 4) {
      this.props.setTime(this.state.start, this.state.end);
    }
  }

  checkError (event) {
    if (this.props.required) {
      if (event.target.value === '') this.setState({error: true});
      else this.setState({error: false});
    }
  }

  componentWillUpdate (nextProps) {
    if (
      nextProps.dateStart !== this.props.dateStart ||
      nextProps.dateEnd !== this.props.dateEnd
    ) {
      this.setState({start: nextProps.dateStart, end: nextProps.dateEnd});
    }
  }

  render () {
    const { required } = this.props;

    return (
      <div className='input-group'>
        <div className='input-time'>
          <div className='input-time__group'>
            <InputLabel label='Начало' from='timeStart' mobileShow={false} />
            <input
              id='timeStart'
              type='text'
              className='input-time__field'
              value={this.state.start}
              required={required}
              onChange={this.updateStart}
              onBlur={this.checkError}
            />
          </div>
          <span className='input-time__separator'>&ndash;</span>
          <div className='input-time__group'>
            <InputLabel label='Конец' from='timeEnd' mobileShow={false} />
            <input
              id='timeEnd'
              type='text'
              className='input-time__field'
              value={this.state.end}
              required={required}
              onChange={this.updateEnd}
              onBlur={this.checkError}
            />
          </div>
        </div>
        { this.state.error && <InputError label='Время' /> }
      </div>
    );
  }
}

InputTime.propTypes = {
  required: PropTypes.bool,
  setTime: PropTypes.func.isRequired,
  dateStart: PropTypes.string,
  dateEnd: PropTypes.string
};

InputTime.defaultProps = {
  required: false,
  dateStart: '',
  dateEnd: ''
};

export default InputTime;
