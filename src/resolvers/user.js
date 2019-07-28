import Joi from '@hapi/joi';
import { User } from '../models';
import mongoose from 'mongoose';
import { UserInputError } from 'apollo-server-express';
import * as Auth from '../middleware/auth';
import { signUp, signIn } from '../middleware/user';

// TODO: AUTH, projection

export default {
  Query: {
    me: (root, args, context, info) => {

      // Auth.checkSignedIn(context.req);
      return User.findById(context.req.session.userId);
    },
    users: (root, args, context, info) => {
      // Auth.checkSignedIn(context.req);
      return User.find({});
    },
    user: (root, args, context, info) => {
      // Auth.checkSignedIn(context.req);
      if (!mongoose.Types.ObjectId.isValid(args.id)) {
        throw new UserInputError(`${args.id} is not a valid User Id `);
      }
      return User.find(args.id);
    }
  },
  Mutation: {
    //
    signUp: async (root, args, context, info) => {
      // Auth.checkSignOut(context.req);


      await Joi.validate(args, signUp, { abortEarly: false });

      const user = await User.create(args);

      context.req.session.userId = user.id;
      // console.log(user.id);
      // console.log(context.req);
      return user;
    },

    //
    signIn: async (root, args, context, info) => {
      // const { userId } = context.req.session;

      // if (userId) {
      //   return User.findById(userId);
      // }
      await Joi.validate(args, signIn, { abortEarly: false });
      const user = await Auth.attemptSignIn(args);

      context.req.session.userId = user.id;

      return user;
    },

    //
    signOut: async (root, args, context, info) => {
      // Auth.checkSignedIn(context.req);

      return Auth.signOut(context.req, context.res);
    }
  }
};
