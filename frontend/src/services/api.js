import axios from 'axios';
import seedProducts from '../data/products';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Offline Mode Detector: Active if on Vercel or if database connection is offline.
const isOfflineMode = () => {
  return window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
};

// --- Local Storage Mock Database Helpers ---
const getLocalProducts = () => {
  let local = localStorage.getItem('mock_products');
  if (!local) {
    localStorage.setItem('mock_products', JSON.stringify(seedProducts));
    return seedProducts;
  }
  return JSON.parse(local);
};

const saveLocalProducts = (products) => {
  localStorage.setItem('mock_products', JSON.stringify(products));
};

const getLocalOrders = () => {
  let local = localStorage.getItem('mock_orders');
  return local ? JSON.parse(local) : [];
};

const saveLocalOrders = (orders) => {
  localStorage.setItem('mock_orders', JSON.stringify(orders));
};

const getLocalUsers = () => {
  let local = localStorage.getItem('mock_users');
  if (!local) {
    const defaultUsers = [
      { _id: 'u_admin', name: 'Admin User', email: 'admin@flipkart.com', isAdmin: true, address: {} },
      { _id: 'u_customer', name: 'John Doe', email: 'john@gmail.com', isAdmin: false, address: {} },
    ];
    localStorage.setItem('mock_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(local);
};

const saveLocalUsers = (users) => {
  localStorage.setItem('mock_users', JSON.stringify(users));
};

// Helper: Simulate network latency for realistic look
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));


// ==========================================
// 1. AUTH ENDPOINTS
// ==========================================
export const loginAPI = async (email, password) => {
  if (isOfflineMode()) {
    await delay();
    const users = getLocalUsers();
    const user = users.find(u => u.email === email);
    if (user) {
      const loggedUser = { ...user, token: 'MOCK_JWT_TOKEN_' + user._id };
      localStorage.setItem('userInfo', JSON.stringify(loggedUser));
      return { data: loggedUser };
    }
    throw { response: { data: { message: 'Invalid email or password (offline mode)' } } };
  }

  try {
    return await API.post('/auth/login', { email, password });
  } catch (err) {
    if (err.code === 'ERR_NETWORK') return loginAPI.fallback(email, password);
    throw err;
  }
};

loginAPI.fallback = async (email, password) => {
  console.warn('Network failed, falling back to local login mock.');
  const users = getLocalUsers();
  const user = users.find(u => u.email === email);
  if (user) {
    return { data: { ...user, token: 'MOCK_JWT_TOKEN_' + user._id } };
  }
  throw { response: { data: { message: 'Invalid email or password (network fallback)' } } };
};


export const registerAPI = async (name, email, password) => {
  if (isOfflineMode()) {
    await delay();
    const users = getLocalUsers();
    if (users.find(u => u.email === email)) {
      throw { response: { data: { message: 'User already exists' } } };
    }
    const newUser = {
      _id: 'u_' + Date.now(),
      name,
      email,
      isAdmin: false,
      address: {},
    };
    users.push(newUser);
    saveLocalUsers(users);
    const loggedUser = { ...newUser, token: 'MOCK_JWT_TOKEN_' + newUser._id };
    localStorage.setItem('userInfo', JSON.stringify(loggedUser));
    return { data: loggedUser };
  }

  try {
    return await API.post('/auth/register', { name, email, password });
  } catch (err) {
    if (err.code === 'ERR_NETWORK') {
      const mockUser = { _id: 'u_' + Date.now(), name, email, isAdmin: false, address: {}, token: 'MOCK_JWT_TOKEN' };
      return { data: mockUser };
    }
    throw err;
  }
};

export const getProfileAPI = async () => {
  if (isOfflineMode()) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return { data: userInfo };
  }
  return API.get('/auth/profile');
};

export const updateProfileAPI = async (data) => {
  if (isOfflineMode()) {
    await delay();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const updated = { ...userInfo, ...data };
    localStorage.setItem('userInfo', JSON.stringify(updated));
    // Update in users table
    const users = getLocalUsers();
    const idx = users.findIndex(u => u._id === userInfo._id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data };
      saveLocalUsers(users);
    }
    return { data: updated };
  }
  return API.put('/auth/profile', data);
};

export const getAllUsersAPI = async () => {
  if (isOfflineMode()) {
    await delay();
    return { data: getLocalUsers() };
  }
  return API.get('/auth/users');
};


