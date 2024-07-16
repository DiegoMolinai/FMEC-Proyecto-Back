const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('../config/database');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const { AppError, globalErrorHandler } = require('./utils/errorHandler');
require('dotenv').config();

const app = express();
const port = 3000;

// Conectar a la base de datos
connectDB();

// Configurar Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    let user = null;

    if (token.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        user = await User.findById(decoded.user.id);
      } catch (err) {
        console.error('Autenticación fallida:', err);
      }
    }

    return { user };
  },
  formatError: (err) => {
    if (err.originalError instanceof AppError) {
      return {
        message: err.message,
        statusCode: err.extensions.exception.statusCode,
        status: err.extensions.exception.status,
      };
    }
    console.error('Unhandled error:', err);
    return {
      message: 'An unexpected error occurred',
      statusCode: 500,
      status: 'error',
    };
  },
});

server.start().then(() => {
  server.applyMiddleware({ app });

  // Middleware para parsear JSON
  app.use(express.json());

  // Rutas
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);

  // Ruta de prueba
  app.get('/', (req, res) => res.send('¡Hola, mundo!'));

  // Middleware de manejo de errores
  app.use(globalErrorHandler);

  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}${server.graphqlPath}`);
  });
});
