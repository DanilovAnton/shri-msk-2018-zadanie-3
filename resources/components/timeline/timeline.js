import './timeline.scss';
import '../../fonts/fonts';

import React from 'react';

const hours = [];

for (let i = 8; i <= 23; i++) {
  hours.push(i === 8 ? '8:00' : i);
}

const Timeline = () => {
  return (
    <div className='timeline'>
      <ul className='timeline__list'>
        {hours.map(hour => (
          <li className='timeline__item' key={hour}>
            <div className='timeline__hour'>
              {hour}
            </div>
            <div className='timeline__line' />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;
