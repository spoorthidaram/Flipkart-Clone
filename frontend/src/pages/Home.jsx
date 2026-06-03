import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, Filter, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProductsAPI } from '../services/api';
import { productRequest, productSuccess, productFail } from '../redux/productSlice';
import ProductCard from '../components/ProductCard';
import Banner from '../components/Banner';

const categoriesList = ['All', 'Mobiles', 'Electronics', 'Fashion', 'Appliances', 'Home'];

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error, page, pages, categories, brands } = useSelector(
    (state) => state.products
  );

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [selectedRating, setSelectedRating] = useState(searchParams.get('rating') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('search') || '');

  // Synchronize state when query parameters change
  useEffect(() => {
    setSearchKeyword(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || 'All');
    setSelectedBrand(searchParams.get('brand') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSelectedRating(searchParams.get('rating') || '');
    setCurrentPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(productRequest());
      try {
        const params = {
          keyword: searchKeyword,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          brand: selectedBrand || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          rating: selectedRating || undefined,
          page: currentPage,
        };

        const { data } = await getProductsAPI(params);
        dispatch(productSuccess(data));
      } catch (err) {
        dispatch(productFail(err.response?.data?.message || err.message));
      }
    };

    fetchProducts();
  }, [dispatch, searchKeyword, selectedCategory, selectedBrand, minPrice, maxPrice, selectedRating, currentPage]);

  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter update
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      
      {/* Category Navigation Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-4 flex gap-4 overflow-x-auto shadow-sm">
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => updateFilters('category', cat)}
            className={`px-5 py-2 text-sm font-semibold rounded-lg shrink-0 transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-flipkart-blue text-white shadow-md'
                : 'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Banner Carousel */}
      {!searchKeyword && <Banner />}

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800 mb-4">
            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-flipkart-blue" />
              Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              Clear All
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {/* Price Filter */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-gray-400 dark:text-zinc-500 font-extrabold mb-2.5">
                Price Range
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  onBlur={() => updateFilters('minPrice', minPrice)}
                  className="w-full text-xs p-2 bg-gray-50 dark:bg-zinc-800 dark:text-white border border-gray-100 dark:border-zinc-700 rounded"
                />
                <span className="text-gray-400 dark:text-zinc-600">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onBlur={() => updateFilters('maxPrice', maxPrice)}
                  className="w-full text-xs p-2 bg-gray-50 dark:bg-zinc-800 dark:text-white border border-gray-100 dark:border-zinc-700 rounded"
                />
              </div>
            </div>

            {/* Brand Filter */}
            {brands.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-wider text-gray-400 dark:text-zinc-500 font-extrabold mb-2">
                  Brand
                </h4>
                <select
                  value={selectedBrand}
                  onChange={(e) => updateFilters('brand', e.target.value)}
                  className="w-full text-xs p-2.5 bg-gray-50 dark:bg-zinc-800 dark:text-white border border-gray-100 dark:border-zinc-700 rounded focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
                >
                  <option value="">All Brands</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Rating Filter */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-gray-400 dark:text-zinc-500 font-extrabold mb-2">
                Customer Rating
              </h4>
              <div className="flex flex-col gap-2">
                {[4, 3, 2].map((stars) => (
                  <label key={stars} className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={Number(selectedRating) === stars}
                      onChange={() => updateFilters('rating', stars.toString())}
                      className="text-flipkart-blue focus:ring-flipkart-blue dark:bg-zinc-800 dark:border-zinc-700"
                    />
                    {stars}★ & above
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid and Pagination */}
        <main className="flex-grow flex flex-col gap-6">
          {searchKeyword && (
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Search results for "{searchKeyword}"
            </h2>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 flex-grow">
              <Loader2 className="w-10 h-10 animate-spin text-flipkart-blue mb-2" />
              <p className="text-sm font-semibold text-gray-500">Loading products...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-zinc-900 border border-red-100 dark:border-zinc-800 text-red-600 dark:text-red-400 p-4 rounded-xl font-medium text-sm text-center py-10">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center flex-grow py-20 shadow-sm">
              <p className="text-lg font-bold text-gray-800 dark:text-white mb-1">No products found</p>
              <p className="text-sm text-gray-400 dark:text-zinc-500">Try adjusting your filter settings or search terms.</p>
            </div>
          ) : (
            <>
              {/* Product Cards Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {pages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    disabled={page === 1}
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('page', (page - 1).toString());
                      setSearchParams(newParams);
                    }}
                    className="p-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-40 transition-all duration-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-bold text-gray-700 dark:text-zinc-300">
                    Page {page} of {pages}
                  </span>
                  <button
                    disabled={page === pages}
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('page', (page + 1).toString());
                      setSearchParams(newParams);
                    }}
                    className="p-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-40 transition-all duration-200"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>

      </div>
    </div>
  );
};

export default Home;
