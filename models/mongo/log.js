const mongoose = require('mongoose');

const modelName = 'log'; // model for just storing random stuff
const { Schema } = mongoose;
const schemaConfig = {
  log_id: String, // Dump Type
  comment: String, // Dump Type
  type: String,
  data: {
    type: Schema.Types.Mixed,
  },
  ts: Number,
};
const schemaObject = new Schema(schemaConfig);
module.exports = mongoose.model(modelName, schemaObject);
