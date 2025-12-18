import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorString, setErrorString] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setErrorString("");
    const result = await login(data);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorString(result.error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-2/5 bg-[linear-gradient(90deg,rgba(88,80,166,1)_0%,rgba(108,105,255,1)_76%)] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5" />

        {/* Floating S letters */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div
            className="absolute left-12 top-24 text-white/20 font-extrabold select-none
                       text-[110px] blur-[0.3px]
                       animate-[floatS_6s_ease-in-out_infinite]"
            style={{ textShadow: "0 25px 60px rgba(0,0,0,0.18)" }}
          >
            S
          </div>

          <div
            className="absolute right-16 bottom-24 text-white/15 font-extrabold select-none
                       text-[100px] blur-[0.6px]
                       animate-[floatS2_7.5s_ease-in-out_infinite]"
            style={{ textShadow: "0 25px 60px rgba(0,0,0,0.18)" }}
          >
            S
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col w-full px-12 py-10">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-lg">
              <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 whitespace-nowrap">
                Welcome to Finetica
              </h1>

              <p className="text-white/70 text-base xl:text-lg">
                Sign in to manage your dashboard and workflows.
              </p>
            </div>
          </div>

          <div className="text-md text-white/50 text-center">
            © Future Experts {new Date().getFullYear()}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-2xl shadow-[0_30px_80px_-25px_rgba(0,0,0,0.35)] px-12 py-14 sm:px-16 sm:py-18">

            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                Finetica
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-2 tracking-tight text-brand">
                Welcome Back
              </h2>
              <p className="text-gray-600">Sign in to your account.</p>
              {errorString && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {errorString}
                </div>
              )}
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-brand" />
                </div>

                <input
                  type="email"
                  placeholder="Email address"
                  className={`block w-full pl-12 pr-4 py-3.5 bg-indigo-50 border rounded-xl
                    text-gray-900 placeholder-gray-500
                    focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-colors
                    ${errors.email ? "border-red-500" : "border-transparent"}`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Invalid email format",
                    },
                  })}
                />

                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 pl-2">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-brand" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`block w-full pl-12 pr-12 py-3.5 bg-indigo-50 border rounded-xl
                    text-gray-900 placeholder-gray-500
                    focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-colors
                    ${errors.password ? "border-red-500" : "border-transparent"}`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
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

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 pl-2">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm font-medium text-brand hover:text-indigo-700 transition"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-brand text-white font-semibold
                           shadow-md hover:shadow-lg transition-all
                           focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Login
              </button>

              {/* Register */}
              <div className="text-center pt-4 text-gray-600">
                Don’t have an account?
                <a
                  href="/register"
                  className="pl-2 font-semibold text-brand hover:text-indigo-700 transition"
                >
                  Sign Up
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
