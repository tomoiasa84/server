const userResolvers = {
  Query: {
    get_users: (root, args, {
      knex
    }) => {

      //Return all users
      return knex('userx').select()
        .then((users) => {

          return users;
        });
    },
    get_user: (root, {
      userId
    }, {
      knex
    }) => {

      return knex('userx').where('id', userId).first()

    }
  },

  User: {
    cards_feed: (user, args, {
      knex
    }) => {

      return knex('userfriend').select()
        .then(connections => {

          if (connections.length) {

            let cards = [];
            connections.forEach(conn => {

              if(user.id === conn.user1){

                cards.push(knex('card').where('postedBy', conn.user2).first()
                .then(res => {
                  console.log(res);
                  return res
                
                }))
              }
              else if(user.id === conn.user2){

                cards.push(knex('card').where('postedBy', conn.user1).first()
                .then(res => {
                  console.log(res);
                  return res
                
                }))
              }
            })
            return Promise.all(cards)
          }
          return [];
        })
        .catch(err => {

          console.log(err);
          return [];
        })
    },
    thread_messages: (user, args, {
      knex
    }) => {

      return knex('message_thread_user').where('user', user.id).first()
        .then(userThread => {

          if (userThread) {

            return knex('message_thread').where('id', userThread.thread);
          }
        })
    },
    tags: (user, args, {
      knex
    }) => {

      return knex('usertag').where('user_id', user.id)
        .then((data) => {

          let tags = [];

          if (data.length) {

            data.forEach(userTag => {

              tags.push(knex('tag').where('id', userTag.tag_id).first())
            })
          }
          return Promise.all(tags);

        })

    },
    cards: (user, args, {
      knex
    }) => {

      return knex('card').where('postedBy', user.id);
    },
    location: (user, args, {
      knex
    }) => {

      //Resolve Location relation
      return knex('location').where('id', user.location).first();
    },
    privacy: (user, args, {
      knex
    }) => {

      //Resolve privacy relation
      return knex('privacy').where('id', user.privacy).first();
    },
    connections: (user, args, {
      knex
    }) => {

      //Find friends of current user
      return knex('userfriend').select()
        .then((connections) => {

          if(connections.length){

            let friends = []
            connections.forEach(conn => {
              
              if(conn.user1 === user.id ){

                friends.push( knex('userx').where('id',conn.user2).first());
              }
              else if(conn.user2 === user.id){

                friends.push( knex('userx').where('id',conn.user1).first());
              }
            })
            
            return Promise.all(friends);

          }
          return [];
        })
        .catch(err => {

          console.log(err);
          return [];
          
        })
    }
  }
};

module.exports = userResolvers;