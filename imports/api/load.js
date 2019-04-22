import { load } from 'graphql-load';
import UserType from './User';


load({
    //Entities,
    typeDefs: [UserType],
    resolvers: {
        Query: {
            users: () => {return [{"id":"1", "name":"A"}] }
        }
    }

});