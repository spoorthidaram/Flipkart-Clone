import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, ArrowLeft, Plus, Minus, ShoppingCart, MessageSquare, Star } from 'lucide-react';
import { getProductByIdAPI, createReviewAPI, updateCartAPI } from '../services/api';
import { singleProductSuccess, productRequest, productFail, reviewRequest, reviewSuccess, reviewFail, reviewReset } from '../redux/productSlice';
import { addItem } from '../redux/cartSlice';
import Rating from '../components/Rating';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product, loading, error, reviewSuccess: successReview, reviewLoading, reviewError } = useSelector(
    (state) => state.products
  );
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Fetch product detail on load or when review submits
  useEffect(() => {
    const fetchProduct = async () => {
      dispatch(productRequest());
      try {
        const { data } = await getProductByIdAPI(id);
        dispatch(singleProductSuccess(data));
      } catch (err) {
        dispatch(productFail(err.response?.data?.message || err.message));
      }
    };

    fetchProduct();

    if (successReview) {
      setRating(5);
      setComment('');
      dispatch(reviewReset());
    }
  }, [dispatch, id, successReview]);

  const handleAddToCart = async () => {
    const item = {
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty,
    };

    dispatch(addItem(item));

    if (userInfo) {
      try {
        const updatedItems = [...cartItems.filter(i => i.product !== product._id), item];
        const formattedItems = updatedItems.map(i => ({ product: i.product, qty: i.qty }));
        await updateCartAPI(formattedItems);
      } catch (err) {
        console.error('Failed to sync cart:', err);
      }
    }
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    dispatch(reviewRequest());
    try {
      await createReviewAPI(id, { rating, comment });
      dispatch(reviewSuccess());
    } catch (err) {
      dispatch(reviewFail(err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 flex-grow">
        <Loader2 className="w-10 h-10 animate-spin text-flipkart-blue mb-2" />
        <p className="text-sm font-semibold text-gray-500">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl font-medium text-sm text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      
      {/* Back Link */}
      <Link to="/" className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col lg:flex-row gap-8">
        
        {/* Product Image Gallery */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 dark:bg-zinc-950 rounded-2xl overflow-hidden aspect-square border border-gray-50 dark:border-zinc-800">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover max-h-[480px]"
          />
        </div>

        {/* Product Info Section */}
        <div className="w-full lg:w-1/2 flex flex-col gap-5">
          <div>
            <span className="text-xs uppercase tracking-wider font-extrabold text-gray-400 dark:text-zinc-500">
              {product.brand}
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <Rating value={product.rating} text={`${product.numReviews} ratings`} />
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                product.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {product.countInStock > 0 ? `${product.countInStock} In Stock` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div className="border-y border-gray-100 dark:border-zinc-800 py-4 flex flex-col gap-1.5">
            <span className="text-xs text-gray-400 line-through">
              ₹{(product.price * 1.25).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              <span className="text-sm font-bold text-green-600 dark:text-green-500">
                20% OFF
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-2">Description</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Action Area */}
          {product.countInStock > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-4">
              
              {/* Qty Selector */}
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800 border border-gray-150 dark:border-zinc-700 p-1 rounded-xl">
                <button
                  disabled={qty === 1}
                  onClick={() => setQty(qty - 1)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-40"
                >
                  <Minus className="w-4 h-4 text-gray-600 dark:text-white" />
                </button>
                <span className="text-sm font-bold text-gray-800 dark:text-white w-6 text-center">
                  {qty}
                </span>
                <button
                  disabled={qty === product.countInStock}
                  onClick={() => setQty(qty + 1)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-40"
                >
                  <Plus className="w-4 h-4 text-gray-600 dark:text-white" />
                </button>
              </div>

              {/* Add To Cart */}
              <button
                onClick={handleAddToCart}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-flipkart-yellow text-gray-900 font-extrabold hover:bg-flipkart-yellow-dark active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-8">
        
        {/* Write a Review */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-gray-100 dark:border-zinc-800 pb-6 md:pb-0 md:pr-8">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-flipkart-blue" />
            Write a Customer Review
          </h3>

          {userInfo ? (
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">
              {reviewError && (
                <div className="text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-zinc-800 p-2.5 rounded border border-rose-100 dark:border-zinc-800">
                  {reviewError}
                </div>
              )}
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full text-sm mt-1 p-2 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-lg focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Comment</label>
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  rows="3"
                  className="w-full text-sm mt-1 p-3 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-lg focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={reviewLoading}
                className="bg-flipkart-blue hover:bg-flipkart-blue-dark text-white text-sm font-bold py-2 px-5 rounded-lg active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
              >
                {reviewLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Review
              </button>
            </form>
          ) : (
            <p className="text-sm font-semibold text-gray-500">
              Please <Link to="/login" className="text-flipkart-blue hover:underline">login</Link> to write reviews.
            </p>
          )}
        </div>

        {/* Reviews List */}
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Customer Reviews ({product.reviews?.length || 0})</h3>
          
          {product.reviews?.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-zinc-500 py-10 text-center bg-gray-50 dark:bg-zinc-950 rounded-xl">
              No reviews for this product yet.
            </p>
          ) : (
            <div className="flex flex-col gap-4 divide-y divide-gray-50 dark:divide-zinc-800 max-h-96 overflow-y-auto pr-2">
              {product.reviews?.map((review) => (
                <div key={review._id} className="pt-4 first:pt-0 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-gray-800 dark:text-white">
                      {review.name}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500 font-medium">
                      {new Date(review.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <Rating value={review.rating} />
                  <p className="text-sm text-gray-600 dark:text-zinc-400">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default ProductDetails;
