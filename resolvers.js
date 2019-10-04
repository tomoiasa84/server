const QueryResolvers = require("./types/Query/QueryResolvers");
const UserResolvers = require("./types/User/UserResolvers");
const LocationResolvers = require("./types/Location/LocationResolvers");
const SettingResolvers = require("./types/Setting/SettingResolvers");
const CardResolvers = require("./types/Card/CardResolvers");
const TagResolvers = require("./types/Tag/TagResolvers");
const UserMutationsResolvers = require("./types/User/UserMutationsResolvers");
const CardMutationsResolvers = require("./types/Card/CardMutationsResolvers");
const TagMutationsResolvers = require("./types/Tag/TagMutationsResolvers");
const ReviewResolvers = require("./types/Review/ReviewResolvers");
const ReviewMutationsResolvers = require("./types/Review/ReviewMutationsResolvers");
const LocationMutationsResolvers = require("./types/Location/LocationMutationsResolvers");
const RecommandMutationsResolvers = require("./types/Recommand/RecommandMutationsResolvers");

const RecommandResolvers = require("./types/Recommand/RecommandResolvers");
const CardSubscriptions = require("./types/Card/CardSubscriptions");
const UserTagResolvers = require("./types/UserTag/UserTagResolvers");
const UserTagMutationsResolvers = require("./types/UserTag/UserTagMutationsResolvers");
const ShareResolvers = require("./types/Share/ShareResolvers");
const ShareMutationsResolvers = require("./types/Share/ShareMutationsResolvers");

const ConversationResolvers = require("./types/Conversation/ConversationResolvers");
const ConversationMutationsResolvers = require("./types/Conversation/ConversationMutationsResolvers");

const ContactResolvers = require("./types/Contact/ContactResolvers");

const ConnectionResolvers = require("./types/Connection/ConnectionResolvers");
const ConnectionMutationsResolvers = require("./types/Connection/ConnectionMutationsResolvers");
const resolvers = [
  ConnectionResolvers,
  ConnectionMutationsResolvers,
  ContactResolvers,
  ConversationMutationsResolvers,
  ConversationResolvers,
  ShareMutationsResolvers,
  ShareResolvers,
  UserTagMutationsResolvers,
  UserTagResolvers,
  CardSubscriptions,
  RecommandResolvers,
  RecommandMutationsResolvers,
  LocationMutationsResolvers,
  TagResolvers,
  CardResolvers,
  QueryResolvers,
  UserResolvers,
  LocationResolvers,
  SettingResolvers,
  UserMutationsResolvers,
  CardMutationsResolvers,
  TagMutationsResolvers,
  ReviewResolvers,
  ReviewMutationsResolvers
];
module.exports = resolvers;
