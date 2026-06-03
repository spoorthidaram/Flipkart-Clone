import express from 'express';
import {
  getCart,
  updateCart,
  removeCartItem,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getCart)
  .post(protect, updateCart)
  .delete(protect, clearCart);

router.route('/:productId').delete(protect, removeCartItem);

export default router;
