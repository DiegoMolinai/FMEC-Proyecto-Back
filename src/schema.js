const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
  }

  type Vehicle {
    id: ID!
    make: String!
    model: String!
    year: Int!
    vin: String!
  }

  type Service {
    id: ID!
    name: String!
    description: String
    cost: Float!
    createdAt: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    quantity: Int!
  }

  type ServiceHistory {
    date: String!
    tasks: TaskDetail!
    vehicleType: String!
  }

  type TaskDetail {
    front: VehiclePart!
    rear: VehiclePart!
    general: GeneralPart!
  }

  type VehiclePart {
    lights: String
    tires: String
  }

  type GeneralPart {
    interior: String
    engine: String
  }

  type Client {
    id: ID!
    name: String!
    rut: String!
    brand: String!
    model: String!
    year: Int!
    licensePlate: String!
    mileage: Int!
    email: String!
    serviceHistory: [ServiceHistory!]
  }

  type ServiceSale {
    id: ID!
    service: Service!
    vehicle: Vehicle!
    productsUsed: [ProductUsage!]!
    totalPrice: Float!
  }

  type ProductUsage {
    product: Product!
    quantity: Int!
  }

  type ProductSale {
    id: ID!
    product: Product!
    quantity: Int!
    totalPrice: Float!
    date: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    vehicles: [Vehicle!]!
    vehicle(id: ID!): Vehicle
    services: [Service!]!
    service(id: ID!): Service
    products: [Product!]!
    product(id: ID!): Product
    clients: [Client!]!
    client(id: ID!): Client
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): String
    addVehicle(make: String!, model: String!, year: Int!, vin: String!): Vehicle
    updateVehicle(id: ID!, make: String, model: String, year: Int, vin: String): Vehicle
    deleteVehicle(id: ID!): String
    addService(name: String!, description: String, cost: Float!): Service
    updateService(id: ID!, name: String, description: String, cost: Float): Service
    deleteService(id: ID!): String
    addProduct(name: String!, description: String, price: Float!, quantity: Int!): Product
    updateProduct(id: ID!, name: String, description: String, price: Float, quantity: Int): Product
    deleteProduct(id: ID!): String
    sellProduct(productId: ID!, quantity: Int!): ProductSale
    addClient(name: String!, rut: String!, brand: String!, model: String!, year: Int!, licensePlate: String!, mileage: Int!, email: String!): Client
    updateClient(id: ID!, name: String, rut: String, brand: String, model: String, year: Int, licensePlate: String, mileage: Int, email: String): Client
    deleteClient(id: ID!): String
    addServiceHistory(clientId: ID!, serviceData: ServiceHistoryInput!): Client
    sellService(serviceId: ID!, vehicleId: ID!, productsUsed: [ProductUsageInput!]!): ServiceSale
  }

  input ServiceHistoryInput {
    tasks: TaskDetailInput!
    vehicleType: String!
  }

  input TaskDetailInput {
    front: VehiclePartInput!
    rear: VehiclePartInput!
    general: GeneralPartInput!
  }

  input VehiclePartInput {
    lights: String
    tires: String
  }

  input GeneralPartInput {
    interior: String
    engine: String
  }

  input ProductUsageInput {
    productId: ID!
    quantity: Int!
  }
`;

module.exports = typeDefs;
