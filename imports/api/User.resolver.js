import { sequelize } from './connectors';
//import { User } from './connectors';

export default {
    Query:{
       
       users(_, args, ctx) {
            const usersQuery = 'select id, name from userx';
            //return User.findAll();
            return [{"id":"1", "name":"A"}, {"id":"2", "name":"B"}]
          }

    }
}

