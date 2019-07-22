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
const MessageResolvers = require("./types/Message/MessageResolvers");
const ThreadMessageResolvers = require("./types/ThreadMessage/ThreadMessageResolvers");
const RecommandResolvers = require("./types/Recommand/RecommandResolvers");
const MessageMutationsResolvers = require("./types/Message/MessageMutationsResolvers");
const ThreadMessageMutationsResolvers = require("./types/ThreadMessage/ThreadMessageMutationsResolvers");
const CardSubscriptions = require("./types/Card/CardSubscriptions");
const UserTagResolvers = require("./types/UserTag/UserTagResolvers");
const UserTagMutationsResolvers = require("./types/UserTag/UserTagMutationsResolvers");
const ShareResolvers = require("./types/Share/ShareResolvers");
const ShareMutationsResolvers = require("./types/Share/ShareMutationsResolvers");
const resolvers = [
  ShareMutationsResolvers,
  ShareResolvers,
  UserTagMutationsResolvers,
  UserTagResolvers,
  CardSubscriptions,
  ThreadMessageMutationsResolvers,
  MessageMutationsResolvers,
  RecommandResolvers,
  ThreadMessageResolvers,
  MessageResolvers,
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
