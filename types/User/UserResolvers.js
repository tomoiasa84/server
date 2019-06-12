const knex = require('../../db/pgAdaptop');

const userResolvers = {
  Query: {
    users: (root, args, ctx) => {

      //Return all users
      return knex('userx').select()
        .then((users) => {

          return users;
        });
    }
  },
  Mutation: {

    createConnection(obj, { id1,id2 }, context) {

      console.log(id1,id2);
      return {
        status: 'ok'
      }
    }
  },
  User: {

    location(user) {

      //Resolve Location relation
      return knex('location').where('id', user.location).first();
    },
    privacy(user) {

      //Resolve privacy relation
      return knex('privacy').where('id', user.privacy).first();
    },
    connections(user) {

      //Find friends of current user
      return knex('userfriend').where('userTarget', user.id)
        .then((friendsRec) => {

          if (friendsRec) {
            let users = [];
            friendsRec.forEach(friendRow => {

              users.push(knex('userx').where('id', friendRow.userOrigin).first())
            })
            return Promise.all(users);
          }

        })
    }
  }
};

module.exports = userResolvers;