import { load } from 'graphql-load';
import UserType from './User';
import UserResolver from './User.resolver';

load({
    typeDefs: [UserType],
    resolvers: [UserResolver],

});