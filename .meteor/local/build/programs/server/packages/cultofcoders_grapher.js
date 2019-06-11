(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var Promise = Package.promise.Promise;
var check = Package.check.check;
var Match = Package.check.Match;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var enableDebugLogging = Package['reywood:publish-composite'].enableDebugLogging;
var publishComposite = Package['reywood:publish-composite'].publishComposite;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;

/* Package-scope variables */
var key, ids, what, params, body, cacher, dotize;

var require = meteorInstall({"node_modules":{"meteor":{"cultofcoders:grapher":{"main.server.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/main.server.js                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  NamedQueryStore: () => NamedQueryStore,
  LinkConstants: () => LinkConstants
});
module.link("./lib/extension.js");
module.link("./lib/aggregate");
module.link("./lib/exposure/extension.js");
module.link("./lib/links/extension.js");
module.link("./lib/query/reducers/extension.js");
module.link("./lib/namedQuery/expose/extension.js");
let NamedQueryStore;
module.link("./lib/namedQuery/store", {
  default(v) {
    NamedQueryStore = v;
  }

}, 0);
let LinkConstants;
module.link("./lib/links/constants", {
  default(v) {
    LinkConstants = v;
  }

}, 1);
module.link("./lib/createQuery.js", {
  default: "createQuery"
}, 2);
module.link("./lib/exposure/exposure.js", {
  default: "Exposure"
}, 3);
module.link("./lib/namedQuery/cache/MemoryResultCacher", {
  default: "MemoryResultCacher"
}, 4);
module.link("./lib/namedQuery/cache/BaseResultCacher", {
  default: "BaseResultCacher"
}, 5);
module.link("./lib/compose", {
  default: "compose"
}, 6);
module.link("./lib/graphql", {
  "*": "*"
}, 7);
module.link("./lib/db", {
  default: "db"
}, 8);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"aggregate.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/aggregate.js                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Promise;
module.link("meteor/promise", {
  Promise(v) {
    Promise = v;
  }

}, 0);

Mongo.Collection.prototype.aggregate = function (pipelines, options = {}) {
  const coll = this.rawCollection();
  let result = Meteor.wrapAsync(coll.aggregate, coll)(pipelines, options); // We need to check If it's an AggregationCursor
  // The reason we do this was because of the upgrade to 1.7 which involved a mongodb driver update

  if (Array.isArray(result)) {
    return result;
  } else {
    return Promise.await(result.toArray());
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"compose.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/compose.js                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let deepExtend;
module.link("deep-extend", {
  default(v) {
    deepExtend = v;
  }

}, 0);
module.exportDefault(function (...args) {
  return deepExtend({}, ...args);
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"createQuery.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/createQuery.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Query;
module.link("./query/query.js", {
  default(v) {
    Query = v;
  }

}, 0);
let NamedQuery;
module.link("./namedQuery/namedQuery.js", {
  default(v) {
    NamedQuery = v;
  }

}, 1);
let NamedQueryStore;
module.link("./namedQuery/store.js", {
  default(v) {
    NamedQueryStore = v;
  }

}, 2);
module.exportDefault((...args) => {
  if (typeof args[0] === 'string') {
    let [name, body, options] = args;
    options = options || {}; // It's a resolver query

    if (_.isFunction(body)) {
      return createNamedQuery(name, null, body, options);
    }

    const entryPointName = _.first(_.keys(body));

    const collection = Mongo.Collection.get(entryPointName);

    if (!collection) {
      throw new Meteor.Error('invalid-name', `We could not find any collection with the name "${entryPointName}". Make sure it is imported prior to using this`);
    }

    return createNamedQuery(name, collection, body[entryPointName], options);
  } else {
    // Query Creation, it can have an endpoint as collection or as a NamedQuery
    let [body, options] = args;
    options = options || {};

    const entryPointName = _.first(_.keys(body));

    const collection = Mongo.Collection.get(entryPointName);

    if (!collection) {
      if (Meteor.isDevelopment && !NamedQueryStore.get(entryPointName)) {
        console.warn(`You are creating a query with the entry point "${entryPointName}", but there was no collection found for it (maybe you forgot to import it client-side?). It's assumed that it's referencing a NamedQuery.`);
      }

      return createNamedQuery(entryPointName, null, {}, {
        params: body[entryPointName]
      });
    } else {
      return createNormalQuery(collection, body[entryPointName], options);
    }
  }
});

function createNamedQuery(name, collection, body, options = {}) {
  // if it exists already, we re-use it
  const namedQuery = NamedQueryStore.get(name);
  let query;

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

},"db.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/db.js                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
const db = new Proxy({}, {
  get: function (obj, prop) {
    if (typeof prop === 'symbol') {
      return obj[prop];
    }

    const collection = Mongo.Collection.get(prop);

    if (!collection) {
      return obj[prop];
    }

    return collection;
  }
});
module.exportDefault(db);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"extension.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/extension.js                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Query;
module.link("./query/query.js", {
  default(v) {
    Query = v;
  }

}, 0);
let NamedQuery;
module.link("./namedQuery/namedQuery.js", {
  default(v) {
    NamedQuery = v;
  }

}, 1);
let NamedQueryStore;
module.link("./namedQuery/store.js", {
  default(v) {
    NamedQueryStore = v;
  }

}, 2);

_.extend(Mongo.Collection.prototype, {
  createQuery(...args) {
    if (typeof args[0] === 'string') {
      //NamedQuery
      const [name, body, options] = args;
      const query = new NamedQuery(name, this, body, options);
      NamedQueryStore.add(name, query);
      return query;
    } else {
      const [body, options] = args;
      return new Query(this, body, options);
    }
  }

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"exposure":{"exposure.config.schema.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/exposure/exposure.config.schema.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  ExposureDefaults: () => ExposureDefaults,
  ExposureSchema: () => ExposureSchema,
  validateBody: () => validateBody
});
let createGraph;
module.link("../query/lib/createGraph.js", {
  default(v) {
    createGraph = v;
  }

}, 0);
let Match;
module.link("meteor/check", {
  Match(v) {
    Match = v;
  }

}, 1);
const ExposureDefaults = {
  blocking: false,
  method: true,
  publication: true
};
const ExposureSchema = {
  firewall: Match.Maybe(Match.OneOf(Function, [Function])),
  maxLimit: Match.Maybe(Match.Integer),
  maxDepth: Match.Maybe(Match.Integer),
  publication: Match.Maybe(Boolean),
  method: Match.Maybe(Boolean),
  blocking: Match.Maybe(Boolean),
  body: Match.Maybe(Object),
  restrictedFields: Match.Maybe([String]),
  restrictLinks: Match.Maybe(Match.OneOf(Function, [String]))
};

function validateBody(collection, body) {
  try {
    createGraph(collection, body);
  } catch (e) {
    throw new Meteor.Error('invalid-body', 'We could not build a valid graph when trying to create your exposure: ' + e.toString());
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"exposure.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/exposure/exposure.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => Exposure
});
let genCountEndpoint;
module.link("../query/counts/genEndpoint.server.js", {
  default(v) {
    genCountEndpoint = v;
  }

}, 0);
let createGraph;
module.link("../query/lib/createGraph.js", {
  default(v) {
    createGraph = v;
  }

}, 1);
let recursiveCompose;
module.link("../query/lib/recursiveCompose.js", {
  default(v) {
    recursiveCompose = v;
  }

}, 2);
let hypernova;
module.link("../query/hypernova/hypernova.js", {
  default(v) {
    hypernova = v;
  }

}, 3);
let ExposureSchema, ExposureDefaults, validateBody;
module.link("./exposure.config.schema.js", {
  ExposureSchema(v) {
    ExposureSchema = v;
  },

  ExposureDefaults(v) {
    ExposureDefaults = v;
  },

  validateBody(v) {
    validateBody = v;
  }

}, 4);
let enforceMaxDepth;
module.link("./lib/enforceMaxDepth.js", {
  default(v) {
    enforceMaxDepth = v;
  }

}, 5);
let enforceMaxLimit;
module.link("./lib/enforceMaxLimit.js", {
  default(v) {
    enforceMaxLimit = v;
  }

}, 6);
let cleanBody;
module.link("./lib/cleanBody.js", {
  default(v) {
    cleanBody = v;
  }

}, 7);
let deepClone;
module.link("lodash.clonedeep", {
  default(v) {
    deepClone = v;
  }

}, 8);
let restrictFieldsFn;
module.link("./lib/restrictFields.js", {
  default(v) {
    restrictFieldsFn = v;
  }

}, 9);
let restrictLinks;
module.link("./lib/restrictLinks.js", {
  default(v) {
    restrictLinks = v;
  }

}, 10);
let check;
module.link("meteor/check", {
  check(v) {
    check = v;
  }

}, 11);
let globalConfig = {};

class Exposure {
  static setConfig(config) {
    Object.assign(globalConfig, config);
  }

  static getConfig() {
    return globalConfig;
  }

  static restrictFields(...args) {
    return restrictFieldsFn(...args);
  }

  constructor(collection, config = {}) {
    collection.__isExposedForGrapher = true;
    collection.__exposure = this;
    this.collection = collection;
    this.name = `exposure_${collection._name}`;
    this.config = config;

    this._validateAndClean();

    this.initSecurity();

    if (this.config.publication) {
      this.initPublication();
    }

    if (this.config.method) {
      this.initMethod();
    }

    if (!this.config.method && !this.config.publication) {
      throw new Meteor.Error('weird', 'If you want to expose your collection you need to specify at least one of ["method", "publication"] options to true');
    }

    this.initCountMethod();
    this.initCountPublication();
  }

  _validateAndClean() {
    if (typeof this.config === 'function') {
      const firewall = this.config;
      this.config = {
        firewall
      };
    }

    this.config = Object.assign({}, ExposureDefaults, Exposure.getConfig(), this.config);
    check(this.config, ExposureSchema);

    if (this.config.body) {
      validateBody(this.collection, this.config.body);
    }
  }
  /**
   * Takes the body and intersects it with the exposure body, if it exists.
   *
   * @param body
   * @param userId
   * @returns {*}
   */


  getTransformedBody(body, userId) {
    if (!this.config.body) {
      return body;
    }

    const processedBody = this.getBody(userId);

    if (processedBody === true) {
      return;
    }

    return cleanBody(processedBody, body);
  }
  /**
   * Gets the exposure body
   */


  getBody(userId) {
    if (!this.config.body) {
      throw new Meteor.Error('missing-body', 'Cannot get exposure body because it was not defined.');
    }

    let body;

    if (_.isFunction(this.config.body)) {
      body = this.config.body.call(this, userId);
    } else {
      body = this.config.body;
    } // it means we allow everything, no need for cloning.


    if (body === true) {
      return true;
    }

    return deepClone(body, userId);
  }
  /**
   * Initializing the publication for reactive query fetching
   */


  initPublication() {
    const collection = this.collection;
    const config = this.config;
    const getTransformedBody = this.getTransformedBody.bind(this);
    Meteor.publishComposite(this.name, function (body) {
      let transformedBody = getTransformedBody(body);
      const rootNode = createGraph(collection, transformedBody);
      enforceMaxDepth(rootNode, config.maxDepth);
      restrictLinks(rootNode, this.userId);
      return recursiveCompose(rootNode, this.userId, {
        bypassFirewalls: !!config.body
      });
    });
  }
  /**
   * Initializez the method to retrieve the data via Meteor.call
   */


  initMethod() {
    const collection = this.collection;
    const config = this.config;
    const getTransformedBody = this.getTransformedBody.bind(this);

    const methodBody = function (body) {
      if (!config.blocking) {
        this.unblock();
      }

      let transformedBody = getTransformedBody(body);
      const rootNode = createGraph(collection, transformedBody);
      enforceMaxDepth(rootNode, config.maxDepth);
      restrictLinks(rootNode, this.userId); // if there is no exposure body defined, then we need to apply firewalls

      return hypernova(rootNode, this.userId, {
        bypassFirewalls: !!config.body
      });
    };

    Meteor.methods({
      [this.name]: methodBody
    });
  }
  /**
   * Initializes the method to retrieve the count of the data via Meteor.call
   * @returns {*}
   */


  initCountMethod() {
    const collection = this.collection;
    Meteor.methods({
      [this.name + '.count'](body) {
        this.unblock();
        return collection.find(body.$filters || {}, {}, this.userId).count();
      }

    });
  }
  /**
   * Initializes the reactive endpoint to retrieve the count of the data.
   */


  initCountPublication() {
    const collection = this.collection;
    genCountEndpoint(this.name, {
      getCursor({
        session
      }) {
        return collection.find(session.filters, {
          fields: {
            _id: 1
          }
        }, this.userId);
      },

      getSession(body) {
        return {
          filters: body.$filters || {}
        };
      }

    });
  }
  /**
   * Initializes security enforcement
   * THINK: Maybe instead of overriding .find, I could store this data of security inside the collection object.
   */


  initSecurity() {
    const collection = this.collection;
    const {
      firewall,
      maxLimit,
      restrictedFields
    } = this.config;
    const find = collection.find.bind(collection);
    const findOne = collection.findOne.bind(collection);

    collection.firewall = (filters, options, userId) => {
      if (userId !== undefined) {
        this._callFirewall({
          collection: collection
        }, filters, options, userId);

        enforceMaxLimit(options, maxLimit);

        if (restrictedFields) {
          Exposure.restrictFields(filters, options, restrictedFields);
        }
      }
    };

    collection.find = function (filters, options = {}, userId = undefined) {
      if (arguments.length == 0) {
        filters = {};
      } // If filters is undefined it should return an empty item


      if (arguments.length > 0 && filters === undefined) {
        return find(undefined, options);
      }

      collection.firewall(filters, options, userId);
      return find(filters, options);
    };

    collection.findOne = function (filters, options = {}, userId = undefined) {
      // If filters is undefined it should return an empty item
      if (arguments.length > 0 && filters === undefined) {
        return null;
      }

      if (typeof filters === 'string') {
        filters = {
          _id: filters
        };
      }

      collection.firewall(filters, options, userId);
      return findOne(filters, options);
    };
  }
  /**
   * @private
   */


  _callFirewall(...args) {
    const {
      firewall
    } = this.config;

    if (!firewall) {
      return;
    }

    if (_.isArray(firewall)) {
      firewall.forEach(fire => {
        fire.call(...args);
      });
    } else {
      firewall.call(...args);
    }
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"extension.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/exposure/extension.js                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Exposure;
module.link("./exposure.js", {
  default(v) {
    Exposure = v;
  }

}, 0);
Object.assign(Mongo.Collection.prototype, {
  expose(config) {
    if (!Meteor.isServer) {
      throw new Meteor.Error('not-allowed', `You can only expose a collection server side. ${this._name}`);
    }

    new Exposure(this, config);
  }

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"cleanBody.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/exposure/lib/cleanBody.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => cleanBody
});
let deepClone;
module.link("lodash.clonedeep", {
  default(v) {
    deepClone = v;
  }

}, 0);
let cleanFilters, cleanOptions;
module.link("./cleanSelectors", {
  cleanFilters(v) {
    cleanFilters = v;
  },

  cleanOptions(v) {
    cleanOptions = v;
  }

}, 1);
let dotize;
module.link("../../query/lib/dotize", {
  default(v) {
    dotize = v;
  }

}, 2);

function cleanBody(main, second, ...args) {
  let object = {};

  if (second.$filters || second.$options) {
    const fields = getFields(main);
    cleanFilters(second.$filters, fields);
    cleanOptions(second.$options, fields);
  }

  _.each(second, (secondValue, key) => {
    if (key === '$filters' || key === '$options') {
      object[key] = secondValue;
      return;
    }

    let value = main[key];

    if (value === undefined) {
      return;
    } // if the main value is a function, we run it.


    if (_.isFunction(value)) {
      value = value.call(null, ...args);
    } // if the main value is undefined or false, we skip the merge


    if (value === undefined || value === false) {
      return;
    } // we treat this specially, if the value is true


    if (value === true) {
      object[key] = _.isObject(secondValue) ? deepClone(secondValue) : value;
      return;
    } // if the main value is an object


    if (_.isObject(value)) {
      if (_.isObject(secondValue)) {
        // if the second one is an object as well we run recursively run the intersection
        object[key] = cleanBody(value, secondValue, ...args);
      } // if it is not, then we will ignore it, because it won't make sense.
      // to merge {a: 1} with 1.


      return;
    } // if the main value is not an object, it should be a truthy value like 1


    if (_.isObject(secondValue)) {
      // if the second value is an object, then we will keep it.
      // this won't cause problem with deep nesting because
      // when you specify links you will have the main value as an object, otherwise it will fail
      // this is used for things like when you have a hash object like profile with multiple nesting fields, you can allow the client to specify only what he needs
      object[key] = deepClone(secondValue);
    } else {
      // if the second value is not an object, we just store the first value
      object[key] = value;
    }
  });

  return object;
}

function getFields(body) {
  return _.keys(dotize.convert(body));
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cleanSelectors.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/exposure/lib/cleanSelectors.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  cleanOptions: () => cleanOptions,
  cleanFilters: () => cleanFilters,
  fieldExists: () => fieldExists
});

function cleanOptions(options, ensureFields) {
  if (!options) {
    return;
  }

  if (options.fields) {
    options.fields = _.pick(options.fields, ...ensureFields);
  }

  if (options.sort) {
    options.sort = _.pick(options.sort, ...ensureFields);
  }
}

const deepFilterFieldsArray = ['$and', '$or', '$nor'];
const deepFilterFieldsObject = ['$not'];
const special = [...deepFilterFieldsArray, ...deepFilterFieldsObject];

function cleanFilters(filters, ensureFields) {
  if (!filters) {
    return;
  }

  _.each(filters, (value, key) => {
    if (!_.contains(special, key)) {
      if (!fieldExists(ensureFields, key)) {
        delete filters[key];
      }
    }
  });

  deepFilterFieldsArray.forEach(field => {
    if (filters[field]) {
      filters[field].forEach(element => cleanFilters(element, ensureFields));
    }
  });
  deepFilterFieldsObject.forEach(field => {
    if (filters[field]) {
      cleanFilters(filters[field], ensureFields);
    }
  });
}

function fieldExists(fields, key) {
  for (let i = 0; i < fields.length; i++) {
    if (fields[i] === key || key.indexOf(fields[i] + '.') === 0) {
      return true;
    }
  }

  return false;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"enforceMaxDepth.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/exposure/lib/enforceMaxDepth.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  getDepth: () => getDepth
});
module.exportDefault(function (node, maxDepth) {
  if (maxDepth === undefined) {
    return node;
  }

  const depth = getDepth(node);

  if (depth > maxDepth) {
    throw new Meteor.Error('too-deep', 'Your graph request is too deep and it is not allowed.');
  }

  return node;
});

function getDepth(node) {
  if (node.collectionNodes.length === 0) {
    return 1;
  }

  return 1 + _.max(_.map(node.collectionNodes, getDepth));
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"enforceMaxLimit.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/exposure/lib/enforceMaxLimit.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exportDefault(function (options, maxLimit) {
  if (maxLimit === undefined) {
    return;
  }

  if (options.limit) {
    if (options.limit > maxLimit) {
      options.limit = maxLimit;
    }
  } else {
    options.limit = maxLimit;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"restrictFields.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/exposure/lib/restrictFields.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => restrictFields
});
const deepFilterFieldsArray = ['$and', '$or', '$nor'];
const deepFilterFieldsObject = ['$not'];
/**
 * This is used to restrict some fields to some users, by passing the fields as array in the exposure object
 * For example in an user exposure: restrictFields(options, ['services', 'createdAt'])
 *
 * @param filters Object
 * @param options Object
 * @param restrictedFields Array
 */

function restrictFields(filters, options, restrictedFields) {
  if (!_.isArray(restrictedFields)) {
    throw new Meteor.Error('invalid-parameters', 'Please specify an array of restricted fields.');
  }

  cleanFilters(filters, restrictedFields);
  cleanOptions(options, restrictedFields);
}

/**
 * Deep cleans filters
 *
 * @param filters
 * @param restrictedFields
 */
function cleanFilters(filters, restrictedFields) {
  if (filters) {
    cleanObject(filters, restrictedFields);
  }

  deepFilterFieldsArray.forEach(field => {
    if (filters[field]) {
      filters[field].forEach(element => cleanFilters(element, restrictedFields));
    }
  });
  deepFilterFieldsObject.forEach(field => {
    if (filters[field]) {
      cleanFilters(filters[field], restrictedFields);
    }
  });
}
/**
 * Deeply cleans options
 *
 * @param options
 * @param restrictedFields
 */


function cleanOptions(options, restrictedFields) {
  if (options.fields) {
    cleanObject(options.fields, restrictedFields);

    if (_.keys(options.fields).length === 0) {
      _.extend(options.fields, {
        _id: 1
      });
    }
  } else {
    options.fields = {
      _id: 1
    };
  }

  if (options.sort) {
    cleanObject(options.sort, restrictedFields);
  }
}
/**
 * Cleans the object (not deeply)
 *
 * @param object
 * @param restrictedFields
 */


function cleanObject(object, restrictedFields) {
  _.each(object, (value, key) => {
    restrictedFields.forEach(restrictedField => {
      if (matching(restrictedField, key)) {
        delete object[key];
      }
    });
  });
}
/**
 * Returns true if field == subfield or if `${field}.` INCLUDED in subfield
 * Example: "profile" and "profile.firstName" will be a matching field
 * @param field
 * @param subfield
 * @returns {boolean}
 */


function matching(field, subfield) {
  if (field === subfield) {
    return true;
  }

  return subfield.slice(0, field.length + 1) === field + '.';
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"restrictLinks.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/exposure/lib/restrictLinks.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => restrictLinks,
  getLinks: () => getLinks
});

function restrictLinks(parentNode, ...args) {
  const restrictedLinks = getLinks(parentNode, ...args);

  if (!restrictedLinks || restrictedLinks.length) {
    return;
  }

  _.each(parentNode.collectionNodes, collectionNode => {
    if (_.contains(restrictedLinks, collectionNode.linkName)) {
      parentNode.remove(collectionNode);
    }
  });
}

function getLinks(node, ...args) {
  if (node.collection && node.collection.__exposure) {
    const exposure = node.collection.__exposure;

    if (exposure.config.restrictLinks) {
      const configRestrictLinks = exposure.config.restrictLinks;

      if (_.isArray(configRestrictLinks)) {
        return configRestrictLinks;
      }

      return configRestrictLinks(...args);
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"graphql":{"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/graphql/index.js                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  astToQuery: () => astToQuery
});
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
let astToQuery;
module.link("./lib/astToQuery", {
  default(v) {
    astToQuery = v;
  }

}, 1);
module.link("./lib/defaults", {
  setAstToQueryDefaults: "setAstToQueryDefaults"
}, 2);
module.link("./lib/astToBody", {
  default: "astToBody"
}, 3);
Object.assign(Mongo.Collection.prototype, {
  astToQuery
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"astToBody.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/graphql/lib/astToBody.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  Symbols: () => Symbols,
  default: () => astToBody
});
const Symbols = {
  ARGUMENTS: Symbol('arguments')
};

function astToBody(ast) {
  const fieldNodes = ast.fieldNodes;
  const body = extractSelectionSet(ast.fieldNodes[0].selectionSet);
  return body;
}

function extractSelectionSet(set) {
  let body = {};
  set.selections.forEach(el => {
    if (!el.selectionSet) {
      body[el.name.value] = 1;
    } else {
      body[el.name.value] = extractSelectionSet(el.selectionSet);

      if (el.arguments.length) {
        let argumentMap = {};
        el.arguments.forEach(arg => {
          argumentMap[arg.name.value] = arg.value.value;
        });
        body[el.name.value][Symbols.ARGUMENTS] = argumentMap;
      }
    }
  });
  return body;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"astToQuery.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/graphql/lib/astToQuery.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => astToQuery,
  getMaxDepth: () => getMaxDepth,
  deny: () => deny,
  clearEmptyObjects: () => clearEmptyObjects,
  createGetArgs: () => createGetArgs
});
let check, Match;
module.link("meteor/check", {
  check(v) {
    check = v;
  },

  Match(v) {
    Match = v;
  }

}, 0);
let astToBody, Symbols;
module.link("./astToBody", {
  default(v) {
    astToBody = v;
  },

  Symbols(v) {
    Symbols = v;
  }

}, 1);
let defaults;
module.link("./defaults", {
  default(v) {
    defaults = v;
  }

}, 2);
let intersectDeep;
module.link("../../query/lib/intersectDeep", {
  default(v) {
    intersectDeep = v;
  }

}, 3);
let enforceMaxLimit;
module.link("../../exposure/lib/enforceMaxLimit", {
  default(v) {
    enforceMaxLimit = v;
  }

}, 4);
const Errors = {
  MAX_DEPTH: 'The maximum depth of this request exceeds the depth allowed.'
};

function astToQuery(ast, config = {}) {
  const collection = this;
  check(config, {
    embody: Match.Maybe(Function),
    $filters: Match.Maybe(Object),
    $options: Match.Maybe(Object),
    maxDepth: Match.Maybe(Number),
    maxLimit: Match.Maybe(Number),
    deny: Match.Maybe([String]),
    intersect: Match.Maybe(Object)
  });
  config = Object.assign({
    $options: {},
    $filters: {}
  }, defaults, config); // get the body

  let body = astToBody(ast); // first we do the intersection

  if (config.intersect) {
    body = intersectDeep(config.intersect, body);
  } // enforce the maximum amount of data we allow to retrieve


  if (config.maxLimit) {
    enforceMaxLimit(config.$options, config.maxLimit);
  } // figure out depth based


  if (config.maxDepth) {
    const currentMaxDepth = getMaxDepth(body);

    if (currentMaxDepth > config.maxDepth) {
      throw Errors.MAX_DEPTH;
    }
  }

  if (config.deny) {
    deny(body, config.deny);
  }

  Object.assign(body, {
    $filters: config.$filters,
    $options: config.$options
  });

  if (config.embody) {
    const getArgs = createGetArgs(body);
    config.embody.call(null, {
      body,
      getArgs
    });
  } // we return the query


  return this.createQuery(body);
}

function getMaxDepth(body) {
  let depths = [];

  for (key in body) {
    if (_.isObject(body[key])) {
      depths.push(getMaxDepth(body[key]));
    }
  }

  if (depths.length === 0) {
    return 1;
  }

  return Math.max(...depths) + 1;
}

function deny(body, fields) {
  fields.forEach(field => {
    let parts = field.split('.');
    let accessor = body;

    while (parts.length != 0) {
      if (parts.length === 1) {
        delete accessor[parts[0]];
      } else {
        if (!_.isObject(accessor)) {
          break;
        }

        accessor = accessor[parts[0]];
      }

      parts.shift();
    }
  });
  return clearEmptyObjects(body);
}

function clearEmptyObjects(body) {
  // clear empty nodes then back-propagate
  for (let key in body) {
    if (_.isObject(body[key])) {
      const shouldDelete = clearEmptyObjects(body[key]);

      if (shouldDelete) {
        delete body[key];
      }
    }
  }

  return Object.keys(body).length === 0;
}

function createGetArgs(body) {
  return function (path) {
    const parts = path.split('.');
    let stopped = false;
    let accessor = body;

    for (var i = 0; i < parts.length; i++) {
      if (!accessor) {
        stopped = true;
        break;
      }

      if (accessor[parts[i]]) {
        accessor = accessor[parts[i]];
      }
    }

    if (stopped) {
      return {};
    }

    if (accessor) {
      return accessor[Symbols.ARGUMENTS] || {};
    }
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"defaults.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/graphql/lib/defaults.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  setAstToQueryDefaults: () => setAstToQueryDefaults
});
let defaults = {};
module.exportDefault(defaults);

function setAstToQueryDefaults(object) {
  Object.assign(defaults, object);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"links":{"config.schema.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/config.schema.js                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  DenormalizeSchema: () => DenormalizeSchema,
  LinkConfigDefaults: () => LinkConfigDefaults,
  LinkConfigSchema: () => LinkConfigSchema
});
let Match;
module.link("meteor/check", {
  Match(v) {
    Match = v;
  }

}, 0);
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
const DenormalizeSchema = {
  field: String,
  body: Object,
  bypassSchema: Match.Maybe(Boolean)
};
const LinkConfigDefaults = {
  type: 'one'
};
const LinkConfigSchema = {
  type: Match.Maybe(Match.OneOf('one', 'many', '1', '*')),
  collection: Match.Maybe(Match.Where(collection => {
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
  LINK_STORAGE: () => LINK_STORAGE
});
const LINK_STORAGE = '__links';
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"extension.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/extension.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
let LINK_STORAGE;
module.link("./constants.js", {
  LINK_STORAGE(v) {
    LINK_STORAGE = v;
  }

}, 1);
let Linker;
module.link("./linker.js", {
  default(v) {
    Linker = v;
  }

}, 2);
Object.assign(Mongo.Collection.prototype, {
  /**
   * The data we add should be valid for config.schema.js
   */
  addLinks(data) {
    if (!this[LINK_STORAGE]) {
      this[LINK_STORAGE] = {};
    }

    _.each(data, (linkConfig, linkName) => {
      if (this[LINK_STORAGE][linkName]) {
        throw new Meteor.Error(`You cannot add the link with name: ${linkName} because it was already added to ${this._name} collection`);
      }

      const linker = new Linker(this, linkName, linkConfig);

      _.extend(this[LINK_STORAGE], {
        [linkName]: linker
      });
    });
  },

  getLinks() {
    return this[LINK_STORAGE];
  },

  getLinker(name) {
    if (this[LINK_STORAGE]) {
      return this[LINK_STORAGE][name];
    }
  },

  hasLink(name) {
    if (!this[LINK_STORAGE]) {
      return false;
    }

    return !!this[LINK_STORAGE][name];
  },

  getLink(objectOrId, name) {
    let linkData = this[LINK_STORAGE];

    if (!linkData) {
      throw new Meteor.Error(`There are no links defined for collection: ${this._name}`);
    }

    if (!linkData[name]) {
      throw new Meteor.Error(`There is no link ${name} for collection: ${this._name}`);
    }

    const linker = linkData[name];
    let object = objectOrId;

    if (typeof objectOrId == 'string') {
      if (!linker.isVirtual()) {
        object = this.findOne(objectOrId, {
          fields: {
            [linker.linkStorageField]: 1
          }
        });
      } else {
        object = {
          _id: objectOrId
        };
      }

      if (!object) {
        throw new Meteor.Error(`We could not find any object with _id: "${objectOrId}" within the collection: ${this._name}`);
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
module.export({
  default: () => Linker
});
let LinkMany;
module.link("./linkTypes/linkMany.js", {
  default(v) {
    LinkMany = v;
  }

}, 0);
let LinkManyMeta;
module.link("./linkTypes/linkManyMeta.js", {
  default(v) {
    LinkManyMeta = v;
  }

}, 1);
let LinkOne;
module.link("./linkTypes/linkOne.js", {
  default(v) {
    LinkOne = v;
  }

}, 2);
let LinkOneMeta;
module.link("./linkTypes/linkOneMeta.js", {
  default(v) {
    LinkOneMeta = v;
  }

}, 3);
let LinkConfigSchema, LinkConfigDefaults;
module.link("./config.schema.js", {
  LinkConfigSchema(v) {
    LinkConfigSchema = v;
  },

  LinkConfigDefaults(v) {
    LinkConfigDefaults = v;
  }

}, 4);
let smartArguments;
module.link("./linkTypes/lib/smartArguments", {
  default(v) {
    smartArguments = v;
  }

}, 5);
let dot;
module.link("dot-object", {
  default(v) {
    dot = v;
  }

}, 6);
let check;
module.link("meteor/check", {
  check(v) {
    check = v;
  }

}, 7);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 8);
let access;
module.link("fs", {
  access(v) {
    access = v;
  }

}, 9);

class Linker {
  /**
   * @param mainCollection
   * @param linkName
   * @param linkConfig
   */
  constructor(mainCollection, linkName, linkConfig) {
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


  get oneTypes() {
    return ['one', '1'];
  }
  /**
   * Returns the strategies: one, many, one-meta, many-meta
   * @returns {string}
   */


  get strategy() {
    let strategy = this.isMany() ? 'many' : 'one';

    if (this.linkConfig.metadata) {
      strategy += '-meta';
    }

    return strategy;
  }
  /**
   * Returns the field name in the document where the actual relationships are stored.
   * @returns string
   */


  get linkStorageField() {
    if (this.isVirtual()) {
      return this.linkConfig.relatedLinker.linkStorageField;
    }

    return this.linkConfig.field;
  }
  /**
   * The collection that is linked with the current collection
   * @returns Mongo.Collection
   */


  getLinkedCollection() {
    return this.linkConfig.collection;
  }
  /**
   * If the relationship for this link is of "many" type.
   */


  isMany() {
    return !this.isSingle();
  }
  /**
   * If the relationship for this link contains metadata
   */


  isMeta() {
    if (this.isVirtual()) {
      return this.linkConfig.relatedLinker.isMeta();
    }

    return !!this.linkConfig.metadata;
  }
  /**
   * @returns {boolean}
   */


  isSingle() {
    if (this.isVirtual()) {
      return this.linkConfig.relatedLinker.isSingle();
    }

    return _.contains(this.oneTypes, this.linkConfig.type);
  }
  /**
   * @returns {boolean}
   */


  isVirtual() {
    return !!this.linkConfig.inversedBy;
  }
  /**
   * Should return a single result.
   */


  isOneResult() {
    return this.isVirtual() && this.linkConfig.relatedLinker.linkConfig.unique || !this.isVirtual() && this.isSingle();
  }
  /**
   * @param object
   * @param collection To impersonate the getLinkedCollection() of the "Linker"
   *
   * @returns {LinkOne|LinkMany|LinkManyMeta|LinkOneMeta|LinkResolve}
   */


  createLink(object, collection = null) {
    let helperClass = this._getHelperClass();

    return new helperClass(this, object, collection);
  }
  /**
   * @returns {*}
   * @private
   */


  _validateAndClean() {
    if (!this.linkConfig.collection) {
      throw new Meteor.Error('invalid-config', `For the link ${this.linkName} you did not provide a collection.`);
    }

    if (typeof this.linkConfig.collection === 'string') {
      const collectionName = this.linkConfig.collection;
      this.linkConfig.collection = Mongo.Collection.get(collectionName);

      if (!this.linkConfig.collection) {
        throw new Meteor.Error('invalid-collection', `Could not find a collection with the name: ${collectionName}`);
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
          throw new Meteor.Error('invalid-config', `For the link ${this.linkName} you must not use the same name for the field, otherwise it will cause conflicts when fetching data`);
        }
      }
    }

    check(this.linkConfig, LinkConfigSchema);
  }
  /**
   * We need to apply same type of rules in this case.
   * @private
   */


  _prepareVirtual() {
    const {
      collection,
      inversedBy
    } = this.linkConfig;
    let linker = collection.getLinker(inversedBy);

    if (!linker) {
      // it is possible that the collection doesn't have a linker created yet.
      // so we will create it on startup after all links have been defined
      Meteor.startup(() => {
        linker = collection.getLinker(inversedBy);

        if (!linker) {
          throw new Meteor.Error(`You tried setting up an inversed link in "${this.mainCollection._name}" pointing to collection: "${collection._name}" link: "${inversedBy}", but no such link was found. Maybe a typo ?`);
        } else {
          this._setupVirtualConfig(linker);
        }
      });
    } else {
      this._setupVirtualConfig(linker);
    }
  }
  /**
   * @param linker
   * @private
   */


  _setupVirtualConfig(linker) {
    const virtualLinkConfig = linker.linkConfig;

    if (!virtualLinkConfig) {
      throw new Meteor.Error(`There is no link-config for the related collection on ${inversedBy}. Make sure you added the direct links before specifying virtual ones.`);
    }

    _.extend(this.linkConfig, {
      metadata: virtualLinkConfig.metadata,
      relatedLinker: linker
    });
  }
  /**
   * Depending on the strategy, we create the proper helper class
   * @private
   */


  _getHelperClass() {
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

    throw new Meteor.Error('invalid-strategy', `${this.strategy} is not a valid strategy`);
  }
  /**
   * If field name not present, we generate it.
   * @private
   */


  _generateFieldName() {
    let cleanedCollectionName = this.linkConfig.collection._name.replace(/\./g, '_');

    let defaultFieldPrefix = this.linkName + '_' + cleanedCollectionName;

    switch (this.strategy) {
      case 'many-meta':
        return `${defaultFieldPrefix}_metas`;

      case 'many':
        return `${defaultFieldPrefix}_ids`;

      case 'one-meta':
        return `${defaultFieldPrefix}_meta`;

      case 'one':
        return `${defaultFieldPrefix}_id`;
    }
  }
  /**
   * When a link that is declared virtual is removed, the reference will be removed from every other link.
   * @private
   */


  _handleReferenceRemovalForVirtualLinks() {
    this.mainCollection.after.remove((userId, doc) => {
      // this problem may occur when you do a .remove() before Meteor.startup()
      if (!this.linkConfig.relatedLinker) {
        console.warn(`There was an error finding the link for removal for collection: "${this.mainCollection._name}" with link: "${this.linkName}". This may occur when you do a .remove() before Meteor.startup()`);
        return;
      }

      const accessor = this.createLink(doc);

      _.each(accessor.fetchAsArray(), linkedObj => {
        const {
          relatedLinker
        } = this.linkConfig; // We do this check, to avoid self-referencing hell when defining virtual links
        // Virtual links if not found "compile-time", we will try again to reprocess them on Meteor.startup
        // if a removal happens before Meteor.startup this may fail

        if (relatedLinker) {
          let link = relatedLinker.createLink(linkedObj);

          if (relatedLinker.isSingle()) {
            link.unset();
          } else {
            link.remove(doc);
          }
        }
      });
    });
  }

  _initIndex() {
    if (Meteor.isServer) {
      let field = this.linkConfig.field;

      if (this.linkConfig.metadata) {
        field = field + '._id';
      }

      if (this.linkConfig.index) {
        if (this.isVirtual()) {
          throw new Meteor.Error('You cannot set index on an inversed link.');
        }

        let options;

        if (this.linkConfig.unique) {
          options = {
            unique: true
          };
        }

        this.mainCollection._ensureIndex({
          [field]: 1
        }, options);
      } else {
        if (this.linkConfig.unique) {
          if (this.isVirtual()) {
            throw new Meteor.Error('You cannot set unique property on an inversed link.');
          }

          this.mainCollection._ensureIndex({
            [field]: 1
          }, {
            unique: true,
            sparse: true
          });
        }
      }
    }
  }

  _initAutoremove() {
    if (!this.linkConfig.autoremove) {
      return;
    }

    if (!this.isVirtual()) {
      this.mainCollection.after.remove((userId, doc) => {
        this.getLinkedCollection().remove({
          _id: {
            $in: smartArguments.getIds(doc[this.linkStorageField])
          }
        });
      });
    } else {
      this.mainCollection.after.remove((userId, doc) => {
        const linker = this.mainCollection.getLink(doc, this.linkName);
        const ids = linker.find({}, {
          fields: {
            _id: 1
          }
        }).fetch().map(item => item._id);
        this.getLinkedCollection().remove({
          _id: {
            $in: ids
          }
        });
      });
    }
  }
  /**
   * Initializes denormalization using herteby:denormalize
   * @private
   */


  _initDenormalization() {
    if (!this.linkConfig.denormalize || !Meteor.isServer) {
      return;
    }

    const packageExists = !!Package['herteby:denormalize'];

    if (!packageExists) {
      throw new Meteor.Error('missing-package', `Please add the herteby:denormalize package to your Meteor application in order to make caching work`);
    }

    const {
      field,
      body,
      bypassSchema
    } = this.linkConfig.denormalize;
    let cacheConfig;
    let referenceFieldSuffix = '';

    if (this.isMeta()) {
      referenceFieldSuffix = this.isSingle() ? '._id' : ':_id';
    }

    if (this.isVirtual()) {
      let inversedLink = this.linkConfig.relatedLinker.linkConfig;
      let type = inversedLink.type == 'many' ? 'many-inverse' : 'inversed';
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
      Meteor.startup(() => {
        this.mainCollection.cache(cacheConfig);
      });
    } else {
      this.mainCollection.cache(cacheConfig);
    }
  }
  /**
   * Verifies if this linker is denormalized. It can be denormalized from the inverse side as well.
   *
   * @returns {boolean}
   * @private
   */


  isDenormalized() {
    return !!this.linkConfig.denormalize;
  }
  /**
   * Verifies if the body of the linked element does not contain fields outside the cache body
   *
   * @param body
   * @returns {boolean}
   * @private
   */


  isSubBodyDenormalized(body) {
    const cacheBody = this.linkConfig.denormalize.body;

    const cacheBodyFields = _.keys(dot.dot(cacheBody));

    const bodyFields = _.keys(dot.dot(_.omit(body, '_id')));

    return _.difference(bodyFields, cacheBodyFields).length === 0;
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"createSearchFilters.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/lib/createSearchFilters.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => createSearchFilters,
  createOne: () => createOne,
  createOneVirtual: () => createOneVirtual,
  createOneMeta: () => createOneMeta,
  createOneMetaVirtual: () => createOneMetaVirtual,
  createMany: () => createMany,
  createManyVirtual: () => createManyVirtual,
  createManyMeta: () => createManyMeta,
  createManyMetaVirtual: () => createManyMetaVirtual
});
let sift;
module.link("sift", {
  default(v) {
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
        throw new Meteor.Error(`Invalid linking strategy: ${strategy}`);
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
        throw new Meteor.Error(`Invalid linking strategy: ${strategy}`);
    }
  }
}

function createOne(object, fieldStorage) {
  return {
    _id: object[fieldStorage]
  };
}

function createOneVirtual(object, fieldStorage) {
  return {
    [fieldStorage]: object._id
  };
}

function createOneMeta(object, fieldStorage, metaFilters) {
  const value = object[fieldStorage];

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
  let filters = {};

  if (metaFilters) {
    _.each(metaFilters, (value, key) => {
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
  return {
    [fieldStorage]: object._id
  };
}

function createManyMeta(object, fieldStorage, metaFilters) {
  let value = object[fieldStorage];

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
  let filters = {};

  if (metaFilters) {
    _.each(metaFilters, (value, key) => {
      filters[key] = value;
    });
  }

  filters._id = object._id;
  return {
    [fieldStorage]: {
      $elemMatch: filters
    }
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"linkTypes":{"base.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/linkTypes/base.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => Link
});
let SmartArgs;
module.link("./lib/smartArguments.js", {
  default(v) {
    SmartArgs = v;
  }

}, 0);
let createSearchFilters;
module.link("../lib/createSearchFilters", {
  default(v) {
    createSearchFilters = v;
  }

}, 1);

class Link {
  get config() {
    return this.linker.linkConfig;
  }

  get isVirtual() {
    return this.linker.isVirtual();
  }

  constructor(linker, object, collection) {
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


  value() {
    if (this.isVirtual) {
      throw new Meteor.Error('You can only take the value from the main link.');
    }

    return this.object[this.linkStorageField];
  }
  /**
   * Finds linked data.
   *
   * @param filters
   * @param options
   * @returns {*}
   * @param userId
   */


  find(filters = {}, options = {}, userId = undefined) {
    let linker = this.linker;
    const linkedCollection = this.linkedCollection;
    let $metaFilters;

    if (filters.$meta) {
      $metaFilters = filters.$meta;
      delete filters.$meta;
    }

    const searchFilters = createSearchFilters(this.object, this.linkStorageField, linker.strategy, linker.isVirtual(), $metaFilters);

    let appliedFilters = _.extend({}, filters, searchFilters); // see https://github.com/cult-of-coders/grapher/issues/134
    // happens due to recursive importing of modules
    // TODO: find another way to do this


    if (linkedCollection.find) {
      return linkedCollection.find(appliedFilters, options, userId);
    } else {
      return linkedCollection.default.find(appliedFilters, options, userId);
    }
  }
  /**
   * @param filters
   * @param options
   * @param others
   * @returns {*|{content}|any}
   */


  fetch(filters, options, ...others) {
    let result = this.find(filters, options, ...others).fetch();

    if (this.linker.isOneResult()) {
      return _.first(result);
    }

    return result;
  }
  /**
   * This is just like fetch() but forces to get an array even if it's single result
   * 
   * @param {*} filters 
   * @param {*} options 
   * @param  {...any} others 
   */


  fetchAsArray(filters, options, ...others) {
    return this.find(filters, options, ...others).fetch();
  }
  /**
   * When we are dealing with multiple type relationships, $in would require an array. If the field value is null, it will fail
   * We use clean to make it an empty array by default.
   */


  clean() {}
  /**
   * Extracts a single id
   */


  identifyId(what, saveToDatabase) {
    return SmartArgs.getId(what, {
      saveToDatabase,
      collection: this.linkedCollection
    });
  }
  /**
   * Extracts the ids of object(s) or strings and returns an array.
   */


  identifyIds(what, saveToDatabase) {
    return SmartArgs.getIds(what, {
      saveToDatabase,
      collection: this.linkedCollection
    });
  }
  /**
   * Checks when linking data, if the ids are valid with the linked collection.
   * @throws Meteor.Error
   * @param ids
   *
   * @protected
   */


  _validateIds(ids) {
    if (!_.isArray(ids)) {
      ids = [ids];
    }

    const validIds = this.linkedCollection.find({
      _id: {
        $in: ids
      }
    }, {
      fields: {
        _id: 1
      }
    }).fetch().map(doc => doc._id);

    if (validIds.length != ids.length) {
      throw new Meteor.Error('not-found', `You tried to create links with non-existing id(s) inside "${this.linkedCollection._name}": ${_.difference(ids, validIds).join(', ')}`);
    }
  }
  /**
   * This is for allowing commands such as set/unset/add/remove/metadata from the virtual link.
   *
   * @param action
   * @param what
   * @param metadata
   *
   * @protected
   */


  _virtualAction(action, what, metadata) {
    const linker = this.linker.linkConfig.relatedLinker; // its an unset operation most likely.

    if (what === undefined) {
      const reversedLink = linker.createLink(this.fetch());
      reversedLink.unset();
      return;
    }

    if (!_.isArray(what)) {
      what = [what];
    }

    what = _.map(what, element => {
      if (!_.isObject(element)) {
        return linker.mainCollection.findOne(element);
      } else {
        if (!element._id) {
          const elementId = linker.mainCollection.insert(element);

          _.extend(element, linker.mainCollection.findOne(elementId));
        }

        return element;
      }
    });
    return _.map(what, element => {
      const reversedLink = linker.createLink(element);

      if (action == 'metadata') {
        if (linker.isSingle()) {
          return reversedLink.metadata(metadata);
        } else {
          return reversedLink.metadata(this.object, metadata);
        }
      } else if (action == 'add' || action == 'set') {
        if (linker.isSingle()) {
          reversedLink.set(this.object, metadata);
        } else {
          reversedLink.add(this.object, metadata);
        }
      } else {
        if (linker.isSingle()) {
          reversedLink.unset();
        } else {
          reversedLink.remove(this.object);
        }
      }
    });
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"linkMany.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/linkTypes/linkMany.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => LinkMany
});
let Link;
module.link("./base.js", {
  default(v) {
    Link = v;
  }

}, 0);
let SmartArgs;
module.link("./lib/smartArguments.js", {
  default(v) {
    SmartArgs = v;
  }

}, 1);

class LinkMany extends Link {
  clean() {
    if (!this.object[this.linkStorageField]) {
      this.object[this.linkStorageField] = [];
    }
  }
  /**
   * Ads the _ids to the object.
   * @param what
   */


  add(what) {
    if (this.isVirtual) {
      this._virtualAction('add', what);

      return this;
    } //if (this.isVirtual) throw new Meteor.Error('not-allowed', 'Add/remove operations must be done from the owning-link of the relationship');


    this.clean();

    const _ids = this.identifyIds(what, true);

    this._validateIds(_ids);

    const field = this.linkStorageField; // update the field

    this.object[field] = _.union(this.object[field], _ids); // update the db

    let modifier = {
      $addToSet: {
        [field]: {
          $each: _ids
        }
      }
    };
    this.linker.mainCollection.update(this.object._id, modifier);
    return this;
  }
  /**
   * @param what
   */


  remove(what) {
    if (this.isVirtual) {
      this._virtualAction('remove', what);

      return this;
    }

    if (this.isVirtual) throw new Meteor.Error('not-allowed', 'Add/Remove operations should be done from the owner of the relationship');
    this.clean();
    const field = this.linkStorageField;

    const _ids = this.identifyIds(what); // update the field


    this.object[field] = _.filter(this.object[field], _id => !_.contains(_ids, _id)); // update the db

    let modifier = {
      $pullAll: {
        [field]: _ids
      }
    };
    this.linker.mainCollection.update(this.object._id, modifier);
    return this;
  }

  set(what) {
    if (this.isVirtual) {
      this._virtualAction('set', what);

      return this;
    }

    throw new Meteor.Error('invalid-command', 'You are trying to *set* in a relationship that is single. Please use add/remove for *many* relationships');
  }

  unset(what) {
    if (this.isVirtual) {
      this._virtualAction('unset', what);

      return this;
    }

    throw new Meteor.Error('invalid-command', 'You are trying to *unset* in a relationship that is single. Please use add/remove for *many* relationships');
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"linkManyMeta.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/linkTypes/linkManyMeta.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => LinkManyMeta
});
let Link;
module.link("./base.js", {
  default(v) {
    Link = v;
  }

}, 0);
let SmartArgs;
module.link("./lib/smartArguments.js", {
  default(v) {
    SmartArgs = v;
  }

}, 1);

class LinkManyMeta extends Link {
  clean() {
    if (!this.object[this.linkStorageField]) {
      this.object[this.linkStorageField] = [];
    }
  }
  /**
   * @param what
   * @param metadata
   */


  add(what, metadata = {}) {
    if (this.isVirtual) {
      this._virtualAction('add', what, metadata);

      return this;
    }

    const _ids = this.identifyIds(what, true);

    this._validateIds(_ids);

    let field = this.linkStorageField;
    this.object[field] = this.object[field] || [];
    let metadatas = [];

    _.each(_ids, _id => {
      let localMetadata = _.clone(metadata);

      localMetadata._id = _id;
      this.object[field].push(localMetadata);
      metadatas.push(localMetadata);
    });

    let modifier = {
      $addToSet: {
        [field]: {
          $each: metadatas
        }
      }
    };
    this.linker.mainCollection.update(this.object._id, modifier);
    return this;
  }
  /**
   * @param what
   * @param extendMetadata
   */


  metadata(what, extendMetadata) {
    if (this.isVirtual) {
      this._virtualAction('metadata', what, extendMetadata);

      return this;
    }

    let field = this.linkStorageField;

    if (what === undefined) {
      return this.object[field];
    }

    if (_.isArray(what)) {
      throw new Meteor.Error('not-allowed', 'Metadata updates should be made for one entity only, not multiple');
    }

    const _id = this.identifyId(what);

    let existingMetadata = _.find(this.object[field], metadata => metadata._id == _id);

    if (extendMetadata === undefined) {
      return existingMetadata;
    } else {
      _.extend(existingMetadata, extendMetadata);

      let subfield = field + '._id';
      let subfieldUpdate = field + '.$';
      this.linker.mainCollection.update({
        _id: this.object._id,
        [subfield]: _id
      }, {
        $set: {
          [subfieldUpdate]: existingMetadata
        }
      });
    }

    return this;
  }

  remove(what) {
    if (this.isVirtual) {
      this._virtualAction('remove', what);

      return this;
    }

    const _ids = this.identifyIds(what);

    let field = this.linkStorageField;
    this.object[field] = _.filter(this.object[field], link => !_.contains(_ids, link._id));
    let modifier = {
      $pull: {
        [field]: {
          _id: {
            $in: _ids
          }
        }
      }
    };
    this.linker.mainCollection.update(this.object._id, modifier);
    return this;
  }

  set(what, metadata) {
    if (this.isVirtual) {
      this._virtualAction('set', what, metadata);

      return this;
    }

    throw new Meteor.Error('invalid-command', 'You are trying to *set* in a relationship that is single. Please use add/remove for *many* relationships');
  }

  unset(what) {
    if (this.isVirtual) {
      this._virtualAction('unset', what);

      return this;
    }

    throw new Meteor.Error('invalid-command', 'You are trying to *unset* in a relationship that is single. Please use add/remove for *many* relationships');
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"linkOne.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/linkTypes/linkOne.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => LinkOne
});
let Link;
module.link("./base.js", {
  default(v) {
    Link = v;
  }

}, 0);
let SmartArgs;
module.link("./lib/smartArguments.js", {
  default(v) {
    SmartArgs = v;
  }

}, 1);

class LinkOne extends Link {
  set(what) {
    if (this.isVirtual) {
      this._virtualAction('set', what);

      return this;
    }

    let field = this.linkStorageField;

    const _id = this.identifyId(what, true);

    this._validateIds([_id]);

    this.object[field] = _id;
    this.linker.mainCollection.update(this.object._id, {
      $set: {
        [field]: _id
      }
    });
    return this;
  }

  unset() {
    if (this.isVirtual) {
      this._virtualAction('unset', what);

      return this;
    }

    let field = this.linkStorageField;
    this.object[field] = null;
    this.linker.mainCollection.update(this.object._id, {
      $set: {
        [field]: null
      }
    });
    return this;
  }

  add(what) {
    if (this.isVirtual) {
      this._virtualAction('add', what);

      return this;
    }

    throw new Meteor.Error('invalid-command', 'You are trying to *add* in a relationship that is single. Please use set/unset for *single* relationships');
  }

  remove(what) {
    if (this.isVirtual) {
      this._virtualAction('remove', what);

      return this;
    }

    throw new Meteor.Error('invalid-command', 'You are trying to *remove* in a relationship that is single. Please use set/unset for *single* relationships');
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"linkOneMeta.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/linkTypes/linkOneMeta.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => LinkOneMeta
});
let Link;
module.link("./base.js", {
  default(v) {
    Link = v;
  }

}, 0);
let SmartArgs;
module.link("./lib/smartArguments.js", {
  default(v) {
    SmartArgs = v;
  }

}, 1);

class LinkOneMeta extends Link {
  set(what, metadata = {}) {
    if (this.isVirtual) {
      this._virtualAction('set', what);

      return this;
    }

    let field = this.linkStorageField;
    metadata._id = this.identifyId(what, true);

    this._validateIds([metadata._id]);

    this.object[field] = metadata;
    this.linker.mainCollection.update(this.object._id, {
      $set: {
        [field]: metadata
      }
    });
    return this;
  }

  metadata(extendMetadata) {
    if (this.isVirtual) {
      this._virtualAction('metadata', undefined, extendMetadata);

      return this;
    }

    let field = this.linkStorageField;

    if (!extendMetadata) {
      return this.object[field];
    } else {
      _.extend(this.object[field], extendMetadata);

      this.linker.mainCollection.update(this.object._id, {
        $set: {
          [field]: this.object[field]
        }
      });
    }

    return this;
  }

  unset() {
    if (this.isVirtual) {
      this._virtualAction('unset');

      return this;
    }

    let field = this.linkStorageField;
    this.object[field] = {};
    this.linker.mainCollection.update(this.object._id, {
      $set: {
        [field]: {}
      }
    });
    return this;
  }

  add(what, metadata) {
    if (this.isVirtual) {
      this._virtualAction('add', what, metadata);

      return this;
    }

    throw new Meteor.Error('invalid-command', 'You are trying to *add* in a relationship that is single. Please use set/unset for *single* relationships');
  }

  remove(what) {
    if (this.isVirtual) {
      this._virtualAction('remove', what);

      return this;
    }

    throw new Meteor.Error('invalid-command', 'You are trying to *remove* in a relationship that is single. Please use set/unset for *single* relationships');
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"smartArguments.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/linkTypes/lib/smartArguments.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exportDefault(new class {
  getIds(what, options) {
    if (_.isArray(what)) {
      return _.map(what, subWhat => {
        return this.getId(subWhat, options);
      });
    } else {
      return [this.getId(what, options)];
    }

    throw new Meteor.Error('invalid-type', `Unrecognized type: ${typeof what} for managing links`);
  }

  getId(what, options) {
    if (typeof what === 'string') {
      return what;
    }

    if (typeof what === 'object') {
      if (!what._id && options.saveToDatabase) {
        what._id = options.collection.insert(what);
      }

      return what._id;
    }
  }

}());
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

module.export({
  default: () => NamedQueryBase
});
let deepClone;
module.link("lodash.clonedeep", {
  default(v) {
    deepClone = v;
  }

}, 0);

class NamedQueryBase {
  constructor(name, collection, body, options = {}) {
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

  get name() {
    return `named_query_${this.queryName}`;
  }

  get isResolver() {
    return !!this.resolver;
  }

  setParams(params) {
    this.params = _.extend({}, this.params, params);
    return this;
  }
  /**
   * Validates the parameters
   */


  doValidateParams(params) {
    params = params || this.params;
    const {
      validateParams
    } = this.options;
    if (!validateParams) return;

    try {
      this._validate(validateParams, params);
    } catch (validationError) {
      console.error(`Invalid parameters supplied to the query "${this.queryName}"\n`, validationError);
      throw validationError; // rethrow
    }
  }

  clone(newParams) {
    const params = _.extend({}, deepClone(this.params), newParams);

    let clone = new this.constructor(this.queryName, this.collection, this.isResolver ? this.resolver : deepClone(this.body), (0, _objectSpread2.default)({}, this.options, {
      params
    }));
    clone.cacher = this.cacher;

    if (this.exposeConfig) {
      clone.exposeConfig = this.exposeConfig;
    }

    return clone;
  }
  /**
   * @param {function|object} validator
   * @param {object} params
   * @private
   */


  _validate(validator, params) {
    if (_.isFunction(validator)) {
      validator.call(null, params);
    } else {
      check(params, validator);
    }
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"namedQuery.client.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/namedQuery.client.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let CountSubscription;
module.link("../query/counts/countSubscription", {
  default(v) {
    CountSubscription = v;
  }

}, 0);
let createGraph;
module.link("../query/lib/createGraph.js", {
  default(v) {
    createGraph = v;
  }

}, 1);
let recursiveFetch;
module.link("../query/lib/recursiveFetch.js", {
  default(v) {
    recursiveFetch = v;
  }

}, 2);
let prepareForProcess;
module.link("../query/lib/prepareForProcess.js", {
  default(v) {
    prepareForProcess = v;
  }

}, 3);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 4);
let callWithPromise;
module.link("../query/lib/callWithPromise", {
  default(v) {
    callWithPromise = v;
  }

}, 5);
let Base;
module.link("./namedQuery.base", {
  default(v) {
    Base = v;
  }

}, 6);
let LocalCollection;
module.link("meteor/minimongo", {
  LocalCollection(v) {
    LocalCollection = v;
  }

}, 7);
let intersectDeep;
module.link("../query/lib/intersectDeep", {
  default(v) {
    intersectDeep = v;
  }

}, 8);
module.exportDefault(class extends Base {
  /**
   * Subscribe
   *
   * @param callback
   * @returns {null|any|*}
   */
  subscribe(callback) {
    if (this.isResolver) {
      throw new Meteor.Error('not-allowed', `You cannot subscribe to a resolver query`);
    }

    this.subscriptionHandle = Meteor.subscribe(this.name, this.params, callback);
    return this.subscriptionHandle;
  }
  /**
   * Subscribe to the counts for this query
   *
   * @param callback
   * @returns {Object}
   */


  subscribeCount(callback) {
    if (this.isResolver) {
      throw new Meteor.Error('not-allowed', `You cannot subscribe to a resolver query`);
    }

    if (!this._counter) {
      this._counter = new CountSubscription(this);
    }

    return this._counter.subscribe(this.params, callback);
  }
  /**
   * Unsubscribe if an existing subscription exists
   */


  unsubscribe() {
    if (this.subscriptionHandle) {
      this.subscriptionHandle.stop();
    }

    this.subscriptionHandle = null;
  }
  /**
   * Unsubscribe to the counts if a subscription exists.
   */


  unsubscribeCount() {
    if (this._counter) {
      this._counter.unsubscribe();

      this._counter = null;
    }
  }
  /**
   * Fetches elements in sync using promises
   * @return {*}
   */


  fetchSync() {
    return Promise.asyncApply(() => {
      if (this.subscriptionHandle) {
        throw new Meteor.Error('This query is reactive, meaning you cannot use promises to fetch the data.');
      }

      return Promise.await(callWithPromise(this.name, this.params));
    });
  }
  /**
   * Fetches one element in sync
   * @return {*}
   */


  fetchOneSync() {
    return Promise.asyncApply(() => {
      return _.first(Promise.await(this.fetchSync()));
    });
  }
  /**
   * Retrieves the data.
   * @param callbackOrOptions
   * @returns {*}
   */


  fetch(callbackOrOptions) {
    if (!this.subscriptionHandle) {
      return this._fetchStatic(callbackOrOptions);
    } else {
      return this._fetchReactive(callbackOrOptions);
    }
  }
  /**
   * @param args
   * @returns {*}
   */


  fetchOne(...args) {
    if (!this.subscriptionHandle) {
      const callback = args[0];

      if (!_.isFunction(callback)) {
        throw new Meteor.Error('You did not provide a valid callback');
      }

      this.fetch((err, res) => {
        callback(err, res ? _.first(res) : null);
      });
    } else {
      return _.first(this.fetch(...args));
    }
  }
  /**
   * Gets the count of matching elements in sync.
   * @returns {any}
   */


  getCountSync() {
    return Promise.asyncApply(() => {
      if (this._counter) {
        throw new Meteor.Error('This query is reactive, meaning you cannot use promises to fetch the data.');
      }

      return Promise.await(callWithPromise(this.name + '.count', this.params));
    });
  }
  /**
   * Gets the count of matching elements.
   * @param callback
   * @returns {any}
   */


  getCount(callback) {
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
  /**
   * Fetching non-reactive queries
   * @param callback
   * @private
   */


  _fetchStatic(callback) {
    if (!callback) {
      throw new Meteor.Error('not-allowed', 'You are on client so you must either provide a callback to get the data or subscribe first.');
    }

    Meteor.call(this.name, this.params, callback);
  }
  /**
   * Fetching when we've got an active publication
   *
   * @param options
   * @returns {*}
   * @private
   */


  _fetchReactive(options = {}) {
    let body = this.body;

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

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"namedQuery.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/namedQuery.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let NamedQueryClient;
module.link("./namedQuery.client", {
  default(v) {
    NamedQueryClient = v;
  }

}, 0);
let NamedQueryServer;
module.link("./namedQuery.server", {
  default(v) {
    NamedQueryServer = v;
  }

}, 1);
let NamedQuery;

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
let prepareForProcess;
module.link("../query/lib/prepareForProcess.js", {
  default(v) {
    prepareForProcess = v;
  }

}, 0);
let Base;
module.link("./namedQuery.base", {
  default(v) {
    Base = v;
  }

}, 1);
let deepClone;
module.link("lodash.clonedeep", {
  default(v) {
    deepClone = v;
  }

}, 2);
let MemoryResultCacher;
module.link("./cache/MemoryResultCacher", {
  default(v) {
    MemoryResultCacher = v;
  }

}, 3);
let intersectDeep;
module.link("../query/lib/intersectDeep", {
  default(v) {
    intersectDeep = v;
  }

}, 4);
module.exportDefault(class extends Base {
  /**
   * Retrieves the data.
   * @returns {*}
   */
  fetch(context) {
    this._performSecurityChecks(context, this.params);

    if (this.isResolver) {
      return this._fetchResolverData(context);
    } else {
      body = deepClone(this.body);

      if (this.params.$body) {
        body = intersectDeep(body, this.params.$body);
      } // we must apply emobdyment here


      this.doEmbodimentIfItApplies(body);
      const query = this.collection.createQuery(deepClone(body), {
        params: deepClone(this.params)
      });

      if (this.cacher) {
        const cacheId = this.cacher.generateQueryId(this.queryName, this.params);
        return this.cacher.fetch(cacheId, {
          query
        });
      }

      return query.fetch();
    }
  }
  /**
   * @param args
   * @returns {*}
   */


  fetchOne(...args) {
    return _.first(this.fetch(...args));
  }
  /**
   * Gets the count of matching elements.
   *
   * @returns {any}
   */


  getCount(context) {
    this._performSecurityChecks(context, this.params);

    const countCursor = this.getCursorForCounting();

    if (this.cacher) {
      const cacheId = 'count::' + this.cacher.generateQueryId(this.queryName, this.params);
      return this.cacher.fetch(cacheId, {
        countCursor
      });
    }

    return countCursor.count();
  }
  /**
   * Returns the cursor for counting
   * This is most likely used for counts cursor
   */


  getCursorForCounting() {
    let body = deepClone(this.body);
    this.doEmbodimentIfItApplies(body);
    body = prepareForProcess(body, this.params);
    return this.collection.find(body.$filters || {}, {
      fields: {
        _id: 1
      }
    });
  }
  /**
   * @param cacher
   */


  cacheResults(cacher) {
    if (!cacher) {
      cacher = new MemoryResultCacher();
    }

    this.cacher = cacher;
  }
  /**
   * Configure resolve. This doesn't actually call the resolver, it just sets it
   * @param fn
   */


  resolve(fn) {
    if (!this.isResolver) {
      throw new Meteor.Error('invalid-call', `You cannot use resolve() on a non resolver NamedQuery`);
    }

    this.resolver = fn;
  }
  /**
   * @returns {*}
   * @private
   */


  _fetchResolverData(context) {
    const resolver = this.resolver;
    const self = this;
    const query = {
      fetch() {
        return resolver.call(context, self.params);
      }

    };

    if (this.cacher) {
      const cacheId = this.cacher.generateQueryId(this.queryName, this.params);
      return this.cacher.fetch(cacheId, {
        query
      });
    }

    return query.fetch();
  }
  /**
   * @param context Meteor method/publish context
   * @param params
   *
   * @private
   */


  _performSecurityChecks(context, params) {
    if (context && this.exposeConfig) {
      this._callFirewall(context, context.userId, params);
    }

    this.doValidateParams(params);
  }

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"store.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/store.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exportDefault(new class {
  constructor() {
    this.storage = {};
  }

  add(key, value) {
    if (this.storage[key]) {
      throw new Meteor.Error('invalid-name', `You have previously defined another namedQuery with the same name: "${key}". Named Query names should be unique.`);
    }

    this.storage[key] = value;
  }

  get(key) {
    return this.storage[key];
  }

  getAll() {
    return this.storage;
  }

}());
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cache":{"BaseResultCacher.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/cache/BaseResultCacher.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => BaseResultCacher
});
let EJSON;
module.link("meteor/ejson", {
  EJSON(v) {
    EJSON = v;
  }

}, 0);

class BaseResultCacher {
  constructor(config = {}) {
    this.config = config;
  }
  /**
   * @param queryName
   * @param params
   * @returns {string}
   */


  generateQueryId(queryName, params) {
    return `${queryName}::${EJSON.stringify(params)}`;
  }
  /**
   * Dummy function
   */


  fetch(cacheId, {
    query,
    countCursor
  }) {
    throw 'Not implemented';
  }
  /**
   * @param query
   * @param countCursor
   * @returns {*}
   */


  static fetchData({
    query,
    countCursor
  }) {
    if (query) {
      return query.fetch();
    } else {
      return countCursor.count();
    }
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"MemoryResultCacher.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/cache/MemoryResultCacher.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => MemoryResultCacher
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let cloneDeep;
module.link("lodash.clonedeep", {
  default(v) {
    cloneDeep = v;
  }

}, 1);
let BaseResultCacher;
module.link("./BaseResultCacher", {
  default(v) {
    BaseResultCacher = v;
  }

}, 2);
const DEFAULT_TTL = 60000;
/**
 * This is a very basic in-memory result caching functionality
 */

class MemoryResultCacher extends BaseResultCacher {
  constructor(config = {}) {
    super(config);
    this.store = {};
  }
  /**
   * @param cacheId
   * @param query
   * @param countCursor
   * @returns {*}
   */


  fetch(cacheId, {
    query,
    countCursor
  }) {
    const cacheData = this.store[cacheId];

    if (cacheData !== undefined) {
      return cloneDeep(cacheData);
    }

    const data = BaseResultCacher.fetchData({
      query,
      countCursor
    });
    this.storeData(cacheId, data);
    return data;
  }
  /**
   * @param cacheId
   * @param data
   */


  storeData(cacheId, data) {
    const ttl = this.config.ttl || DEFAULT_TTL;
    this.store[cacheId] = cloneDeep(data);
    Meteor.setTimeout(() => {
      delete this.store[cacheId];
    }, ttl);
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"expose":{"extension.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/expose/extension.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let NamedQuery;
module.link("../namedQuery.js", {
  default(v) {
    NamedQuery = v;
  }

}, 0);
let ExposeSchema, ExposeDefaults;
module.link("./schema.js", {
  ExposeSchema(v) {
    ExposeSchema = v;
  },

  ExposeDefaults(v) {
    ExposeDefaults = v;
  }

}, 1);
let mergeDeep;
module.link("./lib/mergeDeep.js", {
  default(v) {
    mergeDeep = v;
  }

}, 2);
let createGraph;
module.link("../../query/lib/createGraph.js", {
  default(v) {
    createGraph = v;
  }

}, 3);
let recursiveCompose;
module.link("../../query/lib/recursiveCompose.js", {
  default(v) {
    recursiveCompose = v;
  }

}, 4);
let prepareForProcess;
module.link("../../query/lib/prepareForProcess.js", {
  default(v) {
    prepareForProcess = v;
  }

}, 5);
let deepClone;
module.link("lodash.clonedeep", {
  default(v) {
    deepClone = v;
  }

}, 6);
let intersectDeep;
module.link("../../query/lib/intersectDeep", {
  default(v) {
    intersectDeep = v;
  }

}, 7);
let genCountEndpoint;
module.link("../../query/counts/genEndpoint.server", {
  default(v) {
    genCountEndpoint = v;
  }

}, 8);
let check;
module.link("meteor/check", {
  check(v) {
    check = v;
  }

}, 9);

_.extend(NamedQuery.prototype, {
  /**
   * @param config
   */
  expose(config = {}) {
    if (!Meteor.isServer) {
      throw new Meteor.Error('invalid-environment', `You must run this in server-side code`);
    }

    if (this.isExposed) {
      throw new Meteor.Error('query-already-exposed', `You have already exposed: "${this.name}" named query`);
    }

    this.exposeConfig = Object.assign({}, ExposeDefaults, config);
    check(this.exposeConfig, ExposeSchema);

    if (this.exposeConfig.validateParams) {
      this.options.validateParams = this.exposeConfig.validateParams;
    }

    if (!this.isResolver) {
      this._initNormalQuery();
    } else {
      this._initMethod();
    }

    this.isExposed = true;
  },

  /**
   * Initializes a normal NamedQuery (normal == not a resolver)
   * @private
   */
  _initNormalQuery() {
    const config = this.exposeConfig;

    if (config.method) {
      this._initMethod();
    }

    if (config.publication) {
      this._initPublication();
    }

    if (!config.method && !config.publication) {
      throw new Meteor.Error('weird', 'If you want to expose your named query you need to specify at least one of ["method", "publication"] options to true');
    }

    this._initCountMethod();

    this._initCountPublication();
  },

  /**
   * Returns the embodied body of the request
   * @param {*} _embody
   * @param {*} body
   */
  doEmbodimentIfItApplies(body) {
    // query is not exposed yet, so it doesn't have embodiment logic
    if (!this.exposeConfig) {
      return;
    }

    const {
      embody
    } = this.exposeConfig;

    if (!embody) {
      return;
    }

    if (_.isFunction(embody)) {
      embody.call(this, body, this.params);
    } else {
      mergeDeep(body, embody);
    }
  },

  /**
   * @private
   */
  _initMethod() {
    const self = this;
    Meteor.methods({
      [this.name](newParams) {
        self._unblockIfNecessary(this); // security is done in the fetching because we provide a context


        return self.clone(newParams).fetch(this);
      }

    });
  },

  /**
   * @returns {void}
   * @private
   */
  _initCountMethod() {
    const self = this;
    Meteor.methods({
      [this.name + '.count'](newParams) {
        self._unblockIfNecessary(this); // security is done in the fetching because we provide a context


        return self.clone(newParams).getCount(this);
      }

    });
  },

  /**
   * @returns {*}
   * @private
   */
  _initCountPublication() {
    const self = this;
    genCountEndpoint(self.name, {
      getCursor({
        session
      }) {
        const query = self.clone(session.params);
        return query.getCursorForCounting();
      },

      getSession(params) {
        self.doValidateParams(params);

        self._callFirewall(this, this.userId, params);

        return {
          name: self.name,
          params
        };
      }

    });
  },

  /**
   * @private
   */
  _initPublication() {
    const self = this;
    Meteor.publishComposite(this.name, function (params = {}) {
      const isScoped = !!self.options.scoped;

      if (isScoped) {
        this.enableScope();
      }

      self._unblockIfNecessary(this);

      self.doValidateParams(params);

      self._callFirewall(this, this.userId, params);

      let body = deepClone(self.body);

      if (params.$body) {
        body = intersectDeep(body, params.$body);
      }

      self.doEmbodimentIfItApplies(body);
      body = prepareForProcess(body, params);
      const rootNode = createGraph(self.collection, body);
      return recursiveCompose(rootNode, undefined, {
        scoped: isScoped
      });
    });
  },

  /**
   * @param context
   * @param userId
   * @param params
   * @private
   */
  _callFirewall(context, userId, params) {
    const {
      firewall
    } = this.exposeConfig;

    if (!firewall) {
      return;
    }

    if (_.isArray(firewall)) {
      firewall.forEach(fire => {
        fire.call(context, userId, params);
      });
    } else {
      firewall.call(context, userId, params);
    }
  },

  /**
   * @param context
   * @private
   */
  _unblockIfNecessary(context) {
    if (this.exposeConfig.unblock) {
      if (context.unblock) {
        context.unblock();
      }
    }
  }

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"schema.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/expose/schema.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  ExposeDefaults: () => ExposeDefaults,
  ExposeSchema: () => ExposeSchema
});
let Match;
module.link("meteor/check", {
  Match(v) {
    Match = v;
  }

}, 0);
const ExposeDefaults = {
  publication: true,
  method: true,
  unblock: true
};
const ExposeSchema = {
  firewall: Match.Maybe(Match.OneOf(Function, [Function])),
  publication: Match.Maybe(Boolean),
  unblock: Match.Maybe(Boolean),
  method: Match.Maybe(Boolean),
  embody: Match.Maybe(Match.OneOf(Object, Function)),
  validateParams: Match.Maybe(Match.OneOf(Object, Function))
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"mergeDeep.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/expose/lib/mergeDeep.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => mergeDeep
});

function mergeDeep(target, source) {
  if (_.isObject(target) && _.isObject(source)) {
    _.each(source, (value, key) => {
      if (_.isFunction(source[key])) {
        target[key] = source[key];
      } else if (_.isObject(source[key])) {
        if (!target[key]) Object.assign(target, {
          [key]: {}
        });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, {
          [key]: source[key]
        });
      }
    });
  }

  return target;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"query":{"query.base.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/query.base.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

module.export({
  default: () => QueryBase
});
let deepClone;
module.link("lodash.clonedeep", {
  default(v) {
    deepClone = v;
  }

}, 0);
let check;
module.link("meteor/check", {
  check(v) {
    check = v;
  }

}, 1);

class QueryBase {
  constructor(collection, body, options = {}) {
    this.isGlobalQuery = true;
    this.collection = collection;
    this.body = deepClone(body);
    this.params = options.params || {};
    this.options = options;
  }

  clone(newParams) {
    const params = _.extend({}, deepClone(this.params), newParams);

    return new this.constructor(this.collection, deepClone(this.body), (0, _objectSpread2.default)({
      params
    }, this.options));
  }

  get name() {
    return `exposure_${this.collection._name}`;
  }
  /**
   * Validates the parameters
   */


  doValidateParams() {
    const {
      validateParams
    } = this.options;
    if (!validateParams) return;

    if (_.isFunction(validateParams)) {
      validateParams.call(null, this.params);
    } else {
      check(this.params);
    }
  }
  /**
   * Merges the params with previous params.
   *
   * @param params
   * @returns {Query}
   */


  setParams(params) {
    this.params = _.extend({}, this.params, params);
    return this;
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"query.client.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/query.client.js                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => Query
});

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 0);
let CountSubscription;
module.link("./counts/countSubscription", {
  default(v) {
    CountSubscription = v;
  }

}, 1);
let createGraph;
module.link("./lib/createGraph.js", {
  default(v) {
    createGraph = v;
  }

}, 2);
let recursiveFetch;
module.link("./lib/recursiveFetch.js", {
  default(v) {
    recursiveFetch = v;
  }

}, 3);
let prepareForProcess;
module.link("./lib/prepareForProcess.js", {
  default(v) {
    prepareForProcess = v;
  }

}, 4);
let callWithPromise;
module.link("./lib/callWithPromise", {
  default(v) {
    callWithPromise = v;
  }

}, 5);
let Base;
module.link("./query.base", {
  default(v) {
    Base = v;
  }

}, 6);

class Query extends Base {
  /**
   * Subscribe
   *
   * @param callback {Function} optional
   * @returns {null|any|*}
   */
  subscribe(callback) {
    this.doValidateParams();
    this.subscriptionHandle = Meteor.subscribe(this.name, prepareForProcess(this.body, this.params), callback);
    return this.subscriptionHandle;
  }
  /**
   * Subscribe to the counts for this query
   *
   * @param callback
   * @returns {Object}
   */


  subscribeCount(callback) {
    this.doValidateParams();

    if (!this._counter) {
      this._counter = new CountSubscription(this);
    }

    return this._counter.subscribe(prepareForProcess(this.body, this.params), callback);
  }
  /**
   * Unsubscribe if an existing subscription exists
   */


  unsubscribe() {
    if (this.subscriptionHandle) {
      this.subscriptionHandle.stop();
    }

    this.subscriptionHandle = null;
  }
  /**
   * Unsubscribe to the counts if a subscription exists.
   */


  unsubscribeCount() {
    if (this._counter) {
      this._counter.unsubscribe();

      this._counter = null;
    }
  }
  /**
   * Fetches elements in sync using promises
   * @return {*}
   */


  fetchSync() {
    return Promise.asyncApply(() => {
      this.doValidateParams();

      if (this.subscriptionHandle) {
        throw new Meteor.Error('This query is reactive, meaning you cannot use promises to fetch the data.');
      }

      return Promise.await(callWithPromise(this.name, prepareForProcess(this.body, this.params)));
    });
  }
  /**
   * Fetches one element in sync
   * @return {*}
   */


  fetchOneSync() {
    return Promise.asyncApply(() => {
      return _.first(Promise.await(this.fetchSync()));
    });
  }
  /**
   * Retrieves the data.
   * @param callbackOrOptions
   * @returns {*}
   */


  fetch(callbackOrOptions) {
    this.doValidateParams();

    if (!this.subscriptionHandle) {
      return this._fetchStatic(callbackOrOptions);
    } else {
      return this._fetchReactive(callbackOrOptions);
    }
  }
  /**
   * @param args
   * @returns {*}
   */


  fetchOne(...args) {
    if (!this.subscriptionHandle) {
      const callback = args[0];

      if (!_.isFunction(callback)) {
        throw new Meteor.Error('You did not provide a valid callback');
      }

      this.fetch((err, res) => {
        callback(err, res ? _.first(res) : null);
      });
    } else {
      return _.first(this.fetch(...args));
    }
  }
  /**
   * Gets the count of matching elements in sync.
   * @returns {any}
   */


  getCountSync() {
    return Promise.asyncApply(() => {
      if (this._counter) {
        throw new Meteor.Error('This query is reactive, meaning you cannot use promises to fetch the data.');
      }

      return Promise.await(callWithPromise(this.name + '.count', prepareForProcess(this.body, this.params)));
    });
  }
  /**
   * Gets the count of matching elements.
   * @param callback
   * @returns {any}
   */


  getCount(callback) {
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
  /**
   * Fetching non-reactive queries
   * @param callback
   * @private
   */


  _fetchStatic(callback) {
    if (!callback) {
      throw new Meteor.Error('not-allowed', 'You are on client so you must either provide a callback to get the data or subscribe first.');
    }

    Meteor.call(this.name, prepareForProcess(this.body, this.params), callback);
  }
  /**
   * Fetching when we've got an active publication
   *
   * @param options
   * @returns {*}
   * @private
   */


  _fetchReactive(options = {}) {
    let body = prepareForProcess(this.body, this.params);

    if (!options.allowSkip && body.$options && body.$options.skip) {
      delete body.$options.skip;
    }

    return recursiveFetch(createGraph(this.collection, body), this.params);
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"query.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/query.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let QueryClient;
module.link("./query.client", {
  default(v) {
    QueryClient = v;
  }

}, 0);
let QueryServer;
module.link("./query.server", {
  default(v) {
    QueryServer = v;
  }

}, 1);
let Query;

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
module.export({
  default: () => Query
});
let createGraph;
module.link("./lib/createGraph.js", {
  default(v) {
    createGraph = v;
  }

}, 0);
let prepareForProcess;
module.link("./lib/prepareForProcess.js", {
  default(v) {
    prepareForProcess = v;
  }

}, 1);
let hypernova;
module.link("./hypernova/hypernova.js", {
  default(v) {
    hypernova = v;
  }

}, 2);
let Base;
module.link("./query.base", {
  default(v) {
    Base = v;
  }

}, 3);

class Query extends Base {
  /**
   * Retrieves the data.
   * @param context
   * @returns {*}
   */
  fetch(context = {}) {
    const node = createGraph(this.collection, prepareForProcess(this.body, this.params));
    return hypernova(node, context.userId, {
      params: this.params
    });
  }
  /**
   * @param args
   * @returns {*}
   */


  fetchOne(...args) {
    return _.first(this.fetch(...args));
  }
  /**
   * Gets the count of matching elements.
   * @returns {integer}
   */


  getCount() {
    return this.collection.find(this.body.$filters || {}, {}).count();
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"counts":{"collection.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/counts/collection.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
let COUNTS_COLLECTION_CLIENT;
module.link("./constants", {
  COUNTS_COLLECTION_CLIENT(v) {
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
  COUNTS_COLLECTION_CLIENT: () => COUNTS_COLLECTION_CLIENT
});
const COUNTS_COLLECTION_CLIENT = 'grapher_counts';
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"countSubscription.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/counts/countSubscription.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => CountSubscription
});
let EJSON;
module.link("meteor/ejson", {
  EJSON(v) {
    EJSON = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let ReactiveVar;
module.link("meteor/reactive-var", {
  ReactiveVar(v) {
    ReactiveVar = v;
  }

}, 2);
let Tracker;
module.link("meteor/tracker", {
  Tracker(v) {
    Tracker = v;
  }

}, 3);
let Counts;
module.link("./collection", {
  default(v) {
    Counts = v;
  }

}, 4);
let createFauxSubscription;
module.link("./createFauxSubscription", {
  default(v) {
    createFauxSubscription = v;
  }

}, 5);
let prepareForProcess;
module.link("../lib/prepareForProcess.js", {
  default(v) {
    prepareForProcess = v;
  }

}, 6);
let NamedQueryBase;
module.link("../../namedQuery/namedQuery.base", {
  default(v) {
    NamedQueryBase = v;
  }

}, 7);

class CountSubscription {
  /**
   * @param {*} query - The query to use when fetching counts
   */
  constructor(query) {
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


  subscribe(arg, callback) {
    // Don't try to resubscribe if arg hasn't changed
    if (EJSON.equals(this.lastArgs, arg) && this.fauxHandle) {
      return this.fauxHandle;
    }

    this.accessToken.set(null);
    this.lastArgs = arg;
    Meteor.call(this.query.name + '.count.subscribe', arg, (error, token) => {
      if (!this._markedForUnsubscribe) {
        this.subscriptionHandle = Meteor.subscribe(this.query.name + '.count', token, callback);
        this.accessToken.set(token);
        this.disconnectComputation = Tracker.autorun(() => this.handleDisconnect());
      }

      this._markedForUnsubscribe = false;
    });
    this.fauxHandle = createFauxSubscription(this);
    return this.fauxHandle;
  }
  /**
   * Unsubscribes from the count endpoint, if there is such a subscription.
   */


  unsubscribe() {
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
  /**
   * Reactively fetch current document count. Returns null if the subscription is not ready yet.
   *
   * @returns {Number|null} - Current document count
   */


  getCount() {
    const id = this.accessToken.get();
    if (id === null) return null;
    const doc = Counts.findOne(id);
    return doc.count;
  }
  /**
   * All session info gets deleted when the server goes down, so when the client attempts to
   * optimistically resume the '.count' publication, the server will throw a 'no-request' error.
   *
   * This function prevents that by manually stopping and restarting the subscription when the
   * connection to the server is lost.
   */


  handleDisconnect() {
    const status = Meteor.status();

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
  /**
   * Returns whether or not a subscription request has been made.
   */


  isSubscribed() {
    return this.accessToken.get() !== null;
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"createFauxSubscription.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/counts/createFauxSubscription.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exportDefault(countManager => ({
  ready: () => countManager.accessToken.get() !== null && countManager.subscriptionHandle.ready(),
  stop: () => countManager.unsubscribe()
}));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"genEndpoint.server.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/counts/genEndpoint.server.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let check;
module.link("meteor/check", {
  check(v) {
    check = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 2);
let COUNTS_COLLECTION_CLIENT;
module.link("./constants", {
  COUNTS_COLLECTION_CLIENT(v) {
    COUNTS_COLLECTION_CLIENT = v;
  }

}, 3);
// XXX: Should this persist between server restarts?
const collection = new Mongo.Collection(null);
/**
 * This method generates a reactive count endpoint (a method and publication) for a collection or named query.
 *
 * @param {String} name - Name of the query or collection
 * @param {Function} getCursor - Takes in the user's session document as an argument, and turns that into a Mongo cursor.
 * @param {Function} getSession - Takes the subscribe method's argument as its parameter. Should enforce any necessary security constraints. The return value of this function is stored in the session document.
 */

module.exportDefault((name, {
  getCursor,
  getSession
}) => {
  Meteor.methods({
    [name + '.count.subscribe'](paramsOrBody) {
      const session = getSession.call(this, paramsOrBody);
      const sessionId = JSON.stringify(session);
      const existingSession = collection.findOne({
        session: sessionId,
        userId: this.userId
      }); // Try to reuse sessions if the user subscribes multiple times with the same data

      if (existingSession) {
        return existingSession._id;
      }

      const token = collection.insert({
        session: sessionId,
        query: name,
        userId: this.userId
      });
      return token;
    }

  });
  Meteor.publish(name + '.count', function (token) {
    check(token, String);
    const self = this;
    const request = collection.findOne({
      _id: token,
      userId: self.userId
    });

    if (!request) {
      throw new Error('no-request', `You must acquire a request token via the "${name}.count.subscribe" method first.`);
    }

    request.session = JSON.parse(request.session);
    const cursor = getCursor.call(this, request); // Start counting

    let count = 0;
    let isReady = false;
    const handle = cursor.observe({
      added() {
        count++;
        isReady && self.changed(COUNTS_COLLECTION_CLIENT, token, {
          count
        });
      },

      removed() {
        count--;
        isReady && self.changed(COUNTS_COLLECTION_CLIENT, token, {
          count
        });
      }

    });
    isReady = true;
    self.added(COUNTS_COLLECTION_CLIENT, token, {
      count
    });
    self.onStop(() => {
      handle.stop();
      collection.remove(token);
    });
    self.ready();
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"hypernova":{"aggregateSearchFilters.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/aggregateSearchFilters.js                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => AggregateFilters
});
let sift;
module.link("sift", {
  default(v) {
    sift = v;
  }

}, 0);

class AggregateFilters {
  constructor(collectionNode, metaFilters) {
    this.collectionNode = collectionNode;
    this.linker = collectionNode.linker;
    this.metaFilters = metaFilters;
    this.isVirtual = this.linker.isVirtual();
    this.linkStorageField = this.linker.linkStorageField;
  }

  get parentObjects() {
    return this.collectionNode.parent.results;
  }

  create() {
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
        throw new Meteor.Error(`Invalid linker type: ${this.linker.type}`);
    }
  }

  createOne() {
    if (!this.isVirtual) {
      return {
        _id: {
          $in: _.uniq(_.pluck(this.parentObjects, this.linkStorageField))
        }
      };
    } else {
      return {
        [this.linkStorageField]: {
          $in: _.uniq(_.pluck(this.parentObjects, '_id'))
        }
      };
    }
  }

  createOneMeta() {
    if (!this.isVirtual) {
      let eligibleObjects = this.parentObjects;

      if (this.metaFilters) {
        eligibleObjects = _.filter(this.parentObjects, object => {
          return sift(this.metaFilters)(object[this.linkStorageField]);
        });
      }

      const storages = _.pluck(eligibleObjects, this.linkStorageField);

      let ids = [];

      _.each(storages, storage => {
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
      let filters = {};

      if (this.metaFilters) {
        _.each(this.metaFilters, (value, key) => {
          filters[this.linkStorageField + '.' + key] = value;
        });
      }

      filters[this.linkStorageField + '._id'] = {
        $in: _.uniq(_.pluck(this.parentObjects, '_id'))
      };
      return filters;
    }
  }

  createMany() {
    if (!this.isVirtual) {
      const arrayOfIds = _.pluck(this.parentObjects, this.linkStorageField);

      return {
        _id: {
          $in: _.uniq(_.union(...arrayOfIds))
        }
      };
    } else {
      const arrayOfIds = _.pluck(this.parentObjects, '_id');

      return {
        [this.linkStorageField]: {
          $in: _.uniq(_.union(...arrayOfIds))
        }
      };
    }
  }

  createManyMeta() {
    if (!this.isVirtual) {
      let ids = [];

      _.each(this.parentObjects, object => {
        if (object[this.linkStorageField]) {
          if (this.metaFilters) {
            const isValid = sift(this.metaFilters);

            _.each(object[this.linkStorageField], object => {
              if (isValid(object)) {
                ids.push(object._id);
              }
            });
          } else {
            _.each(object[this.linkStorageField], object => {
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
      let filters = {};

      if (this.metaFilters) {
        _.each(this.metaFilters, (value, key) => {
          filters[key] = value;
        });
      }

      filters._id = {
        $in: _.uniq(_.pluck(this.parentObjects, '_id'))
      };
      return {
        [this.linkStorageField]: {
          $elemMatch: filters
        }
      };
    }
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"assembleAggregateResults.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/assembleAggregateResults.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let sift;
module.link("sift", {
  default(v) {
    sift = v;
  }

}, 0);
let cleanObjectForMetaFilters;
module.link("./lib/cleanObjectForMetaFilters", {
  default(v) {
    cleanObjectForMetaFilters = v;
  }

}, 1);
module.exportDefault(function (childCollectionNode, aggregateResults, metaFilters) {
  const linker = childCollectionNode.linker;
  const linkStorageField = linker.linkStorageField;
  const linkName = childCollectionNode.linkName;
  const isMeta = linker.isMeta();
  const isMany = linker.isMany();
  let allResults = [];

  if (isMeta && metaFilters) {
    const metaFiltersTest = sift(metaFilters);

    _.each(childCollectionNode.parent.results, parentResult => {
      cleanObjectForMetaFilters(parentResult, linkStorageField, metaFiltersTest);
    });
  }

  if (isMeta && isMany) {
    // This case is treated differently because we get an array response from the pipeline.
    _.each(childCollectionNode.parent.results, parentResult => {
      parentResult[linkName] = parentResult[linkName] || [];

      const eligibleAggregateResults = _.filter(aggregateResults, aggregateResult => {
        return _.contains(aggregateResult._id, parentResult._id);
      });

      if (eligibleAggregateResults.length) {
        const datas = _.pluck(eligibleAggregateResults, 'data'); /// [ [x1, x2], [x2, x3] ]


        _.each(datas, data => {
          _.each(data, item => {
            parentResult[linkName].push(item);
          });
        });
      }
    });

    _.each(aggregateResults, aggregateResult => {
      _.each(aggregateResult.data, item => allResults.push(item));
    });
  } else {
    let comparator;

    if (isMany) {
      comparator = (aggregateResult, result) => _.contains(aggregateResult._id, result._id);
    } else {
      comparator = (aggregateResult, result) => aggregateResult._id == result._id;
    }

    const childLinkName = childCollectionNode.linkName;
    const parentResults = childCollectionNode.parent.results;
    parentResults.forEach(parentResult => {
      // We are now finding the data from the pipeline that is related to the _id of the parent
      const eligibleAggregateResults = aggregateResults.filter(aggregateResult => comparator(aggregateResult, parentResult));
      eligibleAggregateResults.forEach(aggregateResult => {
        if (Array.isArray(parentResult[childLinkName])) {
          parentResult[childLinkName].push(...aggregateResult.data);
        } else {
          parentResult[childLinkName] = [...aggregateResult.data];
        }
      });
    });
    aggregateResults.forEach(aggregateResult => {
      allResults.push(...aggregateResult.data);
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
let createSearchFilters;
module.link("../../links/lib/createSearchFilters", {
  default(v) {
    createSearchFilters = v;
  }

}, 0);
let cleanObjectForMetaFilters;
module.link("./lib/cleanObjectForMetaFilters", {
  default(v) {
    cleanObjectForMetaFilters = v;
  }

}, 1);
let sift;
module.link("sift", {
  default(v) {
    sift = v;
  }

}, 2);
module.exportDefault((childCollectionNode, {
  limit,
  skip,
  metaFilters
}) => {
  if (childCollectionNode.results.length === 0) {
    return;
  }

  const parent = childCollectionNode.parent;
  const linker = childCollectionNode.linker;
  const strategy = linker.strategy;
  const isSingle = linker.isSingle();
  const isMeta = linker.isMeta();
  const fieldStorage = linker.linkStorageField; // cleaning the parent results from a child
  // this may be the wrong approach but it works for now

  if (isMeta && metaFilters) {
    const metaFiltersTest = sift(metaFilters);

    _.each(parent.results, parentResult => {
      cleanObjectForMetaFilters(parentResult, fieldStorage, metaFiltersTest);
    });
  }

  const resultsByKeyId = _.groupBy(childCollectionNode.results, '_id');

  if (strategy === 'one') {
    parent.results.forEach(parentResult => {
      if (!parentResult[fieldStorage]) {
        return;
      }

      parentResult[childCollectionNode.linkName] = filterAssembledData(resultsByKeyId[parentResult[fieldStorage]], {
        limit,
        skip
      });
    });
  }

  if (strategy === 'many') {
    parent.results.forEach(parentResult => {
      if (!parentResult[fieldStorage]) {
        return;
      }

      let data = [];
      parentResult[fieldStorage].forEach(_id => {
        data.push(_.first(resultsByKeyId[_id]));
      });
      parentResult[childCollectionNode.linkName] = filterAssembledData(data, {
        limit,
        skip
      });
    });
  }

  if (strategy === 'one-meta') {
    parent.results.forEach(parentResult => {
      if (!parentResult[fieldStorage]) {
        return;
      }

      const _id = parentResult[fieldStorage]._id;
      parentResult[childCollectionNode.linkName] = filterAssembledData(resultsByKeyId[_id], {
        limit,
        skip
      });
    });
  }

  if (strategy === 'many-meta') {
    parent.results.forEach(parentResult => {
      const _ids = _.pluck(parentResult[fieldStorage], '_id');

      let data = [];

      _ids.forEach(_id => {
        data.push(_.first(resultsByKeyId[_id]));
      });

      parentResult[childCollectionNode.linkName] = filterAssembledData(data, {
        limit,
        skip
      });
    });
  }
});

function filterAssembledData(data, {
  limit,
  skip
}) {
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
let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 0);
let SAFE_DOTTED_FIELD_REPLACEMENT;
module.link("./constants", {
  SAFE_DOTTED_FIELD_REPLACEMENT(v) {
    SAFE_DOTTED_FIELD_REPLACEMENT = v;
  }

}, 1);
module.exportDefault(function (childCollectionNode, filters, options, userId) {
  let containsDottedFields = false;
  const linker = childCollectionNode.linker;
  const linkStorageField = linker.linkStorageField;
  const collection = childCollectionNode.collection;
  let pipeline = [];

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

  let _id = linkStorageField;

  if (linker.isMeta()) {
    _id += '._id';
  }

  let dataPush = {
    _id: '$_id'
  };

  _.each(options.fields, (value, field) => {
    if (field.indexOf('.') >= 0) {
      containsDottedFields = true;
    }

    const safeField = field.replace(/\./g, SAFE_DOTTED_FIELD_REPLACEMENT);
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
    let $slice = ["$data"];
    if (options.skip) $slice.push(options.skip);
    if (options.limit) $slice.push(options.limit);
    pipeline.push({
      $project: {
        _id: 1,
        data: {
          $slice
        }
      }
    });
  }

  return {
    pipeline,
    containsDottedFields
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
  SAFE_DOTTED_FIELD_REPLACEMENT: () => SAFE_DOTTED_FIELD_REPLACEMENT
});
const SAFE_DOTTED_FIELD_REPLACEMENT = '___';
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"hypernova.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/hypernova.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => hypernovaInit
});
let applyProps;
module.link("../lib/applyProps.js", {
  default(v) {
    applyProps = v;
  }

}, 0);
let prepareForDelivery;
module.link("../lib/prepareForDelivery.js", {
  default(v) {
    prepareForDelivery = v;
  }

}, 1);
let storeHypernovaResults;
module.link("./storeHypernovaResults.js", {
  default(v) {
    storeHypernovaResults = v;
  }

}, 2);

function hypernova(collectionNode, userId) {
  _.each(collectionNode.collectionNodes, childCollectionNode => {
    let {
      filters,
      options
    } = applyProps(childCollectionNode);
    storeHypernovaResults(childCollectionNode, userId);
    hypernova(childCollectionNode, userId);
  });
}

function hypernovaInit(collectionNode, userId, config = {}) {
  const bypassFirewalls = config.bypassFirewalls || false;
  const params = config.params || {};
  let {
    filters,
    options
  } = applyProps(collectionNode);
  const collection = collectionNode.collection;
  collectionNode.results = collection.find(filters, options, userId).fetch();
  const userIdToPass = config.bypassFirewalls ? undefined : userId;
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
  default: () => storeHypernovaResults
});
let applyProps;
module.link("../lib/applyProps.js", {
  default(v) {
    applyProps = v;
  }

}, 0);
let AggregateFilters;
module.link("./aggregateSearchFilters.js", {
  default(v) {
    AggregateFilters = v;
  }

}, 1);
let assemble;
module.link("./assembler.js", {
  default(v) {
    assemble = v;
  }

}, 2);
let assembleAggregateResults;
module.link("./assembleAggregateResults.js", {
  default(v) {
    assembleAggregateResults = v;
  }

}, 3);
let buildAggregatePipeline;
module.link("./buildAggregatePipeline.js", {
  default(v) {
    buildAggregatePipeline = v;
  }

}, 4);
let snapBackDottedFields;
module.link("./lib/snapBackDottedFields", {
  default(v) {
    snapBackDottedFields = v;
  }

}, 5);

function storeHypernovaResults(childCollectionNode, userId) {
  if (childCollectionNode.parent.results.length === 0) {
    return childCollectionNode.results = [];
  }

  let {
    filters,
    options
  } = applyProps(childCollectionNode);
  const metaFilters = filters.$meta;
  const aggregateFilters = new AggregateFilters(childCollectionNode, metaFilters);
  delete filters.$meta;
  const linker = childCollectionNode.linker;
  const isVirtual = linker.isVirtual();
  const collection = childCollectionNode.collection;

  _.extend(filters, aggregateFilters.create()); // if it's not virtual then we retrieve them and assemble them here.


  if (!isVirtual) {
    const filteredOptions = _.omit(options, 'limit');

    childCollectionNode.results = collection.find(filters, filteredOptions, userId).fetch();
    assemble(childCollectionNode, (0, _objectSpread2.default)({}, options, {
      metaFilters
    }));
  } else {
    // virtuals arrive here
    let {
      pipeline,
      containsDottedFields
    } = buildAggregatePipeline(childCollectionNode, filters, options, userId);
    let aggregateResults = collection.aggregate(pipeline);
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
let SAFE_DOTTED_FIELD_REPLACEMENT;
module.link("../constants", {
  SAFE_DOTTED_FIELD_REPLACEMENT(v) {
    SAFE_DOTTED_FIELD_REPLACEMENT = v;
  }

}, 0);
let dot;
module.link("dot-object", {
  default(v) {
    dot = v;
  }

}, 1);
module.exportDefault(function (aggregationResult) {
  aggregationResult.forEach(result => {
    result.data = result.data.map(document => {
      _.each(document, (value, key) => {
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
  default: () => applyProps
});
const restrictOptions = ['disableOplog', 'pollingIntervalMs', 'pollingThrottleMs'];

function applyProps(node) {
  let filters = _.extend({}, node.props.$filters);

  let options = _.extend({}, node.props.$options);

  options = _.omit(options, ...restrictOptions);
  options.fields = options.fields || {};
  node.applyFields(filters, options);
  return {
    filters,
    options
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
module.exportDefault((method, myParameters) => {
  return new Promise((resolve, reject) => {
    Meteor.call(method, myParameters, (err, res) => {
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
  specialFields: () => specialFields,
  createNodes: () => createNodes,
  addFieldNode: () => addFieldNode,
  getNodeNamespace: () => getNodeNamespace
});
let CollectionNode;
module.link("../nodes/collectionNode.js", {
  default(v) {
    CollectionNode = v;
  }

}, 0);
let FieldNode;
module.link("../nodes/fieldNode.js", {
  default(v) {
    FieldNode = v;
  }

}, 1);
let ReducerNode;
module.link("../nodes/reducerNode.js", {
  default(v) {
    ReducerNode = v;
  }

}, 2);
let dotize;
module.link("./dotize.js", {
  default(v) {
    dotize = v;
  }

}, 3);
let createReducers;
module.link("../reducers/lib/createReducers", {
  default(v) {
    createReducers = v;
  }

}, 4);
const specialFields = ['$filters', '$options', '$postFilters', '$postOptions', '$postFilter'];

function createNodes(root) {
  // this is a fix for phantomjs tests (don't really understand it.)
  if (!_.isObject(root.body)) {
    return;
  }

  _.each(root.body, (body, fieldName) => {
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


    let linker = root.collection.getLinker(fieldName);

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

      let subroot = new CollectionNode(linker.getLinkedCollection(), body, fieldName);
      root.add(subroot, linker);
      createNodes(subroot);
      return;
    } // checking if it's a reducer


    const reducer = root.collection.getReducer(fieldName);

    if (reducer) {
      let reducerNode = new ReducerNode(fieldName, reducer);
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
    const keys = _.keys(body);

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
      let dotted = dotize.convert({
        [fieldName]: body
      });

      _.each(dotted, (value, key) => {
        root.add(new FieldNode(key, value));
      });
    } else {
      root.add(new FieldNode(fieldName, body, true));
    }
  } else {
    let fieldNode = new FieldNode(fieldName, body);
    root.add(fieldNode);
  }
}

function getNodeNamespace(node) {
  const parts = [];
  let n = node;

  while (n) {
    const name = n.linker ? n.linker.linkName : n.collection._name;
    parts.push(name); // console.log('linker', node.linker ? node.linker.linkName : node.collection._name);

    n = n.parent;
  }

  return parts.reverse().join('_');
}

module.exportDefault(function (collection, body) {
  let root = new CollectionNode(collection, body);
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
  const cacheField = linker.linkConfig.denormalize.field;
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
module.exportDefault(dotize = {});

dotize.convert = function (obj, prefix) {
  if ((!obj || typeof obj != "object") && !Array.isArray(obj)) {
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
    for (var f in o) {
      if (o[f] && typeof o[f] === "object") {
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
    for (var prop in obj) {
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
let dot;
module.link("dot-object", {
  default(v) {
    dot = v;
  }

}, 0);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 1);
module.exportDefault(function (allowedBody, clientBody) {
  const allowedBodyDot = _.keys(dot.dot(allowedBody));

  const clientBodyDot = _.keys(dot.dot(clientBody));

  const intersection = _.intersection(allowedBodyDot, clientBodyDot);

  const build = {};
  intersection.forEach(intersectedField => {
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
  applyPostFilters: () => applyPostFilters,
  applyPostOptions: () => applyPostOptions,
  getResultsArray: () => getResultsArray,
  removeLinkStorages: () => removeLinkStorages,
  storeOneResults: () => storeOneResults,
  assembleMetadata: () => assembleMetadata
});
let applyReducers;
module.link("../reducers/lib/applyReducers", {
  default(v) {
    applyReducers = v;
  }

}, 0);
let cleanReducerLeftovers;
module.link("../reducers/lib/cleanReducerLeftovers", {
  default(v) {
    cleanReducerLeftovers = v;
  }

}, 1);
let sift;
module.link("sift", {
  default(v) {
    sift = v;
  }

}, 2);
let Minimongo;
module.link("meteor/minimongo", {
  Minimongo(v) {
    Minimongo = v;
  }

}, 3);
module.exportDefault((node, params) => {
  snapBackCaches(node);
  storeOneResults(node, node.results);
  applyReducers(node, params);

  _.each(node.collectionNodes, collectionNode => {
    cloneMetaChildren(collectionNode, node.results);
  });

  _.each(node.collectionNodes, collectionNode => {
    assembleMetadata(collectionNode, node.results);
  });

  cleanReducerLeftovers(node, node.results);
  removeLinkStorages(node, node.results);
  applyPostFilters(node);
  applyPostOptions(node);
  applyPostFilter(node, params);
});

function applyPostFilters(node) {
  const postFilters = node.props.$postFilters;

  if (postFilters) {
    node.results = sift(postFilters, node.results);
  }
}

function applyPostOptions(node) {
  const options = node.props.$postOptions;

  if (options) {
    if (options.sort) {
      const sorter = new Minimongo.Sorter(options.sort);
      node.results.sort(sorter.getComparator());
    }

    if (options.limit || options.skip) {
      const start = options.skip || 0;
      const end = options.limit ? options.limit + start : node.results.length;
      node.results = node.results.slice(start, end);
    }
  }
}

/**
 * Optionally applies a post filtering option
 */
function applyPostFilter(node, params) {
  if (node.props.$postFilter) {
    const filter = node.props.$postFilter;

    if (_.isArray(filter)) {
      filter.forEach(f => {
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

  _.each(node.collectionNodes, collectionNode => {
    const removeStorageField = collectionNode.shouldCleanStorage;

    _.each(sameLevelResults, result => {
      if (removeStorageField) {
        if (collectionNode.isVirtual) {
          const childResults = getResultsArray(result[collectionNode.linkName]);

          _.each(childResults, childResult => {
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

  node.collectionNodes.forEach(collectionNode => {
    _.each(sameLevelResults, result => {
      // The reason we are doing this is that if the requested link does not exist
      // It will fail when we try to get undefined[something] below
      if (result === undefined) {
        return;
      }

      storeOneResults(collectionNode, result[collectionNode.linkName]);
    });

    if (collectionNode.isOneResult) {
      _.each(sameLevelResults, result => {
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

  const linkName = node.linkName;
  const isMeta = node.isMeta; // parentResults might be an object (for type==one links)

  parentResults = getResultsArray(parentResults);
  parentResults.forEach(parentResult => {
    if (isMeta && parentResult[linkName]) {
      if (node.isOneResult) {
        parentResult[linkName] = Object.assign({}, parentResult[linkName]);
      } else {
        parentResult[linkName] = parentResult[linkName].map(object => {
          return Object.assign({}, object);
        });
      }
    }

    node.collectionNodes.forEach(collectionNode => {
      cloneMetaChildren(collectionNode, parentResult[linkName]);
    });
  });
}

function assembleMetadata(node, parentResults) {
  parentResults = getResultsArray(parentResults); // assembling metadata is depth first

  node.collectionNodes.forEach(collectionNode => {
    _.each(parentResults, result => {
      assembleMetadata(collectionNode, result[node.linkName]);
    });
  });

  if (node.isMeta) {
    if (node.isVirtual) {
      _.each(parentResults, parentResult => {
        const childResult = parentResult[node.linkName];

        if (node.isOneResult) {
          if (_.isObject(childResult)) {
            const storage = childResult[node.linkStorageField];
            storeMetadata(childResult, parentResult, storage, true);
          }
        } else {
          _.each(childResult, object => {
            const storage = object[node.linkStorageField];
            storeMetadata(object, parentResult, storage, true);
          });
        }
      });
    } else {
      _.each(parentResults, parentResult => {
        const childResult = parentResult[node.linkName];
        const storage = parentResult[node.linkStorageField];

        if (node.isOneResult) {
          if (childResult) {
            storeMetadata(childResult, parentResult, storage, false);
          }
        } else {
          _.each(childResult, object => {
            storeMetadata(object, parentResult, storage, false);
          });
        }
      });
    }
  }
}

function storeMetadata(element, parentElement, storage, isVirtual) {
  if (isVirtual) {
    let $metadata;

    if (_.isArray(storage)) {
      $metadata = _.find(storage, storageItem => storageItem._id == parentElement._id);
    } else {
      $metadata = storage;
    }

    element.$metadata = _.omit($metadata, '_id');
  } else {
    let $metadata;

    if (_.isArray(storage)) {
      $metadata = _.find(storage, storageItem => storageItem._id == element._id);
    } else {
      $metadata = storage;
    }

    element.$metadata = _.omit($metadata, '_id');
  }
}

function snapBackCaches(node) {
  node.collectionNodes.forEach(collectionNode => {
    snapBackCaches(collectionNode);
  });

  if (!_.isEmpty(node.snapCaches)) {
    // process stuff
    _.each(node.snapCaches, (linkName, cacheField) => {
      const isSingle = _.contains(node.snapCachesSingles, cacheField);

      const linker = node.collection.getLinker(linkName); // we do this because for one direct and one meta direct, id is not stored

      const shoudStoreLinkStorage = !linker.isMany() && !linker.isVirtual();
      node.results.forEach(result => {
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
let check, Match;
module.link("meteor/check", {
  check(v) {
    check = v;
  },

  Match(v) {
    Match = v;
  }

}, 0);
let deepClone;
module.link("lodash.clonedeep", {
  default(v) {
    deepClone = v;
  }

}, 1);

function defaultFilterFunction({
  filters,
  options,
  params
}) {
  if (params.filters) {
    Object.assign(filters, params.filters);
  }

  if (params.options) {
    Object.assign(options, params.options);
  }
}

function applyFilterRecursive(data, params = {}, isRoot = false) {
  if (isRoot && !_.isFunction(data.$filter)) {
    data.$filter = defaultFilterFunction;
  }

  if (data.$filter) {
    check(data.$filter, Match.OneOf(Function, [Function]));
    data.$filters = data.$filters || {};
    data.$options = data.$options || {};

    if (_.isArray(data.$filter)) {
      data.$filter.forEach(filter => {
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

  _.each(data, (value, key) => {
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

module.exportDefault((_body, _params = {}) => {
  let body = deepClone(_body);
  let params = deepClone(_params);
  applyPagination(body, params);
  applyFilterRecursive(body, params, true);
  return body;
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"recursiveCompose.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/lib/recursiveCompose.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let applyProps;
module.link("./applyProps.js", {
  default(v) {
    applyProps = v;
  }

}, 0);
let getNodeNamespace;
module.link("./createGraph", {
  getNodeNamespace(v) {
    getNodeNamespace = v;
  }

}, 1);

/**
 * Adds _query_path fields to the cursor docs which are used for scoped query filtering on the client.
 * 
 * @param cursor 
 * @param ns 
 */
function patchCursor(cursor, ns) {
  const originalObserve = cursor.observe;

  cursor.observe = function (callbacks) {
    const newCallbacks = Object.assign({}, callbacks);

    if (callbacks.added) {
      newCallbacks.added = doc => {
        doc = _.clone(doc);
        doc[`_query_path_${ns}`] = 1;
        callbacks.added(doc);
      };
    }

    return originalObserve.call(cursor, newCallbacks);
  };
}

function compose(node, userId, config) {
  return {
    find(parent) {
      if (parent) {
        let {
          filters,
          options
        } = applyProps(node); // composition

        let linker = node.linker;
        let accessor = linker.createLink(parent); // the rule is this, if a child I want to fetch is virtual, then I want to fetch the link storage of those fields

        if (linker.isVirtual()) {
          options.fields = options.fields || {};

          _.extend(options.fields, {
            [linker.linkStorageField]: 1
          });
        }

        const cursor = accessor.find(filters, options, userId);

        if (config.scoped) {
          patchCursor(cursor, getNodeNamespace(node));
        }

        return cursor;
      }
    },

    children: _.map(node.collectionNodes, n => compose(n, userId, config))
  };
}

module.exportDefault((node, userId, config = {
  bypassFirewalls: false,
  scoped: false
}) => {
  return {
    find() {
      let {
        filters,
        options
      } = applyProps(node);
      const cursor = node.collection.find(filters, options, userId);

      if (config.scoped) {
        patchCursor(cursor, getNodeNamespace(node));
      }

      return cursor;
    },

    children: _.map(node.collectionNodes, n => {
      const userIdToPass = config.bypassFirewalls ? undefined : userId;
      return compose(n, userIdToPass, config);
    })
  };
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"recursiveFetch.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/lib/recursiveFetch.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let applyProps;
module.link("./applyProps.js", {
  default(v) {
    applyProps = v;
  }

}, 0);
let assembleMetadata, removeLinkStorages, storeOneResults;
module.link("./prepareForDelivery", {
  assembleMetadata(v) {
    assembleMetadata = v;
  },

  removeLinkStorages(v) {
    removeLinkStorages = v;
  },

  storeOneResults(v) {
    storeOneResults = v;
  }

}, 1);
let prepareForDelivery;
module.link("./prepareForDelivery", {
  default(v) {
    prepareForDelivery = v;
  }

}, 2);
let getNodeNamespace;
module.link("./createGraph", {
  getNodeNamespace(v) {
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
function fetch(node, parentObject, fetchOptions = {}) {
  let {
    filters,
    options
  } = applyProps(node); // add subscription filter

  if (fetchOptions.scoped && fetchOptions.subscriptionHandle) {
    _.extend(filters, fetchOptions.subscriptionHandle.scopeQuery());
  } // add query path filter


  if (fetchOptions.scoped) {
    _.extend(filters, {
      [`_query_path_${getNodeNamespace(node)}`]: {
        $exists: true
      }
    });
  }

  let results = [];

  if (parentObject) {
    let accessor = node.linker.createLink(parentObject, node.collection);

    if (node.isVirtual) {
      options.fields = options.fields || {};

      _.extend(options.fields, {
        [node.linkStorageField]: 1
      });
    }

    results = accessor.find(filters, options).fetch();
  } else {
    results = node.collection.find(filters, options).fetch();
  }

  _.each(node.collectionNodes, collectionNode => {
    _.each(results, result => {
      const collectionNodeResults = fetch(collectionNode, result);
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

      collectionNode.results.push(...collectionNodeResults); // this was not working because all references must be replaced in snapBackCaches, not only the ones that are 
      // found first
      // const currentIds = _.pluck(collectionNode.results, '_id');
      // collectionNode.results.push(...collectionNodeResults.filter(res => !_.contains(currentIds, res._id)));
    });
  });

  return results;
}

module.exportDefault((node, params, fetchOptions) => {
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

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

module.export({
  default: () => CollectionNode,
  runFieldSanityChecks: () => runFieldSanityChecks
});
let FieldNode;
module.link("./fieldNode.js", {
  default(v) {
    FieldNode = v;
  }

}, 0);
let ReducerNode;
module.link("./reducerNode.js", {
  default(v) {
    ReducerNode = v;
  }

}, 1);
let deepClone;
module.link("lodash.clonedeep", {
  default(v) {
    deepClone = v;
  }

}, 2);
let check, Match;
module.link("meteor/check", {
  check(v) {
    check = v;
  },

  Match(v) {
    Match = v;
  }

}, 3);

class CollectionNode {
  constructor(collection, body = {}, linkName = null) {
    if (collection && !_.isObject(body)) {
      throw new Meteor.Error('invalid-body', `The field "${linkName}" is a collection link, and should have its body defined as an object.`);
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

  get collectionNodes() {
    return _.filter(this.nodes, n => n instanceof CollectionNode);
  }

  get fieldNodes() {
    return _.filter(this.nodes, n => n instanceof FieldNode);
  }

  get reducerNodes() {
    return _.filter(this.nodes, n => n instanceof ReducerNode);
  }
  /**
   * Adds children to itself
   *
   * @param node
   * @param linker
   */


  add(node, linker) {
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
  /**
   * @param prop
   * @param value
   */


  addProp(prop, value) {
    if (prop === '$postFilter') {
      check(value, Match.OneOf(Function, [Function]));
    }

    _.extend(this.props, {
      [prop]: value
    });
  }
  /**
   * @param _node
   */


  remove(_node) {
    this.nodes = _.filter(this.nodes, node => _node !== node);
  }
  /**
   * @param filters
   * @param options
   */


  applyFields(filters, options) {
    let hasAddedAnyField = false;

    _.each(this.fieldNodes, n => {
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


    _.each(this.collectionNodes, collectionNode => {
      let linker = collectionNode.linker;

      if (linker && !linker.isVirtual()) {
        options.fields[linker.linkStorageField] = 1;
        hasAddedAnyField = true;
      }
    }); // if he selected filters, we should automatically add those fields


    _.each(filters, (value, field) => {
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
  /**
   * @param fieldName
   * @returns {boolean}
   */


  hasField(fieldName, checkNested = false) {
    // for checkNested flag it expands profile.phone.verified into 
    // ['profile', 'profile.phone', 'profile.phone.verified']
    // if any of these fields match it means that field exists
    const options = checkNested ? fieldName.split('.').reduce((acc, key) => {
      if (acc.length === 0) {
        return [key];
      }

      const [last] = acc;
      return [...acc, `${last}.${key}`];
    }, []) : [fieldName];
    return !!_.find(this.fieldNodes, fieldNode => {
      return _.contains(options, fieldNode.name);
    });
  }
  /**
   * @param fieldName
   * @returns {FieldNode}
   */


  getField(fieldName) {
    return _.find(this.fieldNodes, fieldNode => {
      return fieldNode.name == fieldName;
    });
  }
  /**
   * @param name
   * @returns {boolean}
   */


  hasCollectionNode(name) {
    return !!_.find(this.collectionNodes, node => {
      return node.linkName == name;
    });
  }
  /**
   * @param name
   * @returns {boolean}
   */


  hasReducerNode(name) {
    return !!_.find(this.reducerNodes, node => {
      return node.name == name;
    });
  }
  /**
   * @param name
   * @returns {ReducerNode}
   */


  getReducerNode(name) {
    return _.find(this.reducerNodes, node => {
      return node.name == name;
    });
  }
  /**
   * @param name
   * @returns {CollectionNode}
   */


  getCollectionNode(name) {
    return _.find(this.collectionNodes, node => {
      return node.linkName == name;
    });
  }
  /**
   * @returns {*}
   */


  getName() {
    return this.linkName ? this.linkName : this.collection ? this.collection._name : 'N/A';
  }
  /**
   * This is used for caching links
   *
   * @param cacheField
   * @param subLinkName
   */


  snapCache(cacheField, subLinkName) {
    this.snapCaches[cacheField] = subLinkName;

    if (this.collection.getLinker(subLinkName).isOneResult()) {
      this.snapCachesSingles.push(cacheField);
    }
  }
  /**
   * This method verifies whether to remove the linkStorageField form the results
   * unless you specify it in your query.
   *
   * @param node
   * @returns {boolean}
   * @private
   */


  _shouldCleanStorage(node) {
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

}

function runFieldSanityChecks(fieldName) {
  // Run sanity checks on the field
  if (fieldName[0] === '$') {
    throw new Error(`You are not allowed to use fields that start with $ inside a reducer's body: ${fieldName}`);
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
  default: () => FieldNode
});

class FieldNode {
  constructor(name, body, isProjectionOperator = false) {
    this.name = name;
    this.projectionOperator = isProjectionOperator ? _.keys(body)[0] : null;
    this.body = !_.isObject(body) || isProjectionOperator ? body : 1;
    this.scheduledForDeletion = false;
  }

  applyFields(fields) {
    fields[this.name] = this.body;
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"reducerNode.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/nodes/reducerNode.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => ReducerNode
});

class ReducerNode {
  constructor(name, {
    body,
    reduce
  }) {
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


  compute(object, ...args) {
    object[this.name] = this.reduce.call(this, object, ...args);
  }

  reduce(object, ...args) {
    return this.reduceFunction.call(this, object, ...args);
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"reducers":{"extension.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/reducers/extension.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let check;
module.link("meteor/check", {
  check(v) {
    check = v;
  }

}, 0);
let addFieldMap;
module.link("./lib/addFieldMap", {
  default(v) {
    addFieldMap = v;
  }

}, 1);
const storage = '__reducers';
Object.assign(Mongo.Collection.prototype, {
  /**
   * @param data
   */
  addReducers(data) {
    if (!this[storage]) {
      this[storage] = {};
    }

    _.each(data, (reducerConfig, reducerName) => {
      if (!this[reducerConfig]) {
        this[reducerConfig] = {};
      }

      if (this.getLinker(reducerName)) {
        throw new Meteor.Error(`You cannot add the reducer with name: ${reducerName} because it is already defined as a link in ${this._name} collection`);
      }

      if (this[reducerConfig][reducerName]) {
        throw new Meteor.Error(`You cannot add the reducer with name: ${reducerName} because it was already added to ${this._name} collection`);
      }

      check(reducerConfig, {
        body: Object,
        reduce: Function
      });

      _.extend(this[storage], {
        [reducerName]: reducerConfig
      });
    });
  },

  /**
   * @param name
   * @returns {*}
   */
  getReducer(name) {
    if (this[storage]) {
      return this[storage][name];
    }
  },

  /**
   * This creates reducers that makes sort of aliases for the database fields we use
   */
  addFieldMap
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
  default: () => addFieldMap
});

function addFieldMap(map) {
  const collection = this;
  let reducers = {};

  for (let key in map) {
    const dbField = map[key];
    reducers[key] = {
      body: {
        [dbField]: 1
      },

      reduce(obj) {
        return obj[dbField];
      }

    };
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
module.export({
  default: () => applyReducers
});

function applyReducers(root, params) {
  _.each(root.collectionNodes, node => {
    applyReducers(node, params);
  });

  const processedReducers = [];
  let reducersQueue = [...root.reducerNodes]; // TODO: find out if there's an infinite reducer inter-deendency

  while (reducersQueue.length) {
    const reducerNode = reducersQueue.shift(); // If this reducer depends on other reducers

    if (reducerNode.dependencies.length) {
      // If there is an unprocessed reducer, move it at the end of the queue
      const allDependenciesComputed = _.all(reducerNode.dependencies, dep => processedReducers.includes(dep));

      if (allDependenciesComputed) {
        root.results.forEach(result => {
          reducerNode.compute(result, params);
        });
        processedReducers.push(reducerNode.name);
      } else {
        // Move it at the end of the queue
        reducersQueue.push(reducerNode);
      }
    } else {
      root.results.forEach(result => {
        reducerNode.compute(result, params);
      });
      processedReducers.push(reducerNode.name);
    }
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
  default: () => cleanReducerLeftovers
});
let dot;
module.link("dot-object", {
  default(v) {
    dot = v;
  }

}, 0);

function cleanReducerLeftovers(root, results) {
  _.each(root.collectionNodes, node => {
    if (node.scheduledForDeletion) {
      results.forEach(result => {
        delete result[node.linkName];
      });
    }
  });

  _.each(root.collectionNodes, node => {
    let childResults;

    if (node.isOneResult) {
      childResults = results.map(result => result[node.linkName]).filter(element => !!element);
    } else {
      childResults = _.flatten(results.map(result => result[node.linkName]).filter(element => !!element));
    }

    cleanReducerLeftovers(node, childResults);
  });

  _.each(root.fieldNodes, node => {
    if (node.scheduledForDeletion) {
      cleanNestedFields(node.name.split('.'), results, root);
    }
  });

  _.each(root.reducerNodes, node => {
    if (node.scheduledForDeletion) {
      results.forEach(result => {
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
  const snapCacheField = root.snapCaches[parts[0]];
  const fieldName = snapCacheField ? snapCacheField : parts[0];

  if (parts.length === 1) {
    results.forEach(result => {
      if (_.isObject(result) && fieldName !== '_id') {
        delete result[fieldName];
      }
    });
    return;
  }

  parts.shift();
  cleanNestedFields(parts, results.filter(result => !!result[fieldName]).map(result => result[fieldName]), root);
  results.forEach(result => {
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
  default: () => addReducers,
  handleAddElement: () => handleAddElement,
  handleAddReducer: () => handleAddReducer,
  handleAddLink: () => handleAddLink,
  handleAddField: () => handleAddField
});
let dot;
module.link("dot-object", {
  default(v) {
    dot = v;
  }

}, 0);
let createNodes;
module.link("../../lib/createGraph", {
  createNodes(v) {
    createNodes = v;
  }

}, 1);
let CollectionNode;
module.link("../../nodes/collectionNode", {
  default(v) {
    CollectionNode = v;
  }

}, 2);
let FieldNode;
module.link("../../nodes/fieldNode", {
  default(v) {
    FieldNode = v;
  }

}, 3);
let ReducerNode;
module.link("../../nodes/reducerNode", {
  default(v) {
    ReducerNode = v;
  }

}, 4);
let embedReducerWithLink;
module.link("./embedReducerWithLink", {
  default(v) {
    embedReducerWithLink = v;
  }

}, 5);
let specialFields;
module.link("../../lib/createGraph", {
  specialFields(v) {
    specialFields = v;
  }

}, 6);

function addReducers(root) {
  // we add reducers last, after we have added all the fields.
  root.reducerNodes.forEach(reducer => {
    _.each(reducer.body, (body, fieldName) => {
      handleAddElement(reducer, root, fieldName, body);
    });
  });
}

function handleAddElement(reducerNode, root, fieldName, body) {
  // if it's a link
  const collection = root.collection;
  const linker = collection.getLinker(fieldName);

  if (linker) {
    return handleAddLink(reducerNode, fieldName, body, root, linker);
  }

  const reducer = collection.getReducer(fieldName);

  if (reducer) {
    reducerNode.dependencies.push(fieldName);
    return handleAddReducer(fieldName, reducer, root);
  } // we assume it's a field in this case


  return handleAddField(fieldName, body, root);
}

function handleAddReducer(fieldName, {
  body,
  reduce
}, root) {
  if (!root.hasReducerNode(fieldName)) {
    let childReducerNode = new ReducerNode(fieldName, {
      body,
      reduce
    });
    root.add(childReducerNode);
    childReducerNode.scheduledForDeletion = true;

    _.each(childReducerNode.body, (body, fieldName) => {
      handleAddElement(childReducerNode, root, fieldName, body);
    });
  }
}

function handleAddLink(reducerNode, fieldName, body, parent, linker) {
  if (parent.hasCollectionNode(fieldName)) {
    const collectionNode = parent.getCollectionNode(fieldName);
    embedReducerWithLink(reducerNode, body, collectionNode);
  } else {
    // add
    let collectionNode = new CollectionNode(linker.getLinkedCollection(), body, fieldName);
    collectionNode.scheduledForDeletion = true;
    parent.add(collectionNode, linker);
    createNodes(collectionNode);
  }
}

function handleAddField(fieldName, body, root) {
  if (_.contains(specialFields, fieldName)) {
    root.addProp(fieldName, body);
    return;
  }

  if (_.isObject(body)) {
    // if reducer specifies a nested field
    // if it's a prop
    const dots = dot.dot({
      [fieldName]: body
    });

    _.each(dots, (value, key) => {
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
    const nestedFields = root.fieldNodes.filter(({
      name
    }) => name.startsWith(`${fieldName}.`)); // remove nested fields - important for minimongo which complains for these situations
    // TODO: excess fields are not removed (caused by adding the root field and removing nested fields) but there
    // should probably be a way to handle this in post-processing - for example by keeping a whitelist of fields
    // and removing anything else

    nestedFields.forEach(node => root.remove(node));
    let fieldNode = new FieldNode(fieldName, body); // delete only if all nested fields are scheduled for deletion (that includes the case of 0 nested fields)

    fieldNode.scheduledForDeletion = nestedFields.every(field => field.scheduledForDeletion);
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
  default: () => embedReducerWithLink
});
let handleAddField, handleAddElement, handleAddReducer;
module.link("./createReducers", {
  handleAddField(v) {
    handleAddField = v;
  },

  handleAddElement(v) {
    handleAddElement = v;
  },

  handleAddReducer(v) {
    handleAddReducer = v;
  }

}, 0);

function embedReducerWithLink(reducerNode, reducerBody, collectionNode) {
  _.each(reducerBody, (value, key) => {
    const collection = collectionNode.collection;

    if (_.isObject(value)) {
      // nested field or link
      if (collectionNode.body[key]) {
        // if it exists
        const linker = collection.getLinker(key); // if it's a link

        if (linker) {
          if (linker.isDenormalized()) {
            if (linker.isSubBodyDenormalized(value)) {
              const cacheField = linker.linkConfig.denormalize.field;
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
        const reducer = collection.getReducer(key);

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
module.useNode();
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
module.useNode();
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
module.useNode();
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
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/cultofcoders:grapher/main.server.js");

/* Exports */
Package._define("cultofcoders:grapher", exports);

})();

//# sourceURL=meteor://💻app/packages/cultofcoders_grapher.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbWFpbi5zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9hZ2dyZWdhdGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9jb21wb3NlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvY3JlYXRlUXVlcnkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9kYi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2V4dGVuc2lvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2V4cG9zdXJlL2V4cG9zdXJlLmNvbmZpZy5zY2hlbWEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9leHBvc3VyZS9leHBvc3VyZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2V4cG9zdXJlL2V4dGVuc2lvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2V4cG9zdXJlL2xpYi9jbGVhbkJvZHkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9leHBvc3VyZS9saWIvY2xlYW5TZWxlY3RvcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9leHBvc3VyZS9saWIvZW5mb3JjZU1heERlcHRoLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvZXhwb3N1cmUvbGliL2VuZm9yY2VNYXhMaW1pdC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2V4cG9zdXJlL2xpYi9yZXN0cmljdEZpZWxkcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2V4cG9zdXJlL2xpYi9yZXN0cmljdExpbmtzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvZ3JhcGhxbC9pbmRleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2dyYXBocWwvbGliL2FzdFRvQm9keS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2dyYXBocWwvbGliL2FzdFRvUXVlcnkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9ncmFwaHFsL2xpYi9kZWZhdWx0cy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2xpbmtzL2NvbmZpZy5zY2hlbWEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9saW5rcy9jb25zdGFudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9saW5rcy9leHRlbnNpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9saW5rcy9saW5rZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9saW5rcy9saWIvY3JlYXRlU2VhcmNoRmlsdGVycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2xpbmtzL2xpbmtUeXBlcy9iYXNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbGlua3MvbGlua1R5cGVzL2xpbmtNYW55LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbGlua3MvbGlua1R5cGVzL2xpbmtNYW55TWV0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2xpbmtzL2xpbmtUeXBlcy9saW5rT25lLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbGlua3MvbGlua1R5cGVzL2xpbmtPbmVNZXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbGlua3MvbGlua1R5cGVzL2xpYi9zbWFydEFyZ3VtZW50cy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL25hbWVkUXVlcnkvbmFtZWRRdWVyeS5iYXNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbmFtZWRRdWVyeS9uYW1lZFF1ZXJ5LmNsaWVudC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL25hbWVkUXVlcnkvbmFtZWRRdWVyeS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL25hbWVkUXVlcnkvbmFtZWRRdWVyeS5zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9uYW1lZFF1ZXJ5L3N0b3JlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbmFtZWRRdWVyeS9jYWNoZS9CYXNlUmVzdWx0Q2FjaGVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbmFtZWRRdWVyeS9jYWNoZS9NZW1vcnlSZXN1bHRDYWNoZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9uYW1lZFF1ZXJ5L2V4cG9zZS9leHRlbnNpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9uYW1lZFF1ZXJ5L2V4cG9zZS9zY2hlbWEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9uYW1lZFF1ZXJ5L2V4cG9zZS9saWIvbWVyZ2VEZWVwLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvcXVlcnkuYmFzZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L3F1ZXJ5LmNsaWVudC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L3F1ZXJ5LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvcXVlcnkuc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvY291bnRzL2NvbGxlY3Rpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9jb3VudHMvY29uc3RhbnRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvY291bnRzL2NvdW50U3Vic2NyaXB0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvY291bnRzL2NyZWF0ZUZhdXhTdWJzY3JpcHRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9jb3VudHMvZ2VuRW5kcG9pbnQuc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvaHlwZXJub3ZhL2FnZ3JlZ2F0ZVNlYXJjaEZpbHRlcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9oeXBlcm5vdmEvYXNzZW1ibGVBZ2dyZWdhdGVSZXN1bHRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvaHlwZXJub3ZhL2Fzc2VtYmxlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2h5cGVybm92YS9idWlsZEFnZ3JlZ2F0ZVBpcGVsaW5lLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvaHlwZXJub3ZhL2NvbnN0YW50cy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2h5cGVybm92YS9oeXBlcm5vdmEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9oeXBlcm5vdmEvc3RvcmVIeXBlcm5vdmFSZXN1bHRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvaHlwZXJub3ZhL2xpYi9jbGVhbk9iamVjdEZvck1ldGFGaWx0ZXJzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvaHlwZXJub3ZhL2xpYi9zbmFwQmFja0RvdHRlZEZpZWxkcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2xpYi9hcHBseVByb3BzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvbGliL2NhbGxXaXRoUHJvbWlzZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2xpYi9jcmVhdGVHcmFwaC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2xpYi9kb3RpemUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9saWIvaW50ZXJzZWN0RGVlcC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2xpYi9wcmVwYXJlRm9yRGVsaXZlcnkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9saWIvcHJlcGFyZUZvclByb2Nlc3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9saWIvcmVjdXJzaXZlQ29tcG9zZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2xpYi9yZWN1cnNpdmVGZXRjaC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L25vZGVzL2NvbGxlY3Rpb25Ob2RlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvbm9kZXMvZmllbGROb2RlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvbm9kZXMvcmVkdWNlck5vZGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9yZWR1Y2Vycy9leHRlbnNpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9yZWR1Y2Vycy9saWIvYWRkRmllbGRNYXAuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9yZWR1Y2Vycy9saWIvYXBwbHlSZWR1Y2Vycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L3JlZHVjZXJzL2xpYi9jbGVhblJlZHVjZXJMZWZ0b3ZlcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9yZWR1Y2Vycy9saWIvY3JlYXRlUmVkdWNlcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9yZWR1Y2Vycy9saWIvZW1iZWRSZWR1Y2VyV2l0aExpbmsuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0IiwiTmFtZWRRdWVyeVN0b3JlIiwiTGlua0NvbnN0YW50cyIsImxpbmsiLCJkZWZhdWx0IiwidiIsIlByb21pc2UiLCJNb25nbyIsIkNvbGxlY3Rpb24iLCJwcm90b3R5cGUiLCJhZ2dyZWdhdGUiLCJwaXBlbGluZXMiLCJvcHRpb25zIiwiY29sbCIsInJhd0NvbGxlY3Rpb24iLCJyZXN1bHQiLCJNZXRlb3IiLCJ3cmFwQXN5bmMiLCJBcnJheSIsImlzQXJyYXkiLCJhd2FpdCIsInRvQXJyYXkiLCJkZWVwRXh0ZW5kIiwiZXhwb3J0RGVmYXVsdCIsImFyZ3MiLCJRdWVyeSIsIk5hbWVkUXVlcnkiLCJuYW1lIiwiYm9keSIsIl8iLCJpc0Z1bmN0aW9uIiwiY3JlYXRlTmFtZWRRdWVyeSIsImVudHJ5UG9pbnROYW1lIiwiZmlyc3QiLCJrZXlzIiwiY29sbGVjdGlvbiIsImdldCIsIkVycm9yIiwiaXNEZXZlbG9wbWVudCIsImNvbnNvbGUiLCJ3YXJuIiwicGFyYW1zIiwiY3JlYXRlTm9ybWFsUXVlcnkiLCJuYW1lZFF1ZXJ5IiwicXVlcnkiLCJhZGQiLCJjbG9uZSIsImRiIiwiUHJveHkiLCJvYmoiLCJwcm9wIiwiZXh0ZW5kIiwiY3JlYXRlUXVlcnkiLCJFeHBvc3VyZURlZmF1bHRzIiwiRXhwb3N1cmVTY2hlbWEiLCJ2YWxpZGF0ZUJvZHkiLCJjcmVhdGVHcmFwaCIsIk1hdGNoIiwiYmxvY2tpbmciLCJtZXRob2QiLCJwdWJsaWNhdGlvbiIsImZpcmV3YWxsIiwiTWF5YmUiLCJPbmVPZiIsIkZ1bmN0aW9uIiwibWF4TGltaXQiLCJJbnRlZ2VyIiwibWF4RGVwdGgiLCJCb29sZWFuIiwiT2JqZWN0IiwicmVzdHJpY3RlZEZpZWxkcyIsIlN0cmluZyIsInJlc3RyaWN0TGlua3MiLCJlIiwidG9TdHJpbmciLCJFeHBvc3VyZSIsImdlbkNvdW50RW5kcG9pbnQiLCJyZWN1cnNpdmVDb21wb3NlIiwiaHlwZXJub3ZhIiwiZW5mb3JjZU1heERlcHRoIiwiZW5mb3JjZU1heExpbWl0IiwiY2xlYW5Cb2R5IiwiZGVlcENsb25lIiwicmVzdHJpY3RGaWVsZHNGbiIsImNoZWNrIiwiZ2xvYmFsQ29uZmlnIiwic2V0Q29uZmlnIiwiY29uZmlnIiwiYXNzaWduIiwiZ2V0Q29uZmlnIiwicmVzdHJpY3RGaWVsZHMiLCJjb25zdHJ1Y3RvciIsIl9faXNFeHBvc2VkRm9yR3JhcGhlciIsIl9fZXhwb3N1cmUiLCJfbmFtZSIsIl92YWxpZGF0ZUFuZENsZWFuIiwiaW5pdFNlY3VyaXR5IiwiaW5pdFB1YmxpY2F0aW9uIiwiaW5pdE1ldGhvZCIsImluaXRDb3VudE1ldGhvZCIsImluaXRDb3VudFB1YmxpY2F0aW9uIiwiZ2V0VHJhbnNmb3JtZWRCb2R5IiwidXNlcklkIiwicHJvY2Vzc2VkQm9keSIsImdldEJvZHkiLCJjYWxsIiwiYmluZCIsInB1Ymxpc2hDb21wb3NpdGUiLCJ0cmFuc2Zvcm1lZEJvZHkiLCJyb290Tm9kZSIsImJ5cGFzc0ZpcmV3YWxscyIsIm1ldGhvZEJvZHkiLCJ1bmJsb2NrIiwibWV0aG9kcyIsImZpbmQiLCIkZmlsdGVycyIsImNvdW50IiwiZ2V0Q3Vyc29yIiwic2Vzc2lvbiIsImZpbHRlcnMiLCJmaWVsZHMiLCJfaWQiLCJnZXRTZXNzaW9uIiwiZmluZE9uZSIsInVuZGVmaW5lZCIsIl9jYWxsRmlyZXdhbGwiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJmb3JFYWNoIiwiZmlyZSIsImV4cG9zZSIsImlzU2VydmVyIiwiY2xlYW5GaWx0ZXJzIiwiY2xlYW5PcHRpb25zIiwiZG90aXplIiwibWFpbiIsInNlY29uZCIsIm9iamVjdCIsIiRvcHRpb25zIiwiZ2V0RmllbGRzIiwiZWFjaCIsInNlY29uZFZhbHVlIiwia2V5IiwidmFsdWUiLCJpc09iamVjdCIsImNvbnZlcnQiLCJmaWVsZEV4aXN0cyIsImVuc3VyZUZpZWxkcyIsInBpY2siLCJzb3J0IiwiZGVlcEZpbHRlckZpZWxkc0FycmF5IiwiZGVlcEZpbHRlckZpZWxkc09iamVjdCIsInNwZWNpYWwiLCJjb250YWlucyIsImZpZWxkIiwiZWxlbWVudCIsImkiLCJpbmRleE9mIiwiZ2V0RGVwdGgiLCJub2RlIiwiZGVwdGgiLCJjb2xsZWN0aW9uTm9kZXMiLCJtYXgiLCJtYXAiLCJsaW1pdCIsImNsZWFuT2JqZWN0IiwicmVzdHJpY3RlZEZpZWxkIiwibWF0Y2hpbmciLCJzdWJmaWVsZCIsInNsaWNlIiwiZ2V0TGlua3MiLCJwYXJlbnROb2RlIiwicmVzdHJpY3RlZExpbmtzIiwiY29sbGVjdGlvbk5vZGUiLCJsaW5rTmFtZSIsInJlbW92ZSIsImV4cG9zdXJlIiwiY29uZmlnUmVzdHJpY3RMaW5rcyIsImFzdFRvUXVlcnkiLCJzZXRBc3RUb1F1ZXJ5RGVmYXVsdHMiLCJTeW1ib2xzIiwiYXN0VG9Cb2R5IiwiQVJHVU1FTlRTIiwiU3ltYm9sIiwiYXN0IiwiZmllbGROb2RlcyIsImV4dHJhY3RTZWxlY3Rpb25TZXQiLCJzZWxlY3Rpb25TZXQiLCJzZXQiLCJzZWxlY3Rpb25zIiwiZWwiLCJhcmd1bWVudE1hcCIsImFyZyIsImdldE1heERlcHRoIiwiZGVueSIsImNsZWFyRW1wdHlPYmplY3RzIiwiY3JlYXRlR2V0QXJncyIsImRlZmF1bHRzIiwiaW50ZXJzZWN0RGVlcCIsIkVycm9ycyIsIk1BWF9ERVBUSCIsImVtYm9keSIsIk51bWJlciIsImludGVyc2VjdCIsImN1cnJlbnRNYXhEZXB0aCIsImdldEFyZ3MiLCJkZXB0aHMiLCJwdXNoIiwiTWF0aCIsInBhcnRzIiwic3BsaXQiLCJhY2Nlc3NvciIsInNoaWZ0Iiwic2hvdWxkRGVsZXRlIiwicGF0aCIsInN0b3BwZWQiLCJEZW5vcm1hbGl6ZVNjaGVtYSIsIkxpbmtDb25maWdEZWZhdWx0cyIsIkxpbmtDb25maWdTY2hlbWEiLCJieXBhc3NTY2hlbWEiLCJ0eXBlIiwiV2hlcmUiLCJfY29sbGVjdGlvbiIsIm1ldGFkYXRhIiwiaW52ZXJzZWRCeSIsImluZGV4IiwidW5pcXVlIiwiYXV0b3JlbW92ZSIsImRlbm9ybWFsaXplIiwiT2JqZWN0SW5jbHVkaW5nIiwiTElOS19TVE9SQUdFIiwiTGlua2VyIiwiYWRkTGlua3MiLCJkYXRhIiwibGlua0NvbmZpZyIsImxpbmtlciIsImdldExpbmtlciIsImhhc0xpbmsiLCJnZXRMaW5rIiwib2JqZWN0T3JJZCIsImxpbmtEYXRhIiwiaXNWaXJ0dWFsIiwibGlua1N0b3JhZ2VGaWVsZCIsImNyZWF0ZUxpbmsiLCJMaW5rTWFueSIsIkxpbmtNYW55TWV0YSIsIkxpbmtPbmUiLCJMaW5rT25lTWV0YSIsInNtYXJ0QXJndW1lbnRzIiwiZG90IiwiYWNjZXNzIiwibWFpbkNvbGxlY3Rpb24iLCJfaW5pdEF1dG9yZW1vdmUiLCJfaW5pdERlbm9ybWFsaXphdGlvbiIsIl9oYW5kbGVSZWZlcmVuY2VSZW1vdmFsRm9yVmlydHVhbExpbmtzIiwiX2luaXRJbmRleCIsIm9uZVR5cGVzIiwic3RyYXRlZ3kiLCJpc01hbnkiLCJyZWxhdGVkTGlua2VyIiwiZ2V0TGlua2VkQ29sbGVjdGlvbiIsImlzU2luZ2xlIiwiaXNNZXRhIiwiaXNPbmVSZXN1bHQiLCJoZWxwZXJDbGFzcyIsIl9nZXRIZWxwZXJDbGFzcyIsImNvbGxlY3Rpb25OYW1lIiwiX3ByZXBhcmVWaXJ0dWFsIiwiX2dlbmVyYXRlRmllbGROYW1lIiwic3RhcnR1cCIsIl9zZXR1cFZpcnR1YWxDb25maWciLCJ2aXJ0dWFsTGlua0NvbmZpZyIsImNsZWFuZWRDb2xsZWN0aW9uTmFtZSIsInJlcGxhY2UiLCJkZWZhdWx0RmllbGRQcmVmaXgiLCJhZnRlciIsImRvYyIsImZldGNoQXNBcnJheSIsImxpbmtlZE9iaiIsInVuc2V0IiwiX2Vuc3VyZUluZGV4Iiwic3BhcnNlIiwiJGluIiwiZ2V0SWRzIiwiaWRzIiwiZmV0Y2giLCJpdGVtIiwicGFja2FnZUV4aXN0cyIsIlBhY2thZ2UiLCJjYWNoZUNvbmZpZyIsInJlZmVyZW5jZUZpZWxkU3VmZml4IiwiaW52ZXJzZWRMaW5rIiwicmVmZXJlbmNlRmllbGQiLCJjYWNoZUZpZWxkIiwiY2FjaGUiLCJpc0Rlbm9ybWFsaXplZCIsImlzU3ViQm9keURlbm9ybWFsaXplZCIsImNhY2hlQm9keSIsImNhY2hlQm9keUZpZWxkcyIsImJvZHlGaWVsZHMiLCJvbWl0IiwiZGlmZmVyZW5jZSIsImNyZWF0ZVNlYXJjaEZpbHRlcnMiLCJjcmVhdGVPbmUiLCJjcmVhdGVPbmVWaXJ0dWFsIiwiY3JlYXRlT25lTWV0YSIsImNyZWF0ZU9uZU1ldGFWaXJ0dWFsIiwiY3JlYXRlTWFueSIsImNyZWF0ZU1hbnlWaXJ0dWFsIiwiY3JlYXRlTWFueU1ldGEiLCJjcmVhdGVNYW55TWV0YVZpcnR1YWwiLCJzaWZ0IiwiZmllbGRTdG9yYWdlIiwibWV0YUZpbHRlcnMiLCJwbHVjayIsIiRlbGVtTWF0Y2giLCJMaW5rIiwiU21hcnRBcmdzIiwibGlua2VkQ29sbGVjdGlvbiIsIiRtZXRhRmlsdGVycyIsIiRtZXRhIiwic2VhcmNoRmlsdGVycyIsImFwcGxpZWRGaWx0ZXJzIiwib3RoZXJzIiwiY2xlYW4iLCJpZGVudGlmeUlkIiwid2hhdCIsInNhdmVUb0RhdGFiYXNlIiwiZ2V0SWQiLCJpZGVudGlmeUlkcyIsIl92YWxpZGF0ZUlkcyIsInZhbGlkSWRzIiwiam9pbiIsIl92aXJ0dWFsQWN0aW9uIiwiYWN0aW9uIiwicmV2ZXJzZWRMaW5rIiwiZWxlbWVudElkIiwiaW5zZXJ0IiwiX2lkcyIsInVuaW9uIiwibW9kaWZpZXIiLCIkYWRkVG9TZXQiLCIkZWFjaCIsInVwZGF0ZSIsImZpbHRlciIsIiRwdWxsQWxsIiwibWV0YWRhdGFzIiwibG9jYWxNZXRhZGF0YSIsImV4dGVuZE1ldGFkYXRhIiwiZXhpc3RpbmdNZXRhZGF0YSIsInN1YmZpZWxkVXBkYXRlIiwiJHNldCIsIiRwdWxsIiwic3ViV2hhdCIsIk5hbWVkUXVlcnlCYXNlIiwiaXNOYW1lZFF1ZXJ5IiwicXVlcnlOYW1lIiwicmVzb2x2ZXIiLCJzdWJzY3JpcHRpb25IYW5kbGUiLCJpc0V4cG9zZWQiLCJpc1Jlc29sdmVyIiwic2V0UGFyYW1zIiwiZG9WYWxpZGF0ZVBhcmFtcyIsInZhbGlkYXRlUGFyYW1zIiwiX3ZhbGlkYXRlIiwidmFsaWRhdGlvbkVycm9yIiwiZXJyb3IiLCJuZXdQYXJhbXMiLCJjYWNoZXIiLCJleHBvc2VDb25maWciLCJ2YWxpZGF0b3IiLCJDb3VudFN1YnNjcmlwdGlvbiIsInJlY3Vyc2l2ZUZldGNoIiwicHJlcGFyZUZvclByb2Nlc3MiLCJjYWxsV2l0aFByb21pc2UiLCJCYXNlIiwiTG9jYWxDb2xsZWN0aW9uIiwic3Vic2NyaWJlIiwiY2FsbGJhY2siLCJzdWJzY3JpYmVDb3VudCIsIl9jb3VudGVyIiwidW5zdWJzY3JpYmUiLCJzdG9wIiwidW5zdWJzY3JpYmVDb3VudCIsImZldGNoU3luYyIsImZldGNoT25lU3luYyIsImNhbGxiYWNrT3JPcHRpb25zIiwiX2ZldGNoU3RhdGljIiwiX2ZldGNoUmVhY3RpdmUiLCJmZXRjaE9uZSIsImVyciIsInJlcyIsImdldENvdW50U3luYyIsImdldENvdW50IiwiJGJvZHkiLCJhbGxvd1NraXAiLCJza2lwIiwic2NvcGVkIiwiTmFtZWRRdWVyeUNsaWVudCIsIk5hbWVkUXVlcnlTZXJ2ZXIiLCJNZW1vcnlSZXN1bHRDYWNoZXIiLCJjb250ZXh0IiwiX3BlcmZvcm1TZWN1cml0eUNoZWNrcyIsIl9mZXRjaFJlc29sdmVyRGF0YSIsImRvRW1ib2RpbWVudElmSXRBcHBsaWVzIiwiY2FjaGVJZCIsImdlbmVyYXRlUXVlcnlJZCIsImNvdW50Q3Vyc29yIiwiZ2V0Q3Vyc29yRm9yQ291bnRpbmciLCJjYWNoZVJlc3VsdHMiLCJyZXNvbHZlIiwiZm4iLCJzZWxmIiwic3RvcmFnZSIsImdldEFsbCIsIkJhc2VSZXN1bHRDYWNoZXIiLCJFSlNPTiIsInN0cmluZ2lmeSIsImZldGNoRGF0YSIsImNsb25lRGVlcCIsIkRFRkFVTFRfVFRMIiwic3RvcmUiLCJjYWNoZURhdGEiLCJzdG9yZURhdGEiLCJ0dGwiLCJzZXRUaW1lb3V0IiwiRXhwb3NlU2NoZW1hIiwiRXhwb3NlRGVmYXVsdHMiLCJtZXJnZURlZXAiLCJfaW5pdE5vcm1hbFF1ZXJ5IiwiX2luaXRNZXRob2QiLCJfaW5pdFB1YmxpY2F0aW9uIiwiX2luaXRDb3VudE1ldGhvZCIsIl9pbml0Q291bnRQdWJsaWNhdGlvbiIsIl91bmJsb2NrSWZOZWNlc3NhcnkiLCJpc1Njb3BlZCIsImVuYWJsZVNjb3BlIiwidGFyZ2V0Iiwic291cmNlIiwiUXVlcnlCYXNlIiwiaXNHbG9iYWxRdWVyeSIsIlF1ZXJ5Q2xpZW50IiwiUXVlcnlTZXJ2ZXIiLCJDT1VOVFNfQ09MTEVDVElPTl9DTElFTlQiLCJSZWFjdGl2ZVZhciIsIlRyYWNrZXIiLCJDb3VudHMiLCJjcmVhdGVGYXV4U3Vic2NyaXB0aW9uIiwiYWNjZXNzVG9rZW4iLCJmYXV4SGFuZGxlIiwiZXF1YWxzIiwibGFzdEFyZ3MiLCJ0b2tlbiIsIl9tYXJrZWRGb3JVbnN1YnNjcmliZSIsImRpc2Nvbm5lY3RDb21wdXRhdGlvbiIsImF1dG9ydW4iLCJoYW5kbGVEaXNjb25uZWN0IiwiaWQiLCJzdGF0dXMiLCJjb25uZWN0ZWQiLCJfbWFya2VkRm9yUmVzdW1lIiwiaXNTdWJzY3JpYmVkIiwiY291bnRNYW5hZ2VyIiwicmVhZHkiLCJwYXJhbXNPckJvZHkiLCJzZXNzaW9uSWQiLCJKU09OIiwiZXhpc3RpbmdTZXNzaW9uIiwicHVibGlzaCIsInJlcXVlc3QiLCJwYXJzZSIsImN1cnNvciIsImlzUmVhZHkiLCJoYW5kbGUiLCJvYnNlcnZlIiwiYWRkZWQiLCJjaGFuZ2VkIiwicmVtb3ZlZCIsIm9uU3RvcCIsIkFnZ3JlZ2F0ZUZpbHRlcnMiLCJwYXJlbnRPYmplY3RzIiwicGFyZW50IiwicmVzdWx0cyIsImNyZWF0ZSIsInVuaXEiLCJlbGlnaWJsZU9iamVjdHMiLCJzdG9yYWdlcyIsImFycmF5T2ZJZHMiLCJpc1ZhbGlkIiwiY2xlYW5PYmplY3RGb3JNZXRhRmlsdGVycyIsImNoaWxkQ29sbGVjdGlvbk5vZGUiLCJhZ2dyZWdhdGVSZXN1bHRzIiwiYWxsUmVzdWx0cyIsIm1ldGFGaWx0ZXJzVGVzdCIsInBhcmVudFJlc3VsdCIsImVsaWdpYmxlQWdncmVnYXRlUmVzdWx0cyIsImFnZ3JlZ2F0ZVJlc3VsdCIsImRhdGFzIiwiY29tcGFyYXRvciIsImNoaWxkTGlua05hbWUiLCJwYXJlbnRSZXN1bHRzIiwicmVzdWx0c0J5S2V5SWQiLCJncm91cEJ5IiwiZmlsdGVyQXNzZW1ibGVkRGF0YSIsIlNBRkVfRE9UVEVEX0ZJRUxEX1JFUExBQ0VNRU5UIiwiY29udGFpbnNEb3R0ZWRGaWVsZHMiLCJwaXBlbGluZSIsIiRtYXRjaCIsIiRzb3J0IiwiZGF0YVB1c2giLCJzYWZlRmllbGQiLCIkZ3JvdXAiLCIkcHVzaCIsIiRzbGljZSIsIiRwcm9qZWN0IiwiaHlwZXJub3ZhSW5pdCIsImFwcGx5UHJvcHMiLCJwcmVwYXJlRm9yRGVsaXZlcnkiLCJzdG9yZUh5cGVybm92YVJlc3VsdHMiLCJ1c2VySWRUb1Bhc3MiLCJhc3NlbWJsZSIsImFzc2VtYmxlQWdncmVnYXRlUmVzdWx0cyIsImJ1aWxkQWdncmVnYXRlUGlwZWxpbmUiLCJzbmFwQmFja0RvdHRlZEZpZWxkcyIsImFnZ3JlZ2F0ZUZpbHRlcnMiLCJmaWx0ZXJlZE9wdGlvbnMiLCJhZ2dyZWdhdGlvblJlc3VsdCIsImRvY3VtZW50IiwiUmVnRXhwIiwicmVzdHJpY3RPcHRpb25zIiwicHJvcHMiLCJhcHBseUZpZWxkcyIsIm15UGFyYW1ldGVycyIsInJlamVjdCIsInJlYXNvbiIsInNwZWNpYWxGaWVsZHMiLCJjcmVhdGVOb2RlcyIsImFkZEZpZWxkTm9kZSIsImdldE5vZGVOYW1lc3BhY2UiLCJDb2xsZWN0aW9uTm9kZSIsIkZpZWxkTm9kZSIsIlJlZHVjZXJOb2RlIiwiY3JlYXRlUmVkdWNlcnMiLCJyb290IiwiZmllbGROYW1lIiwiYWRkUHJvcCIsImhhbmRsZURlbm9ybWFsaXplZCIsInN1YnJvb3QiLCJyZWR1Y2VyIiwiZ2V0UmVkdWNlciIsInJlZHVjZXJOb2RlIiwiaXNQcm9qZWN0aW9uT3BlcmF0b3JFeHByZXNzaW9uIiwiZG90dGVkIiwiZmllbGROb2RlIiwibiIsInJldmVyc2UiLCJzbmFwQ2FjaGUiLCJwcmVmaXgiLCJuZXdPYmoiLCJyZWN1cnNlIiwibyIsInAiLCJpc0FycmF5SXRlbSIsImYiLCJpc0VtcHR5QXJyYXkiLCJnZXRGaWVsZE5hbWUiLCJpc0VtcHR5T2JqIiwiaXNOdW1iZXIiLCJpc05hTiIsInBhcnNlSW50IiwiaGFzT3duUHJvcGVydHkiLCJhbGxvd2VkQm9keSIsImNsaWVudEJvZHkiLCJhbGxvd2VkQm9keURvdCIsImNsaWVudEJvZHlEb3QiLCJpbnRlcnNlY3Rpb24iLCJidWlsZCIsImludGVyc2VjdGVkRmllbGQiLCJhcHBseVBvc3RGaWx0ZXJzIiwiYXBwbHlQb3N0T3B0aW9ucyIsImdldFJlc3VsdHNBcnJheSIsInJlbW92ZUxpbmtTdG9yYWdlcyIsInN0b3JlT25lUmVzdWx0cyIsImFzc2VtYmxlTWV0YWRhdGEiLCJhcHBseVJlZHVjZXJzIiwiY2xlYW5SZWR1Y2VyTGVmdG92ZXJzIiwiTWluaW1vbmdvIiwic25hcEJhY2tDYWNoZXMiLCJjbG9uZU1ldGFDaGlsZHJlbiIsImFwcGx5UG9zdEZpbHRlciIsInBvc3RGaWx0ZXJzIiwiJHBvc3RGaWx0ZXJzIiwiJHBvc3RPcHRpb25zIiwic29ydGVyIiwiU29ydGVyIiwiZ2V0Q29tcGFyYXRvciIsInN0YXJ0IiwiZW5kIiwiJHBvc3RGaWx0ZXIiLCJpc1VuZGVmaW5lZCIsInNhbWVMZXZlbFJlc3VsdHMiLCJyZW1vdmVTdG9yYWdlRmllbGQiLCJzaG91bGRDbGVhblN0b3JhZ2UiLCJjaGlsZFJlc3VsdHMiLCJjaGlsZFJlc3VsdCIsInN0b3JlTWV0YWRhdGEiLCJwYXJlbnRFbGVtZW50IiwiJG1ldGFkYXRhIiwic3RvcmFnZUl0ZW0iLCJpc0VtcHR5Iiwic25hcENhY2hlcyIsInNuYXBDYWNoZXNTaW5nbGVzIiwic2hvdWRTdG9yZUxpbmtTdG9yYWdlIiwiZGVmYXVsdEZpbHRlckZ1bmN0aW9uIiwiYXBwbHlGaWx0ZXJSZWN1cnNpdmUiLCJpc1Jvb3QiLCIkZmlsdGVyIiwiYXBwbHlQYWdpbmF0aW9uIiwiX3BhcmFtcyIsIl9ib2R5IiwicGF0Y2hDdXJzb3IiLCJucyIsIm9yaWdpbmFsT2JzZXJ2ZSIsImNhbGxiYWNrcyIsIm5ld0NhbGxiYWNrcyIsImNvbXBvc2UiLCJjaGlsZHJlbiIsInBhcmVudE9iamVjdCIsImZldGNoT3B0aW9ucyIsInNjb3BlUXVlcnkiLCIkZXhpc3RzIiwiY29sbGVjdGlvbk5vZGVSZXN1bHRzIiwicnVuRmllbGRTYW5pdHlDaGVja3MiLCJub2RlcyIsInNjaGVkdWxlZEZvckRlbGV0aW9uIiwicmVkdWNlcnMiLCJyZWR1Y2VyTm9kZXMiLCJfc2hvdWxkQ2xlYW5TdG9yYWdlIiwiX25vZGUiLCJoYXNBZGRlZEFueUZpZWxkIiwicHJvamVjdGlvbk9wZXJhdG9yIiwiaGFzIiwiaGFzRmllbGQiLCJjaGVja05lc3RlZCIsInJlZHVjZSIsImFjYyIsImxhc3QiLCJnZXRGaWVsZCIsImhhc0NvbGxlY3Rpb25Ob2RlIiwiaGFzUmVkdWNlck5vZGUiLCJnZXRSZWR1Y2VyTm9kZSIsImdldENvbGxlY3Rpb25Ob2RlIiwiZ2V0TmFtZSIsInN1YkxpbmtOYW1lIiwiaXNQcm9qZWN0aW9uT3BlcmF0b3IiLCJyZWR1Y2VGdW5jdGlvbiIsImRlcGVuZGVuY2llcyIsImNvbXB1dGUiLCJhZGRGaWVsZE1hcCIsImFkZFJlZHVjZXJzIiwicmVkdWNlckNvbmZpZyIsInJlZHVjZXJOYW1lIiwiZGJGaWVsZCIsInByb2Nlc3NlZFJlZHVjZXJzIiwicmVkdWNlcnNRdWV1ZSIsImFsbERlcGVuZGVuY2llc0NvbXB1dGVkIiwiYWxsIiwiZGVwIiwiaW5jbHVkZXMiLCJmbGF0dGVuIiwiY2xlYW5OZXN0ZWRGaWVsZHMiLCJzbmFwQ2FjaGVGaWVsZCIsImhhbmRsZUFkZEVsZW1lbnQiLCJoYW5kbGVBZGRSZWR1Y2VyIiwiaGFuZGxlQWRkTGluayIsImhhbmRsZUFkZEZpZWxkIiwiZW1iZWRSZWR1Y2VyV2l0aExpbmsiLCJjaGlsZFJlZHVjZXJOb2RlIiwiZG90cyIsImFkZEZpZWxkSWZSZXF1aXJlZCIsIm5lc3RlZEZpZWxkcyIsInN0YXJ0c1dpdGgiLCJldmVyeSIsInJlZHVjZXJCb2R5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFB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O0FBRUR1Ziw4QkFBb0IsQ0FBQzlILFdBQUQsRUFBY3ZaLEtBQWQsRUFBcUI4QixjQUFjLENBQUM4ZCxpQkFBZixDQUFpQzdmLEdBQWpDLENBQXJCLENBQXBCO0FBQ0E7QUFDSDs7QUFFRHFoQixzQkFBYyxDQUFDcmhCLEdBQUQsRUFBTUMsS0FBTixFQUFhOEIsY0FBYixDQUFkO0FBQ0gsT0FuQkQsTUFtQk87QUFDSDtBQUNBbWYsd0JBQWdCLENBQUMxSCxXQUFELEVBQWN6WCxjQUFkLEVBQThCL0IsR0FBOUIsRUFBbUNDLEtBQW5DLENBQWhCO0FBQ0g7QUFDSixLQXpCRCxNQXlCTztBQUNIO0FBRUEsVUFBSSxDQUFDOEIsY0FBYyxDQUFDakosSUFBZixDQUFvQmtILEdBQXBCLENBQUwsRUFBK0I7QUFDM0I7QUFDQSxjQUFNc1osT0FBTyxHQUFHamdCLFVBQVUsQ0FBQ2tnQixVQUFYLENBQXNCdlosR0FBdEIsQ0FBaEI7O0FBQ0EsWUFBSXNaLE9BQUosRUFBYTtBQUNUO0FBQ0EsaUJBQU82SCxnQkFBZ0IsQ0FBQ25oQixHQUFELEVBQU1zWixPQUFOLEVBQWV2WCxjQUFmLENBQXZCO0FBQ0g7O0FBRUQsZUFBT3NmLGNBQWMsQ0FBQ3JoQixHQUFELEVBQU1DLEtBQU4sRUFBYThCLGNBQWIsQ0FBckI7QUFDSDtBQUNKO0FBQ0osR0ExQ0Q7QUEyQ0gsQyIsImZpbGUiOiIvcGFja2FnZXMvY3VsdG9mY29kZXJzX2dyYXBoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vbGliL2V4dGVuc2lvbi5qcyc7XG5pbXBvcnQgJy4vbGliL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQgJy4vbGliL2V4cG9zdXJlL2V4dGVuc2lvbi5qcyc7XG5pbXBvcnQgJy4vbGliL2xpbmtzL2V4dGVuc2lvbi5qcyc7XG5pbXBvcnQgJy4vbGliL3F1ZXJ5L3JlZHVjZXJzL2V4dGVuc2lvbi5qcyc7XG5pbXBvcnQgJy4vbGliL25hbWVkUXVlcnkvZXhwb3NlL2V4dGVuc2lvbi5qcyc7XG5pbXBvcnQgTmFtZWRRdWVyeVN0b3JlIGZyb20gJy4vbGliL25hbWVkUXVlcnkvc3RvcmUnO1xuaW1wb3J0IExpbmtDb25zdGFudHMgZnJvbSAnLi9saWIvbGlua3MvY29uc3RhbnRzJztcblxuZXhwb3J0IHsgTmFtZWRRdWVyeVN0b3JlLCBMaW5rQ29uc3RhbnRzIH07XG5cbmV4cG9ydCB7IGRlZmF1bHQgYXMgY3JlYXRlUXVlcnkgfSBmcm9tICcuL2xpYi9jcmVhdGVRdWVyeS5qcyc7XG5cbmV4cG9ydCB7IGRlZmF1bHQgYXMgRXhwb3N1cmUgfSBmcm9tICcuL2xpYi9leHBvc3VyZS9leHBvc3VyZS5qcyc7XG5cbmV4cG9ydCB7XG4gICAgZGVmYXVsdCBhcyBNZW1vcnlSZXN1bHRDYWNoZXIsXG59IGZyb20gJy4vbGliL25hbWVkUXVlcnkvY2FjaGUvTWVtb3J5UmVzdWx0Q2FjaGVyJztcblxuZXhwb3J0IHtcbiAgICBkZWZhdWx0IGFzIEJhc2VSZXN1bHRDYWNoZXIsXG59IGZyb20gJy4vbGliL25hbWVkUXVlcnkvY2FjaGUvQmFzZVJlc3VsdENhY2hlcic7XG5cbmV4cG9ydCB7IGRlZmF1bHQgYXMgY29tcG9zZSB9IGZyb20gJy4vbGliL2NvbXBvc2UnO1xuXG5leHBvcnQgKiBmcm9tICcuL2xpYi9ncmFwaHFsJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZGIgfSBmcm9tICcuL2xpYi9kYic7XG4iLCJpbXBvcnQgeyBQcm9taXNlIH0gZnJvbSAnbWV0ZW9yL3Byb21pc2UnO1xuXG5Nb25nby5Db2xsZWN0aW9uLnByb3RvdHlwZS5hZ2dyZWdhdGUgPSBmdW5jdGlvbihwaXBlbGluZXMsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGNvbGwgPSB0aGlzLnJhd0NvbGxlY3Rpb24oKTtcblxuICAgIGxldCByZXN1bHQgPSBNZXRlb3Iud3JhcEFzeW5jKGNvbGwuYWdncmVnYXRlLCBjb2xsKShwaXBlbGluZXMsIG9wdGlvbnMpO1xuXG4gICAgLy8gV2UgbmVlZCB0byBjaGVjayBJZiBpdCdzIGFuIEFnZ3JlZ2F0aW9uQ3Vyc29yXG4gICAgLy8gVGhlIHJlYXNvbiB3ZSBkbyB0aGlzIHdhcyBiZWNhdXNlIG9mIHRoZSB1cGdyYWRlIHRvIDEuNyB3aGljaCBpbnZvbHZlZCBhIG1vbmdvZGIgZHJpdmVyIHVwZGF0ZVxuICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hd2FpdChyZXN1bHQudG9BcnJheSgpKTtcbiAgICB9XG59O1xuIiwiaW1wb3J0IGRlZXBFeHRlbmQgZnJvbSAnZGVlcC1leHRlbmQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgIHJldHVybiBkZWVwRXh0ZW5kKHt9LCAuLi5hcmdzKTtcbn0iLCJpbXBvcnQgUXVlcnkgZnJvbSAnLi9xdWVyeS9xdWVyeS5qcyc7XG5pbXBvcnQgTmFtZWRRdWVyeSBmcm9tICcuL25hbWVkUXVlcnkvbmFtZWRRdWVyeS5qcyc7XG5pbXBvcnQgTmFtZWRRdWVyeVN0b3JlIGZyb20gJy4vbmFtZWRRdWVyeS9zdG9yZS5qcyc7XG5cbi8qKlxuICogVGhpcyBpcyBhIHBvbHltb3JwaGljIGZ1bmN0aW9uLCBpdCBhbGxvd3MgeW91IHRvIGNyZWF0ZSBhIHF1ZXJ5IGFzIGFuIG9iamVjdFxuICogb3IgaXQgYWxzbyBhbGxvd3MgeW91IHRvIHJlLXVzZSBhbiBleGlzdGluZyBxdWVyeSBpZiBpdCdzIGEgbmFtZWQgb25lXG4gKlxuICogQHBhcmFtIGFyZ3NcbiAqIEByZXR1cm5zIHsqfVxuICovXG5leHBvcnQgZGVmYXVsdCAoLi4uYXJncykgPT4ge1xuICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgbGV0IFtuYW1lLCBib2R5LCBvcHRpb25zXSA9IGFyZ3M7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICAgIC8vIEl0J3MgYSByZXNvbHZlciBxdWVyeVxuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGJvZHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlTmFtZWRRdWVyeShuYW1lLCBudWxsLCBib2R5LCBvcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVudHJ5UG9pbnROYW1lID0gXy5maXJzdChfLmtleXMoYm9keSkpO1xuICAgICAgICBjb25zdCBjb2xsZWN0aW9uID0gTW9uZ28uQ29sbGVjdGlvbi5nZXQoZW50cnlQb2ludE5hbWUpO1xuXG4gICAgICAgIGlmICghY29sbGVjdGlvbikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignaW52YWxpZC1uYW1lJywgYFdlIGNvdWxkIG5vdCBmaW5kIGFueSBjb2xsZWN0aW9uIHdpdGggdGhlIG5hbWUgXCIke2VudHJ5UG9pbnROYW1lfVwiLiBNYWtlIHN1cmUgaXQgaXMgaW1wb3J0ZWQgcHJpb3IgdG8gdXNpbmcgdGhpc2ApXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3JlYXRlTmFtZWRRdWVyeShuYW1lLCBjb2xsZWN0aW9uLCBib2R5W2VudHJ5UG9pbnROYW1lXSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUXVlcnkgQ3JlYXRpb24sIGl0IGNhbiBoYXZlIGFuIGVuZHBvaW50IGFzIGNvbGxlY3Rpb24gb3IgYXMgYSBOYW1lZFF1ZXJ5XG4gICAgICAgIGxldCBbYm9keSwgb3B0aW9uc10gPSBhcmdzO1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICBjb25zdCBlbnRyeVBvaW50TmFtZSA9IF8uZmlyc3QoXy5rZXlzKGJvZHkpKTtcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IE1vbmdvLkNvbGxlY3Rpb24uZ2V0KGVudHJ5UG9pbnROYW1lKTtcblxuICAgICAgICBpZiAoIWNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgIGlmIChNZXRlb3IuaXNEZXZlbG9wbWVudCAmJiAhTmFtZWRRdWVyeVN0b3JlLmdldChlbnRyeVBvaW50TmFtZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFlvdSBhcmUgY3JlYXRpbmcgYSBxdWVyeSB3aXRoIHRoZSBlbnRyeSBwb2ludCBcIiR7ZW50cnlQb2ludE5hbWV9XCIsIGJ1dCB0aGVyZSB3YXMgbm8gY29sbGVjdGlvbiBmb3VuZCBmb3IgaXQgKG1heWJlIHlvdSBmb3Jnb3QgdG8gaW1wb3J0IGl0IGNsaWVudC1zaWRlPykuIEl0J3MgYXNzdW1lZCB0aGF0IGl0J3MgcmVmZXJlbmNpbmcgYSBOYW1lZFF1ZXJ5LmApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVOYW1lZFF1ZXJ5KGVudHJ5UG9pbnROYW1lLCBudWxsLCB7fSwge3BhcmFtczogYm9keVtlbnRyeVBvaW50TmFtZV19KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVOb3JtYWxRdWVyeShjb2xsZWN0aW9uLCBib2R5W2VudHJ5UG9pbnROYW1lXSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU5hbWVkUXVlcnkobmFtZSwgY29sbGVjdGlvbiwgYm9keSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgLy8gaWYgaXQgZXhpc3RzIGFscmVhZHksIHdlIHJlLXVzZSBpdFxuICAgIGNvbnN0IG5hbWVkUXVlcnkgPSBOYW1lZFF1ZXJ5U3RvcmUuZ2V0KG5hbWUpO1xuICAgIGxldCBxdWVyeTtcblxuICAgIGlmICghbmFtZWRRdWVyeSkge1xuICAgICAgICBxdWVyeSA9IG5ldyBOYW1lZFF1ZXJ5KG5hbWUsIGNvbGxlY3Rpb24sIGJvZHksIG9wdGlvbnMpO1xuICAgICAgICBOYW1lZFF1ZXJ5U3RvcmUuYWRkKG5hbWUsIHF1ZXJ5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWVyeSA9IG5hbWVkUXVlcnkuY2xvbmUob3B0aW9ucy5wYXJhbXMpO1xuICAgIH1cblxuICAgIHJldHVybiBxdWVyeTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTm9ybWFsUXVlcnkoY29sbGVjdGlvbiwgYm9keSwgb3B0aW9ucykgIHtcbiAgICByZXR1cm4gbmV3IFF1ZXJ5KGNvbGxlY3Rpb24sIGJvZHksIG9wdGlvbnMpO1xufVxuIiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5cbmNvbnN0IGRiID0gbmV3IFByb3h5KFxuICB7fSxcbiAge1xuICAgIGdldDogZnVuY3Rpb24ob2JqLCBwcm9wKSB7XG4gICAgICBpZiAodHlwZW9mIHByb3AgPT09ICdzeW1ib2wnKSB7XG4gICAgICAgIHJldHVybiBvYmpbcHJvcF07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBNb25nby5Db2xsZWN0aW9uLmdldChwcm9wKTtcblxuICAgICAgaWYgKCFjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBvYmpbcHJvcF07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgIH0sXG4gIH1cbik7XG5cbmV4cG9ydCBkZWZhdWx0IGRiO1xuIiwiaW1wb3J0IFF1ZXJ5IGZyb20gJy4vcXVlcnkvcXVlcnkuanMnO1xuaW1wb3J0IE5hbWVkUXVlcnkgZnJvbSAnLi9uYW1lZFF1ZXJ5L25hbWVkUXVlcnkuanMnO1xuaW1wb3J0IE5hbWVkUXVlcnlTdG9yZSBmcm9tICcuL25hbWVkUXVlcnkvc3RvcmUuanMnO1xuXG5fLmV4dGVuZChNb25nby5Db2xsZWN0aW9uLnByb3RvdHlwZSwge1xuICAgIGNyZWF0ZVF1ZXJ5KC4uLmFyZ3MpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgLy9OYW1lZFF1ZXJ5XG4gICAgICAgICAgICBjb25zdCBbbmFtZSwgYm9keSwgb3B0aW9uc10gPSBhcmdzO1xuICAgICAgICAgICAgY29uc3QgcXVlcnkgPSBuZXcgTmFtZWRRdWVyeShuYW1lLCB0aGlzLCBib2R5LCBvcHRpb25zKTtcbiAgICAgICAgICAgIE5hbWVkUXVlcnlTdG9yZS5hZGQobmFtZSwgcXVlcnkpO1xuXG4gICAgICAgICAgICByZXR1cm4gcXVlcnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBbYm9keSwgb3B0aW9uc10gPSBhcmdzO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFF1ZXJ5KHRoaXMsIGJvZHksIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfSxcbn0pO1xuIiwiaW1wb3J0IGNyZWF0ZUdyYXBoIGZyb20gJy4uL3F1ZXJ5L2xpYi9jcmVhdGVHcmFwaC5qcyc7XG5pbXBvcnQge01hdGNofSBmcm9tICdtZXRlb3IvY2hlY2snO1xuXG5leHBvcnQgY29uc3QgRXhwb3N1cmVEZWZhdWx0cyA9IHtcbiAgICBibG9ja2luZzogZmFsc2UsXG4gICAgbWV0aG9kOiB0cnVlLFxuICAgIHB1YmxpY2F0aW9uOiB0cnVlLFxufTtcblxuZXhwb3J0IGNvbnN0IEV4cG9zdXJlU2NoZW1hID0ge1xuICAgIGZpcmV3YWxsOiBNYXRjaC5NYXliZShcbiAgICAgICAgTWF0Y2guT25lT2YoRnVuY3Rpb24sIFtGdW5jdGlvbl0pXG4gICAgKSxcbiAgICBtYXhMaW1pdDogTWF0Y2guTWF5YmUoTWF0Y2guSW50ZWdlciksXG4gICAgbWF4RGVwdGg6IE1hdGNoLk1heWJlKE1hdGNoLkludGVnZXIpLFxuICAgIHB1YmxpY2F0aW9uOiBNYXRjaC5NYXliZShCb29sZWFuKSxcbiAgICBtZXRob2Q6IE1hdGNoLk1heWJlKEJvb2xlYW4pLFxuICAgIGJsb2NraW5nOiBNYXRjaC5NYXliZShCb29sZWFuKSxcbiAgICBib2R5OiBNYXRjaC5NYXliZShPYmplY3QpLFxuICAgIHJlc3RyaWN0ZWRGaWVsZHM6IE1hdGNoLk1heWJlKFtTdHJpbmddKSxcbiAgICByZXN0cmljdExpbmtzOiBNYXRjaC5NYXliZShcbiAgICAgICAgTWF0Y2guT25lT2YoRnVuY3Rpb24sIFtTdHJpbmddKVxuICAgICksXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVCb2R5KGNvbGxlY3Rpb24sIGJvZHkpIHtcbiAgICB0cnkge1xuICAgICAgICBjcmVhdGVHcmFwaChjb2xsZWN0aW9uLCBib2R5KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtYm9keScsICdXZSBjb3VsZCBub3QgYnVpbGQgYSB2YWxpZCBncmFwaCB3aGVuIHRyeWluZyB0byBjcmVhdGUgeW91ciBleHBvc3VyZTogJyArIGUudG9TdHJpbmcoKSlcbiAgICB9XG59IiwiaW1wb3J0IGdlbkNvdW50RW5kcG9pbnQgZnJvbSAnLi4vcXVlcnkvY291bnRzL2dlbkVuZHBvaW50LnNlcnZlci5qcyc7XG5pbXBvcnQgY3JlYXRlR3JhcGggZnJvbSAnLi4vcXVlcnkvbGliL2NyZWF0ZUdyYXBoLmpzJztcbmltcG9ydCByZWN1cnNpdmVDb21wb3NlIGZyb20gJy4uL3F1ZXJ5L2xpYi9yZWN1cnNpdmVDb21wb3NlLmpzJztcbmltcG9ydCBoeXBlcm5vdmEgZnJvbSAnLi4vcXVlcnkvaHlwZXJub3ZhL2h5cGVybm92YS5qcyc7XG5pbXBvcnQge1xuICAgIEV4cG9zdXJlU2NoZW1hLFxuICAgIEV4cG9zdXJlRGVmYXVsdHMsXG4gICAgdmFsaWRhdGVCb2R5LFxufSBmcm9tICcuL2V4cG9zdXJlLmNvbmZpZy5zY2hlbWEuanMnO1xuaW1wb3J0IGVuZm9yY2VNYXhEZXB0aCBmcm9tICcuL2xpYi9lbmZvcmNlTWF4RGVwdGguanMnO1xuaW1wb3J0IGVuZm9yY2VNYXhMaW1pdCBmcm9tICcuL2xpYi9lbmZvcmNlTWF4TGltaXQuanMnO1xuaW1wb3J0IGNsZWFuQm9keSBmcm9tICcuL2xpYi9jbGVhbkJvZHkuanMnO1xuaW1wb3J0IGRlZXBDbG9uZSBmcm9tICdsb2Rhc2guY2xvbmVkZWVwJztcbmltcG9ydCByZXN0cmljdEZpZWxkc0ZuIGZyb20gJy4vbGliL3Jlc3RyaWN0RmllbGRzLmpzJztcbmltcG9ydCByZXN0cmljdExpbmtzIGZyb20gJy4vbGliL3Jlc3RyaWN0TGlua3MuanMnO1xuaW1wb3J0IHsgY2hlY2sgfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuXG5sZXQgZ2xvYmFsQ29uZmlnID0ge307XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4cG9zdXJlIHtcbiAgICBzdGF0aWMgc2V0Q29uZmlnKGNvbmZpZykge1xuICAgICAgICBPYmplY3QuYXNzaWduKGdsb2JhbENvbmZpZywgY29uZmlnKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0Q29uZmlnKCkge1xuICAgICAgICByZXR1cm4gZ2xvYmFsQ29uZmlnO1xuICAgIH1cblxuICAgIHN0YXRpYyByZXN0cmljdEZpZWxkcyguLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiByZXN0cmljdEZpZWxkc0ZuKC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGNvbGxlY3Rpb24sIGNvbmZpZyA9IHt9KSB7XG4gICAgICAgIGNvbGxlY3Rpb24uX19pc0V4cG9zZWRGb3JHcmFwaGVyID0gdHJ1ZTtcbiAgICAgICAgY29sbGVjdGlvbi5fX2V4cG9zdXJlID0gdGhpcztcblxuICAgICAgICB0aGlzLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uO1xuICAgICAgICB0aGlzLm5hbWUgPSBgZXhwb3N1cmVfJHtjb2xsZWN0aW9uLl9uYW1lfWA7XG5cbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlQW5kQ2xlYW4oKTtcblxuICAgICAgICB0aGlzLmluaXRTZWN1cml0eSgpO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5wdWJsaWNhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5pbml0UHVibGljYXRpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5tZXRob2QpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdE1ldGhvZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5tZXRob2QgJiYgIXRoaXMuY29uZmlnLnB1YmxpY2F0aW9uKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICd3ZWlyZCcsXG4gICAgICAgICAgICAgICAgJ0lmIHlvdSB3YW50IHRvIGV4cG9zZSB5b3VyIGNvbGxlY3Rpb24geW91IG5lZWQgdG8gc3BlY2lmeSBhdCBsZWFzdCBvbmUgb2YgW1wibWV0aG9kXCIsIFwicHVibGljYXRpb25cIl0gb3B0aW9ucyB0byB0cnVlJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5pdENvdW50TWV0aG9kKCk7XG4gICAgICAgIHRoaXMuaW5pdENvdW50UHVibGljYXRpb24oKTtcbiAgICB9XG5cbiAgICBfdmFsaWRhdGVBbmRDbGVhbigpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmNvbmZpZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc3QgZmlyZXdhbGwgPSB0aGlzLmNvbmZpZztcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0geyBmaXJld2FsbCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAge30sXG4gICAgICAgICAgICBFeHBvc3VyZURlZmF1bHRzLFxuICAgICAgICAgICAgRXhwb3N1cmUuZ2V0Q29uZmlnKCksXG4gICAgICAgICAgICB0aGlzLmNvbmZpZ1xuICAgICAgICApO1xuICAgICAgICBjaGVjayh0aGlzLmNvbmZpZywgRXhwb3N1cmVTY2hlbWEpO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5ib2R5KSB7XG4gICAgICAgICAgICB2YWxpZGF0ZUJvZHkodGhpcy5jb2xsZWN0aW9uLCB0aGlzLmNvbmZpZy5ib2R5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRha2VzIHRoZSBib2R5IGFuZCBpbnRlcnNlY3RzIGl0IHdpdGggdGhlIGV4cG9zdXJlIGJvZHksIGlmIGl0IGV4aXN0cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBib2R5XG4gICAgICogQHBhcmFtIHVzZXJJZFxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGdldFRyYW5zZm9ybWVkQm9keShib2R5LCB1c2VySWQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5ib2R5KSB7XG4gICAgICAgICAgICByZXR1cm4gYm9keTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb2Nlc3NlZEJvZHkgPSB0aGlzLmdldEJvZHkodXNlcklkKTtcblxuICAgICAgICBpZiAocHJvY2Vzc2VkQm9keSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNsZWFuQm9keShwcm9jZXNzZWRCb2R5LCBib2R5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBleHBvc3VyZSBib2R5XG4gICAgICovXG4gICAgZ2V0Qm9keSh1c2VySWQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5ib2R5KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICdtaXNzaW5nLWJvZHknLFxuICAgICAgICAgICAgICAgICdDYW5ub3QgZ2V0IGV4cG9zdXJlIGJvZHkgYmVjYXVzZSBpdCB3YXMgbm90IGRlZmluZWQuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBib2R5O1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHRoaXMuY29uZmlnLmJvZHkpKSB7XG4gICAgICAgICAgICBib2R5ID0gdGhpcy5jb25maWcuYm9keS5jYWxsKHRoaXMsIHVzZXJJZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBib2R5ID0gdGhpcy5jb25maWcuYm9keTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGl0IG1lYW5zIHdlIGFsbG93IGV2ZXJ5dGhpbmcsIG5vIG5lZWQgZm9yIGNsb25pbmcuXG4gICAgICAgIGlmIChib2R5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWVwQ2xvbmUoYm9keSwgdXNlcklkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXppbmcgdGhlIHB1YmxpY2F0aW9uIGZvciByZWFjdGl2ZSBxdWVyeSBmZXRjaGluZ1xuICAgICAqL1xuICAgIGluaXRQdWJsaWNhdGlvbigpIHtcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbjtcbiAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5jb25maWc7XG4gICAgICAgIGNvbnN0IGdldFRyYW5zZm9ybWVkQm9keSA9IHRoaXMuZ2V0VHJhbnNmb3JtZWRCb2R5LmJpbmQodGhpcyk7XG5cbiAgICAgICAgTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUodGhpcy5uYW1lLCBmdW5jdGlvbihib2R5KSB7XG4gICAgICAgICAgICBsZXQgdHJhbnNmb3JtZWRCb2R5ID0gZ2V0VHJhbnNmb3JtZWRCb2R5KGJvZHkpO1xuXG4gICAgICAgICAgICBjb25zdCByb290Tm9kZSA9IGNyZWF0ZUdyYXBoKGNvbGxlY3Rpb24sIHRyYW5zZm9ybWVkQm9keSk7XG5cbiAgICAgICAgICAgIGVuZm9yY2VNYXhEZXB0aChyb290Tm9kZSwgY29uZmlnLm1heERlcHRoKTtcbiAgICAgICAgICAgIHJlc3RyaWN0TGlua3Mocm9vdE5vZGUsIHRoaXMudXNlcklkKTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlY3Vyc2l2ZUNvbXBvc2Uocm9vdE5vZGUsIHRoaXMudXNlcklkLCB7XG4gICAgICAgICAgICAgICAgYnlwYXNzRmlyZXdhbGxzOiAhIWNvbmZpZy5ib2R5LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemV6IHRoZSBtZXRob2QgdG8gcmV0cmlldmUgdGhlIGRhdGEgdmlhIE1ldGVvci5jYWxsXG4gICAgICovXG4gICAgaW5pdE1ldGhvZCgpIHtcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbjtcbiAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5jb25maWc7XG4gICAgICAgIGNvbnN0IGdldFRyYW5zZm9ybWVkQm9keSA9IHRoaXMuZ2V0VHJhbnNmb3JtZWRCb2R5LmJpbmQodGhpcyk7XG5cbiAgICAgICAgY29uc3QgbWV0aG9kQm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICAgICAgICAgIGlmICghY29uZmlnLmJsb2NraW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51bmJsb2NrKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB0cmFuc2Zvcm1lZEJvZHkgPSBnZXRUcmFuc2Zvcm1lZEJvZHkoYm9keSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJvb3ROb2RlID0gY3JlYXRlR3JhcGgoY29sbGVjdGlvbiwgdHJhbnNmb3JtZWRCb2R5KTtcblxuICAgICAgICAgICAgZW5mb3JjZU1heERlcHRoKHJvb3ROb2RlLCBjb25maWcubWF4RGVwdGgpO1xuICAgICAgICAgICAgcmVzdHJpY3RMaW5rcyhyb290Tm9kZSwgdGhpcy51c2VySWQpO1xuXG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyBleHBvc3VyZSBib2R5IGRlZmluZWQsIHRoZW4gd2UgbmVlZCB0byBhcHBseSBmaXJld2FsbHNcbiAgICAgICAgICAgIHJldHVybiBoeXBlcm5vdmEocm9vdE5vZGUsIHRoaXMudXNlcklkLCB7XG4gICAgICAgICAgICAgICAgYnlwYXNzRmlyZXdhbGxzOiAhIWNvbmZpZy5ib2R5LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgICAgICAgICAgW3RoaXMubmFtZV06IG1ldGhvZEJvZHksXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBtZXRob2QgdG8gcmV0cmlldmUgdGhlIGNvdW50IG9mIHRoZSBkYXRhIHZpYSBNZXRlb3IuY2FsbFxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGluaXRDb3VudE1ldGhvZCgpIHtcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbjtcblxuICAgICAgICBNZXRlb3IubWV0aG9kcyh7XG4gICAgICAgICAgICBbdGhpcy5uYW1lICsgJy5jb3VudCddKGJvZHkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVuYmxvY2soKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKGJvZHkuJGZpbHRlcnMgfHwge30sIHt9LCB0aGlzLnVzZXJJZClcbiAgICAgICAgICAgICAgICAgICAgLmNvdW50KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgcmVhY3RpdmUgZW5kcG9pbnQgdG8gcmV0cmlldmUgdGhlIGNvdW50IG9mIHRoZSBkYXRhLlxuICAgICAqL1xuICAgIGluaXRDb3VudFB1YmxpY2F0aW9uKCkge1xuICAgICAgICBjb25zdCBjb2xsZWN0aW9uID0gdGhpcy5jb2xsZWN0aW9uO1xuXG4gICAgICAgIGdlbkNvdW50RW5kcG9pbnQodGhpcy5uYW1lLCB7XG4gICAgICAgICAgICBnZXRDdXJzb3IoeyBzZXNzaW9uIH0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5maW5kKFxuICAgICAgICAgICAgICAgICAgICBzZXNzaW9uLmZpbHRlcnMsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkczogeyBfaWQ6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51c2VySWRcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0U2Vzc2lvbihib2R5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZmlsdGVyczogYm9keS4kZmlsdGVycyB8fCB7fSB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgc2VjdXJpdHkgZW5mb3JjZW1lbnRcbiAgICAgKiBUSElOSzogTWF5YmUgaW5zdGVhZCBvZiBvdmVycmlkaW5nIC5maW5kLCBJIGNvdWxkIHN0b3JlIHRoaXMgZGF0YSBvZiBzZWN1cml0eSBpbnNpZGUgdGhlIGNvbGxlY3Rpb24gb2JqZWN0LlxuICAgICAqL1xuICAgIGluaXRTZWN1cml0eSgpIHtcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbjtcbiAgICAgICAgY29uc3QgeyBmaXJld2FsbCwgbWF4TGltaXQsIHJlc3RyaWN0ZWRGaWVsZHMgfSA9IHRoaXMuY29uZmlnO1xuICAgICAgICBjb25zdCBmaW5kID0gY29sbGVjdGlvbi5maW5kLmJpbmQoY29sbGVjdGlvbik7XG4gICAgICAgIGNvbnN0IGZpbmRPbmUgPSBjb2xsZWN0aW9uLmZpbmRPbmUuYmluZChjb2xsZWN0aW9uKTtcblxuICAgICAgICBjb2xsZWN0aW9uLmZpcmV3YWxsID0gKGZpbHRlcnMsIG9wdGlvbnMsIHVzZXJJZCkgPT4ge1xuICAgICAgICAgICAgaWYgKHVzZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbEZpcmV3YWxsKFxuICAgICAgICAgICAgICAgICAgICB7IGNvbGxlY3Rpb246IGNvbGxlY3Rpb24gfSxcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVycyxcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGVuZm9yY2VNYXhMaW1pdChvcHRpb25zLCBtYXhMaW1pdCk7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzdHJpY3RlZEZpZWxkcykge1xuICAgICAgICAgICAgICAgICAgICBFeHBvc3VyZS5yZXN0cmljdEZpZWxkcyhmaWx0ZXJzLCBvcHRpb25zLCByZXN0cmljdGVkRmllbGRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29sbGVjdGlvbi5maW5kID0gZnVuY3Rpb24oZmlsdGVycywgb3B0aW9ucyA9IHt9LCB1c2VySWQgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJzID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIGZpbHRlcnMgaXMgdW5kZWZpbmVkIGl0IHNob3VsZCByZXR1cm4gYW4gZW1wdHkgaXRlbVxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGZpbHRlcnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmaW5kKHVuZGVmaW5lZCwgb3B0aW9ucyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbGxlY3Rpb24uZmlyZXdhbGwoZmlsdGVycywgb3B0aW9ucywgdXNlcklkKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbmQoZmlsdGVycywgb3B0aW9ucyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29sbGVjdGlvbi5maW5kT25lID0gZnVuY3Rpb24oXG4gICAgICAgICAgICBmaWx0ZXJzLFxuICAgICAgICAgICAgb3B0aW9ucyA9IHt9LFxuICAgICAgICAgICAgdXNlcklkID0gdW5kZWZpbmVkXG4gICAgICAgICkge1xuICAgICAgICAgICAgLy8gSWYgZmlsdGVycyBpcyB1bmRlZmluZWQgaXQgc2hvdWxkIHJldHVybiBhbiBlbXB0eSBpdGVtXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgZmlsdGVycyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgZmlsdGVycyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJzID0geyBfaWQ6IGZpbHRlcnMgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29sbGVjdGlvbi5maXJld2FsbChmaWx0ZXJzLCBvcHRpb25zLCB1c2VySWQpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmluZE9uZShmaWx0ZXJzLCBvcHRpb25zKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9jYWxsRmlyZXdhbGwoLi4uYXJncykge1xuICAgICAgICBjb25zdCB7IGZpcmV3YWxsIH0gPSB0aGlzLmNvbmZpZztcbiAgICAgICAgaWYgKCFmaXJld2FsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8uaXNBcnJheShmaXJld2FsbCkpIHtcbiAgICAgICAgICAgIGZpcmV3YWxsLmZvckVhY2goZmlyZSA9PiB7XG4gICAgICAgICAgICAgICAgZmlyZS5jYWxsKC4uLmFyZ3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaXJld2FsbC5jYWxsKC4uLmFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IEV4cG9zdXJlIGZyb20gJy4vZXhwb3N1cmUuanMnO1xuXG5PYmplY3QuYXNzaWduKE1vbmdvLkNvbGxlY3Rpb24ucHJvdG90eXBlLCB7XG4gICAgZXhwb3NlKGNvbmZpZykge1xuICAgICAgICBpZiAoIU1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAgICAgICAnbm90LWFsbG93ZWQnLFxuICAgICAgICAgICAgICAgIGBZb3UgY2FuIG9ubHkgZXhwb3NlIGEgY29sbGVjdGlvbiBzZXJ2ZXIgc2lkZS4gJHt0aGlzLl9uYW1lfWBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBuZXcgRXhwb3N1cmUodGhpcywgY29uZmlnKTtcbiAgICB9LFxufSk7XG4iLCJpbXBvcnQgZGVlcENsb25lIGZyb20gJ2xvZGFzaC5jbG9uZWRlZXAnO1xuaW1wb3J0IHtjbGVhbkZpbHRlcnMsIGNsZWFuT3B0aW9uc30gZnJvbSAnLi9jbGVhblNlbGVjdG9ycyc7XG5pbXBvcnQgZG90aXplIGZyb20gJy4uLy4uL3F1ZXJ5L2xpYi9kb3RpemUnO1xuXG4vKipcbiAqIERlZXAgSW50ZXIgQ29tcHV0YXRpb25cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2xlYW5Cb2R5KG1haW4sIHNlY29uZCwgLi4uYXJncykge1xuICAgIGxldCBvYmplY3QgPSB7fTtcblxuICAgIGlmIChzZWNvbmQuJGZpbHRlcnMgfHwgc2Vjb25kLiRvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkcyA9IGdldEZpZWxkcyhtYWluKTtcblxuICAgICAgICBjbGVhbkZpbHRlcnMoc2Vjb25kLiRmaWx0ZXJzLCBmaWVsZHMpO1xuICAgICAgICBjbGVhbk9wdGlvbnMoc2Vjb25kLiRvcHRpb25zLCBmaWVsZHMpO1xuICAgIH1cblxuICAgIF8uZWFjaChzZWNvbmQsIChzZWNvbmRWYWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIGlmIChrZXkgPT09ICckZmlsdGVycycgfHwga2V5ID09PSAnJG9wdGlvbnMnKSB7XG4gICAgICAgICAgICBvYmplY3Rba2V5XSA9IHNlY29uZFZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHZhbHVlID0gbWFpbltrZXldO1xuXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGUgbWFpbiB2YWx1ZSBpcyBhIGZ1bmN0aW9uLCB3ZSBydW4gaXQuXG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLmNhbGwobnVsbCwgLi4uYXJncyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGUgbWFpbiB2YWx1ZSBpcyB1bmRlZmluZWQgb3IgZmFsc2UsIHdlIHNraXAgdGhlIG1lcmdlXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2UgdHJlYXQgdGhpcyBzcGVjaWFsbHksIGlmIHRoZSB2YWx1ZSBpcyB0cnVlXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgb2JqZWN0W2tleV0gPSBfLmlzT2JqZWN0KHNlY29uZFZhbHVlKSA/IGRlZXBDbG9uZShzZWNvbmRWYWx1ZSkgOiB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoZSBtYWluIHZhbHVlIGlzIGFuIG9iamVjdFxuICAgICAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGlmIChfLmlzT2JqZWN0KHNlY29uZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBzZWNvbmQgb25lIGlzIGFuIG9iamVjdCBhcyB3ZWxsIHdlIHJ1biByZWN1cnNpdmVseSBydW4gdGhlIGludGVyc2VjdGlvblxuICAgICAgICAgICAgICAgIG9iamVjdFtrZXldID0gY2xlYW5Cb2R5KHZhbHVlLCBzZWNvbmRWYWx1ZSwgLi4uYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiBpdCBpcyBub3QsIHRoZW4gd2Ugd2lsbCBpZ25vcmUgaXQsIGJlY2F1c2UgaXQgd29uJ3QgbWFrZSBzZW5zZS5cbiAgICAgICAgICAgIC8vIHRvIG1lcmdlIHthOiAxfSB3aXRoIDEuXG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoZSBtYWluIHZhbHVlIGlzIG5vdCBhbiBvYmplY3QsIGl0IHNob3VsZCBiZSBhIHRydXRoeSB2YWx1ZSBsaWtlIDFcbiAgICAgICAgaWYgKF8uaXNPYmplY3Qoc2Vjb25kVmFsdWUpKSB7XG4gICAgICAgICAgICAvLyBpZiB0aGUgc2Vjb25kIHZhbHVlIGlzIGFuIG9iamVjdCwgdGhlbiB3ZSB3aWxsIGtlZXAgaXQuXG4gICAgICAgICAgICAvLyB0aGlzIHdvbid0IGNhdXNlIHByb2JsZW0gd2l0aCBkZWVwIG5lc3RpbmcgYmVjYXVzZVxuICAgICAgICAgICAgLy8gd2hlbiB5b3Ugc3BlY2lmeSBsaW5rcyB5b3Ugd2lsbCBoYXZlIHRoZSBtYWluIHZhbHVlIGFzIGFuIG9iamVjdCwgb3RoZXJ3aXNlIGl0IHdpbGwgZmFpbFxuICAgICAgICAgICAgLy8gdGhpcyBpcyB1c2VkIGZvciB0aGluZ3MgbGlrZSB3aGVuIHlvdSBoYXZlIGEgaGFzaCBvYmplY3QgbGlrZSBwcm9maWxlIHdpdGggbXVsdGlwbGUgbmVzdGluZyBmaWVsZHMsIHlvdSBjYW4gYWxsb3cgdGhlIGNsaWVudCB0byBzcGVjaWZ5IG9ubHkgd2hhdCBoZSBuZWVkc1xuXG4gICAgICAgICAgICBvYmplY3Rba2V5XSA9IGRlZXBDbG9uZShzZWNvbmRWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBpZiB0aGUgc2Vjb25kIHZhbHVlIGlzIG5vdCBhbiBvYmplY3QsIHdlIGp1c3Qgc3RvcmUgdGhlIGZpcnN0IHZhbHVlXG4gICAgICAgICAgICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb2JqZWN0O1xufVxuXG5mdW5jdGlvbiBnZXRGaWVsZHMoYm9keSkge1xuICAgIHJldHVybiBfLmtleXMoZG90aXplLmNvbnZlcnQoYm9keSkpO1xufSIsImV4cG9ydCBmdW5jdGlvbiBjbGVhbk9wdGlvbnMob3B0aW9ucywgZW5zdXJlRmllbGRzKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5maWVsZHMpIHtcbiAgICAgICAgb3B0aW9ucy5maWVsZHMgPSBfLnBpY2sob3B0aW9ucy5maWVsZHMsIC4uLmVuc3VyZUZpZWxkcyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuc29ydCkge1xuICAgICAgICBvcHRpb25zLnNvcnQgPSBfLnBpY2sob3B0aW9ucy5zb3J0LCAuLi5lbnN1cmVGaWVsZHMpO1xuICAgIH1cbn1cblxuY29uc3QgZGVlcEZpbHRlckZpZWxkc0FycmF5ID0gWyckYW5kJywgJyRvcicsICckbm9yJ107XG5jb25zdCBkZWVwRmlsdGVyRmllbGRzT2JqZWN0ID0gWyckbm90J107XG5jb25zdCBzcGVjaWFsID0gWy4uLmRlZXBGaWx0ZXJGaWVsZHNBcnJheSwgLi4uZGVlcEZpbHRlckZpZWxkc09iamVjdF07XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhbkZpbHRlcnMoZmlsdGVycywgZW5zdXJlRmllbGRzKSB7XG4gICAgaWYgKCFmaWx0ZXJzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBfLmVhY2goZmlsdGVycywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKCFfLmNvbnRhaW5zKHNwZWNpYWwsIGtleSkpIHtcbiAgICAgICAgICAgIGlmICghZmllbGRFeGlzdHMoZW5zdXJlRmllbGRzLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGZpbHRlcnNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZGVlcEZpbHRlckZpZWxkc0FycmF5LmZvckVhY2goZmllbGQgPT4ge1xuICAgICAgICBpZiAoZmlsdGVyc1tmaWVsZF0pIHtcbiAgICAgICAgICAgIGZpbHRlcnNbZmllbGRdLmZvckVhY2goZWxlbWVudCA9PiBjbGVhbkZpbHRlcnMoZWxlbWVudCwgZW5zdXJlRmllbGRzKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGRlZXBGaWx0ZXJGaWVsZHNPYmplY3QuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICAgIGlmIChmaWx0ZXJzW2ZpZWxkXSkge1xuICAgICAgICAgICAgY2xlYW5GaWx0ZXJzKGZpbHRlcnNbZmllbGRdLCBlbnN1cmVGaWVsZHMpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKlxuICogVGhpcyB3aWxsIGNoZWNrIGlmIGEgZmllbGQgZXhpc3RzIGluIGEgc2V0IG9mIGZpZWxkc1xuICogSWYgZmllbGRzIGNvbnRhaW5zIFtcInByb2ZpbGVcIl0sIHRoZW4gXCJwcm9maWxlLnNvbWV0aGluZ1wiIHdpbGwgcmV0dXJuIHRydWVcbiAqXG4gKiBAcGFyYW0gZmllbGRzXG4gKiBAcGFyYW0ga2V5XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpZWxkRXhpc3RzKGZpZWxkcywga2V5KSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGZpZWxkc1tpXSA9PT0ga2V5IHx8IGtleS5pbmRleE9mKGZpZWxkc1tpXSArICcuJykgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG5vZGUsIG1heERlcHRoKSB7XG4gICAgaWYgKG1heERlcHRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgY29uc3QgZGVwdGggPSBnZXREZXB0aChub2RlKTtcblxuICAgIGlmIChkZXB0aCA+IG1heERlcHRoKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ3Rvby1kZWVwJywgJ1lvdXIgZ3JhcGggcmVxdWVzdCBpcyB0b28gZGVlcCBhbmQgaXQgaXMgbm90IGFsbG93ZWQuJylcbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlcHRoKG5vZGUpIHtcbiAgICBpZiAobm9kZS5jb2xsZWN0aW9uTm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIHJldHVybiAxICsgXy5tYXgoXG4gICAgICAgIF8ubWFwKG5vZGUuY29sbGVjdGlvbk5vZGVzLCBnZXREZXB0aClcbiAgICApO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChvcHRpb25zLCBtYXhMaW1pdCkge1xuICAgIGlmIChtYXhMaW1pdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5saW1pdCkge1xuICAgICAgICBpZiAob3B0aW9ucy5saW1pdCA+IG1heExpbWl0KSB7XG4gICAgICAgICAgICBvcHRpb25zLmxpbWl0ID0gbWF4TGltaXQ7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25zLmxpbWl0ID0gbWF4TGltaXQ7XG4gICAgfVxufSIsImNvbnN0IGRlZXBGaWx0ZXJGaWVsZHNBcnJheSA9IFsnJGFuZCcsICckb3InLCAnJG5vciddO1xuY29uc3QgZGVlcEZpbHRlckZpZWxkc09iamVjdCA9IFsnJG5vdCddO1xuXG4vKipcbiAqIFRoaXMgaXMgdXNlZCB0byByZXN0cmljdCBzb21lIGZpZWxkcyB0byBzb21lIHVzZXJzLCBieSBwYXNzaW5nIHRoZSBmaWVsZHMgYXMgYXJyYXkgaW4gdGhlIGV4cG9zdXJlIG9iamVjdFxuICogRm9yIGV4YW1wbGUgaW4gYW4gdXNlciBleHBvc3VyZTogcmVzdHJpY3RGaWVsZHMob3B0aW9ucywgWydzZXJ2aWNlcycsICdjcmVhdGVkQXQnXSlcbiAqXG4gKiBAcGFyYW0gZmlsdGVycyBPYmplY3RcbiAqIEBwYXJhbSBvcHRpb25zIE9iamVjdFxuICogQHBhcmFtIHJlc3RyaWN0ZWRGaWVsZHMgQXJyYXlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVzdHJpY3RGaWVsZHMoZmlsdGVycywgb3B0aW9ucywgcmVzdHJpY3RlZEZpZWxkcykge1xuICAgIGlmICghXy5pc0FycmF5KHJlc3RyaWN0ZWRGaWVsZHMpKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtcGFyYW1ldGVycycsICdQbGVhc2Ugc3BlY2lmeSBhbiBhcnJheSBvZiByZXN0cmljdGVkIGZpZWxkcy4nKTtcbiAgICB9XG5cbiAgICBjbGVhbkZpbHRlcnMoZmlsdGVycywgcmVzdHJpY3RlZEZpZWxkcyk7XG4gICAgY2xlYW5PcHRpb25zKG9wdGlvbnMsIHJlc3RyaWN0ZWRGaWVsZHMpXG59XG5cbi8qKlxuICogRGVlcCBjbGVhbnMgZmlsdGVyc1xuICpcbiAqIEBwYXJhbSBmaWx0ZXJzXG4gKiBAcGFyYW0gcmVzdHJpY3RlZEZpZWxkc1xuICovXG5mdW5jdGlvbiBjbGVhbkZpbHRlcnMoZmlsdGVycywgcmVzdHJpY3RlZEZpZWxkcykge1xuICAgIGlmIChmaWx0ZXJzKSB7XG4gICAgICAgIGNsZWFuT2JqZWN0KGZpbHRlcnMsIHJlc3RyaWN0ZWRGaWVsZHMpO1xuICAgIH1cblxuICAgIGRlZXBGaWx0ZXJGaWVsZHNBcnJheS5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgaWYgKGZpbHRlcnNbZmllbGRdKSB7XG4gICAgICAgICAgICBmaWx0ZXJzW2ZpZWxkXS5mb3JFYWNoKGVsZW1lbnQgPT4gY2xlYW5GaWx0ZXJzKGVsZW1lbnQsIHJlc3RyaWN0ZWRGaWVsZHMpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZGVlcEZpbHRlckZpZWxkc09iamVjdC5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgaWYgKGZpbHRlcnNbZmllbGRdKSB7XG4gICAgICAgICAgICBjbGVhbkZpbHRlcnMoZmlsdGVyc1tmaWVsZF0sIHJlc3RyaWN0ZWRGaWVsZHMpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKlxuICogRGVlcGx5IGNsZWFucyBvcHRpb25zXG4gKlxuICogQHBhcmFtIG9wdGlvbnNcbiAqIEBwYXJhbSByZXN0cmljdGVkRmllbGRzXG4gKi9cbmZ1bmN0aW9uIGNsZWFuT3B0aW9ucyhvcHRpb25zLCByZXN0cmljdGVkRmllbGRzKSB7XG4gICAgaWYgKG9wdGlvbnMuZmllbGRzKSB7XG4gICAgICAgIGNsZWFuT2JqZWN0KG9wdGlvbnMuZmllbGRzLCByZXN0cmljdGVkRmllbGRzKTtcblxuICAgICAgICBpZiAoXy5rZXlzKG9wdGlvbnMuZmllbGRzKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKG9wdGlvbnMuZmllbGRzLCB7X2lkOiAxfSlcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbnMuZmllbGRzID0ge19pZDogMX07XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuc29ydCkge1xuICAgICAgICBjbGVhbk9iamVjdChvcHRpb25zLnNvcnQsIHJlc3RyaWN0ZWRGaWVsZHMpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBDbGVhbnMgdGhlIG9iamVjdCAobm90IGRlZXBseSlcbiAqXG4gKiBAcGFyYW0gb2JqZWN0XG4gKiBAcGFyYW0gcmVzdHJpY3RlZEZpZWxkc1xuICovXG5mdW5jdGlvbiBjbGVhbk9iamVjdChvYmplY3QsIHJlc3RyaWN0ZWRGaWVsZHMpIHtcbiAgICBfLmVhY2gob2JqZWN0LCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICByZXN0cmljdGVkRmllbGRzLmZvckVhY2goKHJlc3RyaWN0ZWRGaWVsZCkgPT4ge1xuICAgICAgICAgICAgaWYgKG1hdGNoaW5nKHJlc3RyaWN0ZWRGaWVsZCwga2V5KSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmplY3Rba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgZmllbGQgPT0gc3ViZmllbGQgb3IgaWYgYCR7ZmllbGR9LmAgSU5DTFVERUQgaW4gc3ViZmllbGRcbiAqIEV4YW1wbGU6IFwicHJvZmlsZVwiIGFuZCBcInByb2ZpbGUuZmlyc3ROYW1lXCIgd2lsbCBiZSBhIG1hdGNoaW5nIGZpZWxkXG4gKiBAcGFyYW0gZmllbGRcbiAqIEBwYXJhbSBzdWJmaWVsZFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIG1hdGNoaW5nKGZpZWxkLCBzdWJmaWVsZCkge1xuICAgIGlmIChmaWVsZCA9PT0gc3ViZmllbGQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1YmZpZWxkLnNsaWNlKDAsIGZpZWxkLmxlbmd0aCArIDEpID09PSBmaWVsZCArICcuJztcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZXN0cmljdExpbmtzKHBhcmVudE5vZGUsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCByZXN0cmljdGVkTGlua3MgPSBnZXRMaW5rcyhwYXJlbnROb2RlLCAuLi5hcmdzKTtcblxuICAgIGlmICghcmVzdHJpY3RlZExpbmtzIHx8IHJlc3RyaWN0ZWRMaW5rcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIF8uZWFjaChwYXJlbnROb2RlLmNvbGxlY3Rpb25Ob2RlcywgY29sbGVjdGlvbk5vZGUgPT4ge1xuICAgICAgICBpZiAoXy5jb250YWlucyhyZXN0cmljdGVkTGlua3MsIGNvbGxlY3Rpb25Ob2RlLmxpbmtOYW1lKSkge1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5yZW1vdmUoY29sbGVjdGlvbk5vZGUpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMaW5rcyhub2RlLCAuLi5hcmdzKSB7XG4gICAgaWYgKG5vZGUuY29sbGVjdGlvbiAmJiBub2RlLmNvbGxlY3Rpb24uX19leHBvc3VyZSkge1xuICAgICAgICBjb25zdCBleHBvc3VyZSA9IG5vZGUuY29sbGVjdGlvbi5fX2V4cG9zdXJlO1xuXG4gICAgICAgIGlmIChleHBvc3VyZS5jb25maWcucmVzdHJpY3RMaW5rcykge1xuICAgICAgICAgICAgY29uc3QgY29uZmlnUmVzdHJpY3RMaW5rcyA9IGV4cG9zdXJlLmNvbmZpZy5yZXN0cmljdExpbmtzO1xuXG4gICAgICAgICAgICBpZiAoXy5pc0FycmF5KGNvbmZpZ1Jlc3RyaWN0TGlua3MpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ1Jlc3RyaWN0TGlua3M7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjb25maWdSZXN0cmljdExpbmtzKC4uLmFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCBhc3RUb1F1ZXJ5IGZyb20gJy4vbGliL2FzdFRvUXVlcnknO1xuXG5leHBvcnQgeyBzZXRBc3RUb1F1ZXJ5RGVmYXVsdHMgfSBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGFzdFRvQm9keSB9IGZyb20gJy4vbGliL2FzdFRvQm9keSc7XG5cbk9iamVjdC5hc3NpZ24oTW9uZ28uQ29sbGVjdGlvbi5wcm90b3R5cGUsIHtcbiAgYXN0VG9RdWVyeSxcbn0pO1xuXG5leHBvcnQgeyBhc3RUb1F1ZXJ5IH07XG4iLCJleHBvcnQgY29uc3QgU3ltYm9scyA9IHtcbiAgQVJHVU1FTlRTOiBTeW1ib2woJ2FyZ3VtZW50cycpLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXN0VG9Cb2R5KGFzdCkge1xuICBjb25zdCBmaWVsZE5vZGVzID0gYXN0LmZpZWxkTm9kZXM7XG5cbiAgY29uc3QgYm9keSA9IGV4dHJhY3RTZWxlY3Rpb25TZXQoYXN0LmZpZWxkTm9kZXNbMF0uc2VsZWN0aW9uU2V0KTtcblxuICByZXR1cm4gYm9keTtcbn1cblxuZnVuY3Rpb24gZXh0cmFjdFNlbGVjdGlvblNldChzZXQpIHtcbiAgbGV0IGJvZHkgPSB7fTtcbiAgc2V0LnNlbGVjdGlvbnMuZm9yRWFjaChlbCA9PiB7XG4gICAgaWYgKCFlbC5zZWxlY3Rpb25TZXQpIHtcbiAgICAgIGJvZHlbZWwubmFtZS52YWx1ZV0gPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBib2R5W2VsLm5hbWUudmFsdWVdID0gZXh0cmFjdFNlbGVjdGlvblNldChlbC5zZWxlY3Rpb25TZXQpO1xuICAgICAgaWYgKGVsLmFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgbGV0IGFyZ3VtZW50TWFwID0ge307XG4gICAgICAgIGVsLmFyZ3VtZW50cy5mb3JFYWNoKGFyZyA9PiB7XG4gICAgICAgICAgYXJndW1lbnRNYXBbYXJnLm5hbWUudmFsdWVdID0gYXJnLnZhbHVlLnZhbHVlO1xuICAgICAgICB9KTtcblxuICAgICAgICBib2R5W2VsLm5hbWUudmFsdWVdW1N5bWJvbHMuQVJHVU1FTlRTXSA9IGFyZ3VtZW50TWFwO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGJvZHk7XG59XG4iLCJpbXBvcnQgeyBjaGVjaywgTWF0Y2ggfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuaW1wb3J0IGFzdFRvQm9keSwgeyBTeW1ib2xzIH0gZnJvbSAnLi9hc3RUb0JvZHknO1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vZGVmYXVsdHMnO1xuaW1wb3J0IGludGVyc2VjdERlZXAgZnJvbSAnLi4vLi4vcXVlcnkvbGliL2ludGVyc2VjdERlZXAnO1xuaW1wb3J0IGVuZm9yY2VNYXhMaW1pdCBmcm9tICcuLi8uLi9leHBvc3VyZS9saWIvZW5mb3JjZU1heExpbWl0JztcblxuY29uc3QgRXJyb3JzID0ge1xuICBNQVhfREVQVEg6ICdUaGUgbWF4aW11bSBkZXB0aCBvZiB0aGlzIHJlcXVlc3QgZXhjZWVkcyB0aGUgZGVwdGggYWxsb3dlZC4nLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXN0VG9RdWVyeShhc3QsIGNvbmZpZyA9IHt9KSB7XG4gIGNvbnN0IGNvbGxlY3Rpb24gPSB0aGlzO1xuXG4gIGNoZWNrKGNvbmZpZywge1xuICAgIGVtYm9keTogTWF0Y2guTWF5YmUoRnVuY3Rpb24pLFxuICAgICRmaWx0ZXJzOiBNYXRjaC5NYXliZShPYmplY3QpLFxuICAgICRvcHRpb25zOiBNYXRjaC5NYXliZShPYmplY3QpLFxuICAgIG1heERlcHRoOiBNYXRjaC5NYXliZShOdW1iZXIpLFxuICAgIG1heExpbWl0OiBNYXRjaC5NYXliZShOdW1iZXIpLFxuICAgIGRlbnk6IE1hdGNoLk1heWJlKFtTdHJpbmddKSxcbiAgICBpbnRlcnNlY3Q6IE1hdGNoLk1heWJlKE9iamVjdCksXG4gIH0pO1xuXG4gIGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oXG4gICAge1xuICAgICAgJG9wdGlvbnM6IHt9LFxuICAgICAgJGZpbHRlcnM6IHt9LFxuICAgIH0sXG4gICAgZGVmYXVsdHMsXG4gICAgY29uZmlnXG4gICk7XG5cbiAgLy8gZ2V0IHRoZSBib2R5XG4gIGxldCBib2R5ID0gYXN0VG9Cb2R5KGFzdCk7XG5cbiAgLy8gZmlyc3Qgd2UgZG8gdGhlIGludGVyc2VjdGlvblxuICBpZiAoY29uZmlnLmludGVyc2VjdCkge1xuICAgIGJvZHkgPSBpbnRlcnNlY3REZWVwKGNvbmZpZy5pbnRlcnNlY3QsIGJvZHkpO1xuICB9XG5cbiAgLy8gZW5mb3JjZSB0aGUgbWF4aW11bSBhbW91bnQgb2YgZGF0YSB3ZSBhbGxvdyB0byByZXRyaWV2ZVxuICBpZiAoY29uZmlnLm1heExpbWl0KSB7XG4gICAgZW5mb3JjZU1heExpbWl0KGNvbmZpZy4kb3B0aW9ucywgY29uZmlnLm1heExpbWl0KTtcbiAgfVxuXG4gIC8vIGZpZ3VyZSBvdXQgZGVwdGggYmFzZWRcbiAgaWYgKGNvbmZpZy5tYXhEZXB0aCkge1xuICAgIGNvbnN0IGN1cnJlbnRNYXhEZXB0aCA9IGdldE1heERlcHRoKGJvZHkpO1xuICAgIGlmIChjdXJyZW50TWF4RGVwdGggPiBjb25maWcubWF4RGVwdGgpIHtcbiAgICAgIHRocm93IEVycm9ycy5NQVhfREVQVEg7XG4gICAgfVxuICB9XG5cbiAgaWYgKGNvbmZpZy5kZW55KSB7XG4gICAgZGVueShib2R5LCBjb25maWcuZGVueSk7XG4gIH1cblxuICBPYmplY3QuYXNzaWduKGJvZHksIHtcbiAgICAkZmlsdGVyczogY29uZmlnLiRmaWx0ZXJzLFxuICAgICRvcHRpb25zOiBjb25maWcuJG9wdGlvbnMsXG4gIH0pO1xuXG4gIGlmIChjb25maWcuZW1ib2R5KSB7XG4gICAgY29uc3QgZ2V0QXJncyA9IGNyZWF0ZUdldEFyZ3MoYm9keSk7XG4gICAgY29uZmlnLmVtYm9keS5jYWxsKG51bGwsIHtcbiAgICAgIGJvZHksXG4gICAgICBnZXRBcmdzLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gd2UgcmV0dXJuIHRoZSBxdWVyeVxuICByZXR1cm4gdGhpcy5jcmVhdGVRdWVyeShib2R5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1heERlcHRoKGJvZHkpIHtcbiAgbGV0IGRlcHRocyA9IFtdO1xuICBmb3IgKGtleSBpbiBib2R5KSB7XG4gICAgaWYgKF8uaXNPYmplY3QoYm9keVtrZXldKSkge1xuICAgICAgZGVwdGhzLnB1c2goZ2V0TWF4RGVwdGgoYm9keVtrZXldKSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGRlcHRocy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIHJldHVybiBNYXRoLm1heCguLi5kZXB0aHMpICsgMTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlbnkoYm9keSwgZmllbGRzKSB7XG4gIGZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICBsZXQgcGFydHMgPSBmaWVsZC5zcGxpdCgnLicpO1xuICAgIGxldCBhY2Nlc3NvciA9IGJvZHk7XG4gICAgd2hpbGUgKHBhcnRzLmxlbmd0aCAhPSAwKSB7XG4gICAgICBpZiAocGFydHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGRlbGV0ZSBhY2Nlc3NvcltwYXJ0c1swXV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIV8uaXNPYmplY3QoYWNjZXNzb3IpKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYWNjZXNzb3IgPSBhY2Nlc3NvcltwYXJ0c1swXV07XG4gICAgICB9XG4gICAgICBwYXJ0cy5zaGlmdCgpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGNsZWFyRW1wdHlPYmplY3RzKGJvZHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJFbXB0eU9iamVjdHMoYm9keSkge1xuICAvLyBjbGVhciBlbXB0eSBub2RlcyB0aGVuIGJhY2stcHJvcGFnYXRlXG4gIGZvciAobGV0IGtleSBpbiBib2R5KSB7XG4gICAgaWYgKF8uaXNPYmplY3QoYm9keVtrZXldKSkge1xuICAgICAgY29uc3Qgc2hvdWxkRGVsZXRlID0gY2xlYXJFbXB0eU9iamVjdHMoYm9keVtrZXldKTtcbiAgICAgIGlmIChzaG91bGREZWxldGUpIHtcbiAgICAgICAgZGVsZXRlIGJvZHlba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmtleXMoYm9keSkubGVuZ3RoID09PSAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlR2V0QXJncyhib2R5KSB7XG4gIHJldHVybiBmdW5jdGlvbihwYXRoKSB7XG4gICAgY29uc3QgcGFydHMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgbGV0IHN0b3BwZWQgPSBmYWxzZTtcbiAgICBsZXQgYWNjZXNzb3IgPSBib2R5O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghYWNjZXNzb3IpIHtcbiAgICAgICAgc3RvcHBlZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZiAoYWNjZXNzb3JbcGFydHNbaV1dKSB7XG4gICAgICAgIGFjY2Vzc29yID0gYWNjZXNzb3JbcGFydHNbaV1dO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdG9wcGVkKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgaWYgKGFjY2Vzc29yKSB7XG4gICAgICByZXR1cm4gYWNjZXNzb3JbU3ltYm9scy5BUkdVTUVOVFNdIHx8IHt9O1xuICAgIH1cbiAgfTtcbn1cbiIsImxldCBkZWZhdWx0cyA9IHt9O1xuXG5leHBvcnQgZGVmYXVsdCBkZWZhdWx0cztcblxuZXhwb3J0IGZ1bmN0aW9uIHNldEFzdFRvUXVlcnlEZWZhdWx0cyhvYmplY3QpIHtcbiAgT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgb2JqZWN0KTtcbn1cbiIsImltcG9ydCB7TWF0Y2h9IGZyb20gJ21ldGVvci9jaGVjayc7XG5pbXBvcnQge01vbmdvfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuXG5leHBvcnQgY29uc3QgRGVub3JtYWxpemVTY2hlbWEgPSB7XG4gICAgZmllbGQ6IFN0cmluZyxcbiAgICBib2R5OiBPYmplY3QsXG4gICAgYnlwYXNzU2NoZW1hOiBNYXRjaC5NYXliZShCb29sZWFuKVxufTtcblxuZXhwb3J0IGNvbnN0IExpbmtDb25maWdEZWZhdWx0cyA9IHtcbiAgICB0eXBlOiAnb25lJyxcbn07XG5cbmV4cG9ydCBjb25zdCBMaW5rQ29uZmlnU2NoZW1hID0ge1xuICAgIHR5cGU6IE1hdGNoLk1heWJlKE1hdGNoLk9uZU9mKCdvbmUnLCAnbWFueScsICcxJywgJyonKSksXG4gICAgY29sbGVjdGlvbjogTWF0Y2guTWF5YmUoXG4gICAgICAgIE1hdGNoLldoZXJlKGNvbGxlY3Rpb24gPT4ge1xuICAgICAgICAgICAgLy8gV2UgZG8gbGlrZSB0aGlzIHNvIGl0IHdvcmtzIHdpdGggb3RoZXIgdHlwZXMgb2YgY29sbGVjdGlvbnMgXG4gICAgICAgICAgICAvLyBsaWtlIEZTLkNvbGxlY3Rpb25cbiAgICAgICAgICAgIHJldHVybiBfLmlzT2JqZWN0KGNvbGxlY3Rpb24pICYmIChcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uIGluc3RhbmNlb2YgTW9uZ28uQ29sbGVjdGlvblxuICAgICAgICAgICAgICAgIHx8IFxuICAgICAgICAgICAgICAgICEhY29sbGVjdGlvbi5fY29sbGVjdGlvblxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICApLFxuICAgIGZpZWxkOiBNYXRjaC5NYXliZShTdHJpbmcpLFxuICAgIG1ldGFkYXRhOiBNYXRjaC5NYXliZShCb29sZWFuKSxcbiAgICBpbnZlcnNlZEJ5OiBNYXRjaC5NYXliZShTdHJpbmcpLFxuICAgIGluZGV4OiBNYXRjaC5NYXliZShCb29sZWFuKSxcbiAgICB1bmlxdWU6IE1hdGNoLk1heWJlKEJvb2xlYW4pLFxuICAgIGF1dG9yZW1vdmU6IE1hdGNoLk1heWJlKEJvb2xlYW4pLFxuICAgIGRlbm9ybWFsaXplOiBNYXRjaC5NYXliZShNYXRjaC5PYmplY3RJbmNsdWRpbmcoRGVub3JtYWxpemVTY2hlbWEpKSxcbn07IiwiZXhwb3J0IGNvbnN0IExJTktfU1RPUkFHRSA9ICdfX2xpbmtzJztcbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCB7IExJTktfU1RPUkFHRSB9IGZyb20gJy4vY29uc3RhbnRzLmpzJztcbmltcG9ydCBMaW5rZXIgZnJvbSAnLi9saW5rZXIuanMnO1xuXG5PYmplY3QuYXNzaWduKE1vbmdvLkNvbGxlY3Rpb24ucHJvdG90eXBlLCB7XG4gICAgLyoqXG4gICAgICogVGhlIGRhdGEgd2UgYWRkIHNob3VsZCBiZSB2YWxpZCBmb3IgY29uZmlnLnNjaGVtYS5qc1xuICAgICAqL1xuICAgIGFkZExpbmtzKGRhdGEpIHtcbiAgICAgICAgaWYgKCF0aGlzW0xJTktfU1RPUkFHRV0pIHtcbiAgICAgICAgICAgIHRoaXNbTElOS19TVE9SQUdFXSA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgXy5lYWNoKGRhdGEsIChsaW5rQ29uZmlnLCBsaW5rTmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXNbTElOS19TVE9SQUdFXVtsaW5rTmFtZV0pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICAgICBgWW91IGNhbm5vdCBhZGQgdGhlIGxpbmsgd2l0aCBuYW1lOiAke2xpbmtOYW1lfSBiZWNhdXNlIGl0IHdhcyBhbHJlYWR5IGFkZGVkIHRvICR7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9uYW1lXG4gICAgICAgICAgICAgICAgICAgIH0gY29sbGVjdGlvbmBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBsaW5rZXIgPSBuZXcgTGlua2VyKHRoaXMsIGxpbmtOYW1lLCBsaW5rQ29uZmlnKTtcblxuICAgICAgICAgICAgXy5leHRlbmQodGhpc1tMSU5LX1NUT1JBR0VdLCB7XG4gICAgICAgICAgICAgICAgW2xpbmtOYW1lXTogbGlua2VyLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBnZXRMaW5rcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbTElOS19TVE9SQUdFXTtcbiAgICB9LFxuXG4gICAgZ2V0TGlua2VyKG5hbWUpIHtcbiAgICAgICAgaWYgKHRoaXNbTElOS19TVE9SQUdFXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbTElOS19TVE9SQUdFXVtuYW1lXTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBoYXNMaW5rKG5hbWUpIHtcbiAgICAgICAgaWYgKCF0aGlzW0xJTktfU1RPUkFHRV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhIXRoaXNbTElOS19TVE9SQUdFXVtuYW1lXTtcbiAgICB9LFxuXG4gICAgZ2V0TGluayhvYmplY3RPcklkLCBuYW1lKSB7XG4gICAgICAgIGxldCBsaW5rRGF0YSA9IHRoaXNbTElOS19TVE9SQUdFXTtcblxuICAgICAgICBpZiAoIWxpbmtEYXRhKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgIGBUaGVyZSBhcmUgbm8gbGlua3MgZGVmaW5lZCBmb3IgY29sbGVjdGlvbjogJHt0aGlzLl9uYW1lfWBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWxpbmtEYXRhW25hbWVdKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgIGBUaGVyZSBpcyBubyBsaW5rICR7bmFtZX0gZm9yIGNvbGxlY3Rpb246ICR7dGhpcy5fbmFtZX1gXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbGlua2VyID0gbGlua0RhdGFbbmFtZV07XG4gICAgICAgIGxldCBvYmplY3QgPSBvYmplY3RPcklkO1xuICAgICAgICBpZiAodHlwZW9mIG9iamVjdE9ySWQgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmICghbGlua2VyLmlzVmlydHVhbCgpKSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0ID0gdGhpcy5maW5kT25lKG9iamVjdE9ySWQsIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBbbGlua2VyLmxpbmtTdG9yYWdlRmllbGRdOiAxLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvYmplY3QgPSB7IF9pZDogb2JqZWN0T3JJZCB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIW9iamVjdCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIGBXZSBjb3VsZCBub3QgZmluZCBhbnkgb2JqZWN0IHdpdGggX2lkOiBcIiR7b2JqZWN0T3JJZH1cIiB3aXRoaW4gdGhlIGNvbGxlY3Rpb246ICR7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9uYW1lXG4gICAgICAgICAgICAgICAgICAgIH1gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaW5rRGF0YVtuYW1lXS5jcmVhdGVMaW5rKG9iamVjdCk7XG4gICAgfSxcbn0pO1xuIiwiaW1wb3J0IExpbmtNYW55IGZyb20gJy4vbGlua1R5cGVzL2xpbmtNYW55LmpzJztcbmltcG9ydCBMaW5rTWFueU1ldGEgZnJvbSAnLi9saW5rVHlwZXMvbGlua01hbnlNZXRhLmpzJztcbmltcG9ydCBMaW5rT25lIGZyb20gJy4vbGlua1R5cGVzL2xpbmtPbmUuanMnO1xuaW1wb3J0IExpbmtPbmVNZXRhIGZyb20gJy4vbGlua1R5cGVzL2xpbmtPbmVNZXRhLmpzJztcbmltcG9ydCB7IExpbmtDb25maWdTY2hlbWEsIExpbmtDb25maWdEZWZhdWx0cyB9IGZyb20gJy4vY29uZmlnLnNjaGVtYS5qcyc7XG5pbXBvcnQgc21hcnRBcmd1bWVudHMgZnJvbSAnLi9saW5rVHlwZXMvbGliL3NtYXJ0QXJndW1lbnRzJztcbmltcG9ydCBkb3QgZnJvbSAnZG90LW9iamVjdCc7XG5pbXBvcnQgeyBjaGVjayB9IGZyb20gJ21ldGVvci9jaGVjayc7XG5pbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuaW1wb3J0IHsgYWNjZXNzIH0gZnJvbSAnZnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5rZXIge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBtYWluQ29sbGVjdGlvblxuICAgICAqIEBwYXJhbSBsaW5rTmFtZVxuICAgICAqIEBwYXJhbSBsaW5rQ29uZmlnXG4gICAgICovXG4gICAgY29uc3RydWN0b3IobWFpbkNvbGxlY3Rpb24sIGxpbmtOYW1lLCBsaW5rQ29uZmlnKSB7XG4gICAgICAgIHRoaXMubWFpbkNvbGxlY3Rpb24gPSBtYWluQ29sbGVjdGlvbjtcbiAgICAgICAgdGhpcy5saW5rQ29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgTGlua0NvbmZpZ0RlZmF1bHRzLCBsaW5rQ29uZmlnKTtcbiAgICAgICAgdGhpcy5saW5rTmFtZSA9IGxpbmtOYW1lO1xuXG4gICAgICAgIC8vIGNoZWNrIGxpbmtOYW1lIG11c3Qgbm90IGV4aXN0IGluIHNjaGVtYVxuICAgICAgICB0aGlzLl92YWxpZGF0ZUFuZENsZWFuKCk7XG5cbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBjYXNjYWRlIHJlbW92YWwgaG9va3MuXG4gICAgICAgIHRoaXMuX2luaXRBdXRvcmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuX2luaXREZW5vcm1hbGl6YXRpb24oKTtcblxuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgLy8gaWYgaXQncyBhIHZpcnR1YWwgZmllbGQgbWFrZSBzdXJlIHRoYXQgd2hlbiB0aGlzIGlzIGRlbGV0ZWQsIGl0IHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSByZWZlcmVuY2VzXG4gICAgICAgICAgICBpZiAoIWxpbmtDb25maWcuYXV0b3JlbW92ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZVJlZmVyZW5jZVJlbW92YWxGb3JWaXJ0dWFsTGlua3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRJbmRleCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmFsdWVzIHdoaWNoIHJlcHJlc2VudCBmb3IgdGhlIHJlbGF0aW9uIGEgc2luZ2xlIGxpbmtcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nW119XG4gICAgICovXG4gICAgZ2V0IG9uZVR5cGVzKCkge1xuICAgICAgICByZXR1cm4gWydvbmUnLCAnMSddO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHN0cmF0ZWdpZXM6IG9uZSwgbWFueSwgb25lLW1ldGEsIG1hbnktbWV0YVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0IHN0cmF0ZWd5KCkge1xuICAgICAgICBsZXQgc3RyYXRlZ3kgPSB0aGlzLmlzTWFueSgpID8gJ21hbnknIDogJ29uZSc7XG4gICAgICAgIGlmICh0aGlzLmxpbmtDb25maWcubWV0YWRhdGEpIHtcbiAgICAgICAgICAgIHN0cmF0ZWd5ICs9ICctbWV0YSc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RyYXRlZ3k7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZmllbGQgbmFtZSBpbiB0aGUgZG9jdW1lbnQgd2hlcmUgdGhlIGFjdHVhbCByZWxhdGlvbnNoaXBzIGFyZSBzdG9yZWQuXG4gICAgICogQHJldHVybnMgc3RyaW5nXG4gICAgICovXG4gICAgZ2V0IGxpbmtTdG9yYWdlRmllbGQoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5saW5rQ29uZmlnLnJlbGF0ZWRMaW5rZXIubGlua1N0b3JhZ2VGaWVsZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmxpbmtDb25maWcuZmllbGQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGNvbGxlY3Rpb24gdGhhdCBpcyBsaW5rZWQgd2l0aCB0aGUgY3VycmVudCBjb2xsZWN0aW9uXG4gICAgICogQHJldHVybnMgTW9uZ28uQ29sbGVjdGlvblxuICAgICAqL1xuICAgIGdldExpbmtlZENvbGxlY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpbmtDb25maWcuY29sbGVjdGlvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgcmVsYXRpb25zaGlwIGZvciB0aGlzIGxpbmsgaXMgb2YgXCJtYW55XCIgdHlwZS5cbiAgICAgKi9cbiAgICBpc01hbnkoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5pc1NpbmdsZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIHRoZSByZWxhdGlvbnNoaXAgZm9yIHRoaXMgbGluayBjb250YWlucyBtZXRhZGF0YVxuICAgICAqL1xuICAgIGlzTWV0YSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpbmtDb25maWcucmVsYXRlZExpbmtlci5pc01ldGEoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhIXRoaXMubGlua0NvbmZpZy5tZXRhZGF0YTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBpc1NpbmdsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpbmtDb25maWcucmVsYXRlZExpbmtlci5pc1NpbmdsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnModGhpcy5vbmVUeXBlcywgdGhpcy5saW5rQ29uZmlnLnR5cGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGlzVmlydHVhbCgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5saW5rQ29uZmlnLmludmVyc2VkQnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvdWxkIHJldHVybiBhIHNpbmdsZSByZXN1bHQuXG4gICAgICovXG4gICAgaXNPbmVSZXN1bHQoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAodGhpcy5pc1ZpcnR1YWwoKSAmJlxuICAgICAgICAgICAgICAgIHRoaXMubGlua0NvbmZpZy5yZWxhdGVkTGlua2VyLmxpbmtDb25maWcudW5pcXVlKSB8fFxuICAgICAgICAgICAgKCF0aGlzLmlzVmlydHVhbCgpICYmIHRoaXMuaXNTaW5nbGUoKSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gb2JqZWN0XG4gICAgICogQHBhcmFtIGNvbGxlY3Rpb24gVG8gaW1wZXJzb25hdGUgdGhlIGdldExpbmtlZENvbGxlY3Rpb24oKSBvZiB0aGUgXCJMaW5rZXJcIlxuICAgICAqXG4gICAgICogQHJldHVybnMge0xpbmtPbmV8TGlua01hbnl8TGlua01hbnlNZXRhfExpbmtPbmVNZXRhfExpbmtSZXNvbHZlfVxuICAgICAqL1xuICAgIGNyZWF0ZUxpbmsob2JqZWN0LCBjb2xsZWN0aW9uID0gbnVsbCkge1xuICAgICAgICBsZXQgaGVscGVyQ2xhc3MgPSB0aGlzLl9nZXRIZWxwZXJDbGFzcygpO1xuXG4gICAgICAgIHJldHVybiBuZXcgaGVscGVyQ2xhc3ModGhpcywgb2JqZWN0LCBjb2xsZWN0aW9uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF92YWxpZGF0ZUFuZENsZWFuKCkge1xuICAgICAgICBpZiAoIXRoaXMubGlua0NvbmZpZy5jb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICdpbnZhbGlkLWNvbmZpZycsXG4gICAgICAgICAgICAgICAgYEZvciB0aGUgbGluayAke1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpbmtOYW1lXG4gICAgICAgICAgICAgICAgfSB5b3UgZGlkIG5vdCBwcm92aWRlIGEgY29sbGVjdGlvbi5gXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmxpbmtDb25maWcuY29sbGVjdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbGxlY3Rpb25OYW1lID0gdGhpcy5saW5rQ29uZmlnLmNvbGxlY3Rpb247XG4gICAgICAgICAgICB0aGlzLmxpbmtDb25maWcuY29sbGVjdGlvbiA9IE1vbmdvLkNvbGxlY3Rpb24uZ2V0KGNvbGxlY3Rpb25OYW1lKTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmxpbmtDb25maWcuY29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICdpbnZhbGlkLWNvbGxlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICBgQ291bGQgbm90IGZpbmQgYSBjb2xsZWN0aW9uIHdpdGggdGhlIG5hbWU6ICR7Y29sbGVjdGlvbk5hbWV9YFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ByZXBhcmVWaXJ0dWFsKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubGlua0NvbmZpZy50eXBlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saW5rQ29uZmlnLnR5cGUgPSAnb25lJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0aGlzLmxpbmtDb25maWcuZmllbGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmtDb25maWcuZmllbGQgPSB0aGlzLl9nZW5lcmF0ZUZpZWxkTmFtZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5saW5rQ29uZmlnLmZpZWxkID09IHRoaXMubGlua05hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICdpbnZhbGlkLWNvbmZpZycsXG4gICAgICAgICAgICAgICAgICAgICAgICBgRm9yIHRoZSBsaW5rICR7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5rTmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSB5b3UgbXVzdCBub3QgdXNlIHRoZSBzYW1lIG5hbWUgZm9yIHRoZSBmaWVsZCwgb3RoZXJ3aXNlIGl0IHdpbGwgY2F1c2UgY29uZmxpY3RzIHdoZW4gZmV0Y2hpbmcgZGF0YWBcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjaGVjayh0aGlzLmxpbmtDb25maWcsIExpbmtDb25maWdTY2hlbWEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdlIG5lZWQgdG8gYXBwbHkgc2FtZSB0eXBlIG9mIHJ1bGVzIGluIHRoaXMgY2FzZS5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9wcmVwYXJlVmlydHVhbCgpIHtcbiAgICAgICAgY29uc3QgeyBjb2xsZWN0aW9uLCBpbnZlcnNlZEJ5IH0gPSB0aGlzLmxpbmtDb25maWc7XG4gICAgICAgIGxldCBsaW5rZXIgPSBjb2xsZWN0aW9uLmdldExpbmtlcihpbnZlcnNlZEJ5KTtcblxuICAgICAgICBpZiAoIWxpbmtlcikge1xuICAgICAgICAgICAgLy8gaXQgaXMgcG9zc2libGUgdGhhdCB0aGUgY29sbGVjdGlvbiBkb2Vzbid0IGhhdmUgYSBsaW5rZXIgY3JlYXRlZCB5ZXQuXG4gICAgICAgICAgICAvLyBzbyB3ZSB3aWxsIGNyZWF0ZSBpdCBvbiBzdGFydHVwIGFmdGVyIGFsbCBsaW5rcyBoYXZlIGJlZW4gZGVmaW5lZFxuICAgICAgICAgICAgTWV0ZW9yLnN0YXJ0dXAoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxpbmtlciA9IGNvbGxlY3Rpb24uZ2V0TGlua2VyKGludmVyc2VkQnkpO1xuICAgICAgICAgICAgICAgIGlmICghbGlua2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICBgWW91IHRyaWVkIHNldHRpbmcgdXAgYW4gaW52ZXJzZWQgbGluayBpbiBcIiR7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYWluQ29sbGVjdGlvbi5fbmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVwiIHBvaW50aW5nIHRvIGNvbGxlY3Rpb246IFwiJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLl9uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICB9XCIgbGluazogXCIke2ludmVyc2VkQnl9XCIsIGJ1dCBubyBzdWNoIGxpbmsgd2FzIGZvdW5kLiBNYXliZSBhIHR5cG8gP2BcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXR1cFZpcnR1YWxDb25maWcobGlua2VyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3NldHVwVmlydHVhbENvbmZpZyhsaW5rZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGxpbmtlclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldHVwVmlydHVhbENvbmZpZyhsaW5rZXIpIHtcbiAgICAgICAgY29uc3QgdmlydHVhbExpbmtDb25maWcgPSBsaW5rZXIubGlua0NvbmZpZztcblxuICAgICAgICBpZiAoIXZpcnR1YWxMaW5rQ29uZmlnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgIGBUaGVyZSBpcyBubyBsaW5rLWNvbmZpZyBmb3IgdGhlIHJlbGF0ZWQgY29sbGVjdGlvbiBvbiAke2ludmVyc2VkQnl9LiBNYWtlIHN1cmUgeW91IGFkZGVkIHRoZSBkaXJlY3QgbGlua3MgYmVmb3JlIHNwZWNpZnlpbmcgdmlydHVhbCBvbmVzLmBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBfLmV4dGVuZCh0aGlzLmxpbmtDb25maWcsIHtcbiAgICAgICAgICAgIG1ldGFkYXRhOiB2aXJ0dWFsTGlua0NvbmZpZy5tZXRhZGF0YSxcbiAgICAgICAgICAgIHJlbGF0ZWRMaW5rZXI6IGxpbmtlcixcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVwZW5kaW5nIG9uIHRoZSBzdHJhdGVneSwgd2UgY3JlYXRlIHRoZSBwcm9wZXIgaGVscGVyIGNsYXNzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0SGVscGVyQ2xhc3MoKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5zdHJhdGVneSkge1xuICAgICAgICAgICAgY2FzZSAnbWFueS1tZXRhJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gTGlua01hbnlNZXRhO1xuICAgICAgICAgICAgY2FzZSAnbWFueSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIExpbmtNYW55O1xuICAgICAgICAgICAgY2FzZSAnb25lLW1ldGEnOlxuICAgICAgICAgICAgICAgIHJldHVybiBMaW5rT25lTWV0YTtcbiAgICAgICAgICAgIGNhc2UgJ29uZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIExpbmtPbmU7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgJ2ludmFsaWQtc3RyYXRlZ3knLFxuICAgICAgICAgICAgYCR7dGhpcy5zdHJhdGVneX0gaXMgbm90IGEgdmFsaWQgc3RyYXRlZ3lgXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgZmllbGQgbmFtZSBub3QgcHJlc2VudCwgd2UgZ2VuZXJhdGUgaXQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2VuZXJhdGVGaWVsZE5hbWUoKSB7XG4gICAgICAgIGxldCBjbGVhbmVkQ29sbGVjdGlvbk5hbWUgPSB0aGlzLmxpbmtDb25maWcuY29sbGVjdGlvbi5fbmFtZS5yZXBsYWNlKFxuICAgICAgICAgICAgL1xcLi9nLFxuICAgICAgICAgICAgJ18nXG4gICAgICAgICk7XG4gICAgICAgIGxldCBkZWZhdWx0RmllbGRQcmVmaXggPSB0aGlzLmxpbmtOYW1lICsgJ18nICsgY2xlYW5lZENvbGxlY3Rpb25OYW1lO1xuXG4gICAgICAgIHN3aXRjaCAodGhpcy5zdHJhdGVneSkge1xuICAgICAgICAgICAgY2FzZSAnbWFueS1tZXRhJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7ZGVmYXVsdEZpZWxkUHJlZml4fV9tZXRhc2A7XG4gICAgICAgICAgICBjYXNlICdtYW55JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7ZGVmYXVsdEZpZWxkUHJlZml4fV9pZHNgO1xuICAgICAgICAgICAgY2FzZSAnb25lLW1ldGEnOlxuICAgICAgICAgICAgICAgIHJldHVybiBgJHtkZWZhdWx0RmllbGRQcmVmaXh9X21ldGFgO1xuICAgICAgICAgICAgY2FzZSAnb25lJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7ZGVmYXVsdEZpZWxkUHJlZml4fV9pZGA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGEgbGluayB0aGF0IGlzIGRlY2xhcmVkIHZpcnR1YWwgaXMgcmVtb3ZlZCwgdGhlIHJlZmVyZW5jZSB3aWxsIGJlIHJlbW92ZWQgZnJvbSBldmVyeSBvdGhlciBsaW5rLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2hhbmRsZVJlZmVyZW5jZVJlbW92YWxGb3JWaXJ0dWFsTGlua3MoKSB7XG4gICAgICAgIHRoaXMubWFpbkNvbGxlY3Rpb24uYWZ0ZXIucmVtb3ZlKCh1c2VySWQsIGRvYykgPT4ge1xuICAgICAgICAgICAgLy8gdGhpcyBwcm9ibGVtIG1heSBvY2N1ciB3aGVuIHlvdSBkbyBhIC5yZW1vdmUoKSBiZWZvcmUgTWV0ZW9yLnN0YXJ0dXAoKVxuICAgICAgICAgICAgaWYgKCF0aGlzLmxpbmtDb25maWcucmVsYXRlZExpbmtlcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgICAgICAgICAgYFRoZXJlIHdhcyBhbiBlcnJvciBmaW5kaW5nIHRoZSBsaW5rIGZvciByZW1vdmFsIGZvciBjb2xsZWN0aW9uOiBcIiR7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1haW5Db2xsZWN0aW9uLl9uYW1lXG4gICAgICAgICAgICAgICAgICAgIH1cIiB3aXRoIGxpbms6IFwiJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGlua05hbWVcbiAgICAgICAgICAgICAgICAgICAgfVwiLiBUaGlzIG1heSBvY2N1ciB3aGVuIHlvdSBkbyBhIC5yZW1vdmUoKSBiZWZvcmUgTWV0ZW9yLnN0YXJ0dXAoKWBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYWNjZXNzb3IgPSB0aGlzLmNyZWF0ZUxpbmsoZG9jKTtcblxuICAgICAgICAgICAgXy5lYWNoKGFjY2Vzc29yLmZldGNoQXNBcnJheSgpLCBsaW5rZWRPYmogPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgcmVsYXRlZExpbmtlciB9ID0gdGhpcy5saW5rQ29uZmlnO1xuICAgICAgICAgICAgICAgIC8vIFdlIGRvIHRoaXMgY2hlY2ssIHRvIGF2b2lkIHNlbGYtcmVmZXJlbmNpbmcgaGVsbCB3aGVuIGRlZmluaW5nIHZpcnR1YWwgbGlua3NcbiAgICAgICAgICAgICAgICAvLyBWaXJ0dWFsIGxpbmtzIGlmIG5vdCBmb3VuZCBcImNvbXBpbGUtdGltZVwiLCB3ZSB3aWxsIHRyeSBhZ2FpbiB0byByZXByb2Nlc3MgdGhlbSBvbiBNZXRlb3Iuc3RhcnR1cFxuICAgICAgICAgICAgICAgIC8vIGlmIGEgcmVtb3ZhbCBoYXBwZW5zIGJlZm9yZSBNZXRlb3Iuc3RhcnR1cCB0aGlzIG1heSBmYWlsXG4gICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRMaW5rZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpbmsgPSByZWxhdGVkTGlua2VyLmNyZWF0ZUxpbmsobGlua2VkT2JqKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocmVsYXRlZExpbmtlci5pc1NpbmdsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnVuc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnJlbW92ZShkb2MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9pbml0SW5kZXgoKSB7XG4gICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGxldCBmaWVsZCA9IHRoaXMubGlua0NvbmZpZy5maWVsZDtcbiAgICAgICAgICAgIGlmICh0aGlzLmxpbmtDb25maWcubWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgICBmaWVsZCA9IGZpZWxkICsgJy5faWQnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5saW5rQ29uZmlnLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICdZb3UgY2Fubm90IHNldCBpbmRleCBvbiBhbiBpbnZlcnNlZCBsaW5rLidcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgb3B0aW9ucztcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5saW5rQ29uZmlnLnVuaXF1ZSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zID0geyB1bmlxdWU6IHRydWUgfTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLm1haW5Db2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7IFtmaWVsZF06IDEgfSwgb3B0aW9ucyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxpbmtDb25maWcudW5pcXVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdZb3UgY2Fubm90IHNldCB1bmlxdWUgcHJvcGVydHkgb24gYW4gaW52ZXJzZWQgbGluay4nXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYWluQ29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2ZpZWxkXTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHVuaXF1ZTogdHJ1ZSwgc3BhcnNlOiB0cnVlIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfaW5pdEF1dG9yZW1vdmUoKSB7XG4gICAgICAgIGlmICghdGhpcy5saW5rQ29uZmlnLmF1dG9yZW1vdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgdGhpcy5tYWluQ29sbGVjdGlvbi5hZnRlci5yZW1vdmUoKHVzZXJJZCwgZG9jKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRMaW5rZWRDb2xsZWN0aW9uKCkucmVtb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkaW46IHNtYXJ0QXJndW1lbnRzLmdldElkcyhkb2NbdGhpcy5saW5rU3RvcmFnZUZpZWxkXSksXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubWFpbkNvbGxlY3Rpb24uYWZ0ZXIucmVtb3ZlKCh1c2VySWQsIGRvYykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmtlciA9IHRoaXMubWFpbkNvbGxlY3Rpb24uZ2V0TGluayhkb2MsIHRoaXMubGlua05hbWUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkcyA9IGxpbmtlclxuICAgICAgICAgICAgICAgICAgICAuZmluZCh7fSwgeyBmaWVsZHM6IHsgX2lkOiAxIH0gfSlcbiAgICAgICAgICAgICAgICAgICAgLmZldGNoKClcbiAgICAgICAgICAgICAgICAgICAgLm1hcChpdGVtID0+IGl0ZW0uX2lkKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0TGlua2VkQ29sbGVjdGlvbigpLnJlbW92ZSh7XG4gICAgICAgICAgICAgICAgICAgIF9pZDogeyAkaW46IGlkcyB9LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyBkZW5vcm1hbGl6YXRpb24gdXNpbmcgaGVydGVieTpkZW5vcm1hbGl6ZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2luaXREZW5vcm1hbGl6YXRpb24oKSB7XG4gICAgICAgIGlmICghdGhpcy5saW5rQ29uZmlnLmRlbm9ybWFsaXplIHx8ICFNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhY2thZ2VFeGlzdHMgPSAhIVBhY2thZ2VbJ2hlcnRlYnk6ZGVub3JtYWxpemUnXTtcbiAgICAgICAgaWYgKCFwYWNrYWdlRXhpc3RzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICdtaXNzaW5nLXBhY2thZ2UnLFxuICAgICAgICAgICAgICAgIGBQbGVhc2UgYWRkIHRoZSBoZXJ0ZWJ5OmRlbm9ybWFsaXplIHBhY2thZ2UgdG8geW91ciBNZXRlb3IgYXBwbGljYXRpb24gaW4gb3JkZXIgdG8gbWFrZSBjYWNoaW5nIHdvcmtgXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeyBmaWVsZCwgYm9keSwgYnlwYXNzU2NoZW1hIH0gPSB0aGlzLmxpbmtDb25maWcuZGVub3JtYWxpemU7XG4gICAgICAgIGxldCBjYWNoZUNvbmZpZztcblxuICAgICAgICBsZXQgcmVmZXJlbmNlRmllbGRTdWZmaXggPSAnJztcbiAgICAgICAgaWYgKHRoaXMuaXNNZXRhKCkpIHtcbiAgICAgICAgICAgIHJlZmVyZW5jZUZpZWxkU3VmZml4ID0gdGhpcy5pc1NpbmdsZSgpID8gJy5faWQnIDogJzpfaWQnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgICAgIGxldCBpbnZlcnNlZExpbmsgPSB0aGlzLmxpbmtDb25maWcucmVsYXRlZExpbmtlci5saW5rQ29uZmlnO1xuXG4gICAgICAgICAgICBsZXQgdHlwZSA9XG4gICAgICAgICAgICAgICAgaW52ZXJzZWRMaW5rLnR5cGUgPT0gJ21hbnknID8gJ21hbnktaW52ZXJzZScgOiAnaW52ZXJzZWQnO1xuXG4gICAgICAgICAgICBjYWNoZUNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IHRoaXMubGlua0NvbmZpZy5jb2xsZWN0aW9uLFxuICAgICAgICAgICAgICAgIGZpZWxkczogYm9keSxcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VGaWVsZDogaW52ZXJzZWRMaW5rLmZpZWxkICsgcmVmZXJlbmNlRmllbGRTdWZmaXgsXG4gICAgICAgICAgICAgICAgY2FjaGVGaWVsZDogZmllbGQsXG4gICAgICAgICAgICAgICAgYnlwYXNzU2NoZW1hOiAhIWJ5cGFzc1NjaGVtYSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZUNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLmxpbmtDb25maWcudHlwZSxcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uOiB0aGlzLmxpbmtDb25maWcuY29sbGVjdGlvbixcbiAgICAgICAgICAgICAgICBmaWVsZHM6IGJvZHksXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlRmllbGQ6IHRoaXMubGlua0NvbmZpZy5maWVsZCArIHJlZmVyZW5jZUZpZWxkU3VmZml4LFxuICAgICAgICAgICAgICAgIGNhY2hlRmllbGQ6IGZpZWxkLFxuICAgICAgICAgICAgICAgIGJ5cGFzc1NjaGVtYTogISFieXBhc3NTY2hlbWEsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgICAgIE1ldGVvci5zdGFydHVwKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm1haW5Db2xsZWN0aW9uLmNhY2hlKGNhY2hlQ29uZmlnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tYWluQ29sbGVjdGlvbi5jYWNoZShjYWNoZUNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWZXJpZmllcyBpZiB0aGlzIGxpbmtlciBpcyBkZW5vcm1hbGl6ZWQuIEl0IGNhbiBiZSBkZW5vcm1hbGl6ZWQgZnJvbSB0aGUgaW52ZXJzZSBzaWRlIGFzIHdlbGwuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGlzRGVub3JtYWxpemVkKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLmxpbmtDb25maWcuZGVub3JtYWxpemU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmVyaWZpZXMgaWYgdGhlIGJvZHkgb2YgdGhlIGxpbmtlZCBlbGVtZW50IGRvZXMgbm90IGNvbnRhaW4gZmllbGRzIG91dHNpZGUgdGhlIGNhY2hlIGJvZHlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBib2R5XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBpc1N1YkJvZHlEZW5vcm1hbGl6ZWQoYm9keSkge1xuICAgICAgICBjb25zdCBjYWNoZUJvZHkgPSB0aGlzLmxpbmtDb25maWcuZGVub3JtYWxpemUuYm9keTtcblxuICAgICAgICBjb25zdCBjYWNoZUJvZHlGaWVsZHMgPSBfLmtleXMoZG90LmRvdChjYWNoZUJvZHkpKTtcbiAgICAgICAgY29uc3QgYm9keUZpZWxkcyA9IF8ua2V5cyhkb3QuZG90KF8ub21pdChib2R5LCAnX2lkJykpKTtcblxuICAgICAgICByZXR1cm4gXy5kaWZmZXJlbmNlKGJvZHlGaWVsZHMsIGNhY2hlQm9keUZpZWxkcykubGVuZ3RoID09PSAwO1xuICAgIH1cbn1cbiIsImltcG9ydCBzaWZ0IGZyb20gJ3NpZnQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVTZWFyY2hGaWx0ZXJzKG9iamVjdCwgZmllbGRTdG9yYWdlLCBzdHJhdGVneSwgaXNWaXJ0dWFsLCBtZXRhRmlsdGVycykge1xuICAgIGlmICghaXNWaXJ0dWFsKSB7XG4gICAgICAgIHN3aXRjaCAoc3RyYXRlZ3kpIHtcbiAgICAgICAgICAgIGNhc2UgJ29uZSc6IHJldHVybiBjcmVhdGVPbmUob2JqZWN0LCBmaWVsZFN0b3JhZ2UpO1xuICAgICAgICAgICAgY2FzZSAnb25lLW1ldGEnOiByZXR1cm4gY3JlYXRlT25lTWV0YShvYmplY3QsIGZpZWxkU3RvcmFnZSwgbWV0YUZpbHRlcnMpO1xuICAgICAgICAgICAgY2FzZSAnbWFueSc6IHJldHVybiBjcmVhdGVNYW55KG9iamVjdCwgZmllbGRTdG9yYWdlKTtcbiAgICAgICAgICAgIGNhc2UgJ21hbnktbWV0YSc6IHJldHVybiBjcmVhdGVNYW55TWV0YShvYmplY3QsIGZpZWxkU3RvcmFnZSwgbWV0YUZpbHRlcnMpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGBJbnZhbGlkIGxpbmtpbmcgc3RyYXRlZ3k6ICR7c3RyYXRlZ3l9YClcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHN3aXRjaCAoc3RyYXRlZ3kpIHtcbiAgICAgICAgICAgIGNhc2UgJ29uZSc6IHJldHVybiBjcmVhdGVPbmVWaXJ0dWFsKG9iamVjdCwgZmllbGRTdG9yYWdlKTtcbiAgICAgICAgICAgIGNhc2UgJ29uZS1tZXRhJzogcmV0dXJuIGNyZWF0ZU9uZU1ldGFWaXJ0dWFsKG9iamVjdCwgZmllbGRTdG9yYWdlLCBtZXRhRmlsdGVycyk7XG4gICAgICAgICAgICBjYXNlICdtYW55JzogcmV0dXJuIGNyZWF0ZU1hbnlWaXJ0dWFsKG9iamVjdCwgZmllbGRTdG9yYWdlKTtcbiAgICAgICAgICAgIGNhc2UgJ21hbnktbWV0YSc6IHJldHVybiBjcmVhdGVNYW55TWV0YVZpcnR1YWwob2JqZWN0LCBmaWVsZFN0b3JhZ2UsIG1ldGFGaWx0ZXJzKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihgSW52YWxpZCBsaW5raW5nIHN0cmF0ZWd5OiAke3N0cmF0ZWd5fWApXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVPbmUob2JqZWN0LCBmaWVsZFN0b3JhZ2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IG9iamVjdFtmaWVsZFN0b3JhZ2VdXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU9uZVZpcnR1YWwob2JqZWN0LCBmaWVsZFN0b3JhZ2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBbZmllbGRTdG9yYWdlXTogb2JqZWN0Ll9pZFxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVPbmVNZXRhKG9iamVjdCwgZmllbGRTdG9yYWdlLCBtZXRhRmlsdGVycykge1xuICAgIGNvbnN0IHZhbHVlID0gb2JqZWN0W2ZpZWxkU3RvcmFnZV07XG5cbiAgICBpZiAobWV0YUZpbHRlcnMpIHtcbiAgICAgICAgaWYgKCFzaWZ0KG1ldGFGaWx0ZXJzKSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7X2lkOiB1bmRlZmluZWR9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiB2YWx1ZSA/IHZhbHVlLl9pZCA6IHZhbHVlXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU9uZU1ldGFWaXJ0dWFsKG9iamVjdCwgZmllbGRTdG9yYWdlLCBtZXRhRmlsdGVycykge1xuICAgIGxldCBmaWx0ZXJzID0ge307XG4gICAgaWYgKG1ldGFGaWx0ZXJzKSB7XG4gICAgICAgIF8uZWFjaChtZXRhRmlsdGVycywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgIGZpbHRlcnNbZmllbGRTdG9yYWdlICsgJy4nICsga2V5XSA9IHZhbHVlO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIGZpbHRlcnNbZmllbGRTdG9yYWdlICsgJy5faWQnXSA9IG9iamVjdC5faWQ7XG5cbiAgICByZXR1cm4gZmlsdGVycztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1hbnkob2JqZWN0LCBmaWVsZFN0b3JhZ2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICRpbjogb2JqZWN0W2ZpZWxkU3RvcmFnZV0gfHwgW11cbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNYW55VmlydHVhbChvYmplY3QsIGZpZWxkU3RvcmFnZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIFtmaWVsZFN0b3JhZ2VdOiBvYmplY3QuX2lkXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1hbnlNZXRhKG9iamVjdCwgZmllbGRTdG9yYWdlLCBtZXRhRmlsdGVycykge1xuICAgIGxldCB2YWx1ZSA9IG9iamVjdFtmaWVsZFN0b3JhZ2VdO1xuXG4gICAgaWYgKG1ldGFGaWx0ZXJzKSB7XG4gICAgICAgIHZhbHVlID0gc2lmdChtZXRhRmlsdGVycywgdmFsdWUpXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAkaW46IF8ucGx1Y2sodmFsdWUsICdfaWQnKSB8fCBbXVxuICAgICAgICB9XG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1hbnlNZXRhVmlydHVhbChvYmplY3QsIGZpZWxkU3RvcmFnZSwgbWV0YUZpbHRlcnMpIHtcbiAgICBsZXQgZmlsdGVycyA9IHt9O1xuICAgIGlmIChtZXRhRmlsdGVycykge1xuICAgICAgICBfLmVhY2gobWV0YUZpbHRlcnMsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBmaWx0ZXJzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBmaWx0ZXJzLl9pZCA9IG9iamVjdC5faWQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBbZmllbGRTdG9yYWdlXTogeyRlbGVtTWF0Y2g6IGZpbHRlcnN9XG4gICAgfTtcbn0iLCJpbXBvcnQgU21hcnRBcmdzIGZyb20gJy4vbGliL3NtYXJ0QXJndW1lbnRzLmpzJztcbmltcG9ydCBjcmVhdGVTZWFyY2hGaWx0ZXJzIGZyb20gJy4uL2xpYi9jcmVhdGVTZWFyY2hGaWx0ZXJzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluayB7XG4gICAgZ2V0IGNvbmZpZygpIHsgcmV0dXJuIHRoaXMubGlua2VyLmxpbmtDb25maWc7IH1cblxuICAgIGdldCBpc1ZpcnR1YWwoKSB7IHJldHVybiB0aGlzLmxpbmtlci5pc1ZpcnR1YWwoKSB9XG5cbiAgICBjb25zdHJ1Y3RvcihsaW5rZXIsIG9iamVjdCwgY29sbGVjdGlvbikge1xuICAgICAgICB0aGlzLmxpbmtlciA9IGxpbmtlcjtcbiAgICAgICAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XG4gICAgICAgIHRoaXMubGlua2VkQ29sbGVjdGlvbiA9IChjb2xsZWN0aW9uKSA/IGNvbGxlY3Rpb24gOiBsaW5rZXIuZ2V0TGlua2VkQ29sbGVjdGlvbigpO1xuXG4gICAgICAgIGlmICh0aGlzLmxpbmtlci5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgdGhpcy5saW5rU3RvcmFnZUZpZWxkID0gdGhpcy5jb25maWcucmVsYXRlZExpbmtlci5saW5rQ29uZmlnLmZpZWxkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5saW5rU3RvcmFnZUZpZWxkID0gdGhpcy5jb25maWcuZmllbGQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBzdG9yZWQgbGluayBpbmZvcm1hdGlvbiB2YWx1ZVxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIHZhbHVlKCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ1lvdSBjYW4gb25seSB0YWtlIHRoZSB2YWx1ZSBmcm9tIHRoZSBtYWluIGxpbmsuJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5vYmplY3RbdGhpcy5saW5rU3RvcmFnZUZpZWxkXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kcyBsaW5rZWQgZGF0YS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBmaWx0ZXJzXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKiBAcGFyYW0gdXNlcklkXG4gICAgICovXG4gICAgZmluZChmaWx0ZXJzID0ge30sIG9wdGlvbnMgPSB7fSwgdXNlcklkID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCBsaW5rZXIgPSB0aGlzLmxpbmtlcjtcbiAgICAgICAgY29uc3QgbGlua2VkQ29sbGVjdGlvbiA9IHRoaXMubGlua2VkQ29sbGVjdGlvbjtcblxuICAgICAgICBsZXQgJG1ldGFGaWx0ZXJzO1xuICAgICAgICBpZiAoZmlsdGVycy4kbWV0YSkge1xuICAgICAgICAgICAgJG1ldGFGaWx0ZXJzID0gZmlsdGVycy4kbWV0YTtcbiAgICAgICAgICAgIGRlbGV0ZSBmaWx0ZXJzLiRtZXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2VhcmNoRmlsdGVycyA9IGNyZWF0ZVNlYXJjaEZpbHRlcnMoXG4gICAgICAgICAgICB0aGlzLm9iamVjdCxcbiAgICAgICAgICAgIHRoaXMubGlua1N0b3JhZ2VGaWVsZCxcbiAgICAgICAgICAgIGxpbmtlci5zdHJhdGVneSxcbiAgICAgICAgICAgIGxpbmtlci5pc1ZpcnR1YWwoKSxcbiAgICAgICAgICAgICRtZXRhRmlsdGVyc1xuICAgICAgICApO1xuXG4gICAgICAgIGxldCBhcHBsaWVkRmlsdGVycyA9IF8uZXh0ZW5kKHt9LCBmaWx0ZXJzLCBzZWFyY2hGaWx0ZXJzKTtcblxuICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2N1bHQtb2YtY29kZXJzL2dyYXBoZXIvaXNzdWVzLzEzNFxuICAgICAgICAvLyBoYXBwZW5zIGR1ZSB0byByZWN1cnNpdmUgaW1wb3J0aW5nIG9mIG1vZHVsZXNcbiAgICAgICAgLy8gVE9ETzogZmluZCBhbm90aGVyIHdheSB0byBkbyB0aGlzXG4gICAgICAgIGlmIChsaW5rZWRDb2xsZWN0aW9uLmZpbmQpIHtcbiAgICAgICAgICAgIHJldHVybiBsaW5rZWRDb2xsZWN0aW9uLmZpbmQoYXBwbGllZEZpbHRlcnMsIG9wdGlvbnMsIHVzZXJJZClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBsaW5rZWRDb2xsZWN0aW9uLmRlZmF1bHQuZmluZChhcHBsaWVkRmlsdGVycywgb3B0aW9ucywgdXNlcklkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBmaWx0ZXJzXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0gb3RoZXJzXG4gICAgICogQHJldHVybnMgeyp8e2NvbnRlbnR9fGFueX1cbiAgICAgKi9cbiAgICBmZXRjaChmaWx0ZXJzLCBvcHRpb25zLCAuLi5vdGhlcnMpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuZmluZChmaWx0ZXJzLCBvcHRpb25zLCAuLi5vdGhlcnMpLmZldGNoKCk7XG5cbiAgICAgICAgaWYgKHRoaXMubGlua2VyLmlzT25lUmVzdWx0KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBfLmZpcnN0KHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMganVzdCBsaWtlIGZldGNoKCkgYnV0IGZvcmNlcyB0byBnZXQgYW4gYXJyYXkgZXZlbiBpZiBpdCdzIHNpbmdsZSByZXN1bHRcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0geyp9IGZpbHRlcnMgXG4gICAgICogQHBhcmFtIHsqfSBvcHRpb25zIFxuICAgICAqIEBwYXJhbSAgey4uLmFueX0gb3RoZXJzIFxuICAgICAqL1xuICAgIGZldGNoQXNBcnJheShmaWx0ZXJzLCBvcHRpb25zLCAuLi5vdGhlcnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZChmaWx0ZXJzLCBvcHRpb25zLCAuLi5vdGhlcnMpLmZldGNoKClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXaGVuIHdlIGFyZSBkZWFsaW5nIHdpdGggbXVsdGlwbGUgdHlwZSByZWxhdGlvbnNoaXBzLCAkaW4gd291bGQgcmVxdWlyZSBhbiBhcnJheS4gSWYgdGhlIGZpZWxkIHZhbHVlIGlzIG51bGwsIGl0IHdpbGwgZmFpbFxuICAgICAqIFdlIHVzZSBjbGVhbiB0byBtYWtlIGl0IGFuIGVtcHR5IGFycmF5IGJ5IGRlZmF1bHQuXG4gICAgICovXG4gICAgY2xlYW4oKSB7fVxuXG4gICAgLyoqXG4gICAgICogRXh0cmFjdHMgYSBzaW5nbGUgaWRcbiAgICAgKi9cbiAgICBpZGVudGlmeUlkKHdoYXQsIHNhdmVUb0RhdGFiYXNlKSB7XG4gICAgICAgIHJldHVybiBTbWFydEFyZ3MuZ2V0SWQod2hhdCwge1xuICAgICAgICAgICAgc2F2ZVRvRGF0YWJhc2UsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiB0aGlzLmxpbmtlZENvbGxlY3Rpb25cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXh0cmFjdHMgdGhlIGlkcyBvZiBvYmplY3Qocykgb3Igc3RyaW5ncyBhbmQgcmV0dXJucyBhbiBhcnJheS5cbiAgICAgKi9cbiAgICBpZGVudGlmeUlkcyh3aGF0LCBzYXZlVG9EYXRhYmFzZSkge1xuICAgICAgICByZXR1cm4gU21hcnRBcmdzLmdldElkcyh3aGF0LCB7XG4gICAgICAgICAgICBzYXZlVG9EYXRhYmFzZSxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246IHRoaXMubGlua2VkQ29sbGVjdGlvblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3Mgd2hlbiBsaW5raW5nIGRhdGEsIGlmIHRoZSBpZHMgYXJlIHZhbGlkIHdpdGggdGhlIGxpbmtlZCBjb2xsZWN0aW9uLlxuICAgICAqIEB0aHJvd3MgTWV0ZW9yLkVycm9yXG4gICAgICogQHBhcmFtIGlkc1xuICAgICAqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIF92YWxpZGF0ZUlkcyhpZHMpIHtcbiAgICAgICAgaWYgKCFfLmlzQXJyYXkoaWRzKSkge1xuICAgICAgICAgICAgaWRzID0gW2lkc107XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB2YWxpZElkcyA9IHRoaXMubGlua2VkQ29sbGVjdGlvbi5maW5kKHtcbiAgICAgICAgICAgIF9pZDogeyRpbjogaWRzfVxuICAgICAgICB9LCB7ZmllbGRzOiB7X2lkOiAxfX0pLmZldGNoKCkubWFwKGRvYyA9PiBkb2MuX2lkKTtcblxuICAgICAgICBpZiAodmFsaWRJZHMubGVuZ3RoICE9IGlkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1mb3VuZCcsIGBZb3UgdHJpZWQgdG8gY3JlYXRlIGxpbmtzIHdpdGggbm9uLWV4aXN0aW5nIGlkKHMpIGluc2lkZSBcIiR7dGhpcy5saW5rZWRDb2xsZWN0aW9uLl9uYW1lfVwiOiAke18uZGlmZmVyZW5jZShpZHMsIHZhbGlkSWRzKS5qb2luKCcsICcpfWApXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIGZvciBhbGxvd2luZyBjb21tYW5kcyBzdWNoIGFzIHNldC91bnNldC9hZGQvcmVtb3ZlL21ldGFkYXRhIGZyb20gdGhlIHZpcnR1YWwgbGluay5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhY3Rpb25cbiAgICAgKiBAcGFyYW0gd2hhdFxuICAgICAqIEBwYXJhbSBtZXRhZGF0YVxuICAgICAqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIF92aXJ0dWFsQWN0aW9uKGFjdGlvbiwgd2hhdCwgbWV0YWRhdGEpIHtcbiAgICAgICAgY29uc3QgbGlua2VyID0gdGhpcy5saW5rZXIubGlua0NvbmZpZy5yZWxhdGVkTGlua2VyO1xuXG4gICAgICAgIC8vIGl0cyBhbiB1bnNldCBvcGVyYXRpb24gbW9zdCBsaWtlbHkuXG4gICAgICAgIGlmICh3aGF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJldmVyc2VkTGluayA9IGxpbmtlci5jcmVhdGVMaW5rKHRoaXMuZmV0Y2goKSk7XG4gICAgICAgICAgICByZXZlcnNlZExpbmsudW5zZXQoKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFfLmlzQXJyYXkod2hhdCkpIHtcbiAgICAgICAgICAgIHdoYXQgPSBbd2hhdF07XG4gICAgICAgIH1cblxuICAgICAgICB3aGF0ID0gXy5tYXAod2hhdCwgZWxlbWVudCA9PiB7XG4gICAgICAgICAgICBpZiAoIV8uaXNPYmplY3QoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGlua2VyLm1haW5Db2xsZWN0aW9uLmZpbmRPbmUoZWxlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghZWxlbWVudC5faWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZWxlbWVudElkID0gbGlua2VyLm1haW5Db2xsZWN0aW9uLmluc2VydChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgXy5leHRlbmQoZWxlbWVudCwgbGlua2VyLm1haW5Db2xsZWN0aW9uLmZpbmRPbmUoZWxlbWVudElkKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBfLm1hcCh3aGF0LCBlbGVtZW50ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJldmVyc2VkTGluayA9IGxpbmtlci5jcmVhdGVMaW5rKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICBpZiAoYWN0aW9uID09ICdtZXRhZGF0YScpIHtcbiAgICAgICAgICAgICAgICBpZiAobGlua2VyLmlzU2luZ2xlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldmVyc2VkTGluay5tZXRhZGF0YShtZXRhZGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldmVyc2VkTGluay5tZXRhZGF0YSh0aGlzLm9iamVjdCwgbWV0YWRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uID09ICdhZGQnIHx8IGFjdGlvbiA9PSAnc2V0Jykge1xuICAgICAgICAgICAgICAgIGlmIChsaW5rZXIuaXNTaW5nbGUoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXZlcnNlZExpbmsuc2V0KHRoaXMub2JqZWN0LCBtZXRhZGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZWRMaW5rLmFkZCh0aGlzLm9iamVjdCwgbWV0YWRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpbmtlci5pc1NpbmdsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldmVyc2VkTGluay51bnNldCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldmVyc2VkTGluay5yZW1vdmUodGhpcy5vYmplY3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IExpbmsgZnJvbSAnLi9iYXNlLmpzJztcbmltcG9ydCBTbWFydEFyZ3MgZnJvbSAnLi9saWIvc21hcnRBcmd1bWVudHMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5rTWFueSBleHRlbmRzIExpbmsge1xuICAgIGNsZWFuKCkge1xuICAgICAgICBpZiAoIXRoaXMub2JqZWN0W3RoaXMubGlua1N0b3JhZ2VGaWVsZF0pIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0W3RoaXMubGlua1N0b3JhZ2VGaWVsZF0gPSBbXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkcyB0aGUgX2lkcyB0byB0aGUgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB3aGF0XG4gICAgICovXG4gICAgYWRkKHdoYXQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0dWFsQWN0aW9uKCdhZGQnLCB3aGF0KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9pZiAodGhpcy5pc1ZpcnR1YWwpIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hbGxvd2VkJywgJ0FkZC9yZW1vdmUgb3BlcmF0aW9ucyBtdXN0IGJlIGRvbmUgZnJvbSB0aGUgb3duaW5nLWxpbmsgb2YgdGhlIHJlbGF0aW9uc2hpcCcpO1xuXG4gICAgICAgIHRoaXMuY2xlYW4oKTtcblxuICAgICAgICBjb25zdCBfaWRzID0gdGhpcy5pZGVudGlmeUlkcyh3aGF0LCB0cnVlKTtcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVJZHMoX2lkcyk7XG5cbiAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzLmxpbmtTdG9yYWdlRmllbGQ7XG5cbiAgICAgICAgLy8gdXBkYXRlIHRoZSBmaWVsZFxuICAgICAgICB0aGlzLm9iamVjdFtmaWVsZF0gPSBfLnVuaW9uKHRoaXMub2JqZWN0W2ZpZWxkXSwgX2lkcyk7XG5cbiAgICAgICAgLy8gdXBkYXRlIHRoZSBkYlxuICAgICAgICBsZXQgbW9kaWZpZXIgPSB7XG4gICAgICAgICAgICAkYWRkVG9TZXQ6IHtcbiAgICAgICAgICAgICAgICBbZmllbGRdOiB7JGVhY2g6IF9pZHN9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5saW5rZXIubWFpbkNvbGxlY3Rpb24udXBkYXRlKHRoaXMub2JqZWN0Ll9pZCwgbW9kaWZpZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB3aGF0XG4gICAgICovXG4gICAgcmVtb3ZlKHdoYXQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0dWFsQWN0aW9uKCdyZW1vdmUnLCB3aGF0KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYWxsb3dlZCcsICdBZGQvUmVtb3ZlIG9wZXJhdGlvbnMgc2hvdWxkIGJlIGRvbmUgZnJvbSB0aGUgb3duZXIgb2YgdGhlIHJlbGF0aW9uc2hpcCcpO1xuXG4gICAgICAgIHRoaXMuY2xlYW4oKTtcbiAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzLmxpbmtTdG9yYWdlRmllbGQ7XG5cbiAgICAgICAgY29uc3QgX2lkcyA9IHRoaXMuaWRlbnRpZnlJZHMod2hhdCk7XG5cbiAgICAgICAgLy8gdXBkYXRlIHRoZSBmaWVsZFxuICAgICAgICB0aGlzLm9iamVjdFtmaWVsZF0gPSBfLmZpbHRlcih0aGlzLm9iamVjdFtmaWVsZF0sIF9pZCA9PiAhXy5jb250YWlucyhfaWRzLCBfaWQpKTtcblxuICAgICAgICAvLyB1cGRhdGUgdGhlIGRiXG4gICAgICAgIGxldCBtb2RpZmllciA9IHtcbiAgICAgICAgICAgICRwdWxsQWxsOiB7XG4gICAgICAgICAgICAgICAgW2ZpZWxkXTogX2lkc1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubGlua2VyLm1haW5Db2xsZWN0aW9uLnVwZGF0ZSh0aGlzLm9iamVjdC5faWQsIG1vZGlmaWVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXQod2hhdCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ3NldCcsIHdoYXQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLWNvbW1hbmQnLCAnWW91IGFyZSB0cnlpbmcgdG8gKnNldCogaW4gYSByZWxhdGlvbnNoaXAgdGhhdCBpcyBzaW5nbGUuIFBsZWFzZSB1c2UgYWRkL3JlbW92ZSBmb3IgKm1hbnkqIHJlbGF0aW9uc2hpcHMnKTtcbiAgICB9XG5cbiAgICB1bnNldCh3aGF0KSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbigndW5zZXQnLCB3aGF0KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignaW52YWxpZC1jb21tYW5kJywgJ1lvdSBhcmUgdHJ5aW5nIHRvICp1bnNldCogaW4gYSByZWxhdGlvbnNoaXAgdGhhdCBpcyBzaW5nbGUuIFBsZWFzZSB1c2UgYWRkL3JlbW92ZSBmb3IgKm1hbnkqIHJlbGF0aW9uc2hpcHMnKTtcbiAgICB9XG59IiwiaW1wb3J0IExpbmsgZnJvbSAnLi9iYXNlLmpzJztcbmltcG9ydCBTbWFydEFyZ3MgZnJvbSAnLi9saWIvc21hcnRBcmd1bWVudHMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5rTWFueU1ldGEgZXh0ZW5kcyBMaW5rIHtcbiAgICBjbGVhbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9iamVjdFt0aGlzLmxpbmtTdG9yYWdlRmllbGRdKSB7XG4gICAgICAgICAgICB0aGlzLm9iamVjdFt0aGlzLmxpbmtTdG9yYWdlRmllbGRdID0gW107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gd2hhdFxuICAgICAqIEBwYXJhbSBtZXRhZGF0YVxuICAgICAqL1xuICAgIGFkZCh3aGF0LCBtZXRhZGF0YSA9IHt9KSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbignYWRkJywgd2hhdCwgbWV0YWRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBfaWRzID0gdGhpcy5pZGVudGlmeUlkcyh3aGF0LCB0cnVlKTtcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVJZHMoX2lkcyk7XG5cbiAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5saW5rU3RvcmFnZUZpZWxkO1xuXG4gICAgICAgIHRoaXMub2JqZWN0W2ZpZWxkXSA9IHRoaXMub2JqZWN0W2ZpZWxkXSB8fCBbXTtcbiAgICAgICAgbGV0IG1ldGFkYXRhcyA9IFtdO1xuXG4gICAgICAgIF8uZWFjaChfaWRzLCBfaWQgPT4ge1xuICAgICAgICAgICAgbGV0IGxvY2FsTWV0YWRhdGEgPSBfLmNsb25lKG1ldGFkYXRhKTtcbiAgICAgICAgICAgIGxvY2FsTWV0YWRhdGEuX2lkID0gX2lkO1xuXG4gICAgICAgICAgICB0aGlzLm9iamVjdFtmaWVsZF0ucHVzaChsb2NhbE1ldGFkYXRhKTtcbiAgICAgICAgICAgIG1ldGFkYXRhcy5wdXNoKGxvY2FsTWV0YWRhdGEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgbW9kaWZpZXIgPSB7XG4gICAgICAgICAgICAkYWRkVG9TZXQ6IHtcbiAgICAgICAgICAgICAgICBbZmllbGRdOiB7JGVhY2g6IG1ldGFkYXRhc31cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxpbmtlci5tYWluQ29sbGVjdGlvbi51cGRhdGUodGhpcy5vYmplY3QuX2lkLCBtb2RpZmllcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHdoYXRcbiAgICAgKiBAcGFyYW0gZXh0ZW5kTWV0YWRhdGFcbiAgICAgKi9cbiAgICBtZXRhZGF0YSh3aGF0LCBleHRlbmRNZXRhZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ21ldGFkYXRhJywgd2hhdCwgZXh0ZW5kTWV0YWRhdGEpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmaWVsZCA9IHRoaXMubGlua1N0b3JhZ2VGaWVsZDtcblxuICAgICAgICBpZiAod2hhdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vYmplY3RbZmllbGRdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8uaXNBcnJheSh3aGF0KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWFsbG93ZWQnLCAnTWV0YWRhdGEgdXBkYXRlcyBzaG91bGQgYmUgbWFkZSBmb3Igb25lIGVudGl0eSBvbmx5LCBub3QgbXVsdGlwbGUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IF9pZCA9IHRoaXMuaWRlbnRpZnlJZCh3aGF0KTtcblxuICAgICAgICBsZXQgZXhpc3RpbmdNZXRhZGF0YSA9IF8uZmluZCh0aGlzLm9iamVjdFtmaWVsZF0sIG1ldGFkYXRhID0+IG1ldGFkYXRhLl9pZCA9PSBfaWQpO1xuICAgICAgICBpZiAoZXh0ZW5kTWV0YWRhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nTWV0YWRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLmV4dGVuZChleGlzdGluZ01ldGFkYXRhLCBleHRlbmRNZXRhZGF0YSk7XG4gICAgICAgICAgICBsZXQgc3ViZmllbGQgPSBmaWVsZCArICcuX2lkJztcbiAgICAgICAgICAgIGxldCBzdWJmaWVsZFVwZGF0ZSA9IGZpZWxkICsgJy4kJztcblxuICAgICAgICAgICAgdGhpcy5saW5rZXIubWFpbkNvbGxlY3Rpb24udXBkYXRlKHtcbiAgICAgICAgICAgICAgICBfaWQ6IHRoaXMub2JqZWN0Ll9pZCxcbiAgICAgICAgICAgICAgICBbc3ViZmllbGRdOiBfaWRcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICBbc3ViZmllbGRVcGRhdGVdOiBleGlzdGluZ01ldGFkYXRhXG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJlbW92ZSh3aGF0KSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbigncmVtb3ZlJywgd2hhdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IF9pZHMgPSB0aGlzLmlkZW50aWZ5SWRzKHdoYXQpO1xuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmxpbmtTdG9yYWdlRmllbGQ7XG5cbiAgICAgICAgdGhpcy5vYmplY3RbZmllbGRdID0gXy5maWx0ZXIodGhpcy5vYmplY3RbZmllbGRdLCBsaW5rID0+ICFfLmNvbnRhaW5zKF9pZHMsIGxpbmsuX2lkKSk7XG5cbiAgICAgICAgbGV0IG1vZGlmaWVyID0ge1xuICAgICAgICAgICAgJHB1bGw6IHtcbiAgICAgICAgICAgICAgICBbZmllbGRdOiB7XG4gICAgICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGluOiBfaWRzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5saW5rZXIubWFpbkNvbGxlY3Rpb24udXBkYXRlKHRoaXMub2JqZWN0Ll9pZCwgbW9kaWZpZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldCh3aGF0LCBtZXRhZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ3NldCcsIHdoYXQsIG1ldGFkYXRhKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignaW52YWxpZC1jb21tYW5kJywgJ1lvdSBhcmUgdHJ5aW5nIHRvICpzZXQqIGluIGEgcmVsYXRpb25zaGlwIHRoYXQgaXMgc2luZ2xlLiBQbGVhc2UgdXNlIGFkZC9yZW1vdmUgZm9yICptYW55KiByZWxhdGlvbnNoaXBzJyk7XG4gICAgfVxuXG4gICAgdW5zZXQod2hhdCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ3Vuc2V0Jywgd2hhdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtY29tbWFuZCcsICdZb3UgYXJlIHRyeWluZyB0byAqdW5zZXQqIGluIGEgcmVsYXRpb25zaGlwIHRoYXQgaXMgc2luZ2xlLiBQbGVhc2UgdXNlIGFkZC9yZW1vdmUgZm9yICptYW55KiByZWxhdGlvbnNoaXBzJyk7XG4gICAgfVxufSIsImltcG9ydCBMaW5rIGZyb20gJy4vYmFzZS5qcyc7XG5pbXBvcnQgU21hcnRBcmdzIGZyb20gJy4vbGliL3NtYXJ0QXJndW1lbnRzLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGlua09uZSBleHRlbmRzIExpbmsge1xuICAgIHNldCh3aGF0KSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbignc2V0Jywgd2hhdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmaWVsZCA9IHRoaXMubGlua1N0b3JhZ2VGaWVsZDtcbiAgICAgICAgY29uc3QgX2lkID0gdGhpcy5pZGVudGlmeUlkKHdoYXQsIHRydWUpO1xuICAgICAgICB0aGlzLl92YWxpZGF0ZUlkcyhbX2lkXSk7XG5cbiAgICAgICAgdGhpcy5vYmplY3RbZmllbGRdID0gX2lkO1xuXG4gICAgICAgIHRoaXMubGlua2VyLm1haW5Db2xsZWN0aW9uLnVwZGF0ZSh0aGlzLm9iamVjdC5faWQsIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBbZmllbGRdOiBfaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdW5zZXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbigndW5zZXQnLCB3aGF0KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5saW5rU3RvcmFnZUZpZWxkO1xuICAgICAgICB0aGlzLm9iamVjdFtmaWVsZF0gPSBudWxsO1xuXG4gICAgICAgIHRoaXMubGlua2VyLm1haW5Db2xsZWN0aW9uLnVwZGF0ZSh0aGlzLm9iamVjdC5faWQsIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBbZmllbGRdOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGFkZCh3aGF0KSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbignYWRkJywgd2hhdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtY29tbWFuZCcsICdZb3UgYXJlIHRyeWluZyB0byAqYWRkKiBpbiBhIHJlbGF0aW9uc2hpcCB0aGF0IGlzIHNpbmdsZS4gUGxlYXNlIHVzZSBzZXQvdW5zZXQgZm9yICpzaW5nbGUqIHJlbGF0aW9uc2hpcHMnKTtcbiAgICB9XG5cbiAgICByZW1vdmUod2hhdCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ3JlbW92ZScsIHdoYXQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLWNvbW1hbmQnLCAnWW91IGFyZSB0cnlpbmcgdG8gKnJlbW92ZSogaW4gYSByZWxhdGlvbnNoaXAgdGhhdCBpcyBzaW5nbGUuIFBsZWFzZSB1c2Ugc2V0L3Vuc2V0IGZvciAqc2luZ2xlKiByZWxhdGlvbnNoaXBzJyk7XG4gICAgfVxufSIsImltcG9ydCBMaW5rIGZyb20gJy4vYmFzZS5qcyc7XG5pbXBvcnQgU21hcnRBcmdzIGZyb20gJy4vbGliL3NtYXJ0QXJndW1lbnRzLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGlua09uZU1ldGEgZXh0ZW5kcyBMaW5rIHtcbiAgICBzZXQod2hhdCwgbWV0YWRhdGEgPSB7fSkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ3NldCcsIHdoYXQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmxpbmtTdG9yYWdlRmllbGQ7XG4gICAgICAgIG1ldGFkYXRhLl9pZCA9IHRoaXMuaWRlbnRpZnlJZCh3aGF0LCB0cnVlKTtcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVJZHMoW21ldGFkYXRhLl9pZF0pO1xuXG4gICAgICAgIHRoaXMub2JqZWN0W2ZpZWxkXSA9IG1ldGFkYXRhO1xuXG4gICAgICAgIHRoaXMubGlua2VyLm1haW5Db2xsZWN0aW9uLnVwZGF0ZSh0aGlzLm9iamVjdC5faWQsIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBbZmllbGRdOiBtZXRhZGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBtZXRhZGF0YShleHRlbmRNZXRhZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ21ldGFkYXRhJywgdW5kZWZpbmVkLCBleHRlbmRNZXRhZGF0YSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5saW5rU3RvcmFnZUZpZWxkO1xuXG4gICAgICAgIGlmICghZXh0ZW5kTWV0YWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9iamVjdFtmaWVsZF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLmV4dGVuZCh0aGlzLm9iamVjdFtmaWVsZF0sIGV4dGVuZE1ldGFkYXRhKTtcblxuICAgICAgICAgICAgdGhpcy5saW5rZXIubWFpbkNvbGxlY3Rpb24udXBkYXRlKHRoaXMub2JqZWN0Ll9pZCwge1xuICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgW2ZpZWxkXTogdGhpcy5vYmplY3RbZmllbGRdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1bnNldCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0dWFsQWN0aW9uKCd1bnNldCcpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmxpbmtTdG9yYWdlRmllbGQ7XG4gICAgICAgIHRoaXMub2JqZWN0W2ZpZWxkXSA9IHt9O1xuXG4gICAgICAgIHRoaXMubGlua2VyLm1haW5Db2xsZWN0aW9uLnVwZGF0ZSh0aGlzLm9iamVjdC5faWQsIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBbZmllbGRdOiB7fVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhZGQod2hhdCwgbWV0YWRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0dWFsQWN0aW9uKCdhZGQnLCB3aGF0LCBtZXRhZGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtY29tbWFuZCcsICdZb3UgYXJlIHRyeWluZyB0byAqYWRkKiBpbiBhIHJlbGF0aW9uc2hpcCB0aGF0IGlzIHNpbmdsZS4gUGxlYXNlIHVzZSBzZXQvdW5zZXQgZm9yICpzaW5nbGUqIHJlbGF0aW9uc2hpcHMnKTtcbiAgICB9XG5cbiAgICByZW1vdmUod2hhdCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ3JlbW92ZScsIHdoYXQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLWNvbW1hbmQnLCAnWW91IGFyZSB0cnlpbmcgdG8gKnJlbW92ZSogaW4gYSByZWxhdGlvbnNoaXAgdGhhdCBpcyBzaW5nbGUuIFBsZWFzZSB1c2Ugc2V0L3Vuc2V0IGZvciAqc2luZ2xlKiByZWxhdGlvbnNoaXBzJyk7XG4gICAgfVxufSIsIi8qKlxuICogV2hlbiB5b3Ugd29yayB3aXRoIGFkZC9yZW1vdmUgc2V0L3Vuc2V0XG4gKiBZb3UgaGF2ZSB0aGUgYWJpbGl0eSB0byBwYXNzIHN0cmluZ3MsIGFycmF5IG9mIHN0cmluZ3MsIG9iamVjdHMsIGFycmF5IG9mIG9iamVjdHNcbiAqIElmIHlvdSBhcmUgYWRkaW5nIHNvbWV0aGluZyBhbmQgeW91IHdhbnQgdG8gc2F2ZSB0aGVtIGluIGRiLCB5b3UgY2FuIHBhc3Mgb2JqZWN0cyB3aXRob3V0IGlkcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgbmV3IGNsYXNzIHtcbiAgICBnZXRJZHMod2hhdCwgb3B0aW9ucykge1xuICAgICAgICBpZiAoXy5pc0FycmF5KHdoYXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5tYXAod2hhdCwgKHN1YldoYXQpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRJZChzdWJXaGF0LCBvcHRpb25zKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbdGhpcy5nZXRJZCh3aGF0LCBvcHRpb25zKV07XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLXR5cGUnLCBgVW5yZWNvZ25pemVkIHR5cGU6ICR7dHlwZW9mIHdoYXR9IGZvciBtYW5hZ2luZyBsaW5rc2ApO1xuICAgIH1cblxuICAgIGdldElkKHdoYXQsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB3aGF0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIHdoYXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHdoYXQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAoIXdoYXQuX2lkICYmIG9wdGlvbnMuc2F2ZVRvRGF0YWJhc2UpIHtcbiAgICAgICAgICAgICAgICB3aGF0Ll9pZCA9IG9wdGlvbnMuY29sbGVjdGlvbi5pbnNlcnQod2hhdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB3aGF0Ll9pZFxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBkZWVwQ2xvbmUgZnJvbSAnbG9kYXNoLmNsb25lZGVlcCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5hbWVkUXVlcnlCYXNlIHtcbiAgICBpc05hbWVkUXVlcnkgPSB0cnVlO1xuXG4gICAgY29uc3RydWN0b3IobmFtZSwgY29sbGVjdGlvbiwgYm9keSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMucXVlcnlOYW1lID0gbmFtZTtcblxuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGJvZHkpKSB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVyID0gYm9keTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYm9keSA9IGRlZXBDbG9uZShib2R5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlID0gbnVsbDtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBvcHRpb25zLnBhcmFtcyB8fCB7fTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uID0gY29sbGVjdGlvbjtcbiAgICAgICAgdGhpcy5pc0V4cG9zZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIGBuYW1lZF9xdWVyeV8ke3RoaXMucXVlcnlOYW1lfWA7XG4gICAgfVxuXG4gICAgZ2V0IGlzUmVzb2x2ZXIoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMucmVzb2x2ZXI7XG4gICAgfVxuXG4gICAgc2V0UGFyYW1zKHBhcmFtcykge1xuICAgICAgICB0aGlzLnBhcmFtcyA9IF8uZXh0ZW5kKHt9LCB0aGlzLnBhcmFtcywgcGFyYW1zKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWYWxpZGF0ZXMgdGhlIHBhcmFtZXRlcnNcbiAgICAgKi9cbiAgICBkb1ZhbGlkYXRlUGFyYW1zKHBhcmFtcykge1xuICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwgdGhpcy5wYXJhbXM7XG5cbiAgICAgICAgY29uc3Qge3ZhbGlkYXRlUGFyYW1zfSA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgaWYgKCF2YWxpZGF0ZVBhcmFtcykgcmV0dXJuO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLl92YWxpZGF0ZSh2YWxpZGF0ZVBhcmFtcywgcGFyYW1zKTtcbiAgICAgICAgfSBjYXRjaCAodmFsaWRhdGlvbkVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBJbnZhbGlkIHBhcmFtZXRlcnMgc3VwcGxpZWQgdG8gdGhlIHF1ZXJ5IFwiJHt0aGlzLnF1ZXJ5TmFtZX1cIlxcbmAsIHZhbGlkYXRpb25FcnJvcik7XG4gICAgICAgICAgICB0aHJvdyB2YWxpZGF0aW9uRXJyb3I7IC8vIHJldGhyb3dcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsb25lKG5ld1BhcmFtcykge1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBfLmV4dGVuZCh7fSwgZGVlcENsb25lKHRoaXMucGFyYW1zKSwgbmV3UGFyYW1zKTtcblxuICAgICAgICBsZXQgY2xvbmUgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHRoaXMucXVlcnlOYW1lLFxuICAgICAgICAgICAgdGhpcy5jb2xsZWN0aW9uLFxuICAgICAgICAgICAgdGhpcy5pc1Jlc29sdmVyID8gdGhpcy5yZXNvbHZlciA6IGRlZXBDbG9uZSh0aGlzLmJvZHkpLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC4uLnRoaXMub3B0aW9ucyxcbiAgICAgICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgY2xvbmUuY2FjaGVyID0gdGhpcy5jYWNoZXI7XG4gICAgICAgIGlmICh0aGlzLmV4cG9zZUNvbmZpZykge1xuICAgICAgICAgICAgY2xvbmUuZXhwb3NlQ29uZmlnID0gdGhpcy5leHBvc2VDb25maWc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2xvbmU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbnxvYmplY3R9IHZhbGlkYXRvclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF92YWxpZGF0ZSh2YWxpZGF0b3IsIHBhcmFtcykge1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbGlkYXRvcikpIHtcbiAgICAgICAgICAgIHZhbGlkYXRvci5jYWxsKG51bGwsIHBhcmFtcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrKHBhcmFtcywgdmFsaWRhdG9yKVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBDb3VudFN1YnNjcmlwdGlvbiBmcm9tICcuLi9xdWVyeS9jb3VudHMvY291bnRTdWJzY3JpcHRpb24nO1xuaW1wb3J0IGNyZWF0ZUdyYXBoIGZyb20gJy4uL3F1ZXJ5L2xpYi9jcmVhdGVHcmFwaC5qcyc7XG5pbXBvcnQgcmVjdXJzaXZlRmV0Y2ggZnJvbSAnLi4vcXVlcnkvbGliL3JlY3Vyc2l2ZUZldGNoLmpzJztcbmltcG9ydCBwcmVwYXJlRm9yUHJvY2VzcyBmcm9tICcuLi9xdWVyeS9saWIvcHJlcGFyZUZvclByb2Nlc3MuanMnO1xuaW1wb3J0IHtffSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5pbXBvcnQgY2FsbFdpdGhQcm9taXNlIGZyb20gJy4uL3F1ZXJ5L2xpYi9jYWxsV2l0aFByb21pc2UnO1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9uYW1lZFF1ZXJ5LmJhc2UnO1xuaW1wb3J0IHtMb2NhbENvbGxlY3Rpb259IGZyb20gJ21ldGVvci9taW5pbW9uZ28nO1xuaW1wb3J0IGludGVyc2VjdERlZXAgZnJvbSAnLi4vcXVlcnkvbGliL2ludGVyc2VjdERlZXAnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEJhc2Uge1xuICAgIC8qKlxuICAgICAqIFN1YnNjcmliZVxuICAgICAqXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAgICogQHJldHVybnMge251bGx8YW55fCp9XG4gICAgICovXG4gICAgc3Vic2NyaWJlKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0aGlzLmlzUmVzb2x2ZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hbGxvd2VkJywgYFlvdSBjYW5ub3Qgc3Vic2NyaWJlIHRvIGEgcmVzb2x2ZXIgcXVlcnlgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlID0gTWV0ZW9yLnN1YnNjcmliZShcbiAgICAgICAgICAgIHRoaXMubmFtZSxcbiAgICAgICAgICAgIHRoaXMucGFyYW1zLFxuICAgICAgICAgICAgY2FsbGJhY2tcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb25IYW5kbGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3Vic2NyaWJlIHRvIHRoZSBjb3VudHMgZm9yIHRoaXMgcXVlcnlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjYWxsYmFja1xuICAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgICovXG4gICAgc3Vic2NyaWJlQ291bnQoY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHRoaXMuaXNSZXNvbHZlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWFsbG93ZWQnLCBgWW91IGNhbm5vdCBzdWJzY3JpYmUgdG8gYSByZXNvbHZlciBxdWVyeWApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl9jb3VudGVyKSB7XG4gICAgICAgICAgICB0aGlzLl9jb3VudGVyID0gbmV3IENvdW50U3Vic2NyaXB0aW9uKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvdW50ZXIuc3Vic2NyaWJlKHRoaXMucGFyYW1zLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVW5zdWJzY3JpYmUgaWYgYW4gZXhpc3Rpbmcgc3Vic2NyaXB0aW9uIGV4aXN0c1xuICAgICAqL1xuICAgIHVuc3Vic2NyaWJlKCkge1xuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25IYW5kbGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlLnN0b3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVbnN1YnNjcmliZSB0byB0aGUgY291bnRzIGlmIGEgc3Vic2NyaXB0aW9uIGV4aXN0cy5cbiAgICAgKi9cbiAgICB1bnN1YnNjcmliZUNvdW50KCkge1xuICAgICAgICBpZiAodGhpcy5fY291bnRlcikge1xuICAgICAgICAgICAgdGhpcy5fY291bnRlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgdGhpcy5fY291bnRlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIGVsZW1lbnRzIGluIHN5bmMgdXNpbmcgcHJvbWlzZXNcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIGFzeW5jIGZldGNoU3luYygpIHtcbiAgICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdUaGlzIHF1ZXJ5IGlzIHJlYWN0aXZlLCBtZWFuaW5nIHlvdSBjYW5ub3QgdXNlIHByb21pc2VzIHRvIGZldGNoIHRoZSBkYXRhLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IGNhbGxXaXRoUHJvbWlzZSh0aGlzLm5hbWUsIHRoaXMucGFyYW1zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIG9uZSBlbGVtZW50IGluIHN5bmNcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIGFzeW5jIGZldGNoT25lU3luYygpIHtcbiAgICAgICAgcmV0dXJuIF8uZmlyc3QoYXdhaXQgdGhpcy5mZXRjaFN5bmMoKSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIGRhdGEuXG4gICAgICogQHBhcmFtIGNhbGxiYWNrT3JPcHRpb25zXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZmV0Y2goY2FsbGJhY2tPck9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZldGNoU3RhdGljKGNhbGxiYWNrT3JPcHRpb25zKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZldGNoUmVhY3RpdmUoY2FsbGJhY2tPck9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGFyZ3NcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBmZXRjaE9uZSguLi5hcmdzKSB7XG4gICAgICAgIGlmICghdGhpcy5zdWJzY3JpcHRpb25IYW5kbGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gYXJnc1swXTtcbiAgICAgICAgICAgIGlmICghXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ1lvdSBkaWQgbm90IHByb3ZpZGUgYSB2YWxpZCBjYWxsYmFjaycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmZldGNoKChlcnIsIHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzID8gXy5maXJzdChyZXMpIDogbnVsbCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF8uZmlyc3QodGhpcy5mZXRjaCguLi5hcmdzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjb3VudCBvZiBtYXRjaGluZyBlbGVtZW50cyBpbiBzeW5jLlxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgYXN5bmMgZ2V0Q291bnRTeW5jKCkge1xuICAgICAgICBpZiAodGhpcy5fY291bnRlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignVGhpcyBxdWVyeSBpcyByZWFjdGl2ZSwgbWVhbmluZyB5b3UgY2Fubm90IHVzZSBwcm9taXNlcyB0byBmZXRjaCB0aGUgZGF0YS4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhd2FpdCBjYWxsV2l0aFByb21pc2UodGhpcy5uYW1lICsgJy5jb3VudCcsIHRoaXMucGFyYW1zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjb3VudCBvZiBtYXRjaGluZyBlbGVtZW50cy5cbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIGdldENvdW50KGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0aGlzLl9jb3VudGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY291bnRlci5nZXRDb3VudCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hbGxvd2VkJywgJ1lvdSBhcmUgb24gY2xpZW50IHNvIHlvdSBtdXN0IGVpdGhlciBwcm92aWRlIGEgY2FsbGJhY2sgdG8gZ2V0IHRoZSBjb3VudCBvciBzdWJzY3JpYmUgZmlyc3QuJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBNZXRlb3IuY2FsbCh0aGlzLm5hbWUgKyAnLmNvdW50JywgdGhpcy5wYXJhbXMsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZldGNoaW5nIG5vbi1yZWFjdGl2ZSBxdWVyaWVzXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZmV0Y2hTdGF0aWMoY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWFsbG93ZWQnLCAnWW91IGFyZSBvbiBjbGllbnQgc28geW91IG11c3QgZWl0aGVyIHByb3ZpZGUgYSBjYWxsYmFjayB0byBnZXQgdGhlIGRhdGEgb3Igc3Vic2NyaWJlIGZpcnN0LicpO1xuICAgICAgICB9XG5cbiAgICAgICAgTWV0ZW9yLmNhbGwodGhpcy5uYW1lLCB0aGlzLnBhcmFtcywgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZldGNoaW5nIHdoZW4gd2UndmUgZ290IGFuIGFjdGl2ZSBwdWJsaWNhdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9mZXRjaFJlYWN0aXZlKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBsZXQgYm9keSA9IHRoaXMuYm9keTtcbiAgICAgICAgaWYgKHRoaXMucGFyYW1zLiRib2R5KSB7XG4gICAgICAgICAgICBib2R5ID0gaW50ZXJzZWN0RGVlcChib2R5LCB0aGlzLnBhcmFtcy4kYm9keSk7XG4gICAgICAgIH1cblxuICAgICAgICBib2R5ID0gcHJlcGFyZUZvclByb2Nlc3MoYm9keSwgdGhpcy5wYXJhbXMpO1xuICAgICAgICBpZiAoIW9wdGlvbnMuYWxsb3dTa2lwICYmIGJvZHkuJG9wdGlvbnMgJiYgYm9keS4kb3B0aW9ucy5za2lwKSB7XG4gICAgICAgICAgICBkZWxldGUgYm9keS4kb3B0aW9ucy5za2lwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlY3Vyc2l2ZUZldGNoKFxuICAgICAgICAgICAgY3JlYXRlR3JhcGgodGhpcy5jb2xsZWN0aW9uLCBib2R5KSxcbiAgICAgICAgICAgIHVuZGVmaW5lZCwge1xuICAgICAgICAgICAgICAgIHNjb3BlZDogdGhpcy5vcHRpb25zLnNjb3BlZCxcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb25IYW5kbGU6IHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlXG4gICAgICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgTmFtZWRRdWVyeUNsaWVudCBmcm9tICcuL25hbWVkUXVlcnkuY2xpZW50JztcbmltcG9ydCBOYW1lZFF1ZXJ5U2VydmVyIGZyb20gJy4vbmFtZWRRdWVyeS5zZXJ2ZXInO1xuXG5sZXQgTmFtZWRRdWVyeTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIE5hbWVkUXVlcnkgPSBOYW1lZFF1ZXJ5U2VydmVyO1xufSBlbHNlIHtcbiAgICBOYW1lZFF1ZXJ5ID0gTmFtZWRRdWVyeUNsaWVudDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTmFtZWRRdWVyeTsiLCJpbXBvcnQgcHJlcGFyZUZvclByb2Nlc3MgZnJvbSAnLi4vcXVlcnkvbGliL3ByZXBhcmVGb3JQcm9jZXNzLmpzJztcbmltcG9ydCBCYXNlIGZyb20gJy4vbmFtZWRRdWVyeS5iYXNlJztcbmltcG9ydCBkZWVwQ2xvbmUgZnJvbSAnbG9kYXNoLmNsb25lZGVlcCc7XG5pbXBvcnQgTWVtb3J5UmVzdWx0Q2FjaGVyIGZyb20gJy4vY2FjaGUvTWVtb3J5UmVzdWx0Q2FjaGVyJztcbmltcG9ydCBpbnRlcnNlY3REZWVwIGZyb20gJy4uL3F1ZXJ5L2xpYi9pbnRlcnNlY3REZWVwJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBCYXNlIHtcbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIGRhdGEuXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZmV0Y2goY29udGV4dCkge1xuICAgICAgICB0aGlzLl9wZXJmb3JtU2VjdXJpdHlDaGVja3MoY29udGV4dCwgdGhpcy5wYXJhbXMpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzUmVzb2x2ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mZXRjaFJlc29sdmVyRGF0YShjb250ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJvZHkgPSBkZWVwQ2xvbmUodGhpcy5ib2R5KTtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmFtcy4kYm9keSkge1xuICAgICAgICAgICAgICAgIGJvZHkgPSBpbnRlcnNlY3REZWVwKGJvZHksIHRoaXMucGFyYW1zLiRib2R5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gd2UgbXVzdCBhcHBseSBlbW9iZHltZW50IGhlcmVcbiAgICAgICAgICAgIHRoaXMuZG9FbWJvZGltZW50SWZJdEFwcGxpZXMoYm9keSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHF1ZXJ5ID0gdGhpcy5jb2xsZWN0aW9uLmNyZWF0ZVF1ZXJ5KFxuICAgICAgICAgICAgICAgIGRlZXBDbG9uZShib2R5KSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczogZGVlcENsb25lKHRoaXMucGFyYW1zKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmNhY2hlcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhY2hlSWQgPSB0aGlzLmNhY2hlci5nZW5lcmF0ZVF1ZXJ5SWQodGhpcy5xdWVyeU5hbWUsIHRoaXMucGFyYW1zKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jYWNoZXIuZmV0Y2goY2FjaGVJZCwge3F1ZXJ5fSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBxdWVyeS5mZXRjaCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGFyZ3NcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBmZXRjaE9uZSguLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiBfLmZpcnN0KHRoaXMuZmV0Y2goLi4uYXJncykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGNvdW50IG9mIG1hdGNoaW5nIGVsZW1lbnRzLlxuICAgICAqXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBnZXRDb3VudChjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuX3BlcmZvcm1TZWN1cml0eUNoZWNrcyhjb250ZXh0LCB0aGlzLnBhcmFtcyk7XG5cbiAgICAgICAgY29uc3QgY291bnRDdXJzb3IgPSB0aGlzLmdldEN1cnNvckZvckNvdW50aW5nKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuY2FjaGVyKSB7XG4gICAgICAgICAgICBjb25zdCBjYWNoZUlkID0gJ2NvdW50OjonICsgdGhpcy5jYWNoZXIuZ2VuZXJhdGVRdWVyeUlkKHRoaXMucXVlcnlOYW1lLCB0aGlzLnBhcmFtcyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhY2hlci5mZXRjaChjYWNoZUlkLCB7Y291bnRDdXJzb3J9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3VudEN1cnNvci5jb3VudCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGN1cnNvciBmb3IgY291bnRpbmdcbiAgICAgKiBUaGlzIGlzIG1vc3QgbGlrZWx5IHVzZWQgZm9yIGNvdW50cyBjdXJzb3JcbiAgICAgKi9cbiAgICBnZXRDdXJzb3JGb3JDb3VudGluZygpIHtcbiAgICAgICAgbGV0IGJvZHkgPSBkZWVwQ2xvbmUodGhpcy5ib2R5KTtcbiAgICAgICAgdGhpcy5kb0VtYm9kaW1lbnRJZkl0QXBwbGllcyhib2R5KTtcbiAgICAgICAgYm9keSA9IHByZXBhcmVGb3JQcm9jZXNzKGJvZHksIHRoaXMucGFyYW1zKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmZpbmQoYm9keS4kZmlsdGVycyB8fCB7fSwge2ZpZWxkczoge19pZDogMX19KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gY2FjaGVyXG4gICAgICovXG4gICAgY2FjaGVSZXN1bHRzKGNhY2hlcikge1xuICAgICAgICBpZiAoIWNhY2hlcikge1xuICAgICAgICAgICAgY2FjaGVyID0gbmV3IE1lbW9yeVJlc3VsdENhY2hlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWNoZXIgPSBjYWNoZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29uZmlndXJlIHJlc29sdmUuIFRoaXMgZG9lc24ndCBhY3R1YWxseSBjYWxsIHRoZSByZXNvbHZlciwgaXQganVzdCBzZXRzIGl0XG4gICAgICogQHBhcmFtIGZuXG4gICAgICovXG4gICAgcmVzb2x2ZShmbikge1xuICAgICAgICBpZiAoIXRoaXMuaXNSZXNvbHZlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignaW52YWxpZC1jYWxsJywgYFlvdSBjYW5ub3QgdXNlIHJlc29sdmUoKSBvbiBhIG5vbiByZXNvbHZlciBOYW1lZFF1ZXJ5YCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlc29sdmVyID0gZm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZmV0Y2hSZXNvbHZlckRhdGEoY29udGV4dCkge1xuICAgICAgICBjb25zdCByZXNvbHZlciA9IHRoaXMucmVzb2x2ZXI7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zdCBxdWVyeSA9IHtcbiAgICAgICAgICAgIGZldGNoKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlci5jYWxsKGNvbnRleHQsIHNlbGYucGFyYW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodGhpcy5jYWNoZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlSWQgPSB0aGlzLmNhY2hlci5nZW5lcmF0ZVF1ZXJ5SWQodGhpcy5xdWVyeU5hbWUsIHRoaXMucGFyYW1zKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhY2hlci5mZXRjaChjYWNoZUlkLCB7cXVlcnl9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBxdWVyeS5mZXRjaCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBjb250ZXh0IE1ldGVvciBtZXRob2QvcHVibGlzaCBjb250ZXh0XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfcGVyZm9ybVNlY3VyaXR5Q2hlY2tzKGNvbnRleHQsIHBhcmFtcykge1xuICAgICAgICBpZiAoY29udGV4dCAmJiB0aGlzLmV4cG9zZUNvbmZpZykge1xuICAgICAgICAgICAgdGhpcy5fY2FsbEZpcmV3YWxsKGNvbnRleHQsIGNvbnRleHQudXNlcklkLCBwYXJhbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kb1ZhbGlkYXRlUGFyYW1zKHBhcmFtcyk7XG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0IG5ldyBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuc3RvcmFnZSA9IHt9O1xuICAgIH1cblxuICAgIGFkZChrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLnN0b3JhZ2Vba2V5XSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignaW52YWxpZC1uYW1lJywgYFlvdSBoYXZlIHByZXZpb3VzbHkgZGVmaW5lZCBhbm90aGVyIG5hbWVkUXVlcnkgd2l0aCB0aGUgc2FtZSBuYW1lOiBcIiR7a2V5fVwiLiBOYW1lZCBRdWVyeSBuYW1lcyBzaG91bGQgYmUgdW5pcXVlLmApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdG9yYWdlW2tleV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQoa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2Vba2V5XTtcbiAgICB9XG5cbiAgICBnZXRBbGwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2U7XG4gICAgfVxufSIsImltcG9ydCB7RUpTT059IGZyb20gJ21ldGVvci9lanNvbic7XG5cbi8qKlxuICogVGhpcyBpcyBhIHZlcnkgYmFzaWMgaW4tbWVtb3J5IHJlc3VsdCBjYWNoaW5nIGZ1bmN0aW9uYWxpdHlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZVJlc3VsdENhY2hlciB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnID0ge30pIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHF1ZXJ5TmFtZVxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdlbmVyYXRlUXVlcnlJZChxdWVyeU5hbWUsIHBhcmFtcykge1xuICAgICAgICByZXR1cm4gYCR7cXVlcnlOYW1lfTo6JHtFSlNPTi5zdHJpbmdpZnkocGFyYW1zKX1gO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIER1bW15IGZ1bmN0aW9uXG4gICAgICovXG4gICAgZmV0Y2goY2FjaGVJZCwge3F1ZXJ5LCBjb3VudEN1cnNvcn0pIHtcbiAgICAgICAgdGhyb3cgJ05vdCBpbXBsZW1lbnRlZCc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHF1ZXJ5XG4gICAgICogQHBhcmFtIGNvdW50Q3Vyc29yXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgc3RhdGljIGZldGNoRGF0YSh7cXVlcnksIGNvdW50Q3Vyc29yfSkge1xuICAgICAgICBpZiAocXVlcnkpIHtcbiAgICAgICAgICAgIHJldHVybiBxdWVyeS5mZXRjaCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGNvdW50Q3Vyc29yLmNvdW50KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQge01ldGVvcn0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgY2xvbmVEZWVwIGZyb20gJ2xvZGFzaC5jbG9uZWRlZXAnO1xuaW1wb3J0IEJhc2VSZXN1bHRDYWNoZXIgZnJvbSAnLi9CYXNlUmVzdWx0Q2FjaGVyJztcblxuY29uc3QgREVGQVVMVF9UVEwgPSA2MDAwMDtcblxuLyoqXG4gKiBUaGlzIGlzIGEgdmVyeSBiYXNpYyBpbi1tZW1vcnkgcmVzdWx0IGNhY2hpbmcgZnVuY3Rpb25hbGl0eVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZW1vcnlSZXN1bHRDYWNoZXIgZXh0ZW5kcyBCYXNlUmVzdWx0Q2FjaGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcgPSB7fSkge1xuICAgICAgICBzdXBlcihjb25maWcpO1xuICAgICAgICB0aGlzLnN0b3JlID0ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGNhY2hlSWRcbiAgICAgKiBAcGFyYW0gcXVlcnlcbiAgICAgKiBAcGFyYW0gY291bnRDdXJzb3JcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBmZXRjaChjYWNoZUlkLCB7cXVlcnksIGNvdW50Q3Vyc29yfSkge1xuICAgICAgICBjb25zdCBjYWNoZURhdGEgPSB0aGlzLnN0b3JlW2NhY2hlSWRdO1xuICAgICAgICBpZiAoY2FjaGVEYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBjbG9uZURlZXAoY2FjaGVEYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRhdGEgPSBCYXNlUmVzdWx0Q2FjaGVyLmZldGNoRGF0YSh7cXVlcnksIGNvdW50Q3Vyc29yfSk7XG4gICAgICAgIHRoaXMuc3RvcmVEYXRhKGNhY2hlSWQsIGRhdGEpO1xuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGNhY2hlSWRcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqL1xuICAgIHN0b3JlRGF0YShjYWNoZUlkLCBkYXRhKSB7XG4gICAgICAgIGNvbnN0IHR0bCA9IHRoaXMuY29uZmlnLnR0bCB8fCBERUZBVUxUX1RUTDtcbiAgICAgICAgdGhpcy5zdG9yZVtjYWNoZUlkXSA9IGNsb25lRGVlcChkYXRhKTtcblxuICAgICAgICBNZXRlb3Iuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5zdG9yZVtjYWNoZUlkXTtcbiAgICAgICAgfSwgdHRsKVxuICAgIH1cbn1cbiIsImltcG9ydCBOYW1lZFF1ZXJ5IGZyb20gJy4uL25hbWVkUXVlcnkuanMnO1xuaW1wb3J0IHsgRXhwb3NlU2NoZW1hLCBFeHBvc2VEZWZhdWx0cyB9IGZyb20gJy4vc2NoZW1hLmpzJztcbmltcG9ydCBtZXJnZURlZXAgZnJvbSAnLi9saWIvbWVyZ2VEZWVwLmpzJztcbmltcG9ydCBjcmVhdGVHcmFwaCBmcm9tICcuLi8uLi9xdWVyeS9saWIvY3JlYXRlR3JhcGguanMnO1xuaW1wb3J0IHJlY3Vyc2l2ZUNvbXBvc2UgZnJvbSAnLi4vLi4vcXVlcnkvbGliL3JlY3Vyc2l2ZUNvbXBvc2UuanMnO1xuaW1wb3J0IHByZXBhcmVGb3JQcm9jZXNzIGZyb20gJy4uLy4uL3F1ZXJ5L2xpYi9wcmVwYXJlRm9yUHJvY2Vzcy5qcyc7XG5pbXBvcnQgZGVlcENsb25lIGZyb20gJ2xvZGFzaC5jbG9uZWRlZXAnO1xuaW1wb3J0IGludGVyc2VjdERlZXAgZnJvbSAnLi4vLi4vcXVlcnkvbGliL2ludGVyc2VjdERlZXAnO1xuaW1wb3J0IGdlbkNvdW50RW5kcG9pbnQgZnJvbSAnLi4vLi4vcXVlcnkvY291bnRzL2dlbkVuZHBvaW50LnNlcnZlcic7XG5pbXBvcnQgeyBjaGVjayB9IGZyb20gJ21ldGVvci9jaGVjayc7XG5cbl8uZXh0ZW5kKE5hbWVkUXVlcnkucHJvdG90eXBlLCB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIGNvbmZpZ1xuICAgICAqL1xuICAgIGV4cG9zZShjb25maWcgPSB7fSkge1xuICAgICAgICBpZiAoIU1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAgICAgICAnaW52YWxpZC1lbnZpcm9ubWVudCcsXG4gICAgICAgICAgICAgICAgYFlvdSBtdXN0IHJ1biB0aGlzIGluIHNlcnZlci1zaWRlIGNvZGVgXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNFeHBvc2VkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICdxdWVyeS1hbHJlYWR5LWV4cG9zZWQnLFxuICAgICAgICAgICAgICAgIGBZb3UgaGF2ZSBhbHJlYWR5IGV4cG9zZWQ6IFwiJHt0aGlzLm5hbWV9XCIgbmFtZWQgcXVlcnlgXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5leHBvc2VDb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBFeHBvc2VEZWZhdWx0cywgY29uZmlnKTtcbiAgICAgICAgY2hlY2sodGhpcy5leHBvc2VDb25maWcsIEV4cG9zZVNjaGVtYSk7XG5cbiAgICAgICAgaWYgKHRoaXMuZXhwb3NlQ29uZmlnLnZhbGlkYXRlUGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMudmFsaWRhdGVQYXJhbXMgPSB0aGlzLmV4cG9zZUNvbmZpZy52YWxpZGF0ZVBhcmFtcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5pc1Jlc29sdmVyKSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0Tm9ybWFsUXVlcnkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRNZXRob2QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaXNFeHBvc2VkID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgYSBub3JtYWwgTmFtZWRRdWVyeSAobm9ybWFsID09IG5vdCBhIHJlc29sdmVyKVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2luaXROb3JtYWxRdWVyeSgpIHtcbiAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5leHBvc2VDb25maWc7XG4gICAgICAgIGlmIChjb25maWcubWV0aG9kKSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0TWV0aG9kKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnLnB1YmxpY2F0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0UHVibGljYXRpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY29uZmlnLm1ldGhvZCAmJiAhY29uZmlnLnB1YmxpY2F0aW9uKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICd3ZWlyZCcsXG4gICAgICAgICAgICAgICAgJ0lmIHlvdSB3YW50IHRvIGV4cG9zZSB5b3VyIG5hbWVkIHF1ZXJ5IHlvdSBuZWVkIHRvIHNwZWNpZnkgYXQgbGVhc3Qgb25lIG9mIFtcIm1ldGhvZFwiLCBcInB1YmxpY2F0aW9uXCJdIG9wdGlvbnMgdG8gdHJ1ZSdcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9pbml0Q291bnRNZXRob2QoKTtcbiAgICAgICAgdGhpcy5faW5pdENvdW50UHVibGljYXRpb24oKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZW1ib2RpZWQgYm9keSBvZiB0aGUgcmVxdWVzdFxuICAgICAqIEBwYXJhbSB7Kn0gX2VtYm9keVxuICAgICAqIEBwYXJhbSB7Kn0gYm9keVxuICAgICAqL1xuICAgIGRvRW1ib2RpbWVudElmSXRBcHBsaWVzKGJvZHkpIHtcbiAgICAgICAgLy8gcXVlcnkgaXMgbm90IGV4cG9zZWQgeWV0LCBzbyBpdCBkb2Vzbid0IGhhdmUgZW1ib2RpbWVudCBsb2dpY1xuICAgICAgICBpZiAoIXRoaXMuZXhwb3NlQ29uZmlnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7IGVtYm9keSB9ID0gdGhpcy5leHBvc2VDb25maWc7XG5cbiAgICAgICAgaWYgKCFlbWJvZHkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZW1ib2R5KSkge1xuICAgICAgICAgICAgZW1ib2R5LmNhbGwodGhpcywgYm9keSwgdGhpcy5wYXJhbXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWVyZ2VEZWVwKGJvZHksIGVtYm9keSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaW5pdE1ldGhvZCgpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIE1ldGVvci5tZXRob2RzKHtcbiAgICAgICAgICAgIFt0aGlzLm5hbWVdKG5ld1BhcmFtcykge1xuICAgICAgICAgICAgICAgIHNlbGYuX3VuYmxvY2tJZk5lY2Vzc2FyeSh0aGlzKTtcblxuICAgICAgICAgICAgICAgIC8vIHNlY3VyaXR5IGlzIGRvbmUgaW4gdGhlIGZldGNoaW5nIGJlY2F1c2Ugd2UgcHJvdmlkZSBhIGNvbnRleHRcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jbG9uZShuZXdQYXJhbXMpLmZldGNoKHRoaXMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2luaXRDb3VudE1ldGhvZCgpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgICAgICAgICAgW3RoaXMubmFtZSArICcuY291bnQnXShuZXdQYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl91bmJsb2NrSWZOZWNlc3NhcnkodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAvLyBzZWN1cml0eSBpcyBkb25lIGluIHRoZSBmZXRjaGluZyBiZWNhdXNlIHdlIHByb3ZpZGUgYSBjb250ZXh0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY2xvbmUobmV3UGFyYW1zKS5nZXRDb3VudCh0aGlzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pbml0Q291bnRQdWJsaWNhdGlvbigpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgZ2VuQ291bnRFbmRwb2ludChzZWxmLm5hbWUsIHtcbiAgICAgICAgICAgIGdldEN1cnNvcih7IHNlc3Npb24gfSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHF1ZXJ5ID0gc2VsZi5jbG9uZShzZXNzaW9uLnBhcmFtcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5LmdldEN1cnNvckZvckNvdW50aW5nKCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXRTZXNzaW9uKHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHNlbGYuZG9WYWxpZGF0ZVBhcmFtcyhwYXJhbXMpO1xuICAgICAgICAgICAgICAgIHNlbGYuX2NhbGxGaXJld2FsbCh0aGlzLCB0aGlzLnVzZXJJZCwgcGFyYW1zKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHNlbGYubmFtZSwgcGFyYW1zLCB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2luaXRQdWJsaWNhdGlvbigpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUodGhpcy5uYW1lLCBmdW5jdGlvbihwYXJhbXMgPSB7fSkge1xuICAgICAgICAgICAgY29uc3QgaXNTY29wZWQgPSAhIXNlbGYub3B0aW9ucy5zY29wZWQ7XG5cbiAgICAgICAgICAgIGlmIChpc1Njb3BlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlU2NvcGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5fdW5ibG9ja0lmTmVjZXNzYXJ5KHRoaXMpO1xuICAgICAgICAgICAgc2VsZi5kb1ZhbGlkYXRlUGFyYW1zKHBhcmFtcyk7XG4gICAgICAgICAgICBzZWxmLl9jYWxsRmlyZXdhbGwodGhpcywgdGhpcy51c2VySWQsIHBhcmFtcyk7XG5cbiAgICAgICAgICAgIGxldCBib2R5ID0gZGVlcENsb25lKHNlbGYuYm9keSk7XG4gICAgICAgICAgICBpZiAocGFyYW1zLiRib2R5KSB7XG4gICAgICAgICAgICAgICAgYm9keSA9IGludGVyc2VjdERlZXAoYm9keSwgcGFyYW1zLiRib2R5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5kb0VtYm9kaW1lbnRJZkl0QXBwbGllcyhib2R5KTtcbiAgICAgICAgICAgIGJvZHkgPSBwcmVwYXJlRm9yUHJvY2Vzcyhib2R5LCBwYXJhbXMpO1xuXG4gICAgICAgICAgICBjb25zdCByb290Tm9kZSA9IGNyZWF0ZUdyYXBoKHNlbGYuY29sbGVjdGlvbiwgYm9keSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZWN1cnNpdmVDb21wb3NlKHJvb3ROb2RlLCB1bmRlZmluZWQsIHtzY29wZWQ6IGlzU2NvcGVkfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gY29udGV4dFxuICAgICAqIEBwYXJhbSB1c2VySWRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfY2FsbEZpcmV3YWxsKGNvbnRleHQsIHVzZXJJZCwgcGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IHsgZmlyZXdhbGwgfSA9IHRoaXMuZXhwb3NlQ29uZmlnO1xuICAgICAgICBpZiAoIWZpcmV3YWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5pc0FycmF5KGZpcmV3YWxsKSkge1xuICAgICAgICAgICAgZmlyZXdhbGwuZm9yRWFjaChmaXJlID0+IHtcbiAgICAgICAgICAgICAgICBmaXJlLmNhbGwoY29udGV4dCwgdXNlcklkLCBwYXJhbXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaXJld2FsbC5jYWxsKGNvbnRleHQsIHVzZXJJZCwgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gY29udGV4dFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3VuYmxvY2tJZk5lY2Vzc2FyeShjb250ZXh0KSB7XG4gICAgICAgIGlmICh0aGlzLmV4cG9zZUNvbmZpZy51bmJsb2NrKSB7XG4gICAgICAgICAgICBpZiAoY29udGV4dC51bmJsb2NrKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC51bmJsb2NrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG4iLCJpbXBvcnQge01hdGNofSBmcm9tICdtZXRlb3IvY2hlY2snO1xuXG5leHBvcnQgY29uc3QgRXhwb3NlRGVmYXVsdHMgPSB7XG4gICAgcHVibGljYXRpb246IHRydWUsXG4gICAgbWV0aG9kOiB0cnVlLFxuICAgIHVuYmxvY2s6IHRydWUsXG59O1xuXG5leHBvcnQgY29uc3QgRXhwb3NlU2NoZW1hID0ge1xuICAgIGZpcmV3YWxsOiBNYXRjaC5NYXliZShcbiAgICAgICAgTWF0Y2guT25lT2YoRnVuY3Rpb24sIFtGdW5jdGlvbl0pXG4gICAgKSxcbiAgICBwdWJsaWNhdGlvbjogTWF0Y2guTWF5YmUoQm9vbGVhbiksXG4gICAgdW5ibG9jazogTWF0Y2guTWF5YmUoQm9vbGVhbiksXG4gICAgbWV0aG9kOiBNYXRjaC5NYXliZShCb29sZWFuKSxcbiAgICBlbWJvZHk6IE1hdGNoLk1heWJlKFxuICAgICAgICBNYXRjaC5PbmVPZihPYmplY3QsIEZ1bmN0aW9uKVxuICAgICksXG4gICAgdmFsaWRhdGVQYXJhbXM6IE1hdGNoLk1heWJlKFxuICAgICAgICBNYXRjaC5PbmVPZihPYmplY3QsIEZ1bmN0aW9uKVxuICAgIClcbn07XG4iLCIvKipcbiAqIERlZXAgbWVyZ2UgdHdvIG9iamVjdHMuXG4gKiBAcGFyYW0gdGFyZ2V0XG4gKiBAcGFyYW0gc291cmNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1lcmdlRGVlcCh0YXJnZXQsIHNvdXJjZSkge1xuICAgIGlmIChfLmlzT2JqZWN0KHRhcmdldCkgJiYgXy5pc09iamVjdChzb3VyY2UpKSB7XG4gICAgICAgIF8uZWFjaChzb3VyY2UsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHNvdXJjZVtrZXldKSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3Qoc291cmNlW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0YXJnZXRba2V5XSkgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHsgW2tleV06IHt9IH0pO1xuICAgICAgICAgICAgICAgIG1lcmdlRGVlcCh0YXJnZXRba2V5XSwgc291cmNlW2tleV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHRhcmdldCwgeyBba2V5XTogc291cmNlW2tleV0gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQ7XG59IiwiaW1wb3J0IGRlZXBDbG9uZSBmcm9tICdsb2Rhc2guY2xvbmVkZWVwJztcbmltcG9ydCB7Y2hlY2t9IGZyb20gJ21ldGVvci9jaGVjayc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1ZXJ5QmFzZSB7XG4gICAgaXNHbG9iYWxRdWVyeSA9IHRydWU7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb2xsZWN0aW9uLCBib2R5LCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uID0gY29sbGVjdGlvbjtcblxuICAgICAgICB0aGlzLmJvZHkgPSBkZWVwQ2xvbmUoYm9keSk7XG5cbiAgICAgICAgdGhpcy5wYXJhbXMgPSBvcHRpb25zLnBhcmFtcyB8fCB7fTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB9XG5cbiAgICBjbG9uZShuZXdQYXJhbXMpIHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gXy5leHRlbmQoe30sIGRlZXBDbG9uZSh0aGlzLnBhcmFtcyksIG5ld1BhcmFtcyk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKFxuICAgICAgICAgICAgdGhpcy5jb2xsZWN0aW9uLFxuICAgICAgICAgICAgZGVlcENsb25lKHRoaXMuYm9keSksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgICAgIC4uLnRoaXMub3B0aW9uc1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCkge1xuICAgICAgICByZXR1cm4gYGV4cG9zdXJlXyR7dGhpcy5jb2xsZWN0aW9uLl9uYW1lfWA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGVzIHRoZSBwYXJhbWV0ZXJzXG4gICAgICovXG4gICAgZG9WYWxpZGF0ZVBhcmFtcygpIHtcbiAgICAgICAgY29uc3Qge3ZhbGlkYXRlUGFyYW1zfSA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgaWYgKCF2YWxpZGF0ZVBhcmFtcykgcmV0dXJuO1xuXG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24odmFsaWRhdGVQYXJhbXMpKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZVBhcmFtcy5jYWxsKG51bGwsIHRoaXMucGFyYW1zKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hlY2sodGhpcy5wYXJhbXMpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNZXJnZXMgdGhlIHBhcmFtcyB3aXRoIHByZXZpb3VzIHBhcmFtcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKiBAcmV0dXJucyB7UXVlcnl9XG4gICAgICovXG4gICAgc2V0UGFyYW1zKHBhcmFtcykge1xuICAgICAgICB0aGlzLnBhcmFtcyA9IF8uZXh0ZW5kKHt9LCB0aGlzLnBhcmFtcywgcGFyYW1zKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59IiwiaW1wb3J0IHsgXyB9IGZyb20gJ21ldGVvci91bmRlcnNjb3JlJztcbmltcG9ydCBDb3VudFN1YnNjcmlwdGlvbiBmcm9tICcuL2NvdW50cy9jb3VudFN1YnNjcmlwdGlvbic7XG5pbXBvcnQgY3JlYXRlR3JhcGggZnJvbSAnLi9saWIvY3JlYXRlR3JhcGguanMnO1xuaW1wb3J0IHJlY3Vyc2l2ZUZldGNoIGZyb20gJy4vbGliL3JlY3Vyc2l2ZUZldGNoLmpzJztcbmltcG9ydCBwcmVwYXJlRm9yUHJvY2VzcyBmcm9tICcuL2xpYi9wcmVwYXJlRm9yUHJvY2Vzcy5qcyc7XG5pbXBvcnQgY2FsbFdpdGhQcm9taXNlIGZyb20gJy4vbGliL2NhbGxXaXRoUHJvbWlzZSc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL3F1ZXJ5LmJhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWVyeSBleHRlbmRzIEJhc2Uge1xuICAgIC8qKlxuICAgICAqIFN1YnNjcmliZVxuICAgICAqXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIHtGdW5jdGlvbn0gb3B0aW9uYWxcbiAgICAgKiBAcmV0dXJucyB7bnVsbHxhbnl8Kn1cbiAgICAgKi9cbiAgICBzdWJzY3JpYmUoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5kb1ZhbGlkYXRlUGFyYW1zKCk7XG5cbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25IYW5kbGUgPSBNZXRlb3Iuc3Vic2NyaWJlKFxuICAgICAgICAgICAgdGhpcy5uYW1lLFxuICAgICAgICAgICAgcHJlcGFyZUZvclByb2Nlc3ModGhpcy5ib2R5LCB0aGlzLnBhcmFtcyksXG4gICAgICAgICAgICBjYWxsYmFja1xuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdWJzY3JpYmUgdG8gdGhlIGNvdW50cyBmb3IgdGhpcyBxdWVyeVxuICAgICAqXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAgICogQHJldHVybnMge09iamVjdH1cbiAgICAgKi9cbiAgICBzdWJzY3JpYmVDb3VudChjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmRvVmFsaWRhdGVQYXJhbXMoKTtcblxuICAgICAgICBpZiAoIXRoaXMuX2NvdW50ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvdW50ZXIgPSBuZXcgQ291bnRTdWJzY3JpcHRpb24odGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fY291bnRlci5zdWJzY3JpYmUoXG4gICAgICAgICAgICBwcmVwYXJlRm9yUHJvY2Vzcyh0aGlzLmJvZHksIHRoaXMucGFyYW1zKSxcbiAgICAgICAgICAgIGNhbGxiYWNrXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVW5zdWJzY3JpYmUgaWYgYW4gZXhpc3Rpbmcgc3Vic2NyaXB0aW9uIGV4aXN0c1xuICAgICAqL1xuICAgIHVuc3Vic2NyaWJlKCkge1xuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25IYW5kbGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlLnN0b3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVbnN1YnNjcmliZSB0byB0aGUgY291bnRzIGlmIGEgc3Vic2NyaXB0aW9uIGV4aXN0cy5cbiAgICAgKi9cbiAgICB1bnN1YnNjcmliZUNvdW50KCkge1xuICAgICAgICBpZiAodGhpcy5fY291bnRlcikge1xuICAgICAgICAgICAgdGhpcy5fY291bnRlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgdGhpcy5fY291bnRlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIGVsZW1lbnRzIGluIHN5bmMgdXNpbmcgcHJvbWlzZXNcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIGFzeW5jIGZldGNoU3luYygpIHtcbiAgICAgICAgdGhpcy5kb1ZhbGlkYXRlUGFyYW1zKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdUaGlzIHF1ZXJ5IGlzIHJlYWN0aXZlLCBtZWFuaW5nIHlvdSBjYW5ub3QgdXNlIHByb21pc2VzIHRvIGZldGNoIHRoZSBkYXRhLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IGNhbGxXaXRoUHJvbWlzZSh0aGlzLm5hbWUsIHByZXBhcmVGb3JQcm9jZXNzKHRoaXMuYm9keSwgdGhpcy5wYXJhbXMpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIG9uZSBlbGVtZW50IGluIHN5bmNcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIGFzeW5jIGZldGNoT25lU3luYygpIHtcbiAgICAgICAgcmV0dXJuIF8uZmlyc3QoYXdhaXQgdGhpcy5mZXRjaFN5bmMoKSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIGRhdGEuXG4gICAgICogQHBhcmFtIGNhbGxiYWNrT3JPcHRpb25zXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZmV0Y2goY2FsbGJhY2tPck9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5kb1ZhbGlkYXRlUGFyYW1zKCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZldGNoU3RhdGljKGNhbGxiYWNrT3JPcHRpb25zKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZldGNoUmVhY3RpdmUoY2FsbGJhY2tPck9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGFyZ3NcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBmZXRjaE9uZSguLi5hcmdzKSB7XG4gICAgICAgIGlmICghdGhpcy5zdWJzY3JpcHRpb25IYW5kbGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gYXJnc1swXTtcbiAgICAgICAgICAgIGlmICghXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ1lvdSBkaWQgbm90IHByb3ZpZGUgYSB2YWxpZCBjYWxsYmFjaycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmZldGNoKChlcnIsIHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzID8gXy5maXJzdChyZXMpIDogbnVsbCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF8uZmlyc3QodGhpcy5mZXRjaCguLi5hcmdzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjb3VudCBvZiBtYXRjaGluZyBlbGVtZW50cyBpbiBzeW5jLlxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgYXN5bmMgZ2V0Q291bnRTeW5jKCkge1xuICAgICAgICBpZiAodGhpcy5fY291bnRlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignVGhpcyBxdWVyeSBpcyByZWFjdGl2ZSwgbWVhbmluZyB5b3UgY2Fubm90IHVzZSBwcm9taXNlcyB0byBmZXRjaCB0aGUgZGF0YS4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhd2FpdCBjYWxsV2l0aFByb21pc2UodGhpcy5uYW1lICsgJy5jb3VudCcsIHByZXBhcmVGb3JQcm9jZXNzKHRoaXMuYm9keSwgdGhpcy5wYXJhbXMpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjb3VudCBvZiBtYXRjaGluZyBlbGVtZW50cy5cbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIGdldENvdW50KGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0aGlzLl9jb3VudGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY291bnRlci5nZXRDb3VudCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hbGxvd2VkJywgJ1lvdSBhcmUgb24gY2xpZW50IHNvIHlvdSBtdXN0IGVpdGhlciBwcm92aWRlIGEgY2FsbGJhY2sgdG8gZ2V0IHRoZSBjb3VudCBvciBzdWJzY3JpYmUgZmlyc3QuJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBNZXRlb3IuY2FsbChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uYW1lICsgJy5jb3VudCcsXG4gICAgICAgICAgICAgICAgICAgIHByZXBhcmVGb3JQcm9jZXNzKHRoaXMuYm9keSwgdGhpcy5wYXJhbXMpLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGluZyBub24tcmVhY3RpdmUgcXVlcmllc1xuICAgICAqIEBwYXJhbSBjYWxsYmFja1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2ZldGNoU3RhdGljKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hbGxvd2VkJywgJ1lvdSBhcmUgb24gY2xpZW50IHNvIHlvdSBtdXN0IGVpdGhlciBwcm92aWRlIGEgY2FsbGJhY2sgdG8gZ2V0IHRoZSBkYXRhIG9yIHN1YnNjcmliZSBmaXJzdC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIE1ldGVvci5jYWxsKHRoaXMubmFtZSwgcHJlcGFyZUZvclByb2Nlc3ModGhpcy5ib2R5LCB0aGlzLnBhcmFtcyksIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGluZyB3aGVuIHdlJ3ZlIGdvdCBhbiBhY3RpdmUgcHVibGljYXRpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZmV0Y2hSZWFjdGl2ZShvcHRpb25zID0ge30pIHtcbiAgICAgICAgbGV0IGJvZHkgPSBwcmVwYXJlRm9yUHJvY2Vzcyh0aGlzLmJvZHksIHRoaXMucGFyYW1zKTtcbiAgICAgICAgaWYgKCFvcHRpb25zLmFsbG93U2tpcCAmJiBib2R5LiRvcHRpb25zICYmIGJvZHkuJG9wdGlvbnMuc2tpcCkge1xuICAgICAgICAgICAgZGVsZXRlIGJvZHkuJG9wdGlvbnMuc2tpcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZWN1cnNpdmVGZXRjaChcbiAgICAgICAgICAgIGNyZWF0ZUdyYXBoKHRoaXMuY29sbGVjdGlvbiwgYm9keSksXG4gICAgICAgICAgICB0aGlzLnBhcmFtc1xuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCBRdWVyeUNsaWVudCBmcm9tICcuL3F1ZXJ5LmNsaWVudCc7XG5pbXBvcnQgUXVlcnlTZXJ2ZXIgZnJvbSAnLi9xdWVyeS5zZXJ2ZXInO1xuXG5sZXQgUXVlcnk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBRdWVyeSA9IFF1ZXJ5U2VydmVyO1xufSBlbHNlIHtcbiAgICBRdWVyeSA9IFF1ZXJ5Q2xpZW50O1xufVxuXG5leHBvcnQgZGVmYXVsdCBRdWVyeTsiLCJpbXBvcnQgY3JlYXRlR3JhcGggZnJvbSAnLi9saWIvY3JlYXRlR3JhcGguanMnO1xuaW1wb3J0IHByZXBhcmVGb3JQcm9jZXNzIGZyb20gJy4vbGliL3ByZXBhcmVGb3JQcm9jZXNzLmpzJztcbmltcG9ydCBoeXBlcm5vdmEgZnJvbSAnLi9oeXBlcm5vdmEvaHlwZXJub3ZhLmpzJztcbmltcG9ydCBCYXNlIGZyb20gJy4vcXVlcnkuYmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1ZXJ5IGV4dGVuZHMgQmFzZSB7XG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSBkYXRhLlxuICAgICAqIEBwYXJhbSBjb250ZXh0XG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZmV0Y2goY29udGV4dCA9IHt9KSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBjcmVhdGVHcmFwaChcbiAgICAgICAgICAgIHRoaXMuY29sbGVjdGlvbixcbiAgICAgICAgICAgIHByZXBhcmVGb3JQcm9jZXNzKHRoaXMuYm9keSwgdGhpcy5wYXJhbXMpXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIGh5cGVybm92YShub2RlLCBjb250ZXh0LnVzZXJJZCwge3BhcmFtczogdGhpcy5wYXJhbXN9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gYXJnc1xuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGZldGNoT25lKC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIF8uZmlyc3QodGhpcy5mZXRjaCguLi5hcmdzKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY291bnQgb2YgbWF0Y2hpbmcgZWxlbWVudHMuXG4gICAgICogQHJldHVybnMge2ludGVnZXJ9XG4gICAgICovXG4gICAgZ2V0Q291bnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uZmluZCh0aGlzLmJvZHkuJGZpbHRlcnMgfHwge30sIHt9KS5jb3VudCgpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgeyBDT1VOVFNfQ09MTEVDVElPTl9DTElFTlQgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbi8qKlxuICogSW50ZXJuYWwgY29sbGVjdGlvbiB1c2VkIHRvIHN0b3JlIGNvdW50cyBvbiB0aGUgY2xpZW50LlxuICovXG5leHBvcnQgZGVmYXVsdCBuZXcgTW9uZ28uQ29sbGVjdGlvbihDT1VOVFNfQ09MTEVDVElPTl9DTElFTlQpO1xuIiwiZXhwb3J0IGNvbnN0IENPVU5UU19DT0xMRUNUSU9OX0NMSUVOVCA9ICdncmFwaGVyX2NvdW50cyc7XG4iLCJpbXBvcnQgeyBFSlNPTiB9IGZyb20gJ21ldGVvci9lanNvbic7XG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IFJlYWN0aXZlVmFyIH0gZnJvbSAnbWV0ZW9yL3JlYWN0aXZlLXZhcic7XG5pbXBvcnQgeyBUcmFja2VyIH0gZnJvbSAnbWV0ZW9yL3RyYWNrZXInO1xuXG5pbXBvcnQgQ291bnRzIGZyb20gJy4vY29sbGVjdGlvbic7XG5pbXBvcnQgY3JlYXRlRmF1eFN1YnNjcmlwdGlvbiBmcm9tICcuL2NyZWF0ZUZhdXhTdWJzY3JpcHRpb24nO1xuaW1wb3J0IHByZXBhcmVGb3JQcm9jZXNzIGZyb20gJy4uL2xpYi9wcmVwYXJlRm9yUHJvY2Vzcy5qcyc7XG5pbXBvcnQgTmFtZWRRdWVyeUJhc2UgZnJvbSAnLi4vLi4vbmFtZWRRdWVyeS9uYW1lZFF1ZXJ5LmJhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3VudFN1YnNjcmlwdGlvbiB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHsqfSBxdWVyeSAtIFRoZSBxdWVyeSB0byB1c2Ugd2hlbiBmZXRjaGluZyBjb3VudHNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihxdWVyeSkge1xuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gbmV3IFJlYWN0aXZlVmFyKG51bGwpO1xuICAgICAgICB0aGlzLmZhdXhIYW5kbGUgPSBudWxsO1xuICAgICAgICB0aGlzLnF1ZXJ5ID0gcXVlcnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhcnRzIGEgc3Vic2NyaXB0aW9uIHJlcXVlc3QgZm9yIHJlYWN0aXZlIGNvdW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gYXJnIC0gVGhlIGFyZ3VtZW50IHRvIHBhc3MgdG8ge25hbWV9LmNvdW50LnN1YnNjcmliZVxuICAgICAqIEBwYXJhbSB7Kn0gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBzdWJzY3JpYmUoYXJnLCBjYWxsYmFjaykge1xuICAgICAgICAvLyBEb24ndCB0cnkgdG8gcmVzdWJzY3JpYmUgaWYgYXJnIGhhc24ndCBjaGFuZ2VkXG4gICAgICAgIGlmIChFSlNPTi5lcXVhbHModGhpcy5sYXN0QXJncywgYXJnKSAmJiB0aGlzLmZhdXhIYW5kbGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZhdXhIYW5kbGU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuLnNldChudWxsKTtcbiAgICAgICAgdGhpcy5sYXN0QXJncyA9IGFyZztcblxuICAgICAgICBNZXRlb3IuY2FsbCh0aGlzLnF1ZXJ5Lm5hbWUgKyAnLmNvdW50LnN1YnNjcmliZScsIGFyZywgKGVycm9yLCB0b2tlbikgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9tYXJrZWRGb3JVbnN1YnNjcmliZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlID0gTWV0ZW9yLnN1YnNjcmliZSh0aGlzLnF1ZXJ5Lm5hbWUgKyAnLmNvdW50JywgdG9rZW4sIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuLnNldCh0b2tlbik7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3RDb21wdXRhdGlvbiA9IFRyYWNrZXIuYXV0b3J1bigoKSA9PiB0aGlzLmhhbmRsZURpc2Nvbm5lY3QoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX21hcmtlZEZvclVuc3Vic2NyaWJlID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZmF1eEhhbmRsZSA9IGNyZWF0ZUZhdXhTdWJzY3JpcHRpb24odGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzLmZhdXhIYW5kbGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVW5zdWJzY3JpYmVzIGZyb20gdGhlIGNvdW50IGVuZHBvaW50LCBpZiB0aGVyZSBpcyBzdWNoIGEgc3Vic2NyaXB0aW9uLlxuICAgICAqL1xuICAgIHVuc3Vic2NyaWJlKCkge1xuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25IYW5kbGUpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdENvbXB1dGF0aW9uLnN0b3AoKTtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlLnN0b3AoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIElmIHdlIGhpdCB0aGlzIGJyYW5jaCwgdGhlbiBNZXRlb3IuY2FsbCBpbiBzdWJzY3JpYmUgaGFzbid0IGZpbmlzaGVkIHlldFxuICAgICAgICAgICAgLy8gc28gc2V0IGEgZmxhZyB0byBzdG9wIHRoZSBzdWJzY3JpcHRpb24gZnJvbSBiZWluZyBjcmVhdGVkXG4gICAgICAgICAgICB0aGlzLl9tYXJrZWRGb3JVbnN1YnNjcmliZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuLnNldChudWxsKTtcbiAgICAgICAgdGhpcy5mYXV4SGFuZGxlID0gbnVsbDtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25IYW5kbGUgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlYWN0aXZlbHkgZmV0Y2ggY3VycmVudCBkb2N1bWVudCBjb3VudC4gUmV0dXJucyBudWxsIGlmIHRoZSBzdWJzY3JpcHRpb24gaXMgbm90IHJlYWR5IHlldC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtOdW1iZXJ8bnVsbH0gLSBDdXJyZW50IGRvY3VtZW50IGNvdW50XG4gICAgICovXG4gICAgZ2V0Q291bnQoKSB7XG4gICAgICAgIGNvbnN0IGlkID0gdGhpcy5hY2Nlc3NUb2tlbi5nZXQoKTtcbiAgICAgICAgaWYgKGlkID09PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICAgICAgICBjb25zdCBkb2MgPSBDb3VudHMuZmluZE9uZShpZCk7XG4gICAgICAgIHJldHVybiBkb2MuY291bnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWxsIHNlc3Npb24gaW5mbyBnZXRzIGRlbGV0ZWQgd2hlbiB0aGUgc2VydmVyIGdvZXMgZG93biwgc28gd2hlbiB0aGUgY2xpZW50IGF0dGVtcHRzIHRvXG4gICAgICogb3B0aW1pc3RpY2FsbHkgcmVzdW1lIHRoZSAnLmNvdW50JyBwdWJsaWNhdGlvbiwgdGhlIHNlcnZlciB3aWxsIHRocm93IGEgJ25vLXJlcXVlc3QnIGVycm9yLlxuICAgICAqXG4gICAgICogVGhpcyBmdW5jdGlvbiBwcmV2ZW50cyB0aGF0IGJ5IG1hbnVhbGx5IHN0b3BwaW5nIGFuZCByZXN0YXJ0aW5nIHRoZSBzdWJzY3JpcHRpb24gd2hlbiB0aGVcbiAgICAgKiBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXIgaXMgbG9zdC5cbiAgICAgKi9cbiAgICBoYW5kbGVEaXNjb25uZWN0KCkge1xuICAgICAgICBjb25zdCBzdGF0dXMgPSBNZXRlb3Iuc3RhdHVzKCk7XG4gICAgICAgIGlmICghc3RhdHVzLmNvbm5lY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5fbWFya2VkRm9yUmVzdW1lID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZmF1eEhhbmRsZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZS5zdG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhdHVzLmNvbm5lY3RlZCAmJiB0aGlzLl9tYXJrZWRGb3JSZXN1bWUpIHtcbiAgICAgICAgICAgIHRoaXMuX21hcmtlZEZvclJlc3VtZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmUodGhpcy5sYXN0QXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGEgc3Vic2NyaXB0aW9uIHJlcXVlc3QgaGFzIGJlZW4gbWFkZS5cbiAgICAgKi9cbiAgICBpc1N1YnNjcmliZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFjY2Vzc1Rva2VuLmdldCgpICE9PSBudWxsO1xuICAgIH1cbn1cbiIsIi8qKlxuICogVGhpcyBtZXRob2QgY3JlYXRlcyBhIFwiZmFrZVwiIHN1YnNjcmlwdGlvbiBoYW5kbGUgc28gdGhhdCB1c2VycyBvZiBDb3VudFN1YnNjcmlwdGlvbiNzdWJzY3JpYmVcbiAqIGhhdmUgYW4gaW50ZXJmYWNlIGNvbnNpc3RlbnQgd2l0aCBub3JtYWwgc3Vic2NyaXB0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge0NvdW50U3Vic2NyaXB0aW9ufSBjb3VudE1hbmFnZXJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgKGNvdW50TWFuYWdlcikgPT4gKHtcbiAgICByZWFkeTogKCkgPT4gY291bnRNYW5hZ2VyLmFjY2Vzc1Rva2VuLmdldCgpICE9PSBudWxsICYmIGNvdW50TWFuYWdlci5zdWJzY3JpcHRpb25IYW5kbGUucmVhZHkoKSxcbiAgICBzdG9wOiAoKSA9PiBjb3VudE1hbmFnZXIudW5zdWJzY3JpYmUoKSxcbn0pO1xuIiwiaW1wb3J0IHsgY2hlY2sgfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5cbmltcG9ydCB7IENPVU5UU19DT0xMRUNUSU9OX0NMSUVOVCB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuLy8gWFhYOiBTaG91bGQgdGhpcyBwZXJzaXN0IGJldHdlZW4gc2VydmVyIHJlc3RhcnRzP1xuY29uc3QgY29sbGVjdGlvbiA9IG5ldyBNb25nby5Db2xsZWN0aW9uKG51bGwpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGdlbmVyYXRlcyBhIHJlYWN0aXZlIGNvdW50IGVuZHBvaW50IChhIG1ldGhvZCBhbmQgcHVibGljYXRpb24pIGZvciBhIGNvbGxlY3Rpb24gb3IgbmFtZWQgcXVlcnkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBxdWVyeSBvciBjb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBnZXRDdXJzb3IgLSBUYWtlcyBpbiB0aGUgdXNlcidzIHNlc3Npb24gZG9jdW1lbnQgYXMgYW4gYXJndW1lbnQsIGFuZCB0dXJucyB0aGF0IGludG8gYSBNb25nbyBjdXJzb3IuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBnZXRTZXNzaW9uIC0gVGFrZXMgdGhlIHN1YnNjcmliZSBtZXRob2QncyBhcmd1bWVudCBhcyBpdHMgcGFyYW1ldGVyLiBTaG91bGQgZW5mb3JjZSBhbnkgbmVjZXNzYXJ5IHNlY3VyaXR5IGNvbnN0cmFpbnRzLiBUaGUgcmV0dXJuIHZhbHVlIG9mIHRoaXMgZnVuY3Rpb24gaXMgc3RvcmVkIGluIHRoZSBzZXNzaW9uIGRvY3VtZW50LlxuICovXG5leHBvcnQgZGVmYXVsdCAobmFtZSwgeyBnZXRDdXJzb3IsIGdldFNlc3Npb24gfSkgPT4ge1xuICAgIE1ldGVvci5tZXRob2RzKHtcbiAgICAgICAgW25hbWUgKyAnLmNvdW50LnN1YnNjcmliZSddKHBhcmFtc09yQm9keSkge1xuICAgICAgICAgICAgY29uc3Qgc2Vzc2lvbiA9IGdldFNlc3Npb24uY2FsbCh0aGlzLCBwYXJhbXNPckJvZHkpO1xuICAgICAgICAgICAgY29uc3Qgc2Vzc2lvbklkID0gSlNPTi5zdHJpbmdpZnkoc2Vzc2lvbik7XG5cbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nU2Vzc2lvbiA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbjogc2Vzc2lvbklkLFxuICAgICAgICAgICAgICAgIHVzZXJJZDogdGhpcy51c2VySWQsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gVHJ5IHRvIHJldXNlIHNlc3Npb25zIGlmIHRoZSB1c2VyIHN1YnNjcmliZXMgbXVsdGlwbGUgdGltZXMgd2l0aCB0aGUgc2FtZSBkYXRhXG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdTZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nU2Vzc2lvbi5faWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gY29sbGVjdGlvbi5pbnNlcnQoe1xuICAgICAgICAgICAgICAgIHNlc3Npb246IHNlc3Npb25JZCxcbiAgICAgICAgICAgICAgICBxdWVyeTogbmFtZSxcbiAgICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMudXNlcklkLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIE1ldGVvci5wdWJsaXNoKG5hbWUgKyAnLmNvdW50JywgZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgICAgY2hlY2sodG9rZW4sIFN0cmluZyk7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zdCByZXF1ZXN0ID0gY29sbGVjdGlvbi5maW5kT25lKHsgX2lkOiB0b2tlbiwgdXNlcklkOiBzZWxmLnVzZXJJZCB9KTtcblxuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAnbm8tcmVxdWVzdCcsXG4gICAgICAgICAgICAgICAgYFlvdSBtdXN0IGFjcXVpcmUgYSByZXF1ZXN0IHRva2VuIHZpYSB0aGUgXCIke25hbWV9LmNvdW50LnN1YnNjcmliZVwiIG1ldGhvZCBmaXJzdC5gXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdC5zZXNzaW9uID0gSlNPTi5wYXJzZShyZXF1ZXN0LnNlc3Npb24pO1xuICAgICAgICBjb25zdCBjdXJzb3IgPSBnZXRDdXJzb3IuY2FsbCh0aGlzLCByZXF1ZXN0KTtcblxuICAgICAgICAvLyBTdGFydCBjb3VudGluZ1xuICAgICAgICBsZXQgY291bnQgPSAwO1xuXG4gICAgICAgIGxldCBpc1JlYWR5ID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IGhhbmRsZSA9IGN1cnNvci5vYnNlcnZlKHtcbiAgICAgICAgICAgIGFkZGVkKCkge1xuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICAgICAgaXNSZWFkeSAmJlxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNoYW5nZWQoQ09VTlRTX0NPTExFQ1RJT05fQ0xJRU5ULCB0b2tlbiwgeyBjb3VudCB9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHJlbW92ZWQoKSB7XG4gICAgICAgICAgICAgICAgY291bnQtLTtcbiAgICAgICAgICAgICAgICBpc1JlYWR5ICYmXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY2hhbmdlZChDT1VOVFNfQ09MTEVDVElPTl9DTElFTlQsIHRva2VuLCB7IGNvdW50IH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXNSZWFkeSA9IHRydWU7XG4gICAgICAgIHNlbGYuYWRkZWQoQ09VTlRTX0NPTExFQ1RJT05fQ0xJRU5ULCB0b2tlbiwgeyBjb3VudCB9KTtcblxuICAgICAgICBzZWxmLm9uU3RvcCgoKSA9PiB7XG4gICAgICAgICAgICBoYW5kbGUuc3RvcCgpO1xuICAgICAgICAgICAgY29sbGVjdGlvbi5yZW1vdmUodG9rZW4pO1xuICAgICAgICB9KTtcblxuICAgICAgICBzZWxmLnJlYWR5KCk7XG4gICAgfSk7XG59O1xuIiwiaW1wb3J0IHNpZnQgZnJvbSAnc2lmdCc7XG5cbi8qKlxuICogSXRzIHB1cnBvc2UgaXMgdG8gY3JlYXRlIGZpbHRlcnMgdG8gZ2V0IHRoZSByZWxhdGVkIGRhdGEgaW4gb25lIHJlcXVlc3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFnZ3JlZ2F0ZUZpbHRlcnMge1xuICAgIGNvbnN0cnVjdG9yKGNvbGxlY3Rpb25Ob2RlLCBtZXRhRmlsdGVycykge1xuICAgICAgICB0aGlzLmNvbGxlY3Rpb25Ob2RlID0gY29sbGVjdGlvbk5vZGU7XG4gICAgICAgIHRoaXMubGlua2VyID0gY29sbGVjdGlvbk5vZGUubGlua2VyO1xuICAgICAgICB0aGlzLm1ldGFGaWx0ZXJzID0gbWV0YUZpbHRlcnM7XG4gICAgICAgIHRoaXMuaXNWaXJ0dWFsID0gdGhpcy5saW5rZXIuaXNWaXJ0dWFsKCk7XG5cbiAgICAgICAgdGhpcy5saW5rU3RvcmFnZUZpZWxkID0gdGhpcy5saW5rZXIubGlua1N0b3JhZ2VGaWVsZDtcbiAgICB9XG5cbiAgICBnZXQgcGFyZW50T2JqZWN0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbk5vZGUucGFyZW50LnJlc3VsdHM7XG4gICAgfVxuXG4gICAgY3JlYXRlKCkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMubGlua2VyLnN0cmF0ZWd5KSB7XG4gICAgICAgICAgICBjYXNlICdvbmUnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU9uZSgpO1xuICAgICAgICAgICAgY2FzZSAnb25lLW1ldGEnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU9uZU1ldGEoKTtcbiAgICAgICAgICAgIGNhc2UgJ21hbnknOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU1hbnkoKTtcbiAgICAgICAgICAgIGNhc2UgJ21hbnktbWV0YSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTWFueU1ldGEoKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihgSW52YWxpZCBsaW5rZXIgdHlwZTogJHt0aGlzLmxpbmtlci50eXBlfWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlT25lKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgICAkaW46IF8udW5pcShcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ucGx1Y2sodGhpcy5wYXJlbnRPYmplY3RzLCB0aGlzLmxpbmtTdG9yYWdlRmllbGQpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBbdGhpcy5saW5rU3RvcmFnZUZpZWxkXToge1xuICAgICAgICAgICAgICAgICAgICAkaW46IF8udW5pcShcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ucGx1Y2sodGhpcy5wYXJlbnRPYmplY3RzLCAnX2lkJylcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVPbmVNZXRhKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICBsZXQgZWxpZ2libGVPYmplY3RzID0gdGhpcy5wYXJlbnRPYmplY3RzO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5tZXRhRmlsdGVycykge1xuICAgICAgICAgICAgICAgIGVsaWdpYmxlT2JqZWN0cyA9IF8uZmlsdGVyKHRoaXMucGFyZW50T2JqZWN0cywgb2JqZWN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNpZnQodGhpcy5tZXRhRmlsdGVycykob2JqZWN0W3RoaXMubGlua1N0b3JhZ2VGaWVsZF0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBzdG9yYWdlcyA9IF8ucGx1Y2soZWxpZ2libGVPYmplY3RzLCB0aGlzLmxpbmtTdG9yYWdlRmllbGQpO1xuICAgICAgICAgICAgbGV0IGlkcyA9IFtdO1xuICAgICAgICAgICAgXy5lYWNoKHN0b3JhZ2VzLCBzdG9yYWdlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc3RvcmFnZSkge1xuICAgICAgICAgICAgICAgICAgICBpZHMucHVzaChzdG9yYWdlLl9pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgX2lkOiB7JGluOiBfLnVuaXEoaWRzKX1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgZmlsdGVycyA9IHt9O1xuICAgICAgICAgICAgaWYgKHRoaXMubWV0YUZpbHRlcnMpIHtcbiAgICAgICAgICAgICAgICBfLmVhY2godGhpcy5tZXRhRmlsdGVycywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyc1t0aGlzLmxpbmtTdG9yYWdlRmllbGQgKyAnLicgKyBrZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZmlsdGVyc1t0aGlzLmxpbmtTdG9yYWdlRmllbGQgKyAnLl9pZCddID0ge1xuICAgICAgICAgICAgICAgICRpbjogXy51bmlxKFxuICAgICAgICAgICAgICAgICAgICBfLnBsdWNrKHRoaXMucGFyZW50T2JqZWN0cywgJ19pZCcpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcnM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVNYW55KCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICBjb25zdCBhcnJheU9mSWRzID0gXy5wbHVjayh0aGlzLnBhcmVudE9iamVjdHMsIHRoaXMubGlua1N0b3JhZ2VGaWVsZCk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgICAkaW46IF8udW5pcShcbiAgICAgICAgICAgICAgICAgICAgICAgIF8udW5pb24oLi4uYXJyYXlPZklkcylcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBhcnJheU9mSWRzID0gXy5wbHVjayh0aGlzLnBhcmVudE9iamVjdHMsICdfaWQnKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgW3RoaXMubGlua1N0b3JhZ2VGaWVsZF06IHtcbiAgICAgICAgICAgICAgICAgICAgJGluOiBfLnVuaXEoXG4gICAgICAgICAgICAgICAgICAgICAgICBfLnVuaW9uKC4uLmFycmF5T2ZJZHMpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlTWFueU1ldGEoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIGxldCBpZHMgPSBbXTtcblxuICAgICAgICAgICAgXy5lYWNoKHRoaXMucGFyZW50T2JqZWN0cywgb2JqZWN0ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAob2JqZWN0W3RoaXMubGlua1N0b3JhZ2VGaWVsZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubWV0YUZpbHRlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzVmFsaWQgPSBzaWZ0KHRoaXMubWV0YUZpbHRlcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKG9iamVjdFt0aGlzLmxpbmtTdG9yYWdlRmllbGRdLCBvYmplY3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc1ZhbGlkKG9iamVjdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRzLnB1c2gob2JqZWN0Ll9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2gob2JqZWN0W3RoaXMubGlua1N0b3JhZ2VGaWVsZF0sIG9iamVjdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRzLnB1c2gob2JqZWN0Ll9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIF9pZDogeyRpbjogXy51bmlxKGlkcyl9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGZpbHRlcnMgPSB7fTtcbiAgICAgICAgICAgIGlmICh0aGlzLm1ldGFGaWx0ZXJzKSB7XG4gICAgICAgICAgICAgICAgXy5lYWNoKHRoaXMubWV0YUZpbHRlcnMsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcnNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZpbHRlcnMuX2lkID0ge1xuICAgICAgICAgICAgICAgICRpbjogXy51bmlxKFxuICAgICAgICAgICAgICAgICAgICBfLnBsdWNrKHRoaXMucGFyZW50T2JqZWN0cywgJ19pZCcpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBbdGhpcy5saW5rU3RvcmFnZUZpZWxkXToge1xuICAgICAgICAgICAgICAgICAgICAkZWxlbU1hdGNoOiBmaWx0ZXJzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgc2lmdCBmcm9tICdzaWZ0JztcbmltcG9ydCBjbGVhbk9iamVjdEZvck1ldGFGaWx0ZXJzIGZyb20gJy4vbGliL2NsZWFuT2JqZWN0Rm9yTWV0YUZpbHRlcnMnO1xuXG4vKipcbiAqIFRoaXMgb25seSBhcHBsaWVzIHRvIGludmVyc2VkIGxpbmtzLiBJdCB3aWxsIGFzc2VtYmxlIHRoZSBkYXRhIGluIGEgY29ycmVjdCBtYW5uZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNoaWxkQ29sbGVjdGlvbk5vZGUsIGFnZ3JlZ2F0ZVJlc3VsdHMsIG1ldGFGaWx0ZXJzKSB7XG4gICAgY29uc3QgbGlua2VyID0gY2hpbGRDb2xsZWN0aW9uTm9kZS5saW5rZXI7XG4gICAgY29uc3QgbGlua1N0b3JhZ2VGaWVsZCA9IGxpbmtlci5saW5rU3RvcmFnZUZpZWxkO1xuICAgIGNvbnN0IGxpbmtOYW1lID0gY2hpbGRDb2xsZWN0aW9uTm9kZS5saW5rTmFtZTtcbiAgICBjb25zdCBpc01ldGEgPSBsaW5rZXIuaXNNZXRhKCk7XG4gICAgY29uc3QgaXNNYW55ID0gbGlua2VyLmlzTWFueSgpO1xuXG4gICAgbGV0IGFsbFJlc3VsdHMgPSBbXTtcblxuICAgIGlmIChpc01ldGEgJiYgbWV0YUZpbHRlcnMpIHtcbiAgICAgICAgY29uc3QgbWV0YUZpbHRlcnNUZXN0ID0gc2lmdChtZXRhRmlsdGVycyk7XG4gICAgICAgIF8uZWFjaChjaGlsZENvbGxlY3Rpb25Ob2RlLnBhcmVudC5yZXN1bHRzLCBwYXJlbnRSZXN1bHQgPT4ge1xuICAgICAgICAgICAgY2xlYW5PYmplY3RGb3JNZXRhRmlsdGVycyhcbiAgICAgICAgICAgICAgICBwYXJlbnRSZXN1bHQsXG4gICAgICAgICAgICAgICAgbGlua1N0b3JhZ2VGaWVsZCxcbiAgICAgICAgICAgICAgICBtZXRhRmlsdGVyc1Rlc3RcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChpc01ldGEgJiYgaXNNYW55KSB7XG4gICAgICAgIC8vIFRoaXMgY2FzZSBpcyB0cmVhdGVkIGRpZmZlcmVudGx5IGJlY2F1c2Ugd2UgZ2V0IGFuIGFycmF5IHJlc3BvbnNlIGZyb20gdGhlIHBpcGVsaW5lLlxuXG4gICAgICAgIF8uZWFjaChjaGlsZENvbGxlY3Rpb25Ob2RlLnBhcmVudC5yZXN1bHRzLCBwYXJlbnRSZXN1bHQgPT4ge1xuICAgICAgICAgICAgcGFyZW50UmVzdWx0W2xpbmtOYW1lXSA9IHBhcmVudFJlc3VsdFtsaW5rTmFtZV0gfHwgW107XG5cbiAgICAgICAgICAgIGNvbnN0IGVsaWdpYmxlQWdncmVnYXRlUmVzdWx0cyA9IF8uZmlsdGVyKFxuICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZVJlc3VsdHMsXG4gICAgICAgICAgICAgICAgYWdncmVnYXRlUmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8uY29udGFpbnMoYWdncmVnYXRlUmVzdWx0Ll9pZCwgcGFyZW50UmVzdWx0Ll9pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKGVsaWdpYmxlQWdncmVnYXRlUmVzdWx0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhcyA9IF8ucGx1Y2soZWxpZ2libGVBZ2dyZWdhdGVSZXN1bHRzLCAnZGF0YScpOyAvLy8gWyBbeDEsIHgyXSwgW3gyLCB4M10gXVxuXG4gICAgICAgICAgICAgICAgXy5lYWNoKGRhdGFzLCBkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGRhdGEsIGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50UmVzdWx0W2xpbmtOYW1lXS5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgXy5lYWNoKGFnZ3JlZ2F0ZVJlc3VsdHMsIGFnZ3JlZ2F0ZVJlc3VsdCA9PiB7XG4gICAgICAgICAgICBfLmVhY2goYWdncmVnYXRlUmVzdWx0LmRhdGEsIGl0ZW0gPT4gYWxsUmVzdWx0cy5wdXNoKGl0ZW0pKTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGNvbXBhcmF0b3I7XG4gICAgICAgIGlmIChpc01hbnkpIHtcbiAgICAgICAgICAgIGNvbXBhcmF0b3IgPSAoYWdncmVnYXRlUmVzdWx0LCByZXN1bHQpID0+XG4gICAgICAgICAgICAgICAgXy5jb250YWlucyhhZ2dyZWdhdGVSZXN1bHQuX2lkLCByZXN1bHQuX2lkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbXBhcmF0b3IgPSAoYWdncmVnYXRlUmVzdWx0LCByZXN1bHQpID0+XG4gICAgICAgICAgICAgICAgYWdncmVnYXRlUmVzdWx0Ll9pZCA9PSByZXN1bHQuX2lkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2hpbGRMaW5rTmFtZSA9IGNoaWxkQ29sbGVjdGlvbk5vZGUubGlua05hbWU7XG4gICAgICAgIGNvbnN0IHBhcmVudFJlc3VsdHMgPSBjaGlsZENvbGxlY3Rpb25Ob2RlLnBhcmVudC5yZXN1bHRzO1xuXG4gICAgICAgIHBhcmVudFJlc3VsdHMuZm9yRWFjaChwYXJlbnRSZXN1bHQgPT4ge1xuICAgICAgICAgICAgLy8gV2UgYXJlIG5vdyBmaW5kaW5nIHRoZSBkYXRhIGZyb20gdGhlIHBpcGVsaW5lIHRoYXQgaXMgcmVsYXRlZCB0byB0aGUgX2lkIG9mIHRoZSBwYXJlbnRcbiAgICAgICAgICAgIGNvbnN0IGVsaWdpYmxlQWdncmVnYXRlUmVzdWx0cyA9IGFnZ3JlZ2F0ZVJlc3VsdHMuZmlsdGVyKFxuICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZVJlc3VsdCA9PiBjb21wYXJhdG9yKGFnZ3JlZ2F0ZVJlc3VsdCwgcGFyZW50UmVzdWx0KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZWxpZ2libGVBZ2dyZWdhdGVSZXN1bHRzLmZvckVhY2goYWdncmVnYXRlUmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwYXJlbnRSZXN1bHRbY2hpbGRMaW5rTmFtZV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudFJlc3VsdFtjaGlsZExpbmtOYW1lXS5wdXNoKC4uLmFnZ3JlZ2F0ZVJlc3VsdC5kYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRSZXN1bHRbY2hpbGRMaW5rTmFtZV0gPSBbLi4uYWdncmVnYXRlUmVzdWx0LmRhdGFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBhZ2dyZWdhdGVSZXN1bHRzLmZvckVhY2goYWdncmVnYXRlUmVzdWx0ID0+IHtcbiAgICAgICAgICAgIGFsbFJlc3VsdHMucHVzaCguLi5hZ2dyZWdhdGVSZXN1bHQuZGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNoaWxkQ29sbGVjdGlvbk5vZGUucmVzdWx0cyA9IGFsbFJlc3VsdHM7XG59XG4iLCJpbXBvcnQgY3JlYXRlU2VhcmNoRmlsdGVycyBmcm9tICcuLi8uLi9saW5rcy9saWIvY3JlYXRlU2VhcmNoRmlsdGVycyc7XG5pbXBvcnQgY2xlYW5PYmplY3RGb3JNZXRhRmlsdGVycyBmcm9tICcuL2xpYi9jbGVhbk9iamVjdEZvck1ldGFGaWx0ZXJzJztcbmltcG9ydCBzaWZ0IGZyb20gJ3NpZnQnO1xuXG5leHBvcnQgZGVmYXVsdCAoY2hpbGRDb2xsZWN0aW9uTm9kZSwgeyBsaW1pdCwgc2tpcCwgbWV0YUZpbHRlcnMgfSkgPT4ge1xuICAgIGlmIChjaGlsZENvbGxlY3Rpb25Ob2RlLnJlc3VsdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwYXJlbnQgPSBjaGlsZENvbGxlY3Rpb25Ob2RlLnBhcmVudDtcbiAgICBjb25zdCBsaW5rZXIgPSBjaGlsZENvbGxlY3Rpb25Ob2RlLmxpbmtlcjtcblxuICAgIGNvbnN0IHN0cmF0ZWd5ID0gbGlua2VyLnN0cmF0ZWd5O1xuICAgIGNvbnN0IGlzU2luZ2xlID0gbGlua2VyLmlzU2luZ2xlKCk7XG4gICAgY29uc3QgaXNNZXRhID0gbGlua2VyLmlzTWV0YSgpO1xuICAgIGNvbnN0IGZpZWxkU3RvcmFnZSA9IGxpbmtlci5saW5rU3RvcmFnZUZpZWxkO1xuXG4gICAgLy8gY2xlYW5pbmcgdGhlIHBhcmVudCByZXN1bHRzIGZyb20gYSBjaGlsZFxuICAgIC8vIHRoaXMgbWF5IGJlIHRoZSB3cm9uZyBhcHByb2FjaCBidXQgaXQgd29ya3MgZm9yIG5vd1xuICAgIGlmIChpc01ldGEgJiYgbWV0YUZpbHRlcnMpIHtcbiAgICAgICAgY29uc3QgbWV0YUZpbHRlcnNUZXN0ID0gc2lmdChtZXRhRmlsdGVycyk7XG4gICAgICAgIF8uZWFjaChwYXJlbnQucmVzdWx0cywgcGFyZW50UmVzdWx0ID0+IHtcbiAgICAgICAgICAgIGNsZWFuT2JqZWN0Rm9yTWV0YUZpbHRlcnMoXG4gICAgICAgICAgICAgICAgcGFyZW50UmVzdWx0LFxuICAgICAgICAgICAgICAgIGZpZWxkU3RvcmFnZSxcbiAgICAgICAgICAgICAgICBtZXRhRmlsdGVyc1Rlc3RcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdHNCeUtleUlkID0gXy5ncm91cEJ5KGNoaWxkQ29sbGVjdGlvbk5vZGUucmVzdWx0cywgJ19pZCcpO1xuXG4gICAgaWYgKHN0cmF0ZWd5ID09PSAnb25lJykge1xuICAgICAgICBwYXJlbnQucmVzdWx0cy5mb3JFYWNoKHBhcmVudFJlc3VsdCA9PiB7XG4gICAgICAgICAgICBpZiAoIXBhcmVudFJlc3VsdFtmaWVsZFN0b3JhZ2VdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwYXJlbnRSZXN1bHRbY2hpbGRDb2xsZWN0aW9uTm9kZS5saW5rTmFtZV0gPSBmaWx0ZXJBc3NlbWJsZWREYXRhKFxuICAgICAgICAgICAgICAgIHJlc3VsdHNCeUtleUlkW3BhcmVudFJlc3VsdFtmaWVsZFN0b3JhZ2VdXSxcbiAgICAgICAgICAgICAgICB7IGxpbWl0LCBza2lwIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChzdHJhdGVneSA9PT0gJ21hbnknKSB7XG4gICAgICAgIHBhcmVudC5yZXN1bHRzLmZvckVhY2gocGFyZW50UmVzdWx0ID0+IHtcbiAgICAgICAgICAgIGlmICghcGFyZW50UmVzdWx0W2ZpZWxkU3RvcmFnZV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBkYXRhID0gW107XG4gICAgICAgICAgICBwYXJlbnRSZXN1bHRbZmllbGRTdG9yYWdlXS5mb3JFYWNoKF9pZCA9PiB7XG4gICAgICAgICAgICAgICAgZGF0YS5wdXNoKF8uZmlyc3QocmVzdWx0c0J5S2V5SWRbX2lkXSkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHBhcmVudFJlc3VsdFtjaGlsZENvbGxlY3Rpb25Ob2RlLmxpbmtOYW1lXSA9IGZpbHRlckFzc2VtYmxlZERhdGEoXG4gICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICB7IGxpbWl0LCBza2lwIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChzdHJhdGVneSA9PT0gJ29uZS1tZXRhJykge1xuICAgICAgICBwYXJlbnQucmVzdWx0cy5mb3JFYWNoKHBhcmVudFJlc3VsdCA9PiB7XG4gICAgICAgICAgICBpZiAoIXBhcmVudFJlc3VsdFtmaWVsZFN0b3JhZ2VdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBfaWQgPSBwYXJlbnRSZXN1bHRbZmllbGRTdG9yYWdlXS5faWQ7XG4gICAgICAgICAgICBwYXJlbnRSZXN1bHRbY2hpbGRDb2xsZWN0aW9uTm9kZS5saW5rTmFtZV0gPSBmaWx0ZXJBc3NlbWJsZWREYXRhKFxuICAgICAgICAgICAgICAgIHJlc3VsdHNCeUtleUlkW19pZF0sXG4gICAgICAgICAgICAgICAgeyBsaW1pdCwgc2tpcCB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoc3RyYXRlZ3kgPT09ICdtYW55LW1ldGEnKSB7XG4gICAgICAgIHBhcmVudC5yZXN1bHRzLmZvckVhY2gocGFyZW50UmVzdWx0ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IF9pZHMgPSBfLnBsdWNrKHBhcmVudFJlc3VsdFtmaWVsZFN0b3JhZ2VdLCAnX2lkJyk7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IFtdO1xuICAgICAgICAgICAgX2lkcy5mb3JFYWNoKF9pZCA9PiB7XG4gICAgICAgICAgICAgICAgZGF0YS5wdXNoKF8uZmlyc3QocmVzdWx0c0J5S2V5SWRbX2lkXSkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHBhcmVudFJlc3VsdFtjaGlsZENvbGxlY3Rpb25Ob2RlLmxpbmtOYW1lXSA9IGZpbHRlckFzc2VtYmxlZERhdGEoXG4gICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICB7IGxpbWl0LCBza2lwIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGZpbHRlckFzc2VtYmxlZERhdGEoZGF0YSwgeyBsaW1pdCwgc2tpcCB9KSB7XG4gICAgaWYgKGxpbWl0ICYmIEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuc2xpY2Uoc2tpcCwgbGltaXQpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xufVxuIiwiaW1wb3J0IHsgXyB9IGZyb20gJ21ldGVvci91bmRlcnNjb3JlJztcbmltcG9ydCB7U0FGRV9ET1RURURfRklFTERfUkVQTEFDRU1FTlR9IGZyb20gJy4vY29uc3RhbnRzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGNoaWxkQ29sbGVjdGlvbk5vZGUsIGZpbHRlcnMsIG9wdGlvbnMsIHVzZXJJZCkge1xuICAgIGxldCBjb250YWluc0RvdHRlZEZpZWxkcyA9IGZhbHNlO1xuICAgIGNvbnN0IGxpbmtlciA9IGNoaWxkQ29sbGVjdGlvbk5vZGUubGlua2VyO1xuICAgIGNvbnN0IGxpbmtTdG9yYWdlRmllbGQgPSBsaW5rZXIubGlua1N0b3JhZ2VGaWVsZDtcbiAgICBjb25zdCBjb2xsZWN0aW9uID0gY2hpbGRDb2xsZWN0aW9uTm9kZS5jb2xsZWN0aW9uO1xuXG4gICAgbGV0IHBpcGVsaW5lID0gW107XG5cbiAgICBpZiAoY29sbGVjdGlvbi5maXJld2FsbCkge1xuICAgICAgICBjb2xsZWN0aW9uLmZpcmV3YWxsKGZpbHRlcnMsIG9wdGlvbnMsIHVzZXJJZCk7XG4gICAgfVxuXG4gICAgcGlwZWxpbmUucHVzaCh7JG1hdGNoOiBmaWx0ZXJzfSk7XG5cbiAgICBpZiAob3B0aW9ucy5zb3J0ICYmIF8ua2V5cyhvcHRpb25zLnNvcnQpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGlwZWxpbmUucHVzaCh7JHNvcnQ6IG9wdGlvbnMuc29ydH0pXG4gICAgfVxuXG4gICAgbGV0IF9pZCA9IGxpbmtTdG9yYWdlRmllbGQ7XG4gICAgaWYgKGxpbmtlci5pc01ldGEoKSkge1xuICAgICAgICBfaWQgKz0gJy5faWQnO1xuICAgIH1cblxuICAgIGxldCBkYXRhUHVzaCA9IHtcbiAgICAgICAgX2lkOiAnJF9pZCdcbiAgICB9O1xuXG4gICAgXy5lYWNoKG9wdGlvbnMuZmllbGRzLCAodmFsdWUsIGZpZWxkKSA9PiB7XG4gICAgICAgIGlmIChmaWVsZC5pbmRleE9mKCcuJykgPj0gMCkge1xuICAgICAgICAgICAgY29udGFpbnNEb3R0ZWRGaWVsZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNhZmVGaWVsZCA9IGZpZWxkLnJlcGxhY2UoL1xcLi9nLCBTQUZFX0RPVFRFRF9GSUVMRF9SRVBMQUNFTUVOVCk7XG4gICAgICAgIGRhdGFQdXNoW3NhZmVGaWVsZF0gPSAnJCcgKyBmaWVsZFxuICAgIH0pO1xuXG4gICAgaWYgKGxpbmtlci5pc01ldGEoKSkge1xuICAgICAgICBkYXRhUHVzaFtsaW5rU3RvcmFnZUZpZWxkXSA9ICckJyArIGxpbmtTdG9yYWdlRmllbGQ7XG4gICAgfVxuXG4gICAgcGlwZWxpbmUucHVzaCh7XG4gICAgICAgICRncm91cDoge1xuICAgICAgICAgICAgX2lkOiBcIiRcIiArIF9pZCxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAkcHVzaDogZGF0YVB1c2hcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKG9wdGlvbnMubGltaXQgfHwgb3B0aW9ucy5za2lwKSB7XG4gICAgICAgIGxldCAkc2xpY2UgPSBbXCIkZGF0YVwiXTtcbiAgICAgICAgaWYgKG9wdGlvbnMuc2tpcCkgJHNsaWNlLnB1c2gob3B0aW9ucy5za2lwKTtcbiAgICAgICAgaWYgKG9wdGlvbnMubGltaXQpICRzbGljZS5wdXNoKG9wdGlvbnMubGltaXQpO1xuXG4gICAgICAgIHBpcGVsaW5lLnB1c2goe1xuICAgICAgICAgICAgJHByb2plY3Q6IHtcbiAgICAgICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICAgICAgZGF0YTogeyRzbGljZX1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4ge3BpcGVsaW5lLCBjb250YWluc0RvdHRlZEZpZWxkc307XG59IiwiZXhwb3J0IGNvbnN0IFNBRkVfRE9UVEVEX0ZJRUxEX1JFUExBQ0VNRU5UID0gJ19fXyc7IiwiaW1wb3J0IGFwcGx5UHJvcHMgZnJvbSAnLi4vbGliL2FwcGx5UHJvcHMuanMnO1xuaW1wb3J0IHByZXBhcmVGb3JEZWxpdmVyeSBmcm9tICcuLi9saWIvcHJlcGFyZUZvckRlbGl2ZXJ5LmpzJztcbmltcG9ydCBzdG9yZUh5cGVybm92YVJlc3VsdHMgZnJvbSAnLi9zdG9yZUh5cGVybm92YVJlc3VsdHMuanMnO1xuXG5mdW5jdGlvbiBoeXBlcm5vdmEoY29sbGVjdGlvbk5vZGUsIHVzZXJJZCkge1xuICAgIF8uZWFjaChjb2xsZWN0aW9uTm9kZS5jb2xsZWN0aW9uTm9kZXMsIGNoaWxkQ29sbGVjdGlvbk5vZGUgPT4ge1xuICAgICAgICBsZXQge2ZpbHRlcnMsIG9wdGlvbnN9ID0gYXBwbHlQcm9wcyhjaGlsZENvbGxlY3Rpb25Ob2RlKTtcblxuICAgICAgICBzdG9yZUh5cGVybm92YVJlc3VsdHMoY2hpbGRDb2xsZWN0aW9uTm9kZSwgdXNlcklkKTtcbiAgICAgICAgaHlwZXJub3ZhKGNoaWxkQ29sbGVjdGlvbk5vZGUsIHVzZXJJZCk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGh5cGVybm92YUluaXQoY29sbGVjdGlvbk5vZGUsIHVzZXJJZCwgY29uZmlnID0ge30pIHtcbiAgICBjb25zdCBieXBhc3NGaXJld2FsbHMgPSBjb25maWcuYnlwYXNzRmlyZXdhbGxzIHx8IGZhbHNlO1xuICAgIGNvbnN0IHBhcmFtcyA9IGNvbmZpZy5wYXJhbXMgfHwge307XG5cbiAgICBsZXQge2ZpbHRlcnMsIG9wdGlvbnN9ID0gYXBwbHlQcm9wcyhjb2xsZWN0aW9uTm9kZSk7XG5cbiAgICBjb25zdCBjb2xsZWN0aW9uID0gY29sbGVjdGlvbk5vZGUuY29sbGVjdGlvbjtcblxuICAgIGNvbGxlY3Rpb25Ob2RlLnJlc3VsdHMgPSBjb2xsZWN0aW9uLmZpbmQoZmlsdGVycywgb3B0aW9ucywgdXNlcklkKS5mZXRjaCgpO1xuXG4gICAgY29uc3QgdXNlcklkVG9QYXNzID0gKGNvbmZpZy5ieXBhc3NGaXJld2FsbHMpID8gdW5kZWZpbmVkIDogdXNlcklkO1xuICAgIGh5cGVybm92YShjb2xsZWN0aW9uTm9kZSwgdXNlcklkVG9QYXNzKTtcblxuICAgIHByZXBhcmVGb3JEZWxpdmVyeShjb2xsZWN0aW9uTm9kZSwgcGFyYW1zKTtcblxuICAgIHJldHVybiBjb2xsZWN0aW9uTm9kZS5yZXN1bHRzO1xufVxuIiwiaW1wb3J0IGFwcGx5UHJvcHMgZnJvbSAnLi4vbGliL2FwcGx5UHJvcHMuanMnO1xuaW1wb3J0IEFnZ3JlZ2F0ZUZpbHRlcnMgZnJvbSAnLi9hZ2dyZWdhdGVTZWFyY2hGaWx0ZXJzLmpzJztcbmltcG9ydCBhc3NlbWJsZSBmcm9tICcuL2Fzc2VtYmxlci5qcyc7XG5pbXBvcnQgYXNzZW1ibGVBZ2dyZWdhdGVSZXN1bHRzIGZyb20gJy4vYXNzZW1ibGVBZ2dyZWdhdGVSZXN1bHRzLmpzJztcbmltcG9ydCBidWlsZEFnZ3JlZ2F0ZVBpcGVsaW5lIGZyb20gJy4vYnVpbGRBZ2dyZWdhdGVQaXBlbGluZS5qcyc7XG5pbXBvcnQgc25hcEJhY2tEb3R0ZWRGaWVsZHMgZnJvbSAnLi9saWIvc25hcEJhY2tEb3R0ZWRGaWVsZHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdG9yZUh5cGVybm92YVJlc3VsdHMoY2hpbGRDb2xsZWN0aW9uTm9kZSwgdXNlcklkKSB7XG4gICAgaWYgKGNoaWxkQ29sbGVjdGlvbk5vZGUucGFyZW50LnJlc3VsdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiAoY2hpbGRDb2xsZWN0aW9uTm9kZS5yZXN1bHRzID0gW10pO1xuICAgIH1cblxuICAgIGxldCB7IGZpbHRlcnMsIG9wdGlvbnMgfSA9IGFwcGx5UHJvcHMoY2hpbGRDb2xsZWN0aW9uTm9kZSk7XG5cbiAgICBjb25zdCBtZXRhRmlsdGVycyA9IGZpbHRlcnMuJG1ldGE7XG4gICAgY29uc3QgYWdncmVnYXRlRmlsdGVycyA9IG5ldyBBZ2dyZWdhdGVGaWx0ZXJzKFxuICAgICAgICBjaGlsZENvbGxlY3Rpb25Ob2RlLFxuICAgICAgICBtZXRhRmlsdGVyc1xuICAgICk7XG4gICAgZGVsZXRlIGZpbHRlcnMuJG1ldGE7XG5cbiAgICBjb25zdCBsaW5rZXIgPSBjaGlsZENvbGxlY3Rpb25Ob2RlLmxpbmtlcjtcbiAgICBjb25zdCBpc1ZpcnR1YWwgPSBsaW5rZXIuaXNWaXJ0dWFsKCk7XG4gICAgY29uc3QgY29sbGVjdGlvbiA9IGNoaWxkQ29sbGVjdGlvbk5vZGUuY29sbGVjdGlvbjtcblxuICAgIF8uZXh0ZW5kKGZpbHRlcnMsIGFnZ3JlZ2F0ZUZpbHRlcnMuY3JlYXRlKCkpO1xuXG4gICAgLy8gaWYgaXQncyBub3QgdmlydHVhbCB0aGVuIHdlIHJldHJpZXZlIHRoZW0gYW5kIGFzc2VtYmxlIHRoZW0gaGVyZS5cbiAgICBpZiAoIWlzVmlydHVhbCkge1xuICAgICAgICBjb25zdCBmaWx0ZXJlZE9wdGlvbnMgPSBfLm9taXQob3B0aW9ucywgJ2xpbWl0Jyk7XG5cbiAgICAgICAgY2hpbGRDb2xsZWN0aW9uTm9kZS5yZXN1bHRzID0gY29sbGVjdGlvblxuICAgICAgICAgICAgLmZpbmQoZmlsdGVycywgZmlsdGVyZWRPcHRpb25zLCB1c2VySWQpXG4gICAgICAgICAgICAuZmV0Y2goKTtcblxuICAgICAgICBhc3NlbWJsZShjaGlsZENvbGxlY3Rpb25Ob2RlLCB7XG4gICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAgbWV0YUZpbHRlcnMsXG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHZpcnR1YWxzIGFycml2ZSBoZXJlXG4gICAgICAgIGxldCB7IHBpcGVsaW5lLCBjb250YWluc0RvdHRlZEZpZWxkcyB9ID0gYnVpbGRBZ2dyZWdhdGVQaXBlbGluZShcbiAgICAgICAgICAgIGNoaWxkQ29sbGVjdGlvbk5vZGUsXG4gICAgICAgICAgICBmaWx0ZXJzLFxuICAgICAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgICAgIHVzZXJJZFxuICAgICAgICApO1xuXG4gICAgICAgIGxldCBhZ2dyZWdhdGVSZXN1bHRzID0gY29sbGVjdGlvbi5hZ2dyZWdhdGUocGlwZWxpbmUpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBpbiBhZ2dyZWdhdGlvbiBpdCBjb250YWlucyAnLicsIHdlIHJlcGxhY2UgaXQgd2l0aCBhIGN1c3RvbSBzdHJpbmcgJ19fXydcbiAgICAgICAgICogQW5kIHRoZW4gYWZ0ZXIgYWdncmVnYXRpb24gaXMgY29tcGxldGUgd2UgbmVlZCB0byBzbmFwLWl0IGJhY2sgdG8gaG93IGl0IHdhcy5cbiAgICAgICAgICovXG4gICAgICAgIGlmIChjb250YWluc0RvdHRlZEZpZWxkcykge1xuICAgICAgICAgICAgc25hcEJhY2tEb3R0ZWRGaWVsZHMoYWdncmVnYXRlUmVzdWx0cyk7XG4gICAgICAgIH1cblxuICAgICAgICBhc3NlbWJsZUFnZ3JlZ2F0ZVJlc3VsdHMoXG4gICAgICAgICAgICBjaGlsZENvbGxlY3Rpb25Ob2RlLFxuICAgICAgICAgICAgYWdncmVnYXRlUmVzdWx0cyxcbiAgICAgICAgICAgIG1ldGFGaWx0ZXJzXG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG9iamVjdCwgZmllbGQsIG1ldGFGaWx0ZXJzVGVzdCkge1xuICAgIGlmIChvYmplY3RbZmllbGRdKSB7XG4gICAgICAgIGlmIChfLmlzQXJyYXkob2JqZWN0W2ZpZWxkXSkpIHtcbiAgICAgICAgICAgIG9iamVjdFtmaWVsZF0gPSBvYmplY3RbZmllbGRdLmZpbHRlcihtZXRhRmlsdGVyc1Rlc3QpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIW1ldGFGaWx0ZXJzVGVzdChvYmplY3RbZmllbGRdKSkge1xuICAgICAgICAgICAgICAgIG9iamVjdFtmaWVsZF0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7U0FGRV9ET1RURURfRklFTERfUkVQTEFDRU1FTlR9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgZG90IGZyb20gJ2RvdC1vYmplY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoYWdncmVnYXRpb25SZXN1bHQpIHtcbiAgICBhZ2dyZWdhdGlvblJlc3VsdC5mb3JFYWNoKHJlc3VsdCA9PiB7XG4gICAgICAgIHJlc3VsdC5kYXRhID0gcmVzdWx0LmRhdGEubWFwKGRvY3VtZW50ID0+IHtcbiAgICAgICAgICAgIF8uZWFjaChkb2N1bWVudCwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5LmluZGV4T2YoU0FGRV9ET1RURURfRklFTERfUkVQTEFDRU1FTlQpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnRba2V5LnJlcGxhY2UobmV3IFJlZ0V4cChTQUZFX0RPVFRFRF9GSUVMRF9SRVBMQUNFTUVOVCwgJ2cnKSwgJy4nKV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGRvY3VtZW50W2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBkb3Qub2JqZWN0KGRvY3VtZW50KTtcbiAgICAgICAgfSlcbiAgICB9KVxufSIsImNvbnN0IHJlc3RyaWN0T3B0aW9ucyA9IFtcbiAgICAnZGlzYWJsZU9wbG9nJyxcbiAgICAncG9sbGluZ0ludGVydmFsTXMnLFxuICAgICdwb2xsaW5nVGhyb3R0bGVNcydcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFwcGx5UHJvcHMobm9kZSkge1xuICAgIGxldCBmaWx0ZXJzID0gXy5leHRlbmQoe30sIG5vZGUucHJvcHMuJGZpbHRlcnMpO1xuICAgIGxldCBvcHRpb25zID0gXy5leHRlbmQoe30sIG5vZGUucHJvcHMuJG9wdGlvbnMpO1xuXG4gICAgb3B0aW9ucyA9IF8ub21pdChvcHRpb25zLCAuLi5yZXN0cmljdE9wdGlvbnMpO1xuICAgIG9wdGlvbnMuZmllbGRzID0gb3B0aW9ucy5maWVsZHMgfHwge307XG5cbiAgICBub2RlLmFwcGx5RmllbGRzKGZpbHRlcnMsIG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIHtmaWx0ZXJzLCBvcHRpb25zfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IChtZXRob2QsIG15UGFyYW1ldGVycykgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIE1ldGVvci5jYWxsKG1ldGhvZCwgbXlQYXJhbWV0ZXJzLCAoZXJyLCByZXMpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHJlamVjdChlcnIucmVhc29uIHx8ICdTb21ldGhpbmcgd2VudCB3cm9uZy4nKTtcblxuICAgICAgICAgICAgcmVzb2x2ZShyZXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07IiwiaW1wb3J0IENvbGxlY3Rpb25Ob2RlIGZyb20gJy4uL25vZGVzL2NvbGxlY3Rpb25Ob2RlLmpzJztcbmltcG9ydCBGaWVsZE5vZGUgZnJvbSAnLi4vbm9kZXMvZmllbGROb2RlLmpzJztcbmltcG9ydCBSZWR1Y2VyTm9kZSBmcm9tICcuLi9ub2Rlcy9yZWR1Y2VyTm9kZS5qcyc7XG5pbXBvcnQgZG90aXplIGZyb20gJy4vZG90aXplLmpzJztcbmltcG9ydCBjcmVhdGVSZWR1Y2VycyBmcm9tICcuLi9yZWR1Y2Vycy9saWIvY3JlYXRlUmVkdWNlcnMnO1xuXG5leHBvcnQgY29uc3Qgc3BlY2lhbEZpZWxkcyA9IFtcbiAgICAnJGZpbHRlcnMnLFxuICAgICckb3B0aW9ucycsXG4gICAgJyRwb3N0RmlsdGVycycsXG4gICAgJyRwb3N0T3B0aW9ucycsXG4gICAgJyRwb3N0RmlsdGVyJ1xuXTtcblxuLyoqXG4gKiBDcmVhdGVzIG5vZGUgb2JqZWN0cyBmcm9tIHRoZSBib2R5LiBUaGUgcm9vdCBpcyBhbHdheXMgYSBjb2xsZWN0aW9uIG5vZGUuXG4gKlxuICogQHBhcmFtIHJvb3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5vZGVzKHJvb3QpIHtcbiAgICAvLyB0aGlzIGlzIGEgZml4IGZvciBwaGFudG9tanMgdGVzdHMgKGRvbid0IHJlYWxseSB1bmRlcnN0YW5kIGl0LilcbiAgICBpZiAoIV8uaXNPYmplY3Qocm9vdC5ib2R5KSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgXy5lYWNoKHJvb3QuYm9keSwgKGJvZHksIGZpZWxkTmFtZSkgPT4ge1xuICAgICAgICBpZiAoIWJvZHkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIGl0J3MgYSBwcm9wXG4gICAgICAgIGlmIChfLmNvbnRhaW5zKHNwZWNpYWxGaWVsZHMsIGZpZWxkTmFtZSkpIHtcbiAgICAgICAgICAgIHJvb3QuYWRkUHJvcChmaWVsZE5hbWUsIGJvZHkpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3b3JrYXJvdW5kLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2N1bHQtb2YtY29kZXJzL2dyYXBoZXIvaXNzdWVzLzEzNFxuICAgICAgICAvLyBUT0RPOiBmaW5kIGFub3RoZXIgd2F5IHRvIGRvIHRoaXNcbiAgICAgICAgaWYgKHJvb3QuY29sbGVjdGlvbi5kZWZhdWx0KSB7XG4gICAgICAgICAgcm9vdC5jb2xsZWN0aW9uID0gcm9vdC5jb2xsZWN0aW9uLmRlZmF1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVja2luZyBpZiBpdCBpcyBhIGxpbmsuXG4gICAgICAgIGxldCBsaW5rZXIgPSByb290LmNvbGxlY3Rpb24uZ2V0TGlua2VyKGZpZWxkTmFtZSk7XG5cbiAgICAgICAgaWYgKGxpbmtlcikge1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgaXQgaXMgYSBjYWNoZWQgbGlua1xuICAgICAgICAgICAgLy8gaWYgeWVzLCB0aGVuIHdlIG5lZWQgdG8gZXhwbGljaXRseSBkZWZpbmUgdGhpcyBhdCBjb2xsZWN0aW9uIGxldmVsXG4gICAgICAgICAgICAvLyBzbyB3aGVuIHdlIHRyYW5zZm9ybSB0aGUgZGF0YSBmb3IgZGVsaXZlcnksIHdlIG1vdmUgaXQgdG8gdGhlIGxpbmsgbmFtZVxuICAgICAgICAgICAgaWYgKGxpbmtlci5pc0Rlbm9ybWFsaXplZCgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpbmtlci5pc1N1YkJvZHlEZW5vcm1hbGl6ZWQoYm9keSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlRGVub3JtYWxpemVkKHJvb3QsIGxpbmtlciwgYm9keSwgZmllbGROYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHN1YnJvb3QgPSBuZXcgQ29sbGVjdGlvbk5vZGUobGlua2VyLmdldExpbmtlZENvbGxlY3Rpb24oKSwgYm9keSwgZmllbGROYW1lKTtcbiAgICAgICAgICAgIHJvb3QuYWRkKHN1YnJvb3QsIGxpbmtlcik7XG5cbiAgICAgICAgICAgIGNyZWF0ZU5vZGVzKHN1YnJvb3QpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2tpbmcgaWYgaXQncyBhIHJlZHVjZXJcbiAgICAgICAgY29uc3QgcmVkdWNlciA9IHJvb3QuY29sbGVjdGlvbi5nZXRSZWR1Y2VyKGZpZWxkTmFtZSk7XG5cbiAgICAgICAgaWYgKHJlZHVjZXIpIHtcbiAgICAgICAgICAgIGxldCByZWR1Y2VyTm9kZSA9IG5ldyBSZWR1Y2VyTm9kZShmaWVsZE5hbWUsIHJlZHVjZXIpO1xuICAgICAgICAgICAgcm9vdC5hZGQocmVkdWNlck5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaXQncyBtb3N0IGxpa2VseSBhIGZpZWxkIHRoZW5cbiAgICAgICAgYWRkRmllbGROb2RlKGJvZHksIGZpZWxkTmFtZSwgcm9vdCk7XG4gICAgfSk7XG5cbiAgICBjcmVhdGVSZWR1Y2Vycyhyb290KTtcblxuICAgIGlmIChyb290LmZpZWxkTm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJvb3QuYWRkKG5ldyBGaWVsZE5vZGUoJ19pZCcsIDEpKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzUHJvamVjdGlvbk9wZXJhdG9yRXhwcmVzc2lvbihib2R5KSB7XG4gICAgaWYgKF8uaXNPYmplY3QoYm9keSkpIHtcbiAgICAgICAgY29uc3Qga2V5cyA9IF8ua2V5cyhib2R5KTtcbiAgICAgICAgcmV0dXJuIGtleXMubGVuZ3RoID09PSAxICYmIF8uY29udGFpbnMoWyckZWxlbU1hdGNoJywgJyRtZXRhJywgJyRzbGljZSddLCBrZXlzWzBdKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIEBwYXJhbSBib2R5XG4gKiBAcGFyYW0gZmllbGROYW1lXG4gKiBAcGFyYW0gcm9vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRmllbGROb2RlKGJvZHksIGZpZWxkTmFtZSwgcm9vdCkge1xuICAgIC8vIGl0J3Mgbm90IGEgbGluayBhbmQgbm90IGEgc3BlY2lhbCB2YXJpYWJsZSA9PiB3ZSBhc3N1bWUgaXQncyBhIGZpZWxkXG4gICAgaWYgKF8uaXNPYmplY3QoYm9keSkpIHtcbiAgICAgICAgaWYgKCFpc1Byb2plY3Rpb25PcGVyYXRvckV4cHJlc3Npb24oYm9keSkpIHtcbiAgICAgICAgICAgIGxldCBkb3R0ZWQgPSBkb3RpemUuY29udmVydCh7W2ZpZWxkTmFtZV06IGJvZHl9KTtcbiAgICAgICAgICAgIF8uZWFjaChkb3R0ZWQsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgcm9vdC5hZGQobmV3IEZpZWxkTm9kZShrZXksIHZhbHVlKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJvb3QuYWRkKG5ldyBGaWVsZE5vZGUoZmllbGROYW1lLCBib2R5LCB0cnVlKSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgZmllbGROb2RlID0gbmV3IEZpZWxkTm9kZShmaWVsZE5hbWUsIGJvZHkpO1xuICAgICAgICByb290LmFkZChmaWVsZE5vZGUpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIG5hbWVzcGFjZSBmb3Igbm9kZSB3aGVuIHVzaW5nIHF1ZXJ5IHBhdGggc2NvcGluZy5cbiAqXG4gKiBAcGFyYW0gbm9kZVxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5vZGVOYW1lc3BhY2Uobm9kZSkge1xuICAgIGNvbnN0IHBhcnRzID0gW107XG4gICAgbGV0IG4gPSBub2RlO1xuICAgIHdoaWxlIChuKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBuLmxpbmtlciA/IG4ubGlua2VyLmxpbmtOYW1lIDogbi5jb2xsZWN0aW9uLl9uYW1lO1xuICAgICAgICBwYXJ0cy5wdXNoKG5hbWUpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGlua2VyJywgbm9kZS5saW5rZXIgPyBub2RlLmxpbmtlci5saW5rTmFtZSA6IG5vZGUuY29sbGVjdGlvbi5fbmFtZSk7XG4gICAgICAgIG4gPSBuLnBhcmVudDtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnRzLnJldmVyc2UoKS5qb2luKCdfJyk7XG59XG5cbi8qKlxuICogQHBhcmFtIGNvbGxlY3Rpb25cbiAqIEBwYXJhbSBib2R5XG4gKiBAcmV0dXJucyB7Q29sbGVjdGlvbk5vZGV9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBib2R5KSB7XG4gICAgbGV0IHJvb3QgPSBuZXcgQ29sbGVjdGlvbk5vZGUoY29sbGVjdGlvbiwgYm9keSk7XG4gICAgY3JlYXRlTm9kZXMocm9vdCk7XG5cbiAgICByZXR1cm4gcm9vdDtcbn07XG5cbi8qKlxuICogQWRzIGRlbm9ybWFsaXphdGlvbiBjb25maWcgcHJvcGVybHksIGluY2x1ZGluZyBfaWRcbiAqXG4gKiBAcGFyYW0gcm9vdFxuICogQHBhcmFtIGxpbmtlclxuICogQHBhcmFtIGJvZHlcbiAqIEBwYXJhbSBmaWVsZE5hbWVcbiAqL1xuZnVuY3Rpb24gaGFuZGxlRGVub3JtYWxpemVkKHJvb3QsIGxpbmtlciwgYm9keSwgZmllbGROYW1lKSB7XG4gICAgT2JqZWN0LmFzc2lnbihib2R5LCB7X2lkOiAxfSk7XG5cbiAgICBjb25zdCBjYWNoZUZpZWxkID0gbGlua2VyLmxpbmtDb25maWcuZGVub3JtYWxpemUuZmllbGQ7XG4gICAgcm9vdC5zbmFwQ2FjaGUoY2FjaGVGaWVsZCwgZmllbGROYW1lKTtcblxuICAgIC8vIGlmIGl0J3Mgb25lIGFuZCBkaXJlY3QgYWxzbyBpbmNsdWRlIHRoZSBsaW5rIHN0b3JhZ2VcbiAgICBpZiAoIWxpbmtlci5pc01hbnkoKSAmJiAhbGlua2VyLmlzVmlydHVhbCgpKSB7XG4gICAgICAgIGFkZEZpZWxkTm9kZSgxLCBsaW5rZXIubGlua1N0b3JhZ2VGaWVsZCwgcm9vdCk7XG4gICAgfVxuXG4gICAgYWRkRmllbGROb2RlKGJvZHksIGNhY2hlRmllbGQsIHJvb3QpO1xufSIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS92YXJkYXJzL2RvdGl6ZVxuZXhwb3J0IGRlZmF1bHQgZG90aXplID0ge307XG5cbmRvdGl6ZS5jb252ZXJ0ID0gZnVuY3Rpb24ob2JqLCBwcmVmaXgpIHtcbiAgICBpZiAoKCFvYmogfHwgdHlwZW9mIG9iaiAhPSBcIm9iamVjdFwiKSAmJiAhQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICAgIHZhciBuZXdPYmogPSB7fTtcbiAgICAgICAgICAgIG5ld09ialtwcmVmaXhdID0gb2JqO1xuICAgICAgICAgICAgcmV0dXJuIG5ld09iajtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbmV3T2JqID0ge307XG5cbiAgICBmdW5jdGlvbiByZWN1cnNlKG8sIHAsIGlzQXJyYXlJdGVtKSB7XG4gICAgICAgIGZvciAodmFyIGYgaW4gbykge1xuICAgICAgICAgICAgaWYgKG9bZl0gJiYgdHlwZW9mIG9bZl0gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvW2ZdKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNFbXB0eUFycmF5KG9bZl0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmpbZ2V0RmllbGROYW1lKGYsIHAsIHRydWUpXSA9IG9bZl07IC8vIGVtcHR5IGFycmF5XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmogPSByZWN1cnNlKG9bZl0sIGdldEZpZWxkTmFtZShmLCBwLCBmYWxzZSwgdHJ1ZSksIHRydWUpOyAvLyBhcnJheVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQXJyYXlJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNFbXB0eU9iaihvW2ZdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld09ialtnZXRGaWVsZE5hbWUoZiwgcCwgdHJ1ZSldID0gb1tmXTsgLy8gZW1wdHkgb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iaiA9IHJlY3Vyc2Uob1tmXSwgZ2V0RmllbGROYW1lKGYsIHAsIHRydWUpKTsgLy8gYXJyYXkgaXRlbSBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0VtcHR5T2JqKG9bZl0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqW2dldEZpZWxkTmFtZShmLCBwKV0gPSBvW2ZdOyAvLyBlbXB0eSBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqID0gcmVjdXJzZShvW2ZdLCBnZXRGaWVsZE5hbWUoZiwgcCkpOyAvLyBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzQXJyYXlJdGVtIHx8IGlzTnVtYmVyKGYpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld09ialtnZXRGaWVsZE5hbWUoZiwgcCwgdHJ1ZSldID0gb1tmXTsgLy8gYXJyYXkgaXRlbSBwcmltaXRpdmVcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXdPYmpbZ2V0RmllbGROYW1lKGYsIHApXSA9IG9bZl07IC8vIHByaW1pdGl2ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0VtcHR5T2JqKG5ld09iaikpXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuXG4gICAgICAgIHJldHVybiBuZXdPYmo7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNOdW1iZXIoZikge1xuICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlSW50KGYpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0VtcHR5T2JqKG9iaikge1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNFbXB0eUFycmF5KG8pIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkobykgJiYgby5sZW5ndGggPT0gMClcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RmllbGROYW1lKGZpZWxkLCBwcmVmaXgsIGlzQXJyYXlJdGVtLCBpc0FycmF5KSB7XG4gICAgICAgIGlmIChpc0FycmF5KVxuICAgICAgICAgICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiBcIlwiKSArIChpc051bWJlcihmaWVsZCkgPyBcIltcIiArIGZpZWxkICsgXCJdXCIgOiBcIi5cIiArIGZpZWxkKTtcbiAgICAgICAgZWxzZSBpZiAoaXNBcnJheUl0ZW0pXG4gICAgICAgICAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6IFwiXCIpICsgXCJbXCIgKyBmaWVsZCArIFwiXVwiO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCArIFwiLlwiIDogXCJcIikgKyBmaWVsZDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVjdXJzZShvYmosIHByZWZpeCwgQXJyYXkuaXNBcnJheShvYmopKTtcbn07IiwiaW1wb3J0IGRvdCBmcm9tICdkb3Qtb2JqZWN0JztcbmltcG9ydCB7X30gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuXG4vKipcbiAqIEdpdmVuIGEgbmFtZWQgcXVlcnkgdGhhdCBoYXMgYSBzcGVjaWZpYyBib2R5LCB5b3UgY2FuIHF1ZXJ5IGl0cyBzdWJib2R5XG4gKiBUaGlzIHBlcmZvcm1zIGFuIGludGVyc2VjdGlvbiBvZiB0aGUgYm9kaWVzIGFsbG93ZWQgaW4gZWFjaFxuICpcbiAqIEBwYXJhbSBhbGxvd2VkQm9keVxuICogQHBhcmFtIGNsaWVudEJvZHlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGFsbG93ZWRCb2R5LCBjbGllbnRCb2R5KSB7XG4gICAgY29uc3QgYWxsb3dlZEJvZHlEb3QgPSBfLmtleXMoZG90LmRvdChhbGxvd2VkQm9keSkpO1xuICAgIGNvbnN0IGNsaWVudEJvZHlEb3QgPSBfLmtleXMoZG90LmRvdChjbGllbnRCb2R5KSk7XG5cbiAgICBjb25zdCBpbnRlcnNlY3Rpb24gPSBfLmludGVyc2VjdGlvbihhbGxvd2VkQm9keURvdCwgY2xpZW50Qm9keURvdCk7XG5cbiAgICBjb25zdCBidWlsZCA9IHt9O1xuICAgIGludGVyc2VjdGlvbi5mb3JFYWNoKGludGVyc2VjdGVkRmllbGQgPT4ge1xuICAgICAgICBidWlsZFtpbnRlcnNlY3RlZEZpZWxkXSA9IDE7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZG90Lm9iamVjdChidWlsZCk7XG59IiwiLy8gMS4gQ2xvbmUgY2hpbGRyZW4gd2l0aCBtZXRhIHJlbGF0aW9uc2hpcHNcbi8vIDIuIEFwcGx5ICRtZXRhZGF0YSB0byBjaGlsZHJlblxuLy8gMy4gUmVtb3ZlcyBsaW5rIHN0b3JhZ2UgKGlmIG5vdCBzcGVjaWZpZWQpXG4vLyA0LiBTdG9yZXMgb25lUmVzdWx0IGxpbmtzIGFzIGEgc2luZ2xlIG9iamVjdCBpbnN0ZWFkIG9mIGFycmF5XG5pbXBvcnQgYXBwbHlSZWR1Y2VycyBmcm9tICcuLi9yZWR1Y2Vycy9saWIvYXBwbHlSZWR1Y2Vycyc7XG5pbXBvcnQgY2xlYW5SZWR1Y2VyTGVmdG92ZXJzIGZyb20gJy4uL3JlZHVjZXJzL2xpYi9jbGVhblJlZHVjZXJMZWZ0b3ZlcnMnO1xuaW1wb3J0IHNpZnQgZnJvbSAnc2lmdCc7XG5pbXBvcnQge01pbmltb25nb30gZnJvbSAnbWV0ZW9yL21pbmltb25nbyc7XG5cbmV4cG9ydCBkZWZhdWx0IChub2RlLCBwYXJhbXMpID0+IHtcbiAgICBzbmFwQmFja0NhY2hlcyhub2RlKTtcbiAgICBzdG9yZU9uZVJlc3VsdHMobm9kZSwgbm9kZS5yZXN1bHRzKTtcblxuICAgIGFwcGx5UmVkdWNlcnMobm9kZSwgcGFyYW1zKTtcblxuICAgIF8uZWFjaChub2RlLmNvbGxlY3Rpb25Ob2RlcywgY29sbGVjdGlvbk5vZGUgPT4ge1xuICAgICAgICBjbG9uZU1ldGFDaGlsZHJlbihjb2xsZWN0aW9uTm9kZSwgbm9kZS5yZXN1bHRzKVxuICAgIH0pO1xuXG4gICAgXy5lYWNoKG5vZGUuY29sbGVjdGlvbk5vZGVzLCBjb2xsZWN0aW9uTm9kZSA9PiB7XG4gICAgICAgIGFzc2VtYmxlTWV0YWRhdGEoY29sbGVjdGlvbk5vZGUsIG5vZGUucmVzdWx0cylcbiAgICB9KTtcblxuICAgIGNsZWFuUmVkdWNlckxlZnRvdmVycyhub2RlLCBub2RlLnJlc3VsdHMpO1xuXG4gICAgcmVtb3ZlTGlua1N0b3JhZ2VzKG5vZGUsIG5vZGUucmVzdWx0cyk7XG5cbiAgICBhcHBseVBvc3RGaWx0ZXJzKG5vZGUpO1xuICAgIGFwcGx5UG9zdE9wdGlvbnMobm9kZSk7XG4gICAgYXBwbHlQb3N0RmlsdGVyKG5vZGUsIHBhcmFtcyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseVBvc3RGaWx0ZXJzKG5vZGUpIHtcbiAgICBjb25zdCBwb3N0RmlsdGVycyA9IG5vZGUucHJvcHMuJHBvc3RGaWx0ZXJzO1xuICAgIGlmIChwb3N0RmlsdGVycykge1xuICAgICAgICBub2RlLnJlc3VsdHMgPSBzaWZ0KHBvc3RGaWx0ZXJzLCBub2RlLnJlc3VsdHMpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5UG9zdE9wdGlvbnMobm9kZSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBub2RlLnByb3BzLiRwb3N0T3B0aW9ucztcbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucy5zb3J0KSB7XG4gICAgICAgICAgICBjb25zdCBzb3J0ZXIgPSBuZXcgTWluaW1vbmdvLlNvcnRlcihvcHRpb25zLnNvcnQpO1xuICAgICAgICAgICAgbm9kZS5yZXN1bHRzLnNvcnQoc29ydGVyLmdldENvbXBhcmF0b3IoKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMubGltaXQgfHwgb3B0aW9ucy5za2lwKSB7XG4gICAgICAgICAgICBjb25zdCBzdGFydCA9IG9wdGlvbnMuc2tpcCB8fCAwO1xuICAgICAgICAgICAgY29uc3QgZW5kID0gb3B0aW9ucy5saW1pdCA/IG9wdGlvbnMubGltaXQgKyBzdGFydCA6IG5vZGUucmVzdWx0cy5sZW5ndGg7XG4gICAgICAgICAgICBub2RlLnJlc3VsdHMgPSBub2RlLnJlc3VsdHMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuLyoqXG4gKiBPcHRpb25hbGx5IGFwcGxpZXMgYSBwb3N0IGZpbHRlcmluZyBvcHRpb25cbiAqL1xuZnVuY3Rpb24gYXBwbHlQb3N0RmlsdGVyKG5vZGUsIHBhcmFtcykge1xuICAgIGlmIChub2RlLnByb3BzLiRwb3N0RmlsdGVyKSB7XG4gICAgICAgIGNvbnN0IGZpbHRlciA9IG5vZGUucHJvcHMuJHBvc3RGaWx0ZXI7XG5cbiAgICAgICAgaWYgKF8uaXNBcnJheShmaWx0ZXIpKSB7XG4gICAgICAgICAgICBmaWx0ZXIuZm9yRWFjaChmID0+IHtcbiAgICAgICAgICAgICAgICBub2RlLnJlc3VsdHMgPSBmKG5vZGUucmVzdWx0cywgcGFyYW1zKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLnJlc3VsdHMgPSBmaWx0ZXIobm9kZS5yZXN1bHRzLCBwYXJhbXMpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqXG4gKiBIZWxwZXIgZnVuY3Rpb24gd2hpY2ggdHJhbnNmb3JtcyByZXN1bHRzIGludG8gdGhlIGFycmF5LlxuICogUmVzdWx0cyBhcmUgYW4gb2JqZWN0IGZvciAnb25lJyBsaW5rcy5cbiAqXG4gKiBAcGFyYW0gcmVzdWx0c1xuICogQHJldHVybiBhcnJheVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVzdWx0c0FycmF5KHJlc3VsdHMpIHtcbiAgICBpZiAoXy5pc0FycmF5KHJlc3VsdHMpKSB7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbiAgICBlbHNlIGlmIChfLmlzVW5kZWZpbmVkKHJlc3VsdHMpKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgcmV0dXJuIFtyZXN1bHRzXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUxpbmtTdG9yYWdlcyhub2RlLCBzYW1lTGV2ZWxSZXN1bHRzKSB7XG4gICAgaWYgKCFzYW1lTGV2ZWxSZXN1bHRzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzYW1lTGV2ZWxSZXN1bHRzID0gZ2V0UmVzdWx0c0FycmF5KHNhbWVMZXZlbFJlc3VsdHMpO1xuXG4gICAgXy5lYWNoKG5vZGUuY29sbGVjdGlvbk5vZGVzLCBjb2xsZWN0aW9uTm9kZSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbW92ZVN0b3JhZ2VGaWVsZCA9IGNvbGxlY3Rpb25Ob2RlLnNob3VsZENsZWFuU3RvcmFnZTtcbiAgICAgXG4gICAgICAgIF8uZWFjaChzYW1lTGV2ZWxSZXN1bHRzLCByZXN1bHQgPT4ge1xuICAgICAgICAgICAgaWYgKHJlbW92ZVN0b3JhZ2VGaWVsZCkge1xuICAgICAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uTm9kZS5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hpbGRSZXN1bHRzID0gZ2V0UmVzdWx0c0FycmF5KHJlc3VsdFtjb2xsZWN0aW9uTm9kZS5saW5rTmFtZV0pO1xuICAgICAgICAgICAgICAgICAgICBfLmVhY2goY2hpbGRSZXN1bHRzLCBjaGlsZFJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgY2hpbGRSZXN1bHRbY29sbGVjdGlvbk5vZGUubGlua1N0b3JhZ2VGaWVsZF07XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRbY29sbGVjdGlvbk5vZGUubGlua1N0b3JhZ2VGaWVsZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZW1vdmVMaW5rU3RvcmFnZXMoY29sbGVjdGlvbk5vZGUsIHJlc3VsdFtjb2xsZWN0aW9uTm9kZS5saW5rTmFtZV0pO1xuICAgICAgICB9KVxuICAgIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdG9yZU9uZVJlc3VsdHMobm9kZSwgc2FtZUxldmVsUmVzdWx0cykge1xuICAgIGlmICghc2FtZUxldmVsUmVzdWx0cykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbm9kZS5jb2xsZWN0aW9uTm9kZXMuZm9yRWFjaChjb2xsZWN0aW9uTm9kZSA9PiB7XG4gICAgICAgIF8uZWFjaChzYW1lTGV2ZWxSZXN1bHRzLCByZXN1bHQgPT4ge1xuICAgICAgICAgICAgLy8gVGhlIHJlYXNvbiB3ZSBhcmUgZG9pbmcgdGhpcyBpcyB0aGF0IGlmIHRoZSByZXF1ZXN0ZWQgbGluayBkb2VzIG5vdCBleGlzdFxuICAgICAgICAgICAgLy8gSXQgd2lsbCBmYWlsIHdoZW4gd2UgdHJ5IHRvIGdldCB1bmRlZmluZWRbc29tZXRoaW5nXSBiZWxvd1xuICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdG9yZU9uZVJlc3VsdHMoY29sbGVjdGlvbk5vZGUsIHJlc3VsdFtjb2xsZWN0aW9uTm9kZS5saW5rTmFtZV0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoY29sbGVjdGlvbk5vZGUuaXNPbmVSZXN1bHQpIHtcbiAgICAgICAgICAgIF8uZWFjaChzYW1lTGV2ZWxSZXN1bHRzLCByZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRbY29sbGVjdGlvbk5vZGUubGlua05hbWVdICYmIF8uaXNBcnJheShyZXN1bHRbY29sbGVjdGlvbk5vZGUubGlua05hbWVdKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbY29sbGVjdGlvbk5vZGUubGlua05hbWVdID0gcmVzdWx0W2NvbGxlY3Rpb25Ob2RlLmxpbmtOYW1lXVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBfLmZpcnN0KHJlc3VsdFtjb2xsZWN0aW9uTm9kZS5saW5rTmFtZV0pXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSlcbn1cblxuZnVuY3Rpb24gY2xvbmVNZXRhQ2hpbGRyZW4obm9kZSwgcGFyZW50UmVzdWx0cykge1xuICAgIGlmICghcGFyZW50UmVzdWx0cykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGlua05hbWUgPSBub2RlLmxpbmtOYW1lO1xuICAgIGNvbnN0IGlzTWV0YSA9IG5vZGUuaXNNZXRhO1xuXG4gICAgLy8gcGFyZW50UmVzdWx0cyBtaWdodCBiZSBhbiBvYmplY3QgKGZvciB0eXBlPT1vbmUgbGlua3MpXG4gICAgcGFyZW50UmVzdWx0cyA9IGdldFJlc3VsdHNBcnJheShwYXJlbnRSZXN1bHRzKTtcblxuICAgIHBhcmVudFJlc3VsdHMuZm9yRWFjaChwYXJlbnRSZXN1bHQgPT4ge1xuICAgICAgICBpZiAoaXNNZXRhICYmIHBhcmVudFJlc3VsdFtsaW5rTmFtZV0pIHtcbiAgICAgICAgICAgIGlmIChub2RlLmlzT25lUmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcGFyZW50UmVzdWx0W2xpbmtOYW1lXSA9IE9iamVjdC5hc3NpZ24oe30sIHBhcmVudFJlc3VsdFtsaW5rTmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFyZW50UmVzdWx0W2xpbmtOYW1lXSA9IHBhcmVudFJlc3VsdFtsaW5rTmFtZV0ubWFwKG9iamVjdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBvYmplY3QpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbm9kZS5jb2xsZWN0aW9uTm9kZXMuZm9yRWFjaChjb2xsZWN0aW9uTm9kZSA9PiB7XG4gICAgICAgICAgICBjbG9uZU1ldGFDaGlsZHJlbihjb2xsZWN0aW9uTm9kZSwgcGFyZW50UmVzdWx0W2xpbmtOYW1lXSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVNZXRhZGF0YShub2RlLCBwYXJlbnRSZXN1bHRzKSB7XG4gICAgcGFyZW50UmVzdWx0cyA9IGdldFJlc3VsdHNBcnJheShwYXJlbnRSZXN1bHRzKTtcblxuICAgIC8vIGFzc2VtYmxpbmcgbWV0YWRhdGEgaXMgZGVwdGggZmlyc3RcbiAgICBub2RlLmNvbGxlY3Rpb25Ob2Rlcy5mb3JFYWNoKGNvbGxlY3Rpb25Ob2RlID0+IHtcbiAgICAgICAgXy5lYWNoKHBhcmVudFJlc3VsdHMsIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICBhc3NlbWJsZU1ldGFkYXRhKGNvbGxlY3Rpb25Ob2RlLCByZXN1bHRbbm9kZS5saW5rTmFtZV0pXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaWYgKG5vZGUuaXNNZXRhKSB7XG4gICAgICAgIGlmIChub2RlLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgXy5lYWNoKHBhcmVudFJlc3VsdHMsIHBhcmVudFJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRSZXN1bHQgPSBwYXJlbnRSZXN1bHRbbm9kZS5saW5rTmFtZV07XG5cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5pc09uZVJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXy5pc09iamVjdChjaGlsZFJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0b3JhZ2UgPSBjaGlsZFJlc3VsdFtub2RlLmxpbmtTdG9yYWdlRmllbGRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmVNZXRhZGF0YShjaGlsZFJlc3VsdCwgcGFyZW50UmVzdWx0LCBzdG9yYWdlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaChjaGlsZFJlc3VsdCwgb2JqZWN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0b3JhZ2UgPSBvYmplY3Rbbm9kZS5saW5rU3RvcmFnZUZpZWxkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlTWV0YWRhdGEob2JqZWN0LCBwYXJlbnRSZXN1bHQsIHN0b3JhZ2UsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5lYWNoKHBhcmVudFJlc3VsdHMsIHBhcmVudFJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRSZXN1bHQgPSBwYXJlbnRSZXN1bHRbbm9kZS5saW5rTmFtZV07XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RvcmFnZSA9IHBhcmVudFJlc3VsdFtub2RlLmxpbmtTdG9yYWdlRmllbGRdO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuaXNPbmVSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkUmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZU1ldGFkYXRhKGNoaWxkUmVzdWx0LCBwYXJlbnRSZXN1bHQsIHN0b3JhZ2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaChjaGlsZFJlc3VsdCwgb2JqZWN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlTWV0YWRhdGEob2JqZWN0LCBwYXJlbnRSZXN1bHQsIHN0b3JhZ2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc3RvcmVNZXRhZGF0YShlbGVtZW50LCBwYXJlbnRFbGVtZW50LCBzdG9yYWdlLCBpc1ZpcnR1YWwpIHtcbiAgICBpZiAoaXNWaXJ0dWFsKSB7XG4gICAgICAgIGxldCAkbWV0YWRhdGE7XG4gICAgICAgIGlmIChfLmlzQXJyYXkoc3RvcmFnZSkpIHtcbiAgICAgICAgICAgICRtZXRhZGF0YSA9IF8uZmluZChzdG9yYWdlLCBzdG9yYWdlSXRlbSA9PiBzdG9yYWdlSXRlbS5faWQgPT0gcGFyZW50RWxlbWVudC5faWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJG1ldGFkYXRhID0gc3RvcmFnZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW1lbnQuJG1ldGFkYXRhID0gXy5vbWl0KCRtZXRhZGF0YSwgJ19pZCcpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGV0ICRtZXRhZGF0YTtcbiAgICAgICAgaWYgKF8uaXNBcnJheShzdG9yYWdlKSkge1xuICAgICAgICAgICAgJG1ldGFkYXRhID0gXy5maW5kKHN0b3JhZ2UsIHN0b3JhZ2VJdGVtID0+IHN0b3JhZ2VJdGVtLl9pZCA9PSBlbGVtZW50Ll9pZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkbWV0YWRhdGEgPSBzdG9yYWdlO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbWVudC4kbWV0YWRhdGEgPSBfLm9taXQoJG1ldGFkYXRhLCAnX2lkJyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzbmFwQmFja0NhY2hlcyhub2RlKSB7XG4gICAgbm9kZS5jb2xsZWN0aW9uTm9kZXMuZm9yRWFjaChjb2xsZWN0aW9uTm9kZSA9PiB7XG4gICAgICAgIHNuYXBCYWNrQ2FjaGVzKGNvbGxlY3Rpb25Ob2RlKTtcbiAgICB9KTtcblxuICAgIGlmICghXy5pc0VtcHR5KG5vZGUuc25hcENhY2hlcykpIHtcbiAgICAgICAgLy8gcHJvY2VzcyBzdHVmZlxuICAgICAgICBfLmVhY2gobm9kZS5zbmFwQ2FjaGVzLCAobGlua05hbWUsIGNhY2hlRmllbGQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlzU2luZ2xlID0gXy5jb250YWlucyhub2RlLnNuYXBDYWNoZXNTaW5nbGVzLCBjYWNoZUZpZWxkKTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmtlciA9IG5vZGUuY29sbGVjdGlvbi5nZXRMaW5rZXIobGlua05hbWUpO1xuICAgICAgICAgICAgLy8gd2UgZG8gdGhpcyBiZWNhdXNlIGZvciBvbmUgZGlyZWN0IGFuZCBvbmUgbWV0YSBkaXJlY3QsIGlkIGlzIG5vdCBzdG9yZWRcbiAgICAgICAgICAgIGNvbnN0IHNob3VkU3RvcmVMaW5rU3RvcmFnZSA9ICFsaW5rZXIuaXNNYW55KCkgJiYgIWxpbmtlci5pc1ZpcnR1YWwoKTtcblxuICAgICAgICAgICAgbm9kZS5yZXN1bHRzLmZvckVhY2gocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0W2NhY2hlRmllbGRdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzaG91ZFN0b3JlTGlua1N0b3JhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocmVzdWx0W2NhY2hlRmllbGRdLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiBsaW5rZXIuaXNNZXRhKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyByZXN1bHRbbGlua2VyLmxpbmtTdG9yYWdlRmllbGRdLl9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHJlc3VsdFtsaW5rZXIubGlua1N0b3JhZ2VGaWVsZF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzU2luZ2xlICYmIF8uaXNBcnJheShyZXN1bHRbY2FjaGVGaWVsZF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbbGlua05hbWVdID0gXy5maXJzdChyZXN1bHRbY2FjaGVGaWVsZF0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2xpbmtOYW1lXSA9IHJlc3VsdFtjYWNoZUZpZWxkXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRbY2FjaGVGaWVsZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG59XG4iLCJpbXBvcnQge2NoZWNrLCBNYXRjaH0gZnJvbSAnbWV0ZW9yL2NoZWNrJztcbmltcG9ydCBkZWVwQ2xvbmUgZnJvbSAnbG9kYXNoLmNsb25lZGVlcCc7XG5cbmZ1bmN0aW9uIGRlZmF1bHRGaWx0ZXJGdW5jdGlvbih7XG4gICAgZmlsdGVycyxcbiAgICBvcHRpb25zLFxuICAgIHBhcmFtc1xufSkge1xuICAgIGlmIChwYXJhbXMuZmlsdGVycykge1xuICAgICAgICBPYmplY3QuYXNzaWduKGZpbHRlcnMsIHBhcmFtcy5maWx0ZXJzKTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5vcHRpb25zKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24ob3B0aW9ucywgcGFyYW1zLm9wdGlvbnMpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYXBwbHlGaWx0ZXJSZWN1cnNpdmUoZGF0YSwgcGFyYW1zID0ge30sIGlzUm9vdCA9IGZhbHNlKSB7XG4gICAgaWYgKGlzUm9vdCAmJiAhXy5pc0Z1bmN0aW9uKGRhdGEuJGZpbHRlcikpIHtcbiAgICAgICAgZGF0YS4kZmlsdGVyID0gZGVmYXVsdEZpbHRlckZ1bmN0aW9uO1xuICAgIH1cblxuICAgIGlmIChkYXRhLiRmaWx0ZXIpIHtcbiAgICAgICAgY2hlY2soZGF0YS4kZmlsdGVyLCBNYXRjaC5PbmVPZihGdW5jdGlvbiwgW0Z1bmN0aW9uXSkpO1xuXG4gICAgICAgIGRhdGEuJGZpbHRlcnMgPSBkYXRhLiRmaWx0ZXJzIHx8IHt9O1xuICAgICAgICBkYXRhLiRvcHRpb25zID0gZGF0YS4kb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICBpZiAoXy5pc0FycmF5KGRhdGEuJGZpbHRlcikpIHtcbiAgICAgICAgICAgIGRhdGEuJGZpbHRlci5mb3JFYWNoKGZpbHRlciA9PiB7XG4gICAgICAgICAgICAgICAgZmlsdGVyLmNhbGwobnVsbCwge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzOiBkYXRhLiRmaWx0ZXJzLFxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBkYXRhLiRvcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHBhcmFtc1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRhdGEuJGZpbHRlcih7XG4gICAgICAgICAgICAgICAgZmlsdGVyczogZGF0YS4kZmlsdGVycyxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBkYXRhLiRvcHRpb25zLFxuICAgICAgICAgICAgICAgIHBhcmFtczogcGFyYW1zXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGEuJGZpbHRlciA9IG51bGw7XG4gICAgICAgIGRlbGV0ZShkYXRhLiRmaWx0ZXIpO1xuICAgIH1cblxuICAgIF8uZWFjaChkYXRhLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBhcHBseUZpbHRlclJlY3Vyc2l2ZSh2YWx1ZSwgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGFwcGx5UGFnaW5hdGlvbihib2R5LCBfcGFyYW1zKSB7XG4gICAgaWYgKGJvZHlbJyRwYWdpbmF0ZSddICYmIF9wYXJhbXMpIHtcbiAgICAgICAgaWYgKCFib2R5LiRvcHRpb25zKSB7XG4gICAgICAgICAgICBib2R5LiRvcHRpb25zID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3BhcmFtcy5saW1pdCkge1xuICAgICAgICAgICAgXy5leHRlbmQoYm9keS4kb3B0aW9ucywge1xuICAgICAgICAgICAgICAgIGxpbWl0OiBfcGFyYW1zLmxpbWl0XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF9wYXJhbXMuc2tpcCkge1xuICAgICAgICAgICAgXy5leHRlbmQoYm9keS4kb3B0aW9ucywge1xuICAgICAgICAgICAgICAgIHNraXA6IF9wYXJhbXMuc2tpcFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZSBib2R5WyckcGFnaW5hdGUnXTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IChfYm9keSwgX3BhcmFtcyA9IHt9KSA9PiB7XG4gICAgbGV0IGJvZHkgPSBkZWVwQ2xvbmUoX2JvZHkpO1xuICAgIGxldCBwYXJhbXMgPSBkZWVwQ2xvbmUoX3BhcmFtcyk7XG5cbiAgICBhcHBseVBhZ2luYXRpb24oYm9keSwgcGFyYW1zKTtcbiAgICBhcHBseUZpbHRlclJlY3Vyc2l2ZShib2R5LCBwYXJhbXMsIHRydWUpO1xuXG4gICAgcmV0dXJuIGJvZHk7XG59XG4iLCJpbXBvcnQgYXBwbHlQcm9wcyBmcm9tICcuL2FwcGx5UHJvcHMuanMnO1xuaW1wb3J0IHtnZXROb2RlTmFtZXNwYWNlfSBmcm9tICcuL2NyZWF0ZUdyYXBoJztcblxuLyoqXG4gKiBBZGRzIF9xdWVyeV9wYXRoIGZpZWxkcyB0byB0aGUgY3Vyc29yIGRvY3Mgd2hpY2ggYXJlIHVzZWQgZm9yIHNjb3BlZCBxdWVyeSBmaWx0ZXJpbmcgb24gdGhlIGNsaWVudC5cbiAqIFxuICogQHBhcmFtIGN1cnNvciBcbiAqIEBwYXJhbSBucyBcbiAqL1xuZnVuY3Rpb24gcGF0Y2hDdXJzb3IoY3Vyc29yLCBucykge1xuICAgIGNvbnN0IG9yaWdpbmFsT2JzZXJ2ZSA9IGN1cnNvci5vYnNlcnZlO1xuICAgIGN1cnNvci5vYnNlcnZlID0gZnVuY3Rpb24gKGNhbGxiYWNrcykge1xuICAgICAgICBjb25zdCBuZXdDYWxsYmFja3MgPSBPYmplY3QuYXNzaWduKHt9LCBjYWxsYmFja3MpO1xuICAgICAgICBpZiAoY2FsbGJhY2tzLmFkZGVkKSB7XG4gICAgICAgICAgICBuZXdDYWxsYmFja3MuYWRkZWQgPSBkb2MgPT4ge1xuICAgICAgICAgICAgICAgIGRvYyA9IF8uY2xvbmUoZG9jKTtcbiAgICAgICAgICAgICAgICBkb2NbYF9xdWVyeV9wYXRoXyR7bnN9YF0gPSAxO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5hZGRlZChkb2MpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3JpZ2luYWxPYnNlcnZlLmNhbGwoY3Vyc29yLCBuZXdDYWxsYmFja3MpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGNvbXBvc2Uobm9kZSwgdXNlcklkLCBjb25maWcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBmaW5kKHBhcmVudCkge1xuICAgICAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgICAgIGxldCB7ZmlsdGVycywgb3B0aW9uc30gPSBhcHBseVByb3BzKG5vZGUpO1xuXG4gICAgICAgICAgICAgICAgLy8gY29tcG9zaXRpb25cbiAgICAgICAgICAgICAgICBsZXQgbGlua2VyID0gbm9kZS5saW5rZXI7XG4gICAgICAgICAgICAgICAgbGV0IGFjY2Vzc29yID0gbGlua2VyLmNyZWF0ZUxpbmsocGFyZW50KTtcblxuICAgICAgICAgICAgICAgIC8vIHRoZSBydWxlIGlzIHRoaXMsIGlmIGEgY2hpbGQgSSB3YW50IHRvIGZldGNoIGlzIHZpcnR1YWwsIHRoZW4gSSB3YW50IHRvIGZldGNoIHRoZSBsaW5rIHN0b3JhZ2Ugb2YgdGhvc2UgZmllbGRzXG4gICAgICAgICAgICAgICAgaWYgKGxpbmtlci5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmZpZWxkcyA9IG9wdGlvbnMuZmllbGRzIHx8IHt9O1xuICAgICAgICAgICAgICAgICAgICBfLmV4dGVuZChvcHRpb25zLmZpZWxkcywge1xuICAgICAgICAgICAgICAgICAgICAgICAgW2xpbmtlci5saW5rU3RvcmFnZUZpZWxkXTogMVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBjdXJzb3IgPSBhY2Nlc3Nvci5maW5kKGZpbHRlcnMsIG9wdGlvbnMsIHVzZXJJZCk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbmZpZy5zY29wZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2hDdXJzb3IoY3Vyc29yLCBnZXROb2RlTmFtZXNwYWNlKG5vZGUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnNvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBjaGlsZHJlbjogXy5tYXAobm9kZS5jb2xsZWN0aW9uTm9kZXMsIG4gPT4gY29tcG9zZShuLCB1c2VySWQsIGNvbmZpZykpXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCAobm9kZSwgdXNlcklkLCBjb25maWcgPSB7YnlwYXNzRmlyZXdhbGxzOiBmYWxzZSwgc2NvcGVkOiBmYWxzZX0pID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBmaW5kKCkge1xuICAgICAgICAgICAgbGV0IHtmaWx0ZXJzLCBvcHRpb25zfSA9IGFwcGx5UHJvcHMobm9kZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGN1cnNvciA9IG5vZGUuY29sbGVjdGlvbi5maW5kKGZpbHRlcnMsIG9wdGlvbnMsIHVzZXJJZCk7XG4gICAgICAgICAgICBpZiAoY29uZmlnLnNjb3BlZCkge1xuICAgICAgICAgICAgICAgIHBhdGNoQ3Vyc29yKGN1cnNvciwgZ2V0Tm9kZU5hbWVzcGFjZShub2RlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY3Vyc29yO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNoaWxkcmVuOiBfLm1hcChub2RlLmNvbGxlY3Rpb25Ob2RlcywgbiA9PiB7XG4gICAgICAgICAgICBjb25zdCB1c2VySWRUb1Bhc3MgPSAoY29uZmlnLmJ5cGFzc0ZpcmV3YWxscykgPyB1bmRlZmluZWQgOiB1c2VySWQ7XG5cbiAgICAgICAgICAgIHJldHVybiBjb21wb3NlKG4sIHVzZXJJZFRvUGFzcywgY29uZmlnKTtcbiAgICAgICAgfSlcbiAgICB9XG59XG4iLCJpbXBvcnQgYXBwbHlQcm9wcyBmcm9tICcuL2FwcGx5UHJvcHMuanMnO1xuaW1wb3J0IHsgYXNzZW1ibGVNZXRhZGF0YSwgcmVtb3ZlTGlua1N0b3JhZ2VzLCBzdG9yZU9uZVJlc3VsdHMgfSBmcm9tICcuL3ByZXBhcmVGb3JEZWxpdmVyeSc7XG5pbXBvcnQgcHJlcGFyZUZvckRlbGl2ZXJ5IGZyb20gJy4vcHJlcGFyZUZvckRlbGl2ZXJ5JztcbmltcG9ydCB7Z2V0Tm9kZU5hbWVzcGFjZX0gZnJvbSAnLi9jcmVhdGVHcmFwaCc7XG5cbi8qKlxuICogVGhpcyBpcyBhbHdheXMgcnVuIGNsaWVudCBzaWRlIHRvIGJ1aWxkIHRoZSBkYXRhIGdyYXBoIG91dCBvZiBjbGllbnQtc2lkZSBjb2xsZWN0aW9ucy5cbiAqXG4gKiBAcGFyYW0gbm9kZVxuICogQHBhcmFtIHBhcmVudE9iamVjdFxuICogQHBhcmFtIGZldGNoT3B0aW9uc1xuICogQHJldHVybnMgeyp9XG4gKi9cbmZ1bmN0aW9uIGZldGNoKG5vZGUsIHBhcmVudE9iamVjdCwgZmV0Y2hPcHRpb25zID0ge30pIHtcbiAgICBsZXQge2ZpbHRlcnMsIG9wdGlvbnN9ID0gYXBwbHlQcm9wcyhub2RlKTtcbiAgICAvLyBhZGQgc3Vic2NyaXB0aW9uIGZpbHRlclxuICAgIGlmIChmZXRjaE9wdGlvbnMuc2NvcGVkICYmIGZldGNoT3B0aW9ucy5zdWJzY3JpcHRpb25IYW5kbGUpIHtcbiAgICAgICAgXy5leHRlbmQoZmlsdGVycywgZmV0Y2hPcHRpb25zLnN1YnNjcmlwdGlvbkhhbmRsZS5zY29wZVF1ZXJ5KCkpO1xuICAgIH1cbiAgICAvLyBhZGQgcXVlcnkgcGF0aCBmaWx0ZXJcbiAgICBpZiAoZmV0Y2hPcHRpb25zLnNjb3BlZCkge1xuICAgICAgICBfLmV4dGVuZChmaWx0ZXJzLCB7W2BfcXVlcnlfcGF0aF8ke2dldE5vZGVOYW1lc3BhY2Uobm9kZSl9YF06IHskZXhpc3RzOiB0cnVlfX0pO1xuICAgIH1cblxuICAgIGxldCByZXN1bHRzID0gW107XG5cbiAgICBpZiAocGFyZW50T2JqZWN0KSB7XG4gICAgICAgIGxldCBhY2Nlc3NvciA9IG5vZGUubGlua2VyLmNyZWF0ZUxpbmsocGFyZW50T2JqZWN0LCBub2RlLmNvbGxlY3Rpb24pO1xuXG4gICAgICAgIGlmIChub2RlLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgb3B0aW9ucy5maWVsZHMgPSBvcHRpb25zLmZpZWxkcyB8fCB7fTtcbiAgICAgICAgICAgIF8uZXh0ZW5kKG9wdGlvbnMuZmllbGRzLCB7XG4gICAgICAgICAgICAgICAgW25vZGUubGlua1N0b3JhZ2VGaWVsZF06IDFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0cyA9IGFjY2Vzc29yLmZpbmQoZmlsdGVycywgb3B0aW9ucykuZmV0Y2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzID0gbm9kZS5jb2xsZWN0aW9uLmZpbmQoZmlsdGVycywgb3B0aW9ucykuZmV0Y2goKTtcbiAgICB9XG5cbiAgICBfLmVhY2gobm9kZS5jb2xsZWN0aW9uTm9kZXMsIGNvbGxlY3Rpb25Ob2RlID0+IHtcbiAgICAgICAgXy5lYWNoKHJlc3VsdHMsIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9uTm9kZVJlc3VsdHMgPSBmZXRjaChjb2xsZWN0aW9uTm9kZSwgcmVzdWx0KTtcbiAgICAgICAgICAgIHJlc3VsdFtjb2xsZWN0aW9uTm9kZS5saW5rTmFtZV0gPSBjb2xsZWN0aW9uTm9kZVJlc3VsdHM7XG4gICAgICAgICAgICAvL2RlbGV0ZSByZXN1bHRbbm9kZS5saW5rZXIubGlua1N0b3JhZ2VGaWVsZF07XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogUHVzaCBpbnRvIHRoZSByZXN1bHRzLCBiZWNhdXNlIHNuYXBCYWNrQ2FjaGVzKCkgaW4gcHJlcGFyZUZvckRlbGl2ZXJ5IGRvZXMgbm90IHdvcmsgb3RoZXJ3aXNlLlxuICAgICAgICAgICAgICogVGhpcyBpcyBub24tb3B0aW1hbCwgY2FuIHdlIGJlIHN1cmUgdGhhdCBldmVyeSBpdGVtIGluIHJlc3VsdHMgY29udGFpbnMgX2lkIGFuZCBhZGQgb25seSBpZiBub3QgaW5cbiAgICAgICAgICAgICAqIHRoZSByZXN1bHRzP1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIE90aGVyIHBvc3NpYmxlIHdheXM6XG4gICAgICAgICAgICAgKiAtIGRvIHNvbWV0aGluZyBsaWtlIGFzc2VtYmxlKCkgaW4gc3RvcmVIeXBlcm5vdmFSZXN1bHRzXG4gICAgICAgICAgICAgKiAtIHBhc3Mgbm9kZS5yZXN1bHRzIHRvIGFjY2Vzc29yIGFib3ZlIGFuZCBmaW5kIHdpdGggc2lmdFxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIGNvbGxlY3Rpb25Ob2RlLnJlc3VsdHMucHVzaCguLi5jb2xsZWN0aW9uTm9kZVJlc3VsdHMpO1xuXG4gICAgICAgICAgICAvLyB0aGlzIHdhcyBub3Qgd29ya2luZyBiZWNhdXNlIGFsbCByZWZlcmVuY2VzIG11c3QgYmUgcmVwbGFjZWQgaW4gc25hcEJhY2tDYWNoZXMsIG5vdCBvbmx5IHRoZSBvbmVzIHRoYXQgYXJlIFxuICAgICAgICAgICAgLy8gZm91bmQgZmlyc3RcbiAgICAgICAgICAgIC8vIGNvbnN0IGN1cnJlbnRJZHMgPSBfLnBsdWNrKGNvbGxlY3Rpb25Ob2RlLnJlc3VsdHMsICdfaWQnKTtcbiAgICAgICAgICAgIC8vIGNvbGxlY3Rpb25Ob2RlLnJlc3VsdHMucHVzaCguLi5jb2xsZWN0aW9uTm9kZVJlc3VsdHMuZmlsdGVyKHJlcyA9PiAhXy5jb250YWlucyhjdXJyZW50SWRzLCByZXMuX2lkKSkpO1xuICAgICAgICB9KVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IChub2RlLCBwYXJhbXMsIGZldGNoT3B0aW9ucykgPT4ge1xuICAgIG5vZGUucmVzdWx0cyA9IGZldGNoKG5vZGUsIG51bGwsIGZldGNoT3B0aW9ucyk7XG5cbiAgICBwcmVwYXJlRm9yRGVsaXZlcnkobm9kZSwgcGFyYW1zKTtcblxuICAgIHJldHVybiBub2RlLnJlc3VsdHM7XG59XG4iLCJpbXBvcnQgRmllbGROb2RlIGZyb20gJy4vZmllbGROb2RlLmpzJztcbmltcG9ydCBSZWR1Y2VyTm9kZSBmcm9tICcuL3JlZHVjZXJOb2RlLmpzJztcbmltcG9ydCBkZWVwQ2xvbmUgZnJvbSAnbG9kYXNoLmNsb25lZGVlcCc7XG5pbXBvcnQge2NoZWNrLCBNYXRjaH0gZnJvbSAnbWV0ZW9yL2NoZWNrJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29sbGVjdGlvbk5vZGUge1xuICAgIGNvbnN0cnVjdG9yKGNvbGxlY3Rpb24sIGJvZHkgPSB7fSwgbGlua05hbWUgPSBudWxsKSB7XG4gICAgICAgIGlmIChjb2xsZWN0aW9uICYmICFfLmlzT2JqZWN0KGJvZHkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLWJvZHknLCBgVGhlIGZpZWxkIFwiJHtsaW5rTmFtZX1cIiBpcyBhIGNvbGxlY3Rpb24gbGluaywgYW5kIHNob3VsZCBoYXZlIGl0cyBib2R5IGRlZmluZWQgYXMgYW4gb2JqZWN0LmApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ib2R5ID0gZGVlcENsb25lKGJvZHkpO1xuICAgICAgICB0aGlzLmxpbmtOYW1lID0gbGlua05hbWU7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb247XG5cbiAgICAgICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgICAgICB0aGlzLnByb3BzID0ge307XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5saW5rZXIgPSBudWxsO1xuICAgICAgICB0aGlzLmxpbmtTdG9yYWdlRmllbGQgPSBudWxsO1xuICAgICAgICB0aGlzLnNjaGVkdWxlZEZvckRlbGV0aW9uID0gZmFsc2U7XG4gICAgICAgIHRoaXMucmVkdWNlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5yZXN1bHRzID0gW107XG4gICAgICAgIHRoaXMuc25hcENhY2hlcyA9IHt9OyAvLyB7Y2FjaGVGaWVsZDogbGlua05hbWV9XG4gICAgICAgIHRoaXMuc25hcENhY2hlc1NpbmdsZXMgPSBbXTsgLy8gW2NhY2hlRmllbGQxLCBjYWNoZUZpZWxkMl1cbiAgICB9XG5cbiAgICBnZXQgY29sbGVjdGlvbk5vZGVzKCkge1xuICAgICAgICByZXR1cm4gXy5maWx0ZXIodGhpcy5ub2RlcywgbiA9PiBuIGluc3RhbmNlb2YgQ29sbGVjdGlvbk5vZGUpXG4gICAgfVxuXG4gICAgZ2V0IGZpZWxkTm9kZXMoKSB7XG4gICAgICAgIHJldHVybiBfLmZpbHRlcih0aGlzLm5vZGVzLCBuID0+IG4gaW5zdGFuY2VvZiBGaWVsZE5vZGUpO1xuICAgIH1cblxuICAgIGdldCByZWR1Y2VyTm9kZXMoKSB7XG4gICAgICAgIHJldHVybiBfLmZpbHRlcih0aGlzLm5vZGVzLCBuID0+IG4gaW5zdGFuY2VvZiBSZWR1Y2VyTm9kZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBjaGlsZHJlbiB0byBpdHNlbGZcbiAgICAgKlxuICAgICAqIEBwYXJhbSBub2RlXG4gICAgICogQHBhcmFtIGxpbmtlclxuICAgICAqL1xuICAgIGFkZChub2RlLCBsaW5rZXIpIHtcbiAgICAgICAgbm9kZS5wYXJlbnQgPSB0aGlzO1xuXG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRmllbGROb2RlKSB7XG4gICAgICAgICAgICBydW5GaWVsZFNhbml0eUNoZWNrcyhub2RlLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAobGlua2VyKSB7XG4gICAgICAgICAgICBub2RlLmxpbmtlciA9IGxpbmtlcjtcbiAgICAgICAgICAgIG5vZGUubGlua1N0b3JhZ2VGaWVsZCA9IGxpbmtlci5saW5rU3RvcmFnZUZpZWxkO1xuICAgICAgICAgICAgbm9kZS5pc01ldGEgPSBsaW5rZXIuaXNNZXRhKCk7XG4gICAgICAgICAgICBub2RlLmlzVmlydHVhbCA9IGxpbmtlci5pc1ZpcnR1YWwoKTtcbiAgICAgICAgICAgIG5vZGUuaXNPbmVSZXN1bHQgPSBsaW5rZXIuaXNPbmVSZXN1bHQoKTtcbiAgICAgICAgICAgIG5vZGUuc2hvdWxkQ2xlYW5TdG9yYWdlID0gdGhpcy5fc2hvdWxkQ2xlYW5TdG9yYWdlKG5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ub2Rlcy5wdXNoKG5vZGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBwcm9wXG4gICAgICogQHBhcmFtIHZhbHVlXG4gICAgICovXG4gICAgYWRkUHJvcChwcm9wLCB2YWx1ZSkge1xuICAgICAgICBpZiAocHJvcCA9PT0gJyRwb3N0RmlsdGVyJykge1xuICAgICAgICAgICAgY2hlY2sodmFsdWUsIE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBbRnVuY3Rpb25dKSlcbiAgICAgICAgfVxuXG4gICAgICAgIF8uZXh0ZW5kKHRoaXMucHJvcHMsIHtcbiAgICAgICAgICAgIFtwcm9wXTogdmFsdWVcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIF9ub2RlXG4gICAgICovXG4gICAgcmVtb3ZlKF9ub2RlKSB7XG4gICAgICAgIHRoaXMubm9kZXMgPSBfLmZpbHRlcih0aGlzLm5vZGVzLCBub2RlID0+IF9ub2RlICE9PSBub2RlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gZmlsdGVyc1xuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICovXG4gICAgYXBwbHlGaWVsZHMoZmlsdGVycywgb3B0aW9ucykge1xuICAgICAgICBsZXQgaGFzQWRkZWRBbnlGaWVsZCA9IGZhbHNlO1xuXG4gICAgICAgIF8uZWFjaCh0aGlzLmZpZWxkTm9kZXMsIG4gPT4ge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAkbWV0YSBmaWVsZCBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIG9wdGlvbnMuZmllbGRzLCBidXQgTW9uZ29EQiBkb2VzIG5vdCBleGNsdWRlIG90aGVyIGZpZWxkcy5cbiAgICAgICAgICAgICAqIFRoZXJlZm9yZSwgd2UgZG8gbm90IGNvdW50IHRoaXMgYXMgYSBmaWVsZCBhZGRpdGlvbi5cbiAgICAgICAgICAgICAqIFxuICAgICAgICAgICAgICogU2VlOiBodHRwczovL2RvY3MubW9uZ29kYi5jb20vbWFudWFsL3JlZmVyZW5jZS9vcGVyYXRvci9wcm9qZWN0aW9uL21ldGEvXG4gICAgICAgICAgICAgKiBUaGUgJG1ldGEgZXhwcmVzc2lvbiBzcGVjaWZpZXMgdGhlIGluY2x1c2lvbiBvZiB0aGUgZmllbGQgdG8gdGhlIHJlc3VsdCBzZXQgXG4gICAgICAgICAgICAgKiBhbmQgZG9lcyBub3Qgc3BlY2lmeSB0aGUgZXhjbHVzaW9uIG9mIHRoZSBvdGhlciBmaWVsZHMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChuLnByb2plY3Rpb25PcGVyYXRvciAhPT0gJyRtZXRhJykge1xuICAgICAgICAgICAgICAgIGhhc0FkZGVkQW55RmllbGQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbi5hcHBseUZpZWxkcyhvcHRpb25zLmZpZWxkcylcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gaXQgd2lsbCBvbmx5IGdldCBoZXJlIGlmIGl0IGhhcyBjb2xsZWN0aW9uTm9kZXMgY2hpbGRyZW5cbiAgICAgICAgXy5lYWNoKHRoaXMuY29sbGVjdGlvbk5vZGVzLCAoY29sbGVjdGlvbk5vZGUpID0+IHtcbiAgICAgICAgICAgIGxldCBsaW5rZXIgPSBjb2xsZWN0aW9uTm9kZS5saW5rZXI7XG5cbiAgICAgICAgICAgIGlmIChsaW5rZXIgJiYgIWxpbmtlci5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuZmllbGRzW2xpbmtlci5saW5rU3RvcmFnZUZpZWxkXSA9IDE7XG4gICAgICAgICAgICAgICAgaGFzQWRkZWRBbnlGaWVsZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGlmIGhlIHNlbGVjdGVkIGZpbHRlcnMsIHdlIHNob3VsZCBhdXRvbWF0aWNhbGx5IGFkZCB0aG9zZSBmaWVsZHNcbiAgICAgICAgXy5lYWNoKGZpbHRlcnMsICh2YWx1ZSwgZmllbGQpID0+IHtcbiAgICAgICAgICAgIC8vIHNwZWNpYWwgaGFuZGxpbmcgZm9yIHRoZSAkbWV0YSBmaWx0ZXIsIGNvbmRpdGlvbmFsIG9wZXJhdG9ycyBhbmQgdGV4dCBzZWFyY2hcbiAgICAgICAgICAgIGlmICghXy5jb250YWlucyhbJyRvcicsICckbm9yJywgJyRub3QnLCAnJGFuZCcsICckbWV0YScsICckdGV4dCddLCBmaWVsZCkpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgZmllbGQgb3IgdGhlIHBhcmVudCBvZiB0aGUgZmllbGQgYWxyZWFkeSBleGlzdHMsIGRvbid0IGFkZCBpdFxuICAgICAgICAgICAgICAgIGlmICghXy5oYXMob3B0aW9ucy5maWVsZHMsIGZpZWxkLnNwbGl0KCcuJylbMF0pKXtcbiAgICAgICAgICAgICAgICAgICAgaGFzQWRkZWRBbnlGaWVsZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZmllbGRzW2ZpZWxkXSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWhhc0FkZGVkQW55RmllbGQpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuZmllbGRzID0ge1xuICAgICAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgICAgICAvLyBmaWVsZHMgbWlnaHQgY29udGFpbiAkbWV0YSBleHByZXNzaW9uLCBzbyBpdCBzaG91bGQgYmUgYWRkZWQgaGVyZSxcbiAgICAgICAgICAgICAgICAuLi5vcHRpb25zLmZpZWxkcyxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gZmllbGROYW1lXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgaGFzRmllbGQoZmllbGROYW1lLCBjaGVja05lc3RlZCA9IGZhbHNlKSB7XG4gICAgICAgIC8vIGZvciBjaGVja05lc3RlZCBmbGFnIGl0IGV4cGFuZHMgcHJvZmlsZS5waG9uZS52ZXJpZmllZCBpbnRvIFxuICAgICAgICAvLyBbJ3Byb2ZpbGUnLCAncHJvZmlsZS5waG9uZScsICdwcm9maWxlLnBob25lLnZlcmlmaWVkJ11cbiAgICAgICAgLy8gaWYgYW55IG9mIHRoZXNlIGZpZWxkcyBtYXRjaCBpdCBtZWFucyB0aGF0IGZpZWxkIGV4aXN0c1xuICAgICAgICBjb25zdCBvcHRpb25zID0gY2hlY2tOZXN0ZWQgPyBmaWVsZE5hbWUuc3BsaXQoJy4nKS5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAoYWNjLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IFtsYXN0XSA9IGFjYztcbiAgICAgICAgICAgIHJldHVybiBbLi4uYWNjLCBgJHtsYXN0fS4ke2tleX1gXTtcbiAgICAgICAgfSwgW10pIDogW2ZpZWxkTmFtZV07XG5cbiAgICAgICAgcmV0dXJuICEhXy5maW5kKHRoaXMuZmllbGROb2RlcywgZmllbGROb2RlID0+IHtcbiAgICAgICAgICAgIHJldHVybiBfLmNvbnRhaW5zKG9wdGlvbnMsIGZpZWxkTm9kZS5uYW1lKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGZpZWxkTmFtZVxuICAgICAqIEByZXR1cm5zIHtGaWVsZE5vZGV9XG4gICAgICovXG4gICAgZ2V0RmllbGQoZmllbGROYW1lKSB7XG4gICAgICAgIHJldHVybiBfLmZpbmQodGhpcy5maWVsZE5vZGVzLCBmaWVsZE5vZGUgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkTm9kZS5uYW1lID09IGZpZWxkTmFtZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgaGFzQ29sbGVjdGlvbk5vZGUobmFtZSkge1xuICAgICAgICByZXR1cm4gISFfLmZpbmQodGhpcy5jb2xsZWN0aW9uTm9kZXMsIG5vZGUgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUubGlua05hbWUgPT0gbmFtZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgaGFzUmVkdWNlck5vZGUobmFtZSkge1xuICAgICAgICByZXR1cm4gISFfLmZpbmQodGhpcy5yZWR1Y2VyTm9kZXMsIG5vZGUgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUubmFtZSA9PSBuYW1lXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcmV0dXJucyB7UmVkdWNlck5vZGV9XG4gICAgICovXG4gICAgZ2V0UmVkdWNlck5vZGUobmFtZSkge1xuICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMucmVkdWNlck5vZGVzLCBub2RlID0+IHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLm5hbWUgPT0gbmFtZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICogQHJldHVybnMge0NvbGxlY3Rpb25Ob2RlfVxuICAgICAqL1xuICAgIGdldENvbGxlY3Rpb25Ob2RlKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIF8uZmluZCh0aGlzLmNvbGxlY3Rpb25Ob2Rlcywgbm9kZSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5saW5rTmFtZSA9PSBuYW1lXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZ2V0TmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGlua05hbWVcbiAgICAgICAgICAgID8gdGhpcy5saW5rTmFtZVxuICAgICAgICAgICAgOiAodGhpcy5jb2xsZWN0aW9uID8gdGhpcy5jb2xsZWN0aW9uLl9uYW1lIDogJ04vQScpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgdXNlZCBmb3IgY2FjaGluZyBsaW5rc1xuICAgICAqXG4gICAgICogQHBhcmFtIGNhY2hlRmllbGRcbiAgICAgKiBAcGFyYW0gc3ViTGlua05hbWVcbiAgICAgKi9cbiAgICBzbmFwQ2FjaGUoY2FjaGVGaWVsZCwgc3ViTGlua05hbWUpIHtcbiAgICAgICAgdGhpcy5zbmFwQ2FjaGVzW2NhY2hlRmllbGRdID0gc3ViTGlua05hbWU7XG5cbiAgICAgICAgaWYgKHRoaXMuY29sbGVjdGlvbi5nZXRMaW5rZXIoc3ViTGlua05hbWUpLmlzT25lUmVzdWx0KCkpIHtcbiAgICAgICAgICAgIHRoaXMuc25hcENhY2hlc1NpbmdsZXMucHVzaChjYWNoZUZpZWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIHZlcmlmaWVzIHdoZXRoZXIgdG8gcmVtb3ZlIHRoZSBsaW5rU3RvcmFnZUZpZWxkIGZvcm0gdGhlIHJlc3VsdHNcbiAgICAgKiB1bmxlc3MgeW91IHNwZWNpZnkgaXQgaW4geW91ciBxdWVyeS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBub2RlXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2hvdWxkQ2xlYW5TdG9yYWdlKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUubGlua1N0b3JhZ2VGaWVsZCA9PT0gJ19pZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChub2RlLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhbm9kZS5oYXNGaWVsZChub2RlLmxpbmtTdG9yYWdlRmllbGQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIXRoaXMuaGFzRmllbGQobm9kZS5saW5rU3RvcmFnZUZpZWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBNYWtlIHN1cmUgdGhhdCB0aGUgZmllbGQgaXMgb2sgdG8gYmUgYWRkZWRcbiAqIEBwYXJhbSB7Kn0gZmllbGROYW1lIFxuICovXG5leHBvcnQgZnVuY3Rpb24gcnVuRmllbGRTYW5pdHlDaGVja3MoZmllbGROYW1lKSB7XG4gICAgLy8gUnVuIHNhbml0eSBjaGVja3Mgb24gdGhlIGZpZWxkXG4gICAgaWYgKGZpZWxkTmFtZVswXSA9PT0gJyQnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgWW91IGFyZSBub3QgYWxsb3dlZCB0byB1c2UgZmllbGRzIHRoYXQgc3RhcnQgd2l0aCAkIGluc2lkZSBhIHJlZHVjZXIncyBib2R5OiAke2ZpZWxkTmFtZX1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpZWxkTm9kZSB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgYm9keSwgaXNQcm9qZWN0aW9uT3BlcmF0b3IgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnByb2plY3Rpb25PcGVyYXRvciA9IGlzUHJvamVjdGlvbk9wZXJhdG9yID8gXy5rZXlzKGJvZHkpWzBdIDogbnVsbDtcbiAgICAgICAgdGhpcy5ib2R5ID0gIV8uaXNPYmplY3QoYm9keSkgfHwgaXNQcm9qZWN0aW9uT3BlcmF0b3IgPyBib2R5IDogMTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZWRGb3JEZWxldGlvbiA9IGZhbHNlO1xuICAgIH1cblxuICAgIGFwcGx5RmllbGRzKGZpZWxkcykge1xuICAgICAgICBmaWVsZHNbdGhpcy5uYW1lXSA9IHRoaXMuYm9keTtcbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVkdWNlck5vZGUge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIHtib2R5LCByZWR1Y2V9KSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgIHRoaXMucmVkdWNlRnVuY3Rpb24gPSByZWR1Y2U7XG4gICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzID0gW107IC8vIFRoaXMgaXMgYSBsaXN0IG9mIHRoZSByZWR1Y2VyIHRoaXMgcmVkdWNlciB1c2VzLlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdoZW4gY29tcHV0aW5nIHdlIGFsc28gcGFzcyB0aGUgcGFyYW1ldGVyc1xuICAgICAqIFxuICAgICAqIEBwYXJhbSB7Kn0gb2JqZWN0IFxuICAgICAqIEBwYXJhbSB7Kn0gYXJncyBcbiAgICAgKi9cbiAgICBjb21wdXRlKG9iamVjdCwgLi4uYXJncykge1xuICAgICAgICBvYmplY3RbdGhpcy5uYW1lXSA9IHRoaXMucmVkdWNlLmNhbGwodGhpcywgb2JqZWN0LCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICByZWR1Y2Uob2JqZWN0LCAuLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlZHVjZUZ1bmN0aW9uLmNhbGwodGhpcywgb2JqZWN0LCAuLi5hcmdzKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgY2hlY2sgfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuaW1wb3J0IGFkZEZpZWxkTWFwIGZyb20gJy4vbGliL2FkZEZpZWxkTWFwJztcblxuY29uc3Qgc3RvcmFnZSA9ICdfX3JlZHVjZXJzJztcbk9iamVjdC5hc3NpZ24oTW9uZ28uQ29sbGVjdGlvbi5wcm90b3R5cGUsIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqL1xuICAgIGFkZFJlZHVjZXJzKGRhdGEpIHtcbiAgICAgICAgaWYgKCF0aGlzW3N0b3JhZ2VdKSB7XG4gICAgICAgICAgICB0aGlzW3N0b3JhZ2VdID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBfLmVhY2goZGF0YSwgKHJlZHVjZXJDb25maWcsIHJlZHVjZXJOYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXNbcmVkdWNlckNvbmZpZ10pIHtcbiAgICAgICAgICAgICAgICB0aGlzW3JlZHVjZXJDb25maWddID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmdldExpbmtlcihyZWR1Y2VyTmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICAgICBgWW91IGNhbm5vdCBhZGQgdGhlIHJlZHVjZXIgd2l0aCBuYW1lOiAke3JlZHVjZXJOYW1lfSBiZWNhdXNlIGl0IGlzIGFscmVhZHkgZGVmaW5lZCBhcyBhIGxpbmsgaW4gJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX25hbWVcbiAgICAgICAgICAgICAgICAgICAgfSBjb2xsZWN0aW9uYFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzW3JlZHVjZXJDb25maWddW3JlZHVjZXJOYW1lXSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIGBZb3UgY2Fubm90IGFkZCB0aGUgcmVkdWNlciB3aXRoIG5hbWU6ICR7cmVkdWNlck5hbWV9IGJlY2F1c2UgaXQgd2FzIGFscmVhZHkgYWRkZWQgdG8gJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX25hbWVcbiAgICAgICAgICAgICAgICAgICAgfSBjb2xsZWN0aW9uYFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNoZWNrKHJlZHVjZXJDb25maWcsIHtcbiAgICAgICAgICAgICAgICBib2R5OiBPYmplY3QsXG4gICAgICAgICAgICAgICAgcmVkdWNlOiBGdW5jdGlvbixcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBfLmV4dGVuZCh0aGlzW3N0b3JhZ2VdLCB7XG4gICAgICAgICAgICAgICAgW3JlZHVjZXJOYW1lXTogcmVkdWNlckNvbmZpZyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBnZXRSZWR1Y2VyKG5hbWUpIHtcbiAgICAgICAgaWYgKHRoaXNbc3RvcmFnZV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW3N0b3JhZ2VdW25hbWVdO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRoaXMgY3JlYXRlcyByZWR1Y2VycyB0aGF0IG1ha2VzIHNvcnQgb2YgYWxpYXNlcyBmb3IgdGhlIGRhdGFiYXNlIGZpZWxkcyB3ZSB1c2VcbiAgICAgKi9cbiAgICBhZGRGaWVsZE1hcCxcbn0pO1xuIiwiLyoqXG4gKiBAcGFyYW0ge1tuaWNlRmllbGQ6IHN0cmluZ106IGRiRmllbGR9IG1hcFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRGaWVsZE1hcChtYXApIHtcbiAgICBjb25zdCBjb2xsZWN0aW9uID0gdGhpcztcbiAgICBsZXQgcmVkdWNlcnMgPSB7fTtcbiAgICBmb3IgKGxldCBrZXkgaW4gbWFwKSB7XG4gICAgICAgIGNvbnN0IGRiRmllbGQgPSBtYXBba2V5XTtcbiAgICAgICAgcmVkdWNlcnNba2V5XSA9IHtcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICBbZGJGaWVsZF06IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVkdWNlKG9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmpbZGJGaWVsZF07XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbGxlY3Rpb24uYWRkUmVkdWNlcnMocmVkdWNlcnMpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXBwbHlSZWR1Y2Vycyhyb290LCBwYXJhbXMpIHtcbiAgICBfLmVhY2gocm9vdC5jb2xsZWN0aW9uTm9kZXMsIG5vZGUgPT4ge1xuICAgICAgICBhcHBseVJlZHVjZXJzKG5vZGUsIHBhcmFtcyk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm9jZXNzZWRSZWR1Y2VycyA9IFtdO1xuICAgIGxldCByZWR1Y2Vyc1F1ZXVlID0gWy4uLnJvb3QucmVkdWNlck5vZGVzXTtcblxuICAgIC8vIFRPRE86IGZpbmQgb3V0IGlmIHRoZXJlJ3MgYW4gaW5maW5pdGUgcmVkdWNlciBpbnRlci1kZWVuZGVuY3lcblxuICAgIHdoaWxlIChyZWR1Y2Vyc1F1ZXVlLmxlbmd0aCkge1xuICAgICAgICBjb25zdCByZWR1Y2VyTm9kZSA9IHJlZHVjZXJzUXVldWUuc2hpZnQoKTtcblxuICAgICAgICAvLyBJZiB0aGlzIHJlZHVjZXIgZGVwZW5kcyBvbiBvdGhlciByZWR1Y2Vyc1xuICAgICAgICBpZiAocmVkdWNlck5vZGUuZGVwZW5kZW5jaWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgYW4gdW5wcm9jZXNzZWQgcmVkdWNlciwgbW92ZSBpdCBhdCB0aGUgZW5kIG9mIHRoZSBxdWV1ZVxuICAgICAgICAgICAgY29uc3QgYWxsRGVwZW5kZW5jaWVzQ29tcHV0ZWQgPSBfLmFsbChyZWR1Y2VyTm9kZS5kZXBlbmRlbmNpZXMsIGRlcCA9PiBwcm9jZXNzZWRSZWR1Y2Vycy5pbmNsdWRlcyhkZXApKTtcbiAgICAgICAgICAgIGlmIChhbGxEZXBlbmRlbmNpZXNDb21wdXRlZCkge1xuICAgICAgICAgICAgICAgIHJvb3QucmVzdWx0cy5mb3JFYWNoKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlZHVjZXJOb2RlLmNvbXB1dGUocmVzdWx0LCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHByb2Nlc3NlZFJlZHVjZXJzLnB1c2gocmVkdWNlck5vZGUubmFtZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE1vdmUgaXQgYXQgdGhlIGVuZCBvZiB0aGUgcXVldWVcbiAgICAgICAgICAgICAgICByZWR1Y2Vyc1F1ZXVlLnB1c2gocmVkdWNlck5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcm9vdC5yZXN1bHRzLmZvckVhY2gocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICByZWR1Y2VyTm9kZS5jb21wdXRlKHJlc3VsdCwgcGFyYW1zKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwcm9jZXNzZWRSZWR1Y2Vycy5wdXNoKHJlZHVjZXJOb2RlLm5hbWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IGRvdCBmcm9tICdkb3Qtb2JqZWN0JztcblxuLyoqXG4gKiBAcGFyYW0gcm9vdFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjbGVhblJlZHVjZXJMZWZ0b3ZlcnMocm9vdCwgcmVzdWx0cykge1xuICAgIF8uZWFjaChyb290LmNvbGxlY3Rpb25Ob2Rlcywgbm9kZSA9PiB7XG4gICAgICAgIGlmIChub2RlLnNjaGVkdWxlZEZvckRlbGV0aW9uKSB7XG4gICAgICAgICAgICByZXN1bHRzLmZvckVhY2gocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICBkZWxldGUgcmVzdWx0W25vZGUubGlua05hbWVdO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgXy5lYWNoKHJvb3QuY29sbGVjdGlvbk5vZGVzLCBub2RlID0+IHtcbiAgICAgICAgbGV0IGNoaWxkUmVzdWx0cztcbiAgICAgICAgaWYgKG5vZGUuaXNPbmVSZXN1bHQpIHtcbiAgICAgICAgICAgIGNoaWxkUmVzdWx0cyA9IHJlc3VsdHMubWFwKHJlc3VsdCA9PiByZXN1bHRbbm9kZS5saW5rTmFtZV0pLmZpbHRlcihlbGVtZW50ID0+ICEhZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGlsZFJlc3VsdHMgPSBfLmZsYXR0ZW4ocmVzdWx0cy5tYXAocmVzdWx0ID0+IHJlc3VsdFtub2RlLmxpbmtOYW1lXSkuZmlsdGVyKGVsZW1lbnQgPT4gISFlbGVtZW50KSk7XG4gICAgICAgIH1cblxuICAgICAgICBjbGVhblJlZHVjZXJMZWZ0b3ZlcnMobm9kZSwgY2hpbGRSZXN1bHRzKTtcbiAgICB9KTtcblxuICAgIF8uZWFjaChyb290LmZpZWxkTm9kZXMsIG5vZGUgPT4ge1xuICAgICAgICBpZiAobm9kZS5zY2hlZHVsZWRGb3JEZWxldGlvbikge1xuICAgICAgICAgICAgY2xlYW5OZXN0ZWRGaWVsZHMobm9kZS5uYW1lLnNwbGl0KCcuJyksIHJlc3VsdHMsIHJvb3QpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBfLmVhY2gocm9vdC5yZWR1Y2VyTm9kZXMsIG5vZGUgPT4ge1xuICAgICAgICBpZiAobm9kZS5zY2hlZHVsZWRGb3JEZWxldGlvbikge1xuICAgICAgICAgICAgcmVzdWx0cy5mb3JFYWNoKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJlc3VsdFtub2RlLm5hbWVdO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cbi8vIGlmIHdlIHN0b3JlIGEgZmllbGQgbGlrZTogJ3Byb2ZpbGUuZmlyc3ROYW1lJ1xuLy8gdGhlbiB3ZSBuZWVkIHRvIGRlbGV0ZSBwcm9maWxlOiB7IGZpcnN0TmFtZSB9XG4vLyBpZiBwcm9maWxlIHdpbGwgaGF2ZSBlbXB0eSBrZXlzLCB3ZSBuZWVkIHRvIGRlbGV0ZSBwcm9maWxlLlxuXG4vKipcbiAqIENsZWFucyB3aGF0IHJlZHVjZXJzIG5lZWRlZCB0byBiZSBjb21wdXRlZCBhbmQgbm90IHVzZWQuXG4gKiBAcGFyYW0gcGFydHNcbiAqIEBwYXJhbSByZXN1bHRzXG4gKi9cbmZ1bmN0aW9uIGNsZWFuTmVzdGVkRmllbGRzKHBhcnRzLCByZXN1bHRzLCByb290KSB7XG4gICAgY29uc3Qgc25hcENhY2hlRmllbGQgPSByb290LnNuYXBDYWNoZXNbcGFydHNbMF1dO1xuICAgIGNvbnN0IGZpZWxkTmFtZSA9IHNuYXBDYWNoZUZpZWxkID8gc25hcENhY2hlRmllbGQgOiBwYXJ0c1swXTtcblxuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmVzdWx0cy5mb3JFYWNoKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICBpZiAoXy5pc09iamVjdChyZXN1bHQpICYmIGZpZWxkTmFtZSAhPT0gJ19pZCcpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgcmVzdWx0W2ZpZWxkTmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwYXJ0cy5zaGlmdCgpO1xuICAgIGNsZWFuTmVzdGVkRmllbGRzKFxuICAgICAgICBwYXJ0cywgXG4gICAgICAgIHJlc3VsdHNcbiAgICAgICAgICAgIC5maWx0ZXIocmVzdWx0ID0+ICEhcmVzdWx0W2ZpZWxkTmFtZV0pXG4gICAgICAgICAgICAubWFwKHJlc3VsdCA9PiByZXN1bHRbZmllbGROYW1lXSksXG4gICAgICAgIHJvb3RcbiAgICApO1xuICAgIFxuICAgIHJlc3VsdHMuZm9yRWFjaChyZXN1bHQgPT4ge1xuICAgICAgICBpZiAoXy5pc09iamVjdChyZXN1bHRbZmllbGROYW1lXSkgJiYgXy5rZXlzKHJlc3VsdFtmaWVsZE5hbWVdKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGlmIChmaWVsZE5hbWUgIT09ICdfaWQnKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJlc3VsdFtmaWVsZE5hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcbn1cbiIsImltcG9ydCBkb3QgZnJvbSAnZG90LW9iamVjdCc7XG5pbXBvcnQgeyBjcmVhdGVOb2RlcyB9IGZyb20gJy4uLy4uL2xpYi9jcmVhdGVHcmFwaCc7XG5pbXBvcnQgQ29sbGVjdGlvbk5vZGUgZnJvbSAnLi4vLi4vbm9kZXMvY29sbGVjdGlvbk5vZGUnO1xuaW1wb3J0IEZpZWxkTm9kZSBmcm9tICcuLi8uLi9ub2Rlcy9maWVsZE5vZGUnO1xuaW1wb3J0IFJlZHVjZXJOb2RlIGZyb20gJy4uLy4uL25vZGVzL3JlZHVjZXJOb2RlJztcbmltcG9ydCBlbWJlZFJlZHVjZXJXaXRoTGluayBmcm9tICcuL2VtYmVkUmVkdWNlcldpdGhMaW5rJztcbmltcG9ydCB7IHNwZWNpYWxGaWVsZHMgfSBmcm9tICcuLi8uLi9saWIvY3JlYXRlR3JhcGgnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRSZWR1Y2Vycyhyb290KSB7XG4gICAgLy8gd2UgYWRkIHJlZHVjZXJzIGxhc3QsIGFmdGVyIHdlIGhhdmUgYWRkZWQgYWxsIHRoZSBmaWVsZHMuXG4gICAgcm9vdC5yZWR1Y2VyTm9kZXMuZm9yRWFjaChyZWR1Y2VyID0+IHtcbiAgICAgICAgXy5lYWNoKHJlZHVjZXIuYm9keSwgKGJvZHksIGZpZWxkTmFtZSkgPT4ge1xuICAgICAgICAgICAgaGFuZGxlQWRkRWxlbWVudChyZWR1Y2VyLCByb290LCBmaWVsZE5hbWUsIGJvZHkpO1xuICAgICAgICB9KVxuICAgIH0pO1xufVxuXG4vKipcbiAqIEBwYXJhbSByb290XG4gKiBAcGFyYW0gZmllbGROYW1lXG4gKiBAcGFyYW0gYm9keVxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlQWRkRWxlbWVudChyZWR1Y2VyTm9kZSwgcm9vdCwgZmllbGROYW1lLCBib2R5KSB7XG4gICAgLy8gaWYgaXQncyBhIGxpbmtcbiAgICBjb25zdCBjb2xsZWN0aW9uID0gcm9vdC5jb2xsZWN0aW9uO1xuICAgIGNvbnN0IGxpbmtlciA9IGNvbGxlY3Rpb24uZ2V0TGlua2VyKGZpZWxkTmFtZSk7XG4gICAgaWYgKGxpbmtlcikge1xuICAgICAgICByZXR1cm4gaGFuZGxlQWRkTGluayhyZWR1Y2VyTm9kZSwgZmllbGROYW1lLCBib2R5LCByb290LCBsaW5rZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlZHVjZXIgPSBjb2xsZWN0aW9uLmdldFJlZHVjZXIoZmllbGROYW1lKTtcbiAgICBpZiAocmVkdWNlcikge1xuICAgICAgICByZWR1Y2VyTm9kZS5kZXBlbmRlbmNpZXMucHVzaChmaWVsZE5hbWUpO1xuICAgICAgICByZXR1cm4gaGFuZGxlQWRkUmVkdWNlcihmaWVsZE5hbWUsIHJlZHVjZXIsIHJvb3QpO1xuICAgIH1cblxuICAgIC8vIHdlIGFzc3VtZSBpdCdzIGEgZmllbGQgaW4gdGhpcyBjYXNlXG4gICAgcmV0dXJuIGhhbmRsZUFkZEZpZWxkKGZpZWxkTmFtZSwgYm9keSwgcm9vdCk7XG59XG5cbi8qKlxuICogQHBhcmFtIGZpZWxkTmFtZVxuICogQHBhcmFtIHJlZHVjZXJcbiAqIEBwYXJhbSByb290XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVBZGRSZWR1Y2VyKGZpZWxkTmFtZSwge2JvZHksIHJlZHVjZX0sIHJvb3QpIHtcbiAgICBpZiAoIXJvb3QuaGFzUmVkdWNlck5vZGUoZmllbGROYW1lKSkge1xuICAgICAgICBsZXQgY2hpbGRSZWR1Y2VyTm9kZSA9IG5ldyBSZWR1Y2VyTm9kZShmaWVsZE5hbWUsIHtib2R5LCByZWR1Y2V9KTtcbiAgICAgICAgcm9vdC5hZGQoY2hpbGRSZWR1Y2VyTm9kZSk7XG4gICAgICAgIGNoaWxkUmVkdWNlck5vZGUuc2NoZWR1bGVkRm9yRGVsZXRpb24gPSB0cnVlO1xuXG4gICAgICAgIF8uZWFjaChjaGlsZFJlZHVjZXJOb2RlLmJvZHksIChib2R5LCBmaWVsZE5hbWUpID0+IHtcbiAgICAgICAgICAgIGhhbmRsZUFkZEVsZW1lbnQoY2hpbGRSZWR1Y2VyTm9kZSwgcm9vdCwgZmllbGROYW1lLCBib2R5KTtcbiAgICAgICAgfSlcbiAgICB9XG59XG5cbi8qKlxuICogQHBhcmFtIGZpZWxkTmFtZVxuICogQHBhcmFtIGJvZHlcbiAqIEBwYXJhbSByb290XG4gKiBAcGFyYW0gbGlua2VyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVBZGRMaW5rKHJlZHVjZXJOb2RlLCBmaWVsZE5hbWUsIGJvZHksIHBhcmVudCwgbGlua2VyKSB7XG4gICAgaWYgKHBhcmVudC5oYXNDb2xsZWN0aW9uTm9kZShmaWVsZE5hbWUpKSB7XG4gICAgICAgIGNvbnN0IGNvbGxlY3Rpb25Ob2RlID0gcGFyZW50LmdldENvbGxlY3Rpb25Ob2RlKGZpZWxkTmFtZSk7XG5cbiAgICAgICAgZW1iZWRSZWR1Y2VyV2l0aExpbmsocmVkdWNlck5vZGUsIGJvZHksIGNvbGxlY3Rpb25Ob2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBhZGRcbiAgICAgICAgbGV0IGNvbGxlY3Rpb25Ob2RlID0gbmV3IENvbGxlY3Rpb25Ob2RlKGxpbmtlci5nZXRMaW5rZWRDb2xsZWN0aW9uKCksIGJvZHksIGZpZWxkTmFtZSk7XG4gICAgICAgIGNvbGxlY3Rpb25Ob2RlLnNjaGVkdWxlZEZvckRlbGV0aW9uID0gdHJ1ZTtcbiAgICAgICAgcGFyZW50LmFkZChjb2xsZWN0aW9uTm9kZSwgbGlua2VyKTtcblxuICAgICAgICBjcmVhdGVOb2Rlcyhjb2xsZWN0aW9uTm9kZSk7XG4gICAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSBmaWVsZE5hbWVcbiAqIEBwYXJhbSBib2R5XG4gKiBAcGFyYW0gcm9vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlQWRkRmllbGQoZmllbGROYW1lLCBib2R5LCByb290KSB7XG4gICAgaWYgKF8uY29udGFpbnMoc3BlY2lhbEZpZWxkcywgZmllbGROYW1lKSkge1xuICAgICAgICByb290LmFkZFByb3AoZmllbGROYW1lLCBib2R5KTtcblxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKF8uaXNPYmplY3QoYm9keSkpIHtcbiAgICAgICAgLy8gaWYgcmVkdWNlciBzcGVjaWZpZXMgYSBuZXN0ZWQgZmllbGRcbiAgICAgICAgLy8gaWYgaXQncyBhIHByb3BcbiAgICAgICAgY29uc3QgZG90cyA9IGRvdC5kb3Qoe1xuICAgICAgICAgICAgW2ZpZWxkTmFtZV06IGJvZHlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgXy5lYWNoKGRvdHMsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBhZGRGaWVsZElmUmVxdWlyZWQocm9vdCwga2V5LCB2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIHJlZHVjZXIgZG9lcyBub3Qgc3BlY2lmeSBhIG5lc3RlZCBmaWVsZCwgYW5kIHRoZSBmaWVsZCBkb2VzIG5vdCBleGlzdC5cbiAgICAgICAgYWRkRmllbGRJZlJlcXVpcmVkKHJvb3QsIGZpZWxkTmFtZSwgYm9keSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhZGRGaWVsZElmUmVxdWlyZWQocm9vdCwgZmllbGROYW1lLCBib2R5KSB7XG4gICAgaWYgKCFyb290Lmhhc0ZpZWxkKGZpZWxkTmFtZSwgdHJ1ZSkpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrIGlmIHRoZXJlIGFyZSBhbnkgbmVzdGVkIGZpZWxkcyBmb3IgdGhpcyBmaWVsZC5cbiAgICAgICAgICogQWRkaW5nIHJvb3QgZmllbGQgaGVyZSBhbmQgc2NoZWR1bGluZyBmb3IgZGVsZXRpb24gd291bGQgbm90IHdvcmsgaWYgdGhlcmUgaXMgYWxyZWFkeSBuZXN0ZWQgZmllbGQsIFxuICAgICAgICAgKiBmb3IgZXhhbXBsZTpcbiAgICAgICAgICogd2hlbiB0cnlpbmcgdG8gYWRkIG1ldGE6IDEsIGl0IHNob3VsZCBiZSBjaGVja2VkIHRoYXQgdGhlcmUgYXJlIG5vIG1ldGEuKiBmaWVsZHNcbiAgICAgICAgICogKi9cblxuICAgICAgICBjb25zdCBuZXN0ZWRGaWVsZHMgPSByb290LmZpZWxkTm9kZXMuZmlsdGVyKCh7bmFtZX0pID0+IG5hbWUuc3RhcnRzV2l0aChgJHtmaWVsZE5hbWV9LmApKTtcbiAgICAgICAgLy8gcmVtb3ZlIG5lc3RlZCBmaWVsZHMgLSBpbXBvcnRhbnQgZm9yIG1pbmltb25nbyB3aGljaCBjb21wbGFpbnMgZm9yIHRoZXNlIHNpdHVhdGlvbnNcbiAgICAgICAgLy8gVE9ETzogZXhjZXNzIGZpZWxkcyBhcmUgbm90IHJlbW92ZWQgKGNhdXNlZCBieSBhZGRpbmcgdGhlIHJvb3QgZmllbGQgYW5kIHJlbW92aW5nIG5lc3RlZCBmaWVsZHMpIGJ1dCB0aGVyZVxuICAgICAgICAvLyBzaG91bGQgcHJvYmFibHkgYmUgYSB3YXkgdG8gaGFuZGxlIHRoaXMgaW4gcG9zdC1wcm9jZXNzaW5nIC0gZm9yIGV4YW1wbGUgYnkga2VlcGluZyBhIHdoaXRlbGlzdCBvZiBmaWVsZHNcbiAgICAgICAgLy8gYW5kIHJlbW92aW5nIGFueXRoaW5nIGVsc2VcbiAgICAgICAgbmVzdGVkRmllbGRzLmZvckVhY2gobm9kZSA9PiByb290LnJlbW92ZShub2RlKSk7XG4gXG4gICAgICAgIGxldCBmaWVsZE5vZGUgPSBuZXcgRmllbGROb2RlKGZpZWxkTmFtZSwgYm9keSk7XG4gICAgICAgIC8vIGRlbGV0ZSBvbmx5IGlmIGFsbCBuZXN0ZWQgZmllbGRzIGFyZSBzY2hlZHVsZWQgZm9yIGRlbGV0aW9uICh0aGF0IGluY2x1ZGVzIHRoZSBjYXNlIG9mIDAgbmVzdGVkIGZpZWxkcylcbiAgICAgICAgZmllbGROb2RlLnNjaGVkdWxlZEZvckRlbGV0aW9uID0gbmVzdGVkRmllbGRzLmV2ZXJ5KGZpZWxkID0+IGZpZWxkLnNjaGVkdWxlZEZvckRlbGV0aW9uKTtcblxuICAgICAgICByb290LmFkZChmaWVsZE5vZGUpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7aGFuZGxlQWRkRmllbGQsIGhhbmRsZUFkZEVsZW1lbnQsIGhhbmRsZUFkZFJlZHVjZXJ9IGZyb20gJy4vY3JlYXRlUmVkdWNlcnMnO1xuXG4vKipcbiAqIEVtYmVkcyB0aGUgcmVkdWNlciBib2R5IHdpdGggYSBjb2xsZWN0aW9uIGJvZHlcbiAqIEBwYXJhbSByZWR1Y2VyQm9keVxuICogQHBhcmFtIGNvbGxlY3Rpb25Ob2RlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVtYmVkUmVkdWNlcldpdGhMaW5rKHJlZHVjZXJOb2RlLCByZWR1Y2VyQm9keSwgY29sbGVjdGlvbk5vZGUpIHtcbiAgICBfLmVhY2gocmVkdWNlckJvZHksICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uTm9kZS5jb2xsZWN0aW9uO1xuXG4gICAgICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgLy8gbmVzdGVkIGZpZWxkIG9yIGxpbmtcbiAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uTm9kZS5ib2R5W2tleV0pIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBpdCBleGlzdHNcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5rZXIgPSBjb2xsZWN0aW9uLmdldExpbmtlcihrZXkpO1xuXG4gICAgICAgICAgICAgICAgLy8gaWYgaXQncyBhIGxpbmtcbiAgICAgICAgICAgICAgICBpZiAobGlua2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5rZXIuaXNEZW5vcm1hbGl6ZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmtlci5pc1N1YkJvZHlEZW5vcm1hbGl6ZWQodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FjaGVGaWVsZCA9IGxpbmtlci5saW5rQ29uZmlnLmRlbm9ybWFsaXplLmZpZWxkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUFkZEZpZWxkKGNhY2hlRmllbGQsIHZhbHVlLCBjb2xsZWN0aW9uTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZW1iZWRSZWR1Y2VyV2l0aExpbmsocmVkdWNlck5vZGUsIHZhbHVlLCBjb2xsZWN0aW9uTm9kZS5nZXRDb2xsZWN0aW9uTm9kZShrZXkpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGhhbmRsZUFkZEZpZWxkKGtleSwgdmFsdWUsIGNvbGxlY3Rpb25Ob2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZG9lcyBub3QgZXhpc3QsIHNvIGl0IG1heSBiZSBhIGxpbmsvcmVkdWNlci9maWVsZFxuICAgICAgICAgICAgICAgIGhhbmRsZUFkZEVsZW1lbnQocmVkdWNlck5vZGUsIGNvbGxlY3Rpb25Ob2RlLCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGlmIHRoaXMgZmllbGQgb3Igb3RoZXIgcmVkdWNlciBleGlzdHMgd2l0aGluIHRoZSBjb2xsZWN0aW9uXG5cbiAgICAgICAgICAgIGlmICghY29sbGVjdGlvbk5vZGUuYm9keVtrZXldKSB7XG4gICAgICAgICAgICAgICAgLy8gY2FuIG9ubHkgYmUgZmllbGQgb3IgYW5vdGhlciByZWR1Y2VyIGZvciB0aGlzLlxuICAgICAgICAgICAgICAgIGNvbnN0IHJlZHVjZXIgPSBjb2xsZWN0aW9uLmdldFJlZHVjZXIoa2V5KTtcbiAgICAgICAgICAgICAgICBpZiAocmVkdWNlcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiBpdCdzIGFub3RoZXIgcmVkdWNlclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlQWRkUmVkdWNlcihrZXksIHJlZHVjZXIsIGNvbGxlY3Rpb25Ob2RlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlQWRkRmllbGQoa2V5LCB2YWx1ZSwgY29sbGVjdGlvbk5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcbn0iXX0=
