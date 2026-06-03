import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import Cart from './models/cartModel.js';
import products from './data/products.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    // Create users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@flipkart.com',
        password: 'password123',
        isAdmin: true,
      },
      {
        name: 'John Doe',
        email: 'john@gmail.com',
        password: 'password123',
        isAdmin: false,
      },
    ]);

    const adminUser = users[0]._id;

    // Attach user field to each product if we want to trace creator
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-destroy') {
  destroyData();
} else {
  importData();
}
