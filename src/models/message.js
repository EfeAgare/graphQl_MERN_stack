import { Schema, model } from 'mongoose';

const messageSchema = new Schema(
  {
    title: String,
    body: String,
    sender: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    chat: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Chat'
      }
    ]
  },
  {
    timestamps: true
  }
);  

const Message = model('Message', messageSchema);

export default Message;
 