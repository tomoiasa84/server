const knex = require("./pgAdaptop");
//function KnexModule(){};
//KnexModule.prototype.update()
module.exports = {
  knexRaw: queryString => {
    return knex
      .raw(queryString)
      .then(result => {
        //console.log(result.rows);
        console.log(result.rows);

        return result.rows;
      })
      .catch(error => {
        throw error;
      });
  },
  getCustom: (tableName, id) => {
    return knex
      .raw(`select * from "${tableName}" where '${id}' in (user1, user2);`)
      .then(result => {
        return result.rows;
      })
      .catch(err => {
        throw err;
      });
  },
  deleteById: (tableName, id) => {
    return knex(tableName)
      .where("id", id)
      .first()
      .del()
      .then(deleted => {
        if (deleted) return id;
        return 0;
      })
      .catch(err => {
        throw err;
      });
  },
  delete: (tableName, whereObject) => {
    return knex(tableName)
      .where(whereObject)
      .del()
      .catch(err => {
        throw err;
      });
  },
  updateById: (tableName, id, updateObject) => {
    return knex(tableName)
      .where("id", id)
      .update(updateObject)
      .then(data => {
        if (data)
          return knex(tableName)
            .where("id", id)
            .first()
            .catch(error => {
              throw error;
            });
      })
      .catch(error => {
        throw error;
      });
  },
  insert: (tableName, dataObject) => {
    return knex(tableName)
      .returning("id")
      .insert(dataObject)
      .then(ids => {
        if (ids.length) {
          return knex(tableName)
            .where("id", ids[0])
            .first()
            .catch(error => {
              throw error;
            });
        }
      })
      .catch(error => {
        throw error;
      });
  },
  getAll: tableName => {
    return knex(tableName)
      .select()
      .catch(err => {
        throw err;
      });
  },
  getById: (tableName, id) => {
    return knex(tableName)
      .where("id", id)
      .first()
      .catch(err => {
        throw err;
      });
  },
  get: (tableName, whereObject) => {
    return knex(tableName)
      .where(whereObject)
      .catch(err => {
        throw err;
      });
  }
};
