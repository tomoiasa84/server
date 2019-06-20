const cmd = require('node-cmd');
const process = require('process');
const fetch = require('node-fetch');

it('Testing', async () => {
  //

  // process.chdir('./knex_migrations');
      // cmd.get('knex migrate:rollback',
      //   function (err, data, stderr) {
      //     if (data) {

      //       console.log(data);
      //     }
      //     if (err) {

      //       console.log(err);
      //     }
      //   });
  fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: "{ get_users{ id } }"
      })
    })
    .then(r => r.json())
    .then(data => {

      console.log(data);
      
    })
    .catch(err => console.log(err))
});