'use strict';
module.exports = (sequelize, DataTypes) => {
  const events = sequelize.define('events', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    host_social_handle: DataTypes.STRING,
    host_social_handle_link: DataTypes.STRING,
    venue: DataTypes.STRING,
    potential_attendees: DataTypes.INTEGER,
    country_origin: DataTypes.STRING,
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    is_promoted: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    tags: DataTypes.TEXT,
    slug: DataTypes.TEXT,
    photo: DataTypes.STRING,
    poster_id: {
      type: DataTypes.INTEGER,
    }
  }, {});
  events.associate = function(models) {
    // associations can be defined here
    events.belongsTo(models.users, {foreignKey: 'poster_id'})
    events.hasMany(models.bookmarks, {foreignKey: 'event_id'})
    events.hasMany(models.reminders, {foreignKey: 'event_id'})
  };
  return events;
};