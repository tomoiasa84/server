const userResolvers = {
  Query: {
    get_users: (root, args, {
      knex
    }) => {

      //Return all users
      return knex('Users').select()
        .then((users) => {

          return users;
        });
    },
    get_user: (root, {
      userId
    }, {
      knex
    }) => {

      return knex('Users').where('id', userId).first()

    }
  },

  User: {
    cards_feed: (user, args, {
      knex
    }) => {

      return knex('Connections').select()
        .then(connections => {

          if(connections.length){

            let cards = []
            connections.forEach(conn => {
              
              cards.push(knex('Cards').where('postedBy',conn.targetUser).first());
              
            })
            return Promise.all(cards);
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

      return knex('UserMessageThreads').where('user', user.id).first()
        .then(userThread => {

          if (userThread) {

            return knex('MessageThreads').where('id', userThread.thread);
          }
        })
    },
    tags: (user, args, {
      knex
    }) => {

      return knex('UserTags').where('user', user.id)
        .then((data) => {

          let tags = [];

          if (data.length) {

            data.forEach(userTag => {

              tags.push(knex('Tags').where('id', userTag.tag).first())
            })
          }
          return Promise.all(tags);

        })

    },
    cards: (user, args, {
      knex
    }) => {

      return knex('Cards').where('postedBy', user.id);
    },
    location: (user, args, {
      knex
    }) => {

      //Resolve Location relation
      return knex('Locations').where('id', user.location).first();
    },
    settings: (user, args, {
      knex
    }) => {

      return knex('UserSettings').where('user', user.id)
      .then((settings) => {

        let settingsList = [];
        settings.forEach(setting => {

          settingsList.push(knex('Settings').where('id',setting.setting).first())
        })
        return Promise.all(settingsList);
      })
    },
    connections: (user, args, {
      knex
    }) => {

      //Find friends of current user
      return knex('Connections').where('originUser',user.id)
        .then((connections) => {
          
          if(connections.length){

            let usersList = []
            connections.forEach(conn => {
              
              usersList.push(knex('Users').where('id',conn.targetUser).first());
              
            })
            return Promise.all(usersList);
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