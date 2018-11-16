import { Mongo } from 'meteor/mongo';
import ContactsSchema from './schema';

let Contacts = new Mongo.Collection("contacts");

Contacts.attachSchema(ContactsSchema);

export default Contacts;