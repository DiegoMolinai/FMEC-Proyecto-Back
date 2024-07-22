const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('../config/database');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const { AppError, globalErrorHandler } = require('./utils/errorHandler');
require('dotenv').config();

const app = express();
const port = 3000;

// Configurar CORS para múltiples orígenes
const corsOptions = {
  origin: ['http://localhost:5173', 'https://studio.apollographql.com'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'OPTIONS'],
};

// Habilita CORS para todas las solicitudes
app.use(cors(corsOptions));

// Middleware para parsear JSON y cookies
app.use(express.json());
app.use(cookieParser());

// Conectar a la base de datos
connectDB();

// Configurar Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token || ''; // Leer el token desde las cookies o la cabecera de autorización
    let user = null;
    console.log('Token recibido en contexto de Apollo:', token);

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decodificado en contexto de Apollo:', decoded);
        user = await User.findById(decoded.user.id);
        console.log('Usuario encontrado en contexto de Apollo:', user);
      } catch (err) {
        console.error('Autenticación fallida en contexto de Apollo:', err);
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
      message: 'Ocurrió un error inesperado',
      statusCode: 500,
      status: 'error',
    };
  },
});

// Iniciar el servidor Apollo y aplicar el middleware en la app Express
const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app, cors: corsOptions });

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
};

startServer();
