import './user-icon.scss';

import React from 'react';
import PropTypes from 'prop-types';

const UserIcon = (props) => {
  const src = props.src || 'https://lh3.googleusercontent.com/V8vx2bIYko2UACyHl4K9CD41hVabwFuukkHZj1X4nmGrpu9J_vSpCYrI8ISWuNg5Qg=w300';

  UserIcon.propTypes = {
    src: PropTypes.string
  };

  UserIcon.defaultProps = {
    src: 'https://lh3.googleusercontent.com/V8vx2bIYko2UACyHl4K9CD41hVabwFuukkHZj1X4nmGrpu9J_vSpCYrI8ISWuNg5Qg=w300'
  };

  return (
    <div className='user-icon'>
      <img src={src} alt='Иконка пользователя' className='user-icon__img' />
    </div>
  );
};

export default UserIcon;
