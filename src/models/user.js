import { Schema, model } from 'mongoose';
import { hashSync } from 'bcryptjs';

const userSchema = new Schema(
  {
    email: {
      type: String,
      validate: {
        validator: async email => await User.alreadyExist({ email }),
        message: () => ` Email  has already been taken`
      }
    },
    // email: String,
    username: {
      type: String,
      validate: {
        validator: async username => await User.alreadyExist({ username }),
        message: () => ` Username has already been taken`
      }
    },
    chats: [{
     type: Schema.Types.ObjectId,
     ref: 'Chat'
    }],
    username: String,
    name: String,
    password: String
  },
  {
    timestamps: true
  }
);

// hook for password

userSchema.pre('save', function() {
  if (this.isModified('password')) {
    this.password = hashSync(this.password, 10);
  }
});

// static methods
userSchema.statics.alreadyExist = async function(options) {
  const user = await this.find(options).exec();
  if (user.length === 0) {
    return true;
  } else {
    return false;
  }
};

// return this.where(options).countDocuments() === 0;

// userSchema.statics.matchesPassword = function(password) {
//   return compare(password, this.password);
// };

const User = model('User', userSchema);

export default User;
