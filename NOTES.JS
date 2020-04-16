//in migration file
//----------------------------------------------------------------------------//
// CREATE TABLES AND FOREIGN KEY RELATIONSHIPS
//----------------------------------------------------------------------------//
// Tables can have 1-to-1, 1-to-many, or many-to-many "relationships". These
// relationships provide value through the ability to 'JOIN' tables. By using a
// primary key value from Table A as the value of a foreign key field in Table
// B, you "relate" the two records, and using JOIN statements, you can combine
// the related data in a SQL query result.
// 
// When creating tables, you should create tables that do not have any foreign
// keys *first*. These are tables that are likely to be "parent" (a.k.a.
// "primary") tables that are referred to by other tables (a.k.a. "child"
// tables). For example, if you try to create the [animals] table below, with a
// foreign key field that references the [species] table, but the [species]
// table hasn't been created yet, you will get an error. The [species] table
// needs to be created before you can define a foreign key field in [animals]
// that references it.
exports.up = function (knex) {
    return (
        knex.schema
            .createTable('zoos', tbl => {
                // Remember that .increments() creates an integer field that is
                // auto-incrementing, not nullable, and unique, and that is
                // specified as the "primary" key field for the table.
                // 
                // Since the [zoos] table is referenced by other tables below,
                // it needs to be created before them.
                //
                // Since neither the [zoos] table nor the [species] table have
                // foreign key fields, it doesn't matter what order they are
                // created in.
                tbl.increments();

                tbl.string('zoo_name', 255).notNullable();

                tbl.string('address', 255).notNullable().unique();
            })
            .createTable('species', tbl => {
                tbl.increments();
                tbl.string('species_name', 255).notNullable().unique();
            })
            // The [animals] table has a foreign key field that references the
            // [species] table, so it must be defined/created *after* the
            // [species] table.
            .createTable('animals', tbl => {
                tbl.increments();

                tbl.string('animal_name', 255).notNullable();


                //------------------------------------------------------------//
                // DEFINING A FOREIGN KEY FIELD USING KNEX - ENSURING
                // REFERENTIAL INTEGRITY
                //------------------------------------------------------------//
                // The "species_id" field is a foreign key field. There are
                // multiple ways to define a foreign key field using knex. They
                // all have these things in common:
                //
                //   1. The field definition identifies the "parent" table, and
                //      the primary key field or column in that parent table
                //      that the foreign key field referenes.
                //   2. The field type must match the field type of the primary
                //      key field in the primary table. Primary keys that are
                //      integers are always *unsigned* (which means that they
                //      are never negative numbers). When defining a matching
                //      foreign key field that will references a primary key
                //      that is an integer, be sure to make it .unsigned().
                //   3. The default behavior of the database when a record is
                //      deleted from the primary table, and the primary key for
                //      that record is used as a foreign key value in other
                //      "child" tables, is to disallow the delete request and
                //      throw an error. This is also true if the primary key
                //      value is *modified* (or updated) - changing a primary
                //      key value has the same effect as deleting the record,
                //      and creating a new record with a different primary key
                //      value. You can override this default "disallow" behavior
                //      by using the .onDelete() and .onUpdate() methods. The
                //      string values you can pass to these methods are outlined
                //      below, where .onDelete() and .onUpdate() are called. See
                //      documentation for the "foreign()" method at
                //      https://knexjs.org.
                tbl.integer('species_id')
                    .unsigned()
                    .notNullable()
                    //--------------------------------------------------------//
                    // METHODS FOR DEFINING FOREIGN KEYS
                    //--------------------------------------------------------//
                    // There are 3 ways to define a foreign key column. There
                    // are examples of all three below.
                    //
                    //--------------------------------------------------------//
                    // METHOD 1 FOR DEFINING A FOREIGN KEY FIELD
                    //--------------------------------------------------------//
                    // As below, using the .references() method in the column
                    // definition chain (after tbl.integer()). You pass in both
                    // the table name and the field name using a "." between
                    // them, as below.
                    .references('species.id')
                    //--------------------------------------------------------//
                    // VALUES FOR .onDelete() AND .onUpdate()
                    //--------------------------------------------------------//
                    // The .onDelete() and .onUpdate() methods allow us to
                    // control how the database handles delete and update
                    // requests for records with primary keys that are used (or
                    // "referred to") by child tables. The following values can
                    // be passed in to .onDelete() and .onUpdate():
                    //
                    //   * RESTRICT - this is the default if you don't call
                    //     .onDelete() or .onUpdate(). You may choose to call
                    //     those methods and pass 'RESTRICT' anyway, just to
                    //     make it clear that you intend for that to be the
                    //     behavior (as opposed to just forgetting what the
                    //     default behavior is, or unknowingly accepting the
                    //     default.)
                    //   * CASCADE - this causes the database to find and delete
                    //     all records in child tables that reference the
                    //     primary record being deleted. The delete request in
                    //     the primary table is "cascaded" to all child tables
                    //     that reference the priamary record's key. This is the
                    //     most destructive option.
                    //
                    //   * SET NULL - this causes the database to find all
                    //     records in child tables that reference the primary
                    //     record being deleted, and to set their foreign key
                    //     field values to "null" (for the foreign key that
                    //     references the record being deleted.) This helps
                    //     ensure that there are no child records refer to the
                    //     primary record being deleted. NOTE: This coul have
                    //     unintended consequences if you have defined a foreign
                    //     key field as .notNullable()... be careful!
                    //   * NO ACTION - this causes the database to allow the
                    //     deletion of the primary record, without taking any
                    //     other action.  THIS WILL BREAK REFERENTIAL
                    //     INTEGRITY!!! You will have records in child tables
                    //     that are referring to a record in a parent table
                    //     *that does not exist*. There should be rare, if any,
                    //     cases where this is appropriate.    
                    //
                    // Here, we set the delete and update behavior for parent
                    // tables to 'CASCADE'. 
                    //
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
            }) // closing the previous .createTable() call. Chaining another one: 
            //----------------------------------------------------------------//
            // CREATE A BRIDGE TABLE FOR *:* RELATIONSHIPS
            //----------------------------------------------------------------//
            // In our example, zoos and animals are related, but there can be
            // many zoos for any given animal, and of course, many animals for
            // any given zoo. Since a foreign key field can only have 1 value,
            // putting foreign key fields in each table won't work. We need a
            // third table. For us, it's the [zoo_animals] table. The convention
            // is to name bridge tables using the names of the 2 tables that the
            // bridge is for. (Could also have been [animal_zoos]... take your
            // pick...)
            //
            // This table will have 2 foreign key fields, one for each of the
            // tables that are being related. Each record in the bridge table
            // will represent a relationship between a record in each parent
            // table. 
            //
            // It is possible to have multiple bridge records for the same pair
            // of parent records... it depends on the business logic you need to
            // manage. If you need this capability, each bridge record should
            // have its own primary key, likely defined as an auto-incrementing,
            // unique, unsigned integer. 
            //
            // But if only one bridge record should exist for any pair of parent
            // records, you will want to define a "composite primary key" for
            // the bridge table. You can see an example of this below. 
            //
            // It completely depends on what the solution should allow... 
            .createTable('zoo_animals', tbl => {
                //------------------------------------------------------------//
                // METHOD 2 FOR DEFINING A FOREIGN KEY FIELD
                //------------------------------------------------------------//
                // Use the .references() method, but only pass the field name,
                // and then follow it with a call to .inTable(). It's more
                // verbose, and might be harder to read, but it works. 
                tbl.integer('zoo_id')
                    .unsigned()
                    .notNullable()
                    .references('id')
                    .inTable('zoos')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
                //------------------------------------------------------------//
                // METHOD 3 FOR DEFINING A FOREIGN KEY FIELD
                //------------------------------------------------------------//
                // You can add a foreign key constraint on an existing column
                // using the table.foreign() method. So the third way to create
                // a foreign field is to first define the field, then add the
                // foreign key constraint, as below.
                tbl.integer('animal_id')
                    .unsigned()
                    .notNullable()
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
                tbl.foreign('animal_id').references('animals.id');

                //------------------------------------------------------------//
                // COMPOSITE PRIMARY KEY
                //------------------------------------------------------------//
                // This is an example of a "composite primary key". Instead of
                // having a specific primary key column, you instruct the
                // database to internally keep track of a primary key for the
                // table internally, and specify that the primary key value is
                // composed of values from other columns in the table. Since
                // primary keys are, by definition, unique, this causes the
                // database to ensure that you can only have 1 record with a
                // specific combination of values in the fields that compose the
                // primary key. For example, the primary key definition below
                // uses zoo_id and animal_id. If a record exists with zoo_id=1
                // and animal_id=1, and an attempt is made to insert *another*
                // record with zoo_id=1 and animal_id=1, the database would fail
                // the insert and return an SQL CONSTRAINT error, indicating
                // that a record with that primary key value already exists. In
                // this way, you can guarantee that certain column value
                // combinations only occur once in your database. 
                //
                // In our case, this is desired since we want to keep track of
                // every zoo an animal has visited (no matter how many times the
                // animal has been there)... once we add a record indicating
                // that an animal has been to a zoo, we should not allow the
                // addition of another record with that combination. Making that
                // combination the primary key allows the database to take care
                // of enforcing that for us. 
                //
                // Of course, we could take care of this manually through our
                // business logic in the application, but letting the database
                // manage it for us is cleaner and less error prone.
                tbl.primary(['zoo_id', 'animal_id']);
            })
    );
};


