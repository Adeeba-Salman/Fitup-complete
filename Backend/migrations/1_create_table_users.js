/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('firstname', 50).notNullable();
    table.string('lastName', 50).notNullable();
    table.string('email', 100).notNullable();
    table.string('password', 255).notNullable();
    table.integer('age').nullable();
    table.enu('gender', ['male', 'female']).nullable();
    table.decimal('height_cm', 5, 2).nullable();
    table.decimal('weight_kg', 5, 2).nullable();
    table.enu('activity_level', ['sedentary', 'light', 'moderate', 'active', 'very_active']).nullable();
    table.enu('goal', ['lose_weight', 'maintain_weight', 'gain_weight']).nullable();
    table.integer('daily_calorie_goal').nullable();
    
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
};