var require = meteorInstall({"imports":{"startup":{"server":{"graphql.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// imports/startup/server/graphql.js                                 //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
module.link("../../api/load");
///////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// imports/startup/server/index.js                                   //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
let initialize;
module.link("meteor/cultofcoders:apollo", {
  initialize(v) {
    initialize = v;
  }

}, 0);
module.link("./graphql");
initialize();
///////////////////////////////////////////////////////////////////////

}}},"api":{"User.gql":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// imports/api/User.gql                                              //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
module.link("./User.gql.js", { "*": "*+" });

///////////////////////////////////////////////////////////////////////

},"User.gql.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// imports/api/User.gql.js                                           //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //

    var doc = {"kind":"Document","definitions":[{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"User"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Query"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"users"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}},"directives":[]}]}],"loc":{"start":0,"end":79}};
    doc.loc.source = {"body":"type User {\n    id: ID\n    name: String\n}\n\ntype Query {\n    users: [User]    \n}","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

    var names = {};
    function unique(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') return true;
          var name = def.name.value
          if (names[name]) {
            return false;
          } else {
            names[name] = true;
            return true;
          }
        }
      )
    }
  

      module.exports = doc;
    

///////////////////////////////////////////////////////////////////////

},"User.resolver.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// imports/api/User.resolver.js                                      //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
const knex = require('./pgAdaptor');

module.exportDefault({
  Query: {
    users: (_, args, ctx) => Promise.asyncApply(() => {
      const users = Promise.await(knex('userx').select());
      return users;
    })
  }
});
///////////////////////////////////////////////////////////////////////

},"load.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// imports/api/load.js                                               //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
let load;
module.link("graphql-load", {
  load(v) {
    load = v;
  }

}, 0);
let UserType;
module.link("./User", {
  default(v) {
    UserType = v;
  }

}, 1);
let UserResolver;
module.link("./User.resolver", {
  default(v) {
    UserResolver = v;
  }

}, 2);
load({
  typeDefs: [UserType],
  resolvers: [UserResolver]
});
///////////////////////////////////////////////////////////////////////

},"pgAdaptor.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// imports/api/pgAdaptor.js                                          //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
module.exports = require('knex')({
  client: 'pg',
  connection: 'postgres://postgres@localhost:5432/xfriend'
});
///////////////////////////////////////////////////////////////////////

}}},"server":{"main.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// server/main.js                                                    //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
module.link("../imports/startup/server");
///////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".gql"
  ]
});

