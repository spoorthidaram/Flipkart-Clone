import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach authorization token
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

// Auth endpoints
export const loginAPI = (email, password) => API.post('/auth/login', { email, password });
export const registerAPI = (name, email, password) => API.post('/auth/register', { name, email, password });
export const getProfileAPI = () => API.get('/auth/profile');
export const updateProfileAPI = (data) => API.put('/auth/profile', data);
export const getAllUsersAPI = () => API.get('/auth/users');

// Product endpoints
export const getProductsAPI = (params) => API.get('/products', { params });
export const getProductByIdAPI = (id) => API.get(`/products/${id}`);
export const createProductAPI = (productData) => API.post('/products', productData);
export const updateProductAPI = (id, productData) => API.put(`/products/${id}`, productData);
export const deleteProductAPI = (id) => API.delete(`/products/${id}`);
export const createReviewAPI = (id, reviewData) => API.post(`/products/${id}/reviews`, reviewData);

// Cart endpoints
export const getCartAPI = () => API.get('/cart');
export const updateCartAPI = (cartItems) => API.post('/cart', { cartItems });
export const removeCartItemAPI = (productId) => API.delete(`/cart/${productId}`);
export const clearCartAPI = () => API.delete('/cart');

// Order endpoints
export const createOrderAPI = (orderData) => API.post('/orders', orderData);
export const getOrderByIdAPI = (id) => API.get(`/orders/${id}`);
export const getMyOrdersAPI = () => API.get('/orders/myorders');
export const payOrderAPI = (id, paymentResult) => API.put(`/orders/${id}/pay`, paymentResult);
export const deliverOrderAPI = (id) => API.put(`/orders/${id}/deliver`);
export const getAllOrdersAPI = () => API.get('/orders');

export default API;
