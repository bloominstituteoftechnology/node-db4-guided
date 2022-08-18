
exports.up = function (knex) {
    return knex.schema
        .createTable('animals', tbl => {
            tbl.increments('animal_id');
            tbl.varchar('animal_name', 100);
            tbl.integer('species_id')
                .references('species_id')
                .inTable('species');
        })
        .createTable('zoos', tbl => {
            tbl.increments('zoo_id');
            tbl.varchar('zoo_name', 100);
            tbl.varchar('address', 200);
        })
        .createTable('zoo_animals', tbl => {
            tbl.integer('zoo_id')
                .references('zoo_id')
                .inTable('zoos');
            tbl.integer('animal_id')
                .references('animal_id')
                .inTable('animals');
        })
        .createTable('species', tbl => {
            tbl.increments('species_id');
            tbl.varchar('species_name', 100);
        });
};

exports.down = function (knex) {

};
