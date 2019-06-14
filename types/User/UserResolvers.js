const knex = require('../../db/pgAdaptop');

const userResolvers = {
  Query: {
    get_users: (root, args, ctx) => {

      //Return all users
      return knex('userx').select()
        .then((users) => {

          return users;
        });
    },
    get_user:(root,{id},context)=>{

      return knex('userx').where('id',id).first()

    }
  },
  
  User: {
    cards:(user)=>{

      return knex('card').where('postedBy',user.id);
    },
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