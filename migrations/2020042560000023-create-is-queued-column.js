'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.addColumn(
      'reminders',
      'first_reminder_queued',
      {
        type: Sequelize.BOOLEAN,
      }
    );
    return queryInterface.addColumn(
      'reminders',
      'second_reminder_queued',
      {
        type: Sequelize.BOOLEAN,
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.removeColumn(
      'reminders',
      'phone'
    );
  }
};
