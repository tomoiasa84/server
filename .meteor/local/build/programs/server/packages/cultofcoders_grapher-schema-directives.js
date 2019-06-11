(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"cultofcoders:grapher-schema-directives":{"index.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/cultofcoders_grapher-schema-directives/index.js                                             //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
module.export({
  directives: () => directives,
  directiveDefinitions: () => directiveDefinitions,
  LinkDirective: () => LinkDirective,
  MapToDirective: () => MapToDirective,
  MongoDirective: () => MongoDirective
});
let directiveDefinitions;
module.link("./directiveDefinitions", {
  default(v) {
    directiveDefinitions = v;
  }

}, 0);
let LinkDirective;
module.link("./LinkDirective", {
  default(v) {
    LinkDirective = v;
  }

}, 1);
let MapToDirective;
module.link("./MapToDirective", {
  default(v) {
    MapToDirective = v;
  }

}, 2);
let MongoDirective;
module.link("./MongoDirective", {
  default(v) {
    MongoDirective = v;
  }

}, 3);
const directives = {
  mongo: MongoDirective,
  link: LinkDirective,
  map: MapToDirective
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////

},"LinkDirective.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/cultofcoders_grapher-schema-directives/LinkDirective.js                                     //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

module.export({
  default: () => LinkDirective
});
let SchemaDirectiveVisitor;
module.link("graphql-tools", {
  SchemaDirectiveVisitor(v) {
    SchemaDirectiveVisitor = v;
  }

}, 0);
let GraphQLList, GraphQLObjectType, GraphQLNonNull;
module.link("graphql/type", {
  GraphQLList(v) {
    GraphQLList = v;
  },

  GraphQLObjectType(v) {
    GraphQLObjectType = v;
  },

  GraphQLNonNull(v) {
    GraphQLNonNull = v;
  }

}, 1);
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 2);
let setupMongoDirective;
module.link("./MongoDirective", {
  setupMongoDirective(v) {
    setupMongoDirective = v;
  }

}, 3);

class LinkDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) {
    const {
      objectType
    } = details;
    const {
      args
    } = this;

    if (!objectType._mongoCollectionName) {
      throw new Meteor.Error('collection-not-found', `You are trying to set the link: ${field.name} but your object type does not have @mongo directive set-up`);
    }

    const isArrayField = field.type instanceof GraphQLList;
    let referencedType;

    if (isArrayField) {
      referencedType = field.type.ofType;
    } else {
      referencedType = field.type;
    }

    if (referencedType instanceof GraphQLNonNull) {
      referencedType = referencedType.ofType;
    } else {
      if (!(referencedType instanceof GraphQLObjectType)) {
        throw new Meteor.Error('invalid-type', `You are trying to attach a link on a invalid type. @link directive only works with GraphQLObjectType `);
      }
    }

    let referencedCollectionName = referencedType._mongoCollectionName;

    if (!referencedCollectionName) {
      const objectNodeDirectives = referencedType.astNode.directives;
      const mongoDirective = objectNodeDirectives.find(directive => {
        return directive.name.value === 'mongo';
      });

      if (mongoDirective) {
        const nameArgument = mongoDirective.arguments.find(argument => argument.name.value === 'name');
        setupMongoDirective(referencedType, {
          name: nameArgument.value.value
        });
        referencedCollectionName = nameArgument.value.value;
      } else {
        throw new Meteor.Error('invalid-collection', `The referenced type does not have a collection setup using @mongo directive`);
      }
    }

    const thisCollectionName = objectType._mongoCollectionName;
    const referencedCollection = Mongo.Collection.get(referencedCollectionName);
    const thisCollection = Mongo.Collection.get(thisCollectionName);
    let config = {};

    if (args.to) {
      config = Object.assign({}, args);
      config.inversedBy = args.to;
      delete config.to;
    } else {
      if (args.field) {
        config = Object.assign({
          type: isArrayField ? 'many' : 'one',
          field: args.field,
          index: true
        }, args);
      } else {
        throw new Meteor.Error(`invalid-args`, `You have provided invalid arguments for this link in ${thisCollectionName}. The "field" property is missing.`);
      }
    }

