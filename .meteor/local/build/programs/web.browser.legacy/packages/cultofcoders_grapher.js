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
var Promise = Package.promise.Promise;
var check = Package.check.check;
var Match = Package.check.Match;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Mongo = Package.mongo.Mongo;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Symbol = Package['ecmascript-runtime-client'].Symbol;
var Map = Package['ecmascript-runtime-client'].Map;
var Set = Package['ecmascript-runtime-client'].Set;

/* Package-scope variables */
var body, dotize;

var require = meteorInstall({"node_modules":{"meteor":{"cultofcoders:grapher":{"main.client.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/main.client.js                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.link("./lib/extension.js");
module.link("./lib/links/extension.js");
module.link("./lib/query/reducers/extension.js");
module.link("./lib/createQuery.js", {
  "default": "createQuery"
}, 0);
module.link("./lib/query/lib/prepareForProcess", {
  "default": "prepareForProcess"
}, 1);
module.link("./lib/query/query.client", {
  "default": "Query"
}, 2);
module.link("./lib/namedQuery/namedQuery.client", {
  "default": "NamedQuery"
}, 3);
module.link("./lib/compose", {
  "default": "compose"
}, 4);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"compose.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/compose.js                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var deepExtend;
module.link("deep-extend", {
  "default": function (v) {
    deepExtend = v;
  }
}, 0);
module.exportDefault(function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return deepExtend.apply(void 0, [{}].concat(args));
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"createQuery.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/createQuery.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Query;
module.link("./query/query.js", {
  "default": function (v) {
    Query = v;
  }
}, 0);
var NamedQuery;
module.link("./namedQuery/namedQuery.js", {
  "default": function (v) {
    NamedQuery = v;
  }
}, 1);
var NamedQueryStore;
module.link("./namedQuery/store.js", {
  "default": function (v) {
    NamedQueryStore = v;
  }
}, 2);
module.exportDefault(function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (typeof args[0] === 'string') {
    var name = args[0],
        body = args[1],
        options = args[2];
    options = options || {}; // It's a resolver query

    if (_.isFunction(body)) {
      return createNamedQuery(name, null, body, options);
    }

    var entryPointName = _.first(_.keys(body));

    var collection = Mongo.Collection.get(entryPointName);

    if (!collection) {
      throw new Meteor.Error('invalid-name', "We could not find any collection with the name \"" + entryPointName + "\". Make sure it is imported prior to using this");
    }

    return createNamedQuery(name, collection, body[entryPointName], options);
  } else {
    // Query Creation, it can have an endpoint as collection or as a NamedQuery
    var _body = args[0],
        _options = args[1];
    _options = _options || {};

    var _entryPointName = _.first(_.keys(_body));

    var _collection = Mongo.Collection.get(_entryPointName);

    if (!_collection) {
      if (Meteor.isDevelopment && !NamedQueryStore.get(_entryPointName)) {
        console.warn("You are creating a query with the entry point \"" + _entryPointName + "\", but there was no collection found for it (maybe you forgot to import it client-side?). It's assumed that it's referencing a NamedQuery.");
      }

      return createNamedQuery(_entryPointName, null, {}, {
        params: _body[_entryPointName]
      });
    } else {
      return createNormalQuery(_collection, _body[_entryPointName], _options);
    }
  }
});

function createNamedQuery(name, collection, body) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  // if it exists already, we re-use it
  var namedQuery = NamedQueryStore.get(name);
  var query;

  if (!namedQuery) {
    query = new NamedQuery(name, collection, body, options);
    NamedQueryStore.add(name, query);
  } else {
    query = namedQuery.clone(options.params);
  }

  return query;
}

function createNormalQuery(collection, body, options) {
  return new Query(collection, body, options);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"extension.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/extension.js                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Query;
module.link("./query/query.js", {
  "default": function (v) {
    Query = v;
  }
}, 0);
var NamedQuery;
module.link("./namedQuery/namedQuery.js", {
  "default": function (v) {
    NamedQuery = v;
  }
}, 1);
var NamedQueryStore;
module.link("./namedQuery/store.js", {
  "default": function (v) {
    NamedQueryStore = v;
  }
}, 2);

_.extend(Mongo.Collection.prototype, {
  createQuery: function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (typeof args[0] === 'string') {
      //NamedQuery
      var name = args[0],
          body = args[1],
          options = args[2];
      var query = new NamedQuery(name, this, body, options);
      NamedQueryStore.add(name, query);
      return query;
    } else {
      var _body = args[0],
          _options = args[1];
      return new Query(this, _body, _options);
    }
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"links":{"config.schema.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/config.schema.js                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  DenormalizeSchema: function () {
    return DenormalizeSchema;
  },
  LinkConfigDefaults: function () {
    return LinkConfigDefaults;
  },
  LinkConfigSchema: function () {
    return LinkConfigSchema;
  }
});
var Match;
module.link("meteor/check", {
  Match: function (v) {
    Match = v;
  }
}, 0);
var Mongo;
module.link("meteor/mongo", {
  Mongo: function (v) {
    Mongo = v;
  }
}, 1);
var DenormalizeSchema = {
  field: String,
  body: Object,
  bypassSchema: Match.Maybe(Boolean)
};
var LinkConfigDefaults = {
  type: 'one'
};
var LinkConfigSchema = {
  type: Match.Maybe(Match.OneOf('one', 'many', '1', '*')),
  collection: Match.Maybe(Match.Where(function (collection) {
    // We do like this so it works with other types of collections 
    // like FS.Collection
    return _.isObject(collection) && (collection instanceof Mongo.Collection || !!collection._collection);
  })),
  field: Match.Maybe(String),
  metadata: Match.Maybe(Boolean),
  inversedBy: Match.Maybe(String),
  index: Match.Maybe(Boolean),
  unique: Match.Maybe(Boolean),
  autoremove: Match.Maybe(Boolean),
  denormalize: Match.Maybe(Match.ObjectIncluding(DenormalizeSchema))
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"constants.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/constants.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  LINK_STORAGE: function () {
    return LINK_STORAGE;
  }
});
var LINK_STORAGE = '__links';
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"extension.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/extension.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Mongo;
module.link("meteor/mongo", {
  Mongo: function (v) {
    Mongo = v;
  }
}, 0);
var LINK_STORAGE;
module.link("./constants.js", {
  LINK_STORAGE: function (v) {
    LINK_STORAGE = v;
  }
}, 1);
var Linker;
module.link("./linker.js", {
  "default": function (v) {
    Linker = v;
  }
}, 2);
Object.assign(Mongo.Collection.prototype, {
  /**
   * The data we add should be valid for config.schema.js
   */
  addLinks: function (data) {
    var _this = this;

    if (!this[LINK_STORAGE]) {
      this[LINK_STORAGE] = {};
    }

    _.each(data, function (linkConfig, linkName) {
      var _$extend;

      if (_this[LINK_STORAGE][linkName]) {
        throw new Meteor.Error("You cannot add the link with name: " + linkName + " because it was already added to " + _this._name + " collection");
      }

      var linker = new Linker(_this, linkName, linkConfig);

      _.extend(_this[LINK_STORAGE], (_$extend = {}, _$extend[linkName] = linker, _$extend));
    });
  },
  getLinks: function () {
    return this[LINK_STORAGE];
  },
  getLinker: function (name) {
    if (this[LINK_STORAGE]) {
      return this[LINK_STORAGE][name];
    }
  },
  hasLink: function (name) {
    if (!this[LINK_STORAGE]) {
      return false;
    }

    return !!this[LINK_STORAGE][name];
  },
  getLink: function (objectOrId, name) {
    var linkData = this[LINK_STORAGE];

    if (!linkData) {
      throw new Meteor.Error("There are no links defined for collection: " + this._name);
    }

    if (!linkData[name]) {
      throw new Meteor.Error("There is no link " + name + " for collection: " + this._name);
    }

    var linker = linkData[name];
    var object = objectOrId;

    if (typeof objectOrId == 'string') {
      if (!linker.isVirtual()) {
        var _fields;

        object = this.findOne(objectOrId, {
          fields: (_fields = {}, _fields[linker.linkStorageField] = 1, _fields)
        });
      } else {
        object = {
          _id: objectOrId
        };
      }

      if (!object) {
        throw new Meteor.Error("We could not find any object with _id: \"" + objectOrId + "\" within the collection: " + this._name);
      }
    }

    return linkData[name].createLink(object);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"linker.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/linker.js                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

module.export({
  "default": function () {
    return Linker;
  }
});
var LinkMany;
module.link("./linkTypes/linkMany.js", {
  "default": function (v) {
    LinkMany = v;
  }
}, 0);
var LinkManyMeta;
module.link("./linkTypes/linkManyMeta.js", {
  "default": function (v) {
    LinkManyMeta = v;
  }
}, 1);
var LinkOne;
module.link("./linkTypes/linkOne.js", {
  "default": function (v) {
    LinkOne = v;
  }
}, 2);
var LinkOneMeta;
module.link("./linkTypes/linkOneMeta.js", {
  "default": function (v) {
    LinkOneMeta = v;
  }
}, 3);
var LinkConfigSchema, LinkConfigDefaults;
module.link("./config.schema.js", {
  LinkConfigSchema: function (v) {
    LinkConfigSchema = v;
  },
  LinkConfigDefaults: function (v) {
    LinkConfigDefaults = v;
  }
}, 4);
var smartArguments;
module.link("./linkTypes/lib/smartArguments", {
  "default": function (v) {
    smartArguments = v;
  }
}, 5);
var dot;
module.link("dot-object", {
  "default": function (v) {
    dot = v;
  }
}, 6);
var check;
module.link("meteor/check", {
  check: function (v) {
    check = v;
  }
}, 7);

var _;

module.link("meteor/underscore", {
  _: function (v) {
    _ = v;
  }
}, 8);
var access;
module.link("fs", {
  access: function (v) {
    access = v;
  }
}, 9);

var Linker =
/*#__PURE__*/
function () {
  /**
   * @param mainCollection
   * @param linkName
   * @param linkConfig
   */
  function Linker(mainCollection, linkName, linkConfig) {
    this.mainCollection = mainCollection;
    this.linkConfig = Object.assign({}, LinkConfigDefaults, linkConfig);
    this.linkName = linkName; // check linkName must not exist in schema

    this._validateAndClean(); // initialize cascade removal hooks.


    this._initAutoremove();

    this._initDenormalization();

    if (this.isVirtual()) {
      // if it's a virtual field make sure that when this is deleted, it will be removed from the references
      if (!linkConfig.autoremove) {
        this._handleReferenceRemovalForVirtualLinks();
      }
    } else {
      this._initIndex();
    }
  }
  /**
   * Values which represent for the relation a single link
   * @returns {string[]}
   */


  var _proto = Linker.prototype;

  /**
   * The collection that is linked with the current collection
   * @returns Mongo.Collection
   */
  _proto.getLinkedCollection = function () {
    function getLinkedCollection() {
      return this.linkConfig.collection;
    }

    return getLinkedCollection;
  }()
  /**
   * If the relationship for this link is of "many" type.
   */
  ;

  _proto.isMany = function () {
    function isMany() {
      return !this.isSingle();
    }

    return isMany;
  }()
  /**
   * If the relationship for this link contains metadata
   */
  ;

  _proto.isMeta = function () {
    function isMeta() {
      if (this.isVirtual()) {
        return this.linkConfig.relatedLinker.isMeta();
      }

      return !!this.linkConfig.metadata;
    }

    return isMeta;
  }()
  /**
   * @returns {boolean}
   */
  ;

  _proto.isSingle = function () {
    function isSingle() {
      if (this.isVirtual()) {
        return this.linkConfig.relatedLinker.isSingle();
      }

      return _.contains(this.oneTypes, this.linkConfig.type);
    }

    return isSingle;
  }()
  /**
   * @returns {boolean}
   */
  ;

  _proto.isVirtual = function () {
    function isVirtual() {
      return !!this.linkConfig.inversedBy;
    }

    return isVirtual;
  }()
  /**
   * Should return a single result.
   */
  ;

  _proto.isOneResult = function () {
    function isOneResult() {
      return this.isVirtual() && this.linkConfig.relatedLinker.linkConfig.unique || !this.isVirtual() && this.isSingle();
    }

    return isOneResult;
  }()
  /**
   * @param object
   * @param collection To impersonate the getLinkedCollection() of the "Linker"
   *
   * @returns {LinkOne|LinkMany|LinkManyMeta|LinkOneMeta|LinkResolve}
   */
  ;

  _proto.createLink = function () {
    function createLink(object) {
      var collection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var helperClass = this._getHelperClass();

      return new helperClass(this, object, collection);
    }

    return createLink;
  }()
  /**
   * @returns {*}
   * @private
   */
  ;

  _proto._validateAndClean = function () {
    function _validateAndClean() {
      if (!this.linkConfig.collection) {
        throw new Meteor.Error('invalid-config', "For the link " + this.linkName + " you did not provide a collection.");
      }

      if (typeof this.linkConfig.collection === 'string') {
        var collectionName = this.linkConfig.collection;
        this.linkConfig.collection = Mongo.Collection.get(collectionName);

        if (!this.linkConfig.collection) {
          throw new Meteor.Error('invalid-collection', "Could not find a collection with the name: " + collectionName);
        }
      }

      if (this.isVirtual()) {
        return this._prepareVirtual();
      } else {
        if (!this.linkConfig.type) {
          this.linkConfig.type = 'one';
        }

        if (!this.linkConfig.field) {
          this.linkConfig.field = this._generateFieldName();
        } else {
          if (this.linkConfig.field == this.linkName) {
            throw new Meteor.Error('invalid-config', "For the link " + this.linkName + " you must not use the same name for the field, otherwise it will cause conflicts when fetching data");
          }
        }
      }

      check(this.linkConfig, LinkConfigSchema);
    }

    return _validateAndClean;
  }()
  /**
   * We need to apply same type of rules in this case.
   * @private
   */
  ;

  _proto._prepareVirtual = function () {
    function _prepareVirtual() {
      var _this = this;

      var _this$linkConfig = this.linkConfig,
          collection = _this$linkConfig.collection,
          inversedBy = _this$linkConfig.inversedBy;
      var linker = collection.getLinker(inversedBy);

      if (!linker) {
        // it is possible that the collection doesn't have a linker created yet.
        // so we will create it on startup after all links have been defined
        Meteor.startup(function () {
          linker = collection.getLinker(inversedBy);

          if (!linker) {
            throw new Meteor.Error("You tried setting up an inversed link in \"" + _this.mainCollection._name + "\" pointing to collection: \"" + collection._name + "\" link: \"" + inversedBy + "\", but no such link was found. Maybe a typo ?");
          } else {
            _this._setupVirtualConfig(linker);
          }
        });
      } else {
        this._setupVirtualConfig(linker);
      }
    }

    return _prepareVirtual;
  }()
  /**
   * @param linker
   * @private
   */
  ;

  _proto._setupVirtualConfig = function () {
    function _setupVirtualConfig(linker) {
      var virtualLinkConfig = linker.linkConfig;

      if (!virtualLinkConfig) {
        throw new Meteor.Error("There is no link-config for the related collection on " + inversedBy + ". Make sure you added the direct links before specifying virtual ones.");
      }

      _.extend(this.linkConfig, {
        metadata: virtualLinkConfig.metadata,
        relatedLinker: linker
      });
    }

    return _setupVirtualConfig;
  }()
  /**
   * Depending on the strategy, we create the proper helper class
   * @private
   */
  ;

  _proto._getHelperClass = function () {
    function _getHelperClass() {
      switch (this.strategy) {
        case 'many-meta':
          return LinkManyMeta;

        case 'many':
          return LinkMany;

        case 'one-meta':
          return LinkOneMeta;

        case 'one':
          return LinkOne;
      }

      throw new Meteor.Error('invalid-strategy', this.strategy + " is not a valid strategy");
    }

    return _getHelperClass;
  }()
  /**
   * If field name not present, we generate it.
   * @private
   */
  ;

  _proto._generateFieldName = function () {
    function _generateFieldName() {
      var cleanedCollectionName = this.linkConfig.collection._name.replace(/\./g, '_');

      var defaultFieldPrefix = this.linkName + '_' + cleanedCollectionName;

      switch (this.strategy) {
        case 'many-meta':
          return defaultFieldPrefix + "_metas";

        case 'many':
          return defaultFieldPrefix + "_ids";

        case 'one-meta':
          return defaultFieldPrefix + "_meta";

        case 'one':
          return defaultFieldPrefix + "_id";
      }
    }

    return _generateFieldName;
  }()
  /**
   * When a link that is declared virtual is removed, the reference will be removed from every other link.
   * @private
   */
  ;

  _proto._handleReferenceRemovalForVirtualLinks = function () {
    function _handleReferenceRemovalForVirtualLinks() {
      var _this2 = this;

      this.mainCollection.after.remove(function (userId, doc) {
        // this problem may occur when you do a .remove() before Meteor.startup()
        if (!_this2.linkConfig.relatedLinker) {
          console.warn("There was an error finding the link for removal for collection: \"" + _this2.mainCollection._name + "\" with link: \"" + _this2.linkName + "\". This may occur when you do a .remove() before Meteor.startup()");
          return;
        }

        var accessor = _this2.createLink(doc);

        _.each(accessor.fetchAsArray(), function (linkedObj) {
          var relatedLinker = _this2.linkConfig.relatedLinker; // We do this check, to avoid self-referencing hell when defining virtual links
          // Virtual links if not found "compile-time", we will try again to reprocess them on Meteor.startup
          // if a removal happens before Meteor.startup this may fail

          if (relatedLinker) {
            var link = relatedLinker.createLink(linkedObj);

            if (relatedLinker.isSingle()) {
              link.unset();
            } else {
              link.remove(doc);
            }
          }
        });
      });
    }

    return _handleReferenceRemovalForVirtualLinks;
  }();

  _proto._initIndex = function () {
    function _initIndex() {
      if (Meteor.isServer) {
        var field = this.linkConfig.field;

        if (this.linkConfig.metadata) {
          field = field + '._id';
        }

        if (this.linkConfig.index) {
          var _this$mainCollection$;

          if (this.isVirtual()) {
            throw new Meteor.Error('You cannot set index on an inversed link.');
          }

          var options;

          if (this.linkConfig.unique) {
            options = {
              unique: true
            };
          }

          this.mainCollection._ensureIndex((_this$mainCollection$ = {}, _this$mainCollection$[field] = 1, _this$mainCollection$), options);
        } else {
          if (this.linkConfig.unique) {
            var _this$mainCollection$2;

            if (this.isVirtual()) {
              throw new Meteor.Error('You cannot set unique property on an inversed link.');
            }

            this.mainCollection._ensureIndex((_this$mainCollection$2 = {}, _this$mainCollection$2[field] = 1, _this$mainCollection$2), {
              unique: true,
              sparse: true
            });
          }
        }
      }
    }

    return _initIndex;
  }();

  _proto._initAutoremove = function () {
    function _initAutoremove() {
      var _this3 = this;

      if (!this.linkConfig.autoremove) {
        return;
      }

      if (!this.isVirtual()) {
        this.mainCollection.after.remove(function (userId, doc) {
          _this3.getLinkedCollection().remove({
            _id: {
              $in: smartArguments.getIds(doc[_this3.linkStorageField])
            }
          });
        });
      } else {
        this.mainCollection.after.remove(function (userId, doc) {
          var linker = _this3.mainCollection.getLink(doc, _this3.linkName);

          var ids = linker.find({}, {
            fields: {
              _id: 1
            }
          }).fetch().map(function (item) {
            return item._id;
          });

          _this3.getLinkedCollection().remove({
            _id: {
              $in: ids
            }
          });
        });
      }
    }

    return _initAutoremove;
  }()
  /**
   * Initializes denormalization using herteby:denormalize
   * @private
   */
  ;

  _proto._initDenormalization = function () {
    function _initDenormalization() {
      var _this4 = this;

      if (!this.linkConfig.denormalize || !Meteor.isServer) {
        return;
      }

      var packageExists = !!Package['herteby:denormalize'];

      if (!packageExists) {
        throw new Meteor.Error('missing-package', "Please add the herteby:denormalize package to your Meteor application in order to make caching work");
      }

      var _this$linkConfig$deno = this.linkConfig.denormalize,
          field = _this$linkConfig$deno.field,
          body = _this$linkConfig$deno.body,
          bypassSchema = _this$linkConfig$deno.bypassSchema;
      var cacheConfig;
      var referenceFieldSuffix = '';

      if (this.isMeta()) {
        referenceFieldSuffix = this.isSingle() ? '._id' : ':_id';
      }

      if (this.isVirtual()) {
        var inversedLink = this.linkConfig.relatedLinker.linkConfig;
        var type = inversedLink.type == 'many' ? 'many-inverse' : 'inversed';
        cacheConfig = {
          type: type,
          collection: this.linkConfig.collection,
          fields: body,
          referenceField: inversedLink.field + referenceFieldSuffix,
          cacheField: field,
          bypassSchema: !!bypassSchema
        };
      } else {
        cacheConfig = {
          type: this.linkConfig.type,
          collection: this.linkConfig.collection,
          fields: body,
          referenceField: this.linkConfig.field + referenceFieldSuffix,
          cacheField: field,
          bypassSchema: !!bypassSchema
        };
      }

      if (this.isVirtual()) {
        Meteor.startup(function () {
          _this4.mainCollection.cache(cacheConfig);
        });
      } else {
        this.mainCollection.cache(cacheConfig);
      }
    }

    return _initDenormalization;
  }()
  /**
   * Verifies if this linker is denormalized. It can be denormalized from the inverse side as well.
   *
   * @returns {boolean}
   * @private
   */
  ;

  _proto.isDenormalized = function () {
    function isDenormalized() {
      return !!this.linkConfig.denormalize;
    }

    return isDenormalized;
  }()
  /**
   * Verifies if the body of the linked element does not contain fields outside the cache body
   *
   * @param body
   * @returns {boolean}
   * @private
   */
  ;

  _proto.isSubBodyDenormalized = function () {
    function isSubBodyDenormalized(body) {
      var cacheBody = this.linkConfig.denormalize.body;

      var cacheBodyFields = _.keys(dot.dot(cacheBody));

      var bodyFields = _.keys(dot.dot(_.omit(body, '_id')));

      return _.difference(bodyFields, cacheBodyFields).length === 0;
    }

    return isSubBodyDenormalized;
  }();

  (0, _createClass2.default)(Linker, [{
    key: "oneTypes",
    get: function () {
      return ['one', '1'];
    }
    /**
     * Returns the strategies: one, many, one-meta, many-meta
     * @returns {string}
     */

  }, {
    key: "strategy",
    get: function () {
      var strategy = this.isMany() ? 'many' : 'one';

      if (this.linkConfig.metadata) {
        strategy += '-meta';
      }

      return strategy;
    }
    /**
     * Returns the field name in the document where the actual relationships are stored.
     * @returns string
     */

  }, {
    key: "linkStorageField",
    get: function () {
      if (this.isVirtual()) {
        return this.linkConfig.relatedLinker.linkStorageField;
      }

      return this.linkConfig.field;
    }
  }]);
  return Linker;
}();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"createSearchFilters.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/lib/createSearchFilters.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  "default": function () {
    return createSearchFilters;
  },
  createOne: function () {
    return createOne;
  },
  createOneVirtual: function () {
    return createOneVirtual;
  },
  createOneMeta: function () {
    return createOneMeta;
  },
  createOneMetaVirtual: function () {
    return createOneMetaVirtual;
  },
  createMany: function () {
    return createMany;
  },
  createManyVirtual: function () {
    return createManyVirtual;
  },
  createManyMeta: function () {
    return createManyMeta;
  },
  createManyMetaVirtual: function () {
    return createManyMetaVirtual;
  }
});
var sift;
module.link("sift", {
  "default": function (v) {
    sift = v;
  }
}, 0);

function createSearchFilters(object, fieldStorage, strategy, isVirtual, metaFilters) {
  if (!isVirtual) {
    switch (strategy) {
      case 'one':
        return createOne(object, fieldStorage);

      case 'one-meta':
        return createOneMeta(object, fieldStorage, metaFilters);

      case 'many':
        return createMany(object, fieldStorage);

      case 'many-meta':
        return createManyMeta(object, fieldStorage, metaFilters);

      default:
        throw new Meteor.Error("Invalid linking strategy: " + strategy);
    }
  } else {
    switch (strategy) {
      case 'one':
        return createOneVirtual(object, fieldStorage);

      case 'one-meta':
        return createOneMetaVirtual(object, fieldStorage, metaFilters);

      case 'many':
        return createManyVirtual(object, fieldStorage);

      case 'many-meta':
        return createManyMetaVirtual(object, fieldStorage, metaFilters);

      default:
        throw new Meteor.Error("Invalid linking strategy: " + strategy);
    }
  }
}

function createOne(object, fieldStorage) {
  return {
    _id: object[fieldStorage]
  };
}

function createOneVirtual(object, fieldStorage) {
  var _ref;

  return _ref = {}, _ref[fieldStorage] = object._id, _ref;
}

function createOneMeta(object, fieldStorage, metaFilters) {
  var value = object[fieldStorage];

  if (metaFilters) {
    if (!sift(metaFilters)(value)) {
      return {
        _id: undefined
      };
    }
  }

  return {
    _id: value ? value._id : value
  };
}

function createOneMetaVirtual(object, fieldStorage, metaFilters) {
  var filters = {};

  if (metaFilters) {
    _.each(metaFilters, function (value, key) {
      filters[fieldStorage + '.' + key] = value;
    });
  }

  filters[fieldStorage + '._id'] = object._id;
  return filters;
}

function createMany(object, fieldStorage) {
  return {
    _id: {
      $in: object[fieldStorage] || []
    }
  };
}

function createManyVirtual(object, fieldStorage) {
  var _ref2;

  return _ref2 = {}, _ref2[fieldStorage] = object._id, _ref2;
}

function createManyMeta(object, fieldStorage, metaFilters) {
  var value = object[fieldStorage];

  if (metaFilters) {
    value = sift(metaFilters, value);
  }

  return {
    _id: {
      $in: _.pluck(value, '_id') || []
    }
  };
}

function createManyMetaVirtual(object, fieldStorage, metaFilters) {
  var _ref3;

  var filters = {};

  if (metaFilters) {
    _.each(metaFilters, function (value, key) {
      filters[key] = value;
    });
  }

  filters._id = object._id;
  return _ref3 = {}, _ref3[fieldStorage] = {
    $elemMatch: filters
  }, _ref3;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"linkTypes":{"base.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/linkTypes/base.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

module.export({
  "default": function () {
    return Link;
  }
});
var SmartArgs;
module.link("./lib/smartArguments.js", {
  "default": function (v) {
    SmartArgs = v;
  }
}, 0);
var createSearchFilters;
module.link("../lib/createSearchFilters", {
  "default": function (v) {
    createSearchFilters = v;
  }
}, 1);

var Link =
/*#__PURE__*/
function () {
  (0, _createClass2.default)(Link, [{
    key: "config",
    get: function () {
      return this.linker.linkConfig;
    }
  }, {
    key: "isVirtual",
    get: function () {
      return this.linker.isVirtual();
    }
  }]);

  function Link(linker, object, collection) {
    this.linker = linker;
    this.object = object;
    this.linkedCollection = collection ? collection : linker.getLinkedCollection();

    if (this.linker.isVirtual()) {
      this.linkStorageField = this.config.relatedLinker.linkConfig.field;
    } else {
      this.linkStorageField = this.config.field;
    }
  }
  /**
   * Gets the stored link information value
   * @returns {*}
   */


  var _proto = Link.prototype;

  _proto.value = function () {
    function value() {
      if (this.isVirtual) {
        throw new Meteor.Error('You can only take the value from the main link.');
      }

      return this.object[this.linkStorageField];
    }

    return value;
  }()
  /**
   * Finds linked data.
   *
   * @param filters
   * @param options
   * @returns {*}
   * @param userId
   */
  ;

  _proto.find = function () {
    function find() {
      var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var userId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      var linker = this.linker;
      var linkedCollection = this.linkedCollection;
      var $metaFilters;

      if (filters.$meta) {
        $metaFilters = filters.$meta;
        delete filters.$meta;
      }

      var searchFilters = createSearchFilters(this.object, this.linkStorageField, linker.strategy, linker.isVirtual(), $metaFilters);

      var appliedFilters = _.extend({}, filters, searchFilters); // see https://github.com/cult-of-coders/grapher/issues/134
      // happens due to recursive importing of modules
      // TODO: find another way to do this


      if (linkedCollection.find) {
        return linkedCollection.find(appliedFilters, options, userId);
      } else {
        return linkedCollection.default.find(appliedFilters, options, userId);
      }
    }

    return find;
  }()
  /**
   * @param filters
   * @param options
   * @param others
   * @returns {*|{content}|any}
   */
  ;

  _proto.fetch = function () {
    function fetch(filters, options) {
      for (var _len = arguments.length, others = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        others[_key - 2] = arguments[_key];
      }

      var result = this.find.apply(this, [filters, options].concat(others)).fetch();

      if (this.linker.isOneResult()) {
        return _.first(result);
      }

      return result;
    }

    return fetch;
  }()
  /**
   * This is just like fetch() but forces to get an array even if it's single result
   * 
   * @param {*} filters 
   * @param {*} options 
   * @param  {...any} others 
   */
  ;

  _proto.fetchAsArray = function () {
    function fetchAsArray(filters, options) {
      for (var _len2 = arguments.length, others = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        others[_key2 - 2] = arguments[_key2];
      }

      return this.find.apply(this, [filters, options].concat(others)).fetch();
    }

    return fetchAsArray;
  }()
  /**
   * When we are dealing with multiple type relationships, $in would require an array. If the field value is null, it will fail
   * We use clean to make it an empty array by default.
   */
  ;

  _proto.clean = function () {
    function clean() {}

    return clean;
  }()
  /**
   * Extracts a single id
   */
  ;

  _proto.identifyId = function () {
    function identifyId(what, saveToDatabase) {
      return SmartArgs.getId(what, {
        saveToDatabase: saveToDatabase,
        collection: this.linkedCollection
      });
    }

    return identifyId;
  }()
  /**
   * Extracts the ids of object(s) or strings and returns an array.
   */
  ;

  _proto.identifyIds = function () {
    function identifyIds(what, saveToDatabase) {
      return SmartArgs.getIds(what, {
        saveToDatabase: saveToDatabase,
        collection: this.linkedCollection
      });
    }

    return identifyIds;
  }()
  /**
   * Checks when linking data, if the ids are valid with the linked collection.
   * @throws Meteor.Error
   * @param ids
   *
   * @protected
   */
  ;

  _proto._validateIds = function () {
    function _validateIds(ids) {
      if (!_.isArray(ids)) {
        ids = [ids];
      }

      var validIds = this.linkedCollection.find({
        _id: {
          $in: ids
        }
      }, {
        fields: {
          _id: 1
        }
      }).fetch().map(function (doc) {
        return doc._id;
      });

      if (validIds.length != ids.length) {
        throw new Meteor.Error('not-found', "You tried to create links with non-existing id(s) inside \"" + this.linkedCollection._name + "\": " + _.difference(ids, validIds).join(', '));
      }
    }

    return _validateIds;
  }()
  /**
   * This is for allowing commands such as set/unset/add/remove/metadata from the virtual link.
   *
   * @param action
   * @param what
   * @param metadata
   *
   * @protected
   */
  ;

  _proto._virtualAction = function () {
    function _virtualAction(action, what, metadata) {
      var _this = this;

      var linker = this.linker.linkConfig.relatedLinker; // its an unset operation most likely.

      if (what === undefined) {
        var reversedLink = linker.createLink(this.fetch());
        reversedLink.unset();
        return;
      }

      if (!_.isArray(what)) {
        what = [what];
      }

      what = _.map(what, function (element) {
        if (!_.isObject(element)) {
          return linker.mainCollection.findOne(element);
        } else {
          if (!element._id) {
            var elementId = linker.mainCollection.insert(element);

            _.extend(element, linker.mainCollection.findOne(elementId));
          }

          return element;
        }
      });
      return _.map(what, function (element) {
        var reversedLink = linker.createLink(element);

        if (action == 'metadata') {
          if (linker.isSingle()) {
            return reversedLink.metadata(metadata);
          } else {
            return reversedLink.metadata(_this.object, metadata);
          }
        } else if (action == 'add' || action == 'set') {
          if (linker.isSingle()) {
            reversedLink.set(_this.object, metadata);
          } else {
            reversedLink.add(_this.object, metadata);
          }
        } else {
          if (linker.isSingle()) {
            reversedLink.unset();
          } else {
            reversedLink.remove(_this.object);
          }
        }
      });
    }

    return _virtualAction;
  }();

  return Link;
}();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"linkMany.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/linkTypes/linkMany.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  "default": function () {
    return LinkMany;
  }
});
var Link;
module.link("./base.js", {
  "default": function (v) {
    Link = v;
  }
}, 0);
var SmartArgs;
module.link("./lib/smartArguments.js", {
  "default": function (v) {
    SmartArgs = v;
  }
}, 1);

var LinkMany =
/*#__PURE__*/
function (_Link) {
  (0, _inheritsLoose2.default)(LinkMany, _Link);

  function LinkMany() {
    return _Link.apply(this, arguments) || this;
  }

  var _proto = LinkMany.prototype;

  _proto.clean = function () {
    function clean() {
      if (!this.object[this.linkStorageField]) {
        this.object[this.linkStorageField] = [];
      }
    }

    return clean;
  }()
  /**
   * Ads the _ids to the object.
   * @param what
   */
  ;

  _proto.add = function () {
    function add(what) {
      var _$addToSet;

      if (this.isVirtual) {
        this._virtualAction('add', what);

        return this;
      } //if (this.isVirtual) throw new Meteor.Error('not-allowed', 'Add/remove operations must be done from the owning-link of the relationship');


      this.clean();

      var _ids = this.identifyIds(what, true);

      this._validateIds(_ids);

      var field = this.linkStorageField; // update the field

      this.object[field] = _.union(this.object[field], _ids); // update the db

      var modifier = {
        $addToSet: (_$addToSet = {}, _$addToSet[field] = {
          $each: _ids
        }, _$addToSet)
      };
      this.linker.mainCollection.update(this.object._id, modifier);
      return this;
    }

    return add;
  }()
  /**
   * @param what
   */
  ;

  _proto.remove = function () {
    function remove(what) {
      var _$pullAll;

      if (this.isVirtual) {
        this._virtualAction('remove', what);

        return this;
      }

      if (this.isVirtual) throw new Meteor.Error('not-allowed', 'Add/Remove operations should be done from the owner of the relationship');
      this.clean();
      var field = this.linkStorageField;

      var _ids = this.identifyIds(what); // update the field


      this.object[field] = _.filter(this.object[field], function (_id) {
        return !_.contains(_ids, _id);
      }); // update the db

      var modifier = {
        $pullAll: (_$pullAll = {}, _$pullAll[field] = _ids, _$pullAll)
      };
      this.linker.mainCollection.update(this.object._id, modifier);
      return this;
    }

    return remove;
  }();

  _proto.set = function () {
    function set(what) {
      if (this.isVirtual) {
        this._virtualAction('set', what);

        return this;
      }

      throw new Meteor.Error('invalid-command', 'You are trying to *set* in a relationship that is single. Please use add/remove for *many* relationships');
    }

    return set;
  }();

  _proto.unset = function () {
    function unset(what) {
      if (this.isVirtual) {
        this._virtualAction('unset', what);

        return this;
      }

      throw new Meteor.Error('invalid-command', 'You are trying to *unset* in a relationship that is single. Please use add/remove for *many* relationships');
    }

    return unset;
  }();

  return LinkMany;
}(Link);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"linkManyMeta.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/linkTypes/linkManyMeta.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  "default": function () {
    return LinkManyMeta;
  }
});
var Link;
module.link("./base.js", {
  "default": function (v) {
    Link = v;
  }
}, 0);
var SmartArgs;
module.link("./lib/smartArguments.js", {
  "default": function (v) {
    SmartArgs = v;
  }
}, 1);

