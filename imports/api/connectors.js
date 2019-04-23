import Sequelize from 'sequelize';

// create the connection
const sequelize = new Sequelize('xfriend', 'postgres', null, {
    host: 'localhost',
    port: '5432',
    dialect: 'postgres'
});



// create the table if it doesn't exist yet
//db.sync();

sequelize.query("SELECT * FROM userx").then(myTableRows => {
    console.log(myTableRows)
  })
/*
const UserModel = sequelize.define('userx', {
    id: { type: Sequelize.id },
    name: { type: Sequelize.STRING },
});

const User = sequelize.models.user;
export { sequelize, User };
*/

export { sequelize }