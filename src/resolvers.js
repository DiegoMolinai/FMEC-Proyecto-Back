const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Service = require('./models/Service');

const resolvers = {
  Query: {
    users: async () => {
      return await User.find();
    },
    user: async (_, { id }) => {
      return await User.findById(id);
    },
    vehicles: async (_, { userId }) => {
      return await Vehicle.find({ user: userId });
    },
    vehicle: async (_, { id }) => {
      return await Vehicle.findById(id);
    },
    services: async (_, { vehicleId }) => {
      return await Service.find({ vehicle: vehicleId });
    },
    service: async (_, { id }) => {
      return await Service.findById(id);
    },
  },
  Mutation: {
    register: async (_, { name, email, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        name,
        email,
        password: hashedPassword,
      });

      await user.save();
      return user;
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return token;
    },
    addVehicle: async (_, { userId, make, model, year, vin }) => {
      const vehicle = new Vehicle({
        user: userId,
        make,
        model,
        year,
        vin,
      });

      await vehicle.save();
      return vehicle;
    },
    updateVehicle: async (_, { id, make, model, year, vin }) => {
      const vehicle = await Vehicle.findByIdAndUpdate(
        id,
        { make, model, year, vin },
        { new: true }
      );
      return vehicle;
    },
    deleteVehicle: async (_, { id }) => {
      await Vehicle.findByIdAndDelete(id);
      return 'Vehicle deleted';
    },
    addService: async (_, { vehicleId, description, date, cost }) => {
      const service = new Service({
        vehicle: vehicleId,
        description,
        date,
        cost,
      });

      await service.save();
      return service;
    },
    updateService: async (_, { id, description, date, cost }) => {
      const service = await Service.findByIdAndUpdate(
        id,
        { description, date, cost },
        { new: true }
      );
      return service;
    },
    deleteService: async (_, { id }) => {
      await Service.findByIdAndDelete(id);
      return 'Service deleted';
    },
  },
};

module.exports = resolvers;
