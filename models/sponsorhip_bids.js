'use strict';
module.exports = (sequelize, DataTypes) => {
  const sponsorhip_bids = sequelize.define('sponsorhip_bids', {
    event_id: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    bid: DataTypes.DOUBLE,
    currency: DataTypes.STRING,
    message_type: DataTypes.STRING,
    bidder: DataTypes.INTEGER
  }, {});
  sponsorhip_bids.associate = function(models) {
    // associations can be defined here
  };
  return sponsorhip_bids;
};