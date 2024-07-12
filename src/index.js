const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('../config/database');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
require('dotenv').config();

const app = express();
const port = 3000;

// Conectar a la base de datos
connectDB();

// Configurar Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  server.applyMiddleware({ app });

  // Middleware para parsear JSON
  app.use(express.json());

  // Rutas
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);

  // Ruta de prueba
  app.get('/', (req, res) => res.send('¡Hola, mundo!'));

  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}${server.graphqlPath}`);
  });
});
