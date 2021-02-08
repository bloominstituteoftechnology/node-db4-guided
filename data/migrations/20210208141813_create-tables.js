
exports.up = function(knex) {
    return knex.schema
    .createTable(' zoos', tbl => {
        tbl.increments();
        tbl.string('zoo_name', 128).notNullable();
        tbl.string('address', 128).notNullable().unique();

    })
    .
  
};

exports.down = function(knex) {
  
};
