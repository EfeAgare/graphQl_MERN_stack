import { AuthenticationError } from 'apollo-server-express';
import { User } from '../models';
import { compareSync } from 'bcryptjs';

export const checkSignedIn = req => {
  if (!req.session.userId) {
    throw new AuthenticationError('You must be signed in');
  }
};

export const checkSignOut = req => {
  if (req.session.userId) {
    throw new AuthenticationError('You are already signed in');
  }
};

export const attemptSignIn = async args => {
  const user = await User.where({ email: args.email }).exec();
  if (user.length === 0) {
    throw new AuthenticationError('Email/Password incorrect');
  }

  if (!compareSync(args.password, user[0].password)) {
    throw new AuthenticationError('Password incorrect');
  }

  return user[0];
};

export const signOut = (req, res) =>
  new Promise((resolve, reject) => {
    req.session.destroy(err => {
      if (err) reject(err);

      res.clearCookie(process.env.SESSION_NAME);

      resolve(true);
    });
  });
