import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCartAPI } from './services/api';
import { setCartItems } from './redux/cartSlice';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // Sync cart items from database on login/startup
  useEffect(() => {
    const syncCart = async () => {
      if (userInfo) {
        try {
          const { data } = await getCartAPI();
          // Extract cartItems as { product: id, name, price, qty, image }
          const formatted = data.cartItems.map((item) => ({
            product: item.product._id,
            name: item.product.name,
            image: item.product.image,
            price: item.product.price,
            countInStock: item.product.countInStock,
            qty: item.qty,
          }));
          dispatch(setCartItems(formatted));
        } catch (err) {
          console.error('Failed to sync backend cart:', err);
        }
      }
    };

    syncCart();
  }, [userInfo, dispatch]);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
