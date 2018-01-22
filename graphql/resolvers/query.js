const Sequelize = require('sequelize');
const { models, sequelize } = require('../../models');
const moment = require('moment');

/*
Изменил порядок размещения методов объекта также как в фале typeDefs.js и mutation.js
 */

const freeRoomsByDate = (capacityIn, dateStartIn, dateEndIn, users) => {
  return sequelize.query('SELECT ' +
    'r.id, r.title, r.floor, ' +
    'abs((SELECT sum(u.homeFloor) FROM Users u WHERE u.id IN (:users)) - r.floor) as remoteness, ' +
    ':dateStartIn as dateStart, :dateEndIn as dateEnd ' +
    'FROM Rooms r ' +
    'WHERE id NOT IN ' +
    '(' +
    'SELECT id FROM RoomsEvents re ' +
    'WHERE (:dateStartIn > re.dateStart AND :dateStartIn < re.dateEnd) ' +
    'OR (:dateEndIn > re.dateStart AND :dateEndIn < re.dateEnd) ' +
    'OR (re.dateStart > :dateStartIn AND re.dateStart < :dateEndIn) ' +
    'OR (re.dateEnd > :dateStartIn AND re.dateEnd < :dateEndIn) ' +
    'OR (re.dateStart = :dateStartIn AND re.dateEnd = :dateEndIn)' +
    ') ' +
    'AND r.capacity >= :capacityIn ' +
    'ORDER BY remoteness;',
    { replacements:
    {
      capacityIn: capacityIn,
      dateStartIn: dateStartIn,
      dateEndIn: dateEndIn,
      users: users
    },
      type: sequelize.QueryTypes.SELECT
    }
  );
};

const freeRoomByDate = (capacityIn, dateStartIn, dateEndIn, users) => {
  return sequelize.query('SELECT ' +
    'r.id, r.title, r.floor, ' +
    'abs((SELECT sum(u.homeFloor) FROM Users u WHERE u.id IN (:users)) - r.floor) as remoteness, ' +
    ':dateStartIn as dateStart, :dateEndIn as dateEnd ' +
    'FROM Rooms r ' +
    'WHERE id NOT IN ' +
    '(' +
    'SELECT id FROM RoomsEvents re ' +
    'WHERE (:dateStartIn > re.dateStart AND :dateStartIn < re.dateEnd) ' +
    'OR (:dateEndIn > re.dateStart AND :dateEndIn < re.dateEnd) ' +
    'OR (re.dateStart > :dateStartIn AND re.dateStart < :dateEndIn) ' +
    'OR (re.dateEnd > :dateStartIn AND re.dateEnd < :dateEndIn) ' +
    'OR (re.dateStart = :dateStartIn AND re.dateEnd = :dateEndIn)' +
    ') ' +
    'AND r.capacity >= :capacityIn ' +
    'ORDER BY remoteness ' +
    'LIMIT 1;',
    { replacements:
    {
      capacityIn: capacityIn,
      dateStartIn: dateStartIn,
      dateEndIn: dateEndIn,
      users: users
    },
      type: sequelize.QueryTypes.SELECT
    }
  );
};

const listEventsByDate = (date, dateStartIn, dateEndIn, capacityIn) => {
  return sequelize.query('SELECT ' +
    'se.room_id as room_id, ' +
    'se.event_id as event_id, ' +
    '(SELECT count(eu.UserId) FROM Events_Users eu WHERE eu.EventId = se.event_id) as users_count, ' +
    'se.dateStart as dateStart, ' +
    'se.dateEnd as dateEnd, ' +
    '(SELECT group_concat(eu.UserId) FROM Events_Users eu WHERE eu.EventId = se.event_id) as users_id ' +
    'FROM ScheduleEvents se ' +
    'WHERE se.date = :date ' +
    'AND ' +
    '(se.dateStart BETWEEN :dateStartIn AND :dateEndIn ' +
    'OR se.dateEnd BETWEEN :dateStartIn AND :dateEndIn) ' +
    'AND se.capacity >= :capacityIn',
    { replacements:
    {
      date: date,
      capacityIn: capacityIn,
      dateStartIn: dateStartIn,
      dateEndIn: dateEndIn
    },
      type: sequelize.QueryTypes.SELECT
    }
  );
};

