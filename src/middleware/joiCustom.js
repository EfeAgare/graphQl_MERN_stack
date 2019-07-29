import Joi from '@hapi/joi';
import mongoose from 'mongoose';

export const objectId = {
  base: Joi.string(),
  name: 'string',
  language: {
    objectId: 'Must be a valide objectId'
  },
  rules: [
    {
      name: 'objectId',
      validate(params, value, state, prefs) {
        // console.log(params)
        if (!mongoose.Types.ObjectId.isValid(value)) {
          // Generate an error, state and prefs need to be passed
          return this.createError('string.objectId', {}, state, prefs);
        }

        return value; // Everything is OK
      }
    }
  ]
};

export default Joi.extend(objectId);
