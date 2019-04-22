import { load } from 'graphql-load';
import UserxType from './entities/Userx';


load({
    //Entities,
    typeDefs: [UserxType],
    resolvers: {
        Query: {
            users: () => {return [{"id":"1", "name":"A"}] }
        }
    }

});