const RoomsSwap = (root, { id, roomId }, context) => {
  return models.Event.findById(id).then(event => event.setRoom(roomId));
};

const getSwapRoom = (date, dateStartIn, dateEndIn, capacityIn) => {
  let listEvents = listEventsByDate(date, dateStartIn, dateEndIn, capacityIn);
  let swapRooms = [];
  let swapRoom;

  return listEvents.then((events) => {
    let arrayOfPromises = events.map((event) => {
      return freeRoomByDate(event.users_count, event.dateStart, event.dateEnd, event.users_id.split(',')).then((rooms) => {
        if (rooms && rooms.length > 0) {
          if (!swapRooms['id:' + event.room_id]) swapRooms['id:' + event.room_id] = {'event': [[event.event_id, rooms[0].id]], 'remoteness': rooms[0].remoteness};
          else {
            swapRooms['id:' + event.room_id].event.push([event.event_id, rooms[0].id]);
            swapRooms['id:' + event.room_id].remoteness = Math.abs(swapRooms['id:' + event.room_id].remoteness) + Number(rooms[0].remoteness);
          }
        }
      });
    });

    return Promise.all(arrayOfPromises);
  }).then(() => {
    Object.keys(swapRooms).map((id) => {
      if (!swapRoom) {
        swapRoom = swapRooms[id];
      } else {
        if (swapRoom.remoteness > swapRooms[id].remoteness) swapRoom = swapRooms[id];
      }
    });

    return swapRoom;
  }).catch((error) => {
    console.log(error);
    return swapRoom;
  });
};

function getFirstFreeRomms (capacityIn, dateStartIn, dateEndIn, users) {
  dateStartIn = moment(dateStartIn, 'YYYY-MM-DD HH:mm:ss.SSS Z').add(15, 'minutes').utc().format('YYYY-MM-DD HH:mm:ss.SSS Z');
  dateEndIn = moment(dateEndIn, 'YYYY-MM-DD HH:mm:ss.SSS Z').add(15, 'minutes').utc().format('YYYY-MM-DD HH:mm:ss.SSS Z');

  return freeRoomsByDate(capacityIn, dateStartIn, dateEndIn, users).then((rooms) => {
    if (rooms.length > 0) return rooms;
    else return getFirstFreeRomms(capacityIn, dateStartIn, dateEndIn, users);
  });
}

