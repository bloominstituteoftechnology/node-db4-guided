
exports.up = function(knex) {
  return knex.schema
    .createTable('zoos', tbl => {
      tbl.increments('id');
      tbl.string('zoos_name', 128).notNullable();
      tbl.string('address', 128).notNullable().unique();
    })
    .createTable('species', tbl => {
      tbl.increments('id');
      tbl.sring('species_name', 128).notNullable();
    })
    .createTable('animals', tbl => {
      tbl.increments('id');
      tbl.string('animal_name', 128);
      tbl.integer('species_id').notNullable().unsigned()
    })
};

exports.down = function(knex) {
  
};
