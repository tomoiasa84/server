const Query = require("./types/Query/QueryType");
const User = require("./types/User/UserType");
const Location = require("./types/Location/LocationType");
const Setting = require("./types/Setting/SettingType");
const Response = require("./types/Response/ResponseType");
const Card = require("./types/Card/CardType");
const Tag = require("./types/Tag/TagType");
const Review = require("./types/Review/ReviewType");
const Recommand = require("./types/Recommand/RecommandType");
const UserTag = require("./types/UserTag/UserTagType");
const Share = require("./types/Share/ShareType");
const Conversation = require("./types/Conversation/ConversationType");
const Contact = require("./types/Contact/ContactType");
const Connection = require("./types/Connection/ConnectionType");
const typeDefs = [
  Connection,
  Contact,
  Share,
  UserTag,
  Conversation,
  Recommand,
  Review,
  Tag,
  Query,
  User,
  Location,
  Setting,
  Response,
  Card
];

module.exports = typeDefs;
