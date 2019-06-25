const romCities = require('romanian-cities');
const faker = require('faker');
const moment = require('moment');

let tags = [];

function createUser(knex,location)
{
  return knex('location').where('city',location).first()
  .then((locationRecord)=>{

    let userName = faker.name.findName();
    return knex('userx').insert({
      name: userName,
      location: locationRecord.id,
      phone:`${faker.phone.phoneNumber()}`,
      hasAccount: true,
      notification1: true,
      notification2: true,
      notification3: true,
      privacy: 1
    });
  })
}

function createConnection(knex,rows)
{
  return knex('userfriend').insert({

    userOrigin:rows[0].id,
    userTarget:rows[1].id,
    acceptedFlag:true,
    blockFlag:false
  });
}

function createCard(knex,user)
{

  return knex.raw(`SELECT *
    FROM tag
    ORDER BY random()
    LIMIT 1;`)
  .then((tagRec) => {
    
    return knex('card').insert({

      postedBy:user.id,
      searchFor:tagRec.rows[0].id,
      created_at:`${moment().format('MMMM Do YYYY, h:mm:ss a')}`,
      message:`${faker.lorem.sentence()}`
    });
  })
}
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
    return knex('tag').del()
    .then(()=>{
      return knex('location').del();
    })
    .then(()=>{
      return knex('privacy').del();
    })
    .then(()=>{
      // Inserts seed entries
      
      return knex('privacy').insert(
        {
          setting: 'profileSetting'
        }
      );
    })
    .then(()=>{
      
      //Using romanian-cities library to populate the location table
      let locationsArray = [];
      romCities.all.forEach(element => {
        
        locationsArray.push({
          city: element.city
        });
      });
      return knex('location').insert(locationsArray);
    })
    .then(()=>{

      //Populate tag table
      let tagSet =  new Set();
      while(tagSet.size < 10)
      {
        tagSet.add(faker.name.jobTitle());
      }
      tagSet.forEach(el => {
        
        tags.push({
          
          name: el
        });
      });
      return knex('tag').insert(tags);
    })
    .then(()=>{
      
      //Populate user table
      let users = [];
      for(let i = 0; i < 10; i++)
      {
        users.push(createUser(knex,romCities.random().city));
      }
      return Promise.all(users);
    })

};
