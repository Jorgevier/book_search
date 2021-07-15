const { User, Book } = require('../server/models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../server/utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) =>{
      if (context.user){
        const userData = await User.findOne({})
        .select('-_v -password')
        .populate('books')
        return userData;
      }
      throw new AuthenticationError('You are not logged in')
    },  
    },
mutation:{
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
  return { token, user };
  },
login: async (parent, { email, password }) => {
      const user = await User.findOne({ email }
        );
if (!user) {
          throw new AuthenticationError('Incorrect username or password');
      }

      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
          throw new AuthenticationError('Incorrect password');
      }
      const token = signToken(user);
      return { token, user };

  },

  saveBook: async (parent, args, context) => {
      if (context.user) {
      const updateUser = await User.findByIdAndUpdate(
              { _id: context.user._id },
              { $addToSet: { savedBooks: args.input } },
              { new: true }
          );
    return updateUser;
      }

      throw new AuthenticationError('Please log In!');
  },
  removeBook: async (parent, args, context) => {
      if (context.user) {
          const updateUser = await User.findOneAndUpdate(
              { _id: context.user._id },
              { $pull: { savedBooks: { bookId: args.bookId } } },
              { new: true }
          );
          return updateUser;
      }
      throw new AuthenticationError('You need to logged in!');
  }
}
};

module.exports = resolvers;
