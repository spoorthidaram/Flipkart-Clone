import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../redux/cartSlice';
import { updateCartAPI } from '../services/api';
import Rating from './Rating';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigating to details page
    const item = {
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty: 1,
    };

    dispatch(addItem(item));

    // If logged in, sync with backend database
    if (userInfo) {
      try {
        const updatedItems = [...cartItems.filter(i => i.product !== product._id), item];
        const formattedItems = updatedItems.map(i => ({ product: i.product, qty: i.qty }));
        await updateCartAPI(formattedItems);
      } catch (err) {
        console.error('Failed to sync cart to backend:', err);
      }
    }
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative overflow-hidden bg-gray-50 dark:bg-zinc-950 aspect-square flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        {product.countInStock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <span className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-zinc-500 font-bold mb-1">
          {product.brand}
        </span>
        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 line-clamp-2 mb-2 group-hover:text-flipkart-blue transition-colors duration-200">
          {product.name}
        </h3>

        <div className="mb-3">
          <Rating value={product.rating} text={`${product.numReviews} ratings`} />
        </div>

        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50 dark:border-zinc-800">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 line-through">
              ₹{(product.price * 1.25).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className="p-2.5 rounded-xl bg-flipkart-blue text-white hover:bg-flipkart-blue-dark active:scale-95 disabled:bg-gray-200 dark:disabled:bg-zinc-800 disabled:text-gray-400 transition-all duration-200"
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
