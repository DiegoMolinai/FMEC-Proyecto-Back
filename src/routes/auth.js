// src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

// Registro de usuario
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    console.log('Registro de usuario iniciado');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Errores de validación en el registro:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        console.log('El usuario ya existe:', email);
        return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET, // Usar el secreto de JWT desde .env
        { expiresIn: '1h' }
      );

      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      console.log('Registro exitoso, token generado:', token);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      console.error('Error en el registro de usuario:', err.message);
      res.status(500).send('Server error');
    }
  }
);

// Login de usuario
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    console.log('Inicio de sesión iniciado');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Errores de validación en el login:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        console.log('Credenciales inválidas: usuario no encontrado');
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        console.log('Credenciales inválidas: contraseña incorrecta');
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET, // Usar el secreto de JWT desde .env
        { expiresIn: '1h' }
      );

      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      console.log('Inicio de sesión exitoso, token generado:', token);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      console.error('Error en el inicio de sesión:', err.message);
      res.status(500).send('Server error');
    }
  }
);

// Logout de usuario
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  console.log('Logout exitoso');
  res.json({ msg: 'Logout successful' });
});

// Ruta de verificación
router.get('/check', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
  console.log('Verificación de usuario, token recibido:', token);

  if (!token) {
    console.log('No hay token, autorización denegada');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);
    User.findById(decoded.user.id).select('-password').then(user => {
      if (!user) {
        console.log('Usuario no encontrado');
        return res.status(404).json({ msg: 'User not found' });
      }
      console.log('Usuario verificado:', user);
      res.json({ user });
    });
  } catch (err) {
    console.log('Token no válido:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

module.exports = router;
