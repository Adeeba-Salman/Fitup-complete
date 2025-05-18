/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('nutrition', table => {
    table.increments('id').primary();
  table.integer('food_item_id').unsigned().notNullable().index();
    table.decimal('calories', 5, 2).notNullable();
    table.decimal('protein', 5, 2).notNullable();
    table.decimal('fats', 5, 2).notNullable();
    table.decimal('carbs', 5, 2).notNullable();

    table.foreign('food_item_id').references('id').inTable('food_items').onDelete('RESTRICT');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('nutrition');
};