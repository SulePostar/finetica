import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Welcome Section */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="absolute top-8 left-8">
          <div className="text-4xl font-bold text-white opacity-30 tracking-tight">
            symphony
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-center w-full px-12">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Welcome to<br />Finetica!
            </h1>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                Finetica
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to your account.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-indigo-600" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3.5 bg-indigo-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-colors"
                    placeholder="Email address"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-indigo-600" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-12 py-3.5 bg-indigo-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-colors"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button
                  onClick={() => console.log('Forgot password clicked')}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all shadow-lg hover:shadow-xl"
              >
                Login
              </button>

              {/* Sign Up Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => console.log('Sign up clicked')}
                    className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}