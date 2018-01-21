import './input-label.scss';
import '../../fonts/fonts';

import React from 'react';
import PropTypes from 'prop-types';

const InputLabel = (props) => {
  const { label, from, mobileLabel, mobileShow } = props;

  InputLabel.propTypes = {
    label: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    mobileLabel: PropTypes.string,
    mobileShow: PropTypes.bool

  };

  InputLabel.defaultProps = {
    mobileLabel: '',
    mobileShow: true
  };

  const className = 'input-label__text' + (!mobileShow ? ' input-label_mobile_hide' : '');

  if (!mobileLabel) {
    return (

      <div className='input-label'>
        <label htmlFor={from} className={className}>{ label }</label>
      </div>
    );
  } else {
    return (
      <div className='input-label'>
        <label htmlFor={from} className='input-label__text input-label_mobile_hide'>{ label }</label>
        <label htmlFor={from} className='input-label__text input-label_mobile_show'>{ mobileLabel }</label>
      </div>
    );
  }
};

export default InputLabel;
