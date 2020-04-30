'use strict';
module.exports = (sequelize, DataTypes) => {
  const bookmarks = sequelize.define('bookmarks', {
    event_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {});
  bookmarks.associate = function(models) {
    // associations can be defined here
    bookmarks.belongsTo(models.users, {foreignKey: 'user_id'})
    bookmarks.belongsTo(models.events, {foreignKey: 'event_id'})
  };
  return bookmarks;
};