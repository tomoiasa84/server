import { Mongo } from 'meteor/mongo';
import CommentsSchema from './schema';

let Comments = new Mongo.Collection("comments");

Comments.attachSchema(CommentsSchema);

export default Comments;