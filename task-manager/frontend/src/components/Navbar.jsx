import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-lg border-b border-slate-200/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-gradient-to-tr from-brand-600 to-brand-400 p-2 rounded-xl shadow-md group-hover:shadow-brand-500/30 transition-shadow">
              <CheckSquare className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight">
              TaskManager
            </span>
          </div>
          {user && (
            <div className="flex items-center space-x-8">
              <div className="hidden sm:flex items-center">
                <span className="text-slate-500 mr-2 text-sm">Welcome back,</span>
                <span className="text-slate-800 font-bold">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
