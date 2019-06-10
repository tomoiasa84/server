const QueryResolvers = require('./types/Query/QueryResolvers');
const UserResolvers = require('./types/User/UserResolvers');

const resolvers = [QueryResolvers,UserResolvers];
module.exports = resolvers;  