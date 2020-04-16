const cleaner = require('knex-cleaner');
//----------------------------------------------------------------------------//
// USING knex-cleaner
//----------------------------------------------------------------------------//
// This package makes it easy to clear all of your tables. 
//
// Having a single "seed" file that clears all tables allows you to control the
// order in which tables are truncated, if needed, and prevents you from having
// to duplicate truncate behavior in each seed file. And knex-cleaner makes it
// easy to truncate all of the tables in your database with a single call. (Be
// sure to configure it to ignore - not truncate - the knex_migrations tables,
// or you will break your migrations! The records in those tables are used by
// knex to manage migrations...)
//
// However, knex-cleaner doesn't appear to follow the correct order in clearing
// tables with respect to foreign key definitions. For example, since the [zoos]
// table is a parent table to [zoo_animals], trying to truncate [zoos] before
// clearing [zoo_animals] will result in an error (if the default 'RESTRICT'
// behavior is in effect).
//
// To prevent this problem, you should define foreign key fields with the
// 'CASCADE' behavior. If you need the 'RESTRICT' behavior, then you will need
// to truncate the tables in the correct order using
// knex.schema.table().truncate(). 
// 
// See the migration file for more information on setting the delete and update
// behavior of the database for foreign key fields.

exports.seed = function(knex) {
  return cleaner.clean(knex, {
    mode: 'truncate', // resets ids
    ignoreTables: ['knex_migrations', 'knex_migrations_lock'], // don't empty migration tables
  });
};