var LinkManyMeta =
/*#__PURE__*/
function (_Link) {
  (0, _inheritsLoose2.default)(LinkManyMeta, _Link);

  function LinkManyMeta() {
    return _Link.apply(this, arguments) || this;
  }

  var _proto = LinkManyMeta.prototype;

  _proto.clean = function () {
    function clean() {
      if (!this.object[this.linkStorageField]) {
        this.object[this.linkStorageField] = [];
      }
    }

    return clean;
  }()
  /**
   * @param what
   * @param metadata
   */
  ;

  _proto.add = function () {
    function add(what) {
      var _this = this,
          _$addToSet;

      var metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (this.isVirtual) {
        this._virtualAction('add', what, metadata);

        return this;
      }

      var _ids = this.identifyIds(what, true);

      this._validateIds(_ids);

      var field = this.linkStorageField;
      this.object[field] = this.object[field] || [];
      var metadatas = [];

      _.each(_ids, function (_id) {
        var localMetadata = _.clone(metadata);

        localMetadata._id = _id;

        _this.object[field].push(localMetadata);

        metadatas.push(localMetadata);
      });

      var modifier = {
        $addToSet: (_$addToSet = {}, _$addToSet[field] = {
          $each: metadatas
        }, _$addToSet)
      };
      this.linker.mainCollection.update(this.object._id, modifier);
      return this;
    }

    return add;
  }()
  /**
   * @param what
   * @param extendMetadata
   */
  ;

  _proto.metadata = function () {
    function metadata(what, extendMetadata) {
      if (this.isVirtual) {
        this._virtualAction('metadata', what, extendMetadata);

        return this;
      }

      var field = this.linkStorageField;

      if (what === undefined) {
        return this.object[field];
      }

      if (_.isArray(what)) {
        throw new Meteor.Error('not-allowed', 'Metadata updates should be made for one entity only, not multiple');
      }

      var _id = this.identifyId(what);

      var existingMetadata = _.find(this.object[field], function (metadata) {
        return metadata._id == _id;
      });

      if (extendMetadata === undefined) {
        return existingMetadata;
      } else {
        var _this$linker$mainColl, _$set;

        _.extend(existingMetadata, extendMetadata);

        var subfield = field + '._id';
        var subfieldUpdate = field + '.$';
        this.linker.mainCollection.update((_this$linker$mainColl = {
          _id: this.object._id
        }, _this$linker$mainColl[subfield] = _id, _this$linker$mainColl), {
          $set: (_$set = {}, _$set[subfieldUpdate] = existingMetadata, _$set)
        });
      }

      return this;
    }

    return metadata;
  }();

  _proto.remove = function () {
    function remove(what) {
      var _$pull;

      if (this.isVirtual) {
        this._virtualAction('remove', what);

        return this;
      }

      var _ids = this.identifyIds(what);

      var field = this.linkStorageField;
      this.object[field] = _.filter(this.object[field], function (link) {
        return !_.contains(_ids, link._id);
      });
      var modifier = {
        $pull: (_$pull = {}, _$pull[field] = {
          _id: {
            $in: _ids
          }
        }, _$pull)
      };
      this.linker.mainCollection.update(this.object._id, modifier);
      return this;
    }

    return remove;
  }();

  _proto.set = function () {
    function set(what, metadata) {
      if (this.isVirtual) {
        this._virtualAction('set', what, metadata);

        return this;
      }

      throw new Meteor.Error('invalid-command', 'You are trying to *set* in a relationship that is single. Please use add/remove for *many* relationships');
    }

    return set;
  }();

  _proto.unset = function () {
    function unset(what) {
      if (this.isVirtual) {
        this._virtualAction('unset', what);

        return this;
      }

      throw new Meteor.Error('invalid-command', 'You are trying to *unset* in a relationship that is single. Please use add/remove for *many* relationships');
    }

    return unset;
  }();

  return LinkManyMeta;
}(Link);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"linkOne.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/linkTypes/linkOne.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  "default": function () {
    return LinkOne;
  }
});
var Link;
module.link("./base.js", {
  "default": function (v) {
    Link = v;
  }
}, 0);
var SmartArgs;
module.link("./lib/smartArguments.js", {
  "default": function (v) {
    SmartArgs = v;
  }
}, 1);

var LinkOne =
/*#__PURE__*/
function (_Link) {
  (0, _inheritsLoose2.default)(LinkOne, _Link);

  function LinkOne() {
    return _Link.apply(this, arguments) || this;
  }

  var _proto = LinkOne.prototype;

  _proto.set = function () {
    function set(what) {
      var _$set;

      if (this.isVirtual) {
        this._virtualAction('set', what);

        return this;
      }

      var field = this.linkStorageField;

      var _id = this.identifyId(what, true);

      this._validateIds([_id]);

      this.object[field] = _id;
      this.linker.mainCollection.update(this.object._id, {
        $set: (_$set = {}, _$set[field] = _id, _$set)
      });
      return this;
    }

    return set;
  }();

  _proto.unset = function () {
    function unset() {
      var _$set2;

      if (this.isVirtual) {
        this._virtualAction('unset', what);

        return this;
      }

      var field = this.linkStorageField;
      this.object[field] = null;
      this.linker.mainCollection.update(this.object._id, {
        $set: (_$set2 = {}, _$set2[field] = null, _$set2)
      });
      return this;
    }

    return unset;
  }();

  _proto.add = function () {
    function add(what) {
      if (this.isVirtual) {
        this._virtualAction('add', what);

        return this;
      }

      throw new Meteor.Error('invalid-command', 'You are trying to *add* in a relationship that is single. Please use set/unset for *single* relationships');
    }

    return add;
  }();

  _proto.remove = function () {
    function remove(what) {
      if (this.isVirtual) {
        this._virtualAction('remove', what);

        return this;
      }

      throw new Meteor.Error('invalid-command', 'You are trying to *remove* in a relationship that is single. Please use set/unset for *single* relationships');
    }

    return remove;
  }();

  return LinkOne;
}(Link);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"linkOneMeta.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/linkTypes/linkOneMeta.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  "default": function () {
    return LinkOneMeta;
  }
});
var Link;
module.link("./base.js", {
  "default": function (v) {
    Link = v;
  }
}, 0);
var SmartArgs;
module.link("./lib/smartArguments.js", {
  "default": function (v) {
    SmartArgs = v;
  }
}, 1);

