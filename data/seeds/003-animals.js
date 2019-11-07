
exports.seed = function (knex) {
  return knex('table_name').insert([
    { name: 'Max' },
    { name: 'bojack' },
    { name: 'Yogi' },
    { name: 'booboo' },
    { name: 'Po' },
    { name: 'bao bao' }
  ]);
};
