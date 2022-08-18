
exports.up = function (knex) {
    return knex.schema
        .createTable('animals', tbl => {
            tbl.increments('animal_id');
            tbl.varchar('animal_name', 100)
                .notNullable();
            tbl.integer('species_id')
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
                .notNullable()
                .references('zoo_id')
                .inTable('zoos');
            tbl.integer('animal_id')
                .notNullable()
                .references('animal_id')
                .inTable('animals');
            tbl.primary(['zoo_id', 'animal_id']);
        })
        .createTable('species', tbl => {
            tbl.increments('species_id');
            tbl.varchar('species_name', 100)
                .notNullable();
        });
};

exports.down = function (knex) {

};
