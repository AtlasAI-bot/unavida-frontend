import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export const Login = () => {
  const [activeRole, setActiveRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const roleConfig = {
    student: {
      email: 'student@unavida.com',
      name: 'Student',
      color: 'cyan',
      gradient: 'from-cyan-500 to-blue-600',
      description: 'Access learning materials and track progress',
    },
    instructor: {
      email: 'instructor@unavida.com',
      name: 'Instructor',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-600',
      description: 'Manage courses and monitor student performance',
    },
    admin: {
      email: 'admin@unavida.com',
      name: 'Administrator',
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-600',
      description: 'System administration and user management',
    },
  };

  const currentRole = roleConfig[activeRole];

  const handleRoleTabClick = (role) => {
    setActiveRole(role);
    setEmail(roleConfig[role].email);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email) {
        throw new Error('Please enter your email');
      }
      if (!password) {
        throw new Error('Please enter your password');
      }

      const user = login(email, password, activeRole);

      // Role-based redirect after successful login
      const role = user?.role || activeRole;
      const redirectTo = role === 'student'
        ? '/bookshelf'
        : role === 'instructor'
          ? '/instructor-dashboard'
          : role === 'admin'
            ? '/admin-dashboard'
            : '/';

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center px-4 py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={`text-5xl font-black bg-gradient-to-r ${currentRole.gradient} bg-clip-text text-transparent`}>
              U
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">UnaVida</h1>
              <p className="text-xs text-gray-400">Pharmacology Learning Platform</p>
            </div>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Role Tabs */}
          <div className="flex border-b border-gray-700">
            {Object.entries(roleConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleRoleTabClick(key)}
                className={`flex-1 py-4 px-4 font-semibold text-sm transition-all relative ${
                  activeRole === key
                    ? `text-white`
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {config.name}
                {activeRole === key && (
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`}></div>
                )}
              </button>
            ))}
          </div>

          {/* Form Container */}
          <div className="p-8">
            {/* Role Description */}
            <p className="text-sm text-gray-400 mb-6 text-center">
              {currentRole.description}
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@unavida.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 bg-gray-800 border border-gray-700 rounded cursor-pointer accent-cyan-500"
                  />
                  <span className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-cyan-500 hover:text-cyan-400 transition-colors font-medium"
                >
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                  loading
                    ? 'bg-gray-700 cursor-not-allowed'
                    : `bg-gradient-to-r ${currentRole.gradient} hover:shadow-lg hover:shadow-cyan-500/50 active:scale-95`
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </>
                ) : (
                  'Login as ' + currentRole.name
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400 mb-2">
                <strong>Demo Credentials:</strong>
              </p>
              <p className="text-xs text-gray-500 font-mono">
                Email: {currentRole.email}<br />
                Password: password
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-950 border-t border-gray-700 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <a href="#" className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors">
              Sign up
            </a>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};
