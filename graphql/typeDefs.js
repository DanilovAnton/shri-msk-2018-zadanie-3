module.exports = `
scalar Date

type User {
    id: ID!
    login: String!
    homeFloor: Int!
    avatarUrl: String
}

type Room {
    id: ID!
    title: String!
    capacity: Int!
    floor: Int!
}

type Event {
    id: ID!
    title: String!
    dateStart: Date!
    dateEnd: Date!
    users: [User]!
    room: Room!
}

type RoomsEvents {
    id: ID!
    title: String!
    capacity: Int!
    floor: Int!
    dateStart: Date
    dateEnd: Date
}

type FreeRooms {
    id: ID
    title: String
    floor: Int
}

type FreeRoomsWithDate {
    id: ID
    title: String
    floor: Int
    dateStart: String
    dateEnd: String
}

type Floor {
    floor: Int!
}

type ScheduleEvents {
    room_id: Int!
    capacity: Int!
    floor: Int!
    event_id: Int!
    start: String!
    end: String!
    date: String!
}

type InfoEvents {
    id: ID!
    title: String!
    room: String!
    dateStart: Date!
    dateEnd: Date!
}

type UserEvents {
    user_id: Int!
    login: String!
    event_id: Int!
    avatarUrl: String!
}

type BusyRoom {
  id: Int!
  day_time: String
  full_day_time: String
}

input UserInput {
    login: String!
    homeFloor: Int!
    avatarUrl: String
}

input UserUpdate {
    login: String
    homeFloor: Int
    avatarUrl: String
}

input RoomInput {
    title: String!
    capacity: Int!
    floor: Int!
}

input RoomUpdate {
    title: String
    capacity: Int
    floor: Int
}

input EventInput {
    title: String!
    dateStart: Date!
    dateEnd: Date!
}

input EventUpdate {
    title: String
    dateStart: Date
    dateEnd: Date
}

type Query {
  user(id: ID!): User
  users: [User]
  usersById(id: [ID]!): [User]
  
  room(id: ID!): Room
  rooms: [Room]
  roomsByFloor(floor: Int!): [Room]
    
  event(id: ID!): Event
  events: [Event]
  
  freeRooms(capacityIn: Int!, dateStartIn: Date!, dateEndIn: Date!): [FreeRooms]
  
  floors: [Floor]
  
  scheduleEvents(room_id: Int!, date: String!): [ScheduleEvents]
  
  infoEvents(id: ID!): [InfoEvents]
  
  userEvents(event_id: Int!): [UserEvents]
  
  countUsers(event_id: Int!): Int
  
  getRecommendation(capacityIn: Int!, dateStartIn: Date!, dateEndIn: Date!, users: [Int!]): [FreeRoomsWithDate]
  
  busyRoom(date: String!): [BusyRoom]
}

type Mutation {
  createUser(input: UserInput!): User
  updateUser(id: ID!, input: UserUpdate!): User
  removeUser(id: ID!): User

  createRoom(input: RoomInput!): Room
  updateRoom(id: ID!, input: RoomUpdate!): Room
  removeRoom(id: ID!): Room

  createEvent(input: EventInput!, usersIds: [ID]!, roomId: ID!): Event
  updateEvent(id: ID!, input: EventUpdate!): Event
  addUsersToEvent(id: ID!, usersIds: [ID]!): Event
  removeUsersFromEvent(id: ID!, usersIds: [ID]!): Event
  changeEventRoom(id: ID!, roomId: ID!): Event
  removeEvent(id: ID!): Event
}
`;
