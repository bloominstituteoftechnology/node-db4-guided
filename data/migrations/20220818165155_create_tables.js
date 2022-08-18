
exports.up = function (knex) {
    return knex.schema
        .createTable('species', tbl => {
            tbl.increments('species_id');
            tbl.varchar('species_name', 100)
                .notNullable();
        })
        .createTable('animals', tbl => {
            tbl.increments('animal_id');
            tbl.varchar('animal_name', 100)
                .notNullable();
            tbl.integer('species_id')
                .unsigned()
                .notNullable()
                .references('species_id')
                .inTable('species');
        })
        .createTable('zoos', tbl => {
            tbl.increments('zoo_id');
            tbl.varchar('zoo_name', 100)
                .notNullable();
            tbl.varchar('address', 200)
                .notNullable();
        })
        .createTable('zoo_animals', tbl => {
            tbl.integer('zoo_id')
                .unsigned()
                .notNullable()
                .references('zoo_id')
                .inTable('zoos')
                .onDelete('CASCADE');
            tbl.integer('animal_id')
                .unsigned()
                .notNullable()
                .references('animal_id')
                .inTable('animals')
                .onDelete('CASCADE');
            tbl.primary(['zoo_id', 'animal_id']);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('zoo_animals')
        .dropTableIfExists('zoos')
        .dropTableIfExists('animals')
        .dropTableIfExists('species');
};
