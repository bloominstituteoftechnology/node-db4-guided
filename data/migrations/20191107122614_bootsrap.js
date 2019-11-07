
exports.up = function (knex) {
    return knex.schema.createTable('species', tbl => {
        tbl.increments();
        tbl.string('name', 255).notNullable()
    })
        .createTable('animals', tbl => {
            tbl.increments();
            tbl.string('name', 255).notNullable()
            tbl.integer('species_id').unsigned().references('id').inTable('species')
                .onDelete('CACADE')//about deleting the record from the primary key table. could be Restrict, Do Nothing
                .onUpdate();
        })
        .createTable('zoos', tbl => {
            tbl.increments()
            tbl.string('name', 255)
            tbl.string('address', 255)
        })
        .createTable('animal_zoos', tbl => {
            tbl.increment()
            tbl.integer('animal_id').unsigned().references('id').inTable('animals').onDelete('RESTRICT').onUpdate('CASCADE')
            tbl.integer('zoo_id').unsigned().references('id').inTable('zoos').onDelete('RESTRICT').onUpdate('CASCADE')
            tbl.date('from')
            tbl.date('to')
        })

};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('animal_zoos')
        .dropTableIfExists('zoos')
        .dropTableIfExists('animals')
        .dropTableIfExists('species')




};
