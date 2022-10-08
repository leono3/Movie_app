const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

// Create resolvers for getting data from the database
const resolvers = {
  Query: {
    user: async (parent, { username, _id }, context) => {
      try {
        return await User.findOne({
          $or: [{ _id: _id }, { username }],
        });
      } catch (error) {
        throw new Error(error);
      }
    },
    me: async (parent, args, context) => {
      try {
        const user = User.findById(context.user._id);
        if (!user) throw new Error({ message: "Not logged in!" });
        return user;
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const newUser = await User.create({ username, email, password });

      const token = signToken({
        email: newUser.email,
        username: newUser.username,
        _id: newUser._id,
      });
      return { token, newUser };
    },
    // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
    // {body} is destructured req.body
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken({
        email: user.email,
        username: user.username,
        _id: user._id,
      });
      return { token, user };
    },
    // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
    // user comes from `req.user` created in the auth middleware function
    saveMovie: async (parent, args, context) => {
      console.log("THIS WILL FIRE IF WE HIT THIS LINE");
      try {
        if (context.user) {
          return await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedMovies: args } },
            { new: true, runValidators: true }
          );
        } else throw new Error({ message: "Not logged in!" });
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    // remove a book from `savedBooks`
    removeMovie: async (parent, args, context) => {
      try {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedMovies: { ...args } } },
            { new: true }
          );
          if (!updatedUser) {
            return { message: "Couldn't find user with this id!" };
          }
          return updatedUser;
        } else throw new Error({ message: "Not logged in!" });
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

module.exports = resolvers;