//----------------------------------------------------------------------------//
// DEFINE ROLLBACK LOGIC
//----------------------------------------------------------------------------//
// When you define the rollback logic, you must roll things back in reverse
// order. This is especially important when there are foreign key constraints.
// If you tried to drop the [species] table before dropping the [animals] table,
// the foreign key constraint behavior could prevent the drop. If the default
// 'RESTRICT' behavior is in place, dropping [species] before [animals] would
// fail. 
exports.down = function (knex) {
    return (
        knex.schema
            .dropTableIfExists('zoo_animals')
            .dropTableIfExists('animals')
            .dropTableIfExists('species')
            .dropTableIfExists('zoos')
    );
};









// * Identify entities that should become tables (look for nouns in requirements
//   descriptions.)
// * Identify entities that should be properties of records within those tables.
// * Identify relationships between the tables.
//     - One-to-one (```1:1```) - a record in Table A refers to 0 or 1 records in Table
//       ## Remember the principles of good data modeling, and the tennets of Third Normal Form (which is desireable, but not always appropriate or achievable):
// B, and a record in Table B is referred to by 0 or 1 records in Table A.
//     - One-to-many (```1:*```) - most common type. Foreign key fields are defined in
//       the "many" table.
//     - Many-to-many (```*:*```) - usually implemented using a "bridge" table (also
//       called an "associative" table) - a third table that contains records that
//       identify the two records in the related tables that are related. Using
//       JOIN statements, you can retrieve any combination of records you need. 


// See https://support.microsoft.com/en-us/help/283878/description-of-the-database-normalization-basics

// ### From the TK:

// * Each record has a primary key.
// * No fields are repeated.
// * All fields relate directly to the key data.
// * Each field entry contains a single data point.
// * There are no redundant entries.

// ### From the MS site (for Third Normal Form, a.k.a. 3NF):

// * Eliminate repeating groups in individual tables.
// * Create a separate table for each set of related data.
// * Identify each set of related data with a primary key.
// * Create separate tables for sets of values that apply to multiple records.
// * Relate these tables with a foreign key.
// * Eliminate fields that do not depend on the key.