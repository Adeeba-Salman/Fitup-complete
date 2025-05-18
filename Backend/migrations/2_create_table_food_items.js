/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('food_items', table => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.decimal('average_grams_per_unit', 5, 2).nullable();
    table.enu('measurement_type', ['grams', 'quantity']).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('food_items');
};