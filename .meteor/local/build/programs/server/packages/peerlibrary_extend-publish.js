(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var _ = Package.underscore._;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;

/* Package-scope variables */
var __coffeescriptShare, extendPublish;

var require = meteorInstall({"node_modules":{"meteor":{"peerlibrary:extend-publish":{"server.coffee":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/peerlibrary_extend-publish/server.coffee                                                         //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
module.export({
  extendPublish: () => extendPublish
});

var extendPublish = function (newPublishArguments) {
  var Server, originalMeteorPublish, originalPublish; // DDP Server constructor.

  Server = Object.getPrototypeOf(Meteor.server).constructor;
  originalPublish = Server.prototype.publish;

  Server.prototype.publish = function (...args) {
    var newArgs; // If the first argument is an object, we let the original publish function to traverse it.

    if (_.isObject(args[0])) {
      originalPublish.apply(this, args);
      return;
    }

    newArgs = newPublishArguments.apply(this, args);
    return originalPublish.apply(this, newArgs);
  }; // Because Meteor.publish is a bound function it remembers old
  // prototype method so we have wrap it to directly as well.


  originalMeteorPublish = Meteor.publish;
  return Meteor.publish = function (...args) {
    var newArgs; // If the first argument is an object, we let the original publish function to traverse it.

    if (_.isObject(args[0])) {
      originalMeteorPublish.apply(this, args);
      return;
    }

    newArgs = newPublishArguments.apply(this, args);
    return originalMeteorPublish.apply(this, newArgs);
  };
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

var exports = require("/node_modules/meteor/peerlibrary:extend-publish/server.coffee");

/* Exports */
Package._define("peerlibrary:extend-publish", exports, {
  extendPublish: extendPublish
});

})();

//# sourceURL=meteor://💻app/packages/peerlibrary_extend-publish.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcGVlcmxpYnJhcnlfZXh0ZW5kLXB1Ymxpc2gvc2VydmVyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyLmNvZmZlZSJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJleHRlbmRQdWJsaXNoIiwibmV3UHVibGlzaEFyZ3VtZW50cyIsIlNlcnZlciIsIm9yaWdpbmFsTWV0ZW9yUHVibGlzaCIsIm9yaWdpbmFsUHVibGlzaCIsIk9iamVjdCIsImdldFByb3RvdHlwZU9mIiwiTWV0ZW9yIiwic2VydmVyIiwiY29uc3RydWN0b3IiLCJwcm90b3R5cGUiLCJwdWJsaXNoIiwiYXJncyIsIm5ld0FyZ3MiLCJfIiwiaXNPYmplY3QiLCJhcHBseSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsT0FBQUMsTUFBQSxDQUFPO0FBQUFDLGlCQUFnQixNQUFBQTtBQUFoQixDQUFQOztBQUFBLElBQU9BLGdCQUFnQixVQUFDQyxtQkFBRDtBQUVyQixNQUFBQyxNQUFBLEVBQUFDLHFCQUFBLEVBQUFDLGVBQUEsQ0FGcUIsQ0NFckI7O0FEQUFGLFdBQVNHLE9BQU9DLGNBQVAsQ0FBc0JDLE9BQU9DLE1BQTdCLEVBQXFDQyxXQUE5QztBQUVBTCxvQkFBa0JGLE9BQU1RLFNBQU4sQ0FBUUMsT0FBMUI7O0FBQ0FULFNBQU1RLFNBQU4sQ0FBUUMsT0FBUixHQUFrQixhQUFDQyxJQUFEO0FBRWhCLFFBQUFDLE9BQUEsQ0FGZ0IsQ0NFaEI7O0FEQUEsUUFBR0MsRUFBRUMsUUFBRixDQUFXSCxLQUFLLENBQUwsQ0FBWCxDQUFIO0FBQ0VSLHNCQUFnQlksS0FBaEIsQ0FBc0IsSUFBdEIsRUFBNEJKLElBQTVCO0FBQ0E7QUNFRDs7QURBREMsY0FBVVosb0JBQW9CZSxLQUFwQixDQUEwQixJQUExQixFQUFnQ0osSUFBaEMsQ0FBVjtBQ0VBLFdEQUFSLGdCQUFnQlksS0FBaEIsQ0FBc0IsSUFBdEIsRUFBNEJILE9BQTVCLENDQUE7QURSZ0IsR0FBbEIsQ0FMcUIsQ0NlckI7QUFDQTs7O0FEQ0FWLDBCQUF3QkksT0FBT0ksT0FBL0I7QUNDQSxTREFBSixPQUFPSSxPQUFQLEdBQWlCLGFBQUNDLElBQUQ7QUFFZixRQUFBQyxPQUFBLENBRmUsQ0NFZjs7QURBQSxRQUFHQyxFQUFFQyxRQUFGLENBQVdILEtBQUssQ0FBTCxDQUFYLENBQUg7QUFDRVQsNEJBQXNCYSxLQUF0QixDQUE0QixJQUE1QixFQUFrQ0osSUFBbEM7QUFDQTtBQ0VEOztBREFEQyxjQUFVWixvQkFBb0JlLEtBQXBCLENBQTBCLElBQTFCLEVBQWdDSixJQUFoQyxDQUFWO0FDRUEsV0RBQVQsc0JBQXNCYSxLQUF0QixDQUE0QixJQUE1QixFQUFrQ0gsT0FBbEMsQ0NBQTtBRFJlLEdDQWpCO0FEbEJxQixDQUF2QixDIiwiZmlsZSI6Ii9wYWNrYWdlcy9wZWVybGlicmFyeV9leHRlbmQtcHVibGlzaC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBleHRlbmRQdWJsaXNoID0gKG5ld1B1Ymxpc2hBcmd1bWVudHMpIC0+XG4gICMgRERQIFNlcnZlciBjb25zdHJ1Y3Rvci5cbiAgU2VydmVyID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKE1ldGVvci5zZXJ2ZXIpLmNvbnN0cnVjdG9yXG5cbiAgb3JpZ2luYWxQdWJsaXNoID0gU2VydmVyOjpwdWJsaXNoXG4gIFNlcnZlcjo6cHVibGlzaCA9IChhcmdzLi4uKSAtPlxuICAgICMgSWYgdGhlIGZpcnN0IGFyZ3VtZW50IGlzIGFuIG9iamVjdCwgd2UgbGV0IHRoZSBvcmlnaW5hbCBwdWJsaXNoIGZ1bmN0aW9uIHRvIHRyYXZlcnNlIGl0LlxuICAgIGlmIF8uaXNPYmplY3QgYXJnc1swXVxuICAgICAgb3JpZ2luYWxQdWJsaXNoLmFwcGx5IHRoaXMsIGFyZ3NcbiAgICAgIHJldHVyblxuXG4gICAgbmV3QXJncyA9IG5ld1B1Ymxpc2hBcmd1bWVudHMuYXBwbHkgdGhpcywgYXJnc1xuXG4gICAgb3JpZ2luYWxQdWJsaXNoLmFwcGx5IHRoaXMsIG5ld0FyZ3NcblxuICAjIEJlY2F1c2UgTWV0ZW9yLnB1Ymxpc2ggaXMgYSBib3VuZCBmdW5jdGlvbiBpdCByZW1lbWJlcnMgb2xkXG4gICMgcHJvdG90eXBlIG1ldGhvZCBzbyB3ZSBoYXZlIHdyYXAgaXQgdG8gZGlyZWN0bHkgYXMgd2VsbC5cbiAgb3JpZ2luYWxNZXRlb3JQdWJsaXNoID0gTWV0ZW9yLnB1Ymxpc2hcbiAgTWV0ZW9yLnB1Ymxpc2ggPSAoYXJncy4uLikgLT5cbiAgICAjIElmIHRoZSBmaXJzdCBhcmd1bWVudCBpcyBhbiBvYmplY3QsIHdlIGxldCB0aGUgb3JpZ2luYWwgcHVibGlzaCBmdW5jdGlvbiB0byB0cmF2ZXJzZSBpdC5cbiAgICBpZiBfLmlzT2JqZWN0IGFyZ3NbMF1cbiAgICAgIG9yaWdpbmFsTWV0ZW9yUHVibGlzaC5hcHBseSB0aGlzLCBhcmdzXG4gICAgICByZXR1cm5cblxuICAgIG5ld0FyZ3MgPSBuZXdQdWJsaXNoQXJndW1lbnRzLmFwcGx5IHRoaXMsIGFyZ3NcblxuICAgIG9yaWdpbmFsTWV0ZW9yUHVibGlzaC5hcHBseSB0aGlzLCBuZXdBcmdzXG4iLCJleHBvcnQgdmFyIGV4dGVuZFB1Ymxpc2ggPSBmdW5jdGlvbihuZXdQdWJsaXNoQXJndW1lbnRzKSB7XG4gIHZhciBTZXJ2ZXIsIG9yaWdpbmFsTWV0ZW9yUHVibGlzaCwgb3JpZ2luYWxQdWJsaXNoO1xuICAvLyBERFAgU2VydmVyIGNvbnN0cnVjdG9yLlxuICBTZXJ2ZXIgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTWV0ZW9yLnNlcnZlcikuY29uc3RydWN0b3I7XG4gIG9yaWdpbmFsUHVibGlzaCA9IFNlcnZlci5wcm90b3R5cGUucHVibGlzaDtcbiAgU2VydmVyLnByb3RvdHlwZS5wdWJsaXNoID0gZnVuY3Rpb24oLi4uYXJncykge1xuICAgIHZhciBuZXdBcmdzO1xuICAgIC8vIElmIHRoZSBmaXJzdCBhcmd1bWVudCBpcyBhbiBvYmplY3QsIHdlIGxldCB0aGUgb3JpZ2luYWwgcHVibGlzaCBmdW5jdGlvbiB0byB0cmF2ZXJzZSBpdC5cbiAgICBpZiAoXy5pc09iamVjdChhcmdzWzBdKSkge1xuICAgICAgb3JpZ2luYWxQdWJsaXNoLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBuZXdBcmdzID0gbmV3UHVibGlzaEFyZ3VtZW50cy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICByZXR1cm4gb3JpZ2luYWxQdWJsaXNoLmFwcGx5KHRoaXMsIG5ld0FyZ3MpO1xuICB9O1xuICAvLyBCZWNhdXNlIE1ldGVvci5wdWJsaXNoIGlzIGEgYm91bmQgZnVuY3Rpb24gaXQgcmVtZW1iZXJzIG9sZFxuICAvLyBwcm90b3R5cGUgbWV0aG9kIHNvIHdlIGhhdmUgd3JhcCBpdCB0byBkaXJlY3RseSBhcyB3ZWxsLlxuICBvcmlnaW5hbE1ldGVvclB1Ymxpc2ggPSBNZXRlb3IucHVibGlzaDtcbiAgcmV0dXJuIE1ldGVvci5wdWJsaXNoID0gZnVuY3Rpb24oLi4uYXJncykge1xuICAgIHZhciBuZXdBcmdzO1xuICAgIC8vIElmIHRoZSBmaXJzdCBhcmd1bWVudCBpcyBhbiBvYmplY3QsIHdlIGxldCB0aGUgb3JpZ2luYWwgcHVibGlzaCBmdW5jdGlvbiB0byB0cmF2ZXJzZSBpdC5cbiAgICBpZiAoXy5pc09iamVjdChhcmdzWzBdKSkge1xuICAgICAgb3JpZ2luYWxNZXRlb3JQdWJsaXNoLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBuZXdBcmdzID0gbmV3UHVibGlzaEFyZ3VtZW50cy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICByZXR1cm4gb3JpZ2luYWxNZXRlb3JQdWJsaXNoLmFwcGx5KHRoaXMsIG5ld0FyZ3MpO1xuICB9O1xufTtcbiJdfQ==
