(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var check = Package.check.check;
var Match = Package.check.Match;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"herteby:denormalize":{"cache.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/herteby_denormalize/cache.js                                                                  //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
module.export({
  migrate: () => migrate,
  autoMigrate: () => autoMigrate
});

let _;

module.link("lodash", {
  default(v) {
    _ = v;
  }

}, 0);
let addMigration, migrate, autoMigrate;
module.link("./migrations.js", {
  addMigration(v) {
    addMigration = v;
  },

  migrate(v) {
    migrate = v;
  },

  autoMigrate(v) {
    autoMigrate = v;
  }

}, 1);

function flattenFields(object, prefix) {
  prefix = prefix || '';
  let fields = [];

  _.each(object, (val, key) => {
    if (typeof val == 'object') {
      fields = _.union(fields, flattenFields(val, prefix + key + '.'));
    } else {
      fields.push(prefix + key);
    }
  });

  return fields;
}

Mongo.Collection.prototype.cache = function (options) {
  check(options, {
    collection: Match.Where(collection => collection instanceof Mongo.Collection),
    fields: Match.OneOf([String], Object),
    type: Match.OneOf('one', 'many', 'inversed', 'inverse', 'many-inversed', 'many-inverse'),
    referenceField: String,
    cacheField: String,
    bypassSchema: Match.Optional(Boolean)
  });
  if (options.type == 'inverse') options.type = 'inversed'; //Not sure which is best, so why not support both and be typo-friendly

  if (options.type == 'many-inverse') options.type = 'many-inversed'; //Bypass collection2 schemas

  let parentCollection = options.bypassSchema && Package['aldeed:collection2'] ? this._collection : this;
  let childCollection = options.collection;
  let type = options.type;
  let referenceField = options.referenceField;
  let cacheField = options.cacheField;
  let watchedFields = options.fields;

  if (referenceField.split(/[.:]/)[0] == cacheField.split(/[.:]/)[0]) {
    throw new Error('referenceField and cacheField must not share the same top field');
  }

  if (!_.isArray(watchedFields)) {
    watchedFields = flattenFields(watchedFields);
  }

  let childFields = _.clone(watchedFields);

  if (type !== 'one') {
    if (!_.includes(childFields, '_id')) {
      childFields.push('_id');
    }

    _.pull(childFields, referenceField);
  }

  let childOpts = {
    transform: null,
    fields: {
      _id: 0
    }
  };

  _.each(childFields, field => childOpts.fields[field] = 1);

  let parentOpts = {
    transform: null,
    fields: {
      _id: 1,
      [cacheField]: 1
    }
  };

  if (type !== 'inversed' && type !== 'many-inversed') {
    parentOpts.fields[referenceField.split(':')[0]] = 1;
  }

  let idField, referencePath;

  if (type == 'many' || type == 'many-inversed') {
    referencePath = referenceField.replace(':', '.');
    idField = referenceField.split(':')[1];
    referenceField = referenceField.split(':')[0];
  }

  if (type == 'inversed' || type == 'many-inversed' && !_.includes(watchedFields, referencePath)) {
    watchedFields.push(referencePath || referenceField);
  }

  let topFields = _.uniq(watchedFields.map(field => field.split('.')[0]));

  function getNestedReferences(document) {
    //Used for nested references in "many" links
    let references = _.get(document, referenceField) || [];

    if (idField && references.length) {
      references = _.map(references, item => _.get(item, idField));
    }

    return _.uniq(_.flatten(references));
  }

  if (type == 'one') {
    let insert = function insert(userId, parent) {
      if (_.get(parent, referenceField)) {
        let child = childCollection.findOne(_.get(parent, referenceField), childOpts);

        if (child) {
          parentCollection.update(parent._id, {
            $set: {
              [cacheField]: child
            }
          });
        }
      }
    };

    addMigration(parentCollection, insert, options);
    parentCollection.after.insert(insert);
    parentCollection.after.update(function (userId, parent, changedFields) {
      if (_.includes(changedFields, referenceField.split('.')[0])) {
        let child = _.get(parent, referenceField) && childCollection.findOne(_.get(parent, referenceField), childOpts);

        if (child) {
          parentCollection.update(parent._id, {
            $set: {
              [cacheField]: child
            }
          });
        } else {
          parentCollection.update(parent._id, {
            $unset: {
              [cacheField]: 1
            }
          });
        }
      }
    });
    childCollection.after.insert(function (userId, child) {
      let pickedChild = _.pick(child, childFields);

      parentCollection.update({
        [referenceField]: child._id
      }, {
        $set: {
          [cacheField]: pickedChild
        }
      }, {
        multi: true
      });
    });
    childCollection.after.update(function (userId, child, changedFields) {
      if (_.intersection(changedFields, topFields).length) {
        let pickedChild = _.pick(child, childFields);

        parentCollection.update({
          [referenceField]: child._id
        }, {
          $set: {
            [cacheField]: pickedChild
          }
        }, {
          multi: true
        });
      }
    });
    childCollection.after.remove(function (userId, child) {
      parentCollection.update({
        [referenceField]: child._id
      }, {
        $unset: {
          [cacheField]: 1
        }
      }, {
        multi: true
      });
    });
  } else if (type == 'many') {
    let insert = function insert(userId, parent) {
      let references = getNestedReferences(parent);

      if (references.length) {
        let children = childCollection.find({
          _id: {
            $in: references
          }
        }, childOpts).fetch();
        parentCollection.update(parent._id, {
          $set: {
            [cacheField]: children
          }
        });
      } else {
        parentCollection.update(parent._id, {
          $set: {
            [cacheField]: []
          }
        });
      }
    };

    addMigration(parentCollection, insert, options);
    parentCollection.after.insert(insert);
    parentCollection.after.update(function (userId, parent, changedFields) {
      if (_.includes(changedFields, referencePath.split('.')[0])) {
        let references = getNestedReferences(parent);

        if (references.length) {
          let children = childCollection.find({
            _id: {
              $in: references
            }
          }, childOpts).fetch();
          parentCollection.update(parent._id, {
            $set: {
              [cacheField]: children
            }
          });
        } else {
          parentCollection.update(parent._id, {
            $set: {
              [cacheField]: []
            }
          });
        }
      }
    });
    childCollection.after.insert(function (userId, child) {
      let pickedChild = _.pick(child, childFields);

      parentCollection.update({
        [referencePath]: child._id
      }, {
        $push: {
          [cacheField]: pickedChild
        }
      }, {
        multi: true
      });
    });
    childCollection.after.update(function (userId, child, changedFields) {
      if (_.intersection(changedFields, topFields).length) {
        let pickedChild = _.pick(child, childFields);

        parentCollection.find({
          [referencePath]: child._id
        }, parentOpts).forEach(parent => {
          let index = _.findIndex(_.get(parent, cacheField), {
            _id: child._id
          });

          if (index > -1) {
            parentCollection.update(parent._id, {
              $set: {
                [cacheField + '.' + index]: pickedChild
              }
            });
          } else {
            parentCollection.update(parent._id, {
              $push: {
                [cacheField]: pickedChild
              }
            });
          }
        });
      }
    });
    childCollection.after.remove(function (userId, child) {
      parentCollection.update({
        [referencePath]: child._id
      }, {
        $pull: {
          [cacheField]: {
            _id: child._id
          }
        }
      }, {
        multi: true
      });
    });
  } else if (type == 'inversed') {
    let insert = function insert(userId, parent) {
      let children = childCollection.find({
        [referenceField]: parent._id
      }, childOpts).fetch();
      parentCollection.update(parent._id, {
        $set: {
          [cacheField]: children
        }
      });
    };

    addMigration(parentCollection, insert, options);
    parentCollection.after.insert(insert);
    parentCollection.after.update(function (userId, parent, changedFields) {
      if (_.includes(changedFields, referenceField.split('.')[0])) {
        if (_.get(parent, referenceField)) {
          let children = childCollection.find({
            [referenceField]: parent._id
          }, childOpts).fetch();
          parentCollection.update(parent._id, {
            $set: {
              [cacheField]: children
            }
          });
        } else {
          parentCollection.update(parent._id, {
            $set: {
              [cacheField]: []
            }
          });
        }
      }
    });
    childCollection.after.insert(function (userId, child) {
      let pickedChild = _.pick(child, childFields);

      if (_.get(child, referenceField)) {
        parentCollection.update({
          _id: _.get(child, referenceField)
        }, {
          $push: {
            [cacheField]: pickedChild
          }
        });
      }
    });
    childCollection.after.update(function (userId, child, changedFields) {
      if (_.intersection(changedFields, topFields).length) {
        let pickedChild = _.pick(child, childFields);

        let previousId = this.previous && _.get(this.previous, referenceField);

        if (previousId && previousId !== _.get(child, referenceField)) {
          parentCollection.update({
            _id: previousId
          }, {
            $pull: {
              [cacheField]: {
                _id: child._id
              }
            }
          });
        }

        parentCollection.find({
          _id: _.get(child, referenceField)
        }, parentOpts).forEach(parent => {
          let index = _.findIndex(_.get(parent, cacheField), {
            _id: child._id
          });

          if (index > -1) {
            parentCollection.update(parent._id, {
              $set: {
                [cacheField + '.' + index]: pickedChild
              }
            });
          } else {
            parentCollection.update(parent._id, {
              $push: {
                [cacheField]: pickedChild
              }
            });
          }
        });
      }
    });
    childCollection.after.remove(function (userId, child) {
      parentCollection.update({
        _id: _.get(child, referenceField)
      }, {
        $pull: {
          [cacheField]: {
            _id: child._id
          }
        }
      });
    });
  } else if (type == 'many-inversed') {
    let insert = function insert(userId, parent) {
      let children = childCollection.find({
        [referencePath]: parent._id
      }, childOpts).fetch();
      parentCollection.update(parent._id, {
        $set: {
          [cacheField]: children
        }
      });
    };

    addMigration(parentCollection, insert, options);
    parentCollection.after.insert(insert);
    parentCollection.after.update(function (userId, parent, changedFields) {
      if (_.includes(changedFields, referencePath.split('.')[0])) {
        let children = childCollection.find({
          [referencePath]: parent._id
        }, childOpts).fetch();
        parentCollection.update(parent._id, {
          $set: {
            [cacheField]: children
          }
        });
      }
    });
    childCollection.after.insert(function (userId, child) {
      let references = getNestedReferences(child);

      if (references.length) {
        let pickedChild = _.pick(child, childFields);

        parentCollection.update({
          _id: {
            $in: references
          }
        }, {
          $push: {
            [cacheField]: pickedChild
          }
        }, {
          multi: true
        });
      }
    });
    childCollection.after.update(function (userId, child, changedFields) {
      if (_.intersection(changedFields, topFields).length) {
        let references = getNestedReferences(child);
        let previousIds = this.previous && getNestedReferences(this.previous);
        previousIds = _.difference(previousIds, references);

        if (previousIds.length) {
          parentCollection.update({
            _id: {
              $in: previousIds
            }
          }, {
            $pull: {
              [cacheField]: {
                _id: child._id
              }
            }
          }, {
            multi: true
          });
        }

        if (references.length) {
          let pickedChild = _.pick(child, childFields);

          parentCollection.find({
            _id: {
              $in: references
            }
          }, parentOpts).forEach(parent => {
            let index = _.findIndex(_.get(parent, cacheField), {
              _id: child._id
            });

            if (index > -1) {
              parentCollection.update(parent._id, {
                $set: {
                  [cacheField + '.' + index]: pickedChild
                }
              });
            } else {
              parentCollection.update(parent._id, {
                $push: {
                  [cacheField]: pickedChild
                }
              });
            }
          });
        }
      }
    });
    childCollection.after.remove(function (userId, child) {
      let references = getNestedReferences(child);

      if (references.length) {
        parentCollection.update({
          _id: {
            $in: references
          }
        }, {
          $pull: {
            [cacheField]: {
              _id: child._id
            }
          }
        }, {
          multi: true
        });
      }
    });
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cacheCount.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/herteby_denormalize/cacheCount.js                                                             //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
let _;

module.link("lodash", {
  default(v) {
    _ = v;
  }

}, 0);
let addMigration;
module.link("./migrations.js", {
  addMigration(v) {
    addMigration = v;
  }

}, 1);

Mongo.Collection.prototype.cacheCount = function (options) {
  check(options, {
    collection: Mongo.Collection,
    cacheField: String,
    referenceField: String,
    selector: Match.Optional(Object),
    bypassSchema: Match.Optional(Boolean)
  });
  let parentCollection = options.bypassSchema && Package['aldeed:collection2'] ? this._collection : this;
  let childCollection = options.collection;
  let selector = options.selector || {};
  let cacheField = options.cacheField;
  let referenceField = options.referenceField;

  let watchedFields = _.union([referenceField], _.keys(selector));

  if (referenceField.split(/[.:]/)[0] == cacheField.split(/[.:]/)[0]) {
    throw new Error('referenceField and cacheField must not share the same top field');
  }

  function update(child) {
    let ref = _.get(child, referenceField);

    if (ref) {
      let select = _.merge(selector, {
        [referenceField]: ref
      });

      parentCollection.update({
        _id: ref
      }, {
        $set: {
          [cacheField]: childCollection.find(select).count()
        }
      });
    }
  }

  function insert(userId, parent) {
    let select = _.merge(selector, {
      [referenceField]: parent._id
    });

    parentCollection.update(parent._id, {
      $set: {
        [cacheField]: childCollection.find(select).count()
      }
    });
  }

  addMigration(parentCollection, insert, options);
  parentCollection.after.insert(insert);
  childCollection.after.insert((userId, child) => {
    update(child);
  });
  childCollection.after.update((userId, child, changedFields) => {
    if (_.intersection(changedFields, watchedFields).length) {
      update(child);
      update(this.previous);
    }
  });
  childCollection.after.remove((userId, child) => {
    update(child);
  });
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cacheField.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/herteby_denormalize/cacheField.js                                                             //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
let _;

module.link("lodash", {
  default(v) {
    _ = v;
  }

}, 0);
let addMigration;
module.link("./migrations.js", {
  addMigration(v) {
    addMigration = v;
  }

}, 1);

Mongo.Collection.prototype.cacheField = function (options) {
  check(options, {
    cacheField: String,
    fields: [String],
    transform: Match.Optional(Function),
    bypassSchema: Match.Optional(Boolean)
  });
  let collection = options.bypassSchema && Package['aldeed:collection2'] ? this._collection : this;
  let cacheField = options.cacheField;
  let fields = options.fields;

  let topFields = _.uniq(_.map(fields, field => field.split('.')[0]));

  let transform = options.transform;

  if (!transform) {
    transform = function (doc) {
      return _.compact(_.map(fields, field => _.get(doc, field))).join(', ');
    };
  }

  if (_.includes(topFields, cacheField.split(/[.:]/)[0])) {
    throw new Error('watching the cacheField for changes would cause an infinite loop');
  }

  function insertHook(userid, doc) {
    collection.update(doc._id, {
      $set: {
        [cacheField]: transform(_.pick(doc, fields))
      }
    });
  }

  addMigration(collection, insertHook, options);
  collection.after.insert(insertHook);
  collection.after.update((userId, doc, changedFields) => {
    if (_.intersection(changedFields, topFields).length) {
      Meteor.defer(() => {
        collection.update(doc._id, {
          $set: {
            [cacheField]: transform(_.pick(doc, fields))
          }
        });
      });
    }
  });
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"migrations.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/herteby_denormalize/migrations.js                                                             //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
module.export({
  MigrationHistory: () => MigrationHistory,
  addMigration: () => addMigration,
  migrate: () => migrate,
  autoMigrate: () => autoMigrate
});

let _;

module.link("lodash", {
  default(v) {
    _ = v;
  }

}, 0);
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
let settings;
module.link("./cache.js", {
  default(v) {
    settings = v;
  }

}, 2);
const MigrationHistory = new Mongo.Collection('_cacheMigrations');
let migrations = [];

function addMigration(collection, insertFn, options) {
  let opts = _.clone(options);

  if (opts.collection) {
    //prevent Error: Converting circular structure to JSON
    opts.collection = opts.collection._name;
  }

  opts = JSON.stringify(opts);
  migrations.push({
    options: opts,
    collectionName: collection._name,
    collection: collection,
    cacheField: options.cacheField,
    fn: insertFn
  });
}

function migrate(collectionName, cacheField, selector) {
  let migration = _.find(migrations, {
    collectionName,
    cacheField
  });

  if (!migration) {
    throw new Error('no migration found for ' + collectionName + ' - ' + cacheField);
  } else {
    let time = new Date();
    let n = 0;
    migration.collection.find(selector || {}).forEach(doc => {
      migration.fn(null, doc);
      n++;
    });
    console.log(`migrated ${cacheField} of ${n} docs in ${collectionName + (selector ? ' matching ' + JSON.stringify(selector) : '')}. It took ${new Date() - time}ms`);
  }
}

function autoMigrate() {
  _.each(migrations, migration => {
    if (!MigrationHistory.findOne({
      collectionName: migration.collectionName,
      options: migration.options
    })) {
      migrate(migration.collectionName, migration.cacheField);
      MigrationHistory.insert({
        collectionName: migration.collectionName,
        options: migration.options,
        date: new Date()
      });
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"node_modules":{"lodash":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// node_modules/meteor/herteby_denormalize/node_modules/lodash/package.json                               //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
module.exports = {
  "name": "lodash",
  "version": "4.17.4",
  "main": "lodash.js"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lodash.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// node_modules/meteor/herteby_denormalize/node_modules/lodash/lodash.js                                  //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/herteby:denormalize/cache.js");
require("/node_modules/meteor/herteby:denormalize/cacheCount.js");
require("/node_modules/meteor/herteby:denormalize/cacheField.js");

/* Exports */
Package._define("herteby:denormalize", exports);

})();

//# sourceURL=meteor://💻app/packages/herteby_denormalize.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvaGVydGVieTpkZW5vcm1hbGl6ZS9jYWNoZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvaGVydGVieTpkZW5vcm1hbGl6ZS9jYWNoZUNvdW50LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9oZXJ0ZWJ5OmRlbm9ybWFsaXplL2NhY2hlRmllbGQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2hlcnRlYnk6ZGVub3JtYWxpemUvbWlncmF0aW9ucy5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJtaWdyYXRlIiwiYXV0b01pZ3JhdGUiLCJfIiwibGluayIsImRlZmF1bHQiLCJ2IiwiYWRkTWlncmF0aW9uIiwiZmxhdHRlbkZpZWxkcyIsIm9iamVjdCIsInByZWZpeCIsImZpZWxkcyIsImVhY2giLCJ2YWwiLCJrZXkiLCJ1bmlvbiIsInB1c2giLCJNb25nbyIsIkNvbGxlY3Rpb24iLCJwcm90b3R5cGUiLCJjYWNoZSIsIm9wdGlvbnMiLCJjaGVjayIsImNvbGxlY3Rpb24iLCJNYXRjaCIsIldoZXJlIiwiT25lT2YiLCJTdHJpbmciLCJPYmplY3QiLCJ0eXBlIiwicmVmZXJlbmNlRmllbGQiLCJjYWNoZUZpZWxkIiwiYnlwYXNzU2NoZW1hIiwiT3B0aW9uYWwiLCJCb29sZWFuIiwicGFyZW50Q29sbGVjdGlvbiIsIlBhY2thZ2UiLCJfY29sbGVjdGlvbiIsImNoaWxkQ29sbGVjdGlvbiIsIndhdGNoZWRGaWVsZHMiLCJzcGxpdCIsIkVycm9yIiwiaXNBcnJheSIsImNoaWxkRmllbGRzIiwiY2xvbmUiLCJpbmNsdWRlcyIsInB1bGwiLCJjaGlsZE9wdHMiLCJ0cmFuc2Zvcm0iLCJfaWQiLCJmaWVsZCIsInBhcmVudE9wdHMiLCJpZEZpZWxkIiwicmVmZXJlbmNlUGF0aCIsInJlcGxhY2UiLCJ0b3BGaWVsZHMiLCJ1bmlxIiwibWFwIiwiZ2V0TmVzdGVkUmVmZXJlbmNlcyIsImRvY3VtZW50IiwicmVmZXJlbmNlcyIsImdldCIsImxlbmd0aCIsIml0ZW0iLCJmbGF0dGVuIiwiaW5zZXJ0IiwidXNlcklkIiwicGFyZW50IiwiY2hpbGQiLCJmaW5kT25lIiwidXBkYXRlIiwiJHNldCIsImFmdGVyIiwiY2hhbmdlZEZpZWxkcyIsIiR1bnNldCIsInBpY2tlZENoaWxkIiwicGljayIsIm11bHRpIiwiaW50ZXJzZWN0aW9uIiwicmVtb3ZlIiwiY2hpbGRyZW4iLCJmaW5kIiwiJGluIiwiZmV0Y2giLCIkcHVzaCIsImZvckVhY2giLCJpbmRleCIsImZpbmRJbmRleCIsIiRwdWxsIiwicHJldmlvdXNJZCIsInByZXZpb3VzIiwicHJldmlvdXNJZHMiLCJkaWZmZXJlbmNlIiwiY2FjaGVDb3VudCIsInNlbGVjdG9yIiwia2V5cyIsInJlZiIsInNlbGVjdCIsIm1lcmdlIiwiY291bnQiLCJGdW5jdGlvbiIsImRvYyIsImNvbXBhY3QiLCJqb2luIiwiaW5zZXJ0SG9vayIsInVzZXJpZCIsIk1ldGVvciIsImRlZmVyIiwiTWlncmF0aW9uSGlzdG9yeSIsInNldHRpbmdzIiwibWlncmF0aW9ucyIsImluc2VydEZuIiwib3B0cyIsIl9uYW1lIiwiSlNPTiIsInN0cmluZ2lmeSIsImNvbGxlY3Rpb25OYW1lIiwiZm4iLCJtaWdyYXRpb24iLCJ0aW1lIiwiRGF0ZSIsIm4iLCJjb25zb2xlIiwibG9nIiwiZGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNDLFNBQU8sRUFBQyxNQUFJQSxPQUFiO0FBQXFCQyxhQUFXLEVBQUMsTUFBSUE7QUFBckMsQ0FBZDs7QUFBaUUsSUFBSUMsQ0FBSjs7QUFBTUosTUFBTSxDQUFDSyxJQUFQLENBQVksUUFBWixFQUFxQjtBQUFDQyxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDSCxLQUFDLEdBQUNHLENBQUY7QUFBSTs7QUFBaEIsQ0FBckIsRUFBdUMsQ0FBdkM7QUFBMEMsSUFBSUMsWUFBSixFQUFpQk4sT0FBakIsRUFBeUJDLFdBQXpCO0FBQXFDSCxNQUFNLENBQUNLLElBQVAsQ0FBWSxpQkFBWixFQUE4QjtBQUFDRyxjQUFZLENBQUNELENBQUQsRUFBRztBQUFDQyxnQkFBWSxHQUFDRCxDQUFiO0FBQWUsR0FBaEM7O0FBQWlDTCxTQUFPLENBQUNLLENBQUQsRUFBRztBQUFDTCxXQUFPLEdBQUNLLENBQVI7QUFBVSxHQUF0RDs7QUFBdURKLGFBQVcsQ0FBQ0ksQ0FBRCxFQUFHO0FBQUNKLGVBQVcsR0FBQ0ksQ0FBWjtBQUFjOztBQUFwRixDQUE5QixFQUFvSCxDQUFwSDs7QUFLdEosU0FBU0UsYUFBVCxDQUF1QkMsTUFBdkIsRUFBK0JDLE1BQS9CLEVBQXNDO0FBQ3BDQSxRQUFNLEdBQUdBLE1BQU0sSUFBSSxFQUFuQjtBQUNBLE1BQUlDLE1BQU0sR0FBRyxFQUFiOztBQUNBUixHQUFDLENBQUNTLElBQUYsQ0FBT0gsTUFBUCxFQUFlLENBQUNJLEdBQUQsRUFBTUMsR0FBTixLQUFjO0FBQzNCLFFBQUcsT0FBT0QsR0FBUCxJQUFjLFFBQWpCLEVBQTBCO0FBQ3hCRixZQUFNLEdBQUdSLENBQUMsQ0FBQ1ksS0FBRixDQUFRSixNQUFSLEVBQWdCSCxhQUFhLENBQUNLLEdBQUQsRUFBTUgsTUFBTSxHQUFHSSxHQUFULEdBQWUsR0FBckIsQ0FBN0IsQ0FBVDtBQUNELEtBRkQsTUFFTztBQUNMSCxZQUFNLENBQUNLLElBQVAsQ0FBWU4sTUFBTSxHQUFHSSxHQUFyQjtBQUNEO0FBQ0YsR0FORDs7QUFPQSxTQUFPSCxNQUFQO0FBQ0Q7O0FBRURNLEtBQUssQ0FBQ0MsVUFBTixDQUFpQkMsU0FBakIsQ0FBMkJDLEtBQTNCLEdBQW1DLFVBQVNDLE9BQVQsRUFBaUI7QUFDbERDLE9BQUssQ0FBQ0QsT0FBRCxFQUFVO0FBQ2JFLGNBQVUsRUFBQ0MsS0FBSyxDQUFDQyxLQUFOLENBQVlGLFVBQVUsSUFBSUEsVUFBVSxZQUFZTixLQUFLLENBQUNDLFVBQXRELENBREU7QUFFYlAsVUFBTSxFQUFDYSxLQUFLLENBQUNFLEtBQU4sQ0FBWSxDQUFDQyxNQUFELENBQVosRUFBc0JDLE1BQXRCLENBRk07QUFHYkMsUUFBSSxFQUFDTCxLQUFLLENBQUNFLEtBQU4sQ0FBWSxLQUFaLEVBQW1CLE1BQW5CLEVBQTJCLFVBQTNCLEVBQXVDLFNBQXZDLEVBQWtELGVBQWxELEVBQW1FLGNBQW5FLENBSFE7QUFJYkksa0JBQWMsRUFBQ0gsTUFKRjtBQUtiSSxjQUFVLEVBQUNKLE1BTEU7QUFNYkssZ0JBQVksRUFBQ1IsS0FBSyxDQUFDUyxRQUFOLENBQWVDLE9BQWY7QUFOQSxHQUFWLENBQUw7QUFRQSxNQUFHYixPQUFPLENBQUNRLElBQVIsSUFBZ0IsU0FBbkIsRUFBOEJSLE9BQU8sQ0FBQ1EsSUFBUixHQUFlLFVBQWYsQ0FUb0IsQ0FTTTs7QUFDeEQsTUFBR1IsT0FBTyxDQUFDUSxJQUFSLElBQWdCLGNBQW5CLEVBQW1DUixPQUFPLENBQUNRLElBQVIsR0FBZSxlQUFmLENBVmUsQ0FZbEQ7O0FBQ0EsTUFBSU0sZ0JBQWdCLEdBQUdkLE9BQU8sQ0FBQ1csWUFBUixJQUF3QkksT0FBTyxDQUFDLG9CQUFELENBQS9CLEdBQXdELEtBQUtDLFdBQTdELEdBQTJFLElBQWxHO0FBQ0EsTUFBSUMsZUFBZSxHQUFHakIsT0FBTyxDQUFDRSxVQUE5QjtBQUNBLE1BQUlNLElBQUksR0FBR1IsT0FBTyxDQUFDUSxJQUFuQjtBQUNBLE1BQUlDLGNBQWMsR0FBR1QsT0FBTyxDQUFDUyxjQUE3QjtBQUNBLE1BQUlDLFVBQVUsR0FBR1YsT0FBTyxDQUFDVSxVQUF6QjtBQUNBLE1BQUlRLGFBQWEsR0FBR2xCLE9BQU8sQ0FBQ1YsTUFBNUI7O0FBRUEsTUFBR21CLGNBQWMsQ0FBQ1UsS0FBZixDQUFxQixNQUFyQixFQUE2QixDQUE3QixLQUFtQ1QsVUFBVSxDQUFDUyxLQUFYLENBQWlCLE1BQWpCLEVBQXlCLENBQXpCLENBQXRDLEVBQWtFO0FBQ2hFLFVBQU0sSUFBSUMsS0FBSixDQUFVLGlFQUFWLENBQU47QUFDRDs7QUFFRCxNQUFHLENBQUN0QyxDQUFDLENBQUN1QyxPQUFGLENBQVVILGFBQVYsQ0FBSixFQUE2QjtBQUMzQkEsaUJBQWEsR0FBRy9CLGFBQWEsQ0FBQytCLGFBQUQsQ0FBN0I7QUFDRDs7QUFFRCxNQUFJSSxXQUFXLEdBQUd4QyxDQUFDLENBQUN5QyxLQUFGLENBQVFMLGFBQVIsQ0FBbEI7O0FBQ0EsTUFBR1YsSUFBSSxLQUFLLEtBQVosRUFBa0I7QUFDaEIsUUFBRyxDQUFDMUIsQ0FBQyxDQUFDMEMsUUFBRixDQUFXRixXQUFYLEVBQXdCLEtBQXhCLENBQUosRUFBbUM7QUFDakNBLGlCQUFXLENBQUMzQixJQUFaLENBQWlCLEtBQWpCO0FBQ0Q7O0FBQ0RiLEtBQUMsQ0FBQzJDLElBQUYsQ0FBT0gsV0FBUCxFQUFvQmIsY0FBcEI7QUFDRDs7QUFDRCxNQUFJaUIsU0FBUyxHQUFHO0FBQUNDLGFBQVMsRUFBQyxJQUFYO0FBQWlCckMsVUFBTSxFQUFDO0FBQUNzQyxTQUFHLEVBQUM7QUFBTDtBQUF4QixHQUFoQjs7QUFDQTlDLEdBQUMsQ0FBQ1MsSUFBRixDQUFPK0IsV0FBUCxFQUFvQk8sS0FBSyxJQUFJSCxTQUFTLENBQUNwQyxNQUFWLENBQWlCdUMsS0FBakIsSUFBMEIsQ0FBdkQ7O0FBRUEsTUFBSUMsVUFBVSxHQUFHO0FBQUNILGFBQVMsRUFBQyxJQUFYO0FBQWlCckMsVUFBTSxFQUFDO0FBQUNzQyxTQUFHLEVBQUMsQ0FBTDtBQUFRLE9BQUNsQixVQUFELEdBQWE7QUFBckI7QUFBeEIsR0FBakI7O0FBQ0EsTUFBR0YsSUFBSSxLQUFLLFVBQVQsSUFBdUJBLElBQUksS0FBSyxlQUFuQyxFQUFtRDtBQUNqRHNCLGNBQVUsQ0FBQ3hDLE1BQVgsQ0FBa0JtQixjQUFjLENBQUNVLEtBQWYsQ0FBcUIsR0FBckIsRUFBMEIsQ0FBMUIsQ0FBbEIsSUFBa0QsQ0FBbEQ7QUFDRDs7QUFFRCxNQUFJWSxPQUFKLEVBQWFDLGFBQWI7O0FBQ0EsTUFBR3hCLElBQUksSUFBSSxNQUFSLElBQWtCQSxJQUFJLElBQUksZUFBN0IsRUFBNkM7QUFDM0N3QixpQkFBYSxHQUFHdkIsY0FBYyxDQUFDd0IsT0FBZixDQUF1QixHQUF2QixFQUE0QixHQUE1QixDQUFoQjtBQUNBRixXQUFPLEdBQUd0QixjQUFjLENBQUNVLEtBQWYsQ0FBcUIsR0FBckIsRUFBMEIsQ0FBMUIsQ0FBVjtBQUNBVixrQkFBYyxHQUFHQSxjQUFjLENBQUNVLEtBQWYsQ0FBcUIsR0FBckIsRUFBMEIsQ0FBMUIsQ0FBakI7QUFDRDs7QUFFRCxNQUFHWCxJQUFJLElBQUksVUFBUixJQUFzQkEsSUFBSSxJQUFJLGVBQVIsSUFBMkIsQ0FBQzFCLENBQUMsQ0FBQzBDLFFBQUYsQ0FBV04sYUFBWCxFQUEwQmMsYUFBMUIsQ0FBckQsRUFBOEY7QUFDNUZkLGlCQUFhLENBQUN2QixJQUFkLENBQW1CcUMsYUFBYSxJQUFJdkIsY0FBcEM7QUFDRDs7QUFFRCxNQUFJeUIsU0FBUyxHQUFHcEQsQ0FBQyxDQUFDcUQsSUFBRixDQUFPakIsYUFBYSxDQUFDa0IsR0FBZCxDQUFrQlAsS0FBSyxJQUFJQSxLQUFLLENBQUNWLEtBQU4sQ0FBWSxHQUFaLEVBQWlCLENBQWpCLENBQTNCLENBQVAsQ0FBaEI7O0FBRUEsV0FBU2tCLG1CQUFULENBQTZCQyxRQUE3QixFQUFzQztBQUFFO0FBQ3RDLFFBQUlDLFVBQVUsR0FBR3pELENBQUMsQ0FBQzBELEdBQUYsQ0FBTUYsUUFBTixFQUFnQjdCLGNBQWhCLEtBQW1DLEVBQXBEOztBQUNBLFFBQUdzQixPQUFPLElBQUlRLFVBQVUsQ0FBQ0UsTUFBekIsRUFBZ0M7QUFDOUJGLGdCQUFVLEdBQUd6RCxDQUFDLENBQUNzRCxHQUFGLENBQU1HLFVBQU4sRUFBa0JHLElBQUksSUFBSTVELENBQUMsQ0FBQzBELEdBQUYsQ0FBTUUsSUFBTixFQUFZWCxPQUFaLENBQTFCLENBQWI7QUFDRDs7QUFDRCxXQUFPakQsQ0FBQyxDQUFDcUQsSUFBRixDQUFPckQsQ0FBQyxDQUFDNkQsT0FBRixDQUFVSixVQUFWLENBQVAsQ0FBUDtBQUNEOztBQUdELE1BQUcvQixJQUFJLElBQUksS0FBWCxFQUFpQjtBQUNmLFFBQUlvQyxNQUFNLEdBQUcsU0FBU0EsTUFBVCxDQUFnQkMsTUFBaEIsRUFBd0JDLE1BQXhCLEVBQStCO0FBQzFDLFVBQUdoRSxDQUFDLENBQUMwRCxHQUFGLENBQU1NLE1BQU4sRUFBY3JDLGNBQWQsQ0FBSCxFQUFpQztBQUMvQixZQUFJc0MsS0FBSyxHQUFHOUIsZUFBZSxDQUFDK0IsT0FBaEIsQ0FBd0JsRSxDQUFDLENBQUMwRCxHQUFGLENBQU1NLE1BQU4sRUFBY3JDLGNBQWQsQ0FBeEIsRUFBdURpQixTQUF2RCxDQUFaOztBQUNBLFlBQUdxQixLQUFILEVBQVM7QUFDUGpDLDBCQUFnQixDQUFDbUMsTUFBakIsQ0FBd0JILE1BQU0sQ0FBQ2xCLEdBQS9CLEVBQW9DO0FBQUNzQixnQkFBSSxFQUFDO0FBQUMsZUFBQ3hDLFVBQUQsR0FBYXFDO0FBQWQ7QUFBTixXQUFwQztBQUNEO0FBQ0Y7QUFDRixLQVBEOztBQVFBN0QsZ0JBQVksQ0FBQzRCLGdCQUFELEVBQW1COEIsTUFBbkIsRUFBMkI1QyxPQUEzQixDQUFaO0FBQ0FjLG9CQUFnQixDQUFDcUMsS0FBakIsQ0FBdUJQLE1BQXZCLENBQThCQSxNQUE5QjtBQUVBOUIsb0JBQWdCLENBQUNxQyxLQUFqQixDQUF1QkYsTUFBdkIsQ0FBOEIsVUFBU0osTUFBVCxFQUFpQkMsTUFBakIsRUFBeUJNLGFBQXpCLEVBQXVDO0FBQ25FLFVBQUd0RSxDQUFDLENBQUMwQyxRQUFGLENBQVc0QixhQUFYLEVBQTBCM0MsY0FBYyxDQUFDVSxLQUFmLENBQXFCLEdBQXJCLEVBQTBCLENBQTFCLENBQTFCLENBQUgsRUFBMkQ7QUFDekQsWUFBSTRCLEtBQUssR0FBR2pFLENBQUMsQ0FBQzBELEdBQUYsQ0FBTU0sTUFBTixFQUFjckMsY0FBZCxLQUFpQ1EsZUFBZSxDQUFDK0IsT0FBaEIsQ0FBd0JsRSxDQUFDLENBQUMwRCxHQUFGLENBQU1NLE1BQU4sRUFBY3JDLGNBQWQsQ0FBeEIsRUFBdURpQixTQUF2RCxDQUE3Qzs7QUFDQSxZQUFHcUIsS0FBSCxFQUFTO0FBQ1BqQywwQkFBZ0IsQ0FBQ21DLE1BQWpCLENBQXdCSCxNQUFNLENBQUNsQixHQUEvQixFQUFvQztBQUFDc0IsZ0JBQUksRUFBQztBQUFDLGVBQUN4QyxVQUFELEdBQWFxQztBQUFkO0FBQU4sV0FBcEM7QUFDRCxTQUZELE1BRU87QUFDTGpDLDBCQUFnQixDQUFDbUMsTUFBakIsQ0FBd0JILE1BQU0sQ0FBQ2xCLEdBQS9CLEVBQW9DO0FBQUN5QixrQkFBTSxFQUFDO0FBQUMsZUFBQzNDLFVBQUQsR0FBYTtBQUFkO0FBQVIsV0FBcEM7QUFDRDtBQUNGO0FBQ0YsS0FURDtBQVdBTyxtQkFBZSxDQUFDa0MsS0FBaEIsQ0FBc0JQLE1BQXRCLENBQTZCLFVBQVNDLE1BQVQsRUFBaUJFLEtBQWpCLEVBQXVCO0FBQ2xELFVBQUlPLFdBQVcsR0FBR3hFLENBQUMsQ0FBQ3lFLElBQUYsQ0FBT1IsS0FBUCxFQUFjekIsV0FBZCxDQUFsQjs7QUFDQVIsc0JBQWdCLENBQUNtQyxNQUFqQixDQUF3QjtBQUFDLFNBQUN4QyxjQUFELEdBQWlCc0MsS0FBSyxDQUFDbkI7QUFBeEIsT0FBeEIsRUFBc0Q7QUFBQ3NCLFlBQUksRUFBQztBQUFDLFdBQUN4QyxVQUFELEdBQWE0QztBQUFkO0FBQU4sT0FBdEQsRUFBeUY7QUFBQ0UsYUFBSyxFQUFDO0FBQVAsT0FBekY7QUFDRCxLQUhEO0FBS0F2QyxtQkFBZSxDQUFDa0MsS0FBaEIsQ0FBc0JGLE1BQXRCLENBQTZCLFVBQVNKLE1BQVQsRUFBaUJFLEtBQWpCLEVBQXdCSyxhQUF4QixFQUFzQztBQUNqRSxVQUFHdEUsQ0FBQyxDQUFDMkUsWUFBRixDQUFlTCxhQUFmLEVBQThCbEIsU0FBOUIsRUFBeUNPLE1BQTVDLEVBQW1EO0FBQ2pELFlBQUlhLFdBQVcsR0FBR3hFLENBQUMsQ0FBQ3lFLElBQUYsQ0FBT1IsS0FBUCxFQUFjekIsV0FBZCxDQUFsQjs7QUFDQVIsd0JBQWdCLENBQUNtQyxNQUFqQixDQUF3QjtBQUFDLFdBQUN4QyxjQUFELEdBQWlCc0MsS0FBSyxDQUFDbkI7QUFBeEIsU0FBeEIsRUFBc0Q7QUFBQ3NCLGNBQUksRUFBQztBQUFDLGFBQUN4QyxVQUFELEdBQWE0QztBQUFkO0FBQU4sU0FBdEQsRUFBeUY7QUFBQ0UsZUFBSyxFQUFDO0FBQVAsU0FBekY7QUFDRDtBQUNGLEtBTEQ7QUFPQXZDLG1CQUFlLENBQUNrQyxLQUFoQixDQUFzQk8sTUFBdEIsQ0FBNkIsVUFBU2IsTUFBVCxFQUFpQkUsS0FBakIsRUFBdUI7QUFDbERqQyxzQkFBZ0IsQ0FBQ21DLE1BQWpCLENBQXdCO0FBQUMsU0FBQ3hDLGNBQUQsR0FBaUJzQyxLQUFLLENBQUNuQjtBQUF4QixPQUF4QixFQUFzRDtBQUFDeUIsY0FBTSxFQUFDO0FBQUMsV0FBQzNDLFVBQUQsR0FBYTtBQUFkO0FBQVIsT0FBdEQsRUFBaUY7QUFBQzhDLGFBQUssRUFBQztBQUFQLE9BQWpGO0FBQ0QsS0FGRDtBQUdELEdBdENELE1Bd0NLLElBQUdoRCxJQUFJLElBQUksTUFBWCxFQUFrQjtBQUNyQixRQUFJb0MsTUFBTSxHQUFHLFNBQVNBLE1BQVQsQ0FBZ0JDLE1BQWhCLEVBQXdCQyxNQUF4QixFQUErQjtBQUMxQyxVQUFJUCxVQUFVLEdBQUdGLG1CQUFtQixDQUFDUyxNQUFELENBQXBDOztBQUNBLFVBQUdQLFVBQVUsQ0FBQ0UsTUFBZCxFQUFxQjtBQUNuQixZQUFJa0IsUUFBUSxHQUFHMUMsZUFBZSxDQUFDMkMsSUFBaEIsQ0FBcUI7QUFBQ2hDLGFBQUcsRUFBQztBQUFDaUMsZUFBRyxFQUFDdEI7QUFBTDtBQUFMLFNBQXJCLEVBQTZDYixTQUE3QyxFQUF3RG9DLEtBQXhELEVBQWY7QUFDQWhELHdCQUFnQixDQUFDbUMsTUFBakIsQ0FBd0JILE1BQU0sQ0FBQ2xCLEdBQS9CLEVBQW9DO0FBQUNzQixjQUFJLEVBQUM7QUFBQyxhQUFDeEMsVUFBRCxHQUFhaUQ7QUFBZDtBQUFOLFNBQXBDO0FBQ0QsT0FIRCxNQUdPO0FBQ0w3Qyx3QkFBZ0IsQ0FBQ21DLE1BQWpCLENBQXdCSCxNQUFNLENBQUNsQixHQUEvQixFQUFvQztBQUFDc0IsY0FBSSxFQUFDO0FBQUMsYUFBQ3hDLFVBQUQsR0FBYTtBQUFkO0FBQU4sU0FBcEM7QUFDRDtBQUNGLEtBUkQ7O0FBU0F4QixnQkFBWSxDQUFDNEIsZ0JBQUQsRUFBbUI4QixNQUFuQixFQUEyQjVDLE9BQTNCLENBQVo7QUFDQWMsb0JBQWdCLENBQUNxQyxLQUFqQixDQUF1QlAsTUFBdkIsQ0FBOEJBLE1BQTlCO0FBRUE5QixvQkFBZ0IsQ0FBQ3FDLEtBQWpCLENBQXVCRixNQUF2QixDQUE4QixVQUFTSixNQUFULEVBQWlCQyxNQUFqQixFQUF5Qk0sYUFBekIsRUFBdUM7QUFDbkUsVUFBR3RFLENBQUMsQ0FBQzBDLFFBQUYsQ0FBVzRCLGFBQVgsRUFBMEJwQixhQUFhLENBQUNiLEtBQWQsQ0FBb0IsR0FBcEIsRUFBeUIsQ0FBekIsQ0FBMUIsQ0FBSCxFQUEwRDtBQUN4RCxZQUFJb0IsVUFBVSxHQUFHRixtQkFBbUIsQ0FBQ1MsTUFBRCxDQUFwQzs7QUFDQSxZQUFHUCxVQUFVLENBQUNFLE1BQWQsRUFBcUI7QUFDbkIsY0FBSWtCLFFBQVEsR0FBRzFDLGVBQWUsQ0FBQzJDLElBQWhCLENBQXFCO0FBQUNoQyxlQUFHLEVBQUM7QUFBQ2lDLGlCQUFHLEVBQUN0QjtBQUFMO0FBQUwsV0FBckIsRUFBNkNiLFNBQTdDLEVBQXdEb0MsS0FBeEQsRUFBZjtBQUNBaEQsMEJBQWdCLENBQUNtQyxNQUFqQixDQUF3QkgsTUFBTSxDQUFDbEIsR0FBL0IsRUFBb0M7QUFBQ3NCLGdCQUFJLEVBQUM7QUFBQyxlQUFDeEMsVUFBRCxHQUFhaUQ7QUFBZDtBQUFOLFdBQXBDO0FBQ0QsU0FIRCxNQUdPO0FBQ0w3QywwQkFBZ0IsQ0FBQ21DLE1BQWpCLENBQXdCSCxNQUFNLENBQUNsQixHQUEvQixFQUFvQztBQUFDc0IsZ0JBQUksRUFBQztBQUFDLGVBQUN4QyxVQUFELEdBQWE7QUFBZDtBQUFOLFdBQXBDO0FBQ0Q7QUFDRjtBQUNGLEtBVkQ7QUFZQU8sbUJBQWUsQ0FBQ2tDLEtBQWhCLENBQXNCUCxNQUF0QixDQUE2QixVQUFTQyxNQUFULEVBQWlCRSxLQUFqQixFQUF1QjtBQUNsRCxVQUFJTyxXQUFXLEdBQUd4RSxDQUFDLENBQUN5RSxJQUFGLENBQU9SLEtBQVAsRUFBY3pCLFdBQWQsQ0FBbEI7O0FBQ0FSLHNCQUFnQixDQUFDbUMsTUFBakIsQ0FBd0I7QUFBQyxTQUFDakIsYUFBRCxHQUFnQmUsS0FBSyxDQUFDbkI7QUFBdkIsT0FBeEIsRUFBcUQ7QUFBQ21DLGFBQUssRUFBQztBQUFDLFdBQUNyRCxVQUFELEdBQWE0QztBQUFkO0FBQVAsT0FBckQsRUFBeUY7QUFBQ0UsYUFBSyxFQUFDO0FBQVAsT0FBekY7QUFDRCxLQUhEO0FBS0F2QyxtQkFBZSxDQUFDa0MsS0FBaEIsQ0FBc0JGLE1BQXRCLENBQTZCLFVBQVNKLE1BQVQsRUFBaUJFLEtBQWpCLEVBQXdCSyxhQUF4QixFQUFzQztBQUNqRSxVQUFHdEUsQ0FBQyxDQUFDMkUsWUFBRixDQUFlTCxhQUFmLEVBQThCbEIsU0FBOUIsRUFBeUNPLE1BQTVDLEVBQW1EO0FBQ2pELFlBQUlhLFdBQVcsR0FBR3hFLENBQUMsQ0FBQ3lFLElBQUYsQ0FBT1IsS0FBUCxFQUFjekIsV0FBZCxDQUFsQjs7QUFDQVIsd0JBQWdCLENBQUM4QyxJQUFqQixDQUFzQjtBQUFDLFdBQUM1QixhQUFELEdBQWdCZSxLQUFLLENBQUNuQjtBQUF2QixTQUF0QixFQUFtREUsVUFBbkQsRUFBK0RrQyxPQUEvRCxDQUF1RWxCLE1BQU0sSUFBSTtBQUMvRSxjQUFJbUIsS0FBSyxHQUFHbkYsQ0FBQyxDQUFDb0YsU0FBRixDQUFZcEYsQ0FBQyxDQUFDMEQsR0FBRixDQUFNTSxNQUFOLEVBQWNwQyxVQUFkLENBQVosRUFBdUM7QUFBQ2tCLGVBQUcsRUFBQ21CLEtBQUssQ0FBQ25CO0FBQVgsV0FBdkMsQ0FBWjs7QUFDQSxjQUFHcUMsS0FBSyxHQUFHLENBQUMsQ0FBWixFQUFjO0FBQ1puRCw0QkFBZ0IsQ0FBQ21DLE1BQWpCLENBQXdCSCxNQUFNLENBQUNsQixHQUEvQixFQUFvQztBQUFDc0Isa0JBQUksRUFBQztBQUFDLGlCQUFDeEMsVUFBVSxHQUFHLEdBQWIsR0FBbUJ1RCxLQUFwQixHQUEyQlg7QUFBNUI7QUFBTixhQUFwQztBQUNELFdBRkQsTUFFTztBQUNMeEMsNEJBQWdCLENBQUNtQyxNQUFqQixDQUF3QkgsTUFBTSxDQUFDbEIsR0FBL0IsRUFBb0M7QUFBQ21DLG1CQUFLLEVBQUM7QUFBQyxpQkFBQ3JELFVBQUQsR0FBYTRDO0FBQWQ7QUFBUCxhQUFwQztBQUNEO0FBQ0YsU0FQRDtBQVFEO0FBQ0YsS0FaRDtBQWNBckMsbUJBQWUsQ0FBQ2tDLEtBQWhCLENBQXNCTyxNQUF0QixDQUE2QixVQUFTYixNQUFULEVBQWlCRSxLQUFqQixFQUF1QjtBQUNsRGpDLHNCQUFnQixDQUFDbUMsTUFBakIsQ0FBd0I7QUFBQyxTQUFDakIsYUFBRCxHQUFnQmUsS0FBSyxDQUFDbkI7QUFBdkIsT0FBeEIsRUFBcUQ7QUFBQ3VDLGFBQUssRUFBQztBQUFDLFdBQUN6RCxVQUFELEdBQWE7QUFBQ2tCLGVBQUcsRUFBQ21CLEtBQUssQ0FBQ25CO0FBQVg7QUFBZDtBQUFQLE9BQXJELEVBQTZGO0FBQUM0QixhQUFLLEVBQUM7QUFBUCxPQUE3RjtBQUNELEtBRkQ7QUFHRCxHQS9DSSxNQWtEQSxJQUFHaEQsSUFBSSxJQUFJLFVBQVgsRUFBc0I7QUFDekIsUUFBSW9DLE1BQU0sR0FBRyxTQUFTQSxNQUFULENBQWdCQyxNQUFoQixFQUF3QkMsTUFBeEIsRUFBK0I7QUFDMUMsVUFBSWEsUUFBUSxHQUFHMUMsZUFBZSxDQUFDMkMsSUFBaEIsQ0FBcUI7QUFBQyxTQUFDbkQsY0FBRCxHQUFpQnFDLE1BQU0sQ0FBQ2xCO0FBQXpCLE9BQXJCLEVBQW9ERixTQUFwRCxFQUErRG9DLEtBQS9ELEVBQWY7QUFDQWhELHNCQUFnQixDQUFDbUMsTUFBakIsQ0FBd0JILE1BQU0sQ0FBQ2xCLEdBQS9CLEVBQW9DO0FBQUNzQixZQUFJLEVBQUM7QUFBQyxXQUFDeEMsVUFBRCxHQUFhaUQ7QUFBZDtBQUFOLE9BQXBDO0FBQ0QsS0FIRDs7QUFJQXpFLGdCQUFZLENBQUM0QixnQkFBRCxFQUFtQjhCLE1BQW5CLEVBQTJCNUMsT0FBM0IsQ0FBWjtBQUVBYyxvQkFBZ0IsQ0FBQ3FDLEtBQWpCLENBQXVCUCxNQUF2QixDQUE4QkEsTUFBOUI7QUFFQTlCLG9CQUFnQixDQUFDcUMsS0FBakIsQ0FBdUJGLE1BQXZCLENBQThCLFVBQVNKLE1BQVQsRUFBaUJDLE1BQWpCLEVBQXlCTSxhQUF6QixFQUF1QztBQUNuRSxVQUFHdEUsQ0FBQyxDQUFDMEMsUUFBRixDQUFXNEIsYUFBWCxFQUEwQjNDLGNBQWMsQ0FBQ1UsS0FBZixDQUFxQixHQUFyQixFQUEwQixDQUExQixDQUExQixDQUFILEVBQTJEO0FBQ3pELFlBQUdyQyxDQUFDLENBQUMwRCxHQUFGLENBQU1NLE1BQU4sRUFBY3JDLGNBQWQsQ0FBSCxFQUFpQztBQUMvQixjQUFJa0QsUUFBUSxHQUFHMUMsZUFBZSxDQUFDMkMsSUFBaEIsQ0FBcUI7QUFBQyxhQUFDbkQsY0FBRCxHQUFpQnFDLE1BQU0sQ0FBQ2xCO0FBQXpCLFdBQXJCLEVBQW9ERixTQUFwRCxFQUErRG9DLEtBQS9ELEVBQWY7QUFDQWhELDBCQUFnQixDQUFDbUMsTUFBakIsQ0FBd0JILE1BQU0sQ0FBQ2xCLEdBQS9CLEVBQW9DO0FBQUNzQixnQkFBSSxFQUFDO0FBQUMsZUFBQ3hDLFVBQUQsR0FBYWlEO0FBQWQ7QUFBTixXQUFwQztBQUNELFNBSEQsTUFHTztBQUNMN0MsMEJBQWdCLENBQUNtQyxNQUFqQixDQUF3QkgsTUFBTSxDQUFDbEIsR0FBL0IsRUFBb0M7QUFBQ3NCLGdCQUFJLEVBQUM7QUFBQyxlQUFDeEMsVUFBRCxHQUFhO0FBQWQ7QUFBTixXQUFwQztBQUNEO0FBQ0Y7QUFDRixLQVREO0FBV0FPLG1CQUFlLENBQUNrQyxLQUFoQixDQUFzQlAsTUFBdEIsQ0FBNkIsVUFBU0MsTUFBVCxFQUFpQkUsS0FBakIsRUFBdUI7QUFDbEQsVUFBSU8sV0FBVyxHQUFHeEUsQ0FBQyxDQUFDeUUsSUFBRixDQUFPUixLQUFQLEVBQWN6QixXQUFkLENBQWxCOztBQUNBLFVBQUd4QyxDQUFDLENBQUMwRCxHQUFGLENBQU1PLEtBQU4sRUFBYXRDLGNBQWIsQ0FBSCxFQUFnQztBQUM5Qkssd0JBQWdCLENBQUNtQyxNQUFqQixDQUF3QjtBQUFDckIsYUFBRyxFQUFDOUMsQ0FBQyxDQUFDMEQsR0FBRixDQUFNTyxLQUFOLEVBQWF0QyxjQUFiO0FBQUwsU0FBeEIsRUFBNEQ7QUFBQ3NELGVBQUssRUFBQztBQUFDLGFBQUNyRCxVQUFELEdBQWE0QztBQUFkO0FBQVAsU0FBNUQ7QUFDRDtBQUNGLEtBTEQ7QUFPQXJDLG1CQUFlLENBQUNrQyxLQUFoQixDQUFzQkYsTUFBdEIsQ0FBNkIsVUFBU0osTUFBVCxFQUFpQkUsS0FBakIsRUFBd0JLLGFBQXhCLEVBQXNDO0FBQ2pFLFVBQUd0RSxDQUFDLENBQUMyRSxZQUFGLENBQWVMLGFBQWYsRUFBOEJsQixTQUE5QixFQUF5Q08sTUFBNUMsRUFBbUQ7QUFDakQsWUFBSWEsV0FBVyxHQUFHeEUsQ0FBQyxDQUFDeUUsSUFBRixDQUFPUixLQUFQLEVBQWN6QixXQUFkLENBQWxCOztBQUNBLFlBQUk4QyxVQUFVLEdBQUcsS0FBS0MsUUFBTCxJQUFpQnZGLENBQUMsQ0FBQzBELEdBQUYsQ0FBTSxLQUFLNkIsUUFBWCxFQUFxQjVELGNBQXJCLENBQWxDOztBQUNBLFlBQUcyRCxVQUFVLElBQUlBLFVBQVUsS0FBS3RGLENBQUMsQ0FBQzBELEdBQUYsQ0FBTU8sS0FBTixFQUFhdEMsY0FBYixDQUFoQyxFQUE2RDtBQUMzREssMEJBQWdCLENBQUNtQyxNQUFqQixDQUF3QjtBQUFDckIsZUFBRyxFQUFDd0M7QUFBTCxXQUF4QixFQUEwQztBQUFDRCxpQkFBSyxFQUFDO0FBQUMsZUFBQ3pELFVBQUQsR0FBYTtBQUFDa0IsbUJBQUcsRUFBQ21CLEtBQUssQ0FBQ25CO0FBQVg7QUFBZDtBQUFQLFdBQTFDO0FBQ0Q7O0FBQ0RkLHdCQUFnQixDQUFDOEMsSUFBakIsQ0FBc0I7QUFBQ2hDLGFBQUcsRUFBQzlDLENBQUMsQ0FBQzBELEdBQUYsQ0FBTU8sS0FBTixFQUFhdEMsY0FBYjtBQUFMLFNBQXRCLEVBQTBEcUIsVUFBMUQsRUFBc0VrQyxPQUF0RSxDQUE4RWxCLE1BQU0sSUFBSTtBQUN0RixjQUFJbUIsS0FBSyxHQUFHbkYsQ0FBQyxDQUFDb0YsU0FBRixDQUFZcEYsQ0FBQyxDQUFDMEQsR0FBRixDQUFNTSxNQUFOLEVBQWNwQyxVQUFkLENBQVosRUFBdUM7QUFBQ2tCLGVBQUcsRUFBQ21CLEtBQUssQ0FBQ25CO0FBQVgsV0FBdkMsQ0FBWjs7QUFDQSxjQUFHcUMsS0FBSyxHQUFHLENBQUMsQ0FBWixFQUFjO0FBQ1puRCw0QkFBZ0IsQ0FBQ21DLE1BQWpCLENBQXdCSCxNQUFNLENBQUNsQixHQUEvQixFQUFvQztBQUFDc0Isa0JBQUksRUFBQztBQUFDLGlCQUFDeEMsVUFBVSxHQUFHLEdBQWIsR0FBbUJ1RCxLQUFwQixHQUEyQlg7QUFBNUI7QUFBTixhQUFwQztBQUNELFdBRkQsTUFFTztBQUNMeEMsNEJBQWdCLENBQUNtQyxNQUFqQixDQUF3QkgsTUFBTSxDQUFDbEIsR0FBL0IsRUFBb0M7QUFBQ21DLG1CQUFLLEVBQUM7QUFBQyxpQkFBQ3JELFVBQUQsR0FBYTRDO0FBQWQ7QUFBUCxhQUFwQztBQUNEO0FBQ0YsU0FQRDtBQVFEO0FBQ0YsS0FoQkQ7QUFrQkFyQyxtQkFBZSxDQUFDa0MsS0FBaEIsQ0FBc0JPLE1BQXRCLENBQTZCLFVBQVNiLE1BQVQsRUFBaUJFLEtBQWpCLEVBQXVCO0FBQ2xEakMsc0JBQWdCLENBQUNtQyxNQUFqQixDQUF3QjtBQUFDckIsV0FBRyxFQUFDOUMsQ0FBQyxDQUFDMEQsR0FBRixDQUFNTyxLQUFOLEVBQWF0QyxjQUFiO0FBQUwsT0FBeEIsRUFBNEQ7QUFBQzBELGFBQUssRUFBQztBQUFDLFdBQUN6RCxVQUFELEdBQWE7QUFBQ2tCLGVBQUcsRUFBQ21CLEtBQUssQ0FBQ25CO0FBQVg7QUFBZDtBQUFQLE9BQTVEO0FBQ0QsS0FGRDtBQUdELEdBaERJLE1Ba0RBLElBQUdwQixJQUFJLElBQUksZUFBWCxFQUEyQjtBQUM5QixRQUFJb0MsTUFBTSxHQUFHLFNBQVNBLE1BQVQsQ0FBZ0JDLE1BQWhCLEVBQXdCQyxNQUF4QixFQUErQjtBQUMxQyxVQUFJYSxRQUFRLEdBQUcxQyxlQUFlLENBQUMyQyxJQUFoQixDQUFxQjtBQUFDLFNBQUM1QixhQUFELEdBQWdCYyxNQUFNLENBQUNsQjtBQUF4QixPQUFyQixFQUFtREYsU0FBbkQsRUFBOERvQyxLQUE5RCxFQUFmO0FBQ0FoRCxzQkFBZ0IsQ0FBQ21DLE1BQWpCLENBQXdCSCxNQUFNLENBQUNsQixHQUEvQixFQUFvQztBQUFDc0IsWUFBSSxFQUFDO0FBQUMsV0FBQ3hDLFVBQUQsR0FBYWlEO0FBQWQ7QUFBTixPQUFwQztBQUNELEtBSEQ7O0FBSUF6RSxnQkFBWSxDQUFDNEIsZ0JBQUQsRUFBbUI4QixNQUFuQixFQUEyQjVDLE9BQTNCLENBQVo7QUFFQWMsb0JBQWdCLENBQUNxQyxLQUFqQixDQUF1QlAsTUFBdkIsQ0FBOEJBLE1BQTlCO0FBRUE5QixvQkFBZ0IsQ0FBQ3FDLEtBQWpCLENBQXVCRixNQUF2QixDQUE4QixVQUFTSixNQUFULEVBQWlCQyxNQUFqQixFQUF5Qk0sYUFBekIsRUFBdUM7QUFDbkUsVUFBR3RFLENBQUMsQ0FBQzBDLFFBQUYsQ0FBVzRCLGFBQVgsRUFBMEJwQixhQUFhLENBQUNiLEtBQWQsQ0FBb0IsR0FBcEIsRUFBeUIsQ0FBekIsQ0FBMUIsQ0FBSCxFQUEwRDtBQUN4RCxZQUFJd0MsUUFBUSxHQUFHMUMsZUFBZSxDQUFDMkMsSUFBaEIsQ0FBcUI7QUFBQyxXQUFDNUIsYUFBRCxHQUFnQmMsTUFBTSxDQUFDbEI7QUFBeEIsU0FBckIsRUFBbURGLFNBQW5ELEVBQThEb0MsS0FBOUQsRUFBZjtBQUNBaEQsd0JBQWdCLENBQUNtQyxNQUFqQixDQUF3QkgsTUFBTSxDQUFDbEIsR0FBL0IsRUFBb0M7QUFBQ3NCLGNBQUksRUFBQztBQUFDLGFBQUN4QyxVQUFELEdBQWFpRDtBQUFkO0FBQU4sU0FBcEM7QUFDRDtBQUNGLEtBTEQ7QUFPQTFDLG1CQUFlLENBQUNrQyxLQUFoQixDQUFzQlAsTUFBdEIsQ0FBNkIsVUFBU0MsTUFBVCxFQUFpQkUsS0FBakIsRUFBdUI7QUFDbEQsVUFBSVIsVUFBVSxHQUFHRixtQkFBbUIsQ0FBQ1UsS0FBRCxDQUFwQzs7QUFDQSxVQUFHUixVQUFVLENBQUNFLE1BQWQsRUFBcUI7QUFDbkIsWUFBSWEsV0FBVyxHQUFHeEUsQ0FBQyxDQUFDeUUsSUFBRixDQUFPUixLQUFQLEVBQWN6QixXQUFkLENBQWxCOztBQUNBUix3QkFBZ0IsQ0FBQ21DLE1BQWpCLENBQXdCO0FBQUNyQixhQUFHLEVBQUM7QUFBQ2lDLGVBQUcsRUFBQ3RCO0FBQUw7QUFBTCxTQUF4QixFQUFnRDtBQUFDd0IsZUFBSyxFQUFDO0FBQUMsYUFBQ3JELFVBQUQsR0FBYTRDO0FBQWQ7QUFBUCxTQUFoRCxFQUFvRjtBQUFDRSxlQUFLLEVBQUM7QUFBUCxTQUFwRjtBQUNEO0FBQ0YsS0FORDtBQVFBdkMsbUJBQWUsQ0FBQ2tDLEtBQWhCLENBQXNCRixNQUF0QixDQUE2QixVQUFTSixNQUFULEVBQWlCRSxLQUFqQixFQUF3QkssYUFBeEIsRUFBc0M7QUFDakUsVUFBR3RFLENBQUMsQ0FBQzJFLFlBQUYsQ0FBZUwsYUFBZixFQUE4QmxCLFNBQTlCLEVBQXlDTyxNQUE1QyxFQUFtRDtBQUNqRCxZQUFJRixVQUFVLEdBQUdGLG1CQUFtQixDQUFDVSxLQUFELENBQXBDO0FBQ0EsWUFBSXVCLFdBQVcsR0FBRyxLQUFLRCxRQUFMLElBQWlCaEMsbUJBQW1CLENBQUMsS0FBS2dDLFFBQU4sQ0FBdEQ7QUFDQUMsbUJBQVcsR0FBR3hGLENBQUMsQ0FBQ3lGLFVBQUYsQ0FBYUQsV0FBYixFQUEwQi9CLFVBQTFCLENBQWQ7O0FBQ0EsWUFBRytCLFdBQVcsQ0FBQzdCLE1BQWYsRUFBc0I7QUFDcEIzQiwwQkFBZ0IsQ0FBQ21DLE1BQWpCLENBQXdCO0FBQUNyQixlQUFHLEVBQUM7QUFBQ2lDLGlCQUFHLEVBQUNTO0FBQUw7QUFBTCxXQUF4QixFQUFpRDtBQUFDSCxpQkFBSyxFQUFDO0FBQUMsZUFBQ3pELFVBQUQsR0FBYTtBQUFDa0IsbUJBQUcsRUFBQ21CLEtBQUssQ0FBQ25CO0FBQVg7QUFBZDtBQUFQLFdBQWpELEVBQXlGO0FBQUM0QixpQkFBSyxFQUFDO0FBQVAsV0FBekY7QUFDRDs7QUFDRCxZQUFHakIsVUFBVSxDQUFDRSxNQUFkLEVBQXFCO0FBQ25CLGNBQUlhLFdBQVcsR0FBR3hFLENBQUMsQ0FBQ3lFLElBQUYsQ0FBT1IsS0FBUCxFQUFjekIsV0FBZCxDQUFsQjs7QUFDQVIsMEJBQWdCLENBQUM4QyxJQUFqQixDQUFzQjtBQUFDaEMsZUFBRyxFQUFDO0FBQUNpQyxpQkFBRyxFQUFDdEI7QUFBTDtBQUFMLFdBQXRCLEVBQThDVCxVQUE5QyxFQUEwRGtDLE9BQTFELENBQWtFbEIsTUFBTSxJQUFJO0FBQzFFLGdCQUFJbUIsS0FBSyxHQUFHbkYsQ0FBQyxDQUFDb0YsU0FBRixDQUFZcEYsQ0FBQyxDQUFDMEQsR0FBRixDQUFNTSxNQUFOLEVBQWNwQyxVQUFkLENBQVosRUFBdUM7QUFBQ2tCLGlCQUFHLEVBQUNtQixLQUFLLENBQUNuQjtBQUFYLGFBQXZDLENBQVo7O0FBQ0EsZ0JBQUdxQyxLQUFLLEdBQUcsQ0FBQyxDQUFaLEVBQWM7QUFDWm5ELDhCQUFnQixDQUFDbUMsTUFBakIsQ0FBd0JILE1BQU0sQ0FBQ2xCLEdBQS9CLEVBQW9DO0FBQUNzQixvQkFBSSxFQUFDO0FBQUMsbUJBQUN4QyxVQUFVLEdBQUcsR0FBYixHQUFtQnVELEtBQXBCLEdBQTJCWDtBQUE1QjtBQUFOLGVBQXBDO0FBQ0QsYUFGRCxNQUVPO0FBQ0x4Qyw4QkFBZ0IsQ0FBQ21DLE1BQWpCLENBQXdCSCxNQUFNLENBQUNsQixHQUEvQixFQUFvQztBQUFDbUMscUJBQUssRUFBQztBQUFDLG1CQUFDckQsVUFBRCxHQUFhNEM7QUFBZDtBQUFQLGVBQXBDO0FBQ0Q7QUFDRixXQVBEO0FBUUQ7QUFDRjtBQUNGLEtBcEJEO0FBc0JBckMsbUJBQWUsQ0FBQ2tDLEtBQWhCLENBQXNCTyxNQUF0QixDQUE2QixVQUFTYixNQUFULEVBQWlCRSxLQUFqQixFQUF1QjtBQUNsRCxVQUFJUixVQUFVLEdBQUdGLG1CQUFtQixDQUFDVSxLQUFELENBQXBDOztBQUNBLFVBQUdSLFVBQVUsQ0FBQ0UsTUFBZCxFQUFxQjtBQUNuQjNCLHdCQUFnQixDQUFDbUMsTUFBakIsQ0FBd0I7QUFBQ3JCLGFBQUcsRUFBQztBQUFDaUMsZUFBRyxFQUFDdEI7QUFBTDtBQUFMLFNBQXhCLEVBQWdEO0FBQUM0QixlQUFLLEVBQUM7QUFBQyxhQUFDekQsVUFBRCxHQUFhO0FBQUNrQixpQkFBRyxFQUFDbUIsS0FBSyxDQUFDbkI7QUFBWDtBQUFkO0FBQVAsU0FBaEQsRUFBd0Y7QUFBQzRCLGVBQUssRUFBQztBQUFQLFNBQXhGO0FBQ0Q7QUFDRixLQUxEO0FBTUQ7QUFDRixDQWxRRCxDOzs7Ozs7Ozs7OztBQ2xCQSxJQUFJMUUsQ0FBSjs7QUFBTUosTUFBTSxDQUFDSyxJQUFQLENBQVksUUFBWixFQUFxQjtBQUFDQyxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDSCxLQUFDLEdBQUNHLENBQUY7QUFBSTs7QUFBaEIsQ0FBckIsRUFBdUMsQ0FBdkM7QUFBMEMsSUFBSUMsWUFBSjtBQUFpQlIsTUFBTSxDQUFDSyxJQUFQLENBQVksaUJBQVosRUFBOEI7QUFBQ0csY0FBWSxDQUFDRCxDQUFELEVBQUc7QUFBQ0MsZ0JBQVksR0FBQ0QsQ0FBYjtBQUFlOztBQUFoQyxDQUE5QixFQUFnRSxDQUFoRTs7QUFHakVXLEtBQUssQ0FBQ0MsVUFBTixDQUFpQkMsU0FBakIsQ0FBMkIwRSxVQUEzQixHQUF3QyxVQUFTeEUsT0FBVCxFQUFrQjtBQUN4REMsT0FBSyxDQUFDRCxPQUFELEVBQVU7QUFDYkUsY0FBVSxFQUFDTixLQUFLLENBQUNDLFVBREo7QUFFYmEsY0FBVSxFQUFDSixNQUZFO0FBR2JHLGtCQUFjLEVBQUNILE1BSEY7QUFJYm1FLFlBQVEsRUFBQ3RFLEtBQUssQ0FBQ1MsUUFBTixDQUFlTCxNQUFmLENBSkk7QUFLYkksZ0JBQVksRUFBQ1IsS0FBSyxDQUFDUyxRQUFOLENBQWVDLE9BQWY7QUFMQSxHQUFWLENBQUw7QUFRQSxNQUFJQyxnQkFBZ0IsR0FBR2QsT0FBTyxDQUFDVyxZQUFSLElBQXdCSSxPQUFPLENBQUMsb0JBQUQsQ0FBL0IsR0FBd0QsS0FBS0MsV0FBN0QsR0FBMkUsSUFBbEc7QUFDQSxNQUFJQyxlQUFlLEdBQUdqQixPQUFPLENBQUNFLFVBQTlCO0FBQ0EsTUFBSXVFLFFBQVEsR0FBR3pFLE9BQU8sQ0FBQ3lFLFFBQVIsSUFBb0IsRUFBbkM7QUFDQSxNQUFJL0QsVUFBVSxHQUFHVixPQUFPLENBQUNVLFVBQXpCO0FBQ0EsTUFBSUQsY0FBYyxHQUFHVCxPQUFPLENBQUNTLGNBQTdCOztBQUNBLE1BQUlTLGFBQWEsR0FBR3BDLENBQUMsQ0FBQ1ksS0FBRixDQUFRLENBQUNlLGNBQUQsQ0FBUixFQUEwQjNCLENBQUMsQ0FBQzRGLElBQUYsQ0FBT0QsUUFBUCxDQUExQixDQUFwQjs7QUFFQSxNQUFHaEUsY0FBYyxDQUFDVSxLQUFmLENBQXFCLE1BQXJCLEVBQTZCLENBQTdCLEtBQW1DVCxVQUFVLENBQUNTLEtBQVgsQ0FBaUIsTUFBakIsRUFBeUIsQ0FBekIsQ0FBdEMsRUFBa0U7QUFDaEUsVUFBTSxJQUFJQyxLQUFKLENBQVUsaUVBQVYsQ0FBTjtBQUNEOztBQUVELFdBQVM2QixNQUFULENBQWdCRixLQUFoQixFQUFzQjtBQUNwQixRQUFJNEIsR0FBRyxHQUFHN0YsQ0FBQyxDQUFDMEQsR0FBRixDQUFNTyxLQUFOLEVBQWF0QyxjQUFiLENBQVY7O0FBQ0EsUUFBR2tFLEdBQUgsRUFBTztBQUNMLFVBQUlDLE1BQU0sR0FBRzlGLENBQUMsQ0FBQytGLEtBQUYsQ0FBUUosUUFBUixFQUFrQjtBQUFDLFNBQUNoRSxjQUFELEdBQWlCa0U7QUFBbEIsT0FBbEIsQ0FBYjs7QUFDQTdELHNCQUFnQixDQUFDbUMsTUFBakIsQ0FBd0I7QUFBQ3JCLFdBQUcsRUFBQytDO0FBQUwsT0FBeEIsRUFBbUM7QUFBQ3pCLFlBQUksRUFBQztBQUFDLFdBQUN4QyxVQUFELEdBQWFPLGVBQWUsQ0FBQzJDLElBQWhCLENBQXFCZ0IsTUFBckIsRUFBNkJFLEtBQTdCO0FBQWQ7QUFBTixPQUFuQztBQUNEO0FBQ0Y7O0FBRUQsV0FBU2xDLE1BQVQsQ0FBZ0JDLE1BQWhCLEVBQXdCQyxNQUF4QixFQUErQjtBQUM3QixRQUFJOEIsTUFBTSxHQUFHOUYsQ0FBQyxDQUFDK0YsS0FBRixDQUFRSixRQUFSLEVBQWtCO0FBQUMsT0FBQ2hFLGNBQUQsR0FBaUJxQyxNQUFNLENBQUNsQjtBQUF6QixLQUFsQixDQUFiOztBQUNBZCxvQkFBZ0IsQ0FBQ21DLE1BQWpCLENBQXdCSCxNQUFNLENBQUNsQixHQUEvQixFQUFvQztBQUFDc0IsVUFBSSxFQUFDO0FBQUMsU0FBQ3hDLFVBQUQsR0FBYU8sZUFBZSxDQUFDMkMsSUFBaEIsQ0FBcUJnQixNQUFyQixFQUE2QkUsS0FBN0I7QUFBZDtBQUFOLEtBQXBDO0FBQ0Q7O0FBRUQ1RixjQUFZLENBQUM0QixnQkFBRCxFQUFtQjhCLE1BQW5CLEVBQTJCNUMsT0FBM0IsQ0FBWjtBQUVBYyxrQkFBZ0IsQ0FBQ3FDLEtBQWpCLENBQXVCUCxNQUF2QixDQUE4QkEsTUFBOUI7QUFFQTNCLGlCQUFlLENBQUNrQyxLQUFoQixDQUFzQlAsTUFBdEIsQ0FBNkIsQ0FBQ0MsTUFBRCxFQUFTRSxLQUFULEtBQW1CO0FBQzlDRSxVQUFNLENBQUNGLEtBQUQsQ0FBTjtBQUNELEdBRkQ7QUFJQTlCLGlCQUFlLENBQUNrQyxLQUFoQixDQUFzQkYsTUFBdEIsQ0FBNkIsQ0FBQ0osTUFBRCxFQUFTRSxLQUFULEVBQWdCSyxhQUFoQixLQUFrQztBQUM3RCxRQUFHdEUsQ0FBQyxDQUFDMkUsWUFBRixDQUFlTCxhQUFmLEVBQThCbEMsYUFBOUIsRUFBNkN1QixNQUFoRCxFQUF1RDtBQUNyRFEsWUFBTSxDQUFDRixLQUFELENBQU47QUFDQUUsWUFBTSxDQUFDLEtBQUtvQixRQUFOLENBQU47QUFDRDtBQUNGLEdBTEQ7QUFPQXBELGlCQUFlLENBQUNrQyxLQUFoQixDQUFzQk8sTUFBdEIsQ0FBNkIsQ0FBQ2IsTUFBRCxFQUFTRSxLQUFULEtBQW1CO0FBQzlDRSxVQUFNLENBQUNGLEtBQUQsQ0FBTjtBQUNELEdBRkQ7QUFHRCxDQW5ERCxDOzs7Ozs7Ozs7OztBQ0hBLElBQUlqRSxDQUFKOztBQUFNSixNQUFNLENBQUNLLElBQVAsQ0FBWSxRQUFaLEVBQXFCO0FBQUNDLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNILEtBQUMsR0FBQ0csQ0FBRjtBQUFJOztBQUFoQixDQUFyQixFQUF1QyxDQUF2QztBQUEwQyxJQUFJQyxZQUFKO0FBQWlCUixNQUFNLENBQUNLLElBQVAsQ0FBWSxpQkFBWixFQUE4QjtBQUFDRyxjQUFZLENBQUNELENBQUQsRUFBRztBQUFDQyxnQkFBWSxHQUFDRCxDQUFiO0FBQWU7O0FBQWhDLENBQTlCLEVBQWdFLENBQWhFOztBQUdqRVcsS0FBSyxDQUFDQyxVQUFOLENBQWlCQyxTQUFqQixDQUEyQlksVUFBM0IsR0FBd0MsVUFBU1YsT0FBVCxFQUFrQjtBQUV4REMsT0FBSyxDQUFDRCxPQUFELEVBQVU7QUFDYlUsY0FBVSxFQUFDSixNQURFO0FBRWJoQixVQUFNLEVBQUMsQ0FBQ2dCLE1BQUQsQ0FGTTtBQUdicUIsYUFBUyxFQUFDeEIsS0FBSyxDQUFDUyxRQUFOLENBQWVtRSxRQUFmLENBSEc7QUFJYnBFLGdCQUFZLEVBQUNSLEtBQUssQ0FBQ1MsUUFBTixDQUFlQyxPQUFmO0FBSkEsR0FBVixDQUFMO0FBT0EsTUFBSVgsVUFBVSxHQUFHRixPQUFPLENBQUNXLFlBQVIsSUFBd0JJLE9BQU8sQ0FBQyxvQkFBRCxDQUEvQixHQUF3RCxLQUFLQyxXQUE3RCxHQUEyRSxJQUE1RjtBQUNBLE1BQUlOLFVBQVUsR0FBR1YsT0FBTyxDQUFDVSxVQUF6QjtBQUNBLE1BQUlwQixNQUFNLEdBQUdVLE9BQU8sQ0FBQ1YsTUFBckI7O0FBQ0EsTUFBSTRDLFNBQVMsR0FBR3BELENBQUMsQ0FBQ3FELElBQUYsQ0FBT3JELENBQUMsQ0FBQ3NELEdBQUYsQ0FBTTlDLE1BQU4sRUFBY3VDLEtBQUssSUFBSUEsS0FBSyxDQUFDVixLQUFOLENBQVksR0FBWixFQUFpQixDQUFqQixDQUF2QixDQUFQLENBQWhCOztBQUNBLE1BQUlRLFNBQVMsR0FBRzNCLE9BQU8sQ0FBQzJCLFNBQXhCOztBQUNBLE1BQUcsQ0FBQ0EsU0FBSixFQUFlO0FBQ2JBLGFBQVMsR0FBRyxVQUFTcUQsR0FBVCxFQUFjO0FBQ3hCLGFBQU9sRyxDQUFDLENBQUNtRyxPQUFGLENBQVVuRyxDQUFDLENBQUNzRCxHQUFGLENBQU05QyxNQUFOLEVBQWN1QyxLQUFLLElBQUkvQyxDQUFDLENBQUMwRCxHQUFGLENBQU13QyxHQUFOLEVBQVduRCxLQUFYLENBQXZCLENBQVYsRUFBcURxRCxJQUFyRCxDQUEwRCxJQUExRCxDQUFQO0FBQ0QsS0FGRDtBQUdEOztBQUVELE1BQUdwRyxDQUFDLENBQUMwQyxRQUFGLENBQVdVLFNBQVgsRUFBc0J4QixVQUFVLENBQUNTLEtBQVgsQ0FBaUIsTUFBakIsRUFBeUIsQ0FBekIsQ0FBdEIsQ0FBSCxFQUFzRDtBQUNwRCxVQUFNLElBQUlDLEtBQUosQ0FBVSxrRUFBVixDQUFOO0FBQ0Q7O0FBRUQsV0FBUytELFVBQVQsQ0FBb0JDLE1BQXBCLEVBQTRCSixHQUE1QixFQUFnQztBQUM5QjlFLGNBQVUsQ0FBQytDLE1BQVgsQ0FBa0IrQixHQUFHLENBQUNwRCxHQUF0QixFQUEyQjtBQUFDc0IsVUFBSSxFQUFDO0FBQUMsU0FBQ3hDLFVBQUQsR0FBYWlCLFNBQVMsQ0FBQzdDLENBQUMsQ0FBQ3lFLElBQUYsQ0FBT3lCLEdBQVAsRUFBWTFGLE1BQVosQ0FBRDtBQUF2QjtBQUFOLEtBQTNCO0FBQ0Q7O0FBRURKLGNBQVksQ0FBQ2dCLFVBQUQsRUFBYWlGLFVBQWIsRUFBeUJuRixPQUF6QixDQUFaO0FBRUFFLFlBQVUsQ0FBQ2lELEtBQVgsQ0FBaUJQLE1BQWpCLENBQXdCdUMsVUFBeEI7QUFFQWpGLFlBQVUsQ0FBQ2lELEtBQVgsQ0FBaUJGLE1BQWpCLENBQXdCLENBQUNKLE1BQUQsRUFBU21DLEdBQVQsRUFBYzVCLGFBQWQsS0FBZ0M7QUFDdEQsUUFBR3RFLENBQUMsQ0FBQzJFLFlBQUYsQ0FBZUwsYUFBZixFQUE4QmxCLFNBQTlCLEVBQXlDTyxNQUE1QyxFQUFtRDtBQUNqRDRDLFlBQU0sQ0FBQ0MsS0FBUCxDQUFhLE1BQUk7QUFDZnBGLGtCQUFVLENBQUMrQyxNQUFYLENBQWtCK0IsR0FBRyxDQUFDcEQsR0FBdEIsRUFBMkI7QUFBQ3NCLGNBQUksRUFBQztBQUFDLGFBQUN4QyxVQUFELEdBQWFpQixTQUFTLENBQUM3QyxDQUFDLENBQUN5RSxJQUFGLENBQU95QixHQUFQLEVBQVkxRixNQUFaLENBQUQ7QUFBdkI7QUFBTixTQUEzQjtBQUNELE9BRkQ7QUFHRDtBQUNGLEdBTkQ7QUFPRCxDQXZDRCxDOzs7Ozs7Ozs7OztBQ0hBWixNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDNEcsa0JBQWdCLEVBQUMsTUFBSUEsZ0JBQXRCO0FBQXVDckcsY0FBWSxFQUFDLE1BQUlBLFlBQXhEO0FBQXFFTixTQUFPLEVBQUMsTUFBSUEsT0FBakY7QUFBeUZDLGFBQVcsRUFBQyxNQUFJQTtBQUF6RyxDQUFkOztBQUFxSSxJQUFJQyxDQUFKOztBQUFNSixNQUFNLENBQUNLLElBQVAsQ0FBWSxRQUFaLEVBQXFCO0FBQUNDLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNILEtBQUMsR0FBQ0csQ0FBRjtBQUFJOztBQUFoQixDQUFyQixFQUF1QyxDQUF2QztBQUEwQyxJQUFJVyxLQUFKO0FBQVVsQixNQUFNLENBQUNLLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNhLE9BQUssQ0FBQ1gsQ0FBRCxFQUFHO0FBQUNXLFNBQUssR0FBQ1gsQ0FBTjtBQUFROztBQUFsQixDQUEzQixFQUErQyxDQUEvQztBQUFrRCxJQUFJdUcsUUFBSjtBQUFhOUcsTUFBTSxDQUFDSyxJQUFQLENBQVksWUFBWixFQUF5QjtBQUFDQyxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDdUcsWUFBUSxHQUFDdkcsQ0FBVDtBQUFXOztBQUF2QixDQUF6QixFQUFrRCxDQUFsRDtBQUl2UCxNQUFNc0csZ0JBQWdCLEdBQUcsSUFBSTNGLEtBQUssQ0FBQ0MsVUFBVixDQUFxQixrQkFBckIsQ0FBekI7QUFFUCxJQUFJNEYsVUFBVSxHQUFHLEVBQWpCOztBQUVPLFNBQVN2RyxZQUFULENBQXNCZ0IsVUFBdEIsRUFBa0N3RixRQUFsQyxFQUE0QzFGLE9BQTVDLEVBQW9EO0FBQ3pELE1BQUkyRixJQUFJLEdBQUc3RyxDQUFDLENBQUN5QyxLQUFGLENBQVF2QixPQUFSLENBQVg7O0FBQ0EsTUFBRzJGLElBQUksQ0FBQ3pGLFVBQVIsRUFBbUI7QUFBRTtBQUNuQnlGLFFBQUksQ0FBQ3pGLFVBQUwsR0FBa0J5RixJQUFJLENBQUN6RixVQUFMLENBQWdCMEYsS0FBbEM7QUFDRDs7QUFDREQsTUFBSSxHQUFHRSxJQUFJLENBQUNDLFNBQUwsQ0FBZUgsSUFBZixDQUFQO0FBQ0FGLFlBQVUsQ0FBQzlGLElBQVgsQ0FBZ0I7QUFDZEssV0FBTyxFQUFDMkYsSUFETTtBQUVkSSxrQkFBYyxFQUFDN0YsVUFBVSxDQUFDMEYsS0FGWjtBQUdkMUYsY0FBVSxFQUFDQSxVQUhHO0FBSWRRLGNBQVUsRUFBQ1YsT0FBTyxDQUFDVSxVQUpMO0FBS2RzRixNQUFFLEVBQUNOO0FBTFcsR0FBaEI7QUFPRDs7QUFFTSxTQUFTOUcsT0FBVCxDQUFpQm1ILGNBQWpCLEVBQWlDckYsVUFBakMsRUFBNkMrRCxRQUE3QyxFQUFzRDtBQUMzRCxNQUFJd0IsU0FBUyxHQUFHbkgsQ0FBQyxDQUFDOEUsSUFBRixDQUFPNkIsVUFBUCxFQUFtQjtBQUFDTSxrQkFBRDtBQUFpQnJGO0FBQWpCLEdBQW5CLENBQWhCOztBQUNBLE1BQUcsQ0FBQ3VGLFNBQUosRUFBYztBQUNaLFVBQU0sSUFBSTdFLEtBQUosQ0FBVSw0QkFBNEIyRSxjQUE1QixHQUE2QyxLQUE3QyxHQUFxRHJGLFVBQS9ELENBQU47QUFDRCxHQUZELE1BRU87QUFDTCxRQUFJd0YsSUFBSSxHQUFHLElBQUlDLElBQUosRUFBWDtBQUNBLFFBQUlDLENBQUMsR0FBRyxDQUFSO0FBQ0FILGFBQVMsQ0FBQy9GLFVBQVYsQ0FBcUIwRCxJQUFyQixDQUEwQmEsUUFBUSxJQUFJLEVBQXRDLEVBQTBDVCxPQUExQyxDQUFrRGdCLEdBQUcsSUFBSTtBQUN2RGlCLGVBQVMsQ0FBQ0QsRUFBVixDQUFhLElBQWIsRUFBbUJoQixHQUFuQjtBQUNBb0IsT0FBQztBQUNGLEtBSEQ7QUFJQUMsV0FBTyxDQUFDQyxHQUFSLENBQWEsWUFBVzVGLFVBQVcsT0FBTTBGLENBQUUsWUFBV0wsY0FBYyxJQUFJdEIsUUFBUSxHQUFHLGVBQWVvQixJQUFJLENBQUNDLFNBQUwsQ0FBZXJCLFFBQWYsQ0FBbEIsR0FBNkMsRUFBekQsQ0FBNkQsYUFBWSxJQUFJMEIsSUFBSixLQUFhRCxJQUFLLElBQS9KO0FBQ0Q7QUFDRjs7QUFFTSxTQUFTckgsV0FBVCxHQUFzQjtBQUMzQkMsR0FBQyxDQUFDUyxJQUFGLENBQU9rRyxVQUFQLEVBQW1CUSxTQUFTLElBQUk7QUFDOUIsUUFBRyxDQUFDVixnQkFBZ0IsQ0FBQ3ZDLE9BQWpCLENBQXlCO0FBQUMrQyxvQkFBYyxFQUFDRSxTQUFTLENBQUNGLGNBQTFCO0FBQTBDL0YsYUFBTyxFQUFDaUcsU0FBUyxDQUFDakc7QUFBNUQsS0FBekIsQ0FBSixFQUFtRztBQUNqR3BCLGFBQU8sQ0FBQ3FILFNBQVMsQ0FBQ0YsY0FBWCxFQUEyQkUsU0FBUyxDQUFDdkYsVUFBckMsQ0FBUDtBQUNBNkUsc0JBQWdCLENBQUMzQyxNQUFqQixDQUF3QjtBQUN0Qm1ELHNCQUFjLEVBQUNFLFNBQVMsQ0FBQ0YsY0FESDtBQUV0Qi9GLGVBQU8sRUFBQ2lHLFNBQVMsQ0FBQ2pHLE9BRkk7QUFHdEJ1RyxZQUFJLEVBQUMsSUFBSUosSUFBSjtBQUhpQixPQUF4QjtBQUtEO0FBQ0YsR0FURDtBQVVELEMiLCJmaWxlIjoiL3BhY2thZ2VzL2hlcnRlYnlfZGVub3JtYWxpemUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQge2FkZE1pZ3JhdGlvbiwgbWlncmF0ZSwgYXV0b01pZ3JhdGV9IGZyb20gJy4vbWlncmF0aW9ucy5qcydcblxuZXhwb3J0IHttaWdyYXRlLCBhdXRvTWlncmF0ZX1cblxuZnVuY3Rpb24gZmxhdHRlbkZpZWxkcyhvYmplY3QsIHByZWZpeCl7XG4gIHByZWZpeCA9IHByZWZpeCB8fCAnJ1xuICBsZXQgZmllbGRzID0gW11cbiAgXy5lYWNoKG9iamVjdCwgKHZhbCwga2V5KSA9PiB7XG4gICAgaWYodHlwZW9mIHZhbCA9PSAnb2JqZWN0Jyl7XG4gICAgICBmaWVsZHMgPSBfLnVuaW9uKGZpZWxkcywgZmxhdHRlbkZpZWxkcyh2YWwsIHByZWZpeCArIGtleSArICcuJykpXG4gICAgfSBlbHNlIHtcbiAgICAgIGZpZWxkcy5wdXNoKHByZWZpeCArIGtleSlcbiAgICB9XG4gIH0pXG4gIHJldHVybiBmaWVsZHNcbn1cblxuTW9uZ28uQ29sbGVjdGlvbi5wcm90b3R5cGUuY2FjaGUgPSBmdW5jdGlvbihvcHRpb25zKXtcbiAgY2hlY2sob3B0aW9ucywge1xuICAgIGNvbGxlY3Rpb246TWF0Y2guV2hlcmUoY29sbGVjdGlvbiA9PiBjb2xsZWN0aW9uIGluc3RhbmNlb2YgTW9uZ28uQ29sbGVjdGlvbiksXG4gICAgZmllbGRzOk1hdGNoLk9uZU9mKFtTdHJpbmddLCBPYmplY3QpLFxuICAgIHR5cGU6TWF0Y2guT25lT2YoJ29uZScsICdtYW55JywgJ2ludmVyc2VkJywgJ2ludmVyc2UnLCAnbWFueS1pbnZlcnNlZCcsICdtYW55LWludmVyc2UnKSxcbiAgICByZWZlcmVuY2VGaWVsZDpTdHJpbmcsXG4gICAgY2FjaGVGaWVsZDpTdHJpbmcsXG4gICAgYnlwYXNzU2NoZW1hOk1hdGNoLk9wdGlvbmFsKEJvb2xlYW4pXG4gIH0pXG4gIGlmKG9wdGlvbnMudHlwZSA9PSAnaW52ZXJzZScpIG9wdGlvbnMudHlwZSA9ICdpbnZlcnNlZCcgLy9Ob3Qgc3VyZSB3aGljaCBpcyBiZXN0LCBzbyB3aHkgbm90IHN1cHBvcnQgYm90aCBhbmQgYmUgdHlwby1mcmllbmRseVxuICBpZihvcHRpb25zLnR5cGUgPT0gJ21hbnktaW52ZXJzZScpIG9wdGlvbnMudHlwZSA9ICdtYW55LWludmVyc2VkJ1xuXG4gIC8vQnlwYXNzIGNvbGxlY3Rpb24yIHNjaGVtYXNcbiAgbGV0IHBhcmVudENvbGxlY3Rpb24gPSBvcHRpb25zLmJ5cGFzc1NjaGVtYSAmJiBQYWNrYWdlWydhbGRlZWQ6Y29sbGVjdGlvbjInXSA/IHRoaXMuX2NvbGxlY3Rpb24gOiB0aGlzXG4gIGxldCBjaGlsZENvbGxlY3Rpb24gPSBvcHRpb25zLmNvbGxlY3Rpb25cbiAgbGV0IHR5cGUgPSBvcHRpb25zLnR5cGVcbiAgbGV0IHJlZmVyZW5jZUZpZWxkID0gb3B0aW9ucy5yZWZlcmVuY2VGaWVsZFxuICBsZXQgY2FjaGVGaWVsZCA9IG9wdGlvbnMuY2FjaGVGaWVsZFxuICBsZXQgd2F0Y2hlZEZpZWxkcyA9IG9wdGlvbnMuZmllbGRzXG5cbiAgaWYocmVmZXJlbmNlRmllbGQuc3BsaXQoL1suOl0vKVswXSA9PSBjYWNoZUZpZWxkLnNwbGl0KC9bLjpdLylbMF0pe1xuICAgIHRocm93IG5ldyBFcnJvcigncmVmZXJlbmNlRmllbGQgYW5kIGNhY2hlRmllbGQgbXVzdCBub3Qgc2hhcmUgdGhlIHNhbWUgdG9wIGZpZWxkJylcbiAgfVxuXG4gIGlmKCFfLmlzQXJyYXkod2F0Y2hlZEZpZWxkcykpe1xuICAgIHdhdGNoZWRGaWVsZHMgPSBmbGF0dGVuRmllbGRzKHdhdGNoZWRGaWVsZHMpXG4gIH1cblxuICBsZXQgY2hpbGRGaWVsZHMgPSBfLmNsb25lKHdhdGNoZWRGaWVsZHMpXG4gIGlmKHR5cGUgIT09ICdvbmUnKXtcbiAgICBpZighXy5pbmNsdWRlcyhjaGlsZEZpZWxkcywgJ19pZCcpKXtcbiAgICAgIGNoaWxkRmllbGRzLnB1c2goJ19pZCcpXG4gICAgfVxuICAgIF8ucHVsbChjaGlsZEZpZWxkcywgcmVmZXJlbmNlRmllbGQpXG4gIH1cbiAgbGV0IGNoaWxkT3B0cyA9IHt0cmFuc2Zvcm06bnVsbCwgZmllbGRzOntfaWQ6MH19XG4gIF8uZWFjaChjaGlsZEZpZWxkcywgZmllbGQgPT4gY2hpbGRPcHRzLmZpZWxkc1tmaWVsZF0gPSAxKVxuXG4gIGxldCBwYXJlbnRPcHRzID0ge3RyYW5zZm9ybTpudWxsLCBmaWVsZHM6e19pZDoxLCBbY2FjaGVGaWVsZF06MX19XG4gIGlmKHR5cGUgIT09ICdpbnZlcnNlZCcgJiYgdHlwZSAhPT0gJ21hbnktaW52ZXJzZWQnKXtcbiAgICBwYXJlbnRPcHRzLmZpZWxkc1tyZWZlcmVuY2VGaWVsZC5zcGxpdCgnOicpWzBdXSA9IDFcbiAgfVxuXG4gIGxldCBpZEZpZWxkLCByZWZlcmVuY2VQYXRoXG4gIGlmKHR5cGUgPT0gJ21hbnknIHx8IHR5cGUgPT0gJ21hbnktaW52ZXJzZWQnKXtcbiAgICByZWZlcmVuY2VQYXRoID0gcmVmZXJlbmNlRmllbGQucmVwbGFjZSgnOicsICcuJylcbiAgICBpZEZpZWxkID0gcmVmZXJlbmNlRmllbGQuc3BsaXQoJzonKVsxXVxuICAgIHJlZmVyZW5jZUZpZWxkID0gcmVmZXJlbmNlRmllbGQuc3BsaXQoJzonKVswXVxuICB9XG5cbiAgaWYodHlwZSA9PSAnaW52ZXJzZWQnIHx8IHR5cGUgPT0gJ21hbnktaW52ZXJzZWQnICYmICFfLmluY2x1ZGVzKHdhdGNoZWRGaWVsZHMsIHJlZmVyZW5jZVBhdGgpKXtcbiAgICB3YXRjaGVkRmllbGRzLnB1c2gocmVmZXJlbmNlUGF0aCB8fCByZWZlcmVuY2VGaWVsZClcbiAgfVxuXG4gIGxldCB0b3BGaWVsZHMgPSBfLnVuaXEod2F0Y2hlZEZpZWxkcy5tYXAoZmllbGQgPT4gZmllbGQuc3BsaXQoJy4nKVswXSkpXG5cbiAgZnVuY3Rpb24gZ2V0TmVzdGVkUmVmZXJlbmNlcyhkb2N1bWVudCl7IC8vVXNlZCBmb3IgbmVzdGVkIHJlZmVyZW5jZXMgaW4gXCJtYW55XCIgbGlua3NcbiAgICBsZXQgcmVmZXJlbmNlcyA9IF8uZ2V0KGRvY3VtZW50LCByZWZlcmVuY2VGaWVsZCkgfHwgW11cbiAgICBpZihpZEZpZWxkICYmIHJlZmVyZW5jZXMubGVuZ3RoKXtcbiAgICAgIHJlZmVyZW5jZXMgPSBfLm1hcChyZWZlcmVuY2VzLCBpdGVtID0+IF8uZ2V0KGl0ZW0sIGlkRmllbGQpKVxuICAgIH1cbiAgICByZXR1cm4gXy51bmlxKF8uZmxhdHRlbihyZWZlcmVuY2VzKSlcbiAgfVxuXG5cbiAgaWYodHlwZSA9PSAnb25lJyl7XG4gICAgbGV0IGluc2VydCA9IGZ1bmN0aW9uIGluc2VydCh1c2VySWQsIHBhcmVudCl7XG4gICAgICBpZihfLmdldChwYXJlbnQsIHJlZmVyZW5jZUZpZWxkKSl7XG4gICAgICAgIGxldCBjaGlsZCA9IGNoaWxkQ29sbGVjdGlvbi5maW5kT25lKF8uZ2V0KHBhcmVudCwgcmVmZXJlbmNlRmllbGQpLCBjaGlsZE9wdHMpXG4gICAgICAgIGlmKGNoaWxkKXtcbiAgICAgICAgICBwYXJlbnRDb2xsZWN0aW9uLnVwZGF0ZShwYXJlbnQuX2lkLCB7JHNldDp7W2NhY2hlRmllbGRdOmNoaWxkfX0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgYWRkTWlncmF0aW9uKHBhcmVudENvbGxlY3Rpb24sIGluc2VydCwgb3B0aW9ucylcbiAgICBwYXJlbnRDb2xsZWN0aW9uLmFmdGVyLmluc2VydChpbnNlcnQpXG5cbiAgICBwYXJlbnRDb2xsZWN0aW9uLmFmdGVyLnVwZGF0ZShmdW5jdGlvbih1c2VySWQsIHBhcmVudCwgY2hhbmdlZEZpZWxkcyl7XG4gICAgICBpZihfLmluY2x1ZGVzKGNoYW5nZWRGaWVsZHMsIHJlZmVyZW5jZUZpZWxkLnNwbGl0KCcuJylbMF0pKXtcbiAgICAgICAgbGV0IGNoaWxkID0gXy5nZXQocGFyZW50LCByZWZlcmVuY2VGaWVsZCkgJiYgY2hpbGRDb2xsZWN0aW9uLmZpbmRPbmUoXy5nZXQocGFyZW50LCByZWZlcmVuY2VGaWVsZCksIGNoaWxkT3B0cylcbiAgICAgICAgaWYoY2hpbGQpe1xuICAgICAgICAgIHBhcmVudENvbGxlY3Rpb24udXBkYXRlKHBhcmVudC5faWQsIHskc2V0OntbY2FjaGVGaWVsZF06Y2hpbGR9fSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXJlbnRDb2xsZWN0aW9uLnVwZGF0ZShwYXJlbnQuX2lkLCB7JHVuc2V0OntbY2FjaGVGaWVsZF06MX19KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIGNoaWxkQ29sbGVjdGlvbi5hZnRlci5pbnNlcnQoZnVuY3Rpb24odXNlcklkLCBjaGlsZCl7XG4gICAgICBsZXQgcGlja2VkQ2hpbGQgPSBfLnBpY2soY2hpbGQsIGNoaWxkRmllbGRzKVxuICAgICAgcGFyZW50Q29sbGVjdGlvbi51cGRhdGUoe1tyZWZlcmVuY2VGaWVsZF06Y2hpbGQuX2lkfSwgeyRzZXQ6e1tjYWNoZUZpZWxkXTpwaWNrZWRDaGlsZH19LCB7bXVsdGk6dHJ1ZX0pXG4gICAgfSlcblxuICAgIGNoaWxkQ29sbGVjdGlvbi5hZnRlci51cGRhdGUoZnVuY3Rpb24odXNlcklkLCBjaGlsZCwgY2hhbmdlZEZpZWxkcyl7XG4gICAgICBpZihfLmludGVyc2VjdGlvbihjaGFuZ2VkRmllbGRzLCB0b3BGaWVsZHMpLmxlbmd0aCl7XG4gICAgICAgIGxldCBwaWNrZWRDaGlsZCA9IF8ucGljayhjaGlsZCwgY2hpbGRGaWVsZHMpXG4gICAgICAgIHBhcmVudENvbGxlY3Rpb24udXBkYXRlKHtbcmVmZXJlbmNlRmllbGRdOmNoaWxkLl9pZH0sIHskc2V0OntbY2FjaGVGaWVsZF06cGlja2VkQ2hpbGR9fSwge211bHRpOnRydWV9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjaGlsZENvbGxlY3Rpb24uYWZ0ZXIucmVtb3ZlKGZ1bmN0aW9uKHVzZXJJZCwgY2hpbGQpe1xuICAgICAgcGFyZW50Q29sbGVjdGlvbi51cGRhdGUoe1tyZWZlcmVuY2VGaWVsZF06Y2hpbGQuX2lkfSwgeyR1bnNldDp7W2NhY2hlRmllbGRdOjF9fSwge211bHRpOnRydWV9KVxuICAgIH0pXG4gIH0gXG5cbiAgZWxzZSBpZih0eXBlID09ICdtYW55Jyl7XG4gICAgbGV0IGluc2VydCA9IGZ1bmN0aW9uIGluc2VydCh1c2VySWQsIHBhcmVudCl7XG4gICAgICBsZXQgcmVmZXJlbmNlcyA9IGdldE5lc3RlZFJlZmVyZW5jZXMocGFyZW50KVxuICAgICAgaWYocmVmZXJlbmNlcy5sZW5ndGgpe1xuICAgICAgICBsZXQgY2hpbGRyZW4gPSBjaGlsZENvbGxlY3Rpb24uZmluZCh7X2lkOnskaW46cmVmZXJlbmNlc319LCBjaGlsZE9wdHMpLmZldGNoKClcbiAgICAgICAgcGFyZW50Q29sbGVjdGlvbi51cGRhdGUocGFyZW50Ll9pZCwgeyRzZXQ6e1tjYWNoZUZpZWxkXTpjaGlsZHJlbn19KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyZW50Q29sbGVjdGlvbi51cGRhdGUocGFyZW50Ll9pZCwgeyRzZXQ6e1tjYWNoZUZpZWxkXTpbXX19KVxuICAgICAgfVxuICAgIH1cbiAgICBhZGRNaWdyYXRpb24ocGFyZW50Q29sbGVjdGlvbiwgaW5zZXJ0LCBvcHRpb25zKVxuICAgIHBhcmVudENvbGxlY3Rpb24uYWZ0ZXIuaW5zZXJ0KGluc2VydClcblxuICAgIHBhcmVudENvbGxlY3Rpb24uYWZ0ZXIudXBkYXRlKGZ1bmN0aW9uKHVzZXJJZCwgcGFyZW50LCBjaGFuZ2VkRmllbGRzKXtcbiAgICAgIGlmKF8uaW5jbHVkZXMoY2hhbmdlZEZpZWxkcywgcmVmZXJlbmNlUGF0aC5zcGxpdCgnLicpWzBdKSl7XG4gICAgICAgIGxldCByZWZlcmVuY2VzID0gZ2V0TmVzdGVkUmVmZXJlbmNlcyhwYXJlbnQpXG4gICAgICAgIGlmKHJlZmVyZW5jZXMubGVuZ3RoKXtcbiAgICAgICAgICBsZXQgY2hpbGRyZW4gPSBjaGlsZENvbGxlY3Rpb24uZmluZCh7X2lkOnskaW46cmVmZXJlbmNlc319LCBjaGlsZE9wdHMpLmZldGNoKClcbiAgICAgICAgICBwYXJlbnRDb2xsZWN0aW9uLnVwZGF0ZShwYXJlbnQuX2lkLCB7JHNldDp7W2NhY2hlRmllbGRdOmNoaWxkcmVufX0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyZW50Q29sbGVjdGlvbi51cGRhdGUocGFyZW50Ll9pZCwgeyRzZXQ6e1tjYWNoZUZpZWxkXTpbXX19KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIGNoaWxkQ29sbGVjdGlvbi5hZnRlci5pbnNlcnQoZnVuY3Rpb24odXNlcklkLCBjaGlsZCl7XG4gICAgICBsZXQgcGlja2VkQ2hpbGQgPSBfLnBpY2soY2hpbGQsIGNoaWxkRmllbGRzKVxuICAgICAgcGFyZW50Q29sbGVjdGlvbi51cGRhdGUoe1tyZWZlcmVuY2VQYXRoXTpjaGlsZC5faWR9LCB7JHB1c2g6e1tjYWNoZUZpZWxkXTpwaWNrZWRDaGlsZH19LCB7bXVsdGk6dHJ1ZX0pXG4gICAgfSlcblxuICAgIGNoaWxkQ29sbGVjdGlvbi5hZnRlci51cGRhdGUoZnVuY3Rpb24odXNlcklkLCBjaGlsZCwgY2hhbmdlZEZpZWxkcyl7XG4gICAgICBpZihfLmludGVyc2VjdGlvbihjaGFuZ2VkRmllbGRzLCB0b3BGaWVsZHMpLmxlbmd0aCl7XG4gICAgICAgIGxldCBwaWNrZWRDaGlsZCA9IF8ucGljayhjaGlsZCwgY2hpbGRGaWVsZHMpXG4gICAgICAgIHBhcmVudENvbGxlY3Rpb24uZmluZCh7W3JlZmVyZW5jZVBhdGhdOmNoaWxkLl9pZH0sIHBhcmVudE9wdHMpLmZvckVhY2gocGFyZW50ID0+IHtcbiAgICAgICAgICBsZXQgaW5kZXggPSBfLmZpbmRJbmRleChfLmdldChwYXJlbnQsIGNhY2hlRmllbGQpLCB7X2lkOmNoaWxkLl9pZH0pXG4gICAgICAgICAgaWYoaW5kZXggPiAtMSl7XG4gICAgICAgICAgICBwYXJlbnRDb2xsZWN0aW9uLnVwZGF0ZShwYXJlbnQuX2lkLCB7JHNldDp7W2NhY2hlRmllbGQgKyAnLicgKyBpbmRleF06cGlja2VkQ2hpbGR9fSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50Q29sbGVjdGlvbi51cGRhdGUocGFyZW50Ll9pZCwgeyRwdXNoOntbY2FjaGVGaWVsZF06cGlja2VkQ2hpbGR9fSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNoaWxkQ29sbGVjdGlvbi5hZnRlci5yZW1vdmUoZnVuY3Rpb24odXNlcklkLCBjaGlsZCl7XG4gICAgICBwYXJlbnRDb2xsZWN0aW9uLnVwZGF0ZSh7W3JlZmVyZW5jZVBhdGhdOmNoaWxkLl9pZH0sIHskcHVsbDp7W2NhY2hlRmllbGRdOntfaWQ6Y2hpbGQuX2lkfX19LCB7bXVsdGk6dHJ1ZX0pXG4gICAgfSlcbiAgfVxuXG5cbiAgZWxzZSBpZih0eXBlID09ICdpbnZlcnNlZCcpe1xuICAgIGxldCBpbnNlcnQgPSBmdW5jdGlvbiBpbnNlcnQodXNlcklkLCBwYXJlbnQpe1xuICAgICAgbGV0IGNoaWxkcmVuID0gY2hpbGRDb2xsZWN0aW9uLmZpbmQoe1tyZWZlcmVuY2VGaWVsZF06cGFyZW50Ll9pZH0sIGNoaWxkT3B0cykuZmV0Y2goKVxuICAgICAgcGFyZW50Q29sbGVjdGlvbi51cGRhdGUocGFyZW50Ll9pZCwgeyRzZXQ6e1tjYWNoZUZpZWxkXTpjaGlsZHJlbn19KVxuICAgIH1cbiAgICBhZGRNaWdyYXRpb24ocGFyZW50Q29sbGVjdGlvbiwgaW5zZXJ0LCBvcHRpb25zKVxuXG4gICAgcGFyZW50Q29sbGVjdGlvbi5hZnRlci5pbnNlcnQoaW5zZXJ0KVxuXG4gICAgcGFyZW50Q29sbGVjdGlvbi5hZnRlci51cGRhdGUoZnVuY3Rpb24odXNlcklkLCBwYXJlbnQsIGNoYW5nZWRGaWVsZHMpe1xuICAgICAgaWYoXy5pbmNsdWRlcyhjaGFuZ2VkRmllbGRzLCByZWZlcmVuY2VGaWVsZC5zcGxpdCgnLicpWzBdKSl7XG4gICAgICAgIGlmKF8uZ2V0KHBhcmVudCwgcmVmZXJlbmNlRmllbGQpKXtcbiAgICAgICAgICBsZXQgY2hpbGRyZW4gPSBjaGlsZENvbGxlY3Rpb24uZmluZCh7W3JlZmVyZW5jZUZpZWxkXTpwYXJlbnQuX2lkfSwgY2hpbGRPcHRzKS5mZXRjaCgpXG4gICAgICAgICAgcGFyZW50Q29sbGVjdGlvbi51cGRhdGUocGFyZW50Ll9pZCwgeyRzZXQ6e1tjYWNoZUZpZWxkXTpjaGlsZHJlbn19KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhcmVudENvbGxlY3Rpb24udXBkYXRlKHBhcmVudC5faWQsIHskc2V0OntbY2FjaGVGaWVsZF06W119fSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjaGlsZENvbGxlY3Rpb24uYWZ0ZXIuaW5zZXJ0KGZ1bmN0aW9uKHVzZXJJZCwgY2hpbGQpe1xuICAgICAgbGV0IHBpY2tlZENoaWxkID0gXy5waWNrKGNoaWxkLCBjaGlsZEZpZWxkcylcbiAgICAgIGlmKF8uZ2V0KGNoaWxkLCByZWZlcmVuY2VGaWVsZCkpe1xuICAgICAgICBwYXJlbnRDb2xsZWN0aW9uLnVwZGF0ZSh7X2lkOl8uZ2V0KGNoaWxkLCByZWZlcmVuY2VGaWVsZCl9LCB7JHB1c2g6e1tjYWNoZUZpZWxkXTpwaWNrZWRDaGlsZH19KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjaGlsZENvbGxlY3Rpb24uYWZ0ZXIudXBkYXRlKGZ1bmN0aW9uKHVzZXJJZCwgY2hpbGQsIGNoYW5nZWRGaWVsZHMpe1xuICAgICAgaWYoXy5pbnRlcnNlY3Rpb24oY2hhbmdlZEZpZWxkcywgdG9wRmllbGRzKS5sZW5ndGgpe1xuICAgICAgICBsZXQgcGlja2VkQ2hpbGQgPSBfLnBpY2soY2hpbGQsIGNoaWxkRmllbGRzKVxuICAgICAgICBsZXQgcHJldmlvdXNJZCA9IHRoaXMucHJldmlvdXMgJiYgXy5nZXQodGhpcy5wcmV2aW91cywgcmVmZXJlbmNlRmllbGQpXG4gICAgICAgIGlmKHByZXZpb3VzSWQgJiYgcHJldmlvdXNJZCAhPT0gXy5nZXQoY2hpbGQsIHJlZmVyZW5jZUZpZWxkKSl7XG4gICAgICAgICAgcGFyZW50Q29sbGVjdGlvbi51cGRhdGUoe19pZDpwcmV2aW91c0lkfSwgeyRwdWxsOntbY2FjaGVGaWVsZF06e19pZDpjaGlsZC5faWR9fX0pXG4gICAgICAgIH1cbiAgICAgICAgcGFyZW50Q29sbGVjdGlvbi5maW5kKHtfaWQ6Xy5nZXQoY2hpbGQsIHJlZmVyZW5jZUZpZWxkKX0sIHBhcmVudE9wdHMpLmZvckVhY2gocGFyZW50ID0+IHtcbiAgICAgICAgICBsZXQgaW5kZXggPSBfLmZpbmRJbmRleChfLmdldChwYXJlbnQsIGNhY2hlRmllbGQpLCB7X2lkOmNoaWxkLl9pZH0pXG4gICAgICAgICAgaWYoaW5kZXggPiAtMSl7XG4gICAgICAgICAgICBwYXJlbnRDb2xsZWN0aW9uLnVwZGF0ZShwYXJlbnQuX2lkLCB7JHNldDp7W2NhY2hlRmllbGQgKyAnLicgKyBpbmRleF06cGlja2VkQ2hpbGR9fSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50Q29sbGVjdGlvbi51cGRhdGUocGFyZW50Ll9pZCwgeyRwdXNoOntbY2FjaGVGaWVsZF06cGlja2VkQ2hpbGR9fSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNoaWxkQ29sbGVjdGlvbi5hZnRlci5yZW1vdmUoZnVuY3Rpb24odXNlcklkLCBjaGlsZCl7XG4gICAgICBwYXJlbnRDb2xsZWN0aW9uLnVwZGF0ZSh7X2lkOl8uZ2V0KGNoaWxkLCByZWZlcmVuY2VGaWVsZCl9LCB7JHB1bGw6e1tjYWNoZUZpZWxkXTp7X2lkOmNoaWxkLl9pZH19fSlcbiAgICB9KVxuICB9XG5cbiAgZWxzZSBpZih0eXBlID09ICdtYW55LWludmVyc2VkJyl7XG4gICAgbGV0IGluc2VydCA9IGZ1bmN0aW9uIGluc2VydCh1c2VySWQsIHBhcmVudCl7XG4gICAgICBsZXQgY2hpbGRyZW4gPSBjaGlsZENvbGxlY3Rpb24uZmluZCh7W3JlZmVyZW5jZVBhdGhdOnBhcmVudC5faWR9LCBjaGlsZE9wdHMpLmZldGNoKClcbiAgICAgIHBhcmVudENvbGxlY3Rpb24udXBkYXRlKHBhcmVudC5faWQsIHskc2V0OntbY2FjaGVGaWVsZF06Y2hpbGRyZW59fSlcbiAgICB9XG4gICAgYWRkTWlncmF0aW9uKHBhcmVudENvbGxlY3Rpb24sIGluc2VydCwgb3B0aW9ucylcblxuICAgIHBhcmVudENvbGxlY3Rpb24uYWZ0ZXIuaW5zZXJ0KGluc2VydClcblxuICAgIHBhcmVudENvbGxlY3Rpb24uYWZ0ZXIudXBkYXRlKGZ1bmN0aW9uKHVzZXJJZCwgcGFyZW50LCBjaGFuZ2VkRmllbGRzKXtcbiAgICAgIGlmKF8uaW5jbHVkZXMoY2hhbmdlZEZpZWxkcywgcmVmZXJlbmNlUGF0aC5zcGxpdCgnLicpWzBdKSl7XG4gICAgICAgIGxldCBjaGlsZHJlbiA9IGNoaWxkQ29sbGVjdGlvbi5maW5kKHtbcmVmZXJlbmNlUGF0aF06cGFyZW50Ll9pZH0sIGNoaWxkT3B0cykuZmV0Y2goKVxuICAgICAgICBwYXJlbnRDb2xsZWN0aW9uLnVwZGF0ZShwYXJlbnQuX2lkLCB7JHNldDp7W2NhY2hlRmllbGRdOmNoaWxkcmVufX0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNoaWxkQ29sbGVjdGlvbi5hZnRlci5pbnNlcnQoZnVuY3Rpb24odXNlcklkLCBjaGlsZCl7XG4gICAgICBsZXQgcmVmZXJlbmNlcyA9IGdldE5lc3RlZFJlZmVyZW5jZXMoY2hpbGQpXG4gICAgICBpZihyZWZlcmVuY2VzLmxlbmd0aCl7ICAgICAgICBcbiAgICAgICAgbGV0IHBpY2tlZENoaWxkID0gXy5waWNrKGNoaWxkLCBjaGlsZEZpZWxkcylcbiAgICAgICAgcGFyZW50Q29sbGVjdGlvbi51cGRhdGUoe19pZDp7JGluOnJlZmVyZW5jZXN9fSwgeyRwdXNoOntbY2FjaGVGaWVsZF06cGlja2VkQ2hpbGR9fSwge211bHRpOnRydWV9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjaGlsZENvbGxlY3Rpb24uYWZ0ZXIudXBkYXRlKGZ1bmN0aW9uKHVzZXJJZCwgY2hpbGQsIGNoYW5nZWRGaWVsZHMpe1xuICAgICAgaWYoXy5pbnRlcnNlY3Rpb24oY2hhbmdlZEZpZWxkcywgdG9wRmllbGRzKS5sZW5ndGgpe1xuICAgICAgICBsZXQgcmVmZXJlbmNlcyA9IGdldE5lc3RlZFJlZmVyZW5jZXMoY2hpbGQpXG4gICAgICAgIGxldCBwcmV2aW91c0lkcyA9IHRoaXMucHJldmlvdXMgJiYgZ2V0TmVzdGVkUmVmZXJlbmNlcyh0aGlzLnByZXZpb3VzKVxuICAgICAgICBwcmV2aW91c0lkcyA9IF8uZGlmZmVyZW5jZShwcmV2aW91c0lkcywgcmVmZXJlbmNlcylcbiAgICAgICAgaWYocHJldmlvdXNJZHMubGVuZ3RoKXtcbiAgICAgICAgICBwYXJlbnRDb2xsZWN0aW9uLnVwZGF0ZSh7X2lkOnskaW46cHJldmlvdXNJZHN9fSwgeyRwdWxsOntbY2FjaGVGaWVsZF06e19pZDpjaGlsZC5faWR9fX0sIHttdWx0aTp0cnVlfSlcbiAgICAgICAgfVxuICAgICAgICBpZihyZWZlcmVuY2VzLmxlbmd0aCl7XG4gICAgICAgICAgbGV0IHBpY2tlZENoaWxkID0gXy5waWNrKGNoaWxkLCBjaGlsZEZpZWxkcylcbiAgICAgICAgICBwYXJlbnRDb2xsZWN0aW9uLmZpbmQoe19pZDp7JGluOnJlZmVyZW5jZXN9fSwgcGFyZW50T3B0cykuZm9yRWFjaChwYXJlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gXy5maW5kSW5kZXgoXy5nZXQocGFyZW50LCBjYWNoZUZpZWxkKSwge19pZDpjaGlsZC5faWR9KVxuICAgICAgICAgICAgaWYoaW5kZXggPiAtMSl7XG4gICAgICAgICAgICAgIHBhcmVudENvbGxlY3Rpb24udXBkYXRlKHBhcmVudC5faWQsIHskc2V0OntbY2FjaGVGaWVsZCArICcuJyArIGluZGV4XTpwaWNrZWRDaGlsZH19KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGFyZW50Q29sbGVjdGlvbi51cGRhdGUocGFyZW50Ll9pZCwgeyRwdXNoOntbY2FjaGVGaWVsZF06cGlja2VkQ2hpbGR9fSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIGNoaWxkQ29sbGVjdGlvbi5hZnRlci5yZW1vdmUoZnVuY3Rpb24odXNlcklkLCBjaGlsZCl7XG4gICAgICBsZXQgcmVmZXJlbmNlcyA9IGdldE5lc3RlZFJlZmVyZW5jZXMoY2hpbGQpXG4gICAgICBpZihyZWZlcmVuY2VzLmxlbmd0aCl7XG4gICAgICAgIHBhcmVudENvbGxlY3Rpb24udXBkYXRlKHtfaWQ6eyRpbjpyZWZlcmVuY2VzfX0sIHskcHVsbDp7W2NhY2hlRmllbGRdOntfaWQ6Y2hpbGQuX2lkfX19LCB7bXVsdGk6dHJ1ZX0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxufSIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCB7YWRkTWlncmF0aW9ufSBmcm9tICcuL21pZ3JhdGlvbnMuanMnXG5cbk1vbmdvLkNvbGxlY3Rpb24ucHJvdG90eXBlLmNhY2hlQ291bnQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIGNoZWNrKG9wdGlvbnMsIHtcbiAgICBjb2xsZWN0aW9uOk1vbmdvLkNvbGxlY3Rpb24sXG4gICAgY2FjaGVGaWVsZDpTdHJpbmcsXG4gICAgcmVmZXJlbmNlRmllbGQ6U3RyaW5nLFxuICAgIHNlbGVjdG9yOk1hdGNoLk9wdGlvbmFsKE9iamVjdCksXG4gICAgYnlwYXNzU2NoZW1hOk1hdGNoLk9wdGlvbmFsKEJvb2xlYW4pXG4gIH0pXG5cbiAgbGV0IHBhcmVudENvbGxlY3Rpb24gPSBvcHRpb25zLmJ5cGFzc1NjaGVtYSAmJiBQYWNrYWdlWydhbGRlZWQ6Y29sbGVjdGlvbjInXSA/IHRoaXMuX2NvbGxlY3Rpb24gOiB0aGlzXG4gIGxldCBjaGlsZENvbGxlY3Rpb24gPSBvcHRpb25zLmNvbGxlY3Rpb25cbiAgbGV0IHNlbGVjdG9yID0gb3B0aW9ucy5zZWxlY3RvciB8fCB7fVxuICBsZXQgY2FjaGVGaWVsZCA9IG9wdGlvbnMuY2FjaGVGaWVsZFxuICBsZXQgcmVmZXJlbmNlRmllbGQgPSBvcHRpb25zLnJlZmVyZW5jZUZpZWxkXG4gIGxldCB3YXRjaGVkRmllbGRzID0gXy51bmlvbihbcmVmZXJlbmNlRmllbGRdLCBfLmtleXMoc2VsZWN0b3IpKVxuXG4gIGlmKHJlZmVyZW5jZUZpZWxkLnNwbGl0KC9bLjpdLylbMF0gPT0gY2FjaGVGaWVsZC5zcGxpdCgvWy46XS8pWzBdKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlZmVyZW5jZUZpZWxkIGFuZCBjYWNoZUZpZWxkIG11c3Qgbm90IHNoYXJlIHRoZSBzYW1lIHRvcCBmaWVsZCcpXG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGUoY2hpbGQpe1xuICAgIGxldCByZWYgPSBfLmdldChjaGlsZCwgcmVmZXJlbmNlRmllbGQpXG4gICAgaWYocmVmKXtcbiAgICAgIGxldCBzZWxlY3QgPSBfLm1lcmdlKHNlbGVjdG9yLCB7W3JlZmVyZW5jZUZpZWxkXTpyZWZ9KVxuICAgICAgcGFyZW50Q29sbGVjdGlvbi51cGRhdGUoe19pZDpyZWZ9LCB7JHNldDp7W2NhY2hlRmllbGRdOmNoaWxkQ29sbGVjdGlvbi5maW5kKHNlbGVjdCkuY291bnQoKX19KVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluc2VydCh1c2VySWQsIHBhcmVudCl7XG4gICAgbGV0IHNlbGVjdCA9IF8ubWVyZ2Uoc2VsZWN0b3IsIHtbcmVmZXJlbmNlRmllbGRdOnBhcmVudC5faWR9KVxuICAgIHBhcmVudENvbGxlY3Rpb24udXBkYXRlKHBhcmVudC5faWQsIHskc2V0OntbY2FjaGVGaWVsZF06Y2hpbGRDb2xsZWN0aW9uLmZpbmQoc2VsZWN0KS5jb3VudCgpfX0pXG4gIH1cblxuICBhZGRNaWdyYXRpb24ocGFyZW50Q29sbGVjdGlvbiwgaW5zZXJ0LCBvcHRpb25zKVxuXG4gIHBhcmVudENvbGxlY3Rpb24uYWZ0ZXIuaW5zZXJ0KGluc2VydClcbiAgXG4gIGNoaWxkQ29sbGVjdGlvbi5hZnRlci5pbnNlcnQoKHVzZXJJZCwgY2hpbGQpID0+IHtcbiAgICB1cGRhdGUoY2hpbGQpXG4gIH0pXG5cbiAgY2hpbGRDb2xsZWN0aW9uLmFmdGVyLnVwZGF0ZSgodXNlcklkLCBjaGlsZCwgY2hhbmdlZEZpZWxkcykgPT4ge1xuICAgIGlmKF8uaW50ZXJzZWN0aW9uKGNoYW5nZWRGaWVsZHMsIHdhdGNoZWRGaWVsZHMpLmxlbmd0aCl7XG4gICAgICB1cGRhdGUoY2hpbGQpXG4gICAgICB1cGRhdGUodGhpcy5wcmV2aW91cylcbiAgICB9XG4gIH0pXG5cbiAgY2hpbGRDb2xsZWN0aW9uLmFmdGVyLnJlbW92ZSgodXNlcklkLCBjaGlsZCkgPT4ge1xuICAgIHVwZGF0ZShjaGlsZClcbiAgfSlcbn0iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQge2FkZE1pZ3JhdGlvbn0gZnJvbSAnLi9taWdyYXRpb25zLmpzJ1xuXG5Nb25nby5Db2xsZWN0aW9uLnByb3RvdHlwZS5jYWNoZUZpZWxkID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXG4gIGNoZWNrKG9wdGlvbnMsIHtcbiAgICBjYWNoZUZpZWxkOlN0cmluZyxcbiAgICBmaWVsZHM6W1N0cmluZ10sXG4gICAgdHJhbnNmb3JtOk1hdGNoLk9wdGlvbmFsKEZ1bmN0aW9uKSxcbiAgICBieXBhc3NTY2hlbWE6TWF0Y2guT3B0aW9uYWwoQm9vbGVhbilcbiAgfSlcblxuICBsZXQgY29sbGVjdGlvbiA9IG9wdGlvbnMuYnlwYXNzU2NoZW1hICYmIFBhY2thZ2VbJ2FsZGVlZDpjb2xsZWN0aW9uMiddID8gdGhpcy5fY29sbGVjdGlvbiA6IHRoaXNcbiAgbGV0IGNhY2hlRmllbGQgPSBvcHRpb25zLmNhY2hlRmllbGRcbiAgbGV0IGZpZWxkcyA9IG9wdGlvbnMuZmllbGRzXG4gIGxldCB0b3BGaWVsZHMgPSBfLnVuaXEoXy5tYXAoZmllbGRzLCBmaWVsZCA9PiBmaWVsZC5zcGxpdCgnLicpWzBdKSlcbiAgbGV0IHRyYW5zZm9ybSA9IG9wdGlvbnMudHJhbnNmb3JtXG4gIGlmKCF0cmFuc2Zvcm0pIHtcbiAgICB0cmFuc2Zvcm0gPSBmdW5jdGlvbihkb2MpIHtcbiAgICAgIHJldHVybiBfLmNvbXBhY3QoXy5tYXAoZmllbGRzLCBmaWVsZCA9PiBfLmdldChkb2MsIGZpZWxkKSkpLmpvaW4oJywgJylcbiAgICB9XG4gIH1cblxuICBpZihfLmluY2x1ZGVzKHRvcEZpZWxkcywgY2FjaGVGaWVsZC5zcGxpdCgvWy46XS8pWzBdKSl7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd3YXRjaGluZyB0aGUgY2FjaGVGaWVsZCBmb3IgY2hhbmdlcyB3b3VsZCBjYXVzZSBhbiBpbmZpbml0ZSBsb29wJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGluc2VydEhvb2sodXNlcmlkLCBkb2Mpe1xuICAgIGNvbGxlY3Rpb24udXBkYXRlKGRvYy5faWQsIHskc2V0OntbY2FjaGVGaWVsZF06dHJhbnNmb3JtKF8ucGljayhkb2MsIGZpZWxkcykpfX0pXG4gIH1cblxuICBhZGRNaWdyYXRpb24oY29sbGVjdGlvbiwgaW5zZXJ0SG9vaywgb3B0aW9ucylcblxuICBjb2xsZWN0aW9uLmFmdGVyLmluc2VydChpbnNlcnRIb29rKVxuXG4gIGNvbGxlY3Rpb24uYWZ0ZXIudXBkYXRlKCh1c2VySWQsIGRvYywgY2hhbmdlZEZpZWxkcykgPT4ge1xuICAgIGlmKF8uaW50ZXJzZWN0aW9uKGNoYW5nZWRGaWVsZHMsIHRvcEZpZWxkcykubGVuZ3RoKXtcbiAgICAgIE1ldGVvci5kZWZlcigoKT0+e1xuICAgICAgICBjb2xsZWN0aW9uLnVwZGF0ZShkb2MuX2lkLCB7JHNldDp7W2NhY2hlRmllbGRdOnRyYW5zZm9ybShfLnBpY2soZG9jLCBmaWVsZHMpKX19KVxuICAgICAgfSlcbiAgICB9XG4gIH0pICBcbn1cbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCB7TW9uZ299IGZyb20gJ21ldGVvci9tb25nbydcbmltcG9ydCBzZXR0aW5ncyBmcm9tICcuL2NhY2hlLmpzJ1xuXG5leHBvcnQgY29uc3QgTWlncmF0aW9uSGlzdG9yeSA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdfY2FjaGVNaWdyYXRpb25zJylcblxubGV0IG1pZ3JhdGlvbnMgPSBbXVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkTWlncmF0aW9uKGNvbGxlY3Rpb24sIGluc2VydEZuLCBvcHRpb25zKXtcbiAgbGV0IG9wdHMgPSBfLmNsb25lKG9wdGlvbnMpXG4gIGlmKG9wdHMuY29sbGVjdGlvbil7IC8vcHJldmVudCBFcnJvcjogQ29udmVydGluZyBjaXJjdWxhciBzdHJ1Y3R1cmUgdG8gSlNPTlxuICAgIG9wdHMuY29sbGVjdGlvbiA9IG9wdHMuY29sbGVjdGlvbi5fbmFtZVxuICB9XG4gIG9wdHMgPSBKU09OLnN0cmluZ2lmeShvcHRzKVxuICBtaWdyYXRpb25zLnB1c2goe1xuICAgIG9wdGlvbnM6b3B0cyxcbiAgICBjb2xsZWN0aW9uTmFtZTpjb2xsZWN0aW9uLl9uYW1lLFxuICAgIGNvbGxlY3Rpb246Y29sbGVjdGlvbixcbiAgICBjYWNoZUZpZWxkOm9wdGlvbnMuY2FjaGVGaWVsZCxcbiAgICBmbjppbnNlcnRGblxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWlncmF0ZShjb2xsZWN0aW9uTmFtZSwgY2FjaGVGaWVsZCwgc2VsZWN0b3Ipe1xuICBsZXQgbWlncmF0aW9uID0gXy5maW5kKG1pZ3JhdGlvbnMsIHtjb2xsZWN0aW9uTmFtZSwgY2FjaGVGaWVsZH0pXG4gIGlmKCFtaWdyYXRpb24pe1xuICAgIHRocm93IG5ldyBFcnJvcignbm8gbWlncmF0aW9uIGZvdW5kIGZvciAnICsgY29sbGVjdGlvbk5hbWUgKyAnIC0gJyArIGNhY2hlRmllbGQpXG4gIH0gZWxzZSB7XG4gICAgbGV0IHRpbWUgPSBuZXcgRGF0ZSgpXG4gICAgbGV0IG4gPSAwXG4gICAgbWlncmF0aW9uLmNvbGxlY3Rpb24uZmluZChzZWxlY3RvciB8fCB7fSkuZm9yRWFjaChkb2MgPT4ge1xuICAgICAgbWlncmF0aW9uLmZuKG51bGwsIGRvYylcbiAgICAgIG4rK1xuICAgIH0pXG4gICAgY29uc29sZS5sb2coYG1pZ3JhdGVkICR7Y2FjaGVGaWVsZH0gb2YgJHtufSBkb2NzIGluICR7Y29sbGVjdGlvbk5hbWUgKyAoc2VsZWN0b3IgPyAnIG1hdGNoaW5nICcgKyBKU09OLnN0cmluZ2lmeShzZWxlY3RvcikgOiAnJyl9LiBJdCB0b29rICR7bmV3IERhdGUoKSAtIHRpbWV9bXNgKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRvTWlncmF0ZSgpe1xuICBfLmVhY2gobWlncmF0aW9ucywgbWlncmF0aW9uID0+IHtcbiAgICBpZighTWlncmF0aW9uSGlzdG9yeS5maW5kT25lKHtjb2xsZWN0aW9uTmFtZTptaWdyYXRpb24uY29sbGVjdGlvbk5hbWUsIG9wdGlvbnM6bWlncmF0aW9uLm9wdGlvbnN9KSl7XG4gICAgICBtaWdyYXRlKG1pZ3JhdGlvbi5jb2xsZWN0aW9uTmFtZSwgbWlncmF0aW9uLmNhY2hlRmllbGQpXG4gICAgICBNaWdyYXRpb25IaXN0b3J5Lmluc2VydCh7XG4gICAgICAgIGNvbGxlY3Rpb25OYW1lOm1pZ3JhdGlvbi5jb2xsZWN0aW9uTmFtZSxcbiAgICAgICAgb3B0aW9uczptaWdyYXRpb24ub3B0aW9ucyxcbiAgICAgICAgZGF0ZTpuZXcgRGF0ZSgpXG4gICAgICB9KVxuICAgIH0gICAgXG4gIH0pXG59Il19
