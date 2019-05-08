module.exports =  require('knex')({
    client: 'pg',
    connection: 'postgres://postgres@localhost:5432/xfriend'
  })