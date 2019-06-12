const Query = require('./types/Query/QueryType');
const User = require('./types/User/UserType');
const Location = require('./types/Location/LocationType');
const Privacy = require('./types/Privacy/PrivacyType');
const Response = require('./types/Response/ResponseType');

const typeDefs = [Query,User,Location,Privacy,Response];
module.exports = typeDefs;