import './input-error.scss';
import '../../fonts/fonts';

import React from 'react';
import PropTypes from 'prop-types';

const InputError = (props) => {
  const {label} = props;

  InputError.propTypes = {
    label: PropTypes.string.isRequired
  };

  return (
    <div className='input-error'>Поле "{label}" обязательно для заполнения.</div>
  );
};

export default InputError;