var LinkOneMeta =
/*#__PURE__*/
function (_Link) {
  (0, _inheritsLoose2.default)(LinkOneMeta, _Link);

  function LinkOneMeta() {
    return _Link.apply(this, arguments) || this;
  }

  var _proto = LinkOneMeta.prototype;

  _proto.set = function () {
    function set(what) {
      var _$set;

      var metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (this.isVirtual) {
        this._virtualAction('set', what);

        return this;
      }

      var field = this.linkStorageField;
      metadata._id = this.identifyId(what, true);

      this._validateIds([metadata._id]);

      this.object[field] = metadata;
      this.linker.mainCollection.update(this.object._id, {
        $set: (_$set = {}, _$set[field] = metadata, _$set)
      });
      return this;
    }

    return set;
  }();

  _proto.metadata = function () {
    function metadata(extendMetadata) {
      if (this.isVirtual) {
        this._virtualAction('metadata', undefined, extendMetadata);

        return this;
      }

      var field = this.linkStorageField;

      if (!extendMetadata) {
        return this.object[field];
      } else {
        var _$set2;

        _.extend(this.object[field], extendMetadata);

        this.linker.mainCollection.update(this.object._id, {
          $set: (_$set2 = {}, _$set2[field] = this.object[field], _$set2)
        });
      }

      return this;
    }

    return metadata;
  }();

  _proto.unset = function () {
    function unset() {
      var _$set3;

      if (this.isVirtual) {
        this._virtualAction('unset');

        return this;
      }

      var field = this.linkStorageField;
      this.object[field] = {};
      this.linker.mainCollection.update(this.object._id, {
        $set: (_$set3 = {}, _$set3[field] = {}, _$set3)
      });
      return this;
    }

    return unset;
  }();

  _proto.add = function () {
    function add(what, metadata) {
      if (this.isVirtual) {
        this._virtualAction('add', what, metadata);

        return this;
      }

      throw new Meteor.Error('invalid-command', 'You are trying to *add* in a relationship that is single. Please use set/unset for *single* relationships');
    }

    return add;
  }();

  _proto.remove = function () {
    function remove(what) {
      if (this.isVirtual) {
        this._virtualAction('remove', what);

        return this;
      }

      throw new Meteor.Error('invalid-command', 'You are trying to *remove* in a relationship that is single. Please use set/unset for *single* relationships');
    }

    return remove;
  }();

  return LinkOneMeta;
}(Link);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"smartArguments.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/linkTypes/lib/smartArguments.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

module.exportDefault(new (
/*#__PURE__*/
function () {
  function _class() {}

  var _proto = _class.prototype;

  _proto.getIds = function () {
    function getIds(what, options) {
      var _this = this;

      if (_.isArray(what)) {
        return _.map(what, function (subWhat) {
          return _this.getId(subWhat, options);
        });
      } else {
        return [this.getId(what, options)];
      }

      throw new Meteor.Error('invalid-type', "Unrecognized type: " + (0, _typeof2.default)(what) + " for managing links");
    }

    return getIds;
  }();

  _proto.getId = function () {
    function getId(what, options) {
      if (typeof what === 'string') {
        return what;
      }

      if ((0, _typeof2.default)(what) === 'object') {
        if (!what._id && options.saveToDatabase) {
          what._id = options.collection.insert(what);
        }

        return what._id;
      }
    }

    return getId;
  }();

  return _class;
}())());
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"namedQuery":{"namedQuery.base.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/namedQuery.base.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

module.export({
  "default": function () {
    return NamedQueryBase;
  }
});
var deepClone;
module.link("lodash.clonedeep", {
  "default": function (v) {
    deepClone = v;
  }
}, 0);

var NamedQueryBase =
/*#__PURE__*/
function () {
  function NamedQueryBase(name, collection, body) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    this.isNamedQuery = true;
    this.queryName = name;

    if (_.isFunction(body)) {
      this.resolver = body;
    } else {
      this.body = deepClone(body);
    }

    this.subscriptionHandle = null;
    this.params = options.params || {};
    this.options = options;
    this.collection = collection;
    this.isExposed = false;
  }

  var _proto = NamedQueryBase.prototype;

  _proto.setParams = function () {
    function setParams(params) {
      this.params = _.extend({}, this.params, params);
      return this;
    }

    return setParams;
  }()
  /**
   * Validates the parameters
   */
  ;

  _proto.doValidateParams = function () {
    function doValidateParams(params) {
      params = params || this.params;
      var validateParams = this.options.validateParams;
      if (!validateParams) return;

      try {
        this._validate(validateParams, params);
      } catch (validationError) {
        console.error("Invalid parameters supplied to the query \"" + this.queryName + "\"\n", validationError);
        throw validationError; // rethrow
      }
    }

    return doValidateParams;
  }();

  _proto.clone = function () {
    function clone(newParams) {
      var params = _.extend({}, deepClone(this.params), newParams);

      var clone = new this.constructor(this.queryName, this.collection, this.isResolver ? this.resolver : deepClone(this.body), (0, _objectSpread2.default)({}, this.options, {
        params: params
      }));
      clone.cacher = this.cacher;

      if (this.exposeConfig) {
        clone.exposeConfig = this.exposeConfig;
      }

      return clone;
    }

    return clone;
  }()
  /**
   * @param {function|object} validator
   * @param {object} params
   * @private
   */
  ;

  _proto._validate = function () {
    function _validate(validator, params) {
      if (_.isFunction(validator)) {
        validator.call(null, params);
      } else {
        check(params, validator);
      }
    }

    return _validate;
  }();

  (0, _createClass2.default)(NamedQueryBase, [{
    key: "name",
    get: function () {
      return "named_query_" + this.queryName;
    }
  }, {
    key: "isResolver",
    get: function () {
      return !!this.resolver;
    }
  }]);
  return NamedQueryBase;
}();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"namedQuery.client.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/namedQuery.client.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var CountSubscription;
module.link("../query/counts/countSubscription", {
  "default": function (v) {
    CountSubscription = v;
  }
}, 0);
var createGraph;
module.link("../query/lib/createGraph.js", {
  "default": function (v) {
    createGraph = v;
  }
}, 1);
var recursiveFetch;
module.link("../query/lib/recursiveFetch.js", {
  "default": function (v) {
    recursiveFetch = v;
  }
}, 2);
var prepareForProcess;
module.link("../query/lib/prepareForProcess.js", {
  "default": function (v) {
    prepareForProcess = v;
  }
}, 3);

var _;

module.link("meteor/underscore", {
  _: function (v) {
    _ = v;
  }
}, 4);
var callWithPromise;
module.link("../query/lib/callWithPromise", {
  "default": function (v) {
    callWithPromise = v;
  }
}, 5);
var Base;
module.link("./namedQuery.base", {
  "default": function (v) {
    Base = v;
  }
}, 6);
var LocalCollection;
module.link("meteor/minimongo", {
  LocalCollection: function (v) {
    LocalCollection = v;
  }
}, 7);
var intersectDeep;
module.link("../query/lib/intersectDeep", {
  "default": function (v) {
    intersectDeep = v;
  }
}, 8);
module.exportDefault(
/*#__PURE__*/
function (_Base) {
  (0, _inheritsLoose2.default)(_class, _Base);

  function _class() {
    return _Base.apply(this, arguments) || this;
  }

  var _proto = _class.prototype;

  /**
   * Subscribe
   *
   * @param callback
   * @returns {null|any|*}
   */
  _proto.subscribe = function () {
    function subscribe(callback) {
      if (this.isResolver) {
        throw new Meteor.Error('not-allowed', "You cannot subscribe to a resolver query");
      }

      this.subscriptionHandle = Meteor.subscribe(this.name, this.params, callback);
      return this.subscriptionHandle;
    }

    return subscribe;
  }()
  /**
   * Subscribe to the counts for this query
   *
   * @param callback
   * @returns {Object}
   */
  ;

  _proto.subscribeCount = function () {
    function subscribeCount(callback) {
      if (this.isResolver) {
        throw new Meteor.Error('not-allowed', "You cannot subscribe to a resolver query");
      }

      if (!this._counter) {
        this._counter = new CountSubscription(this);
      }

      return this._counter.subscribe(this.params, callback);
    }

    return subscribeCount;
  }()
  /**
   * Unsubscribe if an existing subscription exists
   */
  ;

  _proto.unsubscribe = function () {
    function unsubscribe() {
      if (this.subscriptionHandle) {
        this.subscriptionHandle.stop();
      }

      this.subscriptionHandle = null;
    }

    return unsubscribe;
  }()
  /**
   * Unsubscribe to the counts if a subscription exists.
   */
  ;

  _proto.unsubscribeCount = function () {
    function unsubscribeCount() {
      if (this._counter) {
        this._counter.unsubscribe();

        this._counter = null;
      }
    }

    return unsubscribeCount;
  }()
  /**
   * Fetches elements in sync using promises
   * @return {*}
   */
  ;

  _proto.fetchSync = function () {
    function fetchSync() {
      return _regenerator.default.async(function () {
        function fetchSync$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.subscriptionHandle) {
                  _context.next = 2;
                  break;
                }

                throw new Meteor.Error('This query is reactive, meaning you cannot use promises to fetch the data.');

              case 2:
                _context.next = 4;
                return _regenerator.default.awrap(callWithPromise(this.name, this.params));

              case 4:
                return _context.abrupt("return", _context.sent);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }

        return fetchSync$;
      }(), null, this);
    }

    return fetchSync;
  }()
  /**
   * Fetches one element in sync
   * @return {*}
   */
  ;

  _proto.fetchOneSync = function () {
    function fetchOneSync() {
      return _regenerator.default.async(function () {
        function fetchOneSync$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.t0 = _;
                _context2.next = 3;
                return _regenerator.default.awrap(this.fetchSync());

              case 3:
                _context2.t1 = _context2.sent;
                return _context2.abrupt("return", _context2.t0.first.call(_context2.t0, _context2.t1));

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }

        return fetchOneSync$;
      }(), null, this);
    }

    return fetchOneSync;
  }()
  /**
   * Retrieves the data.
   * @param callbackOrOptions
   * @returns {*}
   */
  ;

  _proto.fetch = function () {
    function fetch(callbackOrOptions) {
      if (!this.subscriptionHandle) {
        return this._fetchStatic(callbackOrOptions);
      } else {
        return this._fetchReactive(callbackOrOptions);
      }
    }

    return fetch;
  }()
  /**
   * @param args
   * @returns {*}
   */
  ;

  _proto.fetchOne = function () {
    function fetchOne() {
      if (!this.subscriptionHandle) {
        var callback = arguments.length <= 0 ? undefined : arguments[0];

        if (!_.isFunction(callback)) {
          throw new Meteor.Error('You did not provide a valid callback');
        }

        this.fetch(function (err, res) {
          callback(err, res ? _.first(res) : null);
        });
      } else {
        return _.first(this.fetch.apply(this, arguments));
      }
    }

    return fetchOne;
  }()
  /**
   * Gets the count of matching elements in sync.
   * @returns {any}
   */
  ;

  _proto.getCountSync = function () {
    function getCountSync() {
      return _regenerator.default.async(function () {
        function getCountSync$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this._counter) {
                  _context3.next = 2;
                  break;
                }

                throw new Meteor.Error('This query is reactive, meaning you cannot use promises to fetch the data.');

              case 2:
                _context3.next = 4;
                return _regenerator.default.awrap(callWithPromise(this.name + '.count', this.params));

              case 4:
                return _context3.abrupt("return", _context3.sent);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }

        return getCountSync$;
      }(), null, this);
    }

    return getCountSync;
  }()
  /**
   * Gets the count of matching elements.
   * @param callback
   * @returns {any}
   */
  ;

  _proto.getCount = function () {
    function getCount(callback) {
      if (this._counter) {
        return this._counter.getCount();
      } else {
        if (!callback) {
          throw new Meteor.Error('not-allowed', 'You are on client so you must either provide a callback to get the count or subscribe first.');
        } else {
          return Meteor.call(this.name + '.count', this.params, callback);
        }
      }
    }

    return getCount;
  }()
  /**
   * Fetching non-reactive queries
   * @param callback
   * @private
   */
  ;

  _proto._fetchStatic = function () {
    function _fetchStatic(callback) {
      if (!callback) {
        throw new Meteor.Error('not-allowed', 'You are on client so you must either provide a callback to get the data or subscribe first.');
      }

      Meteor.call(this.name, this.params, callback);
    }

    return _fetchStatic;
  }()
  /**
   * Fetching when we've got an active publication
   *
   * @param options
   * @returns {*}
   * @private
   */
  ;

  _proto._fetchReactive = function () {
    function _fetchReactive() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var body = this.body;

      if (this.params.$body) {
        body = intersectDeep(body, this.params.$body);
      }

      body = prepareForProcess(body, this.params);

      if (!options.allowSkip && body.$options && body.$options.skip) {
        delete body.$options.skip;
      }

      return recursiveFetch(createGraph(this.collection, body), undefined, {
        scoped: this.options.scoped,
        subscriptionHandle: this.subscriptionHandle
      });
    }

    return _fetchReactive;
  }();

  return _class;
}(Base));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"namedQuery.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/namedQuery.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var NamedQueryClient;
module.link("./namedQuery.client", {
  "default": function (v) {
    NamedQueryClient = v;
  }
}, 0);
var NamedQueryServer;
module.link("./namedQuery.server", {
  "default": function (v) {
    NamedQueryServer = v;
  }
}, 1);
var NamedQuery;

if (Meteor.isServer) {
  NamedQuery = NamedQueryServer;
} else {
  NamedQuery = NamedQueryClient;
}

module.exportDefault(NamedQuery);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"namedQuery.server.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/namedQuery.server.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var prepareForProcess;
module.link("../query/lib/prepareForProcess.js", {
  "default": function (v) {
    prepareForProcess = v;
  }
}, 0);
var Base;
module.link("./namedQuery.base", {
  "default": function (v) {
    Base = v;
  }
}, 1);
var deepClone;
module.link("lodash.clonedeep", {
  "default": function (v) {
    deepClone = v;
  }
}, 2);
var MemoryResultCacher;
module.link("./cache/MemoryResultCacher", {
  "default": function (v) {
    MemoryResultCacher = v;
  }
}, 3);
var intersectDeep;
module.link("../query/lib/intersectDeep", {
  "default": function (v) {
    intersectDeep = v;
  }
}, 4);
module.exportDefault(
/*#__PURE__*/
function (_Base) {
  (0, _inheritsLoose2.default)(_class, _Base);

  function _class() {
    return _Base.apply(this, arguments) || this;
  }

  var _proto = _class.prototype;

  /**
   * Retrieves the data.
   * @returns {*}
   */
  _proto.fetch = function () {
    function fetch(context) {
      this._performSecurityChecks(context, this.params);

      if (this.isResolver) {
        return this._fetchResolverData(context);
      } else {
        body = deepClone(this.body);

        if (this.params.$body) {
          body = intersectDeep(body, this.params.$body);
        } // we must apply emobdyment here


        this.doEmbodimentIfItApplies(body);
        var query = this.collection.createQuery(deepClone(body), {
          params: deepClone(this.params)
        });

        if (this.cacher) {
          var cacheId = this.cacher.generateQueryId(this.queryName, this.params);
          return this.cacher.fetch(cacheId, {
            query: query
          });
        }

        return query.fetch();
      }
    }

    return fetch;
  }()
  /**
   * @param args
   * @returns {*}
   */
  ;

  _proto.fetchOne = function () {
    function fetchOne() {
      return _.first(this.fetch.apply(this, arguments));
    }

    return fetchOne;
  }()
  /**
   * Gets the count of matching elements.
   *
   * @returns {any}
   */
  ;

  _proto.getCount = function () {
    function getCount(context) {
      this._performSecurityChecks(context, this.params);

      var countCursor = this.getCursorForCounting();

      if (this.cacher) {
        var cacheId = 'count::' + this.cacher.generateQueryId(this.queryName, this.params);
        return this.cacher.fetch(cacheId, {
          countCursor: countCursor
        });
      }

      return countCursor.count();
    }

    return getCount;
  }()
  /**
   * Returns the cursor for counting
   * This is most likely used for counts cursor
   */
  ;

  _proto.getCursorForCounting = function () {
    function getCursorForCounting() {
      var body = deepClone(this.body);
      this.doEmbodimentIfItApplies(body);
      body = prepareForProcess(body, this.params);
      return this.collection.find(body.$filters || {}, {
        fields: {
          _id: 1
        }
      });
    }

    return getCursorForCounting;
  }()
  /**
   * @param cacher
   */
  ;

  _proto.cacheResults = function () {
    function cacheResults(cacher) {
      if (!cacher) {
        cacher = new MemoryResultCacher();
      }

      this.cacher = cacher;
    }

    return cacheResults;
  }()
  /**
   * Configure resolve. This doesn't actually call the resolver, it just sets it
   * @param fn
   */
  ;

  _proto.resolve = function () {
    function resolve(fn) {
      if (!this.isResolver) {
        throw new Meteor.Error('invalid-call', "You cannot use resolve() on a non resolver NamedQuery");
      }

      this.resolver = fn;
    }

    return resolve;
  }()
  /**
   * @returns {*}
   * @private
   */
  ;

  _proto._fetchResolverData = function () {
    function _fetchResolverData(context) {
      var resolver = this.resolver;
      var self = this;
      var query = {
        fetch: function () {
          return resolver.call(context, self.params);
        }
      };

      if (this.cacher) {
        var cacheId = this.cacher.generateQueryId(this.queryName, this.params);
        return this.cacher.fetch(cacheId, {
          query: query
        });
      }

      return query.fetch();
    }

    return _fetchResolverData;
  }()
  /**
   * @param context Meteor method/publish context
   * @param params
   *
   * @private
   */
  ;

  _proto._performSecurityChecks = function () {
    function _performSecurityChecks(context, params) {
      if (context && this.exposeConfig) {
        this._callFirewall(context, context.userId, params);
      }

      this.doValidateParams(params);
    }

    return _performSecurityChecks;
  }();

  return _class;
}(Base));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"store.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/store.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exportDefault(new (
/*#__PURE__*/
function () {
  function _class() {
    this.storage = {};
  }

  var _proto = _class.prototype;

  _proto.add = function () {
    function add(key, value) {
      if (this.storage[key]) {
        throw new Meteor.Error('invalid-name', "You have previously defined another namedQuery with the same name: \"" + key + "\". Named Query names should be unique.");
      }

      this.storage[key] = value;
    }

    return add;
  }();

  _proto.get = function () {
    function get(key) {
      return this.storage[key];
    }

    return get;
  }();

  _proto.getAll = function () {
    function getAll() {
      return this.storage;
    }

    return getAll;
  }();

  return _class;
}())());
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cache":{"BaseResultCacher.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/cache/BaseResultCacher.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  "default": function () {
    return BaseResultCacher;
  }
});
var EJSON;
module.link("meteor/ejson", {
  EJSON: function (v) {
    EJSON = v;
  }
}, 0);

