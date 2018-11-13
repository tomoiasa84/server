import { Mongo } from 'meteor/mongo';
import RecommandationSchema from './schema';

let Recommandations = new Mongo.Collection("recommandations");

Recommandations.attachSchema(RecommandationSchema);

export default Recommandations;