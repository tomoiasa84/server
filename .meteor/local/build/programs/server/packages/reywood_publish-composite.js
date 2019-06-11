(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var _ = Package.underscore._;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var enableDebugLogging, publishComposite;

var require = meteorInstall({"node_modules":{"meteor":{"reywood:publish-composite":{"lib":{"publish_composite.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/publish_composite.js                                                      //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.export({
  enableDebugLogging: () => enableDebugLogging,
  publishComposite: () => publishComposite
});

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let Publication;
module.link("./publication", {
  default(v) {
    Publication = v;
  }

}, 2);
let Subscription;
module.link("./subscription", {
  default(v) {
    Subscription = v;
  }

}, 3);
let debugLog, enableDebugLogging;
module.link("./logging", {
  debugLog(v) {
    debugLog = v;
  },

  enableDebugLogging(v) {
    enableDebugLogging = v;
  }

}, 4);

function publishComposite(name, options) {
  return Meteor.publish(name, function publish(...args) {
    const subscription = new Subscription(this);
    const instanceOptions = prepareOptions.call(this, options, args);
    const publications = [];
    instanceOptions.forEach(opt => {
      const pub = new Publication(subscription, opt);
      pub.publish();
      publications.push(pub);
    });
    this.onStop(() => {
      publications.forEach(pub => pub.unpublish());
    });
    debugLog('Meteor.publish', 'ready');
    this.ready();
  });
} // For backwards compatibility


Meteor.publishComposite = publishComposite;

function prepareOptions(options, args) {
  let preparedOptions = options;

  if (typeof preparedOptions === 'function') {
    preparedOptions = preparedOptions.apply(this, args);
  }

  if (!preparedOptions) {
    return [];
  }

  if (!_.isArray(preparedOptions)) {
    preparedOptions = [preparedOptions];
  }

  return preparedOptions;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"doc_ref_counter.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/doc_ref_counter.js                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
class DocumentRefCounter {
  constructor(observer) {
    this.heap = {};
    this.observer = observer;
  }

  increment(collectionName, docId) {
    const key = `${collectionName}:${docId.valueOf()}`;

    if (!this.heap[key]) {
      this.heap[key] = 0;
    }

    this.heap[key] += 1;
  }

  decrement(collectionName, docId) {
    const key = `${collectionName}:${docId.valueOf()}`;

    if (this.heap[key]) {
      this.heap[key] -= 1;
      this.observer.onChange(collectionName, docId, this.heap[key]);
    }
  }

}

module.exportDefault(DocumentRefCounter);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"logging.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/logging.js                                                                //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.export({
  debugLog: () => debugLog,
  enableDebugLogging: () => enableDebugLogging
});

/* eslint-disable no-console */
let debugLoggingEnabled = false;

function debugLog(source, message) {
  if (!debugLoggingEnabled) {
    return;
  }

  let paddedSource = source;

  while (paddedSource.length < 35) {
    paddedSource += ' ';
  }

  console.log(`[${paddedSource}] ${message}`);
}

function enableDebugLogging() {
  debugLoggingEnabled = true;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"publication.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/publication.js                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Match, check;
module.link("meteor/check", {
  Match(v) {
    Match = v;
  },

  check(v) {
    check = v;
  }

}, 1);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 2);
let debugLog;
module.link("./logging", {
  debugLog(v) {
    debugLog = v;
  }

}, 3);
let PublishedDocumentList;
module.link("./published_document_list", {
  default(v) {
    PublishedDocumentList = v;
  }

}, 4);

class Publication {
  constructor(subscription, options, args) {
    check(options, {
      find: Function,
      children: Match.Optional([Object]),
      collectionName: Match.Optional(String)
    });
    this.subscription = subscription;
    this.options = options;
    this.args = args || [];
    this.childrenOptions = options.children || [];
    this.publishedDocs = new PublishedDocumentList();
    this.collectionName = options.collectionName;
  }

  publish() {
    this.cursor = this._getCursor();

    if (!this.cursor) {
      return;
    }

    const collectionName = this._getCollectionName(); // Use Meteor.bindEnvironment to make sure the callbacks are run with the same
    // environmentVariables as when publishing the "parent".
    // It's only needed when publish is being recursively run.


    this.observeHandle = this.cursor.observe({
      added: Meteor.bindEnvironment(doc => {
        const alreadyPublished = this.publishedDocs.has(doc._id);

        if (alreadyPublished) {
          debugLog('Publication.observeHandle.added', `${collectionName}:${doc._id} already published`);
          this.publishedDocs.unflagForRemoval(doc._id);

          this._republishChildrenOf(doc);

          this.subscription.changed(collectionName, doc._id, doc);
        } else {
          this.publishedDocs.add(collectionName, doc._id);

          this._publishChildrenOf(doc);

          this.subscription.added(collectionName, doc);
        }
      }),
      changed: Meteor.bindEnvironment(newDoc => {
        debugLog('Publication.observeHandle.changed', `${collectionName}:${newDoc._id}`);

        this._republishChildrenOf(newDoc);
      }),
      removed: doc => {
        debugLog('Publication.observeHandle.removed', `${collectionName}:${doc._id}`);

        this._removeDoc(collectionName, doc._id);
      }
    });
    this.observeChangesHandle = this.cursor.observeChanges({
      changed: (id, fields) => {
        debugLog('Publication.observeChangesHandle.changed', `${collectionName}:${id}`);
        this.subscription.changed(collectionName, id, fields);
      }
    });
  }

  unpublish() {
    debugLog('Publication.unpublish', this._getCollectionName());

    this._stopObservingCursor();

    this._unpublishAllDocuments();
  }

  _republish() {
    this._stopObservingCursor();

    this.publishedDocs.flagAllForRemoval();
    debugLog('Publication._republish', 'run .publish again');
    this.publish();
    debugLog('Publication._republish', 'unpublish docs from old cursor');

    this._removeFlaggedDocs();
  }

  _getCursor() {
    return this.options.find.apply(this.subscription.meteorSub, this.args);
  }

  _getCollectionName() {
    return this.collectionName || this.cursor && this.cursor._getCollectionName();
  }

  _publishChildrenOf(doc) {
    _.each(this.childrenOptions, function createChildPublication(options) {
      const pub = new Publication(this.subscription, options, [doc].concat(this.args));
      this.publishedDocs.addChildPub(doc._id, pub);
      pub.publish();
    }, this);
  }

  _republishChildrenOf(doc) {
    this.publishedDocs.eachChildPub(doc._id, publication => {
      publication.args[0] = doc;

      publication._republish();
    });
  }

  _unpublishAllDocuments() {
    this.publishedDocs.eachDocument(doc => {
      this._removeDoc(doc.collectionName, doc.docId);
    }, this);
  }

  _stopObservingCursor() {
    debugLog('Publication._stopObservingCursor', 'stop observing cursor');

    if (this.observeHandle) {
      this.observeHandle.stop();
      delete this.observeHandle;
    }

    if (this.observeChangesHandle) {
      this.observeChangesHandle.stop();
      delete this.observeChangesHandle;
    }
  }

  _removeFlaggedDocs() {
    this.publishedDocs.eachDocument(doc => {
      if (doc.isFlaggedForRemoval()) {
        this._removeDoc(doc.collectionName, doc.docId);
      }
    }, this);
  }

  _removeDoc(collectionName, docId) {
    this.subscription.removed(collectionName, docId);

    this._unpublishChildrenOf(docId);

    this.publishedDocs.remove(docId);
  }

  _unpublishChildrenOf(docId) {
    debugLog('Publication._unpublishChildrenOf', `unpublishing children of ${this._getCollectionName()}:${docId}`);
    this.publishedDocs.eachChildPub(docId, publication => {
      publication.unpublish();
    });
  }

}

module.exportDefault(Publication);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"subscription.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/subscription.js                                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 0);
let DocumentRefCounter;
module.link("./doc_ref_counter", {
  default(v) {
    DocumentRefCounter = v;
  }

}, 1);
let debugLog;
module.link("./logging", {
  debugLog(v) {
    debugLog = v;
  }

}, 2);

class Subscription {
  constructor(meteorSub) {
    this.meteorSub = meteorSub;
    this.docHash = {};
    this.refCounter = new DocumentRefCounter({
      onChange: (collectionName, docId, refCount) => {
        debugLog('Subscription.refCounter.onChange', `${collectionName}:${docId.valueOf()} ${refCount}`);

        if (refCount <= 0) {
          meteorSub.removed(collectionName, docId);

          this._removeDocHash(collectionName, docId);
        }
      }
    });
  }

  added(collectionName, doc) {
    this.refCounter.increment(collectionName, doc._id);

    if (this._hasDocChanged(collectionName, doc._id, doc)) {
      debugLog('Subscription.added', `${collectionName}:${doc._id}`);
      this.meteorSub.added(collectionName, doc._id, doc);

      this._addDocHash(collectionName, doc);
    }
  }

  changed(collectionName, id, changes) {
    if (this._shouldSendChanges(collectionName, id, changes)) {
      debugLog('Subscription.changed', `${collectionName}:${id}`);
      this.meteorSub.changed(collectionName, id, changes);

      this._updateDocHash(collectionName, id, changes);
    }
  }

  removed(collectionName, id) {
    debugLog('Subscription.removed', `${collectionName}:${id.valueOf()}`);
    this.refCounter.decrement(collectionName, id);
  }

  _addDocHash(collectionName, doc) {
    this.docHash[buildHashKey(collectionName, doc._id)] = doc;
  }

  _updateDocHash(collectionName, id, changes) {
    const key = buildHashKey(collectionName, id);
    const existingDoc = this.docHash[key] || {};
    this.docHash[key] = _.extend(existingDoc, changes);
  }

  _shouldSendChanges(collectionName, id, changes) {
    return this._isDocPublished(collectionName, id) && this._hasDocChanged(collectionName, id, changes);
  }

  _isDocPublished(collectionName, id) {
    const key = buildHashKey(collectionName, id);
    return !!this.docHash[key];
  }

  _hasDocChanged(collectionName, id, doc) {
    const existingDoc = this.docHash[buildHashKey(collectionName, id)];

    if (!existingDoc) {
      return true;
    }

    return _.any(_.keys(doc), key => !_.isEqual(doc[key], existingDoc[key]));
  }

  _removeDocHash(collectionName, id) {
    const key = buildHashKey(collectionName, id);
    delete this.docHash[key];
  }

}

function buildHashKey(collectionName, id) {
  return `${collectionName}::${id.valueOf()}`;
}

module.exportDefault(Subscription);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"published_document.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/published_document.js                                                     //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
class PublishedDocument {
  constructor(collectionName, docId) {
    this.collectionName = collectionName;
    this.docId = docId;
    this.childPublications = [];
    this._isFlaggedForRemoval = false;
  }

  addChildPub(childPublication) {
    this.childPublications.push(childPublication);
  }

  eachChildPub(callback) {
    this.childPublications.forEach(callback);
  }

  isFlaggedForRemoval() {
    return this._isFlaggedForRemoval;
  }

  unflagForRemoval() {
    this._isFlaggedForRemoval = false;
  }

  flagForRemoval() {
    this._isFlaggedForRemoval = true;
  }

}

module.exportDefault(PublishedDocument);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"published_document_list.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/published_document_list.js                                                //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 0);
let PublishedDocument;
module.link("./published_document", {
  default(v) {
    PublishedDocument = v;
  }

}, 1);

class PublishedDocumentList {
  constructor() {
    this.documents = {};
  }

  add(collectionName, docId) {
    const key = valueOfId(docId);

    if (!this.documents[key]) {
      this.documents[key] = new PublishedDocument(collectionName, docId);
    }
  }

  addChildPub(docId, publication) {
    if (!publication) {
      return;
    }

    const key = valueOfId(docId);
    const doc = this.documents[key];

    if (typeof doc === 'undefined') {
      throw new Error(`Doc not found in list: ${key}`);
    }

    this.documents[key].addChildPub(publication);
  }

  get(docId) {
    const key = valueOfId(docId);
    return this.documents[key];
  }

  remove(docId) {
    const key = valueOfId(docId);
    delete this.documents[key];
  }

  has(docId) {
    return !!this.get(docId);
  }

  eachDocument(callback, context) {
    _.each(this.documents, function execCallbackOnDoc(doc) {
      callback.call(this, doc);
    }, context || this);
  }

  eachChildPub(docId, callback) {
    const doc = this.get(docId);

    if (doc) {
      doc.eachChildPub(callback);
    }
  }

  getIds() {
    const docIds = [];
    this.eachDocument(doc => {
      docIds.push(doc.docId);
    });
    return docIds;
  }

  unflagForRemoval(docId) {
    const doc = this.get(docId);

    if (doc) {
      doc.unflagForRemoval();
    }
  }

  flagAllForRemoval() {
    this.eachDocument(doc => {
      doc.flagForRemoval();
    });
  }

}

function valueOfId(docId) {
  if (docId === null) {
    throw new Error('Document ID is null');
  }

  if (typeof docId === 'undefined') {
    throw new Error('Document ID is undefined');
  }

  return docId.valueOf();
}

module.exportDefault(PublishedDocumentList);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/reywood:publish-composite/lib/publish_composite.js");
require("/node_modules/meteor/reywood:publish-composite/lib/doc_ref_counter.js");
require("/node_modules/meteor/reywood:publish-composite/lib/logging.js");
require("/node_modules/meteor/reywood:publish-composite/lib/publication.js");
require("/node_modules/meteor/reywood:publish-composite/lib/subscription.js");

/* Exports */
Package._define("reywood:publish-composite", exports, {
  enableDebugLogging: enableDebugLogging,
  publishComposite: publishComposite
});

})();

//# sourceURL=meteor://💻app/packages/reywood_publish-composite.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmV5d29vZDpwdWJsaXNoLWNvbXBvc2l0ZS9saWIvcHVibGlzaF9jb21wb3NpdGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3JleXdvb2Q6cHVibGlzaC1jb21wb3NpdGUvbGliL2RvY19yZWZfY291bnRlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmV5d29vZDpwdWJsaXNoLWNvbXBvc2l0ZS9saWIvbG9nZ2luZy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmV5d29vZDpwdWJsaXNoLWNvbXBvc2l0ZS9saWIvcHVibGljYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3JleXdvb2Q6cHVibGlzaC1jb21wb3NpdGUvbGliL3N1YnNjcmlwdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmV5d29vZDpwdWJsaXNoLWNvbXBvc2l0ZS9saWIvcHVibGlzaGVkX2RvY3VtZW50LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9yZXl3b29kOnB1Ymxpc2gtY29tcG9zaXRlL2xpYi9wdWJsaXNoZWRfZG9jdW1lbnRfbGlzdC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJlbmFibGVEZWJ1Z0xvZ2dpbmciLCJwdWJsaXNoQ29tcG9zaXRlIiwiXyIsImxpbmsiLCJ2IiwiTWV0ZW9yIiwiUHVibGljYXRpb24iLCJkZWZhdWx0IiwiU3Vic2NyaXB0aW9uIiwiZGVidWdMb2ciLCJuYW1lIiwib3B0aW9ucyIsInB1Ymxpc2giLCJhcmdzIiwic3Vic2NyaXB0aW9uIiwiaW5zdGFuY2VPcHRpb25zIiwicHJlcGFyZU9wdGlvbnMiLCJjYWxsIiwicHVibGljYXRpb25zIiwiZm9yRWFjaCIsIm9wdCIsInB1YiIsInB1c2giLCJvblN0b3AiLCJ1bnB1Ymxpc2giLCJyZWFkeSIsInByZXBhcmVkT3B0aW9ucyIsImFwcGx5IiwiaXNBcnJheSIsIkRvY3VtZW50UmVmQ291bnRlciIsImNvbnN0cnVjdG9yIiwib2JzZXJ2ZXIiLCJoZWFwIiwiaW5jcmVtZW50IiwiY29sbGVjdGlvbk5hbWUiLCJkb2NJZCIsImtleSIsInZhbHVlT2YiLCJkZWNyZW1lbnQiLCJvbkNoYW5nZSIsImV4cG9ydERlZmF1bHQiLCJkZWJ1Z0xvZ2dpbmdFbmFibGVkIiwic291cmNlIiwibWVzc2FnZSIsInBhZGRlZFNvdXJjZSIsImxlbmd0aCIsImNvbnNvbGUiLCJsb2ciLCJNYXRjaCIsImNoZWNrIiwiUHVibGlzaGVkRG9jdW1lbnRMaXN0IiwiZmluZCIsIkZ1bmN0aW9uIiwiY2hpbGRyZW4iLCJPcHRpb25hbCIsIk9iamVjdCIsIlN0cmluZyIsImNoaWxkcmVuT3B0aW9ucyIsInB1Ymxpc2hlZERvY3MiLCJjdXJzb3IiLCJfZ2V0Q3Vyc29yIiwiX2dldENvbGxlY3Rpb25OYW1lIiwib2JzZXJ2ZUhhbmRsZSIsIm9ic2VydmUiLCJhZGRlZCIsImJpbmRFbnZpcm9ubWVudCIsImRvYyIsImFscmVhZHlQdWJsaXNoZWQiLCJoYXMiLCJfaWQiLCJ1bmZsYWdGb3JSZW1vdmFsIiwiX3JlcHVibGlzaENoaWxkcmVuT2YiLCJjaGFuZ2VkIiwiYWRkIiwiX3B1Ymxpc2hDaGlsZHJlbk9mIiwibmV3RG9jIiwicmVtb3ZlZCIsIl9yZW1vdmVEb2MiLCJvYnNlcnZlQ2hhbmdlc0hhbmRsZSIsIm9ic2VydmVDaGFuZ2VzIiwiaWQiLCJmaWVsZHMiLCJfc3RvcE9ic2VydmluZ0N1cnNvciIsIl91bnB1Ymxpc2hBbGxEb2N1bWVudHMiLCJfcmVwdWJsaXNoIiwiZmxhZ0FsbEZvclJlbW92YWwiLCJfcmVtb3ZlRmxhZ2dlZERvY3MiLCJtZXRlb3JTdWIiLCJlYWNoIiwiY3JlYXRlQ2hpbGRQdWJsaWNhdGlvbiIsImNvbmNhdCIsImFkZENoaWxkUHViIiwiZWFjaENoaWxkUHViIiwicHVibGljYXRpb24iLCJlYWNoRG9jdW1lbnQiLCJzdG9wIiwiaXNGbGFnZ2VkRm9yUmVtb3ZhbCIsIl91bnB1Ymxpc2hDaGlsZHJlbk9mIiwicmVtb3ZlIiwiZG9jSGFzaCIsInJlZkNvdW50ZXIiLCJyZWZDb3VudCIsIl9yZW1vdmVEb2NIYXNoIiwiX2hhc0RvY0NoYW5nZWQiLCJfYWRkRG9jSGFzaCIsImNoYW5nZXMiLCJfc2hvdWxkU2VuZENoYW5nZXMiLCJfdXBkYXRlRG9jSGFzaCIsImJ1aWxkSGFzaEtleSIsImV4aXN0aW5nRG9jIiwiZXh0ZW5kIiwiX2lzRG9jUHVibGlzaGVkIiwiYW55Iiwia2V5cyIsImlzRXF1YWwiLCJQdWJsaXNoZWREb2N1bWVudCIsImNoaWxkUHVibGljYXRpb25zIiwiX2lzRmxhZ2dlZEZvclJlbW92YWwiLCJjaGlsZFB1YmxpY2F0aW9uIiwiY2FsbGJhY2siLCJmbGFnRm9yUmVtb3ZhbCIsImRvY3VtZW50cyIsInZhbHVlT2ZJZCIsIkVycm9yIiwiZ2V0IiwiY29udGV4dCIsImV4ZWNDYWxsYmFja09uRG9jIiwiZ2V0SWRzIiwiZG9jSWRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNDLG9CQUFrQixFQUFDLE1BQUlBLGtCQUF4QjtBQUEyQ0Msa0JBQWdCLEVBQUMsTUFBSUE7QUFBaEUsQ0FBZDs7QUFBaUcsSUFBSUMsQ0FBSjs7QUFBTUosTUFBTSxDQUFDSyxJQUFQLENBQVksbUJBQVosRUFBZ0M7QUFBQ0QsR0FBQyxDQUFDRSxDQUFELEVBQUc7QUFBQ0YsS0FBQyxHQUFDRSxDQUFGO0FBQUk7O0FBQVYsQ0FBaEMsRUFBNEMsQ0FBNUM7QUFBK0MsSUFBSUMsTUFBSjtBQUFXUCxNQUFNLENBQUNLLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNFLFFBQU0sQ0FBQ0QsQ0FBRCxFQUFHO0FBQUNDLFVBQU0sR0FBQ0QsQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJRSxXQUFKO0FBQWdCUixNQUFNLENBQUNLLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNJ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QVAsS0FBaUIsV0FBckIsRUFBa0M7QUFDOUIsVUFBTSxJQUFJd0YsS0FBSixDQUFVLDBCQUFWLENBQU47QUFDSDs7QUFDRCxTQUFPeEYsS0FBSyxDQUFDRSxPQUFOLEVBQVA7QUFDSDs7QUE1RkR2QyxNQUFNLENBQUMwQyxhQUFQLENBOEZlVSxxQkE5RmYsRSIsImZpbGUiOiIvcGFja2FnZXMvcmV5d29vZF9wdWJsaXNoLWNvbXBvc2l0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcblxuaW1wb3J0IFB1YmxpY2F0aW9uIGZyb20gJy4vcHVibGljYXRpb24nO1xuaW1wb3J0IFN1YnNjcmlwdGlvbiBmcm9tICcuL3N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBkZWJ1Z0xvZywgZW5hYmxlRGVidWdMb2dnaW5nIH0gZnJvbSAnLi9sb2dnaW5nJztcblxuXG5mdW5jdGlvbiBwdWJsaXNoQ29tcG9zaXRlKG5hbWUsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gTWV0ZW9yLnB1Ymxpc2gobmFtZSwgZnVuY3Rpb24gcHVibGlzaCguLi5hcmdzKSB7XG4gICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24odGhpcyk7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlT3B0aW9ucyA9IHByZXBhcmVPcHRpb25zLmNhbGwodGhpcywgb3B0aW9ucywgYXJncyk7XG4gICAgICAgIGNvbnN0IHB1YmxpY2F0aW9ucyA9IFtdO1xuXG4gICAgICAgIGluc3RhbmNlT3B0aW9ucy5mb3JFYWNoKChvcHQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHB1YiA9IG5ldyBQdWJsaWNhdGlvbihzdWJzY3JpcHRpb24sIG9wdCk7XG4gICAgICAgICAgICBwdWIucHVibGlzaCgpO1xuICAgICAgICAgICAgcHVibGljYXRpb25zLnB1c2gocHViKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5vblN0b3AoKCkgPT4ge1xuICAgICAgICAgICAgcHVibGljYXRpb25zLmZvckVhY2gocHViID0+IHB1Yi51bnB1Ymxpc2goKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlYnVnTG9nKCdNZXRlb3IucHVibGlzaCcsICdyZWFkeScpO1xuICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgfSk7XG59XG5cbi8vIEZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUgPSBwdWJsaXNoQ29tcG9zaXRlO1xuXG5mdW5jdGlvbiBwcmVwYXJlT3B0aW9ucyhvcHRpb25zLCBhcmdzKSB7XG4gICAgbGV0IHByZXBhcmVkT3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICBpZiAodHlwZW9mIHByZXBhcmVkT3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwcmVwYXJlZE9wdGlvbnMgPSBwcmVwYXJlZE9wdGlvbnMuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuXG4gICAgaWYgKCFwcmVwYXJlZE9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGlmICghXy5pc0FycmF5KHByZXBhcmVkT3B0aW9ucykpIHtcbiAgICAgICAgcHJlcGFyZWRPcHRpb25zID0gW3ByZXBhcmVkT3B0aW9uc107XG4gICAgfVxuXG4gICAgcmV0dXJuIHByZXBhcmVkT3B0aW9ucztcbn1cblxuXG5leHBvcnQge1xuICAgIGVuYWJsZURlYnVnTG9nZ2luZyxcbiAgICBwdWJsaXNoQ29tcG9zaXRlLFxufTtcbiIsImNsYXNzIERvY3VtZW50UmVmQ291bnRlciB7XG4gICAgY29uc3RydWN0b3Iob2JzZXJ2ZXIpIHtcbiAgICAgICAgdGhpcy5oZWFwID0ge307XG4gICAgICAgIHRoaXMub2JzZXJ2ZXIgPSBvYnNlcnZlcjtcbiAgICB9XG5cbiAgICBpbmNyZW1lbnQoY29sbGVjdGlvbk5hbWUsIGRvY0lkKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGAke2NvbGxlY3Rpb25OYW1lfToke2RvY0lkLnZhbHVlT2YoKX1gO1xuICAgICAgICBpZiAoIXRoaXMuaGVhcFtrZXldKSB7XG4gICAgICAgICAgICB0aGlzLmhlYXBba2V5XSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oZWFwW2tleV0gKz0gMTtcbiAgICB9XG5cbiAgICBkZWNyZW1lbnQoY29sbGVjdGlvbk5hbWUsIGRvY0lkKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGAke2NvbGxlY3Rpb25OYW1lfToke2RvY0lkLnZhbHVlT2YoKX1gO1xuICAgICAgICBpZiAodGhpcy5oZWFwW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMuaGVhcFtrZXldIC09IDE7XG5cbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZXIub25DaGFuZ2UoY29sbGVjdGlvbk5hbWUsIGRvY0lkLCB0aGlzLmhlYXBba2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERvY3VtZW50UmVmQ291bnRlcjtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cblxubGV0IGRlYnVnTG9nZ2luZ0VuYWJsZWQgPSBmYWxzZTtcblxuZnVuY3Rpb24gZGVidWdMb2coc291cmNlLCBtZXNzYWdlKSB7XG4gICAgaWYgKCFkZWJ1Z0xvZ2dpbmdFbmFibGVkKSB7IHJldHVybjsgfVxuICAgIGxldCBwYWRkZWRTb3VyY2UgPSBzb3VyY2U7XG4gICAgd2hpbGUgKHBhZGRlZFNvdXJjZS5sZW5ndGggPCAzNSkgeyBwYWRkZWRTb3VyY2UgKz0gJyAnOyB9XG4gICAgY29uc29sZS5sb2coYFske3BhZGRlZFNvdXJjZX1dICR7bWVzc2FnZX1gKTtcbn1cblxuZnVuY3Rpb24gZW5hYmxlRGVidWdMb2dnaW5nKCkge1xuICAgIGRlYnVnTG9nZ2luZ0VuYWJsZWQgPSB0cnVlO1xufVxuXG5leHBvcnQge1xuICAgIGRlYnVnTG9nLFxuICAgIGVuYWJsZURlYnVnTG9nZ2luZyxcbn07XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IE1hdGNoLCBjaGVjayB9IGZyb20gJ21ldGVvci9jaGVjayc7XG5pbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuXG5pbXBvcnQgeyBkZWJ1Z0xvZyB9IGZyb20gJy4vbG9nZ2luZyc7XG5pbXBvcnQgUHVibGlzaGVkRG9jdW1lbnRMaXN0IGZyb20gJy4vcHVibGlzaGVkX2RvY3VtZW50X2xpc3QnO1xuXG5cbmNsYXNzIFB1YmxpY2F0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihzdWJzY3JpcHRpb24sIG9wdGlvbnMsIGFyZ3MpIHtcbiAgICAgICAgY2hlY2sob3B0aW9ucywge1xuICAgICAgICAgICAgZmluZDogRnVuY3Rpb24sXG4gICAgICAgICAgICBjaGlsZHJlbjogTWF0Y2guT3B0aW9uYWwoW09iamVjdF0pLFxuICAgICAgICAgICAgY29sbGVjdGlvbk5hbWU6IE1hdGNoLk9wdGlvbmFsKFN0cmluZyksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gc3Vic2NyaXB0aW9uO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzIHx8IFtdO1xuICAgICAgICB0aGlzLmNoaWxkcmVuT3B0aW9ucyA9IG9wdGlvbnMuY2hpbGRyZW4gfHwgW107XG4gICAgICAgIHRoaXMucHVibGlzaGVkRG9jcyA9IG5ldyBQdWJsaXNoZWREb2N1bWVudExpc3QoKTtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uTmFtZSA9IG9wdGlvbnMuY29sbGVjdGlvbk5hbWU7XG4gICAgfVxuXG4gICAgcHVibGlzaCgpIHtcbiAgICAgICAgdGhpcy5jdXJzb3IgPSB0aGlzLl9nZXRDdXJzb3IoKTtcbiAgICAgICAgaWYgKCF0aGlzLmN1cnNvcikgeyByZXR1cm47IH1cblxuICAgICAgICBjb25zdCBjb2xsZWN0aW9uTmFtZSA9IHRoaXMuX2dldENvbGxlY3Rpb25OYW1lKCk7XG5cbiAgICAgICAgLy8gVXNlIE1ldGVvci5iaW5kRW52aXJvbm1lbnQgdG8gbWFrZSBzdXJlIHRoZSBjYWxsYmFja3MgYXJlIHJ1biB3aXRoIHRoZSBzYW1lXG4gICAgICAgIC8vIGVudmlyb25tZW50VmFyaWFibGVzIGFzIHdoZW4gcHVibGlzaGluZyB0aGUgXCJwYXJlbnRcIi5cbiAgICAgICAgLy8gSXQncyBvbmx5IG5lZWRlZCB3aGVuIHB1Ymxpc2ggaXMgYmVpbmcgcmVjdXJzaXZlbHkgcnVuLlxuICAgICAgICB0aGlzLm9ic2VydmVIYW5kbGUgPSB0aGlzLmN1cnNvci5vYnNlcnZlKHtcbiAgICAgICAgICAgIGFkZGVkOiBNZXRlb3IuYmluZEVudmlyb25tZW50KChkb2MpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhbHJlYWR5UHVibGlzaGVkID0gdGhpcy5wdWJsaXNoZWREb2NzLmhhcyhkb2MuX2lkKTtcblxuICAgICAgICAgICAgICAgIGlmIChhbHJlYWR5UHVibGlzaGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnTG9nKCdQdWJsaWNhdGlvbi5vYnNlcnZlSGFuZGxlLmFkZGVkJywgYCR7Y29sbGVjdGlvbk5hbWV9OiR7ZG9jLl9pZH0gYWxyZWFkeSBwdWJsaXNoZWRgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdWJsaXNoZWREb2NzLnVuZmxhZ0ZvclJlbW92YWwoZG9jLl9pZCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlcHVibGlzaENoaWxkcmVuT2YoZG9jKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24uY2hhbmdlZChjb2xsZWN0aW9uTmFtZSwgZG9jLl9pZCwgZG9jKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnB1Ymxpc2hlZERvY3MuYWRkKGNvbGxlY3Rpb25OYW1lLCBkb2MuX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHVibGlzaENoaWxkcmVuT2YoZG9jKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24uYWRkZWQoY29sbGVjdGlvbk5hbWUsIGRvYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBjaGFuZ2VkOiBNZXRlb3IuYmluZEVudmlyb25tZW50KChuZXdEb2MpID0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1Z0xvZygnUHVibGljYXRpb24ub2JzZXJ2ZUhhbmRsZS5jaGFuZ2VkJywgYCR7Y29sbGVjdGlvbk5hbWV9OiR7bmV3RG9jLl9pZH1gKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXB1Ymxpc2hDaGlsZHJlbk9mKG5ld0RvYyk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHJlbW92ZWQ6IChkb2MpID0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1Z0xvZygnUHVibGljYXRpb24ub2JzZXJ2ZUhhbmRsZS5yZW1vdmVkJywgYCR7Y29sbGVjdGlvbk5hbWV9OiR7ZG9jLl9pZH1gKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVEb2MoY29sbGVjdGlvbk5hbWUsIGRvYy5faWQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5vYnNlcnZlQ2hhbmdlc0hhbmRsZSA9IHRoaXMuY3Vyc29yLm9ic2VydmVDaGFuZ2VzKHtcbiAgICAgICAgICAgIGNoYW5nZWQ6IChpZCwgZmllbGRzKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVidWdMb2coJ1B1YmxpY2F0aW9uLm9ic2VydmVDaGFuZ2VzSGFuZGxlLmNoYW5nZWQnLCBgJHtjb2xsZWN0aW9uTmFtZX06JHtpZH1gKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbi5jaGFuZ2VkKGNvbGxlY3Rpb25OYW1lLCBpZCwgZmllbGRzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVucHVibGlzaCgpIHtcbiAgICAgICAgZGVidWdMb2coJ1B1YmxpY2F0aW9uLnVucHVibGlzaCcsIHRoaXMuX2dldENvbGxlY3Rpb25OYW1lKCkpO1xuICAgICAgICB0aGlzLl9zdG9wT2JzZXJ2aW5nQ3Vyc29yKCk7XG4gICAgICAgIHRoaXMuX3VucHVibGlzaEFsbERvY3VtZW50cygpO1xuICAgIH1cblxuICAgIF9yZXB1Ymxpc2goKSB7XG4gICAgICAgIHRoaXMuX3N0b3BPYnNlcnZpbmdDdXJzb3IoKTtcblxuICAgICAgICB0aGlzLnB1Ymxpc2hlZERvY3MuZmxhZ0FsbEZvclJlbW92YWwoKTtcblxuICAgICAgICBkZWJ1Z0xvZygnUHVibGljYXRpb24uX3JlcHVibGlzaCcsICdydW4gLnB1Ymxpc2ggYWdhaW4nKTtcbiAgICAgICAgdGhpcy5wdWJsaXNoKCk7XG5cbiAgICAgICAgZGVidWdMb2coJ1B1YmxpY2F0aW9uLl9yZXB1Ymxpc2gnLCAndW5wdWJsaXNoIGRvY3MgZnJvbSBvbGQgY3Vyc29yJyk7XG4gICAgICAgIHRoaXMuX3JlbW92ZUZsYWdnZWREb2NzKCk7XG4gICAgfVxuXG4gICAgX2dldEN1cnNvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5maW5kLmFwcGx5KHRoaXMuc3Vic2NyaXB0aW9uLm1ldGVvclN1YiwgdGhpcy5hcmdzKTtcbiAgICB9XG5cbiAgICBfZ2V0Q29sbGVjdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb25OYW1lIHx8ICh0aGlzLmN1cnNvciAmJiB0aGlzLmN1cnNvci5fZ2V0Q29sbGVjdGlvbk5hbWUoKSk7XG4gICAgfVxuXG4gICAgX3B1Ymxpc2hDaGlsZHJlbk9mKGRvYykge1xuICAgICAgICBfLmVhY2godGhpcy5jaGlsZHJlbk9wdGlvbnMsIGZ1bmN0aW9uIGNyZWF0ZUNoaWxkUHVibGljYXRpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgY29uc3QgcHViID0gbmV3IFB1YmxpY2F0aW9uKHRoaXMuc3Vic2NyaXB0aW9uLCBvcHRpb25zLCBbZG9jXS5jb25jYXQodGhpcy5hcmdzKSk7XG4gICAgICAgICAgICB0aGlzLnB1Ymxpc2hlZERvY3MuYWRkQ2hpbGRQdWIoZG9jLl9pZCwgcHViKTtcbiAgICAgICAgICAgIHB1Yi5wdWJsaXNoKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH1cblxuICAgIF9yZXB1Ymxpc2hDaGlsZHJlbk9mKGRvYykge1xuICAgICAgICB0aGlzLnB1Ymxpc2hlZERvY3MuZWFjaENoaWxkUHViKGRvYy5faWQsIChwdWJsaWNhdGlvbikgPT4ge1xuICAgICAgICAgICAgcHVibGljYXRpb24uYXJnc1swXSA9IGRvYztcbiAgICAgICAgICAgIHB1YmxpY2F0aW9uLl9yZXB1Ymxpc2goKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3VucHVibGlzaEFsbERvY3VtZW50cygpIHtcbiAgICAgICAgdGhpcy5wdWJsaXNoZWREb2NzLmVhY2hEb2N1bWVudCgoZG9jKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9yZW1vdmVEb2MoZG9jLmNvbGxlY3Rpb25OYW1lLCBkb2MuZG9jSWQpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICBfc3RvcE9ic2VydmluZ0N1cnNvcigpIHtcbiAgICAgICAgZGVidWdMb2coJ1B1YmxpY2F0aW9uLl9zdG9wT2JzZXJ2aW5nQ3Vyc29yJywgJ3N0b3Agb2JzZXJ2aW5nIGN1cnNvcicpO1xuXG4gICAgICAgIGlmICh0aGlzLm9ic2VydmVIYW5kbGUpIHtcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZUhhbmRsZS5zdG9wKCk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5vYnNlcnZlSGFuZGxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub2JzZXJ2ZUNoYW5nZXNIYW5kbGUpIHtcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZUNoYW5nZXNIYW5kbGUuc3RvcCgpO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMub2JzZXJ2ZUNoYW5nZXNIYW5kbGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfcmVtb3ZlRmxhZ2dlZERvY3MoKSB7XG4gICAgICAgIHRoaXMucHVibGlzaGVkRG9jcy5lYWNoRG9jdW1lbnQoKGRvYykgPT4ge1xuICAgICAgICAgICAgaWYgKGRvYy5pc0ZsYWdnZWRGb3JSZW1vdmFsKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVEb2MoZG9jLmNvbGxlY3Rpb25OYW1lLCBkb2MuZG9jSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICBfcmVtb3ZlRG9jKGNvbGxlY3Rpb25OYW1lLCBkb2NJZCkge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbi5yZW1vdmVkKGNvbGxlY3Rpb25OYW1lLCBkb2NJZCk7XG4gICAgICAgIHRoaXMuX3VucHVibGlzaENoaWxkcmVuT2YoZG9jSWQpO1xuICAgICAgICB0aGlzLnB1Ymxpc2hlZERvY3MucmVtb3ZlKGRvY0lkKTtcbiAgICB9XG5cbiAgICBfdW5wdWJsaXNoQ2hpbGRyZW5PZihkb2NJZCkge1xuICAgICAgICBkZWJ1Z0xvZygnUHVibGljYXRpb24uX3VucHVibGlzaENoaWxkcmVuT2YnLCBgdW5wdWJsaXNoaW5nIGNoaWxkcmVuIG9mICR7dGhpcy5fZ2V0Q29sbGVjdGlvbk5hbWUoKX06JHtkb2NJZH1gKTtcblxuICAgICAgICB0aGlzLnB1Ymxpc2hlZERvY3MuZWFjaENoaWxkUHViKGRvY0lkLCAocHVibGljYXRpb24pID0+IHtcbiAgICAgICAgICAgIHB1YmxpY2F0aW9uLnVucHVibGlzaCgpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFB1YmxpY2F0aW9uO1xuIiwiaW1wb3J0IHsgXyB9IGZyb20gJ21ldGVvci91bmRlcnNjb3JlJztcblxuaW1wb3J0IERvY3VtZW50UmVmQ291bnRlciBmcm9tICcuL2RvY19yZWZfY291bnRlcic7XG5pbXBvcnQgeyBkZWJ1Z0xvZyB9IGZyb20gJy4vbG9nZ2luZyc7XG5cblxuY2xhc3MgU3Vic2NyaXB0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihtZXRlb3JTdWIpIHtcbiAgICAgICAgdGhpcy5tZXRlb3JTdWIgPSBtZXRlb3JTdWI7XG4gICAgICAgIHRoaXMuZG9jSGFzaCA9IHt9O1xuICAgICAgICB0aGlzLnJlZkNvdW50ZXIgPSBuZXcgRG9jdW1lbnRSZWZDb3VudGVyKHtcbiAgICAgICAgICAgIG9uQ2hhbmdlOiAoY29sbGVjdGlvbk5hbWUsIGRvY0lkLCByZWZDb3VudCkgPT4ge1xuICAgICAgICAgICAgICAgIGRlYnVnTG9nKCdTdWJzY3JpcHRpb24ucmVmQ291bnRlci5vbkNoYW5nZScsIGAke2NvbGxlY3Rpb25OYW1lfToke2RvY0lkLnZhbHVlT2YoKX0gJHtyZWZDb3VudH1gKTtcbiAgICAgICAgICAgICAgICBpZiAocmVmQ291bnQgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICBtZXRlb3JTdWIucmVtb3ZlZChjb2xsZWN0aW9uTmFtZSwgZG9jSWQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVEb2NIYXNoKGNvbGxlY3Rpb25OYW1lLCBkb2NJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkZWQoY29sbGVjdGlvbk5hbWUsIGRvYykge1xuICAgICAgICB0aGlzLnJlZkNvdW50ZXIuaW5jcmVtZW50KGNvbGxlY3Rpb25OYW1lLCBkb2MuX2lkKTtcblxuICAgICAgICBpZiAodGhpcy5faGFzRG9jQ2hhbmdlZChjb2xsZWN0aW9uTmFtZSwgZG9jLl9pZCwgZG9jKSkge1xuICAgICAgICAgICAgZGVidWdMb2coJ1N1YnNjcmlwdGlvbi5hZGRlZCcsIGAke2NvbGxlY3Rpb25OYW1lfToke2RvYy5faWR9YCk7XG4gICAgICAgICAgICB0aGlzLm1ldGVvclN1Yi5hZGRlZChjb2xsZWN0aW9uTmFtZSwgZG9jLl9pZCwgZG9jKTtcbiAgICAgICAgICAgIHRoaXMuX2FkZERvY0hhc2goY29sbGVjdGlvbk5hbWUsIGRvYyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGFuZ2VkKGNvbGxlY3Rpb25OYW1lLCBpZCwgY2hhbmdlcykge1xuICAgICAgICBpZiAodGhpcy5fc2hvdWxkU2VuZENoYW5nZXMoY29sbGVjdGlvbk5hbWUsIGlkLCBjaGFuZ2VzKSkge1xuICAgICAgICAgICAgZGVidWdMb2coJ1N1YnNjcmlwdGlvbi5jaGFuZ2VkJywgYCR7Y29sbGVjdGlvbk5hbWV9OiR7aWR9YCk7XG4gICAgICAgICAgICB0aGlzLm1ldGVvclN1Yi5jaGFuZ2VkKGNvbGxlY3Rpb25OYW1lLCBpZCwgY2hhbmdlcyk7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVEb2NIYXNoKGNvbGxlY3Rpb25OYW1lLCBpZCwgY2hhbmdlcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVkKGNvbGxlY3Rpb25OYW1lLCBpZCkge1xuICAgICAgICBkZWJ1Z0xvZygnU3Vic2NyaXB0aW9uLnJlbW92ZWQnLCBgJHtjb2xsZWN0aW9uTmFtZX06JHtpZC52YWx1ZU9mKCl9YCk7XG4gICAgICAgIHRoaXMucmVmQ291bnRlci5kZWNyZW1lbnQoY29sbGVjdGlvbk5hbWUsIGlkKTtcbiAgICB9XG5cbiAgICBfYWRkRG9jSGFzaChjb2xsZWN0aW9uTmFtZSwgZG9jKSB7XG4gICAgICAgIHRoaXMuZG9jSGFzaFtidWlsZEhhc2hLZXkoY29sbGVjdGlvbk5hbWUsIGRvYy5faWQpXSA9IGRvYztcbiAgICB9XG5cbiAgICBfdXBkYXRlRG9jSGFzaChjb2xsZWN0aW9uTmFtZSwgaWQsIGNoYW5nZXMpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gYnVpbGRIYXNoS2V5KGNvbGxlY3Rpb25OYW1lLCBpZCk7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nRG9jID0gdGhpcy5kb2NIYXNoW2tleV0gfHwge307XG4gICAgICAgIHRoaXMuZG9jSGFzaFtrZXldID0gXy5leHRlbmQoZXhpc3RpbmdEb2MsIGNoYW5nZXMpO1xuICAgIH1cblxuICAgIF9zaG91bGRTZW5kQ2hhbmdlcyhjb2xsZWN0aW9uTmFtZSwgaWQsIGNoYW5nZXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzRG9jUHVibGlzaGVkKGNvbGxlY3Rpb25OYW1lLCBpZCkgJiZcbiAgICAgICAgICAgIHRoaXMuX2hhc0RvY0NoYW5nZWQoY29sbGVjdGlvbk5hbWUsIGlkLCBjaGFuZ2VzKTtcbiAgICB9XG5cbiAgICBfaXNEb2NQdWJsaXNoZWQoY29sbGVjdGlvbk5hbWUsIGlkKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGJ1aWxkSGFzaEtleShjb2xsZWN0aW9uTmFtZSwgaWQpO1xuICAgICAgICByZXR1cm4gISF0aGlzLmRvY0hhc2hba2V5XTtcbiAgICB9XG5cbiAgICBfaGFzRG9jQ2hhbmdlZChjb2xsZWN0aW9uTmFtZSwgaWQsIGRvYykge1xuICAgICAgICBjb25zdCBleGlzdGluZ0RvYyA9IHRoaXMuZG9jSGFzaFtidWlsZEhhc2hLZXkoY29sbGVjdGlvbk5hbWUsIGlkKV07XG5cbiAgICAgICAgaWYgKCFleGlzdGluZ0RvYykgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gICAgICAgIHJldHVybiBfLmFueShfLmtleXMoZG9jKSwga2V5ID0+ICFfLmlzRXF1YWwoZG9jW2tleV0sIGV4aXN0aW5nRG9jW2tleV0pKTtcbiAgICB9XG5cbiAgICBfcmVtb3ZlRG9jSGFzaChjb2xsZWN0aW9uTmFtZSwgaWQpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gYnVpbGRIYXNoS2V5KGNvbGxlY3Rpb25OYW1lLCBpZCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmRvY0hhc2hba2V5XTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkSGFzaEtleShjb2xsZWN0aW9uTmFtZSwgaWQpIHtcbiAgICByZXR1cm4gYCR7Y29sbGVjdGlvbk5hbWV9Ojoke2lkLnZhbHVlT2YoKX1gO1xufVxuXG5leHBvcnQgZGVmYXVsdCBTdWJzY3JpcHRpb247XG4iLCJjbGFzcyBQdWJsaXNoZWREb2N1bWVudCB7XG4gICAgY29uc3RydWN0b3IoY29sbGVjdGlvbk5hbWUsIGRvY0lkKSB7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbk5hbWUgPSBjb2xsZWN0aW9uTmFtZTtcbiAgICAgICAgdGhpcy5kb2NJZCA9IGRvY0lkO1xuICAgICAgICB0aGlzLmNoaWxkUHVibGljYXRpb25zID0gW107XG4gICAgICAgIHRoaXMuX2lzRmxhZ2dlZEZvclJlbW92YWwgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBhZGRDaGlsZFB1YihjaGlsZFB1YmxpY2F0aW9uKSB7XG4gICAgICAgIHRoaXMuY2hpbGRQdWJsaWNhdGlvbnMucHVzaChjaGlsZFB1YmxpY2F0aW9uKTtcbiAgICB9XG5cbiAgICBlYWNoQ2hpbGRQdWIoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5jaGlsZFB1YmxpY2F0aW9ucy5mb3JFYWNoKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBpc0ZsYWdnZWRGb3JSZW1vdmFsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNGbGFnZ2VkRm9yUmVtb3ZhbDtcbiAgICB9XG5cbiAgICB1bmZsYWdGb3JSZW1vdmFsKCkge1xuICAgICAgICB0aGlzLl9pc0ZsYWdnZWRGb3JSZW1vdmFsID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZmxhZ0ZvclJlbW92YWwoKSB7XG4gICAgICAgIHRoaXMuX2lzRmxhZ2dlZEZvclJlbW92YWwgPSB0cnVlO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHVibGlzaGVkRG9jdW1lbnQ7XG4iLCJpbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuXG5pbXBvcnQgUHVibGlzaGVkRG9jdW1lbnQgZnJvbSAnLi9wdWJsaXNoZWRfZG9jdW1lbnQnO1xuXG5cbmNsYXNzIFB1Ymxpc2hlZERvY3VtZW50TGlzdCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZG9jdW1lbnRzID0ge307XG4gICAgfVxuXG4gICAgYWRkKGNvbGxlY3Rpb25OYW1lLCBkb2NJZCkge1xuICAgICAgICBjb25zdCBrZXkgPSB2YWx1ZU9mSWQoZG9jSWQpO1xuXG4gICAgICAgIGlmICghdGhpcy5kb2N1bWVudHNba2V5XSkge1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudHNba2V5XSA9IG5ldyBQdWJsaXNoZWREb2N1bWVudChjb2xsZWN0aW9uTmFtZSwgZG9jSWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkQ2hpbGRQdWIoZG9jSWQsIHB1YmxpY2F0aW9uKSB7XG4gICAgICAgIGlmICghcHVibGljYXRpb24pIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgY29uc3Qga2V5ID0gdmFsdWVPZklkKGRvY0lkKTtcbiAgICAgICAgY29uc3QgZG9jID0gdGhpcy5kb2N1bWVudHNba2V5XTtcblxuICAgICAgICBpZiAodHlwZW9mIGRvYyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRG9jIG5vdCBmb3VuZCBpbiBsaXN0OiAke2tleX1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZG9jdW1lbnRzW2tleV0uYWRkQ2hpbGRQdWIocHVibGljYXRpb24pO1xuICAgIH1cblxuICAgIGdldChkb2NJZCkge1xuICAgICAgICBjb25zdCBrZXkgPSB2YWx1ZU9mSWQoZG9jSWQpO1xuICAgICAgICByZXR1cm4gdGhpcy5kb2N1bWVudHNba2V5XTtcbiAgICB9XG5cbiAgICByZW1vdmUoZG9jSWQpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdmFsdWVPZklkKGRvY0lkKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuZG9jdW1lbnRzW2tleV07XG4gICAgfVxuXG4gICAgaGFzKGRvY0lkKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuZ2V0KGRvY0lkKTtcbiAgICB9XG5cbiAgICBlYWNoRG9jdW1lbnQoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgXy5lYWNoKHRoaXMuZG9jdW1lbnRzLCBmdW5jdGlvbiBleGVjQ2FsbGJhY2tPbkRvYyhkb2MpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgZG9jKTtcbiAgICAgICAgfSwgY29udGV4dCB8fCB0aGlzKTtcbiAgICB9XG5cbiAgICBlYWNoQ2hpbGRQdWIoZG9jSWQsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IGRvYyA9IHRoaXMuZ2V0KGRvY0lkKTtcblxuICAgICAgICBpZiAoZG9jKSB7XG4gICAgICAgICAgICBkb2MuZWFjaENoaWxkUHViKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldElkcygpIHtcbiAgICAgICAgY29uc3QgZG9jSWRzID0gW107XG5cbiAgICAgICAgdGhpcy5lYWNoRG9jdW1lbnQoKGRvYykgPT4ge1xuICAgICAgICAgICAgZG9jSWRzLnB1c2goZG9jLmRvY0lkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGRvY0lkcztcbiAgICB9XG5cbiAgICB1bmZsYWdGb3JSZW1vdmFsKGRvY0lkKSB7XG4gICAgICAgIGNvbnN0IGRvYyA9IHRoaXMuZ2V0KGRvY0lkKTtcblxuICAgICAgICBpZiAoZG9jKSB7XG4gICAgICAgICAgICBkb2MudW5mbGFnRm9yUmVtb3ZhbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmxhZ0FsbEZvclJlbW92YWwoKSB7XG4gICAgICAgIHRoaXMuZWFjaERvY3VtZW50KChkb2MpID0+IHtcbiAgICAgICAgICAgIGRvYy5mbGFnRm9yUmVtb3ZhbCgpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHZhbHVlT2ZJZChkb2NJZCkge1xuICAgIGlmIChkb2NJZCA9PT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RvY3VtZW50IElEIGlzIG51bGwnKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBkb2NJZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEb2N1bWVudCBJRCBpcyB1bmRlZmluZWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIGRvY0lkLnZhbHVlT2YoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUHVibGlzaGVkRG9jdW1lbnRMaXN0O1xuIl19
