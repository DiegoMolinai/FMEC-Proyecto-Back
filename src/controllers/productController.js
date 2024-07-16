const Product = require('../models/Product');
const ProductSale = require('../models/ProductSale');
const { AppError } = require('../utils/errorHandler');

exports.addProduct = async ({ name, description, price, quantity }) => {
  const product = new Product({ name, description, price, quantity });
  await product.save();
  return product;
};

exports.updateProduct = async ({ id, name, description, price, quantity }) => {
  const product = await Product.findByIdAndUpdate(id, { name, description, price, quantity }, { new: true });
  return product;
};

exports.deleteProduct = async (id) => {
  await Product.findByIdAndDelete(id);
  return 'Producto eliminado';
};

exports.sellProduct = async ({ productId, quantity }) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Producto no encontrado', 404);
  }
  if (product.quantity < quantity) {
    throw new AppError('Cantidad insuficiente de producto', 400);
  }

  product.quantity -= quantity;
  await product.save();

  const totalPrice = product.price * quantity;
  const productSale = new ProductSale({ product: productId, quantity, totalPrice });
  await productSale.save();
  return productSale;
};

exports.getAllProducts = async () => {
  return await Product.find();
};

exports.getProductById = async (id) => {
  return await Product.findById(id);
};
