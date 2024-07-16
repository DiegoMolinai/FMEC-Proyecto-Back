const Client = require('../models/Client');
const { AppError } = require('../utils/errorHandler');

exports.addClient = async (clientData) => {
  const client = new Client(clientData);
  await client.save();
  return client;
};

exports.updateClient = async (id, clientData) => {
  const client = await Client.findByIdAndUpdate(id, clientData, { new: true });
  return client;
};

exports.deleteClient = async (id) => {
  await Client.findByIdAndDelete(id);
  return 'Cliente eliminado';
};

exports.getAllClients = async () => {
  return await Client.find();
};

exports.getClientById = async (id) => {
  return await Client.findById(id);
};

exports.addServiceHistory = async (clientId, serviceData) => {
  const client = await Client.findById(clientId);
  if (!client) {
    throw new AppError('Cliente no encontrado', 404);
  }
  client.serviceHistory.push(serviceData);
  await client.save();
  return client;
};
