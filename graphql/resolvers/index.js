const GraphQLDate = require('graphql-date');

const query = require('./query');
const mutation = require('./mutation');

module.exports = function resolvers () {
  return {
    Query: query,
    Mutation: mutation,
    Event: {
      users (event) {
        return event.getUsers(); // Добавил return, т.к. необходимо вернуть данные при выборке
      },
      room (event) {
        return event.getRoom(); // Добавил return, т.к. необходимо вернуть данные при выборке
      }
    },
    Date: GraphQLDate
  };
};
