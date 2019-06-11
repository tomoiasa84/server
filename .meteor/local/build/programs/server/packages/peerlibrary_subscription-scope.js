(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var extendPublish = Package['peerlibrary:extend-publish'].extendPublish;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"peerlibrary:subscription-scope":{"server.coffee":function(){

////////////////////////////////////////////////////////////////////////////
//                                                                        //
// packages/peerlibrary_subscription-scope/server.coffee                  //
//                                                                        //
////////////////////////////////////////////////////////////////////////////
                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
extendPublish(function (name, func, options) {
  var newFunc;

  newFunc = function (...args) {
    var enabled, originalAdded, originalChanged, publish, scopeFieldName;
    publish = this;
    scopeFieldName = `_sub_${publish._subscriptionId}`;
    enabled = false;

    publish.enableScope = function () {
      return enabled = true;
    };

    originalAdded = publish.added;

    publish.added = function (collectionName, id, fields) {
      // Add our scoping field.
      if (enabled) {
        fields = _.clone(fields);
        fields[scopeFieldName] = 1;
      }

      return originalAdded.call(this, collectionName, id, fields);
    };

    originalChanged = publish.changed;

    publish.changed = function (collectionName, id, fields) {
      // We do not allow changes to our scoping field.
      if (enabled && scopeFieldName in fields) {
        fields = _.clone(fields);
        delete fields[scopeFieldName];
      }

      return originalChanged.call(this, collectionName, id, fields);
    };

    return func.apply(publish, args);
  };

  return [name, newFunc, options];
});
////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/peerlibrary:subscription-scope/server.coffee");

/* Exports */
Package._define("peerlibrary:subscription-scope");

})();

//# sourceURL=meteor://💻app/packages/peerlibrary_subscription-scope.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcGVlcmxpYnJhcnlfc3Vic2NyaXB0aW9uLXNjb3BlL3NlcnZlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci5jb2ZmZWUiXSwibmFtZXMiOlsiZXh0ZW5kUHVibGlzaCIsIm5hbWUiLCJmdW5jIiwib3B0aW9ucyIsIm5ld0Z1bmMiLCJhcmdzIiwiZW5hYmxlZCIsIm9yaWdpbmFsQWRkZWQiLCJvcmlnaW5hbENoYW5nZWQiLCJwdWJsaXNoIiwic2NvcGVGaWVsZE5hbWUiLCJfc3Vic2NyaXB0aW9uSWQiLCJlbmFibGVTY29wZSIsImFkZGVkIiwiY29sbGVjdGlvbk5hbWUiLCJpZCIsImZpZWxkcyIsIl8iLCJjbG9uZSIsImNhbGwiLCJjaGFuZ2VkIiwiYXBwbHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxjQUFjLFVBQUNDLElBQUQsRUFBT0MsSUFBUCxFQUFhQyxPQUFiO0FBQ1osTUFBQUMsT0FBQTs7QUFBQUEsWUFBVSxhQUFDQyxJQUFEO0FBQ1IsUUFBQUMsT0FBQSxFQUFBQyxhQUFBLEVBQUFDLGVBQUEsRUFBQUMsT0FBQSxFQUFBQyxjQUFBO0FBQUFELGNBQVUsSUFBVjtBQUVBQyxxQkFBaUIsUUFBUUQsUUFBUUUsZUFBaEIsRUFBakI7QUFFQUwsY0FBVSxLQUFWOztBQUVBRyxZQUFRRyxXQUFSLEdBQXNCO0FDQXBCLGFEQ0FOLFVBQVUsSUNEVjtBREFvQixLQUF0Qjs7QUFHQUMsb0JBQWdCRSxRQUFRSSxLQUF4Qjs7QUFDQUosWUFBUUksS0FBUixHQUFnQixVQUFDQyxjQUFELEVBQWlCQyxFQUFqQixFQUFxQkMsTUFBckI7QUNBZDtBREVBLFVBQUdWLE9BQUg7QUFDRVUsaUJBQVNDLEVBQUVDLEtBQUYsQ0FBUUYsTUFBUixDQUFUO0FBQ0FBLGVBQU9OLGNBQVAsSUFBeUIsQ0FBekI7QUNBRDs7QUFDRCxhRENBSCxjQUFjWSxJQUFkLENBQW1CLElBQW5CLEVBQXNCTCxjQUF0QixFQUFzQ0MsRUFBdEMsRUFBMENDLE1BQTFDLENDREE7QURMYyxLQUFoQjs7QUFRQVIsc0JBQWtCQyxRQUFRVyxPQUExQjs7QUFDQVgsWUFBUVcsT0FBUixHQUFrQixVQUFDTixjQUFELEVBQWlCQyxFQUFqQixFQUFxQkMsTUFBckI7QUNBaEI7QURFQSxVQUFHVixXQUFZSSxrQkFBa0JNLE1BQWpDO0FBQ0VBLGlCQUFTQyxFQUFFQyxLQUFGLENBQVFGLE1BQVIsQ0FBVDtBQUNBLGVBQU9BLE9BQU9OLGNBQVAsQ0FBUDtBQ0FEOztBQUNELGFEQ0FGLGdCQUFnQlcsSUFBaEIsQ0FBcUIsSUFBckIsRUFBd0JMLGNBQXhCLEVBQXdDQyxFQUF4QyxFQUE0Q0MsTUFBNUMsQ0NEQTtBRExnQixLQUFsQjs7QUNPQSxXRENBZCxLQUFLbUIsS0FBTCxDQUFXWixPQUFYLEVBQW9CSixJQUFwQixDQ0RBO0FEM0JRLEdBQVY7O0FDNkJBLFNEQ0EsQ0FBQ0osSUFBRCxFQUFPRyxPQUFQLEVBQWdCRCxPQUFoQixDQ0RBO0FEOUJGLEciLCJmaWxlIjoiL3BhY2thZ2VzL3BlZXJsaWJyYXJ5X3N1YnNjcmlwdGlvbi1zY29wZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4dGVuZFB1Ymxpc2ggKG5hbWUsIGZ1bmMsIG9wdGlvbnMpIC0+XG4gIG5ld0Z1bmMgPSAoYXJncy4uLikgLT5cbiAgICBwdWJsaXNoID0gQFxuXG4gICAgc2NvcGVGaWVsZE5hbWUgPSBcIl9zdWJfI3twdWJsaXNoLl9zdWJzY3JpcHRpb25JZH1cIlxuXG4gICAgZW5hYmxlZCA9IGZhbHNlXG5cbiAgICBwdWJsaXNoLmVuYWJsZVNjb3BlID0gLT5cbiAgICAgIGVuYWJsZWQgPSB0cnVlXG5cbiAgICBvcmlnaW5hbEFkZGVkID0gcHVibGlzaC5hZGRlZFxuICAgIHB1Ymxpc2guYWRkZWQgPSAoY29sbGVjdGlvbk5hbWUsIGlkLCBmaWVsZHMpIC0+XG4gICAgICAjIEFkZCBvdXIgc2NvcGluZyBmaWVsZC5cbiAgICAgIGlmIGVuYWJsZWRcbiAgICAgICAgZmllbGRzID0gXy5jbG9uZSBmaWVsZHNcbiAgICAgICAgZmllbGRzW3Njb3BlRmllbGROYW1lXSA9IDFcblxuICAgICAgb3JpZ2luYWxBZGRlZC5jYWxsIEAsIGNvbGxlY3Rpb25OYW1lLCBpZCwgZmllbGRzXG5cbiAgICBvcmlnaW5hbENoYW5nZWQgPSBwdWJsaXNoLmNoYW5nZWRcbiAgICBwdWJsaXNoLmNoYW5nZWQgPSAoY29sbGVjdGlvbk5hbWUsIGlkLCBmaWVsZHMpIC0+XG4gICAgICAjIFdlIGRvIG5vdCBhbGxvdyBjaGFuZ2VzIHRvIG91ciBzY29waW5nIGZpZWxkLlxuICAgICAgaWYgZW5hYmxlZCBhbmQgc2NvcGVGaWVsZE5hbWUgb2YgZmllbGRzXG4gICAgICAgIGZpZWxkcyA9IF8uY2xvbmUgZmllbGRzXG4gICAgICAgIGRlbGV0ZSBmaWVsZHNbc2NvcGVGaWVsZE5hbWVdXG5cbiAgICAgIG9yaWdpbmFsQ2hhbmdlZC5jYWxsIEAsIGNvbGxlY3Rpb25OYW1lLCBpZCwgZmllbGRzXG5cbiAgICBmdW5jLmFwcGx5IHB1Ymxpc2gsIGFyZ3NcblxuICBbbmFtZSwgbmV3RnVuYywgb3B0aW9uc11cbiIsImV4dGVuZFB1Ymxpc2goZnVuY3Rpb24obmFtZSwgZnVuYywgb3B0aW9ucykge1xuICB2YXIgbmV3RnVuYztcbiAgbmV3RnVuYyA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICB2YXIgZW5hYmxlZCwgb3JpZ2luYWxBZGRlZCwgb3JpZ2luYWxDaGFuZ2VkLCBwdWJsaXNoLCBzY29wZUZpZWxkTmFtZTtcbiAgICBwdWJsaXNoID0gdGhpcztcbiAgICBzY29wZUZpZWxkTmFtZSA9IGBfc3ViXyR7cHVibGlzaC5fc3Vic2NyaXB0aW9uSWR9YDtcbiAgICBlbmFibGVkID0gZmFsc2U7XG4gICAgcHVibGlzaC5lbmFibGVTY29wZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGVuYWJsZWQgPSB0cnVlO1xuICAgIH07XG4gICAgb3JpZ2luYWxBZGRlZCA9IHB1Ymxpc2guYWRkZWQ7XG4gICAgcHVibGlzaC5hZGRlZCA9IGZ1bmN0aW9uKGNvbGxlY3Rpb25OYW1lLCBpZCwgZmllbGRzKSB7XG4gICAgICAvLyBBZGQgb3VyIHNjb3BpbmcgZmllbGQuXG4gICAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgICBmaWVsZHMgPSBfLmNsb25lKGZpZWxkcyk7XG4gICAgICAgIGZpZWxkc1tzY29wZUZpZWxkTmFtZV0gPSAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9yaWdpbmFsQWRkZWQuY2FsbCh0aGlzLCBjb2xsZWN0aW9uTmFtZSwgaWQsIGZpZWxkcyk7XG4gICAgfTtcbiAgICBvcmlnaW5hbENoYW5nZWQgPSBwdWJsaXNoLmNoYW5nZWQ7XG4gICAgcHVibGlzaC5jaGFuZ2VkID0gZnVuY3Rpb24oY29sbGVjdGlvbk5hbWUsIGlkLCBmaWVsZHMpIHtcbiAgICAgIC8vIFdlIGRvIG5vdCBhbGxvdyBjaGFuZ2VzIHRvIG91ciBzY29waW5nIGZpZWxkLlxuICAgICAgaWYgKGVuYWJsZWQgJiYgc2NvcGVGaWVsZE5hbWUgaW4gZmllbGRzKSB7XG4gICAgICAgIGZpZWxkcyA9IF8uY2xvbmUoZmllbGRzKTtcbiAgICAgICAgZGVsZXRlIGZpZWxkc1tzY29wZUZpZWxkTmFtZV07XG4gICAgICB9XG4gICAgICByZXR1cm4gb3JpZ2luYWxDaGFuZ2VkLmNhbGwodGhpcywgY29sbGVjdGlvbk5hbWUsIGlkLCBmaWVsZHMpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmMuYXBwbHkocHVibGlzaCwgYXJncyk7XG4gIH07XG4gIHJldHVybiBbbmFtZSwgbmV3RnVuYywgb3B0aW9uc107XG59KTtcbiJdfQ==
