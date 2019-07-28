import { Schema, model } from 'mongoose';

const chatSchema = new Schema(
  {
    title: String,
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    lastMessage: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message'
      }
    ]
  },
  {
    timestamps: true
  }
);  

const Chat = model('Chat', chatSchema);

export default Chat;
