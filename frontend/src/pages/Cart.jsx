import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { addItem, removeItem } from '../redux/cartSlice';
import { updateCartAPI } from '../services/api';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  // Sync qty changes to local state & backend db
  const handleQtyChange = async (item, newQty) => {
    if (newQty < 1 || newQty > item.countInStock) return;
    
    const updatedItem = { ...item, qty: newQty };
    dispatch(addItem(updatedItem));

    if (userInfo) {
      try {
        const updatedItems = cartItems.map((i) =>
          i.product === item.product ? updatedItem : i
        );
        const formattedItems = updatedItems.map(i => ({ product: i.product, qty: i.qty }));
        await updateCartAPI(formattedItems);
      } catch (err) {
        console.error('Failed to sync cart updates:', err);
      }
    }
  };

  const handleRemove = async (productId) => {
    dispatch(removeItem(productId));

    if (userInfo) {
      try {
        const updatedItems = cartItems.filter((i) => i.product !== productId);
        const formattedItems = updatedItems.map(i => ({ product: i.product, qty: i.qty }));
        await updateCartAPI(formattedItems);
      } catch (err) {
        console.error('Failed to sync item removal:', err);
      }
    }
  };

  // Pricing calculations
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const rawPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = Math.round(rawPrice * 0.1); // Mocking 10% discount
  const shippingPrice = rawPrice > 500 || rawPrice === 0 ? 0 : 40;
  const totalPrice = rawPrice - discount + shippingPrice;

  const handleCheckout = () => {
    navigate('/login?redirect=/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Shopping Cart ({totalItemsCount} items)</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-10 py-16 text-center flex flex-col items-center justify-center shadow-sm">
          <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-zinc-700 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Your cart is empty!</h2>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mb-6">Add items to it now to shop.</p>
          <Link
            to="/"
            className="bg-flipkart-blue hover:bg-flipkart-blue-dark text-white font-bold px-8 py-3 rounded-xl transition-all duration-200 active:scale-95 shadow-md shadow-flipkart-blue/20"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Cart Items List */}
          <div className="flex-grow flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm flex gap-4 items-center"
              >
                {/* Product Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 dark:bg-zinc-950 rounded-xl overflow-hidden shrink-0 border border-gray-50 dark:border-zinc-800">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info & Quantity controls */}
                <div className="flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="max-w-md">
                    <Link
                      to={`/product/${item.product}`}
                      className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100 hover:text-flipkart-blue line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <span className="text-xs text-gray-400 dark:text-zinc-500 font-bold block mt-1">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-start">
                    <div className="flex items-center gap-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-150 dark:border-zinc-700 p-0.5 rounded-lg">
                      <button
                        onClick={() => handleQtyChange(item, item.qty - 1)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded text-gray-600 dark:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-extrabold text-gray-800 dark:text-white w-5 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => handleQtyChange(item, item.qty + 1)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded text-gray-600 dark:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.product)}
                      className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Details Sidebar */}
          <div className="w-full lg:w-96 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm h-fit">
            <h3 className="text-sm uppercase tracking-wider text-gray-400 dark:text-zinc-500 font-extrabold pb-3 border-b border-gray-100 dark:border-zinc-800 mb-4">
              Price Details
            </h3>

            <div className="flex flex-col gap-3 pb-4 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex justify-between text-sm font-semibold text-gray-600 dark:text-zinc-300">
                <span>Price ({totalItemsCount} items)</span>
                <span>₹{rawPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-green-600 dark:text-green-500">
                <span>Discount (10%)</span>
                <span>- ₹{discount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-gray-600 dark:text-zinc-300">
                <span>Delivery Charges</span>
                <span>{shippingPrice === 0 ? <span className="text-green-600 dark:text-green-500">FREE</span> : `₹${shippingPrice}`}</span>
              </div>
            </div>

            <div className="flex justify-between text-base font-extrabold text-gray-800 dark:text-white py-4 border-b border-gray-100 dark:border-zinc-800 mb-6">
              <span>Total Amount</span>
              <span className="text-lg">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-flipkart-yellow hover:bg-flipkart-yellow-dark text-gray-900 font-extrabold rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-flipkart-yellow/20 text-sm"
            >
              Place Order
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
