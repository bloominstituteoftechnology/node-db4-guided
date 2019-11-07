
exports.up = function (knex) {
  return knex.schema.createTable('species', tbl => {
    tbl.increments(); //the type is integer w/o negitive values
    tbl.string('name', 255).notNullable();

  })
    .createTable('animals', tbl => {
      tbl.increments();
      tbl.string('name', 255).notNullable();
      //define FOREIGN KEY
      tbl.integer('species_id')
        .unsigned()
        .references('id')
        .inTable('species')
        .onDelete('RESTRICT') // could be 'RESTRICT', 'NO ACTION', 'NOT NULL'
        .onUpdate('CASCADE') //about changing the value of the primary key. 
    })
    .createTable('zoos', tbl => {
      tbl.increments();
      tbl.string('name', 255).notNullable();
      tbl.string('address', 255)

    })
    .createTable('animal_zoos', tbl => {
      tbl.increments();
      tbl.integer('animal_id')
        .unsigned()
        .references('id')
        .inTable('animals')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');
      tbl.integer('zoo_id')
        .unsigned()
        .references('id')
        .inTable('zoos')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');

    })
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('animal_zoos')
    .dropTableIfExists('zoos')
    .dropTableIfExists('animals')
    .dropTableIfExists('species')
};
