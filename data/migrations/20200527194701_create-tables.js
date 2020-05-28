
exports.up = function(knex) {
  return knex.schema
    .createTable('zoos', tbl => {
      tbl.increments('id');
      tbl.string('zoo_name', 128).notNullable();
      tbl.string('address', 128).notNullable().unique();
    })
    .createTable('species', tbl => {
      tbl.increments('id');
      tbl.string('species_name', 128).notNullable();
    })
    .createTable('animals', tbl => {
      tbl.increments('id');
      tbl.string('animal_name', 128);
      tbl.integer('species_id')
        .notNullable()
        .unsigned()
        .references('species.id');
    })
    .createTable('zoo_animals', tbl => {
      tbl.integer('zoo_id')
          .notNullable()
          .unsigned()
          .references('zoos.id')
      tbl.integer('animal_id')
          .notNullable()
          .unsigned()
          .references('animals.id');
      // Create a move-to-date field
      // create a move-from-date field
      // create an increments()
      tbl.primary(['zoo_id', 'animal_id']);
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExist('zoo-animals')
    .dropTableIfExist('animals')
    .dropTableIfExist('species')
    .dropTableIfExist('zoos');
};
