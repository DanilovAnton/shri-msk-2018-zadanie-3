import './header.scss';
import '../../fonts/fonts';
import '../button/button.scss';

import Logo from '../logo/logo';

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Header = (props) => {
  const { type } = props;

  Header.propTypes = {
    type: PropTypes.oneOf(['schedule', 'meeting'])
  };

  if (type === 'schedule') {
    return (
      <header className='header'>
        <div className='header__logo'>
          <Logo />
        </div>
        <div className='header__button'>
          <Link to='/meeting/' className='button' title='Создать встречу'>
            Создать встречу
          </Link>
        </div>
      </header>
    );
  } else {
    return (
      <header className='header'>
        <div className='header__logo'>
          <Logo />
        </div>
      </header>
    );
  }
};

export default Header;
