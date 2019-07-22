const Query = require("./types/Query/QueryType");
const User = require("./types/User/UserType");
const Location = require("./types/Location/LocationType");
const Setting = require("./types/Setting/SettingType");
const Response = require("./types/Response/ResponseType");
const Card = require("./types/Card/CardType");
const Tag = require("./types/Tag/TagType");
const Review = require("./types/Review/ReviewType");
const Recommand = require("./types/Recommand/RecommandType");
const Message = require("./types/Message/MessageType");
const ThreadMessage = require("./types/ThreadMessage/ThreadMessageType");
const UserTag = require("./types/UserTag/UserTagType");
const Share = require("./types/Share/ShareType");
const typeDefs = [
  Share,
  UserTag,
  ThreadMessage,
  Message,
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
