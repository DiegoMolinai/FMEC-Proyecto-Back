const userController = require('./controllers/userController');
const vehicleController = require('./controllers/vehicleController');
const serviceController = require('./controllers/serviceController');
const productController = require('./controllers/productController');
const clientController = require('./controllers/clientController');
const { AppError } = require('./utils/errorHandler');

const resolvers = {
  Query: {
    users: async (_, __, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await userController.getAllUsers();
    },
    user: async (_, { id }, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await userController.getUserById(id);
    },
    vehicles: async (_, __, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await vehicleController.getAllVehicles();
    },
    vehicle: async (_, { id }, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await vehicleController.getVehicleById(id);
    },
    services: async (_, __, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await serviceController.getAllServices();
    },
    service: async (_, { id }, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await serviceController.getServiceById(id);
    },
    products: async (_, __, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await productController.getAllProducts();
    },
    product: async (_, { id }, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await productController.getProductById(id);
    },
    clients: async (_, __, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await clientController.getAllClients();
    },
    client: async (_, { id }, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await clientController.getClientById(id);
    },
  },
  Mutation: {
    register: async (_, { name, email, password }) => {
      return await userController.register({ name, email, password });
    },
    login: async (_, { email, password }) => {
      return await userController.login({ email, password });
    },
    addVehicle: async (_, { make, model, year, vin }, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await vehicleController.addVehicle({ make, model, year, vin });
    },
    updateVehicle: async (_, { id, make, model, year, vin }, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await vehicleController.updateVehicle({ id, make, model, year, vin });
    },
    deleteVehicle: async (_, { id }, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await vehicleController.deleteVehicle(id);
    },
    addService: async (_, { name, description, cost }, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await serviceController.addService({ name, description, cost });
    },
    updateService: async (_, { id, name, description, cost }, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await serviceController.updateService({ id, name, description, cost });
    },
    deleteService: async (_, { id }, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await serviceController.deleteService(id);
    },
    sellService: async (_, { serviceId, vehicleId, productsUsed }, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await serviceController.sellService({ serviceId, vehicleId, productsUsed });
    },
    addProduct: async (_, { name, description, price, quantity }, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await productController.addProduct({ name, description, price, quantity });
    },
    updateProduct: async (_, { id, name, description, price, quantity }, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await productController.updateProduct({ id, name, description, price, quantity });
    },
    deleteProduct: async (_, { id }, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await productController.deleteProduct(id);
    },
    sellProduct: async (_, { productId, quantity }, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await productController.sellProduct({ productId, quantity });
    },
    addClient: async (_, clientData, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await clientController.addClient(clientData);
    },
    updateClient: async (_, { id, ...clientData }, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await clientController.updateClient(id, clientData);
    },
    deleteClient: async (_, { id }, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await clientController.deleteClient(id);
    },
    addServiceHistory: async (_, { clientId, serviceData }, { user }) => {
      if (!user) {
        throw new AppError('No estás autenticado', 401);
      }
      return await clientController.addServiceHistory(clientId, serviceData);
    },
  },
};

module.exports = resolvers;
