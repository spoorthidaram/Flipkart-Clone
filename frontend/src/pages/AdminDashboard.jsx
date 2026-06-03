import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Loader2, Plus, Edit, Trash2, Check, RefreshCw, Layers, ClipboardList, Users } from 'lucide-react';
import {
  getProductsAPI,
  createProductAPI,
  updateProductAPI,
  deleteProductAPI,
  getAllOrdersAPI,
  deliverOrderAPI,
  getAllUsersAPI,
} from '../services/api';

const AdminDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('products');

  // Product List states
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    brand: '',
    category: '',
    countInStock: '',
    image: '',
    description: '',
  });

  // Order List states
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [deliveringOrder, setDeliveringOrder] = useState(null);

  // User List states
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Status message
  const [statusMessage, setStatusMessage] = useState(null);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const { data } = await getProductsAPI({ limit: 100 });
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data } = await getAllOrdersAPI();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await getAllUsersAPI();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProductAPI(id);
      setStatusMessage({ type: 'success', text: 'Product deleted successfully!' });
      fetchProducts();
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to delete product.' });
    }
  };

  const handleEditProductClick = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      brand: product.brand,
      category: product.category,
      countInStock: product.countInStock,
      image: product.image,
      description: product.description,
    });
    setShowProductModal(true);
  };

  const handleCreateProductClick = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: '',
      brand: '',
      category: '',
      countInStock: '',
      image: '',
      description: '',
    });
    setShowProductModal(true);
  };

  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProductAPI(editingProduct._id, productForm);
        setStatusMessage({ type: 'success', text: 'Product updated successfully!' });
      } else {
        await createProductAPI(productForm);
        setStatusMessage({ type: 'success', text: 'Product created successfully!' });
      }
      setShowProductModal(false);
      fetchProducts();
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Operation failed.' });
    }
  };

  const handleDeliverOrder = async (orderId) => {
    setDeliveringOrder(orderId);
    try {
      await deliverOrderAPI(orderId);
      setStatusMessage({ type: 'success', text: 'Order marked as delivered!' });
      fetchOrders();
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to update delivery status.' });
    } finally {
      setDeliveringOrder(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-gray-150 dark:border-zinc-800 mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-xs text-gray-400 dark:text-zinc-500 font-bold uppercase mt-1">
            Store administration controls
          </p>
        </div>

        {/* Global Status messages */}
        {statusMessage && (
          <div className={`text-xs font-bold px-4 py-2 rounded-lg border ${
            statusMessage.type === 'success'
              ? 'bg-green-50 text-green-700 border-green-150'
              : 'bg-rose-50 text-rose-700 border-rose-150'
          }`}>
            {statusMessage.text}
          </div>
        )}
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-gray-100 dark:border-zinc-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-1.5 px-5 py-3 text-sm font-bold border-b-2 -mb-px transition-colors ${
            activeTab === 'products'
              ? 'border-flipkart-blue text-flipkart-blue dark:text-white dark:border-white'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-zinc-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-1.5 px-5 py-3 text-sm font-bold border-b-2 -mb-px transition-colors ${
            activeTab === 'orders'
              ? 'border-flipkart-blue text-flipkart-blue dark:text-white dark:border-white'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-zinc-300'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          Orders
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-1.5 px-5 py-3 text-sm font-bold border-b-2 -mb-px transition-colors ${
            activeTab === 'users'
              ? 'border-flipkart-blue text-flipkart-blue dark:text-white dark:border-white'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-zinc-300'
          }`}
        >
          <Users className="w-4 h-4" />
          Users
        </button>
      </div>

      {/* TAB CONTENT: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-gray-800 dark:text-white">Product Inventory</h3>
            <button
              onClick={handleCreateProductClick}
              className="bg-flipkart-blue hover:bg-flipkart-blue-dark text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1 active:scale-95 transition-all shadow-md shadow-flipkart-blue/10"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          {loadingProducts ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-flipkart-blue" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 text-xs font-bold uppercase">
                    <th className="py-3 px-4">Image</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Brand</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800 text-gray-700 dark:text-zinc-300 font-semibold">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-55 dark:hover:bg-zinc-800/20">
                      <td className="py-3 px-4">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded border border-gray-100 dark:border-zinc-850" />
                      </td>
                      <td className="py-3 px-4 max-w-[200px] truncate">{p.name}</td>
                      <td className="py-3 px-4">{p.brand}</td>
                      <td className="py-3 px-4">{p.category}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4">{p.countInStock}</td>
                      <td className="py-3 px-4 flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditProductClick(p)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-955/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4">Manage Orders</h3>

          {loadingOrders ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-flipkart-blue" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 text-xs font-bold uppercase">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Paid</th>
                    <th className="py-3 px-4">Delivered</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800 text-gray-700 dark:text-zinc-300 font-semibold">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-gray-55 dark:hover:bg-zinc-800/20">
                      <td className="py-3 px-4 font-mono text-xs max-w-[100px] truncate">{o._id}</td>
                      <td className="py-3 px-4">{o.user?.name || 'Guest'}</td>
                      <td className="py-3 px-4 text-xs">{new Date(o.createdAt).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">₹{o.totalPrice.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          o.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {o.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          o.isDelivered ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {o.isDelivered ? 'Delivered' : 'Processing'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {!o.isDelivered && o.isPaid && (
                          <button
                            onClick={() => handleDeliverOrder(o._id)}
                            disabled={deliveringOrder === o._id}
                            className="bg-flipkart-blue hover:bg-flipkart-blue-dark text-white text-[10px] font-extrabold py-1.5 px-3 rounded-lg active:scale-95 transition-all flex items-center gap-1 mx-auto"
                          >
                            {deliveringOrder === o._id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                            Deliver
                          </button>
                        )}
                        {!o.isPaid && <span className="text-xs text-gray-400 font-medium">Awaiting payment</span>}
                        {o.isDelivered && <span className="text-xs text-green-600 font-bold flex items-center justify-center gap-0.5"><Check className="w-3.5 h-3.5" /> Done</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: USERS */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4">View Users</h3>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-flipkart-blue" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 text-xs font-bold uppercase">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Admin Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800 text-gray-700 dark:text-zinc-300 font-semibold">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-55 dark:hover:bg-zinc-800/20">
                      <td className="py-3 px-4 font-mono text-xs max-w-[150px] truncate">{u._id}</td>
                      <td className="py-3 px-4">{u.name}</td>
                      <td className="py-3 px-4">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          u.isAdmin
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-955/20 dark:text-rose-500'
                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}>
                          {u.isAdmin ? 'Admin' : 'Customer'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* POPUP MODAL: ADD / EDIT PRODUCT */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-zinc-800">
              {editingProduct ? 'Edit Product' : 'Create Product'}
            </h3>

            <form onSubmit={handleProductFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Product Name</label>
                <input
                  required
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full text-sm mt-1 p-2.5 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-xl focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Price (INR)</label>
                <input
                  required
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="w-full text-sm mt-1 p-2.5 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-xl focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Stock Count</label>
                <input
                  required
                  type="number"
                  value={productForm.countInStock}
                  onChange={(e) => setProductForm({ ...productForm, countInStock: e.target.value })}
                  className="w-full text-sm mt-1 p-2.5 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-xl focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Brand</label>
                <input
                  required
                  type="text"
                  value={productForm.brand}
                  onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                  className="w-full text-sm mt-1 p-2.5 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-xl focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Category</label>
                <input
                  required
                  type="text"
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full text-sm mt-1 p-2.5 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-xl focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Image URL</label>
                <input
                  required
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full text-sm mt-1 p-2.5 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-xl focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Description</label>
                <textarea
                  required
                  rows="3"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full text-sm mt-1 p-2.5 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-xl focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 mt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-zinc-750 text-gray-500 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-flipkart-blue hover:bg-flipkart-blue-dark text-white text-sm font-bold px-5 py-2 rounded-lg"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
