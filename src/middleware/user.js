import Joi from '@hapi/joi';


 const username = Joi.string()
    .alphanum()
    .min(4)
    .max(30)
    .required()
    .label('Username')
 const password = Joi.string()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .label('Password')
    .options({
      language: {
        string: {
          regrex: {
            base: 'Must contain atleast one lowercase, one uppercase and number'
          }
        }
      }
    })
 const name = Joi.string()
    .max(100)
    .required()
    .label('Name')
const  email = Joi.string()
    .email()
    .required()
    .label('Email')


export const signUp  = Joi.object().keys({
  email, username, password, name
})

export const signIn = Joi.object().keys({
  email, password
})
