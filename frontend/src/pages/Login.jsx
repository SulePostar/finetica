import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    // After successful login logic, redirect to home
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
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

      {/* Right Panel */}
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
              <p className="text-gray-600">Sign in to your account.</p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Email Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-indigo-600" />
                </div>

                <input
                  type="email"
                  placeholder="Email address"
                  className={`block w-full pl-12 pr-4 py-3.5 bg-indigo-50 border rounded-xl
                    text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-colors
                    ${errors.email ? 'border-red-500' : 'border-transparent'}
                  `}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Invalid email format",
                    },
                  })}
                />

                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 pl-2">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-indigo-600" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`block w-full pl-12 pr-12 py-3.5 bg-indigo-50 border rounded-xl 
                    text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-colors
                    ${errors.password ? 'border-red-500' : 'border-transparent'}
                  `}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                />

                {/* Toggle Password Button */}
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

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 pl-2">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => console.log("Forgot password clicked")}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3.5 px-4 rounded-xl
                  hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                  focus:ring-indigo-600 transition-all shadow-lg hover:shadow-xl"
              >
                Login
              </button>

              {/* Sign Up */}
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Don't have an account?
                  <a
                    href="/register"
                    className="pl-2 font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                  > Sign Up
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;