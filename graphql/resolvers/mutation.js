const { models } = require('../../models');

module.exports = {
  // User
  createUser (root, { input }, context) {
    return models.User.create(input);
  },

  updateUser (root, { id, input }, context) {
    // Уменьшил стрелочную функцию
    return models.User.findById(id).then(user => user.update(input));
  },

  removeUser (root, { id }, context) {
    return models.User.findById(id).then(user => user.destroy());
  },

  // Room
  createRoom (root, { input }, context) {
    return models.Room.create(input);
  },

  updateRoom (root, { id, input }, context) {
    // Уменьшил стрелочную функцию
    return models.Room.findById(id).then(room => room.update(input));
  },

  removeRoom (root, { id }, context) {
    return models.Room.findById(id).then(room => room.destroy());
  },

  // Event
  createEvent (root, { input, usersIds, roomId }, context) {
    return models.Event.create(input).then(event => {
      event.setRoom(roomId);

      return event.setUsers(usersIds).then(() => event);
    });
  },

  updateEvent (root, { id, input }, context) {
    return models.Event.findById(id).then(event => event.update(input));
  },

  // Изменил метод удаления пользователй так, чтобы можно было удалять сразу несколько пользователей
  removeUsersFromEvent (root, { id, usersIds }, context) {
    return models.Event.findById(id).then(event =>
      event.removeUsers(usersIds).then(() => event)
    );
  },

  // Добавил метод добавления пользователей к мероприятию
  addUsersToEvent (root, { id, usersIds }, context) {
    return models.Event.findById(id).then(event =>
      event.addUsers(usersIds).then(() => event)
    );
  },

  /*
  Метод должен возвращать, изменил стрелочную функцию,
  в функцию event.setRoom(roomId) необходимо передавать id комнаты, а не id мероприятия
   */
  changeEventRoom (root, { id, roomId }, context) {
    return models.Event.findById(id).then(event => event.setRoom(roomId));
  },

  removeEvent (root, { id }, context) {
    return models.Event.findById(id).then(event => event.destroy());
  }
};
