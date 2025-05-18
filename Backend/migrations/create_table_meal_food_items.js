/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('meal_food_items', table => {
    table.increments('id').primary();
    table.integer('meal_id').unsigned().notNullable().index();
    table.integer('calories').nullable();
    table.float('protein').nullable();
    table.float('carbs').nullable();
    table.float('fats').nullable();
    table.integer('quantity_gm').nullable();
    table.integer('quantity').notNullable();
    table.string('servingSize', 20).notNullable();
    table.integer('food_id').unsigned().notNullable().index();
    // Foreign keys
    table.foreign('meal_id').references('meal_id').inTable('meals').onDelete('CASCADE');
    table.foreign('food_id').references('id').inTable('food_items').onDelete('RESTRICT');
  });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('meal_food_items');
};