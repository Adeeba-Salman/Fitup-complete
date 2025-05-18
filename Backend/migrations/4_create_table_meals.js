/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('meals', table => {
    table.increments('meal_id').primary();
    table.integer('user_id').unsigned().notNullable().index();

    // Add foreign key constraint referencing 'users' table's 'id' column
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

    table.string('meal_name', 100).nullable();
    table.date('date').nullable();
  });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('meals');
};