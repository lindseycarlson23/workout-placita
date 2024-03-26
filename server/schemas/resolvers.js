const { User, Workout, Comment, Reply } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate("workouts").populate("friends");
    },
    user: async (parent, { userId }) => {
      return User.findOne({ _id: userId }).populate("workouts").populate("friends");
    },
    workout: async (parent, { workoutId }, context) => {
      const workout = await Workout.findOne({ _id: workoutId }).populate({
        path: "comments",
        populate: {
          path: "replies",
          model: "Reply"
        }
      });

      const currentUser = context.user?.name;
      workout.comments.forEach(comment => {
        comment.canRemove = comment.name === currentUser;
        comment.replies.forEach(reply => {
          reply.canRemove = reply.name === currentUser;
        });
      });

      return workout;
    },
    workouts: async (parent, { userId, type }) => {
      const params = userId ? { userId } : {};
      if(type) params.workoutType = type;
      return Workout.find(params).sort({ createdAt: -1 });
    },
    
    // By adding context to our query, we can retrieve the logged in user without specifically searching for them
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("friends");
      }
      throw AuthenticationError;
    },
    friendEmail: async (parent, { searchTerm }) => {
      return User.find({ email: { $regex: searchTerm, $options: "i" } });
    }
  },
  Mutation: {
    //this allows us to add new users
    addUser: async (parent, { name, email, password }) => {
      const user = await User.create({ name, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      console.log(user);
      if (!user) {
        throw AuthenticationError;
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }
      const token = signToken(user);
      return { token, user };
    },
    //this allows us to add a new workout
    addWorkout: async (parent, { workoutTitle, workoutText, workoutType, url }, context) => {
      if (context.user) {
        const workout = await Workout.create({
          workoutTitle,
          workoutText,
          workoutType,
          url,
          userId: context.user._id,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { workouts: workout._id },
          },
          {
            new: true,
            runValidators: true,
          }
        );

        return workout;
      }
    },
    
    addFriend: async (_, { friendId }, { user }) => {
      if (!user) throw AuthenticationError;

      // const currentUser = await findUserById(user._id);
      const friendUser = await User.findOneAndUpdate({ _id: user._id }, { $addToSet: { friends: friendId } });

 

      return friendUser;
    },

    removeFriend: async (_, { friendId }, { user }) => {
      if (!user) throw AuthenticationError;

      // const currentUser = await findUserById(user._id);
      const friendUser = await User.findOneAndUpdate({ _id: user._id }, { $pull: { friends: friendId } });

      return friendUser;
    },

    //This allows us to remove a user
    removeUser: async (parent, args, context) => {
      if (context.user) {
        return User.findOneAndDelete({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
    //this allows us to remove a workout
    removeWorkout: async (parent, { workoutId }, context) => {
      if (context.user) {
        const workout = await Workout.findOneAndDelete({
          _id: workoutId,
          userId: context.user._id,
        });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { workouts: workout._id } },
          { new: true }
        );

        return workout;
      }
      throw AuthenticationError;
    },
    //This allows us to edit a workout
    editWorkout: async (parent, { workoutId, workoutTitle, workoutText, workoutType, url }, context) => {
      if (context.user) {
        const workout = await Workout.findOneAndUpdate(
          { _id: workoutId },
          {
            workoutTitle,
            workoutText,
            workoutType,
            url,
          },
          { new: true }
        );
        return workout;
      }
      throw AuthenticationError;
    },

    //This allows us to add a comment
    addComment: async (parent, { commentBody, workoutId }, context) => {
      if (context.user) {
        const comment = await Comment.create({
          commentBody,
          name: context.user.name,
        });
        const workout = await Workout.findOneAndUpdate(
          { _id: workoutId },
          { $addToSet: { comments: comment._id } },
          { new: true }
        );
        return comment;
      }
      throw AuthenticationError;
    },
    //This allows us to reply to a comment
    replyComment: async (parent, { replyBody, commentId }, context) => {
      if (context.user) {
        const reply = await Reply.create({
          replyBody,
          name: context.user.name,
        });
        const comment = await Comment.findOneAndUpdate(
          { _id: commentId },
          { $addToSet: { replies: reply._id } },
          { new: true }
        );
        return reply;
      }
      throw AuthenticationError;
    },
    //This allows us to remove a comment
    removeComment: async (parent, { commentId, workoutId }, context) => {
      const comment = await Comment.findOne({ _id: commentId });

      if (context.user.name === comment.name) {
        await Comment.findOneAndDelete({ _id: commentId });
        await Reply.deleteMany({ commentId: commentId });
        await Workout.findOneAndUpdate(
          { _id: workoutId },
          { $pull: { comments: commentId } }
        );
        return comment;
      }

      throw AuthenticationError;
    },

    //This allows us to remove a reply
    removeReply: async (parent, { replyId }, context) => {
      const reply = await Reply.findOne({ _id: replyId });

      if (context.user.name === reply.name) {
        const comment = await Comment.findOne({ 'replies': { $in: [replyId] } });
        await Comment.findOneAndUpdate(
          { _id: comment._id },
          { $pull: { replies: replyId } }
        );
        await Reply.findOneAndDelete({ _id: replyId });
        return reply;
      }

      throw AuthenticationError;
    }
  }
};


module.exports = resolvers;
