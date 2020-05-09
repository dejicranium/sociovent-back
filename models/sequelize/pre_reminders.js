'use strict';
module.exports = (sequelize, DataTypes) => {
  const pre_reminders = sequelize.define('pre_reminders', {
    event_id: DataTypes.INTEGER,
    session_id: DataTypes.TEXT
  }, {});
  pre_reminders.associate = function(models) {
    // associations can be defined here
  };
  return pre_reminders;
};