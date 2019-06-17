const knex = require('../../db/pgAdaptop');

const tagResolvers = {
    Query: {
      get_tags: (root, args, context) => {
        
        return knex('tag').select()
        .then((tags)=>{

          return tags;
        }) 
      },
      get_tag: (root,{tagId},context) => {

        console.log(tagId);
        
        return knex('tag').where('id',tagId).first()
        .then((data) => {

          console.log(data);
          
          return data;
        }) 
      }
    },
  };
module.exports = tagResolvers;