// ==========================================
// 2. PRODUCT ENDPOINTS
// ==========================================
export const getProductsAPI = async (params = {}) => {
  if (isOfflineMode()) {
    await delay(300);
    const seed = getLocalProducts();
    let filtered = [...seed];

    if (params.keyword) {
      const regex = new RegExp(params.keyword, 'i');
      filtered = filtered.filter(p => regex.test(p.name) || regex.test(p.description));
    }

    if (params.category && params.category !== 'All') {
      filtered = filtered.filter(p => p.category === params.category);
    }

    if (params.brand) {
      filtered = filtered.filter(p => p.brand === params.brand);
    }

    if (params.minPrice) {
      filtered = filtered.filter(p => p.price >= Number(params.minPrice));
    }

    if (params.maxPrice) {
      filtered = filtered.filter(p => p.price <= Number(params.maxPrice));
    }

    if (params.rating) {
      filtered = filtered.filter(p => p.rating >= Number(params.rating));
    }

    const categories = [...new Set(seed.map(p => p.category))];
    const brands = [...new Set(seed.map(p => p.brand))];
    
    const page = Number(params.page) || 1;
    const pageSize = Number(params.limit) || 8;
    const startIdx = pageSize * (page - 1);
    
    return {
      data: {
        products: filtered.slice(startIdx, startIdx + pageSize),
        page,
        pages: Math.ceil(filtered.length / pageSize) || 1,
        totalProducts: filtered.length,
        categories,
        brands,
      }
    };
  }

  try {
    return await API.get('/products', { params });
  } catch (err) {
    if (err.code === 'ERR_NETWORK') return getProductsAPI.fallback(params);
    throw err;
  }
};

getProductsAPI.fallback = async (params) => {
  // Simple offline fallback
  const seed = seedProducts;
  return {
    data: {
      products: seed.slice(0, 8),
      page: 1,
      pages: 1,
      totalProducts: seed.length,
      categories: ['All', 'Mobiles', 'Electronics', 'Fashion', 'Appliances', 'Home'],
      brands: ['Apple', 'Sony', 'Samsung', 'Nike', 'Rolex'],
    }
  };
};

export const getProductByIdAPI = async (id) => {
  if (isOfflineMode()) {
    await delay(200);
    const seed = getLocalProducts();
    const product = seed.find(p => p._id === id);
    if (product) return { data: product };
    throw { response: { data: { message: 'Product not found (offline)' } } };
  }

  try {
    return await API.get(`/products/${id}`);
  } catch (err) {
    const product = seedProducts.find(p => p._id === id);
    if (product) return { data: product };
    throw err;
  }
};

export const createProductAPI = async (productData) => {
  if (isOfflineMode()) {
    await delay();
    const seed = getLocalProducts();
    const newProduct = {
      _id: 'p_' + Date.now(),
      rating: 0,
      numReviews: 0,
      reviews: [],
      ...productData,
      price: Number(productData.price),
      countInStock: Number(productData.countInStock),
    };
    seed.unshift(newProduct);
    saveLocalProducts(seed);
    return { data: newProduct };
  }
  return API.post('/products', productData);
};

export const updateProductAPI = async (id, productData) => {
  if (isOfflineMode()) {
    await delay();
    const seed = getLocalProducts();
    const idx = seed.findIndex(p => p._id === id);
    if (idx !== -1) {
      seed[idx] = {
        ...seed[idx],
        ...productData,
        price: Number(productData.price),
        countInStock: Number(productData.countInStock),
      };
      saveLocalProducts(seed);
      return { data: seed[idx] };
    }
    throw new Error('Product not found');
  }
  return API.put(`/products/${id}`, productData);
};

export const deleteProductAPI = async (id) => {
  if (isOfflineMode()) {
    await delay();
    const seed = getLocalProducts();
    const filtered = seed.filter(p => p._id !== id);
    saveLocalProducts(filtered);
    return { data: { message: 'Product removed' } };
  }
  return API.delete(`/products/${id}`);
};

