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
  return knex('messageThreadUser').del()
    .then(()=>{
      return knex('message').del()
      .then(()=>{
        return knex('messageThread').del()
        .then(()=>{
          return knex('usertagreview').del()
          .then(()=>{
            return knex('usertag').del()
            .then(()=>{
              return knex('userrecomcard').del()
              .then(()=>{
                return knex('card').del()
                .then(()=>{
                  return knex('userfriend').del()
                  .then(()=>{
                    return knex('userx').del()
                  })
                })
              })
            })
          })
        })
      })
    })
    .then(()=>{
      return knex('tag').del();
    })
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
      while(tagSet.size < 100)
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
      for(let i = 0; i < 100; i++)
      {
        users.push(createUser(knex,romCities.random().city));
      }
      return Promise.all(users);
    })
    .then(()=>{
      
      //Populate friends table
      let promises = []
      for(let i = 0; i < 5; i++)
      {
        
        promises.push(
          knex.raw(`SELECT *
            FROM userx
          ORDER BY random()
          LIMIT 2;`)
        .then((userRec) => {
          return createConnection(knex,userRec.rows)
        })
        )
      }
      return Promise.all(promises);
    })
    .then(()=>{

      //Populate cards table
      let promises = []
      for(let i = 0; i < 5; i++)
      {
        
        promises.push(
          knex.raw(`SELECT *
            FROM userx
          ORDER BY random()
          LIMIT 1;`)
        .then((userRec) => {
          return createCard(knex,userRec.rows[0])
        })
        )
      }
      return Promise.all(promises);
    })
    .then(()=>{

      //Populate user recommand
      return knex('userrecomcard').insert([
        {
          cardId:1,
          userAsk:23,
          userRecommender:24,
          userRecommended:25,
          acceptedFlag: true
        
        },
        {
          cardId:2,
          userAsk:21,
          userRecommender:30,
          userRecommended:31,
          acceptedFlag: true
        
        },
        {
          cardId:3,
          userAsk:20,
          userRecommender:40,
          userRecommended:41,
          acceptedFlag: false
        
        }
      ]);
    })
    .then(()=>{

      //Populate user tag
      return knex('usertag').insert([
        {
          user_id:1,
          tag_id:1,
          default:true
        },
      ]);
    })
    .then(()=>{

      //User tag view
      return knex('usertagreview').insert([
        {
          recommendationBy:1,
          recommendationFor:1,
          stars:4,
          text: 'Very good and great one'
        }
      ]);
    })
    .then(()=>{

      //Msg thread
      return knex('messageThread').insert([
        {
          userrecomcard:1
        }
      ]);
    })
    .then(()=>{

      //Message
      return knex('message').insert([
        {
          text:'Hello, do you know me?',
          messageThread:1,
          messageFrom:23
        }
      ]);
    })
    .then(()=>{

      //Create msgThreadUser
      return knex('messageThreadUser').insert([
        {
          thread:1,
          user:23
        },
        {
          thread:1,
          user:25
        }
      ])
    })
};
