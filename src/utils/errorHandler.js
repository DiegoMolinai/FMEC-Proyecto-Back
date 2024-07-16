class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fallo' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  const handleValidationErrorDB = (err) => {
    const message = `Datos de entrada no válidos: ${Object.values(err.errors).map(el => el.message).join('. ')}`;
    return new AppError(message, 400);
  };
  
  const handleCastErrorDB = (err) => {
    const message = `ID inválido: ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
  };
  
  const handleJWTError = () => new AppError('Token no válido. ¡Por favor inicia sesión de nuevo!', 401);
  const handleJWTExpiredError = () => new AppError('Tu token ha expirado. ¡Por favor inicia sesión de nuevo!', 401);
  
  const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  };
  
  const sendErrorProd = (err, res) => {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: '¡Algo salió mal!',
      });
    }
  };
  
  const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
      let error = { ...err };
      if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
      if (error.name === 'CastError') error = handleCastErrorDB(error);
      if (error.name === 'JsonWebTokenError') error = handleJWTError();
      if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
      sendErrorProd(error, res);
    }
  };
  
  module.exports = {
    AppError,
    globalErrorHandler,
  };
  