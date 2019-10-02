exports.up = function(knex, Promise) {
  return knex.schema.table("Users", function(table) {
    table.string("profileURL");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("Users", function(table) {
    table.dropColumn("profileURL");
  });
};
