import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Schedule from '../components/schedule/schedule';
import MeetingCreate from '../components/meeting-create/meeting-create';
import MeetingEditWithData from '../components/meeting-edit/meeting-edit';

export default () => (
  <Router>
    <Switch>
      <Route path='/meeting/:date/:timeStart/:timeEnd/:room_id/:capacity' component={MeetingCreate} />
      <Route path='/meeting/:id' component={MeetingEditWithData} />
      <Route path='/meeting/' component={MeetingCreate} />
      <Route path='/:id' component={Schedule} />
      <Route path='/' component={Schedule} />
    </Switch>
  </Router>
);
