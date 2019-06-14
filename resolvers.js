const QueryResolvers = require('./types/Query/QueryResolvers');
const UserResolvers = require('./types/User/UserResolvers');
const LocationResolvers = require('./types/Location/LocationResolvers');
const PrivacyResolvers = require('./types/Privacy/PrivacyResolvers');
const CardResolvers = require('./types/Card/CardResolvers');
const TagResolvers = require('./types/Tag/TagResolvers');
const UserMutationsResolvers = require('./types/User/UserMutationsResolvers');
const CardMutationsResolvers = require('./types/Card/CardMutationsResolvers');

const resolvers = [
    TagResolvers,
    CardResolvers,
    QueryResolvers,
    UserResolvers,
    LocationResolvers,
    PrivacyResolvers,
    UserMutationsResolvers,
    CardMutationsResolvers,
];
module.exports = resolvers;  