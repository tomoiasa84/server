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

/* Package-scope variables */
var wsLink;

var require = meteorInstall({"node_modules":{"meteor":{"cultofcoders:apollo":{"client":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/cultofcoders_apollo/client/index.js                                                            //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

module.export({
  initialize: () => initialize,
  Config: () => Config,
  meteorAccountsLink: () => meteorAccountsLink
});
let ApolloClient;
module.link("apollo-client", {
  default(v) {
    ApolloClient = v;
  }

}, 0);
let WebSocketLink;
module.link("apollo-link-ws", {
  WebSocketLink(v) {
    WebSocketLink = v;
  }

}, 1);
let HttpLink;
module.link("apollo-link-http", {
  HttpLink(v) {
    HttpLink = v;
  }

}, 2);
let ApolloLink;
module.link("apollo-link", {
  default(v) {
    ApolloLink = v;
  }

}, 3);
let InMemoryCache;
module.link("apollo-cache-inmemory", {
  InMemoryCache(v) {
    InMemoryCache = v;
  }

}, 4);
let getMainDefinition;
module.link("apollo-utilities", {
  getMainDefinition(v) {
    getMainDefinition = v;
  }

}, 5);
let meteorAccountsLink;
module.link("./meteorAccountsLink", {
  meteorAccountsLink(v) {
    meteorAccountsLink = v;
  }

}, 6);
let createUploadLink;
module.link("apollo-upload-client", {
  createUploadLink(v) {
    createUploadLink = v;
  }

}, 7);
let Config;
module.link("./config", {
  default(v) {
    Config = v;
  }

}, 8);
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 9);
let GRAPHQL_SUBSCRIPTION_ENDPOINT, GRAPHQL_ENDPOINT, AUTH_TOKEN_KEY;
module.link("../constants", {
  GRAPHQL_SUBSCRIPTION_ENDPOINT(v) {
    GRAPHQL_SUBSCRIPTION_ENDPOINT = v;
  },

  GRAPHQL_ENDPOINT(v) {
    GRAPHQL_ENDPOINT = v;
  },

  AUTH_TOKEN_KEY(v) {
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
  let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  Object.assign(Config, config);
  Object.freeze(Config);
  const uploadLink = createUploadLink();
  let terminatingLink; // We define the HTTP Link

  const httpLink = new HttpLink((0, _objectSpread2.default)({
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
        connectionParams: () => ({
          [AUTH_TOKEN_KEY]: localStorage.getItem('Meteor.loginToken')
        })
      }
    }); // If it's subscription it goes through wsLink otherwise through terminatingLink

    terminatingLink = ApolloLink.split((_ref) => {
      let {
        query
      } = _ref;
      const {
        kind,
        operation
      } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    }, wsLink, terminatingLink);
  }

  const client = new ApolloClient({
    link: terminatingLink,
    cache: new InMemoryCache({
      dataIdFromObject: object => object._id || null
    }).restore(window.__APOLLO_STATE__ || {})
  });
  return {
    client
  };
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"config.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/cultofcoders_apollo/client/config.js                                                           //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
module.exportDefault({
  disableWebsockets: false,
  getLink: link => link,
  httpLinkOptions: {}
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"meteorAccountsLink.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/cultofcoders_apollo/client/meteorAccountsLink.js                                               //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
module.export({
  meteorAccountsLink: () => meteorAccountsLink
});
let ApolloClient;
module.link("apollo-client", {
  ApolloClient(v) {
    ApolloClient = v;
  }

}, 0);
let ApolloLink;
module.link("apollo-link", {
  ApolloLink(v) {
    ApolloLink = v;
  }

}, 1);
let meteorAccountsLink; // We have a weak dependency on this package, and if we import it without it being added, it will crash

if (Package['accounts-base']) {
  let Accounts;
  module.link("meteor/accounts-base", {
    Accounts(v) {
      Accounts = v;
    }

  }, 2);
  module.runSetters(meteorAccountsLink = new ApolloLink((operation, forward) => {
    const token = Accounts._storedLoginToken();

    operation.setContext(() => ({
      headers: {
        'meteor-login-token': token
      }
    }));
    return forward(operation);
  }));
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"constants.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/cultofcoders_apollo/constants.js                                                               //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
