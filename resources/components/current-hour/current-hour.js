import './current-hour.scss';
import '../../fonts/fonts';

import React from 'react';
import moment from 'moment/moment';

class CurrentHour extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      time: moment().format('kk:mm')
    };
  }

  componentDidMount () {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount () {
    clearInterval(this.timerID);
  }

  tick () {
    this.setState({
      time: moment().format('kk:mm')
    });
  }

  render () {
    const left = (((Number(this.state.time.substr(0, 2)) - 8) * 6.25) + Number(this.state.time.substr(3, 2)) * (100 / 60 / 17)) + 1.55;

    return (
      <div className='current-hour' style={{left: (left < 0 ? 100 : left) + '%'}}>
        <span className='current-hour__text'>
          {this.state.time}
        </span>
      </div>
    );
  }
}
export default CurrentHour;
