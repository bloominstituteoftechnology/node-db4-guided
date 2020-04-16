
exports.up = function(knex) {
  return knex.schema.createTable('zoos', tbl => {
      tbl.increments();
      tbl.string('zoo_name', 128).notNullable();
      tbl.string('address', 128).notNullable().unique();
    })
      .createTable('species', tbl => {
        tbl.increments();
        tbl.string('species_name', 128).notNullable();
     })
     .createTable('animals', tbl => {
        tbl.increments();
        tbl.string('animal_name', 128).notNullable();
        tbl.integer('species_id')
        .unsigned()// never negative numbers
        .notNullable()
        .references('id')
        .inTable('species')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      })
      .createTable('zoo_animals', tbl => {
        tbl.increments();
        tbl.integer('animal_id')
            .unsigned()
            .notNullable()
            .references('animals.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
        tbl.integer('zoo_id')
            .unsigned()
            .notNullable()
            .references('zoos.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
      })
};

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('zoo_animals')
    .dropTableIfExists('animals')
    .dropTableIfExists('species')
    .dropTableIfExists('zoos');
};
