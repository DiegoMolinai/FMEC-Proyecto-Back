const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Vehicle {
    id: ID!
    user: User!
    make: String!
    model: String!
    year: Int!
    vin: String!
  }

  type Service {
    id: ID!
    vehicle: Vehicle!
    description: String!
    date: String!
    cost: Float!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    vehicles(userId: ID!): [Vehicle]
    vehicle(id: ID!): Vehicle
    services(vehicleId: ID!): [Service]
    service(id: ID!): Service
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): String
    addVehicle(userId: ID!, make: String!, model: String!, year: Int!, vin: String!): Vehicle
    updateVehicle(id: ID!, make: String, model: String, year: Int, vin: String): Vehicle
    deleteVehicle(id: ID!): String
    addService(vehicleId: ID!, description: String!, date: String!, cost: Float!): Service
    updateService(id: ID!, description: String, date: String, cost: Float): Service
    deleteService(id: ID!): String
  }
`;

module.exports = typeDefs;