export const createReviewAPI = async (id, reviewData) => {
  if (isOfflineMode()) {
    await delay();
    const seed = getLocalProducts();
    const idx = seed.findIndex(p => p._id === id);
    if (idx !== -1) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const newReview = {
        _id: 'r_' + Date.now(),
        name: userInfo?.name || 'Anonymous',
        rating: Number(reviewData.rating),
        comment: reviewData.comment,
        createdAt: new Date().toISOString(),
      };
      
      const product = seed[idx];
      product.reviews.push(newReview);
      product.numReviews = product.reviews.length;
      product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
      
      saveLocalProducts(seed);
      return { data: { message: 'Review added' } };
    }
    throw new Error('Product not found');
  }
  return API.post(`/products/${id}/reviews`, reviewData);
};


// ==========================================
// 3. CART ENDPOINTS
// ==========================================
export const getCartAPI = async () => {
  if (isOfflineMode()) {
    const items = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
    // Format to match populate structure: { cartItems: [ { product: { name, image, price }, qty } ] }
    const formattedItems = items.map(item => ({
      product: {
        _id: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        countInStock: item.countInStock,
      },
      qty: item.qty
    }));
    return { data: { cartItems: formattedItems } };
  }
  return API.get('/cart');
};

export const updateCartAPI = async (cartItems) => {
  if (isOfflineMode()) {
    return { data: { message: 'Cart updated locally' } };
  }
  return API.post('/cart', { cartItems });
};

export const removeCartItemAPI = async (productId) => {
  if (isOfflineMode()) {
    return { data: { message: 'Item removed locally' } };
  }
  return API.delete(`/cart/${productId}`);
};

export const clearCartAPI = async () => {
  if (isOfflineMode()) {
    return { data: { message: 'Cart cleared locally' } };
  }
  return API.delete('/cart');
};


// ==========================================
// 4. ORDER ENDPOINTS
// ==========================================
export const createOrderAPI = async (orderData) => {
  if (isOfflineMode()) {
    await delay(300);
    const orders = getLocalOrders();
    const newOrder = {
      _id: 'o_' + Date.now(),
      createdAt: new Date().toISOString(),
      isPaid: false,
      isDelivered: false,
      user: JSON.parse(localStorage.getItem('userInfo')),
      ...orderData,
    };
    
    // Decrement local inventory stock
    const seed = getLocalProducts();
    orderData.orderItems.forEach(item => {
      const idx = seed.findIndex(p => p._id === item.product);
      if (idx !== -1) {
        seed[idx].countInStock = Math.max(0, seed[idx].countInStock - item.qty);
      }
    });
    saveLocalProducts(seed);

    orders.unshift(newOrder);
    saveLocalOrders(orders);
    return { data: newOrder };
  }
  return API.post('/orders', orderData);
};

export const getOrderByIdAPI = async (id) => {
  if (isOfflineMode()) {
    const orders = getLocalOrders();
    const order = orders.find(o => o._id === id);
    if (order) return { data: order };
    throw new Error('Order not found');
  }
  return API.get(`/orders/${id}`);
};

export const getMyOrdersAPI = async () => {
  if (isOfflineMode()) {
    await delay(100);
    const orders = getLocalOrders();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // Filter by currently logged in user ID
    const my = orders.filter(o => o.user?._id === userInfo?._id);
    return { data: my };
  }
  return API.get('/orders/myorders');
};

export const payOrderAPI = async (id, paymentResult) => {
  if (isOfflineMode()) {
    await delay();
    const orders = getLocalOrders();
    const idx = orders.findIndex(o => o._id === id);
    if (idx !== -1) {
      orders[idx].isPaid = true;
      orders[idx].paidAt = new Date().toISOString();
      orders[idx].paymentResult = paymentResult;
      saveLocalOrders(orders);
      return { data: orders[idx] };
    }
    throw new Error('Order not found');
  }
  return API.put(`/orders/${id}/pay`, paymentResult);
};

export const deliverOrderAPI = async (id) => {
  if (isOfflineMode()) {
    await delay();
    const orders = getLocalOrders();
    const idx = orders.findIndex(o => o._id === id);
    if (idx !== -1) {
      orders[idx].isDelivered = true;
      orders[idx].deliveredAt = new Date().toISOString();
      saveLocalOrders(orders);
      return { data: orders[idx] };
    }
    throw new Error('Order not found');
  }
  return API.put(`/orders/${id}/deliver`);
};

export const getAllOrdersAPI = async () => {
  if (isOfflineMode()) {
    await delay();
    return { data: getLocalOrders() };
  }
  return API.get('/orders');
};

export default API;
