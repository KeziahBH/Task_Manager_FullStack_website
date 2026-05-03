import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CheckSquare } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-600/30 blur-[120px] mix-blend-screen animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen animate-float" style={{ animationDelay: '1.5s' }}></div>

      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl z-10 animate-slide-up">
        <div className="flex flex-col items-center">
          <div className="bg-white/10 p-3 rounded-2xl shadow-inner mb-4">
            <CheckSquare className="h-10 w-10 text-brand-400" />
          </div>
          <h2 className="text-center text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-center text-sm text-slate-300">
            Sign in to manage your productivity
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Email address</label>
              <input
                type="email"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all sm:text-sm shadow-inner"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Password</label>
              <input
                type="password"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all sm:text-sm shadow-inner"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-brand-500 transition-all shadow-lg hover:shadow-brand-500/25 transform hover:-translate-y-0.5"
            >
              Sign in to Dashboard
            </button>
          </div>
          
          <div className="text-center mt-6">
            <span className="text-sm text-slate-400">Don't have an account? </span>
            <Link to="/register" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
