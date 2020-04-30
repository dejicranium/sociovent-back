'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      host_social_handle: {
        type: Sequelize.STRING
      },
      host_social_handle_link: {
        type: Sequelize.STRING
      },
      venue: {
        type: Sequelize.STRING
      },
      potential_attendees: {
        type: Sequelize.INTEGER
      },
      country_origin: {
        type: Sequelize.STRING
      },
      start_time: {
        type: Sequelize.DATE
      },
      end_time: {
        type: Sequelize.DATE
      },
      is_promoted: {
        type: Sequelize.BOOLEAN
      },
      is_verified: {
        type: Sequelize.BOOLEAN
      },
      tags: {
        type: Sequelize.TEXT
      },
      slug: {
        type: Sequelize.TEXT
      },
      photo: {
        type: Sequelize.STRING
      },
      poster_id: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('events');
  }
};