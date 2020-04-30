'use strict';
module.exports = (sequelize, DataTypes) => {
  const auth_tokens = sequelize.define('auth_tokens', {
    user_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    token: DataTypes.TEXT,
    expiry: DataTypes.DATE,
    is_used: DataTypes.BOOLEAN
  }, {});
  auth_tokens.associate = function(models) {
    // associations can be defined here
  };
  return auth_tokens;
};