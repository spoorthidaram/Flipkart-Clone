import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, Landmark, Truck, ShieldCheck, CreditCard, ChevronRight, Check } from 'lucide-react';
import { createOrderAPI, clearCartAPI } from '../services/api';
import { clearCart, saveShippingAddress, savePaymentMethod } from '../redux/cartSlice';
import { orderRequest, orderCreateSuccess, orderCreateFail, orderCreateReset } from '../redux/orderSlice';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, shippingAddress, paymentMethod } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { success, order, loading, error } = useSelector((state) => state.orders);

  const [step, setStep] = useState(1);
  const [addressForm, setAddressForm] = useState({
    street: shippingAddress.street || '',
    city: shippingAddress.city || '',
    postalCode: shippingAddress.postalCode || '',
    country: shippingAddress.country || '',
  });

  const [paymentOption, setPaymentOption] = useState(paymentMethod || 'COD');

  // Math calculations
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = Math.round(itemsPrice * 0.1); // 10% discount
  const rawTotal = itemsPrice - discount;
  const shippingPrice = rawTotal > 500 || rawTotal === 0 ? 0 : 40;
  const taxPrice = Math.round(rawTotal * 0.18); // 18% GST
  const totalPrice = rawTotal + shippingPrice + taxPrice;

  useEffect(() => {
    if (cartItems.length === 0 && !success) {
      navigate('/cart');
    }
  }, [cartItems, success, navigate]);

  useEffect(() => {
    if (success && order) {
      navigate(`/profile?orderId=${order._id}`);
      dispatch(orderCreateReset());
    }
  }, [success, order, navigate, dispatch]);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress(addressForm));
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentOption));
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    dispatch(orderRequest());
    try {
      const orderItems = cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item.product,
      }));

      const orderData = {
        orderItems,
        shippingAddress: addressForm,
        paymentMethod: paymentOption,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const { data } = await createOrderAPI(orderData);
      dispatch(orderCreateSuccess(data));
      dispatch(clearCart());
      await clearCartAPI(); // clear backend cart database
    } catch (err) {
      dispatch(orderCreateFail(err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Steps Form */}
        <div className="flex-grow flex flex-col gap-4">
          
          {/* Step 1: Shipping Address */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800 mb-4">
              <span className="flex items-center gap-2">
                <span className="h-6 w-6 bg-flipkart-blue text-white rounded-full text-xs font-bold flex items-center justify-center">1</span>
                Delivery Address
              </span>
              {step > 1 && (
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-flipkart-blue hover:underline"
                >
                  Edit
                </button>
              )}
            </h2>

            {step === 1 ? (
              <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Street Address</label>
                  <input
                    required
                    type="text"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    className="w-full text-sm mt-1.5 p-3 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-xl focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
                    placeholder="Flat/House No., Building Name, Street"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                  <input
                    required
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full text-sm mt-1.5 p-3 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-xl focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
                    placeholder="City Name"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Postal Code</label>
                  <input
                    required
                    type="text"
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    className="w-full text-sm mt-1.5 p-3 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-xl focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
                    placeholder="PIN Code"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Country</label>
                  <input
                    required
                    type="text"
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    className="w-full text-sm mt-1.5 p-3 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-xl focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
                    placeholder="Country Name"
                  />
                </div>
                <div className="sm:col-span-2 mt-2">
                  <button
                    type="submit"
                    className="bg-flipkart-blue hover:bg-flipkart-blue-dark text-white text-sm font-bold px-6 py-2.5 rounded-lg active:scale-95 transition-all flex items-center gap-1.5 shadow-md shadow-flipkart-blue/10"
                  >
                    Deliver to this Address
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-sm font-semibold text-gray-600 dark:text-zinc-400">
                {addressForm.street}, {addressForm.city} - {addressForm.postalCode}, {addressForm.country}
              </p>
            )}
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800 mb-4">
              <span className="flex items-center gap-2">
                <span className={`h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center ${
                  step >= 2 ? 'bg-flipkart-blue text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500'
                }`}>2</span>
                Payment Method
              </span>
              {step > 2 && (
                <button
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-flipkart-blue hover:underline"
                >
                  Edit
                </button>
              )}
            </h2>

            {step === 2 && (
              <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 p-3 bg-gray-55 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl cursor-pointer hover:bg-gray-55/50">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="COD"
                      checked={paymentOption === 'COD'}
                      onChange={(e) => setPaymentOption(e.target.value)}
                      className="text-flipkart-blue focus:ring-flipkart-blue dark:bg-zinc-750 dark:border-zinc-650"
                    />
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-white">Cash on Delivery (COD)</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">Pay when your package gets delivered</p>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-55 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl cursor-pointer hover:bg-gray-55/50">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="UPI"
                      checked={paymentOption === 'UPI'}
                      onChange={(e) => setPaymentOption(e.target.value)}
                      className="text-flipkart-blue focus:ring-flipkart-blue dark:bg-zinc-750 dark:border-zinc-650"
                    />
                    <div className="flex items-center gap-2">
                      <Landmark className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-white">UPI / Net Banking</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">Instant transfer via phone apps</p>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-55 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl cursor-pointer hover:bg-gray-55/50">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="Card"
                      checked={paymentOption === 'Card'}
                      onChange={(e) => setPaymentOption(e.target.value)}
                      className="text-flipkart-blue focus:ring-flipkart-blue dark:bg-zinc-750 dark:border-zinc-650"
                    />
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-white">Credit / Debit Card</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">Visa, Mastercard, RuPay, Maestro</p>
                      </div>
                    </div>
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    className="bg-flipkart-blue hover:bg-flipkart-blue-dark text-white text-sm font-bold px-6 py-2.5 rounded-lg active:scale-95 transition-all flex items-center gap-1.5 shadow-md shadow-flipkart-blue/10"
                  >
                    Use this Payment Method
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {step > 2 && (
              <p className="text-sm font-semibold text-gray-600 dark:text-zinc-400">
                {paymentOption === 'COD' && 'Cash on Delivery (COD)'}
                {paymentOption === 'UPI' && 'UPI / Net Banking'}
                {paymentOption === 'Card' && 'Credit / Debit Card'}
              </p>
            )}
          </div>

          {/* Step 3: Order Summary */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-zinc-800 mb-4">
              <span className={`h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center ${
                step === 3 ? 'bg-flipkart-blue text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500'
              }`}>3</span>
              Order Items Summary
            </h2>

            {step === 3 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  {cartItems.map((item) => (
                    <div key={item.product} className="flex justify-between items-center text-sm font-semibold">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded border border-gray-100 dark:border-zinc-800 shrink-0"
                        />
                        <span className="text-gray-700 dark:text-zinc-300 line-clamp-1 max-w-[280px] sm:max-w-md">
                          {item.name} <span className="text-xs text-gray-400">x{item.qty}</span>
                        </span>
                      </div>
                      <span className="text-gray-900 dark:text-white">
                        ₹{(item.price * item.qty).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 dark:border-zinc-800 pt-4">
                  {error && (
                    <div className="text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-zinc-800 p-2.5 rounded border border-rose-100 dark:border-zinc-800 mb-4">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full sm:w-auto bg-flipkart-yellow hover:bg-flipkart-yellow-dark text-gray-900 font-extrabold px-8 py-3 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-flipkart-yellow/20"
                  >
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    Confirm & Place Order (₹{totalPrice.toLocaleString('en-IN')})
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Pricing Sidebar details */}
        <div className="w-full lg:w-96 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm h-fit">
          <h3 className="text-sm uppercase tracking-wider text-gray-400 dark:text-zinc-500 font-extrabold pb-3 border-b border-gray-100 dark:border-zinc-800 mb-4">
            Order Summary
          </h3>

          <div className="flex flex-col gap-3 pb-4 border-b border-gray-100 dark:border-zinc-800">
            <div className="flex justify-between text-sm font-semibold text-gray-600 dark:text-zinc-300">
              <span>Price ({totalItemsCount} items)</span>
              <span>₹{itemsPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-green-600 dark:text-green-500">
              <span>Discount (10%)</span>
              <span>- ₹{discount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-gray-600 dark:text-zinc-300">
              <span>Delivery Charges</span>
              <span>{shippingPrice === 0 ? <span className="text-green-600">FREE</span> : `₹${shippingPrice}`}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-gray-600 dark:text-zinc-300">
              <span>GST (18% tax)</span>
              <span>₹{taxPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex justify-between text-base font-extrabold text-gray-800 dark:text-white pt-4">
            <span>Total Payable</span>
            <span className="text-lg text-flipkart-blue dark:text-white">₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>

          <div className="mt-6 flex gap-2 items-center text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider bg-gray-50 dark:bg-zinc-950 p-2.5 rounded-lg border border-gray-100 dark:border-zinc-850">
            <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
            Safe and Secure Payments. 100% Trust Guarantee.
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
