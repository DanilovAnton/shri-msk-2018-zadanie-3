'use strict';

const Sequelize = require('sequelize');

/*
Переменные должны отличатся не только регистром символов,
лучше дать уникальное название отображающее назначение данной переменной
*/
module.exports = function (connection) {
  const User = connection.define('User', {
    login: {
      type: Sequelize.STRING,
      unique: true, // Поле login должно быть уникальным т.к. не может быть 2х пользователей с одинаковым логинами
      allowNull: false, // login обязательное поле т.к. не может быть пользователя без имени
      validate: {
        len: [1, 100], // Поле login должно содержать более 2 символов, но не больше 100
        isAlphanumeric: true // Поле login должно состоять из буквенно цифровых символов
      }
    },
    homeFloor: {
      type: Sequelize.TINYINT,
      allowNull: false // homeFloor обязательное поле т.к. используется при анализе удаленности переговорки от участника
    },
    avatarUrl: {
      type: Sequelize.STRING,
      validate: {
        isUrl: true // Поле avatarUrl должно быть ссылкой
      }
    }
  });

  const Room = connection.define('Room', {
    title: {
      type: Sequelize.STRING,
      allowNull: false, // title обязательное поле т.к. необходимо для идентификации
      validate: {
        len: [1, 255] // Поле title должно содержать более 2 символов, но не больше 255
      }
    },
    capacity: {
      type: Sequelize.SMALLINT,
      allowNull: false // capacity обязательное поле т.к. необходимо для определине кол-ва людей
    },
    floor: {
      type: Sequelize.TINYINT,
      allowNull: false // floor обязательное поле т.к. необходимо для идентификации
    }
  });

  const Event = connection.define('Event', {
    title: {
      type: Sequelize.STRING,
      allowNull: false, // title обязательное поле т.к. необходимо для идентификации
      validate: {
        len: [1, 255] // Поле title должно содержать более 2 символов, но не больше 255
      }
    },
    dateStart: {
      type: Sequelize.DATE,
      allowNull: false // dateStart обязательное поле т.к. необходимо для расчета времени использования
    },
    dateEnd: {
      type: Sequelize.DATE,
      allowNull: false // dateEnd обязательное поле т.к. необходимо для расчета времени использования
    }
  });

  const RoomsEvents = connection.define('RoomsEvents', {
    title: {
      type: Sequelize.STRING,
      allowNull: false, // title обязательное поле т.к. необходимо для идентификации
      validate: {
        len: [1, 255] // Поле title должно содержать более 2 символов, но не больше 255
      }
    },
    capacity: {
      type: Sequelize.SMALLINT,
      allowNull: false // capacity обязательное поле т.к. необходимо для определине кол-ва людей
    },
    floor: {
      type: Sequelize.TINYINT,
      allowNull: false // floor обязательное поле т.к. необходимо для идентификации
    },
    dateStart: {
      type: Sequelize.DATE
    },
    dateEnd: {
      type: Sequelize.DATE
    }
  });

  const ScheduleEvents = connection.define('ScheduleEvents', {
    room_id: {
      type: Sequelize.SMALLINT,
      allowNull: false
    },
    capacity: {
      type: Sequelize.SMALLINT,
      allowNull: false
    },
    floor: {
      type: Sequelize.TINYINT,
      allowNull: false
    },
    event_id: {
      type: Sequelize.SMALLINT,
      allowNull: false
    },
    start: {
      type: Sequelize.STRING,
      allowNull: false
    },
    end: {
      type: Sequelize.STRING,
      allowNull: false

    },
    date: {
      type: Sequelize.STRING,
      allowNull: false
    },
    dateStart: {
      type: Sequelize.DATE,
      allowNull: false
    },
    dateEnd: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });

  const InfoEvents = connection.define('InfoEvents', {
    title: {
      type: Sequelize.STRING,
      validate: {
        len: [1, 255]
      }
    },
    room: {
      type: Sequelize.STRING
    },
    dateStart: {
      type: Sequelize.DATE
    },
    dateEnd: {
      type: Sequelize.DATE
    }
  });

  const UserEvents = connection.define('UserEvents', {
    user_id: {
      type: Sequelize.SMALLINT
    },
    event_id: {
      type: Sequelize.SMALLINT
    },
    login: {
      type: Sequelize.STRING,
      validate: {
        len: [1, 255]
      }
    },
    avatarUrl: {
      type: Sequelize.STRING
    }
  });

  Event.belongsToMany(User, {
    through: 'Events_Users',
    foreignKey: 'EventId' // Добавил поле вторичного ключа
  });

  User.belongsToMany(Event, {
    through: 'Events_Users',
    foreignKey: 'UserId' // Добавил поле вторичного ключа
  });

  Event.belongsTo(Room, { foreignKey: 'RoomId' }); // Добавил поле вторичного ключа

  return {
    Room,
    Event,
    User,
    RoomsEvents,
    ScheduleEvents,
    InfoEvents,
    UserEvents
  };
};
