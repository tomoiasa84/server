//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var EJSON = Package.ejson.EJSON;
var Mongo = Package.mongo.Mongo;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-client'].Symbol;
var Map = Package['ecmascript-runtime-client'].Map;
var Set = Package['ecmascript-runtime-client'].Set;

/* Package-scope variables */
var wsLink;

var require = meteorInstall({"node_modules":{"meteor":{"cultofcoders:apollo":{"client":{"index.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/cultofcoders_apollo/client/index.js                                                          //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

module.export({
  initialize: function () {
    return initialize;
  },
  Config: function () {
    return Config;
  },
  meteorAccountsLink: function () {
    return meteorAccountsLink;
  }
});
var ApolloClient;
module.link("apollo-client", {
  "default": function (v) {
    ApolloClient = v;
  }
}, 0);
var WebSocketLink;
module.link("apollo-link-ws", {
  WebSocketLink: function (v) {
    WebSocketLink = v;
  }
}, 1);
var HttpLink;
module.link("apollo-link-http", {
  HttpLink: function (v) {
    HttpLink = v;
  }
}, 2);
var ApolloLink;
module.link("apollo-link", {
  "default": function (v) {
    ApolloLink = v;
  }
}, 3);
var InMemoryCache;
module.link("apollo-cache-inmemory", {
  InMemoryCache: function (v) {
    InMemoryCache = v;
  }
}, 4);
var getMainDefinition;
module.link("apollo-utilities", {
  getMainDefinition: function (v) {
    getMainDefinition = v;
  }
}, 5);
var meteorAccountsLink;
module.link("./meteorAccountsLink", {
  meteorAccountsLink: function (v) {
    meteorAccountsLink = v;
  }
}, 6);
var createUploadLink;
module.link("apollo-upload-client", {
  createUploadLink: function (v) {
    createUploadLink = v;
  }
}, 7);
var Config;
module.link("./config", {
  "default": function (v) {
    Config = v;
  }
}, 8);
var checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions: function (v) {
    checkNpmVersions = v;
  }
}, 9);
var GRAPHQL_SUBSCRIPTION_ENDPOINT, GRAPHQL_ENDPOINT, AUTH_TOKEN_KEY;
module.link("../constants", {
  GRAPHQL_SUBSCRIPTION_ENDPOINT: function (v) {
    GRAPHQL_SUBSCRIPTION_ENDPOINT = v;
  },
  GRAPHQL_ENDPOINT: function (v) {
    GRAPHQL_ENDPOINT = v;
  },
  AUTH_TOKEN_KEY: function (v) {
    AUTH_TOKEN_KEY = v;
  }
}, 10);
checkNpmVersions({
  'subscriptions-transport-ws': '0.9.x',
  'apollo-upload-client': 'x.x.x',
  'apollo-client': '2.x.x',
  'apollo-cache-inmemory': '1.x.x',
  'apollo-link': '1.x.x',
  'apollo-link-http': '1.x.x',
  'apollo-link-ws': '1.x.x' // 'apollo-live-client': '0.2.x',
  // 'apollo-morpher': '0.2.x',

});

function initialize() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  Object.assign(Config, config);
  Object.freeze(Config);
  var uploadLink = createUploadLink();
  var terminatingLink; // We define the HTTP Link

  var httpLink = new HttpLink((0, _objectSpread2.default)({
    uri: GRAPHQL_ENDPOINT
  }, config.httpLinkOptions || {}));

  if (meteorAccountsLink) {
    terminatingLink = ApolloLink.concat(meteorAccountsLink, uploadLink, httpLink);
  } else {
    terminatingLink = ApolloLink.concat(uploadLink, httpLink);
  } // A chance to add change the links


  terminatingLink = Config.getLink(terminatingLink);

  if (!config.disableWebsockets) {
    wsLink = new WebSocketLink({
      uri: GRAPHQL_SUBSCRIPTION_ENDPOINT,
      options: {
        reconnect: true,
        connectionParams: function () {
          var _ref;

          return _ref = {}, _ref[AUTH_TOKEN_KEY] = localStorage.getItem('Meteor.loginToken'), _ref;
        }
      }
    }); // If it's subscription it goes through wsLink otherwise through terminatingLink

    terminatingLink = ApolloLink.split(function (_ref2) {
      var query = _ref2.query;

      var _getMainDefinition = getMainDefinition(query),
          kind = _getMainDefinition.kind,
          operation = _getMainDefinition.operation;

      return kind === 'OperationDefinition' && operation === 'subscription';
    }, wsLink, terminatingLink);
  }

  var client = new ApolloClient({
    link: terminatingLink,
    cache: new InMemoryCache({
      dataIdFromObject: function (object) {
        return object._id || null;
      }
    }).restore(window.__APOLLO_STATE__ || {})
  });
  return {
    client: client
  };
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////

},"config.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/cultofcoders_apollo/client/config.js                                                         //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
module.exportDefault({
  disableWebsockets: false,
  getLink: function (link) {
    return link;
  },
  httpLinkOptions: {}
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

},"meteorAccountsLink.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/cultofcoders_apollo/client/meteorAccountsLink.js                                             //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
module.export({
  meteorAccountsLink: function () {
    return meteorAccountsLink;
  }
});
var ApolloClient;
module.link("apollo-client", {
  ApolloClient: function (v) {
    ApolloClient = v;
  }
}, 0);
var ApolloLink;
module.link("apollo-link", {
  ApolloLink: function (v) {
    ApolloLink = v;
  }
}, 1);
var meteorAccountsLink; // We have a weak dependency on this package, and if we import it without it being added, it will crash

if (Package['accounts-base']) {
  var Accounts;
  module.link("meteor/accounts-base", {
    Accounts: function (v) {
      Accounts = v;
    }
  }, 2);
  module.runSetters(meteorAccountsLink = new ApolloLink(function (operation, forward) {
    var token = Accounts._storedLoginToken();

    operation.setContext(function () {
      return {
        headers: {
          'meteor-login-token': token
        }
      };
    });
    return forward(operation);
  }));
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"constants.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/cultofcoders_apollo/constants.js                                                             //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
module.export({
  AUTH_TOKEN_KEY: function () {
    return AUTH_TOKEN_KEY;
  },
  AUTH_TOKEN_LOCALSTORAGE: function () {
    return AUTH_TOKEN_LOCALSTORAGE;
  },
  GRAPHQL_SUBSCRIPTION_PATH: function () {
    return GRAPHQL_SUBSCRIPTION_PATH;
  },
  GRAPHQL_SUBSCRIPTION_ENDPOINT: function () {
    return GRAPHQL_SUBSCRIPTION_ENDPOINT;
  },
  GRAPHQL_ENDPOINT: function () {
    return GRAPHQL_ENDPOINT;
  }
});
var Meteor;
module.link("meteor/meteor", {
  Meteor: function (v) {
    Meteor = v;
  }
}, 0);
var AUTH_TOKEN_KEY = 'meteor-login-token';
var AUTH_TOKEN_LOCALSTORAGE = 'Meteor.loginToken';
var GRAPHQL_SUBSCRIPTION_PATH = 'graphql';
var GRAPHQL_SUBSCRIPTION_ENDPOINT = Meteor.absoluteUrl(GRAPHQL_SUBSCRIPTION_PATH).replace(/http/, 'ws');
var GRAPHQL_ENDPOINT = Meteor.absoluteUrl('graphql');
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/cultofcoders:apollo/client/index.js");

/* Exports */
Package._define("cultofcoders:apollo", exports);

})();
