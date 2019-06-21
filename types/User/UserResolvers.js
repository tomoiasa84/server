const userResolvers = {
  Query: {
    get_users: (root, args, { knex }) => {

      //Return all users
      return knex('userx').select()
        .then((users) => {

          return users;
        });
    },
    get_user:(root,{userId},{ knex })=>{

      return knex('userx').where('id',userId).first()

    }
  },
  
  User: {
    tags:(user) => {

      return knex('usertag').where('user_id',user.id)
      .then((data) => {

        let tags = [];
        
        if(data.length){

          data.forEach(userTag => {

            tags.push(knex('tag').where('id',userTag.tag_id).first())
          })
        }
        return Promise.all(tags);
        
      })
      
    },
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
      return knex('userfriend').where('userOrigin', user.id)
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