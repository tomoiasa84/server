module.exports =  require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '1234qwer!',
      database : 'xfriend'
    }
  })