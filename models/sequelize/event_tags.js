'use strict';
module.exports = (sequelize, DataTypes) => {
  const event_tags = sequelize.define('event_tags', {
    event_id: DataTypes.INTEGER,
    tag_name: DataTypes.STRING
  }, {});
  event_tags.associate = function(models) {
    // associations can be defined here
  };
  return event_tags;
};