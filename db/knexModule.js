const knex = require("./pgAdaptop");
//function KnexModule(){};
//KnexModule.prototype.update()
module.exports = {
  update: (tableName, id, updateObject) => {
    return knex(tableName)
      .where("id", id)
      .update(updateObject)
      .then(data => {
        console.log(data);

        if (data)
          return knex(tableName)
            .where("id", id)
            .first();
        throw new Error("Invalid user id.");
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
            .first();
        }
        throw new Error(`Cannot insert into ${tableName}`);
      })
      .catch(err => {
        throw err;
      });
  },
  getAll: tableName => {
    return knex(tableName)
      .select()
      .then(records => {
        if (records.length) {
          return records;
        }
        throw new Error(`Table ${tableName} is empty.`);
      })
      .catch(err => {
        throw err;
      });
  },
  get: (tableName, whereObject) => {
    return knex(tableName)
      .where(whereObject)
      .first()
      .then(record => {
        if (record) {
          return record;
        }
        throw new Error(`No data found in table ${tableName}.`);
      })
      .catch(err => {
        throw err;
      });
  }
};
