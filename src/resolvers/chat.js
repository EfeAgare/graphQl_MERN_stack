import { startChat } from '../middleware/chat';
import Joi from '@hapi/joi';
import User from '../models/user';
import { UserInputError } from 'apollo-server-express';
import Chat from '../models/chat';
import Message from '../models/message';

export default {
  Mutation: {
    startChat: async (root, args, context, info) => {
      const { userId } = context.req.session;
      const { title, userIds } = args;
      await Joi.validate(args, startChat(userId), { abortEarly: false });
      const userIDs = await User.where('_id')
        .in(userIds)
        .exec();

      if (userIDs.length !== userIds.length) {
        throw new UserInputError('One or more userIds are invalid');
      }
      userIds.push(userId);
      const chat = await Chat.create({ title, users: userIds });

      await User.updateMany(
        { _id: { $in: userIds } },
        {
          $push: { chats: chat }
        }
      );
      return chat;
    }
  },
  Chat: {
    messages: (chat, args, context, info) => {
      // TODO: pagination, projection
      return Message.find({ chat: chat.id })
    },
    users: async (chat, args, context, info) => {
      return (await chat.populate('users').execPopulate()).users
    },
    lastMessage: async (chat, args, context, info) => {
      return (await chat.populate('lastMessage').execPopulate()).lastMessage
    }
  }
};
