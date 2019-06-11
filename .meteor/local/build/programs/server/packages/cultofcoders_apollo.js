(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var check = Package.check.check;
var Match = Package.check.Match;
var EJSON = Package.ejson.EJSON;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var name;

var require = meteorInstall({"node_modules":{"meteor":{"cultofcoders:apollo":{"server":{"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_apollo/server/index.js                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  load: () => load,
  db: () => db,
  getRenderer: () => getRenderer
});
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);
let load;
module.link("graphql-load", {
  load(v) {
    load = v;
  }

}, 1);
let db;
module.link("meteor/cultofcoders:grapher", {
  db(v) {
    db = v;
  }

}, 2);
let getRenderer;
module.link("./ssr", {
  default(v) {
    getRenderer = v;
  }

}, 3);
module.link("./scalars");
module.link("./types");
module.link("./config", {
  default: "Config"
}, 4);
module.link("./core/users", {
  getUserForContext: "getUserForContext"
}, 5);
module.link("./initialize", {
  default: "initialize"
}, 6);
module.link("./morpher/expose", {
  default: "expose"
}, 7);
checkNpmVersions({
  'apollo-server-express': '2.x.x',
  graphql: '14.x.x',
  'graphql-load': '0.1.x',
  'graphql-type-json': '0.2.x',
  'graphql-tools': '4.x.x'
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"config.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_apollo/server/config.js                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Config = {
  userFields: {
    _id: 1,
    username: 1,
    emails: 1,
    roles: 1
  },
  middlewares: []
};
module.exportDefault(Config);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"initialize.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_apollo/server/initialize.js                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

module.export({
  default: () => initialize
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let db;
module.link("meteor/cultofcoders:grapher", {
  db(v) {
    db = v;
  }

}, 1);
let WebApp;
module.link("meteor/webapp", {
  WebApp(v) {
    WebApp = v;
  }

}, 2);
let ApolloServer;
module.link("apollo-server-express", {
  ApolloServer(v) {
    ApolloServer = v;
  }

}, 3);
let getSchema;
module.link("graphql-load", {
  getSchema(v) {
    getSchema = v;
  }

}, 4);
let AUTH_TOKEN_KEY;
module.link("../constants", {
  AUTH_TOKEN_KEY(v) {
    AUTH_TOKEN_KEY = v;
  }

}, 5);
let defaultSchemaDirectives;
module.link("./directives", {
  default(v) {
    defaultSchemaDirectives = v;
  }

}, 6);
let getUserForContext;
module.link("./core/users", {
  getUserForContext(v) {
    getUserForContext = v;
  }

}, 7);

function initialize(apolloConfig = {}, meteorApolloConfig = {}) {
  meteorApolloConfig = Object.assign({
    gui: Meteor.isDevelopment,
    middlewares: [],
    userFields: {
      _id: 1,
      roles: 1,
      username: 1,
      emails: 1
    }
  }, meteorApolloConfig);
  const {
    typeDefs,
    resolvers
  } = getSchema();
  const initialApolloConfig = Object.assign({}, apolloConfig);
  apolloConfig = (0, _objectSpread2.default)({
    introspection: Meteor.isDevelopment,
    debug: Meteor.isDevelopment,
    path: '/graphql',
    formatError: e => {
      console.error(e);
      return {
        message: e.message,
        locations: e.locations,
        path: e.path
      };
    }
  }, initialApolloConfig, {
    typeDefs,
    resolvers,
    schemaDirectives: (0, _objectSpread2.default)({}, defaultSchemaDirectives, initialApolloConfig.schemaDirectives ? initialApolloConfig.schemaDirectives : []),
    context: getContextCreator(meteorApolloConfig, initialApolloConfig.context),
    subscriptions: getSubscriptionConfig(meteorApolloConfig)
  });
  const server = new ApolloServer(apolloConfig);
  server.applyMiddleware({
    app: WebApp.connectHandlers,
    gui: meteorApolloConfig.gui
  });
  server.installSubscriptionHandlers(WebApp.httpServer);
  meteorApolloConfig.middlewares.forEach(middleware => {
    WebApp.connectHandlers.use('/graphql', middleware);
  }); // We are doing this work-around because Playground sets headers and WebApp also sets headers
  // Resulting into a conflict and a server side exception of "Headers already sent"

  WebApp.connectHandlers.use('/graphql', (req, res) => {
    if (req.method === 'GET') {
      res.end();
    }
  });
  return {
    server
  };
}

function getContextCreator(meteorApolloConfig, defaultContextResolver) {
  return function getContext({
    req,
    connection
  }) {
    return Promise.asyncApply(() => {
      const defaultContext = defaultContextResolver ? Promise.await(defaultContextResolver({
        req,
        connection
      })) : {};
      Object.assign(defaultContext, {
        db
      });

      if (connection) {
        return (0, _objectSpread2.default)({}, defaultContext, connection.context);
      } else {
        let userContext = {};

        if (Package['accounts-base']) {
          const loginToken = req.headers['meteor-login-token'] || req.cookies['meteor-login-token'];
          userContext = Promise.await(getUserForContext(loginToken, meteorApolloConfig.userFields));
        }

        return (0, _objectSpread2.default)({}, defaultContext, userContext);
      }
    });
  };
}

function getSubscriptionConfig(meteorApolloConfig) {
  return {
    onConnect: (connectionParams, webSocket, context) => Promise.asyncApply(() => {
      const loginToken = connectionParams[AUTH_TOKEN_KEY];
      return new Promise((resolve, reject) => {
        if (loginToken) {
          const userContext = getUserForContext(loginToken, meteorApolloConfig.userFields).then(userContext => {
            resolve(userContext);
          });
        } else {
          resolve({});
        }
      });
    })
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ssr.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_apollo/server/ssr.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => getRenderer
});
let ApolloClient;
module.link("apollo-client", {
  ApolloClient(v) {
    ApolloClient = v;
  }

}, 0);
let InMemoryCache;
module.link("apollo-cache-inmemory", {
  InMemoryCache(v) {
    InMemoryCache = v;
  }

}, 1);

function getRenderer(options) {
  let React;
  module.link("react", {
    default(v) {
      React = v;
    }

  }, 2);
  let renderToString;
  module.link("react-dom/server", {
    renderToString(v) {
      renderToString = v;
    }

  }, 3);
  let getDataFromTree, ApolloProvider;
  module.link("react-apollo", {
    getDataFromTree(v) {
      getDataFromTree = v;
    },

    ApolloProvider(v) {
      ApolloProvider = v;
    }

  }, 4);
  let SchemaLink;
  module.link("apollo-link-schema", {
    SchemaLink(v) {
      SchemaLink = v;
    }

  }, 5);

  const render = sink => Promise.asyncApply(() => {
    const link = new SchemaLink({
      schema: options.server.schema,
      context: Promise.await(options.server.context({
        req: sink.request
      }))
    });

    if (options.getLink) {
      link = options.getLink(link);
    }

    const client = new ApolloClient({
      ssrMode: true,
      link,
      cache: new InMemoryCache()
    });
    const context = {};
    const WrappedApp = React.createElement(ApolloProvider, {
      client: client
    }, options.app(sink));
    options.handler && Promise.await(options.handler(sink, client)); // load all data from local server;

    Promise.await(getDataFromTree(WrappedApp));
    const body = renderToString(WrappedApp);
    sink.renderIntoElementById(options.root || 'react-root', body);
    const initialState = client.extract();
    sink.appendToBody(`
      <script>window.__APOLLO_STATE__=${JSON.stringify(initialState)};</script>
    `);
  });

  return render;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"core":{"users.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_apollo/server/core/users.js                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

module.export({
  getUserForContext: () => getUserForContext
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Accounts;

if (Package['accounts-base']) {
  Accounts = Package['accounts-base'].Accounts;
}

const getUserForContext = (loginToken, userDefaultFields) => Promise.asyncApply(() => {
  if (!Accounts) {
    return {};
  } // there is a possible current user connected!


  if (loginToken) {
    // throw an error if the token is not a string
    check(loginToken, String); // the hashed token is the key to find the possible current user in the db

    const hashedToken = Accounts._hashLoginToken(loginToken); // get the possible current user from the database
    // note: no need of a fiber aware findOne + a fiber aware call break tests
    // runned with practicalmeteor:mocha if eslint is enabled


    const currentUser = Meteor.users.findOne({
      'services.resume.loginTokens.hashedToken': hashedToken
    }, {
      fields: (0, _objectSpread2.default)({}, userDefaultFields, {
        'services.resume.loginTokens': 1
      })
    }); // the current user exists

    if (currentUser) {
      // find the right login token corresponding, the current user may have
      // several sessions logged on different browsers / computers
      const tokenInformation = currentUser.services.resume.loginTokens.find(tokenInfo => tokenInfo.hashedToken === hashedToken); // get an exploitable token expiration date

      const expiresAt = Accounts._tokenExpiration(tokenInformation.when); // true if the token is expired


      const isExpired = expiresAt < new Date(); // if the token is still valid, give access to the current user
      // information in the resolvers context

      if (!isExpired) {
        // return a new context object with the current user & her id
        return {
          user: currentUser,
          userId: currentUser._id
        };
      }
    }
  }

  return {
    user: {},
    userId: null
  };
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"directives":{"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_apollo/server/directives/index.js                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

module.export({
  typeDefs: () => typeDefs
});
let grapherDirectives;
module.link("meteor/cultofcoders:grapher-schema-directives", {
  directives(v) {
    grapherDirectives = v;
  }

}, 0);
let directiveDefinitions;
module.link("meteor/cultofcoders:grapher-schema-directives", {
  directiveDefinitions(v) {
    directiveDefinitions = v;
  }

}, 1);
const typeDefs = [directiveDefinitions];
module.exportDefault((0, _objectSpread2.default)({}, grapherDirectives));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"morpher":{"docs.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_apollo/server/morpher/docs.js                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  APOLLO_MORPHER_COMPATIBLE: () => APOLLO_MORPHER_COMPATIBLE,
  DOCUMENTATION_FETCH: () => DOCUMENTATION_FETCH,
  DOCUMENTATION_INSERT: () => DOCUMENTATION_INSERT,
  DOCUMENTATION_UPDATE: () => DOCUMENTATION_UPDATE,
  DOCUMENTATION_REMOVE: () => DOCUMENTATION_REMOVE
});
const APOLLO_MORPHER_COMPATIBLE = `[**apollo-morpher**](https://www.npmjs.com/package/apollo-morpher) compatible.`;
const DOCUMENTATION_FETCH = `
"""
${APOLLO_MORPHER_COMPATIBLE}

The payload is an EJSON string that accepts "filters", "options" and other keys that are passed as params to Grapher.

Example of payload:\n
"{\\\\"filters\\\\": \\\\"{}\\\\", \\\\"options\\\\": \\\\"{}\\\\" }"
"""
`;
const DOCUMENTATION_INSERT = `
"""
${APOLLO_MORPHER_COMPATIBLE}

The payload is an EJSON string that accepts the full document

Example of payload:\n
"{\\\\"field\\\\": \\\\"value\\\\" }"
"""
`;
const DOCUMENTATION_UPDATE = `
"""
${APOLLO_MORPHER_COMPATIBLE}

The payload is an EJSON string that accepts "selector" and "modifier" as keys.

Example of payload:\n
"{\\\\"selector\\\\": \\\\"{}\\\\", \\\\"modifier\\\\": \\\\"{}\\\\" }"
"""
`;
const DOCUMENTATION_REMOVE = `
"""
${APOLLO_MORPHER_COMPATIBLE}

The payload is an EJSON string that accepts "selector" key.

Example of payload:\n
"{\\\\"selector\\\\": \\\\"{}\\\\" }"
"""
`;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"expose.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_apollo/server/morpher/expose.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let check, Match;
module.link("meteor/check", {
  check(v) {
    check = v;
  },

  Match(v) {
    Match = v;
  }

}, 0);
let db;
module.link("meteor/cultofcoders:grapher", {
  db(v) {
    db = v;
  }

}, 1);
let load;
module.link("meteor/cultofcoders:apollo", {
  load(v) {
    load = v;
  }

}, 2);
let setupDataFetching;
module.link("./setupDataFetching", {
  default(v) {
    setupDataFetching = v;
  }

}, 3);
let setupMutations;
module.link("./setupMutations", {
  default(v) {
    setupMutations = v;
  }

}, 4);
const MaybeBoolOrFunction = Match.Maybe(Match.OneOf(Boolean, Function));

const getConfig = object => {
  check(object, {
    type: String,
    collection: Function,
    update: MaybeBoolOrFunction,
    insert: MaybeBoolOrFunction,
    remove: MaybeBoolOrFunction,
    find: MaybeBoolOrFunction
  });
  const newObject = Object.assign({
    subscription: true
  }, object);
  return newObject;
};

let exposedNames = [];

const morph = config => {
  for (name in config) {
    if (exposedNames.includes(name)) {
      throw new Error(`You have already exposed ${name} somewhere else. Please make sure they do not collide.`);
    }

    exposedNames.push(name);
    let singleConfig = getConfig(config[name]);
    let modules = exposeSingle(name, singleConfig);
    load(modules);
  }
};

function exposeSingle(name, config) {
  const {
    collection,
    type
  } = config;
  let modules = [];

  if (config.insert || config.update || config.remove) {
    let {
      MutationType,
      Mutation
    } = setupMutations(config, name, type, collection);
    MutationType = `type Mutation { ${MutationType} }`;
    modules.push({
      typeDefs: MutationType,
      resolvers: {
        Mutation
      }
    });
  }

  if (config.find) {
    let {
      QueryType,
      Query
    } = setupDataFetching(config, name, type, collection);
    QueryType = `type Query { ${QueryType} }`;
    modules.push({
      typeDefs: [QueryType],
      resolvers: {
        Query
      }
    });
  }

  return modules;
}

module.exportDefault(morph);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getFields.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_apollo/server/morpher/getFields.js                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => getFields
});

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 0);

function getFields(mutator) {
  // compute modified fields
  var fields = [];
  var topLevelFields = [];

  _.each(mutator, function (params, op) {
    if (op[0] == '$') {
      _.each(_.keys(params), function (field) {
        // record the field we are trying to change
        if (!_.contains(fields, field)) {
          // fields.push(field);
          // topLevelFields.push(field.split('.')[0]);
          // like { $set: { 'array.1.xx' } }
          const specificPositionFieldMatch = /\.[\d]+(\.)?/.exec(field);

          if (specificPositionFieldMatch) {
            fields.push(field.slice(0, specificPositionFieldMatch.index));
          } else {
            if (field.indexOf('.$') !== -1) {
              if (field.indexOf('.$.') !== -1) {
                fields.push(field.split('.$.')[0]);
              } else {
                fields.push(field.split('.$')[0]);
              }
            } else {
              fields.push(field);
            }
          }

          topLevelFields.push(field.split('.')[0]);
        }
      });
    } else {
      fields.push(op);
    }
  });

  return {
    fields,
    topLevelFields
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"setupDataFetching.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_apollo/server/morpher/setupDataFetching.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => setupDataFetching
});
let EJSON;
module.link("meteor/ejson", {
  EJSON(v) {
    EJSON = v;
  }

}, 0);
let DOCUMENTATION_FETCH;
module.link("./docs", {
  DOCUMENTATION_FETCH(v) {
    DOCUMENTATION_FETCH = v;
  }

}, 1);

function setupDataFetching(config, name, type, collection) {
  let Query = {};
  let QueryType = ``;
  let Subscription = {};
  let SubscriptionType = ``;
  QueryType += `
    ${DOCUMENTATION_FETCH}
    ${name}(payload: String!): [${type}]!
  `;
  QueryType += `
    ${DOCUMENTATION_FETCH}
    ${name}Count(payload: String!): Int!
  `;
  QueryType += `
    ${DOCUMENTATION_FETCH}
    ${name}Single(payload: String!): ${type}
  `; // We are creating the function here because we are re-using it for Single ones

  const resolveSelectors = (_, {
    params
  }, ctx, ast) => {
    let astToQueryOptions;

    if (typeof config.find === 'function') {
      params = Object.assign({
        filters: {},
        options: {}
      }, params);
      let astToQueryOptions = config.find.call(null, ctx, params, ast);

      if (astToQueryOptions === false) {
        throw new Error('Unauthorized');
      }
    }

    if (astToQueryOptions === undefined || astToQueryOptions === true) {
      astToQueryOptions = {
        $filters: params.filters || {},
        $options: params.options || {}
      };
    }

    return astToQueryOptions;
  };

  const fn = (_, {
    payload
  }, ctx, ast) => {
    const params = EJSON.parse(payload);
    const astToQueryOptions = resolveSelectors(_, {
      params
    }, ctx, ast);
    return collection().astToQuery(ast, astToQueryOptions).fetch();
  };

  Query = {
    [name]: fn,

    [name + 'Count'](_, {
      payload
    }, ctx, ast) {
      const params = EJSON.parse(payload);
      const astToQueryOptions = resolveSelectors(_, {
        params
      }, ctx, ast);
      return collection().find(astToQueryOptions.$filters || {}).count();
    },

    [name + 'Single'](_, args, ctx, ast) {
      const result = fn.call(null, _, args, ctx, ast);
      return result[0] || null;
    }

  };
  /**
   * This will not be in the current release
   * 
  if (config.subscription) {
    SubscriptionType = `${name}(params: JSON!): SubscriptionEvent`;
    Subscription = {
      [name]: {
        resolve: payload => {
          if (config.subscriptionResolver) {
            return config.subscriptionResolver.call(null, payload);
          }
          return payload;
        },
        subscribe(_, { params }, ctx, ast) {
          const fields = astToFields(ast)[doc];
           if (typeof config.subscription === 'function') {
            config.subscription.call(null, ctx, fields);
          }
           const observable = collection().find({}, { fields });
          return asyncIterator(observable);
        },
      },
    };
  }
  */

  return {
    QueryType,
    SubscriptionType,
    Query,
    Subscription
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"setupMutations.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_apollo/server/morpher/setupMutations.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => setupMutations
});
let getFields;
module.link("./getFields", {
  default(v) {
    getFields = v;
  }

}, 0);
let EJSON;
module.link("meteor/ejson", {
  EJSON(v) {
    EJSON = v;
  }

}, 1);
let check;
module.link("meteor/check", {
  check(v) {
    check = v;
  }

}, 2);
let DOCUMENTATION_INSERT, DOCUMENTATION_REMOVE, DOCUMENTATION_UPDATE;
module.link("./docs", {
  DOCUMENTATION_INSERT(v) {
    DOCUMENTATION_INSERT = v;
  },

  DOCUMENTATION_REMOVE(v) {
    DOCUMENTATION_REMOVE = v;
  },

  DOCUMENTATION_UPDATE(v) {
    DOCUMENTATION_UPDATE = v;
  }

}, 3);

function setupMutations(config, name, type, collection) {
  let Mutation = {};
  let MutationType = ``;

  if (config.insert) {
    MutationType += `
      ${DOCUMENTATION_INSERT}
      ${name}Insert(payload: String!): ${type}\n
    `;

    Mutation[`${name}Insert`] = (_, {
      payload
    }, ctx) => {
      const {
        document
      } = EJSON.parse(payload);
      check(document, Object);

      if (typeof config.insert === 'function') {
        config.insert.call(null, ctx, {
          document
        });
      }

      const docId = collection().insert(document);
      return {
        _id: docId
      };
    };
  }

  if (config.update) {
    MutationType += `
      ${DOCUMENTATION_UPDATE}
      ${name}Update(payload: String!): String\n
    `;

    Mutation[`${name}Update`] = (_, {
      payload
    }, ctx) => {
      const {
        selector,
        modifier
      } = EJSON.parse(payload);
      check(selector, Object);
      check(modifier, Object);

      if (typeof config.update === 'function') {
        const {
          topLevelFields,
          fields
        } = getFields(modifier);
        config.update.call(null, ctx, {
          selector,
          modifier,
          modifiedFields: fields,
          modifiedTopLevelFields: topLevelFields
        });
      }

      const docId = collection().update(selector, modifier);
      return 'ok';
    };
  }

  if (config.remove) {
    MutationType += `
      ${DOCUMENTATION_REMOVE}
      ${name}Remove(payload: String!): String\n
    `;

    Mutation[`${name}Remove`] = (_, {
      payload
    }, ctx) => {
      const {
        selector
      } = EJSON.parse(payload);
      check(selector, Object);

      if (typeof config.insert === 'function') {
        config.remove.call(null, ctx, {
          selector
        });
      }

      collection().remove(selector);
      return 'ok';
    };
  }

  return {
    MutationType,
    Mutation
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"scalars":{"Date.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_apollo/server/scalars/Date.js                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let GraphQLScalarType;
module.link("graphql", {
  GraphQLScalarType(v) {
    GraphQLScalarType = v;
  }

}, 0);
let Kind;
module.link("graphql/language", {
  Kind(v) {
    Kind = v;
  }

}, 1);
module.exportDefault(new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',

  parseValue(value) {
    return new Date(Date.parse(value));
  },

  serialize(value) {
    return value.toISOString();
  },

  parseLiteral(ast) {
    if (ast.kind == Kind.STRING) {
      const time = Date.parse(ast.value);
      const date = new Date(time);
      return date;
    }

    return null;
  }

}));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"EJSON.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_apollo/server/scalars/EJSON.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let GraphQLScalarType;
module.link("graphql", {
  GraphQLScalarType(v) {
    GraphQLScalarType = v;
  }

}, 0);
let Kind;
module.link("graphql/language", {
  Kind(v) {
    Kind = v;
  }

}, 1);
let EJSON;
module.link("meteor/ejson", {
  EJSON(v) {
    EJSON = v;
  }

}, 2);
module.exportDefault(new GraphQLScalarType({
  name: 'EJSON',
  description: 'EJSON custom scalar type',

  parseValue(value) {
    return EJSON.parse(value);
  },

  serialize(value) {
    return EJSON.stringify(value);
  },

  parseLiteral(ast) {
    if (ast.kind == Kind.STRING) {
      return EJSON.stringify(value);
    }

    return null;
  }

}));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_apollo/server/scalars/index.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Scalars;
module.link("./scalars", {
  default(v) {
    Scalars = v;
  }

}, 0);
let DateResolver;
module.link("./Date", {
  default(v) {
    DateResolver = v;
  }

}, 1);
let GraphQLJSON;
module.link("graphql-type-json", {
  default(v) {
    GraphQLJSON = v;
  }

}, 2);
let EJSON;
module.link("./EJSON", {
  default(v) {
    EJSON = v;
  }

}, 3);
let load;
module.link("graphql-load", {
  load(v) {
    load = v;
  }

}, 4);
const typeDefs = [Scalars];
const resolvers = [{
  Date: DateResolver,
  JSON: GraphQLJSON,
  EJSON
}];
load({
  typeDefs,
  resolvers
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"scalars.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_apollo/server/scalars/scalars.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exportDefault(`
  scalar Date
  scalar JSON
  scalar EJSON
`);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"types":{"SubscriptionEventType.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_apollo/server/types/SubscriptionEventType.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exportDefault(`
  type SubscriptionEvent {
    event: String
    doc: JSON
  }
`);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_apollo/server/types/index.js                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let load;
module.link("graphql-load", {
  load(v) {
    load = v;
  }

}, 0);
let directiveTypeDefs;
module.link("../directives", {
  typeDefs(v) {
    directiveTypeDefs = v;
  }

}, 1);
let SubscriptionEventType;
module.link("./SubscriptionEventType", {
  default(v) {
    SubscriptionEventType = v;
  }

}, 2);
load({
  typeDefs: [...directiveTypeDefs, SubscriptionEventType]
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"constants.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_apollo/constants.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  AUTH_TOKEN_KEY: () => AUTH_TOKEN_KEY,
  AUTH_TOKEN_LOCALSTORAGE: () => AUTH_TOKEN_LOCALSTORAGE,
  GRAPHQL_SUBSCRIPTION_PATH: () => GRAPHQL_SUBSCRIPTION_PATH,
  GRAPHQL_SUBSCRIPTION_ENDPOINT: () => GRAPHQL_SUBSCRIPTION_ENDPOINT,
  GRAPHQL_ENDPOINT: () => GRAPHQL_ENDPOINT
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
const AUTH_TOKEN_KEY = 'meteor-login-token';
const AUTH_TOKEN_LOCALSTORAGE = 'Meteor.loginToken';
const GRAPHQL_SUBSCRIPTION_PATH = 'graphql';
const GRAPHQL_SUBSCRIPTION_ENDPOINT = Meteor.absoluteUrl(GRAPHQL_SUBSCRIPTION_PATH).replace(/http/, 'ws');
const GRAPHQL_ENDPOINT = Meteor.absoluteUrl('graphql');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/cultofcoders:apollo/server/index.js");

/* Exports */
Package._define("cultofcoders:apollo", exports);

})();

//# sourceURL=meteor://💻app/packages/cultofcoders_apollo.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmFwb2xsby9zZXJ2ZXIvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczphcG9sbG8vc2VydmVyL2NvbmZpZy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmFwb2xsby9zZXJ2ZXIvaW5pdGlhbGl6ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmFwb2xsby9zZXJ2ZXIvc3NyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6YXBvbGxvL3NlcnZlci9jb3JlL3VzZXJzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6YXBvbGxvL3NlcnZlci9kaXJlY3RpdmVzL2luZGV4LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6YXBvbGxvL3NlcnZlci9tb3JwaGVyL2RvY3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczphcG9sbG8vc2VydmVyL21vcnBoZXIvZXhwb3NlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6YXBvbGxvL3NlcnZlci9tb3JwaGVyL2dldEZpZWxkcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmFwb2xsby9zZXJ2ZXIvbW9ycGhlci9zZXR1cERhdGFGZXRjaGluZy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmFwb2xsby9zZXJ2ZXIvbW9ycGhlci9zZXR1cE11dGF0aW9ucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmFwb2xsby9zZXJ2ZXIvc2NhbGFycy9EYXRlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6YXBvbGxvL3NlcnZlci9zY2FsYXJzL0VKU09OLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6YXBvbGxvL3NlcnZlci9zY2FsYXJzL2luZGV4LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6YXBvbGxvL3NlcnZlci9zY2FsYXJzL3NjYWxhcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczphcG9sbG8vc2VydmVyL3R5cGVzL1N1YnNjcmlwdGlvbkV2ZW50VHlwZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmFwb2xsby9zZXJ2ZXIvdHlwZXMvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczphcG9sbG8vY29uc3RhbnRzLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydCIsImxvYWQiLCJkYiIsImdldFJlbmRlcmVyIiwiY2hlY2tOcG1WZXJzaW9ucyIsImxpbmsiLCJ2IiwiZGVmYXVsdCIsImdldFVzZXJGb3JDb250ZXh0IiwiZ3JhcGhxbCIsIkNvbmZpZyIsInVzZXJGaWVsZHMiLCJfaWQiLCJ1c2VybmFtZSIsImVtYWlscyIsInJvbGVzIiwibWlkZGxld2FyZXMiLCJleHBvcnREZWZhdWx0IiwiaW5pdGlhbGl6ZSIsIk1ldGVvciIsIldlYkFwcCIsIkFwb2xsb1NlcnZlciIsImdldFNjaGVtYSIsIkFVVEhfVE9LRU5fS0VZIiwiZGVmYXVsdFNjaGVtYURpcmVjdGl2ZXMiLCJhcG9sbG9Db25maWciLCJtZXRlb3JBcG9sbG9Db25maWciLCJPYmplY3QiLCJhc3NpZ24iLCJndWkiLCJpc0RldmVsb3BtZW50IiwidHlwZURlZnMiLCJyZXNvbHZlcnMiLCJpbml0aWFsQXBvbGxvQ29uZmlnIiwiaW50cm9zcGVjdGlvbiIsImRlYnVnIiwicGF0aCIsImZvcm1hdEVycm9yIiwiZSIsImNvbnNvbGUiLCJlcnJvciIsIm1lc3NhZ2UiLCJsb2NhdGlvbnMiLCJzY2hlbWFEaXJlY3RpdmVzIiwiY29udGV4dCIsImdldENvbnRleHRDcmVhdG9yIiwic3Vic2NyaXB0aW9ucyIsImdldFN1YnNjcmlwdGlvbkNvbmZpZyIsInNlcnZlciIsImFwcGx5TWlkZGxld2FyZSIsImFwcCIsImNvbm5lY3RIYW5kbGVycyIsImluc3RhbGxTdWJzY3JpcHRpb25IYW5kbGVycyIsImh0dHBTZXJ2ZXIiLCJmb3JFYWNoIiwibWlkZGxld2FyZSIsInVzZSIsInJlcSIsInJlcyIsIm1ldGhvZCIsImVuZCIsImRlZmF1bHRDb250ZXh0UmVzb2x2ZXIiLCJnZXRDb250ZXh0IiwiY29ubmVjdGlvbiIsImRlZmF1bHRDb250ZXh0IiwidXNlckNvbnRleHQiLCJQYWNrYWdlIiwibG9naW5Ub2tlbiIsImhlYWRlcnMiLCJjb29raWVzIiwib25Db25uZWN0IiwiY29ubmVjdGlvblBhcmFtcyIsIndlYlNvY2tldCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwidGhlbiIsIkFwb2xsb0NsaWVudCIsIkluTWVtb3J5Q2FjaGUiLCJvcHRpb25zIiwiUmVhY3QiLCJyZW5kZXJUb1N0cmluZyIsImdldERhdGFGcm9tVHJlZSIsIkFwb2xsb1Byb3ZpZGVyIiwiU2NoZW1hTGluayIsInJlbmRlciIsInNpbmsiLCJzY2hlbWEiLCJyZXF1ZXN0IiwiZ2V0TGluayIsImNsaWVudCIsInNzck1vZGUiLCJjYWNoZSIsIldyYXBwZWRBcHAiLCJoYW5kbGVyIiwiYm9keSIsInJlbmRlckludG9FbGVtZW50QnlJZCIsInJvb3QiLCJpbml0aWFsU3RhdGUiLCJleHRyYWN0IiwiYXBwZW5kVG9Cb2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsIkFjY291bnRzIiwidXNlckRlZmF1bHRGaWVsZHMiLCJjaGVjayIsIlN0cmluZyIsImhhc2hlZFRva2VuIiwiX2hhc2hMb2dpblRva2VuIiwiY3VycmVudFVzZXIiLCJ1c2VycyIsImZpbmRPbmUiLCJmaWVsZHMiLCJ0b2tlbkluZm9ybWF0aW9uIiwic2VydmljZXMiLCJyZXN1bWUiLCJsb2dpblRva2VucyIsImZpbmQiLCJ0b2tlbkluZm8iLCJleHBpcmVzQXQiLCJfdG9rZW5FeHBpcmF0aW9uIiwid2hlbiIsImlzRXhwaXJlZCIsIkRhdGUiLCJ1c2VyIiwidXNlcklkIiwiZ3JhcGhlckRpcmVjdGl2ZXMiLCJkaXJlY3RpdmVzIiwiZGlyZWN0aXZlRGVmaW5pdGlvbnMiLCJBUE9MTE9fTU9SUEhFUl9DT01QQVRJQkxFIiwiRE9DVU1FTlRBVElPTl9GRVRDSCIsIkRPQ1VNRU5UQVRJT05fSU5TRVJUIiwiRE9DVU1FTlRBVElPTl9VUERBVEUiLCJET0NVTUVOVEFUSU9OX1JFTU9WRSIsIk1hdGNoIiwic2V0dXBEYXRhRmV0Y2hpbmciLCJzZXR1cE11dGF0aW9ucyIsIk1heWJlQm9vbE9yRnVuY3Rpb24iLCJNYXliZSIsIk9uZU9mIiwiQm9vbGVhbiIsIkZ1bmN0aW9uIiwiZ2V0Q29uZmlnIiwib2JqZWN0IiwidHlwZSIsImNvbGxlY3Rpb24iLCJ1cGRhdGUiLCJpbnNlcnQiLCJyZW1vdmUiLCJuZXdPYmplY3QiLCJzdWJzY3JpcHRpb24iLCJleHBvc2VkTmFtZXMiLCJtb3JwaCIsImNvbmZpZyIsIm5hbWUiLCJpbmNsdWRlcyIsIkVycm9yIiwicHVzaCIsInNpbmdsZUNvbmZpZyIsIm1vZHVsZXMiLCJleHBvc2VTaW5nbGUiLCJNdXRhdGlvblR5cGUiLCJNdXRhdGlvbiIsIlF1ZXJ5VHlwZSIsIlF1ZXJ5IiwiZ2V0RmllbGRzIiwiXyIsIm11dGF0b3IiLCJ0b3BMZXZlbEZpZWxkcyIsImVhY2giLCJwYXJhbXMiLCJvcCIsImtleXMiLCJmaWVsZCIsImNvbnRhaW5zIiwic3BlY2lmaWNQb3NpdGlvbkZpZWxkTWF0Y2giLCJleGVjIiwic2xpY2UiLCJpbmRleCIsImluZGV4T2YiLCJzcGxpdCIsIkVKU09OIiwiU3Vic2NyaXB0aW9uIiwiU3Vic2NyaXB0aW9uVHlwZSIsInJlc29sdmVTZWxlY3RvcnMiLCJjdHgiLCJhc3QiLCJhc3RUb1F1ZXJ5T3B0aW9ucyIsImZpbHRlcnMiLCJjYWxsIiwidW5kZWZpbmVkIiwiJGZpbHRlcnMiLCIkb3B0aW9ucyIsImZuIiwicGF5bG9hZCIsInBhcnNlIiwiYXN0VG9RdWVyeSIsImZldGNoIiwiY291bnQiLCJhcmdzIiwicmVzdWx0IiwiZG9jdW1lbnQiLCJkb2NJZCIsInNlbGVjdG9yIiwibW9kaWZpZXIiLCJtb2RpZmllZEZpZWxkcyIsIm1vZGlmaWVkVG9wTGV2ZWxGaWVsZHMiLCJHcmFwaFFMU2NhbGFyVHlwZSIsIktpbmQiLCJkZXNjcmlwdGlvbiIsInBhcnNlVmFsdWUiLCJ2YWx1ZSIsInNlcmlhbGl6ZSIsInRvSVNPU3RyaW5nIiwicGFyc2VMaXRlcmFsIiwia2luZCIsIlNUUklORyIsInRpbWUiLCJkYXRlIiwiU2NhbGFycyIsIkRhdGVSZXNvbHZlciIsIkdyYXBoUUxKU09OIiwiZGlyZWN0aXZlVHlwZURlZnMiLCJTdWJzY3JpcHRpb25FdmVudFR5cGUiLCJBVVRIX1RPS0VOX0xPQ0FMU1RPUkFHRSIsIkdSQVBIUUxfU1VCU0NSSVBUSU9OX1BBVEgiLCJHUkFQSFFMX1NVQlNDUklQVElPTl9FTkRQT0lOVCIsIkdSQVBIUUxfRU5EUE9JTlQiLCJhYnNvbHV0ZVVybCIsInJlcGxhY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDQyxNQUFJLEVBQUMsTUFBSUEsSUFBVjtBQUFlQyxJQUFFLEVBQUMsTUFBSUEsRUFBdEI7QUFBeUJDLGFBQVcsRUFBQyxNQUFJQTtBQUF6QyxDQUFkO0FBQXFFLElBQUlDLGdCQUFKO0FBQXFCTCxNQUFNLENBQUNNLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRCxrQkFBZ0IsQ0FBQ0UsQ0FBRCxFQUFHO0FBQUNGLG9CQUFnQixHQUFDRSxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFBOEYsSUFBSUwsSUFBSjtBQUFT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QWQ7QUFBcVEsSUFBSWhOLE1BQUo7QUFBV3BCLE1BQU0sQ0FBQ00sSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ2MsUUFBTSxDQUFDYixDQUFELEVBQUc7QUFBQ2EsVUFBTSxHQUFDYixDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBRXpRLE1BQU1pQixjQUFjLEdBQUcsb0JBQXZCO0FBQ0EsTUFBTXlNLHVCQUF1QixHQUFHLG1CQUFoQztBQUVBLE1BQU1DLHlCQUF5QixHQUFHLFNBQWxDO0FBQ0EsTUFBTUMsNkJBQTZCLEdBQUcvTSxNQUFNLENBQUNpTixXQUFQLENBQzNDSCx5QkFEMkMsRUFFM0NJLE9BRjJDLENBRW5DLE1BRm1DLEVBRTNCLElBRjJCLENBQXRDO0FBSUEsTUFBTUYsZ0JBQWdCLEdBQUdoTixNQUFNLENBQUNpTixXQUFQLENBQW1CLFNBQW5CLENBQXpCLEMiLCJmaWxlIjoiL3BhY2thZ2VzL2N1bHRvZmNvZGVyc19hcG9sbG8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5pbXBvcnQgeyBsb2FkIH0gZnJvbSAnZ3JhcGhxbC1sb2FkJztcbmltcG9ydCB7IGRiIH0gZnJvbSAnbWV0ZW9yL2N1bHRvZmNvZGVyczpncmFwaGVyJztcbmltcG9ydCBnZXRSZW5kZXJlciBmcm9tICcuL3Nzcic7XG5cbmltcG9ydCAnLi9zY2FsYXJzJztcbmltcG9ydCAnLi90eXBlcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcbmV4cG9ydCB7IGdldFVzZXJGb3JDb250ZXh0IH0gZnJvbSAnLi9jb3JlL3VzZXJzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgaW5pdGlhbGl6ZSB9IGZyb20gJy4vaW5pdGlhbGl6ZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGV4cG9zZSB9IGZyb20gJy4vbW9ycGhlci9leHBvc2UnO1xuXG5leHBvcnQgeyBsb2FkLCBkYiwgZ2V0UmVuZGVyZXIgfTtcblxuY2hlY2tOcG1WZXJzaW9ucyh7XG4gICdhcG9sbG8tc2VydmVyLWV4cHJlc3MnOiAnMi54LngnLFxuICBncmFwaHFsOiAnMTQueC54JyxcbiAgJ2dyYXBocWwtbG9hZCc6ICcwLjEueCcsXG4gICdncmFwaHFsLXR5cGUtanNvbic6ICcwLjIueCcsXG4gICdncmFwaHFsLXRvb2xzJzogJzQueC54Jyxcbn0pO1xuIiwibGV0IENvbmZpZyA9IHtcbiAgdXNlckZpZWxkczoge1xuICAgIF9pZDogMSxcbiAgICB1c2VybmFtZTogMSxcbiAgICBlbWFpbHM6IDEsXG4gICAgcm9sZXM6IDEsXG4gIH0sXG4gIG1pZGRsZXdhcmVzOiBbXSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENvbmZpZztcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgZGIgfSBmcm9tICdtZXRlb3IvY3VsdG9mY29kZXJzOmdyYXBoZXInO1xuaW1wb3J0IHsgV2ViQXBwIH0gZnJvbSAnbWV0ZW9yL3dlYmFwcCc7XG5pbXBvcnQgeyBBcG9sbG9TZXJ2ZXIgfSBmcm9tICdhcG9sbG8tc2VydmVyLWV4cHJlc3MnO1xuaW1wb3J0IHsgZ2V0U2NoZW1hIH0gZnJvbSAnZ3JhcGhxbC1sb2FkJztcbmltcG9ydCB7IEFVVEhfVE9LRU5fS0VZIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCBkZWZhdWx0U2NoZW1hRGlyZWN0aXZlcyBmcm9tICcuL2RpcmVjdGl2ZXMnO1xuaW1wb3J0IHsgZ2V0VXNlckZvckNvbnRleHQgfSBmcm9tICcuL2NvcmUvdXNlcnMnO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0geyp9IGFwb2xsb0NvbmZpZyBPcHRpb25zIGh0dHBzOi8vd3d3LmFwb2xsb2dyYXBocWwuY29tL2RvY3MvYXBvbGxvLXNlcnZlci9hcGkvYXBvbGxvLXNlcnZlci5odG1sI2NvbnN0cnVjdG9yLW9wdGlvbnMtbHQtQXBvbGxvU2VydmVyLWd0XG4gKiBAcGFyYW0ge01ldGVvckFwb2xsb0NvbmZpZ30gbWV0ZW9yQXBvbGxvQ29uZmlnXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGluaXRpYWxpemUoYXBvbGxvQ29uZmlnID0ge30sIG1ldGVvckFwb2xsb0NvbmZpZyA9IHt9KSB7XG4gIG1ldGVvckFwb2xsb0NvbmZpZyA9IE9iamVjdC5hc3NpZ24oXG4gICAge1xuICAgICAgZ3VpOiBNZXRlb3IuaXNEZXZlbG9wbWVudCxcbiAgICAgIG1pZGRsZXdhcmVzOiBbXSxcbiAgICAgIHVzZXJGaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICByb2xlczogMSxcbiAgICAgICAgdXNlcm5hbWU6IDEsXG4gICAgICAgIGVtYWlsczogMSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBtZXRlb3JBcG9sbG9Db25maWdcbiAgKTtcblxuICBjb25zdCB7IHR5cGVEZWZzLCByZXNvbHZlcnMgfSA9IGdldFNjaGVtYSgpO1xuXG4gIGNvbnN0IGluaXRpYWxBcG9sbG9Db25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBhcG9sbG9Db25maWcpO1xuICBhcG9sbG9Db25maWcgPSB7XG4gICAgaW50cm9zcGVjdGlvbjogTWV0ZW9yLmlzRGV2ZWxvcG1lbnQsXG4gICAgZGVidWc6IE1ldGVvci5pc0RldmVsb3BtZW50LFxuICAgIHBhdGg6ICcvZ3JhcGhxbCcsXG4gICAgZm9ybWF0RXJyb3I6IGUgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcihlKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgICBsb2NhdGlvbnM6IGUubG9jYXRpb25zLFxuICAgICAgICBwYXRoOiBlLnBhdGgsXG4gICAgICB9O1xuICAgIH0sXG4gICAgLi4uaW5pdGlhbEFwb2xsb0NvbmZpZyxcbiAgICB0eXBlRGVmcyxcbiAgICByZXNvbHZlcnMsXG4gICAgc2NoZW1hRGlyZWN0aXZlczoge1xuICAgICAgLi4uZGVmYXVsdFNjaGVtYURpcmVjdGl2ZXMsXG4gICAgICAuLi4oaW5pdGlhbEFwb2xsb0NvbmZpZy5zY2hlbWFEaXJlY3RpdmVzXG4gICAgICAgID8gaW5pdGlhbEFwb2xsb0NvbmZpZy5zY2hlbWFEaXJlY3RpdmVzXG4gICAgICAgIDogW10pLFxuICAgIH0sXG4gICAgY29udGV4dDogZ2V0Q29udGV4dENyZWF0b3IobWV0ZW9yQXBvbGxvQ29uZmlnLCBpbml0aWFsQXBvbGxvQ29uZmlnLmNvbnRleHQpLFxuICAgIHN1YnNjcmlwdGlvbnM6IGdldFN1YnNjcmlwdGlvbkNvbmZpZyhtZXRlb3JBcG9sbG9Db25maWcpLFxuICB9O1xuXG4gIGNvbnN0IHNlcnZlciA9IG5ldyBBcG9sbG9TZXJ2ZXIoYXBvbGxvQ29uZmlnKTtcblxuICBzZXJ2ZXIuYXBwbHlNaWRkbGV3YXJlKHtcbiAgICBhcHA6IFdlYkFwcC5jb25uZWN0SGFuZGxlcnMsXG4gICAgZ3VpOiBtZXRlb3JBcG9sbG9Db25maWcuZ3VpLFxuICB9KTtcblxuICBzZXJ2ZXIuaW5zdGFsbFN1YnNjcmlwdGlvbkhhbmRsZXJzKFdlYkFwcC5odHRwU2VydmVyKTtcblxuICBtZXRlb3JBcG9sbG9Db25maWcubWlkZGxld2FyZXMuZm9yRWFjaChtaWRkbGV3YXJlID0+IHtcbiAgICBXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZSgnL2dyYXBocWwnLCBtaWRkbGV3YXJlKTtcbiAgfSk7XG5cbiAgLy8gV2UgYXJlIGRvaW5nIHRoaXMgd29yay1hcm91bmQgYmVjYXVzZSBQbGF5Z3JvdW5kIHNldHMgaGVhZGVycyBhbmQgV2ViQXBwIGFsc28gc2V0cyBoZWFkZXJzXG4gIC8vIFJlc3VsdGluZyBpbnRvIGEgY29uZmxpY3QgYW5kIGEgc2VydmVyIHNpZGUgZXhjZXB0aW9uIG9mIFwiSGVhZGVycyBhbHJlYWR5IHNlbnRcIlxuICBXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZSgnL2dyYXBocWwnLCAocmVxLCByZXMpID0+IHtcbiAgICBpZiAocmVxLm1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgc2VydmVyLFxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRDb250ZXh0Q3JlYXRvcihtZXRlb3JBcG9sbG9Db25maWcsIGRlZmF1bHRDb250ZXh0UmVzb2x2ZXIpIHtcbiAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uIGdldENvbnRleHQoeyByZXEsIGNvbm5lY3Rpb24gfSkge1xuICAgIGNvbnN0IGRlZmF1bHRDb250ZXh0ID0gZGVmYXVsdENvbnRleHRSZXNvbHZlclxuICAgICAgPyBhd2FpdCBkZWZhdWx0Q29udGV4dFJlc29sdmVyKHsgcmVxLCBjb25uZWN0aW9uIH0pXG4gICAgICA6IHt9O1xuXG4gICAgT2JqZWN0LmFzc2lnbihkZWZhdWx0Q29udGV4dCwgeyBkYiB9KTtcblxuICAgIGlmIChjb25uZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGV4dCxcbiAgICAgICAgLi4uY29ubmVjdGlvbi5jb250ZXh0LFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHVzZXJDb250ZXh0ID0ge307XG4gICAgICBpZiAoUGFja2FnZVsnYWNjb3VudHMtYmFzZSddKSB7XG4gICAgICAgIGNvbnN0IGxvZ2luVG9rZW4gPVxuICAgICAgICAgIHJlcS5oZWFkZXJzWydtZXRlb3ItbG9naW4tdG9rZW4nXSB8fCByZXEuY29va2llc1snbWV0ZW9yLWxvZ2luLXRva2VuJ107XG4gICAgICAgIHVzZXJDb250ZXh0ID0gYXdhaXQgZ2V0VXNlckZvckNvbnRleHQobG9naW5Ub2tlbiwgbWV0ZW9yQXBvbGxvQ29uZmlnLnVzZXJGaWVsZHMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGV4dCxcbiAgICAgICAgLi4udXNlckNvbnRleHQsXG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0U3Vic2NyaXB0aW9uQ29uZmlnKG1ldGVvckFwb2xsb0NvbmZpZykge1xuICByZXR1cm4ge1xuICAgIG9uQ29ubmVjdDogYXN5bmMgKGNvbm5lY3Rpb25QYXJhbXMsIHdlYlNvY2tldCwgY29udGV4dCkgPT4ge1xuICAgICAgY29uc3QgbG9naW5Ub2tlbiA9IGNvbm5lY3Rpb25QYXJhbXNbQVVUSF9UT0tFTl9LRVldO1xuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAobG9naW5Ub2tlbikge1xuICAgICAgICAgIGNvbnN0IHVzZXJDb250ZXh0ID0gZ2V0VXNlckZvckNvbnRleHQoXG4gICAgICAgICAgICBsb2dpblRva2VuLFxuICAgICAgICAgICAgbWV0ZW9yQXBvbGxvQ29uZmlnLnVzZXJGaWVsZHNcbiAgICAgICAgICApLnRoZW4odXNlckNvbnRleHQgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSh1c2VyQ29udGV4dCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZSh7fSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gIH07XG59XG4iLCJpbXBvcnQgeyBBcG9sbG9DbGllbnQgfSBmcm9tICdhcG9sbG8tY2xpZW50JztcbmltcG9ydCB7IEluTWVtb3J5Q2FjaGUgfSBmcm9tICdhcG9sbG8tY2FjaGUtaW5tZW1vcnknO1xuXG4vKipcbiAqIEBwYXJhbSB7KCkgPT4gUmVhY3QuRWxlbWVudH0gb3B0aW9ucy5hcHBcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnJvb3QgVGhlIGlkIG9mIGVsZW1lbnQgd2UncmUgZ29ubmEgcmVuZGVyIGluXG4gKiBAcGFyYW0ge0Fwb2xsb1NlcnZlcn0gb3B0aW9ucy5zZXJ2ZXIgVGhlIGlkIG9mIGVsZW1lbnQgd2UncmUgZ29ubmEgcmVuZGVyIGluXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLmhhbmRsZXIgUGVyZm9ybSBhZGRpdGlvbmFsIG9wZXJhdGlvbnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMuZ2V0TGluayBQZXJmb3JtIGFkZGl0aW9uYWwgb3BlcmF0aW9uc1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRSZW5kZXJlcihvcHRpb25zKSB7XG4gIC8vIFdlIHdlaXJkbHkgZG8gaXQgaGVyZSBzbyB0aGUgcGFja2FnZSBkb2Vzbid0IGZvcmNlIHlvdSB0byBoYXZlIHRoZXNlIHBhY2thZ2VzIGFkZGVkLlxuICBpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuICBpbXBvcnQgeyByZW5kZXJUb1N0cmluZyB9IGZyb20gJ3JlYWN0LWRvbS9zZXJ2ZXInO1xuICBpbXBvcnQgeyBnZXREYXRhRnJvbVRyZWUsIEFwb2xsb1Byb3ZpZGVyIH0gZnJvbSAncmVhY3QtYXBvbGxvJztcbiAgaW1wb3J0IHsgU2NoZW1hTGluayB9IGZyb20gJ2Fwb2xsby1saW5rLXNjaGVtYSc7XG5cbiAgY29uc3QgcmVuZGVyID0gYXN5bmMgc2luayA9PiB7XG4gICAgY29uc3QgbGluayA9IG5ldyBTY2hlbWFMaW5rKHtcbiAgICAgIHNjaGVtYTogb3B0aW9ucy5zZXJ2ZXIuc2NoZW1hLFxuICAgICAgY29udGV4dDogYXdhaXQgb3B0aW9ucy5zZXJ2ZXIuY29udGV4dCh7IHJlcTogc2luay5yZXF1ZXN0IH0pLFxuICAgIH0pO1xuXG4gICAgaWYgKG9wdGlvbnMuZ2V0TGluaykge1xuICAgICAgbGluayA9IG9wdGlvbnMuZ2V0TGluayhsaW5rKTtcbiAgICB9XG5cbiAgICBjb25zdCBjbGllbnQgPSBuZXcgQXBvbGxvQ2xpZW50KHtcbiAgICAgIHNzck1vZGU6IHRydWUsXG4gICAgICBsaW5rLFxuICAgICAgY2FjaGU6IG5ldyBJbk1lbW9yeUNhY2hlKCksXG4gICAgfSk7XG5cbiAgICBjb25zdCBjb250ZXh0ID0ge307XG4gICAgY29uc3QgV3JhcHBlZEFwcCA9IChcbiAgICAgIDxBcG9sbG9Qcm92aWRlciBjbGllbnQ9e2NsaWVudH0+e29wdGlvbnMuYXBwKHNpbmspfTwvQXBvbGxvUHJvdmlkZXI+XG4gICAgKTtcblxuICAgIG9wdGlvbnMuaGFuZGxlciAmJiAoYXdhaXQgb3B0aW9ucy5oYW5kbGVyKHNpbmssIGNsaWVudCkpO1xuXG4gICAgLy8gbG9hZCBhbGwgZGF0YSBmcm9tIGxvY2FsIHNlcnZlcjtcbiAgICBhd2FpdCBnZXREYXRhRnJvbVRyZWUoV3JhcHBlZEFwcCk7XG5cbiAgICBjb25zdCBib2R5ID0gcmVuZGVyVG9TdHJpbmcoV3JhcHBlZEFwcCk7XG4gICAgc2luay5yZW5kZXJJbnRvRWxlbWVudEJ5SWQob3B0aW9ucy5yb290IHx8ICdyZWFjdC1yb290JywgYm9keSk7XG5cbiAgICBjb25zdCBpbml0aWFsU3RhdGUgPSBjbGllbnQuZXh0cmFjdCgpO1xuICAgIHNpbmsuYXBwZW5kVG9Cb2R5KGBcbiAgICAgIDxzY3JpcHQ+d2luZG93Ll9fQVBPTExPX1NUQVRFX189JHtKU09OLnN0cmluZ2lmeShpbml0aWFsU3RhdGUpfTs8L3NjcmlwdD5cbiAgICBgKTtcbiAgfTtcblxuICByZXR1cm4gcmVuZGVyO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5cbmxldCBBY2NvdW50cztcbmlmIChQYWNrYWdlWydhY2NvdW50cy1iYXNlJ10pIHtcbiAgQWNjb3VudHMgPSBQYWNrYWdlWydhY2NvdW50cy1iYXNlJ10uQWNjb3VudHM7XG59XG5cbmV4cG9ydCBjb25zdCBnZXRVc2VyRm9yQ29udGV4dCA9IGFzeW5jIChsb2dpblRva2VuLCB1c2VyRGVmYXVsdEZpZWxkcykgPT4ge1xuICBpZiAoIUFjY291bnRzKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgLy8gdGhlcmUgaXMgYSBwb3NzaWJsZSBjdXJyZW50IHVzZXIgY29ubmVjdGVkIVxuICBpZiAobG9naW5Ub2tlbikge1xuICAgIC8vIHRocm93IGFuIGVycm9yIGlmIHRoZSB0b2tlbiBpcyBub3QgYSBzdHJpbmdcbiAgICBjaGVjayhsb2dpblRva2VuLCBTdHJpbmcpO1xuXG4gICAgLy8gdGhlIGhhc2hlZCB0b2tlbiBpcyB0aGUga2V5IHRvIGZpbmQgdGhlIHBvc3NpYmxlIGN1cnJlbnQgdXNlciBpbiB0aGUgZGJcbiAgICBjb25zdCBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihsb2dpblRva2VuKTtcblxuICAgIC8vIGdldCB0aGUgcG9zc2libGUgY3VycmVudCB1c2VyIGZyb20gdGhlIGRhdGFiYXNlXG4gICAgLy8gbm90ZTogbm8gbmVlZCBvZiBhIGZpYmVyIGF3YXJlIGZpbmRPbmUgKyBhIGZpYmVyIGF3YXJlIGNhbGwgYnJlYWsgdGVzdHNcbiAgICAvLyBydW5uZWQgd2l0aCBwcmFjdGljYWxtZXRlb3I6bW9jaGEgaWYgZXNsaW50IGlzIGVuYWJsZWRcbiAgICBjb25zdCBjdXJyZW50VXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKFxuICAgICAge1xuICAgICAgICAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuJzogaGFzaGVkVG9rZW4sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAuLi51c2VyRGVmYXVsdEZpZWxkcyxcbiAgICAgICAgICAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zJzogMSxcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gdGhlIGN1cnJlbnQgdXNlciBleGlzdHNcbiAgICBpZiAoY3VycmVudFVzZXIpIHtcbiAgICAgIC8vIGZpbmQgdGhlIHJpZ2h0IGxvZ2luIHRva2VuIGNvcnJlc3BvbmRpbmcsIHRoZSBjdXJyZW50IHVzZXIgbWF5IGhhdmVcbiAgICAgIC8vIHNldmVyYWwgc2Vzc2lvbnMgbG9nZ2VkIG9uIGRpZmZlcmVudCBicm93c2VycyAvIGNvbXB1dGVyc1xuICAgICAgY29uc3QgdG9rZW5JbmZvcm1hdGlvbiA9IGN1cnJlbnRVc2VyLnNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5maW5kKFxuICAgICAgICB0b2tlbkluZm8gPT4gdG9rZW5JbmZvLmhhc2hlZFRva2VuID09PSBoYXNoZWRUb2tlblxuICAgICAgKTtcblxuICAgICAgLy8gZ2V0IGFuIGV4cGxvaXRhYmxlIHRva2VuIGV4cGlyYXRpb24gZGF0ZVxuICAgICAgY29uc3QgZXhwaXJlc0F0ID0gQWNjb3VudHMuX3Rva2VuRXhwaXJhdGlvbih0b2tlbkluZm9ybWF0aW9uLndoZW4pO1xuXG4gICAgICAvLyB0cnVlIGlmIHRoZSB0b2tlbiBpcyBleHBpcmVkXG4gICAgICBjb25zdCBpc0V4cGlyZWQgPSBleHBpcmVzQXQgPCBuZXcgRGF0ZSgpO1xuXG4gICAgICAvLyBpZiB0aGUgdG9rZW4gaXMgc3RpbGwgdmFsaWQsIGdpdmUgYWNjZXNzIHRvIHRoZSBjdXJyZW50IHVzZXJcbiAgICAgIC8vIGluZm9ybWF0aW9uIGluIHRoZSByZXNvbHZlcnMgY29udGV4dFxuICAgICAgaWYgKCFpc0V4cGlyZWQpIHtcbiAgICAgICAgLy8gcmV0dXJuIGEgbmV3IGNvbnRleHQgb2JqZWN0IHdpdGggdGhlIGN1cnJlbnQgdXNlciAmIGhlciBpZFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVzZXI6IGN1cnJlbnRVc2VyLFxuICAgICAgICAgIHVzZXJJZDogY3VycmVudFVzZXIuX2lkLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdXNlcjoge30sXG4gICAgdXNlcklkOiBudWxsLFxuICB9O1xufTtcbiIsImltcG9ydCB7IGRpcmVjdGl2ZXMgYXMgZ3JhcGhlckRpcmVjdGl2ZXMgfSBmcm9tICdtZXRlb3IvY3VsdG9mY29kZXJzOmdyYXBoZXItc2NoZW1hLWRpcmVjdGl2ZXMnO1xuaW1wb3J0IHsgZGlyZWN0aXZlRGVmaW5pdGlvbnMgfSBmcm9tICdtZXRlb3IvY3VsdG9mY29kZXJzOmdyYXBoZXItc2NoZW1hLWRpcmVjdGl2ZXMnO1xuXG5leHBvcnQgY29uc3QgdHlwZURlZnMgPSBbZGlyZWN0aXZlRGVmaW5pdGlvbnNdO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC4uLmdyYXBoZXJEaXJlY3RpdmVzLFxufTtcbiIsImV4cG9ydCBjb25zdCBBUE9MTE9fTU9SUEhFUl9DT01QQVRJQkxFID0gYFsqKmFwb2xsby1tb3JwaGVyKipdKGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL2Fwb2xsby1tb3JwaGVyKSBjb21wYXRpYmxlLmA7XG5cbmV4cG9ydCBjb25zdCBET0NVTUVOVEFUSU9OX0ZFVENIID0gYFxuXCJcIlwiXG4ke0FQT0xMT19NT1JQSEVSX0NPTVBBVElCTEV9XG5cblRoZSBwYXlsb2FkIGlzIGFuIEVKU09OIHN0cmluZyB0aGF0IGFjY2VwdHMgXCJmaWx0ZXJzXCIsIFwib3B0aW9uc1wiIGFuZCBvdGhlciBrZXlzIHRoYXQgYXJlIHBhc3NlZCBhcyBwYXJhbXMgdG8gR3JhcGhlci5cblxuRXhhbXBsZSBvZiBwYXlsb2FkOlxcblxuXCJ7XFxcXFxcXFxcImZpbHRlcnNcXFxcXFxcXFwiOiBcXFxcXFxcXFwie31cXFxcXFxcXFwiLCBcXFxcXFxcXFwib3B0aW9uc1xcXFxcXFxcXCI6IFxcXFxcXFxcXCJ7fVxcXFxcXFxcXCIgfVwiXG5cIlwiXCJcbmA7XG5cbmV4cG9ydCBjb25zdCBET0NVTUVOVEFUSU9OX0lOU0VSVCA9IGBcblwiXCJcIlxuJHtBUE9MTE9fTU9SUEhFUl9DT01QQVRJQkxFfVxuXG5UaGUgcGF5bG9hZCBpcyBhbiBFSlNPTiBzdHJpbmcgdGhhdCBhY2NlcHRzIHRoZSBmdWxsIGRvY3VtZW50XG5cbkV4YW1wbGUgb2YgcGF5bG9hZDpcXG5cblwie1xcXFxcXFxcXCJmaWVsZFxcXFxcXFxcXCI6IFxcXFxcXFxcXCJ2YWx1ZVxcXFxcXFxcXCIgfVwiXG5cIlwiXCJcbmA7XG5cbmV4cG9ydCBjb25zdCBET0NVTUVOVEFUSU9OX1VQREFURSA9IGBcblwiXCJcIlxuJHtBUE9MTE9fTU9SUEhFUl9DT01QQVRJQkxFfVxuXG5UaGUgcGF5bG9hZCBpcyBhbiBFSlNPTiBzdHJpbmcgdGhhdCBhY2NlcHRzIFwic2VsZWN0b3JcIiBhbmQgXCJtb2RpZmllclwiIGFzIGtleXMuXG5cbkV4YW1wbGUgb2YgcGF5bG9hZDpcXG5cblwie1xcXFxcXFxcXCJzZWxlY3RvclxcXFxcXFxcXCI6IFxcXFxcXFxcXCJ7fVxcXFxcXFxcXCIsIFxcXFxcXFxcXCJtb2RpZmllclxcXFxcXFxcXCI6IFxcXFxcXFxcXCJ7fVxcXFxcXFxcXCIgfVwiXG5cIlwiXCJcbmA7XG5cbmV4cG9ydCBjb25zdCBET0NVTUVOVEFUSU9OX1JFTU9WRSA9IGBcblwiXCJcIlxuJHtBUE9MTE9fTU9SUEhFUl9DT01QQVRJQkxFfVxuXG5UaGUgcGF5bG9hZCBpcyBhbiBFSlNPTiBzdHJpbmcgdGhhdCBhY2NlcHRzIFwic2VsZWN0b3JcIiBrZXkuXG5cbkV4YW1wbGUgb2YgcGF5bG9hZDpcXG5cblwie1xcXFxcXFxcXCJzZWxlY3RvclxcXFxcXFxcXCI6IFxcXFxcXFxcXCJ7fVxcXFxcXFxcXCIgfVwiXG5cIlwiXCJcbmA7XG4iLCJpbXBvcnQgeyBjaGVjaywgTWF0Y2ggfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuaW1wb3J0IHsgZGIgfSBmcm9tICdtZXRlb3IvY3VsdG9mY29kZXJzOmdyYXBoZXInO1xuaW1wb3J0IHsgbG9hZCB9IGZyb20gJ21ldGVvci9jdWx0b2Zjb2RlcnM6YXBvbGxvJztcbmltcG9ydCBzZXR1cERhdGFGZXRjaGluZyBmcm9tICcuL3NldHVwRGF0YUZldGNoaW5nJztcbmltcG9ydCBzZXR1cE11dGF0aW9ucyBmcm9tICcuL3NldHVwTXV0YXRpb25zJztcblxuY29uc3QgTWF5YmVCb29sT3JGdW5jdGlvbiA9IE1hdGNoLk1heWJlKE1hdGNoLk9uZU9mKEJvb2xlYW4sIEZ1bmN0aW9uKSk7XG5cbmNvbnN0IGdldENvbmZpZyA9IG9iamVjdCA9PiB7XG4gIGNoZWNrKG9iamVjdCwge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBjb2xsZWN0aW9uOiBGdW5jdGlvbixcbiAgICB1cGRhdGU6IE1heWJlQm9vbE9yRnVuY3Rpb24sXG4gICAgaW5zZXJ0OiBNYXliZUJvb2xPckZ1bmN0aW9uLFxuICAgIHJlbW92ZTogTWF5YmVCb29sT3JGdW5jdGlvbixcbiAgICBmaW5kOiBNYXliZUJvb2xPckZ1bmN0aW9uLFxuICB9KTtcblxuICBjb25zdCBuZXdPYmplY3QgPSBPYmplY3QuYXNzaWduKFxuICAgIHtcbiAgICAgIHN1YnNjcmlwdGlvbjogdHJ1ZSxcbiAgICB9LFxuICAgIG9iamVjdFxuICApO1xuXG4gIHJldHVybiBuZXdPYmplY3Q7XG59O1xuXG5sZXQgZXhwb3NlZE5hbWVzID0gW107XG5cbmNvbnN0IG1vcnBoID0gY29uZmlnID0+IHtcbiAgZm9yIChuYW1lIGluIGNvbmZpZykge1xuICAgIGlmIChleHBvc2VkTmFtZXMuaW5jbHVkZXMobmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFlvdSBoYXZlIGFscmVhZHkgZXhwb3NlZCAke25hbWV9IHNvbWV3aGVyZSBlbHNlLiBQbGVhc2UgbWFrZSBzdXJlIHRoZXkgZG8gbm90IGNvbGxpZGUuYFxuICAgICAgKTtcbiAgICB9XG4gICAgZXhwb3NlZE5hbWVzLnB1c2gobmFtZSk7XG5cbiAgICBsZXQgc2luZ2xlQ29uZmlnID0gZ2V0Q29uZmlnKGNvbmZpZ1tuYW1lXSk7XG4gICAgbGV0IG1vZHVsZXMgPSBleHBvc2VTaW5nbGUobmFtZSwgc2luZ2xlQ29uZmlnKTtcblxuICAgIGxvYWQobW9kdWxlcyk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGV4cG9zZVNpbmdsZShuYW1lLCBjb25maWcpIHtcbiAgY29uc3QgeyBjb2xsZWN0aW9uLCB0eXBlIH0gPSBjb25maWc7XG5cbiAgbGV0IG1vZHVsZXMgPSBbXTtcblxuICBpZiAoY29uZmlnLmluc2VydCB8fCBjb25maWcudXBkYXRlIHx8IGNvbmZpZy5yZW1vdmUpIHtcbiAgICBsZXQgeyBNdXRhdGlvblR5cGUsIE11dGF0aW9uIH0gPSBzZXR1cE11dGF0aW9ucyhcbiAgICAgIGNvbmZpZyxcbiAgICAgIG5hbWUsXG4gICAgICB0eXBlLFxuICAgICAgY29sbGVjdGlvblxuICAgICk7XG5cbiAgICBNdXRhdGlvblR5cGUgPSBgdHlwZSBNdXRhdGlvbiB7ICR7TXV0YXRpb25UeXBlfSB9YDtcblxuICAgIG1vZHVsZXMucHVzaCh7XG4gICAgICB0eXBlRGVmczogTXV0YXRpb25UeXBlLFxuICAgICAgcmVzb2x2ZXJzOiB7IE11dGF0aW9uIH0sXG4gICAgfSk7XG4gIH1cblxuICBpZiAoY29uZmlnLmZpbmQpIHtcbiAgICBsZXQgeyBRdWVyeVR5cGUsIFF1ZXJ5IH0gPSBzZXR1cERhdGFGZXRjaGluZyhcbiAgICAgIGNvbmZpZyxcbiAgICAgIG5hbWUsXG4gICAgICB0eXBlLFxuICAgICAgY29sbGVjdGlvblxuICAgICk7XG5cbiAgICBRdWVyeVR5cGUgPSBgdHlwZSBRdWVyeSB7ICR7UXVlcnlUeXBlfSB9YDtcblxuICAgIG1vZHVsZXMucHVzaCh7XG4gICAgICB0eXBlRGVmczogW1F1ZXJ5VHlwZV0sXG4gICAgICByZXNvbHZlcnM6IHsgUXVlcnkgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBtb2R1bGVzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtb3JwaDtcbiIsImltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5cbi8qKlxuICogQHBhcmFtIG11dGF0b3JcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RmllbGRzKG11dGF0b3IpIHtcbiAgLy8gY29tcHV0ZSBtb2RpZmllZCBmaWVsZHNcbiAgdmFyIGZpZWxkcyA9IFtdO1xuICB2YXIgdG9wTGV2ZWxGaWVsZHMgPSBbXTtcblxuICBfLmVhY2gobXV0YXRvciwgZnVuY3Rpb24ocGFyYW1zLCBvcCkge1xuICAgIGlmIChvcFswXSA9PSAnJCcpIHtcbiAgICAgIF8uZWFjaChfLmtleXMocGFyYW1zKSwgZnVuY3Rpb24oZmllbGQpIHtcbiAgICAgICAgLy8gcmVjb3JkIHRoZSBmaWVsZCB3ZSBhcmUgdHJ5aW5nIHRvIGNoYW5nZVxuICAgICAgICBpZiAoIV8uY29udGFpbnMoZmllbGRzLCBmaWVsZCkpIHtcbiAgICAgICAgICAvLyBmaWVsZHMucHVzaChmaWVsZCk7XG4gICAgICAgICAgLy8gdG9wTGV2ZWxGaWVsZHMucHVzaChmaWVsZC5zcGxpdCgnLicpWzBdKTtcblxuICAgICAgICAgIC8vIGxpa2UgeyAkc2V0OiB7ICdhcnJheS4xLnh4JyB9IH1cbiAgICAgICAgICBjb25zdCBzcGVjaWZpY1Bvc2l0aW9uRmllbGRNYXRjaCA9IC9cXC5bXFxkXSsoXFwuKT8vLmV4ZWMoZmllbGQpO1xuICAgICAgICAgIGlmIChzcGVjaWZpY1Bvc2l0aW9uRmllbGRNYXRjaCkge1xuICAgICAgICAgICAgZmllbGRzLnB1c2goZmllbGQuc2xpY2UoMCwgc3BlY2lmaWNQb3NpdGlvbkZpZWxkTWF0Y2guaW5kZXgpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZpZWxkLmluZGV4T2YoJy4kJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgIGlmIChmaWVsZC5pbmRleE9mKCcuJC4nKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHMucHVzaChmaWVsZC5zcGxpdCgnLiQuJylbMF0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkLnNwbGl0KCcuJCcpWzBdKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZmllbGRzLnB1c2goZmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRvcExldmVsRmllbGRzLnB1c2goZmllbGQuc3BsaXQoJy4nKVswXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaWVsZHMucHVzaChvcCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4geyBmaWVsZHMsIHRvcExldmVsRmllbGRzIH07XG59XG4iLCJpbXBvcnQgeyBFSlNPTiB9IGZyb20gJ21ldGVvci9lanNvbic7XG5pbXBvcnQgeyBET0NVTUVOVEFUSU9OX0ZFVENIIH0gZnJvbSAnLi9kb2NzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2V0dXBEYXRhRmV0Y2hpbmcoY29uZmlnLCBuYW1lLCB0eXBlLCBjb2xsZWN0aW9uKSB7XG4gIGxldCBRdWVyeSA9IHt9O1xuICBsZXQgUXVlcnlUeXBlID0gYGA7XG4gIGxldCBTdWJzY3JpcHRpb24gPSB7fTtcbiAgbGV0IFN1YnNjcmlwdGlvblR5cGUgPSBgYDtcblxuICBRdWVyeVR5cGUgKz0gYFxuICAgICR7RE9DVU1FTlRBVElPTl9GRVRDSH1cbiAgICAke25hbWV9KHBheWxvYWQ6IFN0cmluZyEpOiBbJHt0eXBlfV0hXG4gIGA7XG4gIFF1ZXJ5VHlwZSArPSBgXG4gICAgJHtET0NVTUVOVEFUSU9OX0ZFVENIfVxuICAgICR7bmFtZX1Db3VudChwYXlsb2FkOiBTdHJpbmchKTogSW50IVxuICBgO1xuICBRdWVyeVR5cGUgKz0gYFxuICAgICR7RE9DVU1FTlRBVElPTl9GRVRDSH1cbiAgICAke25hbWV9U2luZ2xlKHBheWxvYWQ6IFN0cmluZyEpOiAke3R5cGV9XG4gIGA7XG5cbiAgLy8gV2UgYXJlIGNyZWF0aW5nIHRoZSBmdW5jdGlvbiBoZXJlIGJlY2F1c2Ugd2UgYXJlIHJlLXVzaW5nIGl0IGZvciBTaW5nbGUgb25lc1xuXG4gIGNvbnN0IHJlc29sdmVTZWxlY3RvcnMgPSAoXywgeyBwYXJhbXMgfSwgY3R4LCBhc3QpID0+IHtcbiAgICBsZXQgYXN0VG9RdWVyeU9wdGlvbnM7XG5cbiAgICBpZiAodHlwZW9mIGNvbmZpZy5maW5kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBwYXJhbXMgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICB7XG4gICAgICAgICAgZmlsdGVyczoge30sXG4gICAgICAgICAgb3B0aW9uczoge30sXG4gICAgICAgIH0sXG4gICAgICAgIHBhcmFtc1xuICAgICAgKTtcblxuICAgICAgbGV0IGFzdFRvUXVlcnlPcHRpb25zID0gY29uZmlnLmZpbmQuY2FsbChudWxsLCBjdHgsIHBhcmFtcywgYXN0KTtcbiAgICAgIGlmIChhc3RUb1F1ZXJ5T3B0aW9ucyA9PT0gZmFsc2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmF1dGhvcml6ZWQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXN0VG9RdWVyeU9wdGlvbnMgPT09IHVuZGVmaW5lZCB8fCBhc3RUb1F1ZXJ5T3B0aW9ucyA9PT0gdHJ1ZSkge1xuICAgICAgYXN0VG9RdWVyeU9wdGlvbnMgPSB7XG4gICAgICAgICRmaWx0ZXJzOiBwYXJhbXMuZmlsdGVycyB8fCB7fSxcbiAgICAgICAgJG9wdGlvbnM6IHBhcmFtcy5vcHRpb25zIHx8IHt9LFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXN0VG9RdWVyeU9wdGlvbnM7XG4gIH07XG5cbiAgY29uc3QgZm4gPSAoXywgeyBwYXlsb2FkIH0sIGN0eCwgYXN0KSA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0gRUpTT04ucGFyc2UocGF5bG9hZCk7XG4gICAgY29uc3QgYXN0VG9RdWVyeU9wdGlvbnMgPSByZXNvbHZlU2VsZWN0b3JzKF8sIHsgcGFyYW1zIH0sIGN0eCwgYXN0KTtcblxuICAgIHJldHVybiBjb2xsZWN0aW9uKClcbiAgICAgIC5hc3RUb1F1ZXJ5KGFzdCwgYXN0VG9RdWVyeU9wdGlvbnMpXG4gICAgICAuZmV0Y2goKTtcbiAgfTtcblxuICBRdWVyeSA9IHtcbiAgICBbbmFtZV06IGZuLFxuICAgIFtuYW1lICsgJ0NvdW50J10oXywgeyBwYXlsb2FkIH0sIGN0eCwgYXN0KSB7XG4gICAgICBjb25zdCBwYXJhbXMgPSBFSlNPTi5wYXJzZShwYXlsb2FkKTtcbiAgICAgIGNvbnN0IGFzdFRvUXVlcnlPcHRpb25zID0gcmVzb2x2ZVNlbGVjdG9ycyhfLCB7IHBhcmFtcyB9LCBjdHgsIGFzdCk7XG5cbiAgICAgIHJldHVybiBjb2xsZWN0aW9uKClcbiAgICAgICAgLmZpbmQoYXN0VG9RdWVyeU9wdGlvbnMuJGZpbHRlcnMgfHwge30pXG4gICAgICAgIC5jb3VudCgpO1xuICAgIH0sXG4gICAgW25hbWUgKyAnU2luZ2xlJ10oXywgYXJncywgY3R4LCBhc3QpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZuLmNhbGwobnVsbCwgXywgYXJncywgY3R4LCBhc3QpO1xuICAgICAgcmV0dXJuIHJlc3VsdFswXSB8fCBudWxsO1xuICAgIH0sXG4gIH07XG5cbiAgLyoqXG4gICAqIFRoaXMgd2lsbCBub3QgYmUgaW4gdGhlIGN1cnJlbnQgcmVsZWFzZVxuICAgKiBcbiAgaWYgKGNvbmZpZy5zdWJzY3JpcHRpb24pIHtcbiAgICBTdWJzY3JpcHRpb25UeXBlID0gYCR7bmFtZX0ocGFyYW1zOiBKU09OISk6IFN1YnNjcmlwdGlvbkV2ZW50YDtcbiAgICBTdWJzY3JpcHRpb24gPSB7XG4gICAgICBbbmFtZV06IHtcbiAgICAgICAgcmVzb2x2ZTogcGF5bG9hZCA9PiB7XG4gICAgICAgICAgaWYgKGNvbmZpZy5zdWJzY3JpcHRpb25SZXNvbHZlcikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZy5zdWJzY3JpcHRpb25SZXNvbHZlci5jYWxsKG51bGwsIHBheWxvYWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgfSxcbiAgICAgICAgc3Vic2NyaWJlKF8sIHsgcGFyYW1zIH0sIGN0eCwgYXN0KSB7XG4gICAgICAgICAgY29uc3QgZmllbGRzID0gYXN0VG9GaWVsZHMoYXN0KVtkb2NdO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBjb25maWcuc3Vic2NyaXB0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25maWcuc3Vic2NyaXB0aW9uLmNhbGwobnVsbCwgY3R4LCBmaWVsZHMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IG9ic2VydmFibGUgPSBjb2xsZWN0aW9uKCkuZmluZCh7fSwgeyBmaWVsZHMgfSk7XG4gICAgICAgICAgcmV0dXJuIGFzeW5jSXRlcmF0b3Iob2JzZXJ2YWJsZSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbiAgKi9cblxuICByZXR1cm4geyBRdWVyeVR5cGUsIFN1YnNjcmlwdGlvblR5cGUsIFF1ZXJ5LCBTdWJzY3JpcHRpb24gfTtcbn1cbiIsImltcG9ydCBnZXRGaWVsZHMgZnJvbSAnLi9nZXRGaWVsZHMnO1xuaW1wb3J0IHsgRUpTT04gfSBmcm9tICdtZXRlb3IvZWpzb24nO1xuaW1wb3J0IHsgY2hlY2sgfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuaW1wb3J0IHsgRE9DVU1FTlRBVElPTl9JTlNFUlQsIERPQ1VNRU5UQVRJT05fUkVNT1ZFLCBET0NVTUVOVEFUSU9OX1VQREFURSB9IGZyb20gJy4vZG9jcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNldHVwTXV0YXRpb25zKGNvbmZpZywgbmFtZSwgdHlwZSwgY29sbGVjdGlvbikge1xuICBsZXQgTXV0YXRpb24gPSB7fTtcbiAgbGV0IE11dGF0aW9uVHlwZSA9IGBgO1xuXG4gIGlmIChjb25maWcuaW5zZXJ0KSB7XG4gICAgTXV0YXRpb25UeXBlICs9IGBcbiAgICAgICR7RE9DVU1FTlRBVElPTl9JTlNFUlR9XG4gICAgICAke25hbWV9SW5zZXJ0KHBheWxvYWQ6IFN0cmluZyEpOiAke3R5cGV9XFxuXG4gICAgYDtcblxuICAgIE11dGF0aW9uW2Ake25hbWV9SW5zZXJ0YF0gPSAoXywgeyBwYXlsb2FkIH0sIGN0eCkgPT4ge1xuICAgICAgY29uc3QgeyBkb2N1bWVudCB9ID0gRUpTT04ucGFyc2UocGF5bG9hZCk7XG4gICAgICBjaGVjayhkb2N1bWVudCwgT2JqZWN0KTtcblxuICAgICAgaWYgKHR5cGVvZiBjb25maWcuaW5zZXJ0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbmZpZy5pbnNlcnQuY2FsbChudWxsLCBjdHgsIHsgZG9jdW1lbnQgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRvY0lkID0gY29sbGVjdGlvbigpLmluc2VydChkb2N1bWVudCk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogZG9jSWQsXG4gICAgICB9O1xuICAgIH07XG4gIH1cblxuICBpZiAoY29uZmlnLnVwZGF0ZSkge1xuICAgIE11dGF0aW9uVHlwZSArPSBgXG4gICAgICAke0RPQ1VNRU5UQVRJT05fVVBEQVRFfVxuICAgICAgJHtuYW1lfVVwZGF0ZShwYXlsb2FkOiBTdHJpbmchKTogU3RyaW5nXFxuXG4gICAgYDtcblxuICAgIE11dGF0aW9uW2Ake25hbWV9VXBkYXRlYF0gPSAoXywgeyBwYXlsb2FkIH0sIGN0eCkgPT4ge1xuICAgICAgY29uc3QgeyBzZWxlY3RvciwgbW9kaWZpZXIgfSA9IEVKU09OLnBhcnNlKHBheWxvYWQpO1xuICAgICAgY2hlY2soc2VsZWN0b3IsIE9iamVjdCk7XG4gICAgICBjaGVjayhtb2RpZmllciwgT2JqZWN0KTtcblxuICAgICAgaWYgKHR5cGVvZiBjb25maWcudXBkYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnN0IHsgdG9wTGV2ZWxGaWVsZHMsIGZpZWxkcyB9ID0gZ2V0RmllbGRzKG1vZGlmaWVyKTtcbiAgICAgICAgY29uZmlnLnVwZGF0ZS5jYWxsKG51bGwsIGN0eCwge1xuICAgICAgICAgIHNlbGVjdG9yLFxuICAgICAgICAgIG1vZGlmaWVyLFxuICAgICAgICAgIG1vZGlmaWVkRmllbGRzOiBmaWVsZHMsXG4gICAgICAgICAgbW9kaWZpZWRUb3BMZXZlbEZpZWxkczogdG9wTGV2ZWxGaWVsZHMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBkb2NJZCA9IGNvbGxlY3Rpb24oKS51cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKTtcblxuICAgICAgcmV0dXJuICdvayc7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChjb25maWcucmVtb3ZlKSB7XG4gICAgTXV0YXRpb25UeXBlICs9IGBcbiAgICAgICR7RE9DVU1FTlRBVElPTl9SRU1PVkV9XG4gICAgICAke25hbWV9UmVtb3ZlKHBheWxvYWQ6IFN0cmluZyEpOiBTdHJpbmdcXG5cbiAgICBgO1xuXG4gICAgTXV0YXRpb25bYCR7bmFtZX1SZW1vdmVgXSA9IChfLCB7IHBheWxvYWQgfSwgY3R4KSA9PiB7XG4gICAgICBjb25zdCB7IHNlbGVjdG9yIH0gPSBFSlNPTi5wYXJzZShwYXlsb2FkKTtcbiAgICAgIGNoZWNrKHNlbGVjdG9yLCBPYmplY3QpO1xuXG4gICAgICBpZiAodHlwZW9mIGNvbmZpZy5pbnNlcnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29uZmlnLnJlbW92ZS5jYWxsKG51bGwsIGN0eCwgeyBzZWxlY3RvciB9KTtcbiAgICAgIH1cblxuICAgICAgY29sbGVjdGlvbigpLnJlbW92ZShzZWxlY3Rvcik7XG5cbiAgICAgIHJldHVybiAnb2snO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4geyBNdXRhdGlvblR5cGUsIE11dGF0aW9uIH07XG59XG4iLCJpbXBvcnQgeyBHcmFwaFFMU2NhbGFyVHlwZSB9IGZyb20gJ2dyYXBocWwnO1xuaW1wb3J0IHsgS2luZCB9IGZyb20gJ2dyYXBocWwvbGFuZ3VhZ2UnO1xuXG5leHBvcnQgZGVmYXVsdCBuZXcgR3JhcGhRTFNjYWxhclR5cGUoe1xuICBuYW1lOiAnRGF0ZScsXG4gIGRlc2NyaXB0aW9uOiAnRGF0ZSBjdXN0b20gc2NhbGFyIHR5cGUnLFxuICBwYXJzZVZhbHVlKHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKERhdGUucGFyc2UodmFsdWUpKTtcbiAgfSxcbiAgc2VyaWFsaXplKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLnRvSVNPU3RyaW5nKCk7XG4gIH0sXG4gIHBhcnNlTGl0ZXJhbChhc3QpIHtcbiAgICBpZiAoYXN0LmtpbmQgPT0gS2luZC5TVFJJTkcpIHtcbiAgICAgIGNvbnN0IHRpbWUgPSBEYXRlLnBhcnNlKGFzdC52YWx1ZSk7XG4gICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodGltZSk7XG5cbiAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbn0pO1xuIiwiaW1wb3J0IHsgR3JhcGhRTFNjYWxhclR5cGUgfSBmcm9tICdncmFwaHFsJztcbmltcG9ydCB7IEtpbmQgfSBmcm9tICdncmFwaHFsL2xhbmd1YWdlJztcbmltcG9ydCB7IEVKU09OIH0gZnJvbSAnbWV0ZW9yL2Vqc29uJztcblxuZXhwb3J0IGRlZmF1bHQgbmV3IEdyYXBoUUxTY2FsYXJUeXBlKHtcbiAgbmFtZTogJ0VKU09OJyxcbiAgZGVzY3JpcHRpb246ICdFSlNPTiBjdXN0b20gc2NhbGFyIHR5cGUnLFxuICBwYXJzZVZhbHVlKHZhbHVlKSB7XG4gICAgcmV0dXJuIEVKU09OLnBhcnNlKHZhbHVlKTtcbiAgfSxcbiAgc2VyaWFsaXplKHZhbHVlKSB7XG4gICAgcmV0dXJuIEVKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gIH0sXG4gIHBhcnNlTGl0ZXJhbChhc3QpIHtcbiAgICBpZiAoYXN0LmtpbmQgPT0gS2luZC5TVFJJTkcpIHtcbiAgICAgIHJldHVybiBFSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9LFxufSk7XG4iLCJpbXBvcnQgU2NhbGFycyBmcm9tICcuL3NjYWxhcnMnO1xuaW1wb3J0IERhdGVSZXNvbHZlciBmcm9tICcuL0RhdGUnO1xuaW1wb3J0IEdyYXBoUUxKU09OIGZyb20gJ2dyYXBocWwtdHlwZS1qc29uJztcbmltcG9ydCBFSlNPTiBmcm9tICcuL0VKU09OJztcbmltcG9ydCB7IGxvYWQgfSBmcm9tICdncmFwaHFsLWxvYWQnO1xuXG5jb25zdCB0eXBlRGVmcyA9IFtTY2FsYXJzXTtcbmNvbnN0IHJlc29sdmVycyA9IFtcbiAge1xuICAgIERhdGU6IERhdGVSZXNvbHZlcixcbiAgICBKU09OOiBHcmFwaFFMSlNPTixcbiAgICBFSlNPTixcbiAgfSxcbl07XG5cbmxvYWQoe1xuICB0eXBlRGVmcyxcbiAgcmVzb2x2ZXJzLFxufSk7XG4iLCJleHBvcnQgZGVmYXVsdCBgXG4gIHNjYWxhciBEYXRlXG4gIHNjYWxhciBKU09OXG4gIHNjYWxhciBFSlNPTlxuYDtcbiIsImV4cG9ydCBkZWZhdWx0IGBcbiAgdHlwZSBTdWJzY3JpcHRpb25FdmVudCB7XG4gICAgZXZlbnQ6IFN0cmluZ1xuICAgIGRvYzogSlNPTlxuICB9XG5gO1xuIiwiaW1wb3J0IHsgbG9hZCB9IGZyb20gJ2dyYXBocWwtbG9hZCc7XG5pbXBvcnQgeyB0eXBlRGVmcyBhcyBkaXJlY3RpdmVUeXBlRGVmcyB9IGZyb20gJy4uL2RpcmVjdGl2ZXMnO1xuaW1wb3J0IFN1YnNjcmlwdGlvbkV2ZW50VHlwZSBmcm9tICcuL1N1YnNjcmlwdGlvbkV2ZW50VHlwZSc7XG5cbmxvYWQoe1xuICB0eXBlRGVmczogWy4uLmRpcmVjdGl2ZVR5cGVEZWZzLCBTdWJzY3JpcHRpb25FdmVudFR5cGVdLFxufSk7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcblxuZXhwb3J0IGNvbnN0IEFVVEhfVE9LRU5fS0VZID0gJ21ldGVvci1sb2dpbi10b2tlbic7XG5leHBvcnQgY29uc3QgQVVUSF9UT0tFTl9MT0NBTFNUT1JBR0UgPSAnTWV0ZW9yLmxvZ2luVG9rZW4nO1xuXG5leHBvcnQgY29uc3QgR1JBUEhRTF9TVUJTQ1JJUFRJT05fUEFUSCA9ICdncmFwaHFsJztcbmV4cG9ydCBjb25zdCBHUkFQSFFMX1NVQlNDUklQVElPTl9FTkRQT0lOVCA9IE1ldGVvci5hYnNvbHV0ZVVybChcbiAgR1JBUEhRTF9TVUJTQ1JJUFRJT05fUEFUSFxuKS5yZXBsYWNlKC9odHRwLywgJ3dzJyk7XG5cbmV4cG9ydCBjb25zdCBHUkFQSFFMX0VORFBPSU5UID0gTWV0ZW9yLmFic29sdXRlVXJsKCdncmFwaHFsJyk7XG4iXX0=
