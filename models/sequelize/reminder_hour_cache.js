'use strict';
module.exports = (sequelize, DataTypes) => {
  const reminder_hour_cache = sequelize.define('reminder_hour_cache', {
    user_id: DataTypes.INTEGER,
    event_id: DataTypes.INTEGER,
    first_reminder_time: DataTypes.DATE,
    second_reminder_time: DataTypes.STRING,
    location: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {});
  reminder_hour_cache.associate = function(models) {
    // associations can be defined here
  };
  return reminder_hour_cache;
};