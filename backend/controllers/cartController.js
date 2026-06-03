import Cart from '../models/cartModel.js';

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'cartItems.product',
      model: 'Product',
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, cartItems: [] });
    }

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Sync / Update current user's cart items
// @route   POST /api/cart
// @access  Private
const updateCart = async (req, res, next) => {
  try {
    const { cartItems } = req.body; // Array of { product: id, qty: num }

    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.cartItems = cartItems;
      await cart.save();
    } else {
      cart = await Cart.create({
        user: req.user._id,
        cartItems,
      });
    }

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'cartItems.product',
      model: 'Product',
    });

    res.json(populatedCart);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove cart item
// @route   DELETE /api/cart/:productId
// @access  Private
const removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.cartItems = cart.cartItems.filter(
        (item) => item.product.toString() !== req.params.productId
      );
      await cart.save();

      const populatedCart = await Cart.findById(cart._id).populate({
        path: 'cartItems.product',
        model: 'Product',
      });
      res.json(populatedCart);
    } else {
      res.status(404);
      return next(new Error('Cart not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Clear user's cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.cartItems = [];
      await cart.save();
      res.json(cart);
    } else {
      res.status(404);
      return next(new Error('Cart not found'));
    }
  } catch (error) {
    next(error);
  }
};

export { getCart, updateCart, removeCartItem, clearCart };