var BaseResultCacher =
/*#__PURE__*/
function () {
  function BaseResultCacher() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.config = config;
  }
  /**
   * @param queryName
   * @param params
   * @returns {string}
   */


  var _proto = BaseResultCacher.prototype;

  _proto.generateQueryId = function () {
    function generateQueryId(queryName, params) {
      return queryName + "::" + EJSON.stringify(params);
    }

    return generateQueryId;
  }()
  /**
   * Dummy function
   */
  ;

  _proto.fetch = function () {
    function fetch(cacheId, _ref) {
      var query = _ref.query,
          countCursor = _ref.countCursor;
      throw 'Not implemented';
    }

    return fetch;
  }()
  /**
   * @param query
   * @param countCursor
   * @returns {*}
   */
  ;

  BaseResultCacher.fetchData = function () {
    function fetchData(_ref2) {
      var query = _ref2.query,
          countCursor = _ref2.countCursor;

      if (query) {
        return query.fetch();
      } else {
        return countCursor.count();
      }
    }

    return fetchData;
  }();

  return BaseResultCacher;
}();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"MemoryResultCacher.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/cache/MemoryResultCacher.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  "default": function () {
    return MemoryResultCacher;
  }
});
var Meteor;
module.link("meteor/meteor", {
  Meteor: function (v) {
    Meteor = v;
  }
}, 0);
var cloneDeep;
module.link("lodash.clonedeep", {
  "default": function (v) {
    cloneDeep = v;
  }
}, 1);
var BaseResultCacher;
module.link("./BaseResultCacher", {
  "default": function (v) {
    BaseResultCacher = v;
  }
}, 2);
var DEFAULT_TTL = 60000;
/**
 * This is a very basic in-memory result caching functionality
 */

var MemoryResultCacher =
/*#__PURE__*/
function (_BaseResultCacher) {
  (0, _inheritsLoose2.default)(MemoryResultCacher, _BaseResultCacher);

  function MemoryResultCacher() {
    var _this;

    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _this = _BaseResultCacher.call(this, config) || this;
    _this.store = {};
    return _this;
  }
  /**
   * @param cacheId
   * @param query
   * @param countCursor
   * @returns {*}
   */


  var _proto = MemoryResultCacher.prototype;

  _proto.fetch = function () {
    function fetch(cacheId, _ref) {
      var query = _ref.query,
          countCursor = _ref.countCursor;
      var cacheData = this.store[cacheId];

      if (cacheData !== undefined) {
        return cloneDeep(cacheData);
      }

      var data = BaseResultCacher.fetchData({
        query: query,
        countCursor: countCursor
      });
      this.storeData(cacheId, data);
      return data;
    }

    return fetch;
  }()
  /**
   * @param cacheId
   * @param data
   */
  ;

  _proto.storeData = function () {
    function storeData(cacheId, data) {
      var _this2 = this;

      var ttl = this.config.ttl || DEFAULT_TTL;
      this.store[cacheId] = cloneDeep(data);
      Meteor.setTimeout(function () {
        delete _this2.store[cacheId];
      }, ttl);
    }

    return storeData;
  }();

  return MemoryResultCacher;
}(BaseResultCacher);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"query":{"query.base.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/query.base.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

module.export({
  "default": function () {
    return QueryBase;
  }
});
var deepClone;
module.link("lodash.clonedeep", {
  "default": function (v) {
    deepClone = v;
  }
}, 0);
var check;
module.link("meteor/check", {
  check: function (v) {
    check = v;
  }
}, 1);

var QueryBase =
/*#__PURE__*/
function () {
  function QueryBase(collection, body) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    this.isGlobalQuery = true;
    this.collection = collection;
    this.body = deepClone(body);
    this.params = options.params || {};
    this.options = options;
  }

  var _proto = QueryBase.prototype;

  _proto.clone = function () {
    function clone(newParams) {
      var params = _.extend({}, deepClone(this.params), newParams);

      return new this.constructor(this.collection, deepClone(this.body), (0, _objectSpread2.default)({
        params: params
      }, this.options));
    }

    return clone;
  }();

  /**
   * Validates the parameters
   */
  _proto.doValidateParams = function () {
    function doValidateParams() {
      var validateParams = this.options.validateParams;
      if (!validateParams) return;

      if (_.isFunction(validateParams)) {
        validateParams.call(null, this.params);
      } else {
        check(this.params);
      }
    }

    return doValidateParams;
  }()
  /**
   * Merges the params with previous params.
   *
   * @param params
   * @returns {Query}
   */
  ;

  _proto.setParams = function () {
    function setParams(params) {
      this.params = _.extend({}, this.params, params);
      return this;
    }

    return setParams;
  }();

  (0, _createClass2.default)(QueryBase, [{
    key: "name",
    get: function () {
      return "exposure_" + this.collection._name;
    }
  }]);
  return QueryBase;
}();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"query.client.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/query.client.js                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  "default": function () {
    return Query;
  }
});

var _;

module.link("meteor/underscore", {
  _: function (v) {
    _ = v;
  }
}, 0);
var CountSubscription;
module.link("./counts/countSubscription", {
  "default": function (v) {
    CountSubscription = v;
  }
}, 1);
var createGraph;
module.link("./lib/createGraph.js", {
  "default": function (v) {
    createGraph = v;
  }
}, 2);
var recursiveFetch;
module.link("./lib/recursiveFetch.js", {
  "default": function (v) {
    recursiveFetch = v;
  }
}, 3);
var prepareForProcess;
module.link("./lib/prepareForProcess.js", {
  "default": function (v) {
    prepareForProcess = v;
  }
}, 4);
var callWithPromise;
module.link("./lib/callWithPromise", {
  "default": function (v) {
    callWithPromise = v;
  }
}, 5);
var Base;
module.link("./query.base", {
  "default": function (v) {
    Base = v;
  }
}, 6);

var Query =
/*#__PURE__*/
function (_Base) {
  (0, _inheritsLoose2.default)(Query, _Base);

  function Query() {
    return _Base.apply(this, arguments) || this;
  }

  var _proto = Query.prototype;

  /**
   * Subscribe
   *
   * @param callback {Function} optional
   * @returns {null|any|*}
   */
  _proto.subscribe = function () {
    function subscribe(callback) {
      this.doValidateParams();
      this.subscriptionHandle = Meteor.subscribe(this.name, prepareForProcess(this.body, this.params), callback);
      return this.subscriptionHandle;
    }

    return subscribe;
  }()
  /**
   * Subscribe to the counts for this query
   *
   * @param callback
   * @returns {Object}
   */
  ;

  _proto.subscribeCount = function () {
    function subscribeCount(callback) {
      this.doValidateParams();

      if (!this._counter) {
        this._counter = new CountSubscription(this);
      }

      return this._counter.subscribe(prepareForProcess(this.body, this.params), callback);
    }

    return subscribeCount;
  }()
  /**
   * Unsubscribe if an existing subscription exists
   */
  ;

  _proto.unsubscribe = function () {
    function unsubscribe() {
      if (this.subscriptionHandle) {
        this.subscriptionHandle.stop();
      }

      this.subscriptionHandle = null;
    }

    return unsubscribe;
  }()
  /**
   * Unsubscribe to the counts if a subscription exists.
   */
  ;

  _proto.unsubscribeCount = function () {
    function unsubscribeCount() {
      if (this._counter) {
        this._counter.unsubscribe();

        this._counter = null;
      }
    }

    return unsubscribeCount;
  }()
  /**
   * Fetches elements in sync using promises
   * @return {*}
   */
  ;

  _proto.fetchSync = function () {
    function fetchSync() {
      return _regenerator.default.async(function () {
        function fetchSync$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.doValidateParams();

                if (!this.subscriptionHandle) {
                  _context.next = 3;
                  break;
                }

                throw new Meteor.Error('This query is reactive, meaning you cannot use promises to fetch the data.');

              case 3:
                _context.next = 5;
                return _regenerator.default.awrap(callWithPromise(this.name, prepareForProcess(this.body, this.params)));

              case 5:
                return _context.abrupt("return", _context.sent);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }

        return fetchSync$;
      }(), null, this);
    }

    return fetchSync;
  }()
  /**
   * Fetches one element in sync
   * @return {*}
   */
  ;

  _proto.fetchOneSync = function () {
    function fetchOneSync() {
      return _regenerator.default.async(function () {
        function fetchOneSync$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.t0 = _;
                _context2.next = 3;
                return _regenerator.default.awrap(this.fetchSync());

              case 3:
                _context2.t1 = _context2.sent;
                return _context2.abrupt("return", _context2.t0.first.call(_context2.t0, _context2.t1));

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }

        return fetchOneSync$;
      }(), null, this);
    }

    return fetchOneSync;
  }()
  /**
   * Retrieves the data.
   * @param callbackOrOptions
   * @returns {*}
   */
  ;

  _proto.fetch = function () {
    function fetch(callbackOrOptions) {
      this.doValidateParams();

      if (!this.subscriptionHandle) {
        return this._fetchStatic(callbackOrOptions);
      } else {
        return this._fetchReactive(callbackOrOptions);
      }
    }

    return fetch;
  }()
  /**
   * @param args
   * @returns {*}
   */
  ;

  _proto.fetchOne = function () {
    function fetchOne() {
      if (!this.subscriptionHandle) {
        var callback = arguments.length <= 0 ? undefined : arguments[0];

        if (!_.isFunction(callback)) {
          throw new Meteor.Error('You did not provide a valid callback');
        }

        this.fetch(function (err, res) {
          callback(err, res ? _.first(res) : null);
        });
      } else {
        return _.first(this.fetch.apply(this, arguments));
      }
    }

    return fetchOne;
  }()
  /**
   * Gets the count of matching elements in sync.
   * @returns {any}
   */
  ;

  _proto.getCountSync = function () {
    function getCountSync() {
      return _regenerator.default.async(function () {
        function getCountSync$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this._counter) {
                  _context3.next = 2;
                  break;
                }

                throw new Meteor.Error('This query is reactive, meaning you cannot use promises to fetch the data.');

              case 2:
                _context3.next = 4;
                return _regenerator.default.awrap(callWithPromise(this.name + '.count', prepareForProcess(this.body, this.params)));

              case 4:
                return _context3.abrupt("return", _context3.sent);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }

        return getCountSync$;
      }(), null, this);
    }

    return getCountSync;
  }()
  /**
   * Gets the count of matching elements.
   * @param callback
   * @returns {any}
   */
  ;

  _proto.getCount = function () {
    function getCount(callback) {
      if (this._counter) {
        return this._counter.getCount();
      } else {
        if (!callback) {
          throw new Meteor.Error('not-allowed', 'You are on client so you must either provide a callback to get the count or subscribe first.');
        } else {
          return Meteor.call(this.name + '.count', prepareForProcess(this.body, this.params), callback);
        }
      }
    }

    return getCount;
  }()
  /**
   * Fetching non-reactive queries
   * @param callback
   * @private
   */
  ;

  _proto._fetchStatic = function () {
    function _fetchStatic(callback) {
      if (!callback) {
        throw new Meteor.Error('not-allowed', 'You are on client so you must either provide a callback to get the data or subscribe first.');
      }

      Meteor.call(this.name, prepareForProcess(this.body, this.params), callback);
    }

    return _fetchStatic;
  }()
  /**
   * Fetching when we've got an active publication
   *
   * @param options
   * @returns {*}
   * @private
   */
  ;

  _proto._fetchReactive = function () {
    function _fetchReactive() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var body = prepareForProcess(this.body, this.params);

      if (!options.allowSkip && body.$options && body.$options.skip) {
        delete body.$options.skip;
      }

      return recursiveFetch(createGraph(this.collection, body), this.params);
    }

    return _fetchReactive;
  }();

  return Query;
}(Base);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"query.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/query.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var QueryClient;
module.link("./query.client", {
  "default": function (v) {
    QueryClient = v;
  }
}, 0);
var QueryServer;
module.link("./query.server", {
  "default": function (v) {
    QueryServer = v;
  }
}, 1);
var Query;

if (Meteor.isServer) {
  Query = QueryServer;
} else {
  Query = QueryClient;
}

module.exportDefault(Query);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"query.server.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/query.server.js                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  "default": function () {
    return Query;
  }
});
var createGraph;
module.link("./lib/createGraph.js", {
  "default": function (v) {
    createGraph = v;
  }
}, 0);
var prepareForProcess;
module.link("./lib/prepareForProcess.js", {
  "default": function (v) {
    prepareForProcess = v;
  }
}, 1);
var hypernova;
module.link("./hypernova/hypernova.js", {
  "default": function (v) {
    hypernova = v;
  }
}, 2);
var Base;
module.link("./query.base", {
  "default": function (v) {
    Base = v;
  }
}, 3);

var Query =
/*#__PURE__*/
function (_Base) {
  (0, _inheritsLoose2.default)(Query, _Base);

  function Query() {
    return _Base.apply(this, arguments) || this;
  }

  var _proto = Query.prototype;

  /**
   * Retrieves the data.
   * @param context
   * @returns {*}
   */
  _proto.fetch = function () {
    function fetch() {
      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var node = createGraph(this.collection, prepareForProcess(this.body, this.params));
      return hypernova(node, context.userId, {
        params: this.params
      });
    }

    return fetch;
  }()
  /**
   * @param args
   * @returns {*}
   */
  ;

  _proto.fetchOne = function () {
    function fetchOne() {
      return _.first(this.fetch.apply(this, arguments));
    }

    return fetchOne;
  }()
  /**
   * Gets the count of matching elements.
   * @returns {integer}
   */
  ;

  _proto.getCount = function () {
    function getCount() {
      return this.collection.find(this.body.$filters || {}, {}).count();
    }

    return getCount;
  }();

  return Query;
}(Base);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"counts":{"collection.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/counts/collection.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Mongo;
module.link("meteor/mongo", {
  Mongo: function (v) {
    Mongo = v;
  }
}, 0);
var COUNTS_COLLECTION_CLIENT;
module.link("./constants", {
  COUNTS_COLLECTION_CLIENT: function (v) {
    COUNTS_COLLECTION_CLIENT = v;
  }
}, 1);
module.exportDefault(new Mongo.Collection(COUNTS_COLLECTION_CLIENT));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"constants.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/counts/constants.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  COUNTS_COLLECTION_CLIENT: function () {
    return COUNTS_COLLECTION_CLIENT;
  }
});
var COUNTS_COLLECTION_CLIENT = 'grapher_counts';
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"countSubscription.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/counts/countSubscription.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  "default": function () {
    return CountSubscription;
  }
});
var EJSON;
module.link("meteor/ejson", {
  EJSON: function (v) {
    EJSON = v;
  }
}, 0);
var Meteor;
module.link("meteor/meteor", {
  Meteor: function (v) {
    Meteor = v;
  }
}, 1);
var ReactiveVar;
module.link("meteor/reactive-var", {
  ReactiveVar: function (v) {
    ReactiveVar = v;
  }
}, 2);
var Tracker;
module.link("meteor/tracker", {
  Tracker: function (v) {
    Tracker = v;
  }
}, 3);
var Counts;
module.link("./collection", {
  "default": function (v) {
    Counts = v;
  }
}, 4);
var createFauxSubscription;
module.link("./createFauxSubscription", {
  "default": function (v) {
    createFauxSubscription = v;
  }
}, 5);
var prepareForProcess;
module.link("../lib/prepareForProcess.js", {
  "default": function (v) {
    prepareForProcess = v;
  }
}, 6);
var NamedQueryBase;
module.link("../../namedQuery/namedQuery.base", {
  "default": function (v) {
    NamedQueryBase = v;
  }
}, 7);

