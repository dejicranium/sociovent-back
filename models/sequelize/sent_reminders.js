'use strict';
module.exports = (sequelize, DataTypes) => {
  const set_reminders = sequelize.define('sent_reminders', {
    status: DataTypes.STRING,
    recipient: DataTypes.TEXT,
    message: DataTypes.TEXT
  }, {});
  set_reminders.associate = function(models) {
    // associations can be defined here
  };
  return set_reminders;
};