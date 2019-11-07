
exports.seed = function (knex) {
  return knex('table_name').insert([
    { name: 'Horse' },
    { name: 'Bear' },
    { name: 'Panda Bear' }
  ]);
};