module.exports = {
  // User
  // Изменил количество аргументов метода resolver согласно документаци GraphQL
  user (obj, { id }, context) {
    return models.User.findById(id);
  },

  users (root, args, context) {
    /*
    Удалил аргументы функции findAll, т.к. context содержит контекстную информацию,
    а функция findAll принимает в качестве параметров условия для результирующей выборки, в данном случае
    context, не содержат таких условий, {} - также не содержит условий
    */
    return models.User.findAll();
  },

  usersById (obj, { id }, context) {
    return models.User.findAll({
      where: {
        id: {
          $in: id
        }
      }
    });
  },

  // Room
  // Изменил количество аргументов метода resolver согласно документаци GraphQL
  room (obj, { id }, context) {
    return models.Room.findById(id);
  },

  rooms (root, args, context) {
    /*
    Удалил аргументы функции findAll, т.к. context содержит контекстную информацию,
    а функция findAll принимает в качестве параметров условия для результирующей выборки, в данном случае
    context, не содержат таких условий, {offset: 1} - выберает данные со смещением 1, что в данном случае не нужно
    */
    return models.Room.findAll();
  },

  // Event
  // Изменил количество аргументов метода resolver согласно документаци GraphQL
  event (obj, { id }, context) {
    return models.Event.findById(id);
  },

  events (root, args, context) {
    /*
    Удалил аргументы функции findAll, т.к. argumets не определённая переменная, context содержит контекстную информацию,
    а функция findAll принимает в качестве параметров условия для результирующей выборки, в данном случае
    ни argumets ни context, не содержат таких условий.
    */
    return models.Event.findAll();
  },

  freeRooms (obj, { capacityIn, dateStartIn, dateEndIn }, context) {
    return models.RoomsEvents.findAll({
      attributes: [[Sequelize.literal('DISTINCT `id`'), 'id'], 'title', 'floor'],
      where: {
        $and: [
          {
            $or: [
              {
                $and: [
                  {dateStart: {$gte: dateStartIn}},
                  {dateStart: {$gte: dateEndIn}}
                ]
              },
              {
                $and: [
                  {dateEnd: {$lte: dateStartIn}},
                  {dateEnd: {$lte: dateEndIn}}
                ]
              },
              {
                $and: [
                  {dateEnd: {$eq: null}},
                  {dateEnd: {$eq: null}}
                ]
              }
            ]
          },
          {
            capacity: {$gte: capacityIn}
          }
        ]
      }
    });
  },

  floors (obj, args, context) {
    return models.Room.findAll({attributes: [[Sequelize.literal('DISTINCT `floor`'), 'floor']], order: [['floor', 'ASC']]});
  },

  roomsByFloor (obj, { floor }, context) {
    return models.Room.findAll({
      order: [['capacity', 'DESC']],
      where: {floor: floor}
    });
  },

  scheduleEvents (obj, { room_id, date }, context) {
    return models.ScheduleEvents.findAll({
      attributes: ['room_id', 'capacity', 'floor', 'event_id', 'start', 'end', 'date'],
      where: {
        $and: [
          {
            room_id: room_id
          },
          {
            date: date
          }
        ]
      }
    });
  },

  infoEvents (obj, { id }, context) {
    return models.InfoEvents.findAll({
      attributes: ['id', 'title', 'room', 'dateStart', 'dateEnd'],
      where: {id: id}
    });
  },

  userEvents (obj, { event_id }, context) {
    return models.UserEvents.findAll({
      attributes: ['user_id', 'login', 'event_id', 'avatarUrl'],
      where: {
        event_id: event_id
      },
      limit: 1
    });
  },

  countUsers (obj, { event_id }, context) {
    return models.UserEvents.count({
      where: {
        event_id: event_id
      }
    });
  },

  busyRoom (obj, { date }, context) {
    return sequelize.query('SELECT se.room_id as id, ' +
      'sum(strftime("%s", se.dateEnd) - strftime("%s", "00:00:00")) - sum(strftime("%s", se.dateStart) - strftime("%s", "00:00:00")) as day_time, ' +
      'sum(strftime("%s", "23:00:00") - strftime("%s", "00:00:00")) - sum(strftime("%s", "08:00:00") - strftime("%s", "00:00:00")) as full_day_time ' +
      'FROM ScheduleEvents se ' +
      'WHERE se.date = :date ' +
      'GROUP BY se.room_id ' +
      'HAVING sum(strftime("%s", se.dateEnd) - strftime("%s", "00:00:00")) - sum(strftime("%s", se.dateStart) - strftime("%s", "00:00:00")) = sum(strftime("%s", "23:00:00") - strftime("%s", "00:00:00")) - sum(strftime("%s", "08:00:00") - strftime("%s", "00:00:00"))',
      { replacements:
      {
        date: date
      },
        type: sequelize.QueryTypes.SELECT
      }
    );
  },

  getRecommendation (obj, { capacityIn, dateStartIn, dateEndIn, users }, context) {
    dateStartIn = moment(dateStartIn).utc().format('YYYY-MM-DD HH:mm:ss.SSS Z');
    dateEndIn = moment(dateEndIn).utc().format('YYYY-MM-DD HH:mm:ss.SSS Z');
    let date = moment(dateEndIn, 'YYYY-MM-DD HH:mm:ss.SSS Z').utc().format('YYYY-MM-DD');

    return freeRoomsByDate(capacityIn, dateStartIn, dateEndIn, users).then((rooms) => {
      if (rooms.length > 0) {
        return rooms;
      } else {
        return getSwapRoom(date, dateStartIn, dateEndIn, capacityIn).then((swapRoom) => {
          if (swapRoom) {
            let arrayOfPromises = swapRoom.event.map((event) => {
              let id = event[0];
              let roomId = event[1];
              return RoomsSwap(obj, { id, roomId }, context);
            });

            return Promise.all(arrayOfPromises);
          } else {
            return false;
          }
        }).then((room) => {
          if (room) return freeRoomsByDate(capacityIn, dateStartIn, dateEndIn, users);
          else return getFirstFreeRomms(capacityIn, dateStartIn, dateEndIn, users);
        });
      }
    });
  }
};
