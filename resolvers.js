const QueryResolvers = require('./types/Query/QueryResolvers');
const UserResolvers = require('./types/User/UserResolvers');
const LocationResolvers = require('./types/Location/LocationResolvers');
const PrivacyResolvers = require('./types/Privacy/PrivacyResolvers');

const resolvers = [QueryResolvers,UserResolvers,LocationResolvers,PrivacyResolvers];
module.exports = resolvers;  