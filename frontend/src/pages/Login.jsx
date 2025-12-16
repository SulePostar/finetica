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
      <div className="hidden lg:flex lg:w-2/5 bg-[linear-gradient(90deg,rgba(88,80,166,1)_0%,rgba(108,105,255,1)_76%)] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5" />

        {/* Logo (top-left) */}
        <div className="relative z-10 flex flex-col w-full px-12 py-10">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-lg">
              <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 whitespace-nowrap">
                Welcome to Finetica!
              </h1>

              <p className="text-white/70 text-base xl:text-lg">
                Sign in to manage your dashboard and workflows.
              </p>
            </div>
          </div>

          {/* Footer (bottom) */}
          <div className="text-xs text-white/50 text-center">
            © {new Date().getFullYear()} Finetica
          </div>
        </div>
      </div>


      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-2xl shadow-2xl px-12 py-16 sm:px-16 sm:py-20">

            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                Finetica
              </div>
            </div>

            <div className="text-center mb-8">
              <h2
                className="text-4xl font-bold mb-2 tracking-tight text-brand"
              >
                Welcome Back
              </h2>

              <p className="text-gray-600">Sign in to your account.</p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Email Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-brand" />
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
                  <Lock className="h-5 w-5 text-brand" />
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
                  className="text-sm font-medium text-brand hover:text-indigo-700 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 px-4 rounded-xl text-white font-semibold transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 bg-brand"
              >
                Login
              </button>

              {/* Sign Up */}
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Don't have an account?
                  <a
                    href="/register"
                    className="pl-2 font-semibold text-brand hover:text-indigo-700 transition-colors"
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