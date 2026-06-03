import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { registerAPI } from '../services/api';
import { authStart, authSuccess, authFail } from '../redux/authSlice';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    dispatch(authStart());
    try {
      const { data } = await registerAPI(name, email, password);
      dispatch(authSuccess(data));
    } catch (err) {
      dispatch(authFail(err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center italic">
            Flipkart
            <span className="text-flipkart-yellow font-extrabold not-italic text-3xl ml-0.5">+</span>
          </h1>
          <p className="text-xs text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-1.5">
            Create your account
          </p>
        </div>

        {(error || validationError) && (
          <div className="text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-zinc-805 p-2.5 rounded-lg border border-rose-100 dark:border-zinc-850 mb-4 text-center">
            {validationError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Full Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm mt-1.5 p-3.5 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-xl focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Email Address</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm mt-1.5 p-3.5 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-xl focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
              placeholder="e.g. name@domain.com"
            />
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm mt-1.5 p-3.5 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-xl focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
              placeholder="Create password"
            />
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Confirm Password</label>
            <input
              required
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full text-sm mt-1.5 p-3.5 bg-gray-50 dark:bg-zinc-850 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-xl focus:ring-1 focus:ring-flipkart-blue focus:outline-none"
              placeholder="Re-enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-flipkart-blue hover:bg-flipkart-blue-dark text-white font-extrabold rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-flipkart-blue/20 text-sm mt-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            Register
          </button>
        </form>

        <div className="border-t border-gray-100 dark:border-zinc-800 mt-6 pt-6 text-center">
          <p className="text-sm font-semibold text-gray-500">
            Already have an account?{' '}
            <Link
              to={redirect !== '/' ? `/login?redirect=${redirect}` : '/login'}
              className="text-flipkart-blue hover:underline font-bold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
