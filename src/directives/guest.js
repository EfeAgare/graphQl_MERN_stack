import { SchemaDirectiveVisitor } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';
import * as Auth from '../middleware/auth';

class GuessDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(...args) {
      const [ , , context] = args
      Auth.checkSignOut(context.req)
      return resolve.apply(this, args); 
    };
  }
}

export default GuessDirective;
