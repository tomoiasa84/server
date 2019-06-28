const tagResolvers = {
    Query: {
      get_tags: (root, args, { knex }) => {
        
        return knex('Tags').select()
        .then((tags)=>{

          return tags;
        }) 
      },
      get_tag: (root,{tagId},{ knex }) => {

        console.log(tagId);
        
        return knex('Tags').where('id',tagId).first()
        .then((data) => {

          console.log(data);
          
          return data;
        }) 
      }
    },
  };
module.exports = tagResolvers;