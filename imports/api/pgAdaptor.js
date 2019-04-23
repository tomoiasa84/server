require('dotenv').config()
const pgPromise = require('pg-promise');

const pgp = pgPromise({}); // Empty object means no additional config required

const config = {
    host: "localhost",
    port: 5432,
    database: "xfriend",
    user: "postgres",
    password: ""
};

const psql = pgp(config);

psql.one('select * from userx')
    .then(res => {
        console.log(res);
    });

exports.psql = psql;