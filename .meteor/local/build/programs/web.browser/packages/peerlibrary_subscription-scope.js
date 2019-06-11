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
var _ = Package.underscore._;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"peerlibrary:subscription-scope":{"client.coffee":function(){

///////////////////////////////////////////////////////////////////////////////////////////
//                                                                                       //
// packages/peerlibrary_subscription-scope/client.coffee                                 //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////
                                                                                         //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Connection, originalCompileProjection, originalSubscribe;
Connection = Meteor.connection.constructor;
originalSubscribe = Connection.prototype.subscribe;

Connection.prototype.subscribe = function () {
  var handle;

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  handle = originalSubscribe.apply(this, args);

  handle.scopeQuery = function () {
    var query;
    query = {};
    query["_sub_" + handle.subscriptionId] = {
      $exists: true
    };
    return query;
  };

  return handle;
}; // Recreate the convenience method.


Meteor.subscribe = _.bind(Meteor.connection.subscribe, Meteor.connection);
originalCompileProjection = LocalCollection._compileProjection;

LocalCollection._compileProjection = function (fields) {
  var fun;
  fun = originalCompileProjection(fields);
  return function (obj) {
    var field, res;
    res = fun(obj);

    for (field in meteorBabelHelpers.sanitizeForInObject(res)) {
      if (field.lastIndexOf('_sub_', 0) === 0) {
        delete res[field];
      }
    }

    return res;
  };
};
///////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/peerlibrary:subscription-scope/client.coffee");

/* Exports */
Package._define("peerlibrary:subscription-scope");

})();