var CountSubscription =
/*#__PURE__*/
function () {
  /**
   * @param {*} query - The query to use when fetching counts
   */
  function CountSubscription(query) {
    this.accessToken = new ReactiveVar(null);
    this.fauxHandle = null;
    this.query = query;
  }
  /**
   * Starts a subscription request for reactive counts.
   *
   * @param {*} arg - The argument to pass to {name}.count.subscribe
   * @param {*} callback
   */


  var _proto = CountSubscription.prototype;

  _proto.subscribe = function () {
    function subscribe(arg, callback) {
      var _this = this;

      // Don't try to resubscribe if arg hasn't changed
      if (EJSON.equals(this.lastArgs, arg) && this.fauxHandle) {
        return this.fauxHandle;
      }

      this.accessToken.set(null);
      this.lastArgs = arg;
      Meteor.call(this.query.name + '.count.subscribe', arg, function (error, token) {
        if (!_this._markedForUnsubscribe) {
          _this.subscriptionHandle = Meteor.subscribe(_this.query.name + '.count', token, callback);

          _this.accessToken.set(token);

          _this.disconnectComputation = Tracker.autorun(function () {
            return _this.handleDisconnect();
          });
        }

        _this._markedForUnsubscribe = false;
      });
      this.fauxHandle = createFauxSubscription(this);
      return this.fauxHandle;
    }

    return subscribe;
  }()
  /**
   * Unsubscribes from the count endpoint, if there is such a subscription.
   */
  ;

  _proto.unsubscribe = function () {
    function unsubscribe() {
      if (this.subscriptionHandle) {
        this.disconnectComputation.stop();
        this.subscriptionHandle.stop();
      } else {
        // If we hit this branch, then Meteor.call in subscribe hasn't finished yet
        // so set a flag to stop the subscription from being created
        this._markedForUnsubscribe = true;
      }

      this.accessToken.set(null);
      this.fauxHandle = null;
      this.subscriptionHandle = null;
    }

    return unsubscribe;
  }()
  /**
   * Reactively fetch current document count. Returns null if the subscription is not ready yet.
   *
   * @returns {Number|null} - Current document count
   */
  ;

  _proto.getCount = function () {
    function getCount() {
      var id = this.accessToken.get();
      if (id === null) return null;
      var doc = Counts.findOne(id);
      return doc.count;
    }

    return getCount;
  }()
  /**
   * All session info gets deleted when the server goes down, so when the client attempts to
   * optimistically resume the '.count' publication, the server will throw a 'no-request' error.
   *
   * This function prevents that by manually stopping and restarting the subscription when the
   * connection to the server is lost.
   */
  ;

  _proto.handleDisconnect = function () {
    function handleDisconnect() {
      var status = Meteor.status();

      if (!status.connected) {
        this._markedForResume = true;
        this.fauxHandle = null;
        this.subscriptionHandle.stop();
      }

      if (status.connected && this._markedForResume) {
        this._markedForResume = false;
        this.subscribe(this.lastArgs);
      }
    }

    return handleDisconnect;
  }()
  /**
   * Returns whether or not a subscription request has been made.
   */
  ;

  _proto.isSubscribed = function () {
    function isSubscribed() {
      return this.accessToken.get() !== null;
    }

    return isSubscribed;
  }();

  return CountSubscription;
}();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"createFauxSubscription.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/counts/createFauxSubscription.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exportDefault(function (countManager) {
  return {
    ready: function () {
      return countManager.accessToken.get() !== null && countManager.subscriptionHandle.ready();
    },
    stop: function () {
      return countManager.unsubscribe();
    }
  };
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"hypernova":{"aggregateSearchFilters.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/aggregateSearchFilters.js                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

module.export({
  "default": function () {
    return AggregateFilters;
  }
});
var sift;
module.link("sift", {
  "default": function (v) {
    sift = v;
  }
}, 0);

var AggregateFilters =
/*#__PURE__*/
function () {
  function AggregateFilters(collectionNode, metaFilters) {
    this.collectionNode = collectionNode;
    this.linker = collectionNode.linker;
    this.metaFilters = metaFilters;
    this.isVirtual = this.linker.isVirtual();
    this.linkStorageField = this.linker.linkStorageField;
  }

  var _proto = AggregateFilters.prototype;

  _proto.create = function () {
    function create() {
      switch (this.linker.strategy) {
        case 'one':
          return this.createOne();

        case 'one-meta':
          return this.createOneMeta();

        case 'many':
          return this.createMany();

        case 'many-meta':
          return this.createManyMeta();

        default:
          throw new Meteor.Error("Invalid linker type: " + this.linker.type);
      }
    }

    return create;
  }();

  _proto.createOne = function () {
    function createOne() {
      if (!this.isVirtual) {
        return {
          _id: {
            $in: _.uniq(_.pluck(this.parentObjects, this.linkStorageField))
          }
        };
      } else {
        var _ref;

        return _ref = {}, _ref[this.linkStorageField] = {
          $in: _.uniq(_.pluck(this.parentObjects, '_id'))
        }, _ref;
      }
    }

    return createOne;
  }();

  _proto.createOneMeta = function () {
    function createOneMeta() {
      var _this = this;

      if (!this.isVirtual) {
        var eligibleObjects = this.parentObjects;

        if (this.metaFilters) {
          eligibleObjects = _.filter(this.parentObjects, function (object) {
            return sift(_this.metaFilters)(object[_this.linkStorageField]);
          });
        }

        var storages = _.pluck(eligibleObjects, this.linkStorageField);

        var ids = [];

        _.each(storages, function (storage) {
          if (storage) {
            ids.push(storage._id);
          }
        });

        return {
          _id: {
            $in: _.uniq(ids)
          }
        };
      } else {
        var filters = {};

        if (this.metaFilters) {
          _.each(this.metaFilters, function (value, key) {
            filters[_this.linkStorageField + '.' + key] = value;
          });
        }

        filters[this.linkStorageField + '._id'] = {
          $in: _.uniq(_.pluck(this.parentObjects, '_id'))
        };
        return filters;
      }
    }

    return createOneMeta;
  }();

  _proto.createMany = function () {
    function createMany() {
      if (!this.isVirtual) {
        var _ref2;

        var arrayOfIds = _.pluck(this.parentObjects, this.linkStorageField);

        return {
          _id: {
            $in: _.uniq((_ref2 = _).union.apply(_ref2, (0, _toConsumableArray2.default)(arrayOfIds)))
          }
        };
      } else {
        var _ref3, _ref4;

        var _arrayOfIds = _.pluck(this.parentObjects, '_id');

        return _ref4 = {}, _ref4[this.linkStorageField] = {
          $in: _.uniq((_ref3 = _).union.apply(_ref3, (0, _toConsumableArray2.default)(_arrayOfIds)))
        }, _ref4;
      }
    }

    return createMany;
  }();

  _proto.createManyMeta = function () {
    function createManyMeta() {
      var _this2 = this;

      if (!this.isVirtual) {
        var ids = [];

        _.each(this.parentObjects, function (object) {
          if (object[_this2.linkStorageField]) {
            if (_this2.metaFilters) {
              var isValid = sift(_this2.metaFilters);

              _.each(object[_this2.linkStorageField], function (object) {
                if (isValid(object)) {
                  ids.push(object._id);
                }
              });
            } else {
              _.each(object[_this2.linkStorageField], function (object) {
                ids.push(object._id);
              });
            }
          }
        });

        return {
          _id: {
            $in: _.uniq(ids)
          }
        };
      } else {
        var _ref5;

        var filters = {};

        if (this.metaFilters) {
          _.each(this.metaFilters, function (value, key) {
            filters[key] = value;
          });
        }

        filters._id = {
          $in: _.uniq(_.pluck(this.parentObjects, '_id'))
        };
        return _ref5 = {}, _ref5[this.linkStorageField] = {
          $elemMatch: filters
        }, _ref5;
      }
    }

    return createManyMeta;
  }();

  (0, _createClass2.default)(AggregateFilters, [{
    key: "parentObjects",
    get: function () {
      return this.collectionNode.parent.results;
    }
  }]);
  return AggregateFilters;
}();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"assembleAggregateResults.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/assembleAggregateResults.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var sift;
module.link("sift", {
  "default": function (v) {
    sift = v;
  }
}, 0);
var cleanObjectForMetaFilters;
module.link("./lib/cleanObjectForMetaFilters", {
  "default": function (v) {
    cleanObjectForMetaFilters = v;
  }
}, 1);
module.exportDefault(function (childCollectionNode, aggregateResults, metaFilters) {
  var linker = childCollectionNode.linker;
  var linkStorageField = linker.linkStorageField;
  var linkName = childCollectionNode.linkName;
  var isMeta = linker.isMeta();
  var isMany = linker.isMany();
  var allResults = [];

  if (isMeta && metaFilters) {
    var metaFiltersTest = sift(metaFilters);

    _.each(childCollectionNode.parent.results, function (parentResult) {
      cleanObjectForMetaFilters(parentResult, linkStorageField, metaFiltersTest);
    });
  }

  if (isMeta && isMany) {
    // This case is treated differently because we get an array response from the pipeline.
    _.each(childCollectionNode.parent.results, function (parentResult) {
      parentResult[linkName] = parentResult[linkName] || [];

      var eligibleAggregateResults = _.filter(aggregateResults, function (aggregateResult) {
        return _.contains(aggregateResult._id, parentResult._id);
      });

      if (eligibleAggregateResults.length) {
        var datas = _.pluck(eligibleAggregateResults, 'data'); /// [ [x1, x2], [x2, x3] ]


        _.each(datas, function (data) {
          _.each(data, function (item) {
            parentResult[linkName].push(item);
          });
        });
      }
    });

    _.each(aggregateResults, function (aggregateResult) {
      _.each(aggregateResult.data, function (item) {
        return allResults.push(item);
      });
    });
  } else {
    var comparator;

    if (isMany) {
      comparator = function (aggregateResult, result) {
        return _.contains(aggregateResult._id, result._id);
      };
    } else {
      comparator = function (aggregateResult, result) {
        return aggregateResult._id == result._id;
      };
    }

    var childLinkName = childCollectionNode.linkName;
    var parentResults = childCollectionNode.parent.results;
    parentResults.forEach(function (parentResult) {
      // We are now finding the data from the pipeline that is related to the _id of the parent
      var eligibleAggregateResults = aggregateResults.filter(function (aggregateResult) {
        return comparator(aggregateResult, parentResult);
      });
      eligibleAggregateResults.forEach(function (aggregateResult) {
        if (Array.isArray(parentResult[childLinkName])) {
          var _parentResult$childLi;

          (_parentResult$childLi = parentResult[childLinkName]).push.apply(_parentResult$childLi, (0, _toConsumableArray2.default)(aggregateResult.data));
        } else {
          parentResult[childLinkName] = (0, _toConsumableArray2.default)(aggregateResult.data);
        }
      });
    });
    aggregateResults.forEach(function (aggregateResult) {
      allResults.push.apply(allResults, (0, _toConsumableArray2.default)(aggregateResult.data));
    });
  }

  childCollectionNode.results = allResults;
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"assembler.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/assembler.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var createSearchFilters;
module.link("../../links/lib/createSearchFilters", {
  "default": function (v) {
    createSearchFilters = v;
  }
}, 0);
var cleanObjectForMetaFilters;
module.link("./lib/cleanObjectForMetaFilters", {
  "default": function (v) {
    cleanObjectForMetaFilters = v;
  }
}, 1);
var sift;
module.link("sift", {
  "default": function (v) {
    sift = v;
  }
}, 2);
module.exportDefault(function (childCollectionNode, _ref) {
  var limit = _ref.limit,
      skip = _ref.skip,
      metaFilters = _ref.metaFilters;

  if (childCollectionNode.results.length === 0) {
    return;
  }

  var parent = childCollectionNode.parent;
  var linker = childCollectionNode.linker;
  var strategy = linker.strategy;
  var isSingle = linker.isSingle();
  var isMeta = linker.isMeta();
  var fieldStorage = linker.linkStorageField; // cleaning the parent results from a child
  // this may be the wrong approach but it works for now

  if (isMeta && metaFilters) {
    var metaFiltersTest = sift(metaFilters);

    _.each(parent.results, function (parentResult) {
      cleanObjectForMetaFilters(parentResult, fieldStorage, metaFiltersTest);
    });
  }

  var resultsByKeyId = _.groupBy(childCollectionNode.results, '_id');

  if (strategy === 'one') {
    parent.results.forEach(function (parentResult) {
      if (!parentResult[fieldStorage]) {
        return;
      }

      parentResult[childCollectionNode.linkName] = filterAssembledData(resultsByKeyId[parentResult[fieldStorage]], {
        limit: limit,
        skip: skip
      });
    });
  }

  if (strategy === 'many') {
    parent.results.forEach(function (parentResult) {
      if (!parentResult[fieldStorage]) {
        return;
      }

      var data = [];
      parentResult[fieldStorage].forEach(function (_id) {
        data.push(_.first(resultsByKeyId[_id]));
      });
      parentResult[childCollectionNode.linkName] = filterAssembledData(data, {
        limit: limit,
        skip: skip
      });
    });
  }

  if (strategy === 'one-meta') {
    parent.results.forEach(function (parentResult) {
      if (!parentResult[fieldStorage]) {
        return;
      }

      var _id = parentResult[fieldStorage]._id;
      parentResult[childCollectionNode.linkName] = filterAssembledData(resultsByKeyId[_id], {
        limit: limit,
        skip: skip
      });
    });
  }

  if (strategy === 'many-meta') {
    parent.results.forEach(function (parentResult) {
      var _ids = _.pluck(parentResult[fieldStorage], '_id');

      var data = [];

      _ids.forEach(function (_id) {
        data.push(_.first(resultsByKeyId[_id]));
      });

      parentResult[childCollectionNode.linkName] = filterAssembledData(data, {
        limit: limit,
        skip: skip
      });
    });
  }
});

function filterAssembledData(data, _ref2) {
  var limit = _ref2.limit,
      skip = _ref2.skip;

  if (limit && Array.isArray(data)) {
    return data.slice(skip, limit);
  }

  return data;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"buildAggregatePipeline.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/buildAggregatePipeline.js                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _;

module.link("meteor/underscore", {
  _: function (v) {
    _ = v;
  }
}, 0);
var SAFE_DOTTED_FIELD_REPLACEMENT;
module.link("./constants", {
  SAFE_DOTTED_FIELD_REPLACEMENT: function (v) {
    SAFE_DOTTED_FIELD_REPLACEMENT = v;
  }
}, 1);
module.exportDefault(function (childCollectionNode, filters, options, userId) {
  var containsDottedFields = false;
  var linker = childCollectionNode.linker;
  var linkStorageField = linker.linkStorageField;
  var collection = childCollectionNode.collection;
  var pipeline = [];

  if (collection.firewall) {
    collection.firewall(filters, options, userId);
  }

  pipeline.push({
    $match: filters
  });

  if (options.sort && _.keys(options.sort).length > 0) {
    pipeline.push({
      $sort: options.sort
    });
  }

  var _id = linkStorageField;

  if (linker.isMeta()) {
    _id += '._id';
  }

  var dataPush = {
    _id: '$_id'
  };

  _.each(options.fields, function (value, field) {
    if (field.indexOf('.') >= 0) {
      containsDottedFields = true;
    }

    var safeField = field.replace(/\./g, SAFE_DOTTED_FIELD_REPLACEMENT);
    dataPush[safeField] = '$' + field;
  });

  if (linker.isMeta()) {
    dataPush[linkStorageField] = '$' + linkStorageField;
  }

  pipeline.push({
    $group: {
      _id: "$" + _id,
      data: {
        $push: dataPush
      }
    }
  });

  if (options.limit || options.skip) {
    var $slice = ["$data"];
    if (options.skip) $slice.push(options.skip);
    if (options.limit) $slice.push(options.limit);
    pipeline.push({
      $project: {
        _id: 1,
        data: {
          $slice: $slice
        }
      }
    });
  }

  return {
    pipeline: pipeline,
    containsDottedFields: containsDottedFields
  };
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"constants.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/constants.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  SAFE_DOTTED_FIELD_REPLACEMENT: function () {
    return SAFE_DOTTED_FIELD_REPLACEMENT;
  }
});
var SAFE_DOTTED_FIELD_REPLACEMENT = '___';
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"hypernova.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/hypernova.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  "default": function () {
    return hypernovaInit;
  }
});
var applyProps;
module.link("../lib/applyProps.js", {
  "default": function (v) {
    applyProps = v;
  }
}, 0);
var prepareForDelivery;
module.link("../lib/prepareForDelivery.js", {
  "default": function (v) {
    prepareForDelivery = v;
  }
}, 1);
var storeHypernovaResults;
module.link("./storeHypernovaResults.js", {
  "default": function (v) {
    storeHypernovaResults = v;
  }
}, 2);

function hypernova(collectionNode, userId) {
  _.each(collectionNode.collectionNodes, function (childCollectionNode) {
    var _applyProps = applyProps(childCollectionNode),
        filters = _applyProps.filters,
        options = _applyProps.options;

    storeHypernovaResults(childCollectionNode, userId);
    hypernova(childCollectionNode, userId);
  });
}

