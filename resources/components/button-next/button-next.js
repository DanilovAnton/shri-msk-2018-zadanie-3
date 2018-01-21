import './button-next.scss';

import React from 'react';
import PropTypes from 'prop-types';

const ButtonNext = (props) => {
  const { next, title } = props;

  ButtonNext.propTypes = {
    next: PropTypes.func.isRequired,
    title: PropTypes.string
  };

  ButtonNext.defaultProps = {
    title: 'Следующий'
  };

  return (
    <a href='#' className='button-next' title={title} onClick={next}>
      <svg className='button-next__icon' version='1.1' viewBox='0 0 1000 1000'>
        <path d='M761.5,180.8L447,499.5l314.5,318.7c9.7,9.7,17,20.8,21.9,33.3c4.9,12.5,7.3,25.2,7.3,38c0,12.8-2.4,25.3-7.3,37.5c-4.9,12.1-12.1,23.1-21.9,32.8C742,979.9,718.8,990,691.7,990c-27.1,0-50.3-10.1-69.8-30.2L241.8,576.5c-9.7-9.7-17.4-21.3-22.9-34.9c-5.6-13.5-8.7-27.3-9.4-41.1c-0.7-13.9,1-27.2,5.2-40.1c4.2-12.8,11.1-23.4,20.8-31.8L621.9,39.2C641.4,19.7,664.6,10,691.7,10c27.1,0,50.3,9.7,69.8,29.2c9.7,9.7,17,20.8,21.9,33.3c4.9,12.5,7.3,25.2,7.3,38c0,12.8-2.4,25.3-7.3,37.5C778.5,160.1,771.2,171.1,761.5,180.8L761.5,180.8z' />
      </svg>
    </a>
  );
};

export default ButtonNext;
