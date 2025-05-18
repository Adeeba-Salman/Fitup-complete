/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('workouts', table => {
    table.increments('workout_id').primary();
    table.integer('user_id').unsigned().notNullable().index();
    table.integer('duration_minutes').notNullable();
    table.date('workout_date').notNullable();
    table.string('workout_type', 50).nullable();
    table.integer('calories_burned').nullable();

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('workouts');
};