function hypernovaInit(collectionNode, userId) {
  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var bypassFirewalls = config.bypassFirewalls || false;
  var params = config.params || {};

  var _applyProps2 = applyProps(collectionNode),
      filters = _applyProps2.filters,
      options = _applyProps2.options;

  var collection = collectionNode.collection;
  collectionNode.results = collection.find(filters, options, userId).fetch();
  var userIdToPass = config.bypassFirewalls ? undefined : userId;
  hypernova(collectionNode, userIdToPass);
  prepareForDelivery(collectionNode, params);
  return collectionNode.results;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"storeHypernovaResults.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/storeHypernovaResults.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

module.export({
  "default": function () {
    return storeHypernovaResults;
  }
});
var applyProps;
module.link("../lib/applyProps.js", {
  "default": function (v) {
    applyProps = v;
  }
}, 0);
var AggregateFilters;
module.link("./aggregateSearchFilters.js", {
  "default": function (v) {
    AggregateFilters = v;
  }
}, 1);
var assemble;
module.link("./assembler.js", {
  "default": function (v) {
    assemble = v;
  }
}, 2);
var assembleAggregateResults;
module.link("./assembleAggregateResults.js", {
  "default": function (v) {
    assembleAggregateResults = v;
  }
}, 3);
var buildAggregatePipeline;
module.link("./buildAggregatePipeline.js", {
  "default": function (v) {
    buildAggregatePipeline = v;
  }
}, 4);
var snapBackDottedFields;
module.link("./lib/snapBackDottedFields", {
  "default": function (v) {
    snapBackDottedFields = v;
  }
}, 5);

function storeHypernovaResults(childCollectionNode, userId) {
  if (childCollectionNode.parent.results.length === 0) {
    return childCollectionNode.results = [];
  }

  var _applyProps = applyProps(childCollectionNode),
      filters = _applyProps.filters,
      options = _applyProps.options;

  var metaFilters = filters.$meta;
  var aggregateFilters = new AggregateFilters(childCollectionNode, metaFilters);
  delete filters.$meta;
  var linker = childCollectionNode.linker;
  var isVirtual = linker.isVirtual();
  var collection = childCollectionNode.collection;

  _.extend(filters, aggregateFilters.create()); // if it's not virtual then we retrieve them and assemble them here.


  if (!isVirtual) {
    var filteredOptions = _.omit(options, 'limit');

    childCollectionNode.results = collection.find(filters, filteredOptions, userId).fetch();
    assemble(childCollectionNode, (0, _objectSpread2.default)({}, options, {
      metaFilters: metaFilters
    }));
  } else {
    // virtuals arrive here
    var _buildAggregatePipeli = buildAggregatePipeline(childCollectionNode, filters, options, userId),
        pipeline = _buildAggregatePipeli.pipeline,
        containsDottedFields = _buildAggregatePipeli.containsDottedFields;

    var aggregateResults = collection.aggregate(pipeline);
    /**
     * If in aggregation it contains '.', we replace it with a custom string '___'
     * And then after aggregation is complete we need to snap-it back to how it was.
     */

    if (containsDottedFields) {
      snapBackDottedFields(aggregateResults);
    }

    assembleAggregateResults(childCollectionNode, aggregateResults, metaFilters);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"cleanObjectForMetaFilters.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/lib/cleanObjectForMetaFilters.js                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exportDefault(function (object, field, metaFiltersTest) {
  if (object[field]) {
    if (_.isArray(object[field])) {
      object[field] = object[field].filter(metaFiltersTest);
    } else {
      if (!metaFiltersTest(object[field])) {
        object[field] = null;
      }
    }
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"snapBackDottedFields.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/lib/snapBackDottedFields.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var SAFE_DOTTED_FIELD_REPLACEMENT;
module.link("../constants", {
  SAFE_DOTTED_FIELD_REPLACEMENT: function (v) {
    SAFE_DOTTED_FIELD_REPLACEMENT = v;
  }
}, 0);
var dot;
module.link("dot-object", {
  "default": function (v) {
    dot = v;
  }
}, 1);
module.exportDefault(function (aggregationResult) {
  aggregationResult.forEach(function (result) {
    result.data = result.data.map(function (document) {
      _.each(document, function (value, key) {
        if (key.indexOf(SAFE_DOTTED_FIELD_REPLACEMENT) >= 0) {
          document[key.replace(new RegExp(SAFE_DOTTED_FIELD_REPLACEMENT, 'g'), '.')] = value;
          delete document[key];
        }
      });

      return dot.object(document);
    });
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"lib":{"applyProps.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/lib/applyProps.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  "default": function () {
    return applyProps;
  }
});
var restrictOptions = ['disableOplog', 'pollingIntervalMs', 'pollingThrottleMs'];

function applyProps(node) {
  var _ref;

  var filters = _.extend({}, node.props.$filters);

  var options = _.extend({}, node.props.$options);

  options = (_ref = _).omit.apply(_ref, [options].concat(restrictOptions));
  options.fields = options.fields || {};
  node.applyFields(filters, options);
  return {
    filters: filters,
    options: options
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"callWithPromise.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/lib/callWithPromise.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exportDefault(function (method, myParameters) {
  return new Promise(function (resolve, reject) {
    Meteor.call(method, myParameters, function (err, res) {
      if (err) reject(err.reason || 'Something went wrong.');
      resolve(res);
    });
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"createGraph.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/lib/createGraph.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  specialFields: function () {
    return specialFields;
  },
  createNodes: function () {
    return createNodes;
  },
  addFieldNode: function () {
    return addFieldNode;
  },
  getNodeNamespace: function () {
    return getNodeNamespace;
  }
});
var CollectionNode;
module.link("../nodes/collectionNode.js", {
  "default": function (v) {
    CollectionNode = v;
  }
}, 0);
var FieldNode;
module.link("../nodes/fieldNode.js", {
  "default": function (v) {
    FieldNode = v;
  }
}, 1);
var ReducerNode;
module.link("../nodes/reducerNode.js", {
  "default": function (v) {
    ReducerNode = v;
  }
}, 2);
var dotize;
module.link("./dotize.js", {
  "default": function (v) {
    dotize = v;
  }
}, 3);
var createReducers;
module.link("../reducers/lib/createReducers", {
  "default": function (v) {
    createReducers = v;
  }
}, 4);
var specialFields = ['$filters', '$options', '$postFilters', '$postOptions', '$postFilter'];

function createNodes(root) {
  // this is a fix for phantomjs tests (don't really understand it.)
  if (!_.isObject(root.body)) {
    return;
  }

  _.each(root.body, function (body, fieldName) {
    if (!body) {
      return;
    } // if it's a prop


    if (_.contains(specialFields, fieldName)) {
      root.addProp(fieldName, body);
      return;
    } // workaround, see https://github.com/cult-of-coders/grapher/issues/134
    // TODO: find another way to do this


    if (root.collection.default) {
      root.collection = root.collection.default;
    } // checking if it is a link.


    var linker = root.collection.getLinker(fieldName);

    if (linker) {
      // check if it is a cached link
      // if yes, then we need to explicitly define this at collection level
      // so when we transform the data for delivery, we move it to the link name
      if (linker.isDenormalized()) {
        if (linker.isSubBodyDenormalized(body)) {
          handleDenormalized(root, linker, body, fieldName);
          return;
        }
      }

      var subroot = new CollectionNode(linker.getLinkedCollection(), body, fieldName);
      root.add(subroot, linker);
      createNodes(subroot);
      return;
    } // checking if it's a reducer


    var reducer = root.collection.getReducer(fieldName);

    if (reducer) {
      var reducerNode = new ReducerNode(fieldName, reducer);
      root.add(reducerNode);
    } // it's most likely a field then


    addFieldNode(body, fieldName, root);
  });

  createReducers(root);

  if (root.fieldNodes.length === 0) {
    root.add(new FieldNode('_id', 1));
  }
}

function isProjectionOperatorExpression(body) {
  if (_.isObject(body)) {
    var keys = _.keys(body);

    return keys.length === 1 && _.contains(['$elemMatch', '$meta', '$slice'], keys[0]);
  }

  return false;
}
/**
 * @param body
 * @param fieldName
 * @param root
 */


function addFieldNode(body, fieldName, root) {
  // it's not a link and not a special variable => we assume it's a field
  if (_.isObject(body)) {
    if (!isProjectionOperatorExpression(body)) {
      var _dotize$convert;

      var dotted = dotize.convert((_dotize$convert = {}, _dotize$convert[fieldName] = body, _dotize$convert));

      _.each(dotted, function (value, key) {
        root.add(new FieldNode(key, value));
      });
    } else {
      root.add(new FieldNode(fieldName, body, true));
    }
  } else {
    var fieldNode = new FieldNode(fieldName, body);
    root.add(fieldNode);
  }
}

function getNodeNamespace(node) {
  var parts = [];
  var n = node;

  while (n) {
    var name = n.linker ? n.linker.linkName : n.collection._name;
    parts.push(name); // console.log('linker', node.linker ? node.linker.linkName : node.collection._name);

    n = n.parent;
  }

  return parts.reverse().join('_');
}

module.exportDefault(function (collection, body) {
  var root = new CollectionNode(collection, body);
  createNodes(root);
  return root;
});
;
/**
 * Ads denormalization config properly, including _id
 *
 * @param root
 * @param linker
 * @param body
 * @param fieldName
 */

function handleDenormalized(root, linker, body, fieldName) {
  Object.assign(body, {
    _id: 1
  });
  var cacheField = linker.linkConfig.denormalize.field;
  root.snapCache(cacheField, fieldName); // if it's one and direct also include the link storage

  if (!linker.isMany() && !linker.isVirtual()) {
    addFieldNode(1, linker.linkStorageField, root);
  }

  addFieldNode(body, cacheField, root);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"dotize.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/lib/dotize.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

module.exportDefault(dotize = {});

dotize.convert = function (obj, prefix) {
  if ((!obj || (0, _typeof2.default)(obj) != "object") && !Array.isArray(obj)) {
    if (prefix) {
      var newObj = {};
      newObj[prefix] = obj;
      return newObj;
    } else {
      return obj;
    }
  }

  var newObj = {};

  function recurse(o, p, isArrayItem) {
    for (var f in meteorBabelHelpers.sanitizeForInObject(o)) {
      if (o[f] && (0, _typeof2.default)(o[f]) === "object") {
        if (Array.isArray(o[f])) {
          if (isEmptyArray(o[f])) {
            newObj[getFieldName(f, p, true)] = o[f]; // empty array
          } else {
            newObj = recurse(o[f], getFieldName(f, p, false, true), true); // array
          }
        } else {
          if (isArrayItem) {
            if (isEmptyObj(o[f])) {
              newObj[getFieldName(f, p, true)] = o[f]; // empty object
            } else {
              newObj = recurse(o[f], getFieldName(f, p, true)); // array item object
            }
          } else {
            if (isEmptyObj(o[f])) {
              newObj[getFieldName(f, p)] = o[f]; // empty object
            } else {
              newObj = recurse(o[f], getFieldName(f, p)); // object
            }
          }
        }
      } else {
        if (isArrayItem || isNumber(f)) {
          newObj[getFieldName(f, p, true)] = o[f]; // array item primitive
        } else {
          newObj[getFieldName(f, p)] = o[f]; // primitive
        }
      }
    }

    if (isEmptyObj(newObj)) return obj;
    return newObj;
  }

  function isNumber(f) {
    return !isNaN(parseInt(f));
  }

  function isEmptyObj(obj) {
    for (var prop in meteorBabelHelpers.sanitizeForInObject(obj)) {
      if (Object.hasOwnProperty.call(obj, prop)) return false;
    }

    return true;
  }

  function isEmptyArray(o) {
    if (Array.isArray(o) && o.length == 0) return true;
    return false;
  }

  function getFieldName(field, prefix, isArrayItem, isArray) {
    if (isArray) return (prefix ? prefix : "") + (isNumber(field) ? "[" + field + "]" : "." + field);else if (isArrayItem) return (prefix ? prefix : "") + "[" + field + "]";else return (prefix ? prefix + "." : "") + field;
  }

  return recurse(obj, prefix, Array.isArray(obj));
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"intersectDeep.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/lib/intersectDeep.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var dot;
module.link("dot-object", {
  "default": function (v) {
    dot = v;
  }
}, 0);

var _;

module.link("meteor/underscore", {
  _: function (v) {
    _ = v;
  }
}, 1);
module.exportDefault(function (allowedBody, clientBody) {
  var allowedBodyDot = _.keys(dot.dot(allowedBody));

  var clientBodyDot = _.keys(dot.dot(clientBody));

  var intersection = _.intersection(allowedBodyDot, clientBodyDot);

  var build = {};
  intersection.forEach(function (intersectedField) {
    build[intersectedField] = 1;
  });
  return dot.object(build);
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"prepareForDelivery.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/lib/prepareForDelivery.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  applyPostFilters: function () {
    return applyPostFilters;
  },
  applyPostOptions: function () {
    return applyPostOptions;
  },
  getResultsArray: function () {
    return getResultsArray;
  },
  removeLinkStorages: function () {
    return removeLinkStorages;
  },
  storeOneResults: function () {
    return storeOneResults;
  },
  assembleMetadata: function () {
    return assembleMetadata;
  }
});
var applyReducers;
module.link("../reducers/lib/applyReducers", {
  "default": function (v) {
    applyReducers = v;
  }
}, 0);
var cleanReducerLeftovers;
module.link("../reducers/lib/cleanReducerLeftovers", {
  "default": function (v) {
    cleanReducerLeftovers = v;
  }
}, 1);
var sift;
module.link("sift", {
  "default": function (v) {
    sift = v;
  }
}, 2);
var Minimongo;
module.link("meteor/minimongo", {
  Minimongo: function (v) {
    Minimongo = v;
  }
}, 3);
module.exportDefault(function (node, params) {
  snapBackCaches(node);
  storeOneResults(node, node.results);
  applyReducers(node, params);

  _.each(node.collectionNodes, function (collectionNode) {
    cloneMetaChildren(collectionNode, node.results);
  });

  _.each(node.collectionNodes, function (collectionNode) {
    assembleMetadata(collectionNode, node.results);
  });

  cleanReducerLeftovers(node, node.results);
  removeLinkStorages(node, node.results);
  applyPostFilters(node);
  applyPostOptions(node);
  applyPostFilter(node, params);
});

function applyPostFilters(node) {
  var postFilters = node.props.$postFilters;

  if (postFilters) {
    node.results = sift(postFilters, node.results);
  }
}

function applyPostOptions(node) {
  var options = node.props.$postOptions;

  if (options) {
    if (options.sort) {
      var sorter = new Minimongo.Sorter(options.sort);
      node.results.sort(sorter.getComparator());
    }

    if (options.limit || options.skip) {
      var start = options.skip || 0;
      var end = options.limit ? options.limit + start : node.results.length;
      node.results = node.results.slice(start, end);
    }
  }
}

/**
 * Optionally applies a post filtering option
 */
function applyPostFilter(node, params) {
  if (node.props.$postFilter) {
    var filter = node.props.$postFilter;

    if (_.isArray(filter)) {
      filter.forEach(function (f) {
        node.results = f(node.results, params);
      });
    } else {
      node.results = filter(node.results, params);
    }
  }
}
/**
 *
 * Helper function which transforms results into the array.
 * Results are an object for 'one' links.
 *
 * @param results
 * @return array
 */


function getResultsArray(results) {
  if (_.isArray(results)) {
    return results;
  } else if (_.isUndefined(results)) {
    return [];
  }

  return [results];
}

function removeLinkStorages(node, sameLevelResults) {
  if (!sameLevelResults) {
    return;
  }

  sameLevelResults = getResultsArray(sameLevelResults);

  _.each(node.collectionNodes, function (collectionNode) {
    var removeStorageField = collectionNode.shouldCleanStorage;

    _.each(sameLevelResults, function (result) {
      if (removeStorageField) {
        if (collectionNode.isVirtual) {
          var childResults = getResultsArray(result[collectionNode.linkName]);

          _.each(childResults, function (childResult) {
            delete childResult[collectionNode.linkStorageField];
          });
        } else {
          delete result[collectionNode.linkStorageField];
        }
      }

      removeLinkStorages(collectionNode, result[collectionNode.linkName]);
    });
  });
}

function storeOneResults(node, sameLevelResults) {
  if (!sameLevelResults) {
    return;
  }

  node.collectionNodes.forEach(function (collectionNode) {
    _.each(sameLevelResults, function (result) {
      // The reason we are doing this is that if the requested link does not exist
      // It will fail when we try to get undefined[something] below
      if (result === undefined) {
        return;
      }

      storeOneResults(collectionNode, result[collectionNode.linkName]);
    });

    if (collectionNode.isOneResult) {
      _.each(sameLevelResults, function (result) {
        if (result[collectionNode.linkName] && _.isArray(result[collectionNode.linkName])) {
          result[collectionNode.linkName] = result[collectionNode.linkName] ? _.first(result[collectionNode.linkName]) : undefined;
        }
      });
    }
  });
}

function cloneMetaChildren(node, parentResults) {
  if (!parentResults) {
    return;
  }

  var linkName = node.linkName;
  var isMeta = node.isMeta; // parentResults might be an object (for type==one links)

  parentResults = getResultsArray(parentResults);
  parentResults.forEach(function (parentResult) {
    if (isMeta && parentResult[linkName]) {
      if (node.isOneResult) {
        parentResult[linkName] = Object.assign({}, parentResult[linkName]);
      } else {
        parentResult[linkName] = parentResult[linkName].map(function (object) {
          return Object.assign({}, object);
        });
      }
    }

    node.collectionNodes.forEach(function (collectionNode) {
      cloneMetaChildren(collectionNode, parentResult[linkName]);
    });
  });
}

function assembleMetadata(node, parentResults) {
  parentResults = getResultsArray(parentResults); // assembling metadata is depth first

  node.collectionNodes.forEach(function (collectionNode) {
    _.each(parentResults, function (result) {
      assembleMetadata(collectionNode, result[node.linkName]);
    });
  });

  if (node.isMeta) {
    if (node.isVirtual) {
      _.each(parentResults, function (parentResult) {
        var childResult = parentResult[node.linkName];

        if (node.isOneResult) {
          if (_.isObject(childResult)) {
            var storage = childResult[node.linkStorageField];
            storeMetadata(childResult, parentResult, storage, true);
          }
        } else {
          _.each(childResult, function (object) {
            var storage = object[node.linkStorageField];
            storeMetadata(object, parentResult, storage, true);
          });
        }
      });
    } else {
      _.each(parentResults, function (parentResult) {
        var childResult = parentResult[node.linkName];
        var storage = parentResult[node.linkStorageField];

        if (node.isOneResult) {
          if (childResult) {
            storeMetadata(childResult, parentResult, storage, false);
          }
        } else {
          _.each(childResult, function (object) {
            storeMetadata(object, parentResult, storage, false);
          });
        }
      });
    }
  }
}

function storeMetadata(element, parentElement, storage, isVirtual) {
  if (isVirtual) {
    var $metadata;

    if (_.isArray(storage)) {
      $metadata = _.find(storage, function (storageItem) {
        return storageItem._id == parentElement._id;
      });
    } else {
      $metadata = storage;
    }

    element.$metadata = _.omit($metadata, '_id');
  } else {
    var _$metadata;

    if (_.isArray(storage)) {
      _$metadata = _.find(storage, function (storageItem) {
        return storageItem._id == element._id;
      });
    } else {
      _$metadata = storage;
    }

    element.$metadata = _.omit(_$metadata, '_id');
  }
}

function snapBackCaches(node) {
  node.collectionNodes.forEach(function (collectionNode) {
    snapBackCaches(collectionNode);
  });

  if (!_.isEmpty(node.snapCaches)) {
    // process stuff
    _.each(node.snapCaches, function (linkName, cacheField) {
      var isSingle = _.contains(node.snapCachesSingles, cacheField);

      var linker = node.collection.getLinker(linkName); // we do this because for one direct and one meta direct, id is not stored

      var shoudStoreLinkStorage = !linker.isMany() && !linker.isVirtual();
      node.results.forEach(function (result) {
        if (result[cacheField]) {
          if (shoudStoreLinkStorage) {
            Object.assign(result[cacheField], {
              _id: linker.isMeta() ? result[linker.linkStorageField]._id : result[linker.linkStorageField]
            });
          }

          if (isSingle && _.isArray(result[cacheField])) {
            result[linkName] = _.first(result[cacheField]);
          } else {
            result[linkName] = result[cacheField];
          }

          delete result[cacheField];
        }
      });
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"prepareForProcess.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/lib/prepareForProcess.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var check, Match;
module.link("meteor/check", {
  check: function (v) {
    check = v;
  },
  Match: function (v) {
    Match = v;
  }
}, 0);
var deepClone;
module.link("lodash.clonedeep", {
  "default": function (v) {
    deepClone = v;
  }
}, 1);

function defaultFilterFunction(_ref) {
  var filters = _ref.filters,
      options = _ref.options,
      params = _ref.params;

  if (params.filters) {
    Object.assign(filters, params.filters);
  }

  if (params.options) {
    Object.assign(options, params.options);
  }
}

function applyFilterRecursive(data) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var isRoot = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (isRoot && !_.isFunction(data.$filter)) {
    data.$filter = defaultFilterFunction;
  }

  if (data.$filter) {
    check(data.$filter, Match.OneOf(Function, [Function]));
    data.$filters = data.$filters || {};
    data.$options = data.$options || {};

    if (_.isArray(data.$filter)) {
      data.$filter.forEach(function (filter) {
        filter.call(null, {
          filters: data.$filters,
          options: data.$options,
          params: params
        });
      });
    } else {
      data.$filter({
        filters: data.$filters,
        options: data.$options,
        params: params
      });
    }

    data.$filter = null;
    delete data.$filter;
  }

  _.each(data, function (value, key) {
    if (_.isObject(value)) {
      return applyFilterRecursive(value, params);
    }
  });
}

function applyPagination(body, _params) {
  if (body['$paginate'] && _params) {
    if (!body.$options) {
      body.$options = {};
    }

    if (_params.limit) {
      _.extend(body.$options, {
        limit: _params.limit
      });
    }

    if (_params.skip) {
      _.extend(body.$options, {
        skip: _params.skip
      });
    }

    delete body['$paginate'];
  }
}

module.exportDefault(function (_body) {
  var _params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var body = deepClone(_body);
  var params = deepClone(_params);
  applyPagination(body, params);
  applyFilterRecursive(body, params, true);
  return body;
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"recursiveFetch.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/lib/recursiveFetch.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var applyProps;
module.link("./applyProps.js", {
  "default": function (v) {
    applyProps = v;
  }
}, 0);
var assembleMetadata, removeLinkStorages, storeOneResults;
module.link("./prepareForDelivery", {
  assembleMetadata: function (v) {
    assembleMetadata = v;
  },
  removeLinkStorages: function (v) {
    removeLinkStorages = v;
  },
  storeOneResults: function (v) {
    storeOneResults = v;
  }
}, 1);
var prepareForDelivery;
module.link("./prepareForDelivery", {
  "default": function (v) {
    prepareForDelivery = v;
  }
}, 2);
var getNodeNamespace;
module.link("./createGraph", {
  getNodeNamespace: function (v) {
    getNodeNamespace = v;
  }
}, 3);

/**
 * This is always run client side to build the data graph out of client-side collections.
 *
 * @param node
 * @param parentObject
 * @param fetchOptions
 * @returns {*}
 */
function fetch(node, parentObject) {
  var fetchOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _applyProps = applyProps(node),
      filters = _applyProps.filters,
      options = _applyProps.options; // add subscription filter


  if (fetchOptions.scoped && fetchOptions.subscriptionHandle) {
    _.extend(filters, fetchOptions.subscriptionHandle.scopeQuery());
  } // add query path filter


  if (fetchOptions.scoped) {
    var _$extend;

    _.extend(filters, (_$extend = {}, _$extend["_query_path_" + getNodeNamespace(node)] = {
      $exists: true
    }, _$extend));
  }

  var results = [];

  if (parentObject) {
    var accessor = node.linker.createLink(parentObject, node.collection);

    if (node.isVirtual) {
      var _$extend2;

      options.fields = options.fields || {};

      _.extend(options.fields, (_$extend2 = {}, _$extend2[node.linkStorageField] = 1, _$extend2));
    }

    results = accessor.find(filters, options).fetch();
  } else {
    results = node.collection.find(filters, options).fetch();
  }

  _.each(node.collectionNodes, function (collectionNode) {
    _.each(results, function (result) {
      var _collectionNode$resul;

      var collectionNodeResults = fetch(collectionNode, result);
      result[collectionNode.linkName] = collectionNodeResults; //delete result[node.linker.linkStorageField];

      /**
       * Push into the results, because snapBackCaches() in prepareForDelivery does not work otherwise.
       * This is non-optimal, can we be sure that every item in results contains _id and add only if not in
       * the results?
       *
       * Other possible ways:
       * - do something like assemble() in storeHypernovaResults
       * - pass node.results to accessor above and find with sift
       */

      (_collectionNode$resul = collectionNode.results).push.apply(_collectionNode$resul, (0, _toConsumableArray2.default)(collectionNodeResults)); // this was not working because all references must be replaced in snapBackCaches, not only the ones that are 
      // found first
      // const currentIds = _.pluck(collectionNode.results, '_id');
      // collectionNode.results.push(...collectionNodeResults.filter(res => !_.contains(currentIds, res._id)));

    });
  });

  return results;
}

module.exportDefault(function (node, params, fetchOptions) {
  node.results = fetch(node, null, fetchOptions);
  prepareForDelivery(node, params);
  return node.results;
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"nodes":{"collectionNode.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/nodes/collectionNode.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

module.export({
  "default": function () {
    return CollectionNode;
  },
  runFieldSanityChecks: function () {
    return runFieldSanityChecks;
  }
});
var FieldNode;
module.link("./fieldNode.js", {
  "default": function (v) {
    FieldNode = v;
  }
}, 0);
var ReducerNode;
module.link("./reducerNode.js", {
  "default": function (v) {
    ReducerNode = v;
  }
}, 1);
var deepClone;
module.link("lodash.clonedeep", {
  "default": function (v) {
    deepClone = v;
  }
}, 2);
var check, Match;
module.link("meteor/check", {
  check: function (v) {
    check = v;
  },
  Match: function (v) {
    Match = v;
  }
}, 3);

var CollectionNode =
/*#__PURE__*/
function () {
  function CollectionNode(collection) {
    var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var linkName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    if (collection && !_.isObject(body)) {
      throw new Meteor.Error('invalid-body', "The field \"" + linkName + "\" is a collection link, and should have its body defined as an object.");
    }

    this.body = deepClone(body);
    this.linkName = linkName;
    this.collection = collection;
    this.nodes = [];
    this.props = {};
    this.parent = null;
    this.linker = null;
    this.linkStorageField = null;
    this.scheduledForDeletion = false;
    this.reducers = [];
    this.results = [];
    this.snapCaches = {}; // {cacheField: linkName}

    this.snapCachesSingles = []; // [cacheField1, cacheField2]
  }

  var _proto = CollectionNode.prototype;

  /**
   * Adds children to itself
   *
   * @param node
   * @param linker
   */
  _proto.add = function () {
    function add(node, linker) {
      node.parent = this;

      if (node instanceof FieldNode) {
        runFieldSanityChecks(node.name);
      }

      if (linker) {
        node.linker = linker;
        node.linkStorageField = linker.linkStorageField;
        node.isMeta = linker.isMeta();
        node.isVirtual = linker.isVirtual();
        node.isOneResult = linker.isOneResult();
        node.shouldCleanStorage = this._shouldCleanStorage(node);
      }

      this.nodes.push(node);
    }

    return add;
  }()
  /**
   * @param prop
   * @param value
   */
  ;

  _proto.addProp = function () {
    function addProp(prop, value) {
      var _$extend;

      if (prop === '$postFilter') {
        check(value, Match.OneOf(Function, [Function]));
      }

      _.extend(this.props, (_$extend = {}, _$extend[prop] = value, _$extend));
    }

    return addProp;
  }()
  /**
   * @param _node
   */
  ;

  _proto.remove = function () {
    function remove(_node) {
      this.nodes = _.filter(this.nodes, function (node) {
        return _node !== node;
      });
    }

    return remove;
  }()
  /**
   * @param filters
   * @param options
   */
  ;

  _proto.applyFields = function () {
    function applyFields(filters, options) {
      var hasAddedAnyField = false;

      _.each(this.fieldNodes, function (n) {
        /**
         * $meta field should be added to the options.fields, but MongoDB does not exclude other fields.
         * Therefore, we do not count this as a field addition.
         * 
         * See: https://docs.mongodb.com/manual/reference/operator/projection/meta/
         * The $meta expression specifies the inclusion of the field to the result set 
         * and does not specify the exclusion of the other fields.
         */
        if (n.projectionOperator !== '$meta') {
          hasAddedAnyField = true;
        }

        n.applyFields(options.fields);
      }); // it will only get here if it has collectionNodes children


      _.each(this.collectionNodes, function (collectionNode) {
        var linker = collectionNode.linker;

        if (linker && !linker.isVirtual()) {
          options.fields[linker.linkStorageField] = 1;
          hasAddedAnyField = true;
        }
      }); // if he selected filters, we should automatically add those fields


      _.each(filters, function (value, field) {
        // special handling for the $meta filter, conditional operators and text search
        if (!_.contains(['$or', '$nor', '$not', '$and', '$meta', '$text'], field)) {
          // if the field or the parent of the field already exists, don't add it
          if (!_.has(options.fields, field.split('.')[0])) {
            hasAddedAnyField = true;
            options.fields[field] = 1;
          }
        }
      });

      if (!hasAddedAnyField) {
        options.fields = (0, _objectSpread2.default)({
          _id: 1
        }, options.fields);
      }
    }

    return applyFields;
  }()
  /**
   * @param fieldName
   * @returns {boolean}
   */
  ;

  _proto.hasField = function () {
    function hasField(fieldName) {
      var checkNested = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      // for checkNested flag it expands profile.phone.verified into 
      // ['profile', 'profile.phone', 'profile.phone.verified']
      // if any of these fields match it means that field exists
      var options = checkNested ? fieldName.split('.').reduce(function (acc, key) {
        if (acc.length === 0) {
          return [key];
        }

        var _acc = (0, _slicedToArray2.default)(acc, 1),
            last = _acc[0];

        return [].concat((0, _toConsumableArray2.default)(acc), [last + "." + key]);
      }, []) : [fieldName];
      return !!_.find(this.fieldNodes, function (fieldNode) {
        return _.contains(options, fieldNode.name);
      });
    }

    return hasField;
  }()
  /**
   * @param fieldName
   * @returns {FieldNode}
   */
  ;

  _proto.getField = function () {
    function getField(fieldName) {
      return _.find(this.fieldNodes, function (fieldNode) {
        return fieldNode.name == fieldName;
      });
    }

    return getField;
  }()
  /**
   * @param name
   * @returns {boolean}
   */
  ;

  _proto.hasCollectionNode = function () {
    function hasCollectionNode(name) {
      return !!_.find(this.collectionNodes, function (node) {
        return node.linkName == name;
      });
    }

    return hasCollectionNode;
  }()
  /**
   * @param name
   * @returns {boolean}
   */
  ;

  _proto.hasReducerNode = function () {
    function hasReducerNode(name) {
      return !!_.find(this.reducerNodes, function (node) {
        return node.name == name;
      });
    }

    return hasReducerNode;
  }()
  /**
   * @param name
   * @returns {ReducerNode}
   */
  ;

  _proto.getReducerNode = function () {
    function getReducerNode(name) {
      return _.find(this.reducerNodes, function (node) {
        return node.name == name;
      });
    }

    return getReducerNode;
  }()
  /**
   * @param name
   * @returns {CollectionNode}
   */
  ;

  _proto.getCollectionNode = function () {
    function getCollectionNode(name) {
      return _.find(this.collectionNodes, function (node) {
        return node.linkName == name;
      });
    }

    return getCollectionNode;
  }()
  /**
   * @returns {*}
   */
  ;

  _proto.getName = function () {
    function getName() {
      return this.linkName ? this.linkName : this.collection ? this.collection._name : 'N/A';
    }

    return getName;
  }()
  /**
   * This is used for caching links
   *
   * @param cacheField
   * @param subLinkName
   */
  ;

  _proto.snapCache = function () {
    function snapCache(cacheField, subLinkName) {
      this.snapCaches[cacheField] = subLinkName;

      if (this.collection.getLinker(subLinkName).isOneResult()) {
        this.snapCachesSingles.push(cacheField);
      }
    }

    return snapCache;
  }()
  /**
   * This method verifies whether to remove the linkStorageField form the results
   * unless you specify it in your query.
   *
   * @param node
   * @returns {boolean}
   * @private
   */
  ;

  _proto._shouldCleanStorage = function () {
    function _shouldCleanStorage(node) {
      if (node.linkStorageField === '_id') {
        return false;
      } else {
        if (node.isVirtual) {
          return !node.hasField(node.linkStorageField);
        } else {
          return !this.hasField(node.linkStorageField);
        }
      }
    }

    return _shouldCleanStorage;
  }();

  (0, _createClass2.default)(CollectionNode, [{
    key: "collectionNodes",
    get: function () {
      return _.filter(this.nodes, function (n) {
        return n instanceof CollectionNode;
      });
    }
  }, {
    key: "fieldNodes",
    get: function () {
      return _.filter(this.nodes, function (n) {
        return n instanceof FieldNode;
      });
    }
  }, {
    key: "reducerNodes",
    get: function () {
      return _.filter(this.nodes, function (n) {
        return n instanceof ReducerNode;
      });
    }
  }]);
  return CollectionNode;
}();

function runFieldSanityChecks(fieldName) {
  // Run sanity checks on the field
  if (fieldName[0] === '$') {
    throw new Error("You are not allowed to use fields that start with $ inside a reducer's body: " + fieldName);
  }

  return true;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fieldNode.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/nodes/fieldNode.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  "default": function () {
    return FieldNode;
  }
});

var FieldNode =
/*#__PURE__*/
function () {
  function FieldNode(name, body) {
    var isProjectionOperator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    this.name = name;
    this.projectionOperator = isProjectionOperator ? _.keys(body)[0] : null;
    this.body = !_.isObject(body) || isProjectionOperator ? body : 1;
    this.scheduledForDeletion = false;
  }

  var _proto = FieldNode.prototype;

  _proto.applyFields = function () {
    function applyFields(fields) {
      fields[this.name] = this.body;
    }

    return applyFields;
  }();

  return FieldNode;
}();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"reducerNode.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/nodes/reducerNode.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  "default": function () {
    return ReducerNode;
  }
});

var ReducerNode =
/*#__PURE__*/
function () {
  function ReducerNode(name, _ref) {
    var body = _ref.body,
        reduce = _ref.reduce;
    this.name = name;
    this.body = body;
    this.reduceFunction = reduce;
    this.dependencies = []; // This is a list of the reducer this reducer uses.
  }
  /**
   * When computing we also pass the parameters
   * 
   * @param {*} object 
   * @param {*} args 
   */


  var _proto = ReducerNode.prototype;

  _proto.compute = function () {
    function compute(object) {
      var _this$reduce;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      object[this.name] = (_this$reduce = this.reduce).call.apply(_this$reduce, [this, object].concat(args));
    }

    return compute;
  }();

  _proto.reduce = function () {
    function reduce(object) {
      var _this$reduceFunction;

      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return (_this$reduceFunction = this.reduceFunction).call.apply(_this$reduceFunction, [this, object].concat(args));
    }

    return reduce;
  }();

  return ReducerNode;
}();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"reducers":{"extension.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/reducers/extension.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var check;
module.link("meteor/check", {
  check: function (v) {
    check = v;
  }
}, 0);
var addFieldMap;
module.link("./lib/addFieldMap", {
  "default": function (v) {
    addFieldMap = v;
  }
}, 1);
var storage = '__reducers';
Object.assign(Mongo.Collection.prototype, {
  /**
   * @param data
   */
  addReducers: function (data) {
    var _this = this;

    if (!this[storage]) {
      this[storage] = {};
    }

    _.each(data, function (reducerConfig, reducerName) {
      var _$extend;

      if (!_this[reducerConfig]) {
        _this[reducerConfig] = {};
      }

      if (_this.getLinker(reducerName)) {
        throw new Meteor.Error("You cannot add the reducer with name: " + reducerName + " because it is already defined as a link in " + _this._name + " collection");
      }

      if (_this[reducerConfig][reducerName]) {
        throw new Meteor.Error("You cannot add the reducer with name: " + reducerName + " because it was already added to " + _this._name + " collection");
      }

      check(reducerConfig, {
        body: Object,
        reduce: Function
      });

      _.extend(_this[storage], (_$extend = {}, _$extend[reducerName] = reducerConfig, _$extend));
    });
  },

  /**
   * @param name
   * @returns {*}
   */
  getReducer: function (name) {
    if (this[storage]) {
      return this[storage][name];
    }
  },

  /**
   * This creates reducers that makes sort of aliases for the database fields we use
   */
  addFieldMap: addFieldMap
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"addFieldMap.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/reducers/lib/addFieldMap.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  "default": function () {
    return addFieldMap;
  }
});

function addFieldMap(map) {
  var collection = this;
  var reducers = {};

  var _loop = function (key) {
    var _body;

    var dbField = map[key];
    reducers[key] = {
      body: (_body = {}, _body[dbField] = 1, _body),
      reduce: function (obj) {
        return obj[dbField];
      }
    };
  };

  for (var key in meteorBabelHelpers.sanitizeForInObject(map)) {
    _loop(key);
  }

  collection.addReducers(reducers);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"applyReducers.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/reducers/lib/applyReducers.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

module.export({
  "default": function () {
    return applyReducers;
  }
});

function applyReducers(root, params) {
  _.each(root.collectionNodes, function (node) {
    applyReducers(node, params);
  });

  var processedReducers = [];
  var reducersQueue = (0, _toConsumableArray2.default)(root.reducerNodes); // TODO: find out if there's an infinite reducer inter-deendency

  var _loop = function () {
    var reducerNode = reducersQueue.shift(); // If this reducer depends on other reducers

    if (reducerNode.dependencies.length) {
      // If there is an unprocessed reducer, move it at the end of the queue
      var allDependenciesComputed = _.all(reducerNode.dependencies, function (dep) {
        return processedReducers.includes(dep);
      });

      if (allDependenciesComputed) {
        root.results.forEach(function (result) {
          reducerNode.compute(result, params);
        });
        processedReducers.push(reducerNode.name);
      } else {
        // Move it at the end of the queue
        reducersQueue.push(reducerNode);
      }
    } else {
      root.results.forEach(function (result) {
        reducerNode.compute(result, params);
      });
      processedReducers.push(reducerNode.name);
    }
  };

  while (reducersQueue.length) {
    _loop();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cleanReducerLeftovers.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/reducers/lib/cleanReducerLeftovers.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  "default": function () {
    return cleanReducerLeftovers;
  }
});
var dot;
module.link("dot-object", {
  "default": function (v) {
    dot = v;
  }
}, 0);

function cleanReducerLeftovers(root, results) {
  _.each(root.collectionNodes, function (node) {
    if (node.scheduledForDeletion) {
      results.forEach(function (result) {
        delete result[node.linkName];
      });
    }
  });

  _.each(root.collectionNodes, function (node) {
    var childResults;

    if (node.isOneResult) {
      childResults = results.map(function (result) {
        return result[node.linkName];
      }).filter(function (element) {
        return !!element;
      });
    } else {
      childResults = _.flatten(results.map(function (result) {
        return result[node.linkName];
      }).filter(function (element) {
        return !!element;
      }));
    }

    cleanReducerLeftovers(node, childResults);
  });

  _.each(root.fieldNodes, function (node) {
    if (node.scheduledForDeletion) {
      cleanNestedFields(node.name.split('.'), results, root);
    }
  });

  _.each(root.reducerNodes, function (node) {
    if (node.scheduledForDeletion) {
      results.forEach(function (result) {
        delete result[node.name];
      });
    }
  });
}

// if we store a field like: 'profile.firstName'
// then we need to delete profile: { firstName }
// if profile will have empty keys, we need to delete profile.

/**
 * Cleans what reducers needed to be computed and not used.
 * @param parts
 * @param results
 */
function cleanNestedFields(parts, results, root) {
  var snapCacheField = root.snapCaches[parts[0]];
  var fieldName = snapCacheField ? snapCacheField : parts[0];

  if (parts.length === 1) {
    results.forEach(function (result) {
      if (_.isObject(result) && fieldName !== '_id') {
        delete result[fieldName];
      }
    });
    return;
  }

  parts.shift();
  cleanNestedFields(parts, results.filter(function (result) {
    return !!result[fieldName];
  }).map(function (result) {
    return result[fieldName];
  }), root);
  results.forEach(function (result) {
    if (_.isObject(result[fieldName]) && _.keys(result[fieldName]).length === 0) {
      if (fieldName !== '_id') {
        delete result[fieldName];
      }
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"createReducers.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/reducers/lib/createReducers.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  "default": function () {
    return addReducers;
  },
  handleAddElement: function () {
    return handleAddElement;
  },
  handleAddReducer: function () {
    return handleAddReducer;
  },
  handleAddLink: function () {
    return handleAddLink;
  },
  handleAddField: function () {
    return handleAddField;
  }
});
var dot;
module.link("dot-object", {
  "default": function (v) {
    dot = v;
  }
}, 0);
var createNodes;
module.link("../../lib/createGraph", {
  createNodes: function (v) {
    createNodes = v;
  }
}, 1);
var CollectionNode;
module.link("../../nodes/collectionNode", {
  "default": function (v) {
    CollectionNode = v;
  }
}, 2);
var FieldNode;
module.link("../../nodes/fieldNode", {
  "default": function (v) {
    FieldNode = v;
  }
}, 3);
var ReducerNode;
module.link("../../nodes/reducerNode", {
  "default": function (v) {
    ReducerNode = v;
  }
}, 4);
var embedReducerWithLink;
module.link("./embedReducerWithLink", {
  "default": function (v) {
    embedReducerWithLink = v;
  }
}, 5);
var specialFields;
module.link("../../lib/createGraph", {
  specialFields: function (v) {
    specialFields = v;
  }
}, 6);

function addReducers(root) {
  // we add reducers last, after we have added all the fields.
  root.reducerNodes.forEach(function (reducer) {
    _.each(reducer.body, function (body, fieldName) {
      handleAddElement(reducer, root, fieldName, body);
    });
  });
}

function handleAddElement(reducerNode, root, fieldName, body) {
  // if it's a link
  var collection = root.collection;
  var linker = collection.getLinker(fieldName);

  if (linker) {
    return handleAddLink(reducerNode, fieldName, body, root, linker);
  }

  var reducer = collection.getReducer(fieldName);

  if (reducer) {
    reducerNode.dependencies.push(fieldName);
    return handleAddReducer(fieldName, reducer, root);
  } // we assume it's a field in this case


  return handleAddField(fieldName, body, root);
}

function handleAddReducer(fieldName, _ref, root) {
  var body = _ref.body,
      reduce = _ref.reduce;

  if (!root.hasReducerNode(fieldName)) {
    var childReducerNode = new ReducerNode(fieldName, {
      body: body,
      reduce: reduce
    });
    root.add(childReducerNode);
    childReducerNode.scheduledForDeletion = true;

    _.each(childReducerNode.body, function (body, fieldName) {
      handleAddElement(childReducerNode, root, fieldName, body);
    });
  }
}

function handleAddLink(reducerNode, fieldName, body, parent, linker) {
  if (parent.hasCollectionNode(fieldName)) {
    var collectionNode = parent.getCollectionNode(fieldName);
    embedReducerWithLink(reducerNode, body, collectionNode);
  } else {
    // add
    var _collectionNode = new CollectionNode(linker.getLinkedCollection(), body, fieldName);

    _collectionNode.scheduledForDeletion = true;
    parent.add(_collectionNode, linker);
    createNodes(_collectionNode);
  }
}

function handleAddField(fieldName, body, root) {
  if (_.contains(specialFields, fieldName)) {
    root.addProp(fieldName, body);
    return;
  }

  if (_.isObject(body)) {
    var _dot$dot;

    // if reducer specifies a nested field
    // if it's a prop
    var dots = dot.dot((_dot$dot = {}, _dot$dot[fieldName] = body, _dot$dot));

    _.each(dots, function (value, key) {
      addFieldIfRequired(root, key, value);
    });
  } else {
    // if reducer does not specify a nested field, and the field does not exist.
    addFieldIfRequired(root, fieldName, body);
  }
}

function addFieldIfRequired(root, fieldName, body) {
  if (!root.hasField(fieldName, true)) {
    /**
     * Check if there are any nested fields for this field.
     * Adding root field here and scheduling for deletion would not work if there is already nested field, 
     * for example:
     * when trying to add meta: 1, it should be checked that there are no meta.* fields
     * */
    var nestedFields = root.fieldNodes.filter(function (_ref2) {
      var name = _ref2.name;
      return name.startsWith(fieldName + ".");
    }); // remove nested fields - important for minimongo which complains for these situations
    // TODO: excess fields are not removed (caused by adding the root field and removing nested fields) but there
    // should probably be a way to handle this in post-processing - for example by keeping a whitelist of fields
    // and removing anything else

    nestedFields.forEach(function (node) {
      return root.remove(node);
    });
    var fieldNode = new FieldNode(fieldName, body); // delete only if all nested fields are scheduled for deletion (that includes the case of 0 nested fields)

    fieldNode.scheduledForDeletion = nestedFields.every(function (field) {
      return field.scheduledForDeletion;
    });
    root.add(fieldNode);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"embedReducerWithLink.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/reducers/lib/embedReducerWithLink.js                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  "default": function () {
    return embedReducerWithLink;
  }
});
var handleAddField, handleAddElement, handleAddReducer;
module.link("./createReducers", {
  handleAddField: function (v) {
    handleAddField = v;
  },
  handleAddElement: function (v) {
    handleAddElement = v;
  },
  handleAddReducer: function (v) {
    handleAddReducer = v;
  }
}, 0);

function embedReducerWithLink(reducerNode, reducerBody, collectionNode) {
  _.each(reducerBody, function (value, key) {
    var collection = collectionNode.collection;

    if (_.isObject(value)) {
      // nested field or link
      if (collectionNode.body[key]) {
        // if it exists
        var linker = collection.getLinker(key); // if it's a link

        if (linker) {
          if (linker.isDenormalized()) {
            if (linker.isSubBodyDenormalized(value)) {
              var cacheField = linker.linkConfig.denormalize.field;
              handleAddField(cacheField, value, collectionNode);
              return;
            }
          }

          embedReducerWithLink(reducerNode, value, collectionNode.getCollectionNode(key));
          return;
        }

        handleAddField(key, value, collectionNode);
      } else {
        // does not exist, so it may be a link/reducer/field
        handleAddElement(reducerNode, collectionNode, key, value);
      }
    } else {
      // if this field or other reducer exists within the collection
      if (!collectionNode.body[key]) {
        // can only be field or another reducer for this.
        var reducer = collection.getReducer(key);

        if (reducer) {
          // if it's another reducer
          return handleAddReducer(key, reducer, collectionNode);
        }

        return handleAddField(key, value, collectionNode);
      }
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},"node_modules":{"lodash.clonedeep":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/cultofcoders_grapher/node_modules/lodash.clonedeep/package.json                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "lodash.clonedeep",
  "version": "4.5.0"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/cultofcoders_grapher/node_modules/lodash.clonedeep/index.js                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectCreate = Object.create,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, true, true);
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = cloneDeep;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"dot-object":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/cultofcoders_grapher/node_modules/dot-object/package.json                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "dot-object",
  "version": "1.5.4",
  "main": "index"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/cultofcoders_grapher/node_modules/dot-object/index.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
'use strict'

function _process (v, mod) {
  var i
  var r

  if (typeof mod === 'function') {
    r = mod(v)
    if (r !== undefined) {
      v = r
    }
  } else if (Array.isArray(mod)) {
    for (i = 0; i < mod.length; i++) {
      r = mod[i](v)
      if (r !== undefined) {
        v = r
      }
    }
  }

  return v
}

function parseKey (key, val) {
  // detect negative index notation
  if (key[0] === '-' && Array.isArray(val) && /^-\d+$/.test(key)) {
    return val.length + parseInt(key, 10)
  }
  return key
}

function isIndex (k) {
  return /^\d+/.test(k)
}

function parsePath (path, sep) {
  if (path.indexOf('[') >= 0) {
    path = path.replace(/\[/g, '.').replace(/]/g, '')
  }
  return path.split(sep)
}

function DotObject (seperator, override, useArray) {
  if (!(this instanceof DotObject)) {
    return new DotObject(seperator, override, useArray)
  }

  if (typeof seperator === 'undefined') seperator = '.'
  if (typeof override === 'undefined') override = false
  if (typeof useArray === 'undefined') useArray = true
  this.seperator = seperator
  this.override = override
  this.useArray = useArray

  // contains touched arrays
  this.cleanup = []
}

var dotDefault = new DotObject('.', false, true)
function wrap (method) {
  return function () {
    return dotDefault[method].apply(dotDefault, arguments)
  }
}

DotObject.prototype._fill = function (a, obj, v, mod) {
  var k = a.shift()

  if (a.length > 0) {
    obj[k] = obj[k] ||
      (this.useArray && isIndex(a[0]) ? [] : {})

    if (obj[k] !== Object(obj[k])) {
      if (this.override) {
        obj[k] = {}
      } else {
        throw new Error(
          'Trying to redefine `' + k + '` which is a ' + typeof obj[k]
        )
      }
    }

    this._fill(a, obj[k], v, mod)
  } else {
    if (!this.override &&
      obj[k] === Object(obj[k]) && Object.keys(obj[k]).length) {
      throw new Error("Trying to redefine non-empty obj['" + k + "']")
    }

    obj[k] = _process(v, mod)
  }
}

/**
 *
 * Converts an object with dotted-key/value pairs to it's expanded version
 *
 * Optionally transformed by a set of modifiers.
 *
 * Usage:
 *
 *   var row = {
 *     'nr': 200,
 *     'doc.name': '  My Document  '
 *   }
 *
 *   var mods = {
 *     'doc.name': [_s.trim, _s.underscored]
 *   }
 *
 *   dot.object(row, mods)
 *
 * @param {Object} obj
 * @param {Object} mods
 */
DotObject.prototype.object = function (obj, mods) {
  var self = this

  Object.keys(obj).forEach(function (k) {
    var mod = mods === undefined ? null : mods[k]
    // normalize array notation.
    var ok = parsePath(k, self.seperator).join(self.seperator)

    if (ok.indexOf(self.seperator) !== -1) {
      self._fill(ok.split(self.seperator), obj, obj[k], mod)
      delete obj[k]
    } else if (self.override) {
      obj[k] = _process(obj[k], mod)
    }
  })

  return obj
}

/**
 * @param {String} path dotted path
 * @param {String} v value to be set
 * @param {Object} obj object to be modified
 * @param {Function|Array} mod optional modifier
 */
DotObject.prototype.str = function (path, v, obj, mod) {
  if (path.indexOf(this.seperator) !== -1) {
    this._fill(path.split(this.seperator), obj, v, mod)
  } else if (!obj.hasOwnProperty(path) || this.override) {
    obj[path] = _process(v, mod)
  }

  return obj
}

/**
 *
 * Pick a value from an object using dot notation.
 *
 * Optionally remove the value
 *
 * @param {String} path
 * @param {Object} obj
 * @param {Boolean} remove
 */
DotObject.prototype.pick = function (path, obj, remove) {
  var i
  var keys
  var val
  var key
  var cp

  keys = parsePath(path, this.seperator)
  for (i = 0; i < keys.length; i++) {
    key = parseKey(keys[i], obj)
    if (obj && typeof obj === 'object' && key in obj) {
      if (i === (keys.length - 1)) {
        if (remove) {
          val = obj[key]
          delete obj[key]
          if (Array.isArray(obj)) {
            cp = keys.slice(0, -1).join('.')
            if (this.cleanup.indexOf(cp) === -1) {
              this.cleanup.push(cp)
            }
          }
          return val
        } else {
          return obj[key]
        }
      } else {
        obj = obj[key]
      }
    } else {
      return undefined
    }
  }
  if (remove && Array.isArray(obj)) {
    obj = obj.filter(function (n) { return n !== undefined })
  }
  return obj
}

/**
 *
 * Remove value from an object using dot notation.
 *
 * @param {String} path
 * @param {Object} obj
 * @return {Mixed} The removed value
 */
DotObject.prototype.remove = function (path, obj) {
  var i

  this.cleanup = []
  if (Array.isArray(path)) {
    for (i = 0; i < path.length; i++) {
      this.pick(path[i], obj, true)
    }
    this._cleanup(obj)
    return obj
  } else {
    return this.pick(path, obj, true)
  }
}

DotObject.prototype._cleanup = function (obj) {
  var ret
  var i
  var keys
  var root
  if (this.cleanup.length) {
    for (i = 0; i < this.cleanup.length; i++) {
      keys = this.cleanup[i].split('.')
      root = keys.splice(0, -1).join('.')
      ret = root ? this.pick(root, obj) : obj
      ret = ret[keys[0]].filter(function (v) { return v !== undefined })
      this.set(this.cleanup[i], ret, obj)
    }
    this.cleanup = []
  }
}

// alias method
DotObject.prototype.del = DotObject.prototype.remove

/**
 *
 * Move a property from one place to the other.
 *
 * If the source path does not exist (undefined)
 * the target property will not be set.
 *
 * @param {String} source
 * @param {String} target
 * @param {Object} obj
 * @param {Function|Array} mods
 * @param {Boolean} merge
 */
DotObject.prototype.move = function (source, target, obj, mods, merge) {
  if (typeof mods === 'function' || Array.isArray(mods)) {
    this.set(target, _process(this.pick(source, obj, true), mods), obj, merge)
  } else {
    merge = mods
    this.set(target, this.pick(source, obj, true), obj, merge)
  }

  return obj
}

/**
 *
 * Transfer a property from one object to another object.
 *
 * If the source path does not exist (undefined)
 * the property on the other object will not be set.
 *
 * @param {String} source
 * @param {String} target
 * @param {Object} obj1
 * @param {Object} obj2
 * @param {Function|Array} mods
 * @param {Boolean} merge
 */
DotObject.prototype.transfer = function (source, target, obj1, obj2, mods, merge) {
  if (typeof mods === 'function' || Array.isArray(mods)) {
    this.set(target,
      _process(
        this.pick(source, obj1, true),
        mods
      ), obj2, merge)
  } else {
    merge = mods
    this.set(target, this.pick(source, obj1, true), obj2, merge)
  }

  return obj2
}

/**
 *
 * Copy a property from one object to another object.
 *
 * If the source path does not exist (undefined)
 * the property on the other object will not be set.
 *
 * @param {String} source
 * @param {String} target
 * @param {Object} obj1
 * @param {Object} obj2
 * @param {Function|Array} mods
 * @param {Boolean} merge
 */
DotObject.prototype.copy = function (source, target, obj1, obj2, mods, merge) {
  if (typeof mods === 'function' || Array.isArray(mods)) {
    this.set(target,
      _process(
        // clone what is picked
        JSON.parse(
          JSON.stringify(
            this.pick(source, obj1, false)
          )
        ),
        mods
      ), obj2, merge)
  } else {
    merge = mods
    this.set(target, this.pick(source, obj1, false), obj2, merge)
  }

  return obj2
}

function isObject (val) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

/**
 *
 * Set a property on an object using dot notation.
 *
 * @param {String} path
 * @param {Mixed} val
 * @param {Object} obj
 * @param {Boolean} merge
 */
DotObject.prototype.set = function (path, val, obj, merge) {
  var i
  var k
  var keys
  var key

  // Do not operate if the value is undefined.
  if (typeof val === 'undefined') {
    return obj
  }
  keys = parsePath(path, this.seperator)

  for (i = 0; i < keys.length; i++) {
    key = keys[i]
    if (i === (keys.length - 1)) {
      if (merge && isObject(val) && isObject(obj[key])) {
        for (k in val) {
          if (val.hasOwnProperty(k)) {
            obj[key][k] = val[k]
          }
        }
      } else if (merge && Array.isArray(obj[key]) && Array.isArray(val)) {
        for (var j = 0; j < val.length; j++) {
          obj[keys[i]].push(val[j])
        }
      } else {
        obj[key] = val
      }
    } else if (
      // force the value to be an object
      !obj.hasOwnProperty(key) ||
      (!isObject(obj[key]) && !Array.isArray(obj[key]))
    ) {
      // initialize as array if next key is numeric
      if (/^\d+$/.test(keys[i + 1])) {
        obj[key] = []
      } else {
        obj[key] = {}
      }
    }
    obj = obj[key]
  }
  return obj
}

/**
 *
 * Transform an object
 *
 * Usage:
 *
 *   var obj = {
 *     "id": 1,
  *    "some": {
  *      "thing": "else"
  *    }
 *   }
 *
 *   var transform = {
 *     "id": "nr",
  *    "some.thing": "name"
 *   }
 *
 *   var tgt = dot.transform(transform, obj)
 *
 * @param {Object} recipe Transform recipe
 * @param {Object} obj Object to be transformed
 * @param {Array} mods modifiers for the target
 */
DotObject.prototype.transform = function (recipe, obj, tgt) {
  obj = obj || {}
  tgt = tgt || {}
  Object.keys(recipe).forEach(function (key) {
    this.set(recipe[key], this.pick(key, obj), tgt)
  }.bind(this))
  return tgt
}

/**
 *
 * Convert object to dotted-key/value pair
 *
 * Usage:
 *
 *   var tgt = dot.dot(obj)
 *
 *   or
 *
 *   var tgt = {}
 *   dot.dot(obj, tgt)
 *
 * @param {Object} obj source object
 * @param {Object} tgt target object
 * @param {Array} path path array (internal)
 */
DotObject.prototype.dot = function (obj, tgt, path) {
  tgt = tgt || {}
  path = path || []
  Object.keys(obj).forEach(function (key) {
    if (Object(obj[key]) === obj[key] && (Object.prototype.toString.call(obj[key]) === '[object Object]') || Object.prototype.toString.call(obj[key]) === '[object Array]') {
      return this.dot(obj[key], tgt, path.concat(key))
    } else {
      tgt[path.concat(key).join(this.seperator)] = obj[key]
    }
  }.bind(this))
  return tgt
}

DotObject.pick = wrap('pick')
DotObject.move = wrap('move')
DotObject.transfer = wrap('transfer')
DotObject.transform = wrap('transform')
DotObject.copy = wrap('copy')
DotObject.object = wrap('object')
DotObject.str = wrap('str')
DotObject.set = wrap('set')
DotObject.del = DotObject.remove = wrap('remove')
DotObject.dot = wrap('dot')

;['override', 'overwrite'].forEach(function (prop) {
  Object.defineProperty(DotObject, prop, {
    get: function () {
      return dotDefault.override
    },
    set: function (val) {
      dotDefault.override = !!val
    }
  })
})

Object.defineProperty(DotObject, 'useArray', {
  get: function () {
    return dotDefault.useArray
  },
  set: function (val) {
    dotDefault.useArray = val
  }
})

DotObject._process = _process

module.exports = DotObject;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"sift":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/cultofcoders_grapher/node_modules/sift/package.json                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "sift",
  "version": "3.2.6",
  "main": "./sift.js"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sift.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/cultofcoders_grapher/node_modules/sift/sift.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/*
 * Sift 3.x
 *
 * Copryright 2015, Craig Condon
 * Licensed under MIT
 *
 * Filter JavaScript objects with mongodb queries
 */

(function() {

  'use strict';

  /**
   */

  function isFunction(value) {
    return typeof value === 'function';
  }

  /**
   */

  function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  }

  /**
   */

  function comparable(value) {
    if (value instanceof Date) {
      return value.getTime();
    } else if (value instanceof Array) {
      return value.map(comparable);
    } else {
      return value;
    }
  }

  function get(obj, key) {
    if (obj.get) return obj.get(key);
    return obj[key];
  }

  /**
   */

  function or(validator) {
    return function(a, b) {
      if (!isArray(b) || !b.length) return validator(a, b);
      for (var i = 0, n = b.length; i < n; i++) if (validator(a, get(b,i))) return true;
      return false;
    }
  }

  /**
   */

  function and(validator) {
    return function(a, b) {
      if (!isArray(b) || !b.length) return validator(a, b);
      for (var i = 0, n = b.length; i < n; i++) if (!validator(a, get(b, i))) return false;
      return true;
    };
  }

  function validate(validator, b) {
    return validator.v(validator.a, b);
  }


  var operator = {

    /**
     */

    $eq: or(function(a, b) {
      return a(b);
    }),

    /**
     */

    $ne: and(function(a, b) {
      return !a(b);
    }),

    /**
     */

    $or: function(a, b) {
      for (var i = 0, n = a.length; i < n; i++) if (validate(get(a, i), b)) return true;
      return false;
    },

    /**
     */

    $gt: or(function(a, b) {
      return sift.compare(comparable(b), a) > 0;
    }),

    /**
     */

    $gte: or(function(a, b) {
      return sift.compare(comparable(b), a) >= 0;
    }),

    /**
     */

    $lt: or(function(a, b) {
      return sift.compare(comparable(b), a) < 0;
    }),

    /**
     */

    $lte: or(function(a, b) {
      return sift.compare(comparable(b), a) <= 0;
    }),

    /**
     */

    $mod: or(function(a, b) {
      return b % a[0] == a[1];
    }),

    /**
     */

    $in: function(a, b) {

      if (b instanceof Array) {
        for (var i = b.length; i--;) {
          if (~a.indexOf(comparable(get(b, i)))) return true;
        }
      } else {
        return !!~a.indexOf(comparable(b));
      }

      return false;
    },

    /**
     */

    $nin: function(a, b) {
      return !operator.$in(a, b);
    },

    /**
     */

    $not: function(a, b) {
      return !validate(a, b);
    },

    /**
     */

    $type: function(a, b) {
      return b != void 0 ? b instanceof a || b.constructor == a : false;
     },

    /**
     */

    $all: function(a, b) {
      if (!b) b = [];
      for (var i = a.length; i--;) {
        if (!~comparable(b).indexOf(get(a, i))) return false;
      }
      return true;
    },

    /**
     */

    $size: function(a, b) {
      return b ? a === b.length : false;
    },

    /**
     */

    $nor: function(a, b) {
      // todo - this suffice? return !operator.$in(a)
      for (var i = 0, n = a.length; i < n; i++) if (validate(get(a, i), b)) return false;
      return true;
    },

    /**
     */

    $and: function(a, b) {
      for (var i = 0, n = a.length; i < n; i++) if (!validate(get(a, i), b)) return false;
      return true;
    },

    /**
     */

    $regex: or(function(a, b) {
      return typeof b === 'string' && a.test(b);
    }),

    /**
     */

    $where: function(a, b) {
      return a.call(b, b);
    },

    /**
     */

    $elemMatch: function(a, b) {
      if (isArray(b)) return !!~search(b, a);
      return validate(a, b);
    },

    /**
     */

    $exists: function(a, b) {
      return (b != void 0) === a;
    }
  };

  /**
   */

  var prepare = {

    /**
     */

    $eq: function(a) {

      if (a instanceof RegExp) {
        return function(b) {
          return typeof b === 'string' && a.test(b);
        };
      } else if (a instanceof Function) {
        return a;
      } else if (isArray(a) && !a.length) {
        // Special case of a == []
        return function(b) {
          return (isArray(b) && !b.length);
        };
      } else if (a === null){
        return function(b){
          //will match both null and undefined
          return b == null;
        }
      }

      return function(b) {
        return sift.compare(comparable(b), a) === 0;
      };
    },

    /**
     */

    $ne: function(a) {
      return prepare.$eq(a);
    },

    /**
     */

    $and: function(a) {
      return a.map(parse);
    },

    /**
     */

    $or: function(a) {
      return a.map(parse);
    },

    /**
     */

    $nor: function(a) {
      return a.map(parse);
    },

    /**
     */

    $not: function(a) {
      return parse(a);
    },

    /**
     */

    $regex: function(a, query) {
      return new RegExp(a, query.$options);
    },

    /**
     */

    $where: function(a) {
      return typeof a === 'string' ? new Function('obj', 'return ' + a) : a;
    },

    /**
     */

    $elemMatch: function(a) {
      return parse(a);
    },

    /**
     */

    $exists: function(a) {
      return !!a;
    }
  };

  /**
   */

  function search(array, validator) {

    for (var i = 0; i < array.length; i++) {
      if (validate(validator, get(array, i))) {
        return i;
      }
    }

    return -1;
  }

  /**
   */

  function createValidator(a, validate) {
    return { a: a, v: validate };
  }

  /**
   */

  function nestedValidator(a, b) {
    var values  = [];
    findValues(b, a.k, 0, values);

    if (values.length === 1) {
      return validate(a.nv, values[0]);
    }

    return !!~search(values, a.nv);
  }

  /**
   */

  function findValues(current, keypath, index, values) {

    if (index === keypath.length || current == void 0) {
      values.push(current);
      return;
    }

    var k = get(keypath, index);

    // ensure that if current is an array, that the current key
    // is NOT an array index. This sort of thing needs to work:
    // sift({'foo.0':42}, [{foo: [42]}]);
    if (isArray(current) && isNaN(Number(k))) {
      for (var i = 0, n = current.length; i < n; i++) {
        findValues(get(current, i), keypath, index, values);
      }
    } else {
      findValues(get(current, k), keypath, index + 1, values);
    }
  }

  /**
   */

  function createNestedValidator(keypath, a) {
    return { a: { k: keypath, nv: a }, v: nestedValidator };
  }

  /**
   * flatten the query
   */

  function parse(query) {
    query = comparable(query);

    if (!query || (query.constructor.toString() !== 'Object' &&
        query.constructor.toString().replace(/\n/g,'').replace(/ /g, '') !== 'functionObject(){[nativecode]}')) { // cross browser support
      query = { $eq: query };
    }

    var validators = [];

    for (var key in query) {
      var a = query[key];

      if (key === '$options') continue;

      if (operator[key]) {
        if (prepare[key]) a = prepare[key](a, query);
        validators.push(createValidator(comparable(a), operator[key]));
      } else {

        if (key.charCodeAt(0) === 36) {
          throw new Error('Unknown operation ' + key);
        }

        validators.push(createNestedValidator(key.split('.'), parse(a)));
      }
    }

    return validators.length === 1 ? validators[0] : createValidator(validators, operator.$and);
  }

  /**
   */

  function createRootValidator(query, getter) {
    var validator = parse(query);
    if (getter) {
      validator = {
        a: validator,
        v: function(a, b) {
          return validate(a, getter(b));
        }
      };
    }
    return validator;
  }

  /**
   */

  function sift(query, array, getter) {

    if (isFunction(array)) {
      getter = array;
      array  = void 0;
    }

    var validator = createRootValidator(query, getter);

    function filter(b) {
      return validate(validator, b);
    }

    if (array) {
      return array.filter(filter);
    }

    return filter;
  }

  /**
   */

  sift.use = function(plugin) {
    if (isFunction(plugin)) return plugin(sift);
    for (var key in plugin) {
      if (key.charCodeAt(0) === 36) operator[key] = plugin[key];
    }
  };

  /**
   */

  sift.indexOf = function(query, array, getter) {
    return search(array, createRootValidator(query, getter));
  };

  /**
   */

  sift.compare = function(a, b) {
    if(a===b) return 0;
    if(typeof a === typeof b) {
      if (a > b) return 1;
      if (a < b) return -1;
    }
  };

  /* istanbul ignore next */
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = sift;
  }

  if (typeof window !== 'undefined') {
    window.sift = sift;
  }
})();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"deep-extend":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/cultofcoders_grapher/node_modules/deep-extend/package.json                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "deep-extend",
  "version": "0.5.0",
  "main": "lib/deep-extend.js"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"deep-extend.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/cultofcoders_grapher/node_modules/deep-extend/lib/deep-extend.js                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/*!
 * @description Recursive object extending
 * @author Viacheslav Lotsmanov <lotsmanov89@gmail.com>
 * @license MIT
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013-2015 Viacheslav Lotsmanov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

function isSpecificValue(val) {
	return (
		val instanceof Buffer
		|| val instanceof Date
		|| val instanceof RegExp
	) ? true : false;
}

function cloneSpecificValue(val) {
	if (val instanceof Buffer) {
		var x = new Buffer(val.length);
		val.copy(x);
		return x;
	} else if (val instanceof Date) {
		return new Date(val.getTime());
	} else if (val instanceof RegExp) {
		return new RegExp(val);
	} else {
		throw new Error('Unexpected situation');
	}
}

/**
 * Recursive cloning array.
 */
function deepCloneArray(arr) {
	var clone = [];
	arr.forEach(function (item, index) {
		if (typeof item === 'object' && item !== null) {
			if (Array.isArray(item)) {
				clone[index] = deepCloneArray(item);
			} else if (isSpecificValue(item)) {
				clone[index] = cloneSpecificValue(item);
			} else {
				clone[index] = deepExtend({}, item);
			}
		} else {
			clone[index] = item;
		}
	});
	return clone;
}

/**
 * Extening object that entered in first argument.
 *
 * Returns extended object or false if have no target object or incorrect type.
 *
 * If you wish to clone source object (without modify it), just use empty new
 * object as first argument, like this:
 *   deepExtend({}, yourObj_1, [yourObj_N]);
 */
var deepExtend = module.exports = function (/*obj_1, [obj_2], [obj_N]*/) {
	if (arguments.length < 1 || typeof arguments[0] !== 'object') {
		return false;
	}

	if (arguments.length < 2) {
		return arguments[0];
	}

	var target = arguments[0];

	// convert arguments to array and cut off target object
	var args = Array.prototype.slice.call(arguments, 1);

	var val, src, clone;

	args.forEach(function (obj) {
		// skip argument if isn't an object, is null, or is an array
		if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
			return;
		}

		Object.keys(obj).forEach(function (key) {
			src = target[key]; // source value
			val = obj[key]; // new value

			// recursion prevention
			if (val === target) {
				return;

			/**
			 * if new value isn't object then just overwrite by new value
			 * instead of extending.
			 */
			} else if (typeof val !== 'object' || val === null) {
				target[key] = val;
				return;

			// just clone arrays (and recursive clone objects inside)
			} else if (Array.isArray(val)) {
				target[key] = deepCloneArray(val);
				return;

			// custom cloning and overwrite for specific objects
			} else if (isSpecificValue(val)) {
				target[key] = cloneSpecificValue(val);
				return;

			// overwrite by new value if source isn't object or array
			} else if (typeof src !== 'object' || src === null || Array.isArray(src)) {
				target[key] = deepExtend({}, val);
				return;

			// source value and new value is objects both, extending...
			} else {
				target[key] = deepExtend(src, val);
				return;
			}
		});
	});

	return target;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/cultofcoders:grapher/main.client.js");

/* Exports */
Package._define("cultofcoders:grapher", exports);

})();