require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9ncmFwaHFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2luZGV4LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9Vc2VyLnJlc29sdmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9sb2FkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9wZ0FkYXB0b3IuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tYWluLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImxpbmsiLCJpbml0aWFsaXplIiwidiIsImtuZXgiLCJyZXF1aXJlIiwiZXhwb3J0RGVmYXVsdCIsIlF1ZXJ5IiwidXNlcnMiLCJfIiwiYXJncyIsImN0eCIsInNlbGVjdCIsImxvYWQiLCJVc2VyVHlwZSIsImRlZmF1bHQiLCJVc2VyUmVzb2x2ZXIiLCJ0eXBlRGVmcyIsInJlc29sdmVycyIsImV4cG9ydHMiLCJjbGllbnQiLCJjb25uZWN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWSxnQkFBWixFOzs7Ozs7Ozs7OztBQ0FBLElBQUlDLFVBQUo7QUFBZUYsTUFBTSxDQUFDQyxJQUFQLENBQVksNEJBQVosRUFBeUM7QUFBQ0MsWUFBVSxDQUFDQyxDQUFELEVBQUc7QUFBQ0QsY0FBVSxHQUFDQyxDQUFYO0FBQWE7O0FBQTVCLENBQXpDLEVBQXVFLENBQXZFO0FBQTBFSCxNQUFNLENBQUNDLElBQVAsQ0FBWSxXQUFaO0FBS3pGQyxVQUFVLEc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNMVixNQUFNRSxJQUFJLEdBQUdDLE9BQU8sQ0FBQyxhQUFELENBQXBCOztBQUFBTCxNQUFNLENBQUNNLGFBQVAsQ0FFZTtBQUNYQyxPQUFLLEVBQUM7QUFFSEMsU0FBSyxFQUFFLENBQU9DLENBQVAsRUFBVUMsSUFBVixFQUFnQkMsR0FBaEIsOEJBQXdCO0FBQzlCLFlBQU1ILEtBQUssaUJBQVNKLElBQUksQ0FBQyxPQUFELENBQUosQ0FBY1EsTUFBZCxFQUFULENBQVg7QUFDQSxhQUFPSixLQUFQO0FBQ0EsS0FITTtBQUZKO0FBREssQ0FGZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUlLLElBQUo7QUFBU2IsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDWSxNQUFJLENBQUNWLENBQUQsRUFBRztBQUFDVSxRQUFJLEdBQUNWLENBQUw7QUFBTzs7QUFBaEIsQ0FBM0IsRUFBNkMsQ0FBN0M7QUFBZ0QsSUFBSVcsUUFBSjtBQUFhZCxNQUFNLENBQUNDLElBQVAsQ0FBWSxRQUFaLEVBQXFCO0FBQUNjLFNBQU8sQ0FBQ1osQ0FBRCxFQUFHO0FBQUNXLFlBQVEsR0FBQ1gsQ0FBVDtBQUFXOztBQUF2QixDQUFyQixFQUE4QyxDQUE5QztBQUFpRCxJQUFJYSxZQUFKO0FBQWlCaEIsTUFBTSxDQUFDQyxJQUFQLENBQVksaUJBQVosRUFBOEI7QUFBQ2MsU0FBTyxDQUFDWixDQUFELEVBQUc7QUFBQ2EsZ0JBQVksR0FBQ2IsQ0FBYjtBQUFlOztBQUEzQixDQUE5QixFQUEyRCxDQUEzRDtBQUl4SVUsSUFBSSxDQUFDO0FBQ0RJLFVBQVEsRUFBRSxDQUFDSCxRQUFELENBRFQ7QUFFREksV0FBUyxFQUFFLENBQUNGLFlBQUQ7QUFGVixDQUFELENBQUosQzs7Ozs7Ozs7Ozs7QUNKQWhCLE1BQU0sQ0FBQ21CLE9BQVAsR0FBa0JkLE9BQU8sQ0FBQyxNQUFELENBQVAsQ0FBZ0I7QUFDOUJlLFFBQU0sRUFBRSxJQURzQjtBQUU5QkMsWUFBVSxFQUFFO0FBRmtCLENBQWhCLENBQWxCLEM7Ozs7Ozs7Ozs7O0FDQUFyQixNQUFNLENBQUNDLElBQVAsQ0FBWSwyQkFBWixFIiwiZmlsZSI6Ii9hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4uLy4uL2FwaS9sb2FkJzsiLCJpbXBvcnQgeyBpbml0aWFsaXplIH0gZnJvbSAnbWV0ZW9yL2N1bHRvZmNvZGVyczphcG9sbG8nO1xuXG5pbXBvcnQgJy4vZ3JhcGhxbCc7XG5cblxuaW5pdGlhbGl6ZSgpO1xuXG5cbiIsImNvbnN0IGtuZXggPSByZXF1aXJlKCcuL3BnQWRhcHRvcicpO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgUXVlcnk6e1xuICAgICAgIFxuICAgICAgIHVzZXJzOiBhc3luYyAoXywgYXJncywgY3R4KSA9PiB7XG4gICAgICAgIGNvbnN0IHVzZXJzID0gYXdhaXQga25leCgndXNlcngnKS5zZWxlY3QoKVxuICAgICAgICByZXR1cm4gdXNlcnNcbiAgICAgICB9XG4gICAgICB9XG59XG5cbiIsImltcG9ydCB7IGxvYWQgfSBmcm9tICdncmFwaHFsLWxvYWQnO1xuaW1wb3J0IFVzZXJUeXBlIGZyb20gJy4vVXNlcic7XG5pbXBvcnQgVXNlclJlc29sdmVyIGZyb20gJy4vVXNlci5yZXNvbHZlcic7XG5cbmxvYWQoe1xuICAgIHR5cGVEZWZzOiBbVXNlclR5cGVdLFxuICAgIHJlc29sdmVyczogW1VzZXJSZXNvbHZlcl0sXG5cbn0pOyIsIm1vZHVsZS5leHBvcnRzID0gIHJlcXVpcmUoJ2tuZXgnKSh7XG4gICAgY2xpZW50OiAncGcnLFxuICAgIGNvbm5lY3Rpb246ICdwb3N0Z3JlczovL3Bvc3RncmVzQGxvY2FsaG9zdDo1NDMyL3hmcmllbmQnXG4gIH0pIiwiaW1wb3J0ICcuLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyJzsiXX0=
