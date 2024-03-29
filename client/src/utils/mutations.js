import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        name
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($name: String!, $email: String!, $password: String!) {
    addUser(name: $name, email: $email, password: $password) {
      token
      user {
        _id
        name
      }
    }
  }
`;

export const ADD_WORKOUT = gql`
  mutation Mutation(
    $workoutTitle: String!
    $workoutText: String!
    $workoutType: String!
    $url: String!
  ) {
    addWorkout(
      workoutTitle: $workoutTitle
      workoutText: $workoutText
      workoutType: $workoutType
      url: $url
    ) {
      workoutTitle
      workoutText
      workoutType
      url
      createdAt
      _id
    }
  }
`;

export const REMOVE_WORKOUT = gql`
  mutation Mutation($workoutId: ID!) {
    removeWorkout(workoutId: $workoutId) {
      _id
    }
  }
`;

export const EDIT_WORKOUT = gql`
mutation Mutation($workoutId: ID!, $workoutTitle: String!, $workoutText: String!, $workoutType: String!, $url: String!) {
  editWorkout(workoutId: $workoutId, workoutTitle: $workoutTitle, workoutText: $workoutText, workoutType: $workoutType, url: $url) {
    workoutText
    workoutTitle
    workoutType
    url
  }
}
`;

export const ADD_COMMENT = gql`
  mutation Mutation($commentBody: String!, $workoutId: ID!) {
    addComment(commentBody: $commentBody, workoutId: $workoutId) {
      commentBody
      createdAt
      name
      _id
    }
  }
`;

export const REMOVE_COMMENT = gql`
  mutation Mutation($commentId: ID!, $workoutId: ID!) {
    removeComment(commentId: $commentId, workoutId: $workoutId) {
      _id
    }
  }
`;

export const REPLY_COMMENT = gql`
  mutation Mutation($replyBody: String!, $commentId: ID!) {
    replyComment(replyBody: $replyBody, commentId: $commentId) {
      replyBody
      name
      createdAt
    }
  }
`;

export const REMOVE_REPLY = gql`
  mutation Mutation($replyId: ID!) {
    removeReply(replyId: $replyId) {
      _id
    }
  }
`;

// Add a friend by their email
export const ADD_FRIEND = gql`
  mutation Mutation($friendId: ID!) {
    addFriend(friendId: $friendId) {
      name
      _id
      email
      friends {
        _id
      }
    }
  }
`;

// Remove a friend by their id
export const REMOVE_FRIEND = gql`
  mutation Mutation($friendId: ID!) {
    removeFriend(friendId: $friendId) {
      name
      _id
      email
      friends {
        _id
      }
    }
  }
`;
