import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, User, KeyRound, MapPin, Package, RefreshCw, CreditCard } from 'lucide-react';
import { getMyOrdersAPI, updateProfileAPI, payOrderAPI } from '../services/api';
import { updateProfileSuccess } from '../redux/authSlice';

const Profile = () => {
  const [searchParams] = useSearchParams();
  const highlightOrderId = searchParams.get('orderId');

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState({
    street: userInfo?.address?.street || '',
    city: userInfo?.address?.city || '',
    postalCode: userInfo?.address?.postalCode || '',
    country: userInfo?.address?.country || '',
  });

  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orders, setOrders] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(null);

  const fetchMyOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data } = await getMyOrdersAPI();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load user orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchMyOrders();
    }
  }, [userInfo]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateMessage(null);
    try {
      const { data } = await updateProfileAPI({
        name,
        email,
        password: password || undefined,
        address,
      });
      dispatch(updateProfileSuccess(data));
      setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' });
      setPassword('');
    } catch (err) {
      setUpdateMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  // Simulated Payment Trigger
  const handlePayment = async (orderId) => {
    setPaymentLoading(orderId);
    try {
      await payOrderAPI(orderId, {
        id: 'MOCK_PAYMENT_' + Date.now(),
        status: 'COMPLETED',
        email_address: userInfo.email,
      });
      // Refetch orders
      await fetchMyOrders();
    } catch (err) {
      console.error('Failed to make mock payment:', err);
    } finally {
      setPaymentLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
      
      {/* Left Column: Manage Profile */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-zinc-800 mb-4">
            <User className="w-5 h-5 text-flipkart-blue" />
            Update Profile
          </h2>

          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
            {updateMessage && (
              <div className={`text-xs font-semibold p-2.5 rounded border ${
                updateMessage.type === 'success'
                  ? 'bg-green-55 dark:bg-green-950/20 text-green-700 border-green-100 dark:border-green-900/50'
                  : 'bg-rose-55 dark:bg-rose-955/20 text-rose-700 border-rose-100 dark:border-rose-900/50'
              }`}>
                {updateMessage.text}
              </div>
            )}

            <div>
              <label className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Full Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm mt-1.5 p-3 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-xl focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Email Address</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm mt-1.5 p-3 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-xl focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" />
                Change Password (optional)
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm mt-1.5 p-3 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-xl focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
              />
            </div>

            <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 flex flex-col gap-3">
              <span className="text-xs font-bold text-gray-800 dark:text-white flex items-center gap-1">
                <MapPin className="w-4 h-4 text-flipkart-blue" />
                Shipping Address
              </span>
              <div>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-lg mb-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full text-xs p-2.5 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full text-xs p-2.5 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-lg"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-lg mt-2"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={updateLoading}
              className="bg-flipkart-blue hover:bg-flipkart-blue-dark text-white text-sm font-bold py-2.5 px-5 rounded-xl active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
            >
              {updateLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Order History */}
      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800 mb-4">
            <span className="flex items-center gap-2">
              <Package className="w-5 h-5 text-flipkart-blue" />
              My Orders
            </span>
            <button
              onClick={fetchMyOrders}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-850 text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </h2>

          {loadingOrders ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-flipkart-blue mb-1" />
              <p className="text-xs font-semibold text-gray-400">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-zinc-500 py-16 text-center">
              You haven't placed any orders yet.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => {
                const isHighlighted = highlightOrderId === order._id;
                return (
                  <div
                    key={order._id}
                    className={`border border-gray-100 dark:border-zinc-800 rounded-xl p-4 sm:p-5 transition-all duration-300 ${
                      isHighlighted
                        ? 'ring-2 ring-flipkart-blue border-transparent bg-flipkart-blue/5'
                        : 'bg-white dark:bg-zinc-900'
                    }`}
                  >
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-50 dark:border-zinc-800 mb-3 gap-2">
                      <div>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 font-bold uppercase">
                          Order ID: <span className="font-extrabold text-gray-600 dark:text-zinc-300">{order._id}</span>
                        </p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium">
                          Placed on: {new Date(order.createdAt).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          order.isPaid
                            ? 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-500'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-955/20 dark:text-amber-500'
                        }`}>
                          {order.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          order.isDelivered
                            ? 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-500'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-500'
                        }`}>
                          {order.isDelivered ? 'Delivered' : 'Processing'}
                        </span>
                      </div>
                    </div>

                    {/* Products lines */}
                    <div className="flex flex-col gap-3">
                      {order.orderItems.map((item) => (
                        <div key={item._id} className="flex items-center justify-between text-sm font-semibold">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded border border-gray-100 dark:border-zinc-800 shrink-0"
                            />
                            <span className="text-gray-700 dark:text-zinc-300 line-clamp-1 max-w-[200px] sm:max-w-md">
                              {item.name} <span className="text-xs text-gray-400">x{item.qty}</span>
                            </span>
                          </div>
                          <span className="text-gray-900 dark:text-white shrink-0">
                            ₹{(item.price * item.qty).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer info: Total & Pay now option */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-50 dark:border-zinc-800 mt-4 gap-3">
                      <p className="text-sm font-extrabold text-gray-800 dark:text-white">
                        Total Amount: <span className="text-flipkart-blue dark:text-white text-base">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                      </p>

                      {!order.isPaid && (
                        <button
                          onClick={() => handlePayment(order._id)}
                          disabled={paymentLoading === order._id}
                          className="bg-flipkart-yellow hover:bg-flipkart-yellow-dark text-gray-900 text-xs font-extrabold py-2 px-4 rounded-lg active:scale-95 transition-all flex items-center justify-center gap-1 shadow-sm"
                        >
                          {paymentLoading === order._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CreditCard className="w-3.5 h-3.5" />
                          )}
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Profile;
