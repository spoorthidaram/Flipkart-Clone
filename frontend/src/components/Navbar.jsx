import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User as UserIcon, LogOut, ShieldAlert, Sun, Moon, Sparkles } from 'lucide-react';
import { logout } from '../redux/authSlice';
import { clearCart } from '../redux/cartSlice';
import SearchBar from './SearchBar';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  // Sync total qty in cart
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 bg-flipkart-blue text-white shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex flex-col items-start select-none group shrink-0">
            <h1 className="text-xl font-bold tracking-wide italic flex items-center leading-none">
              Flipkart
              <span className="text-flipkart-yellow font-extrabold not-italic text-2xl ml-0.5 leading-none">
                +
              </span>
            </h1>
            <span className="text-[10px] text-gray-200 group-hover:text-flipkart-yellow transition-colors italic leading-none mt-0.5 flex items-center gap-0.5">
              Explore <span className="text-flipkart-yellow font-bold">Plus</span>
              <Sparkles className="w-2.5 h-2.5 fill-current text-flipkart-yellow" />
            </span>
          </Link>

          {/* Search Bar */}
          <SearchBar />

          {/* Actions Menu */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-flipkart-yellow" /> : <Moon className="w-5 h-5 text-gray-200" />}
            </button>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="relative p-2 flex items-center gap-1.5 hover:bg-white/10 rounded-lg transition-colors duration-200 font-medium"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-flipkart-yellow text-gray-900 text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-flipkart-blue animate-pulse-subtle">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Dropdown / Buttons */}
            {userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white/10 rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="max-w-[80px] sm:max-w-[120px] truncate">{userInfo.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-2xl z-50 text-gray-800 dark:text-gray-200 overflow-hidden py-1">
                    {userInfo.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-800 text-sm font-semibold text-rose-500"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-800 text-sm font-medium"
                    >
                      <UserIcon className="w-4 h-4" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-800 text-sm font-medium text-red-500 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-white text-flipkart-blue hover:bg-gray-100 font-bold px-5 py-1.5 rounded text-sm transition-colors shadow-sm"
              >
                Login
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
