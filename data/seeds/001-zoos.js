
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('table_name').del()
    .then(function () {
      // Inserts seed entries
      return knex('table_name').insert([
        { name: 'Bronx Zoo', address: 'Bronx, NY' },
        { name: 'Lincoln Park Zoo', address: 'Somewhere' },
        { name: 'San Antonio Zoo', address: 'San Antonio, TX' }
      ]);
    });
};
