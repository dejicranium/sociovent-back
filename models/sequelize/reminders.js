'use strict';
module.exports = (sequelize, DataTypes) => {
  const reminders = sequelize.define('reminders', {
    user_id: DataTypes.INTEGER,
    event_id: DataTypes.INTEGER,
    first_reminder_time: DataTypes.DATE,
    second_reminder_time: DataTypes.DATE,
    location: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {});
  reminders.associate = function(models) {
    // associations can be defined here
    reminders.belongsTo(models.events, {foreignKey: 'event_id'})
  };
  return reminders;
};