const mongoose = require('mongoose');

const serviceHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  tasks: {
    front: {
      lights: String,
      tires: String,
    },
    rear: {
      lights: String,
      tires: String,
    },
    general: {
      interior: String,
      engine: String,
    },
  },
  vehicleType: String,
});

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rut: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  licensePlate: {
    type: String,
    required: true,
  },
  mileage: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  serviceHistory: [serviceHistorySchema],
});

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;
