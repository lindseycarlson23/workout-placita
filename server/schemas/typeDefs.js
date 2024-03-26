const typeDefs = `
type User {
  _id: ID
  name: String!
  email: String!
  password: String!
  workouts: [Workout]
  comments: [Comment]
  friends: [User]
  createdAt: String
}
type Workout {
  _id: ID
  workoutTitle: String
  workoutText: String
  workoutType: String
  url: String
  createdAt: String
  comments: [Comment]
  commentCount: Int
}
type Comment {
  _id: ID
  commentBody: String
  name: String
  createdAt: String
  replies: [Reply]
  canRemove: Boolean
}
type Reply {
  _id: ID
  replyBody: String
  name: String
  createdAt: String
  canRemove: Boolean
}




type Auth {
  token: ID!
  user: User
}

  type Query {
    users: [User]!
    user(userId: ID!): User
    workouts(userId: ID!, type: String): [Workout]
    workout(workoutId: ID!): Workout
    # Because we have the context functionality in place to check a JWT and decode its data, we can use a query that will always find and return the logged in user's data
    friendEmail(searchTerm: String!): [User]
    me: User
  }

  type Mutation {
    addUser(name: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addWorkout(workoutTitle: String!, workoutText: String!, workoutType: String!, url: String!): Workout
    removeUser: User
    removeWorkout(workout: String!): User
    addComment(commentBody: String!, workoutId: ID!): Comment
    replyComment(replyBody: String!, commentId: ID!): Reply
    removeComment(commentId: ID!, workoutId: ID!): Comment
    removeReply(replyId: ID!): Reply
    addFriend(friendId: ID!): User
    removeFriend(friendId: ID!): User
    editWorkout(workoutId: ID!, workoutTitle: String, workoutText: String, workoutType: String, url: String): Workout
  }
`;

module.exports = typeDefs;