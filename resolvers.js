const QueryResolvers = require('./types/Query/QueryResolvers');
const UserResolvers = require('./types/User/UserResolvers');
const LocationResolvers = require('./types/Location/LocationResolvers');

const resolvers = [QueryResolvers,UserResolvers,LocationResolvers];
module.exports = resolvers;  