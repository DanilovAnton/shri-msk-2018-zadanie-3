import './input-text.scss';
import '../input-group/input-group';
import '../../fonts/fonts';

import InputError from '../input-error/input-error';
import InputLabel from '../input-label/input-label';

import React from 'react';
import PropTypes from 'prop-types';

const Clear = (props) => {
  const {clearText} = props;

  Clear.propTypes = {
    clearText: PropTypes.func
  };

  return (
    <a href='#' className='input-text__clear' title='Очистить' onClick={clearText}>
      <svg className='input-text__clear-icon' version='1.1' width='16' height='16' viewBox='0 0 16 16'>
        <path
          d='M8.02081528,6.62132034 L5.19238816,3.79289322 C4.80186386,3.40236893 4.16869888,3.40236893 3.77817459,3.79289322 L3.77817459,3.79289322 L3.77817459,3.79289322 C3.3876503,4.18341751 3.3876503,4.81658249 3.77817459,5.20710678 L3.77817459,5.20710678 L6.60660172,8.03553391 L3.77817459,10.863961 C3.3876503,11.2544853 3.3876503,11.8876503 3.77817459,12.2781746 L3.77817459,12.2781746 L3.77817459,12.2781746 C4.16869888,12.6686989 4.80186386,12.6686989 5.19238816,12.2781746 L5.19238816,12.2781746 L8.02081528,9.44974747 L10.8492424,12.2781746 C11.2397667,12.6686989 11.8729317,12.6686989 12.263456,12.2781746 C12.6539803,11.8876503 12.6539803,11.2544853 12.263456,10.863961 L9.43502884,8.03553391 L12.263456,5.20710678 C12.6539803,4.81658249 12.6539803,4.18341751 12.263456,3.79289322 C11.8729317,3.40236893 11.2397667,3.40236893 10.8492424,3.79289322 L8.02081528,6.62132034 Z' />
      </svg>
    </a>
  );
};

class InputText extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      text: (props.value ? props.value : ''),
      clearShow: false,
      error: false
    };

    this.updateText = this.updateText.bind(this);
    this.clearText = this.clearText.bind(this);
    this.checkError = this.checkError.bind(this);
  }

  updateText (event) {
    const theme = event.target.value.substr(0, this.props.maxLength);

    this.setState({text: theme}, () => {
      this.props.setTheme(theme);
    });

    if (event.target.value !== '') this.setState({clearShow: true});
    else this.setState({clearShow: false});
  }

  clearText () {
    this.setState({text: ''});
    this.setState({clearShow: false});
  }

  checkError (event) {
    if (this.props.required) {
      if (event.target.value === '') this.setState({error: true});
      else this.setState({error: false});
    }
  }

  render () {
    const { label, placeholder, required, minLength, maxLength } = this.props;

    return (
      <div className='input-group'>
        <InputLabel label={label} from='theme' />
        <div className='input-text'>
          <input
            id='theme'
            type='text'
            className='input-text__field'
            placeholder={placeholder}
            value={this.state.text}
            required={required}
            minLength={minLength}
            maxLength={maxLength}
            onChange={this.updateText}
            onBlur={this.checkError}
          />
          { this.state.clearShow && <Clear clearText={this.clearText} /> }
        </div>
        { this.state.error && <InputError label={label} /> }
      </div>
    );
  }
}

InputText.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  required: PropTypes.bool,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  setTheme: PropTypes.func.isRequired,
  value: PropTypes.string
};

InputText.defaultProps = {
  required: false,
  minLength: 0,
  maxLength: 255,
  value: ''
};

export default InputText;