    thisCollection.addLinks({
      [field.name]: (0, _objectSpread2.default)({
        collection: referencedCollection
      }, config)
    });
  }

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

},"MapToDirective.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/cultofcoders_grapher-schema-directives/MapToDirective.js                                    //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
module.export({
  default: () => MapToDirective
});
let SchemaDirectiveVisitor;
module.link("graphql-tools", {
  SchemaDirectiveVisitor(v) {
    SchemaDirectiveVisitor = v;
  }

}, 0);
let GraphQLScalarType, GraphQLObjectType;
module.link("graphql/type", {
  GraphQLScalarType(v) {
    GraphQLScalarType = v;
  },

  GraphQLObjectType(v) {
    GraphQLObjectType = v;
  }

}, 1);
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 2);

function resolve(path, obj) {
  return path.split('.').reduce(function (prev, curr) {
    return prev ? prev[curr] : undefined;
  }, obj || self);
}

class MapToDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) {
    const {
      objectType
    } = details;
    const {
      args
    } = this;

    if (!objectType._mongoCollectionName) {
      throw new Meteor.Error('collection-not-found', `You are trying to set mapTo: ${field.name} but your object type does not have @mongo directive set-up`);
    }

    const isScalar = field.type instanceof GraphQLScalarType;

    if (!isScalar) {
      throw new Meteor.Error('collection-not-found', `You are trying to set the mapTo directive on a non-scalar on field ${field.name}`);
    }

    const collection = Mongo.Collection.get(objectType._mongoCollectionName);
    collection.addReducers({
      [field.name]: {
        body: {
          [args.to]: 1
        },

        reduce(obj) {
          return resolve(args.to, obj);
        }

      }
    });
  }

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

},"MongoDirective.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/cultofcoders_grapher-schema-directives/MongoDirective.js                                    //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
module.export({
  default: () => MongoDirective,
  setupMongoDirective: () => setupMongoDirective
});
let SchemaDirectiveVisitor;
module.link("graphql-tools", {
  SchemaDirectiveVisitor(v) {
    SchemaDirectiveVisitor = v;
  }

}, 0);
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 1);

class MongoDirective extends SchemaDirectiveVisitor {
  /**
   * @param {GraphQLObjectType} type
   */
  visitObject(type) {
    if (type._mongoCollectionName) {
      // it has already been setup by a link directive somewhere
      return;
    }

    setupMongoDirective(type, this.args);
  }

  visitFieldDefinition() {}

}

function setupMongoDirective(type, args) {
  const {
    name
  } = args;
  type._mongoCollectionName = name;
  let collection = Mongo.Collection.get(name);

  if (!collection) {
    collection = new Mongo.Collection(name);
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

},"directiveDefinitions.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/cultofcoders_grapher-schema-directives/directiveDefinitions.js                              //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
module.exportDefault(`
  directive @mongo(
    name: String!
  ) on OBJECT | FIELD_DEFINITION

  directive @link(
    field: String
    to: String
    metadata: Boolean
    unique: Boolean
    autoremove: Boolean
  ) on FIELD_DEFINITION

  directive @map(
    to: String
  ) on FIELD_DEFINITION
`);
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/cultofcoders:grapher-schema-directives/index.js");

/* Exports */
Package._define("cultofcoders:grapher-schema-directives", exports);

})();

