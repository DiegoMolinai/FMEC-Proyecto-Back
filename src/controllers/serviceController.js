const Service = require('../models/Service');
const ServiceSale = require('../models/ServiceSale');
const Product = require('../models/Product');
const Vehicle = require('../models/Vehicle');
const { AppError } = require('../utils/errorHandler');

exports.addService = async ({ name, description, cost }) => {
  const service = new Service({ name, description, cost });
  await service.save();
  return service;
};

exports.updateService = async ({ id, name, description, cost }) => {
  const service = await Service.findByIdAndUpdate(id, { name, description, cost }, { new: true });
  return service;
};

exports.deleteService = async (id) => {
  await Service.findByIdAndDelete(id);
  return 'Servicio eliminado';
};

exports.sellService = async ({ serviceId, vehicleId, productsUsed }) => {
  const service = await Service.findById(serviceId);
  if (!service) {
    throw new AppError('Servicio no encontrado', 404);
  }

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    throw new AppError('Vehículo no encontrado', 404);
  }

  const usedProducts = [];
  for (const item of productsUsed) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new AppError(`Producto no encontrado: ${item.productId}`, 404);
    }
    if (product.quantity < item.quantity) {
      throw new AppError(`Cantidad insuficiente de producto: ${item.productId}`, 400);
    }

    product.quantity -= item.quantity;
    await product.save();

    usedProducts.push({ product: item.productId, quantity: item.quantity });
  }

  const totalPrice = service.cost + usedProducts.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
  const serviceSale = new ServiceSale({ service: serviceId, vehicle: vehicleId, productsUsed: usedProducts, totalPrice });
  await serviceSale.save();
  return serviceSale;
};

exports.getAllServices = async () => {
  return await Service.find();
};

exports.getServiceById = async (id) => {
  return await Service.findById(id);
};
