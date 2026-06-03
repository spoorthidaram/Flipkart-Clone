import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import axios from 'axios';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Fetch search suggestions with debounce
  useEffect(() => {
    if (!keyword.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products?keyword=${keyword}&limit=5`);
        setSuggestions(data.products || []);
        setShowDropdown(true);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    if (keyword.trim()) {
      navigate(`/?search=${keyword}`);
    } else {
      navigate('/');
    }
  };

  const handleSuggestionClick = (id) => {
    setKeyword('');
    setShowDropdown(false);
    navigate(`/product/${id}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-xl flex-grow mx-4"
      ref={dropdownRef}
    >
      <div className="relative">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search for products, brands and more"
          className="w-full bg-white dark:bg-zinc-800 text-gray-800 dark:text-white pl-4 pr-12 py-2.5 rounded-lg border border-transparent shadow-sm focus:outline-none focus:ring-2 focus:ring-flipkart-blue focus:border-transparent transition-all text-sm"
          onFocus={() => {
            if (suggestions.length > 0) setShowDropdown(true);
          }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
          <button type="submit" className="text-gray-400 hover:text-flipkart-blue transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden">
          <ul className="divide-y divide-gray-50 dark:divide-zinc-800 max-h-64 overflow-y-auto">
            {suggestions.map((product) => (
              <li
                key={product._id}
                onClick={() => handleSuggestionClick(product._id)}
                className="flex items-center gap-3 p-3 hover:bg-gray-55 hover:bg-flipkart-blue/5 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors duration-150"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-9 h-9 object-cover rounded bg-gray-100 dark:bg-zinc-950"
                />
                <div className="flex-grow">
                  <p className="text-xs text-gray-400 dark:text-zinc-500 font-bold uppercase">
                    {product.brand}
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1">
                    {product.name}
                  </p>
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-white shrink-0">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default SearchBar;
