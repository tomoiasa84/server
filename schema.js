const Query = require('./types/Query/QueryType');
const User = require('./types/User/UserType');
const Location = require('./types/Location/LocationType');


const typeDefs = [Query,User,Location];
module.exports = typeDefs;