//# sourceURL=meteor://💻app/packages/cultofcoders_grapher-schema-directives.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXItc2NoZW1hLWRpcmVjdGl2ZXMvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyLXNjaGVtYS1kaXJlY3RpdmVzL0xpbmtEaXJlY3RpdmUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyLXNjaGVtYS1kaXJlY3RpdmVzL01hcFRvRGlyZWN0aXZlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci1zY2hlbWEtZGlyZWN0aXZlcy9Nb25nb0RpcmVjdGl2ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXItc2NoZW1hLWRpcmVjdGl2ZXMvZGlyZWN0aXZlRGVmaW5pdGlvbnMuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0IiwiZGlyZWN0aXZlcyIsImRpcmVjdGl2ZURlZmluaXRpb25zIiwiTGlua0RpcmVjdGl2ZSIsIk1hcFRvRGlyZWN0aXZlIiwiTW9uZ29EaXJlY3RpdmUiLCJsaW5rIiwiZGVmYXVsdCIsInYiLCJtb25nbyIsIm1hcCIsIlNjaGVtYURpcmVjdGl2ZVZpc2l0b3IiLCJHcmFwaFFMTGlzdCIsIkdyYXBoUUxPYmplY3RUeXBlIiwiR3JhcGhRTE5vbk51bGwiLCJNb25nbyIsInNldHVwTW9uZ29EaXJlY3RpdmUiLCJ2aXNpdEZpZWxkRGVmaW5pdGlvbiIsImZpZWxkIiwiZGV0YWlscyIsIm9iamVjdFR5cGUiLCJhcmdzIiwiX21vbmdvQ29sbGVjdGlvbk5hbWUiLCJNZXRlb3IiLCJFcnJvciIsIm5hbWUiLCJpc0FycmF5RmllbGQiLCJ0eXBlIiwicmVmZXJlbmNlZFR5cGUiLCJvZlR5cGUiLCJyZWZlcmVuY2VkQ29sbGVjdGlvbk5hbWUiLCJvYmplY3ROb2RlRGlyZWN0aXZlcyIsImFzdE5vZGUiLCJtb25nb0RpcmVjdGl2ZSIsImZpbmQiLCJkaXJlY3RpdmUiLCJ2YWx1ZSIsIm5hbWVBcmd1bWVudCIsImFyZ3VtZW50cyIsImFyZ3VtZW50IiwidGhpc0NvbGxlY3Rpb25OYW1lIiwicmVmZXJlbmNlZENvbGxlY3Rpb24iLCJDb2xsZWN0aW9uIiwiZ2V0IiwidGhpc0NvbGxlY3Rpb24iLCJjb25maWciLCJ0byIsIk9iamVjdCIsImFzc2lnbiIsImludmVyc2VkQnkiLCJpbmRleCIsImFkZExpbmtzIiwiY29sbGVjdGlvbiIsIkdyYXBoUUxTY2FsYXJUeXBlIiwicmVzb2x2ZSIsInBhdGgiLCJvYmoiLCJzcGxpdCIsInJlZHVjZSIsInByZXYiLCJjdXJyIiwidW5kZWZpbmVkIiwic2VsZiIsImlzU2NhbGFyIiwiYWRkUmVkdWNlcnMiLCJib2R5IiwidmlzaXRPYmplY3QiLCJleHBvcnREZWZhdWx0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNDLFlBQVUsRUFBQyxNQUFJQSxVQUFoQjtBQUEyQkMsc0JBQW9CLEVBQUMsTUFBSUEsb0JBQXBEO0FBQXlFQyxlQUFhLEVBQUMsTUFBSUEsYUFBM0Y7QUFBeUdDLGdCQUFjLEVBQUMsTUFBSUEsY0FBNUg7QUFBMklDLGdCQUFjLEVBQUMsTUFBSUE7QUFBOUosQ0FBZDtBQUE2TCxJQUFJSCxvQkFBSjtBQUF5QkgsTUFBTSxDQUFDTyxJQUFQLENBQVksd0JBQVosRUFBcUM7QUFBQ0MsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ04sd0JBQW9CLEdBQUNNLENBQXJCO0FBQXVCOztBQUFuQyxDQUFyQyxFQUEwRSxDQUExRTtBQUE2RSxJQUFJTCxhQUFKO0FBQWtCSixNQUFNLENBQUNPLElBQVAsQ0FBWSxpQkFBWixFQUE4QjtBQUFDQyxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDTCxpQkFBYSxHQUFDSyxDQUFkO0FBQWdCOztBQUE1QixDQUE5QixFQUE0RCxDQUE1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QUFLTixJQUFaLENBQW5CO0FBQ0Q7O0FBRURKLHNCQUFvQixHQUFHLENBQUU7O0FBYndDOztBQWdCNUQsU0FBU0QsbUJBQVQsQ0FBNkJXLElBQTdCLEVBQW1DTixJQUFuQyxFQUF5QztBQUM5QyxRQUFNO0FBQUVJO0FBQUYsTUFBV0osSUFBakI7QUFFQU0sTUFBSSxDQUFDTCxvQkFBTCxHQUE0QkcsSUFBNUI7QUFFQSxNQUFJMkIsVUFBVSxHQUFHckMsS0FBSyxDQUFDMkIsVUFBTixDQUFpQkMsR0FBakIsQ0FBcUJsQixJQUFyQixDQUFqQjs7QUFDQSxNQUFJLENBQUMyQixVQUFMLEVBQWlCO0FBQ2ZBLGNBQVUsR0FBRyxJQUFJckMsS0FBSyxDQUFDMkIsVUFBVixDQUFxQmpCLElBQXJCLENBQWI7QUFDRDtBQUNGLEM7Ozs7Ozs7Ozs7O0FDNUJEMUIsTUFBTSxDQUFDb0UsYUFBUCxDQUFnQjs7Ozs7Ozs7Ozs7Ozs7OztDQUFoQixFIiwiZmlsZSI6Ii9wYWNrYWdlcy9jdWx0b2Zjb2RlcnNfZ3JhcGhlci1zY2hlbWEtZGlyZWN0aXZlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkaXJlY3RpdmVEZWZpbml0aW9ucyBmcm9tICcuL2RpcmVjdGl2ZURlZmluaXRpb25zJztcbmltcG9ydCBMaW5rRGlyZWN0aXZlIGZyb20gJy4vTGlua0RpcmVjdGl2ZSc7XG5pbXBvcnQgTWFwVG9EaXJlY3RpdmUgZnJvbSAnLi9NYXBUb0RpcmVjdGl2ZSc7XG5pbXBvcnQgTW9uZ29EaXJlY3RpdmUgZnJvbSAnLi9Nb25nb0RpcmVjdGl2ZSc7XG5cbmNvbnN0IGRpcmVjdGl2ZXMgPSB7XG4gIG1vbmdvOiBNb25nb0RpcmVjdGl2ZSxcbiAgbGluazogTGlua0RpcmVjdGl2ZSxcbiAgbWFwOiBNYXBUb0RpcmVjdGl2ZSxcbn07XG5cbmV4cG9ydCB7XG4gIGRpcmVjdGl2ZXMsXG4gIGRpcmVjdGl2ZURlZmluaXRpb25zLFxuICBMaW5rRGlyZWN0aXZlLFxuICBNYXBUb0RpcmVjdGl2ZSxcbiAgTW9uZ29EaXJlY3RpdmUsXG59O1xuIiwiaW1wb3J0IHsgU2NoZW1hRGlyZWN0aXZlVmlzaXRvciB9IGZyb20gJ2dyYXBocWwtdG9vbHMnO1xuaW1wb3J0IHsgR3JhcGhRTExpc3QsIEdyYXBoUUxPYmplY3RUeXBlLCBHcmFwaFFMTm9uTnVsbCB9IGZyb20gJ2dyYXBocWwvdHlwZSc7XG5pbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgeyBzZXR1cE1vbmdvRGlyZWN0aXZlIH0gZnJvbSAnLi9Nb25nb0RpcmVjdGl2ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmtEaXJlY3RpdmUgZXh0ZW5kcyBTY2hlbWFEaXJlY3RpdmVWaXNpdG9yIHtcbiAgdmlzaXRGaWVsZERlZmluaXRpb24oZmllbGQsIGRldGFpbHMpIHtcbiAgICBjb25zdCB7IG9iamVjdFR5cGUgfSA9IGRldGFpbHM7XG4gICAgY29uc3QgeyBhcmdzIH0gPSB0aGlzO1xuXG4gICAgaWYgKCFvYmplY3RUeXBlLl9tb25nb0NvbGxlY3Rpb25OYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAnY29sbGVjdGlvbi1ub3QtZm91bmQnLFxuICAgICAgICBgWW91IGFyZSB0cnlpbmcgdG8gc2V0IHRoZSBsaW5rOiAke1xuICAgICAgICAgIGZpZWxkLm5hbWVcbiAgICAgICAgfSBidXQgeW91ciBvYmplY3QgdHlwZSBkb2VzIG5vdCBoYXZlIEBtb25nbyBkaXJlY3RpdmUgc2V0LXVwYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBpc0FycmF5RmllbGQgPSBmaWVsZC50eXBlIGluc3RhbmNlb2YgR3JhcGhRTExpc3Q7XG4gICAgbGV0IHJlZmVyZW5jZWRUeXBlO1xuXG4gICAgaWYgKGlzQXJyYXlGaWVsZCkge1xuICAgICAgcmVmZXJlbmNlZFR5cGUgPSBmaWVsZC50eXBlLm9mVHlwZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVmZXJlbmNlZFR5cGUgPSBmaWVsZC50eXBlO1xuICAgIH1cblxuICAgIGlmIChyZWZlcmVuY2VkVHlwZSBpbnN0YW5jZW9mIEdyYXBoUUxOb25OdWxsKSB7XG4gICAgICByZWZlcmVuY2VkVHlwZSA9IHJlZmVyZW5jZWRUeXBlLm9mVHlwZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCEocmVmZXJlbmNlZFR5cGUgaW5zdGFuY2VvZiBHcmFwaFFMT2JqZWN0VHlwZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAnaW52YWxpZC10eXBlJyxcbiAgICAgICAgICBgWW91IGFyZSB0cnlpbmcgdG8gYXR0YWNoIGEgbGluayBvbiBhIGludmFsaWQgdHlwZS4gQGxpbmsgZGlyZWN0aXZlIG9ubHkgd29ya3Mgd2l0aCBHcmFwaFFMT2JqZWN0VHlwZSBgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHJlZmVyZW5jZWRDb2xsZWN0aW9uTmFtZSA9IHJlZmVyZW5jZWRUeXBlLl9tb25nb0NvbGxlY3Rpb25OYW1lO1xuICAgIGlmICghcmVmZXJlbmNlZENvbGxlY3Rpb25OYW1lKSB7XG4gICAgICBjb25zdCBvYmplY3ROb2RlRGlyZWN0aXZlcyA9IHJlZmVyZW5jZWRUeXBlLmFzdE5vZGUuZGlyZWN0aXZlcztcbiAgICAgIGNvbnN0IG1vbmdvRGlyZWN0aXZlID0gb2JqZWN0Tm9kZURpcmVjdGl2ZXMuZmluZChkaXJlY3RpdmUgPT4ge1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlLm5hbWUudmFsdWUgPT09ICdtb25nbyc7XG4gICAgICB9KTtcblxuICAgICAgaWYgKG1vbmdvRGlyZWN0aXZlKSB7XG4gICAgICAgIGNvbnN0IG5hbWVBcmd1bWVudCA9IG1vbmdvRGlyZWN0aXZlLmFyZ3VtZW50cy5maW5kKFxuICAgICAgICAgIGFyZ3VtZW50ID0+IGFyZ3VtZW50Lm5hbWUudmFsdWUgPT09ICduYW1lJ1xuICAgICAgICApO1xuXG4gICAgICAgIHNldHVwTW9uZ29EaXJlY3RpdmUocmVmZXJlbmNlZFR5cGUsIHtcbiAgICAgICAgICBuYW1lOiBuYW1lQXJndW1lbnQudmFsdWUudmFsdWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlZmVyZW5jZWRDb2xsZWN0aW9uTmFtZSA9IG5hbWVBcmd1bWVudC52YWx1ZS52YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgJ2ludmFsaWQtY29sbGVjdGlvbicsXG4gICAgICAgICAgYFRoZSByZWZlcmVuY2VkIHR5cGUgZG9lcyBub3QgaGF2ZSBhIGNvbGxlY3Rpb24gc2V0dXAgdXNpbmcgQG1vbmdvIGRpcmVjdGl2ZWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB0aGlzQ29sbGVjdGlvbk5hbWUgPSBvYmplY3RUeXBlLl9tb25nb0NvbGxlY3Rpb25OYW1lO1xuXG4gICAgY29uc3QgcmVmZXJlbmNlZENvbGxlY3Rpb24gPSBNb25nby5Db2xsZWN0aW9uLmdldChyZWZlcmVuY2VkQ29sbGVjdGlvbk5hbWUpO1xuICAgIGNvbnN0IHRoaXNDb2xsZWN0aW9uID0gTW9uZ28uQ29sbGVjdGlvbi5nZXQodGhpc0NvbGxlY3Rpb25OYW1lKTtcblxuICAgIGxldCBjb25maWcgPSB7fTtcbiAgICBpZiAoYXJncy50bykge1xuICAgICAgY29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgYXJncyk7XG4gICAgICBjb25maWcuaW52ZXJzZWRCeSA9IGFyZ3MudG87XG4gICAgICBkZWxldGUgY29uZmlnLnRvO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoYXJncy5maWVsZCkge1xuICAgICAgICBjb25maWcgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6IGlzQXJyYXlGaWVsZCA/ICdtYW55JyA6ICdvbmUnLFxuICAgICAgICAgICAgZmllbGQ6IGFyZ3MuZmllbGQsXG4gICAgICAgICAgICBpbmRleDogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFyZ3NcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgYGludmFsaWQtYXJnc2AsXG4gICAgICAgICAgYFlvdSBoYXZlIHByb3ZpZGVkIGludmFsaWQgYXJndW1lbnRzIGZvciB0aGlzIGxpbmsgaW4gJHt0aGlzQ29sbGVjdGlvbk5hbWV9LiBUaGUgXCJmaWVsZFwiIHByb3BlcnR5IGlzIG1pc3NpbmcuYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXNDb2xsZWN0aW9uLmFkZExpbmtzKHtcbiAgICAgIFtmaWVsZC5uYW1lXToge1xuICAgICAgICBjb2xsZWN0aW9uOiByZWZlcmVuY2VkQ29sbGVjdGlvbixcbiAgICAgICAgLi4uY29uZmlnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU2NoZW1hRGlyZWN0aXZlVmlzaXRvciB9IGZyb20gJ2dyYXBocWwtdG9vbHMnO1xuaW1wb3J0IHsgR3JhcGhRTFNjYWxhclR5cGUsIEdyYXBoUUxPYmplY3RUeXBlIH0gZnJvbSAnZ3JhcGhxbC90eXBlJztcbmltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcblxuZnVuY3Rpb24gcmVzb2x2ZShwYXRoLCBvYmopIHtcbiAgcmV0dXJuIHBhdGguc3BsaXQoJy4nKS5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3Vycikge1xuICAgIHJldHVybiBwcmV2ID8gcHJldltjdXJyXSA6IHVuZGVmaW5lZDtcbiAgfSwgb2JqIHx8IHNlbGYpO1xufVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwVG9EaXJlY3RpdmUgZXh0ZW5kcyBTY2hlbWFEaXJlY3RpdmVWaXNpdG9yIHtcbiAgdmlzaXRGaWVsZERlZmluaXRpb24oZmllbGQsIGRldGFpbHMpIHtcbiAgICBjb25zdCB7IG9iamVjdFR5cGUgfSA9IGRldGFpbHM7XG4gICAgY29uc3QgeyBhcmdzIH0gPSB0aGlzO1xuXG4gICAgaWYgKCFvYmplY3RUeXBlLl9tb25nb0NvbGxlY3Rpb25OYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAnY29sbGVjdGlvbi1ub3QtZm91bmQnLFxuICAgICAgICBgWW91IGFyZSB0cnlpbmcgdG8gc2V0IG1hcFRvOiAke1xuICAgICAgICAgIGZpZWxkLm5hbWVcbiAgICAgICAgfSBidXQgeW91ciBvYmplY3QgdHlwZSBkb2VzIG5vdCBoYXZlIEBtb25nbyBkaXJlY3RpdmUgc2V0LXVwYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBpc1NjYWxhciA9IGZpZWxkLnR5cGUgaW5zdGFuY2VvZiBHcmFwaFFMU2NhbGFyVHlwZTtcbiAgICBpZiAoIWlzU2NhbGFyKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAnY29sbGVjdGlvbi1ub3QtZm91bmQnLFxuICAgICAgICBgWW91IGFyZSB0cnlpbmcgdG8gc2V0IHRoZSBtYXBUbyBkaXJlY3RpdmUgb24gYSBub24tc2NhbGFyIG9uIGZpZWxkICR7XG4gICAgICAgICAgZmllbGQubmFtZVxuICAgICAgICB9YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb2xsZWN0aW9uID0gTW9uZ28uQ29sbGVjdGlvbi5nZXQob2JqZWN0VHlwZS5fbW9uZ29Db2xsZWN0aW9uTmFtZSk7XG5cbiAgICBjb2xsZWN0aW9uLmFkZFJlZHVjZXJzKHtcbiAgICAgIFtmaWVsZC5uYW1lXToge1xuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgW2FyZ3MudG9dOiAxLFxuICAgICAgICB9LFxuICAgICAgICByZWR1Y2Uob2JqKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoYXJncy50bywgb2JqKTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFNjaGVtYURpcmVjdGl2ZVZpc2l0b3IgfSBmcm9tICdncmFwaHFsLXRvb2xzJztcbmltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9uZ29EaXJlY3RpdmUgZXh0ZW5kcyBTY2hlbWFEaXJlY3RpdmVWaXNpdG9yIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7R3JhcGhRTE9iamVjdFR5cGV9IHR5cGVcbiAgICovXG4gIHZpc2l0T2JqZWN0KHR5cGUpIHtcbiAgICBpZiAodHlwZS5fbW9uZ29Db2xsZWN0aW9uTmFtZSkge1xuICAgICAgLy8gaXQgaGFzIGFscmVhZHkgYmVlbiBzZXR1cCBieSBhIGxpbmsgZGlyZWN0aXZlIHNvbWV3aGVyZVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNldHVwTW9uZ29EaXJlY3RpdmUodHlwZSwgdGhpcy5hcmdzKTtcbiAgfVxuXG4gIHZpc2l0RmllbGREZWZpbml0aW9uKCkge31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwTW9uZ29EaXJlY3RpdmUodHlwZSwgYXJncykge1xuICBjb25zdCB7IG5hbWUgfSA9IGFyZ3M7XG5cbiAgdHlwZS5fbW9uZ29Db2xsZWN0aW9uTmFtZSA9IG5hbWU7XG5cbiAgbGV0IGNvbGxlY3Rpb24gPSBNb25nby5Db2xsZWN0aW9uLmdldChuYW1lKTtcbiAgaWYgKCFjb2xsZWN0aW9uKSB7XG4gICAgY29sbGVjdGlvbiA9IG5ldyBNb25nby5Db2xsZWN0aW9uKG5hbWUpO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBgXG4gIGRpcmVjdGl2ZSBAbW9uZ28oXG4gICAgbmFtZTogU3RyaW5nIVxuICApIG9uIE9CSkVDVCB8IEZJRUxEX0RFRklOSVRJT05cblxuICBkaXJlY3RpdmUgQGxpbmsoXG4gICAgZmllbGQ6IFN0cmluZ1xuICAgIHRvOiBTdHJpbmdcbiAgICBtZXRhZGF0YTogQm9vbGVhblxuICAgIHVuaXF1ZTogQm9vbGVhblxuICAgIGF1dG9yZW1vdmU6IEJvb2xlYW5cbiAgKSBvbiBGSUVMRF9ERUZJTklUSU9OXG5cbiAgZGlyZWN0aXZlIEBtYXAoXG4gICAgdG86IFN0cmluZ1xuICApIG9uIEZJRUxEX0RFRklOSVRJT05cbmA7XG4iXX0=
