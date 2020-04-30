'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    token: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    platform: {
      type: DataTypes.STRING
    },
    social_links: {
      type: DataTypes.TEXT
    }
  }, {});
  users.associate = function(models) {
    // associations can be defined here
    users.hasMany(models.events, {foreignKey: 'poster_id'})

  };
  return users;
};