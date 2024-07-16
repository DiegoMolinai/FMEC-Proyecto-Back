const Vehicle = require('../models/Vehicle');
const { AppError } = require('../utils/errorHandler');

exports.addVehicle = async ({ make, model, year, vin }) => {
  const vehicle = new Vehicle({ make, model, year, vin });
  await vehicle.save();
  return vehicle;
};

exports.updateVehicle = async ({ id, make, model, year, vin }) => {
  const vehicle = await Vehicle.findByIdAndUpdate(id, { make, model, year, vin }, { new: true });
  return vehicle;
};

exports.deleteVehicle = async (id) => {
  await Vehicle.findByIdAndDelete(id);
  return 'Vehículo eliminado';
};

exports.getAllVehicles = async () => {
  return await Vehicle.find();
};

exports.getVehicleById = async (id) => {
  return await Vehicle.findById(id);
};
