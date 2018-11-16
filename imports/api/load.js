import { load } from 'graphql-load';
import Entities from './entities';
import ContactsModule from './modules/contacts';
import RecomandationsModule from './modules/recommandations'
import CommentsModule from './modules/comments';

load([
    Entities,
    ContactsModule,
    RecomandationsModule,
    CommentsModule
]);