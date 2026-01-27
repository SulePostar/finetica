import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

import { requestPasswordReset } from '../api/auth';

const ForgotPasswordForm = () => {
    const [status, setStatus] = useState('idle');
    const [apiError, setApiError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setStatus('loading');
        setApiError('');

        try {
            const result = await requestPasswordReset(data.email);
            if (result.success) {
                setStatus('success');
            } else {
                setStatus('error');
                setApiError(result.message || 'Failed to send reset email');
            }
        } catch (err) {
            setStatus('error');
            setApiError(err.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* LEFT PANEL*/}
            <div className="hidden lg:flex lg:w-2/5 bg-[linear-gradient(90deg,rgba(88,80,166,1)_0%,rgba(108,105,255,1)_76%)] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/5" />

                {/* Floating S letters */}
                <div className="pointer-events-none absolute inset-0 z-0">
                    <div
                        className="absolute left-12 top-24 text-white/20 font-extrabold select-none
                       text-[110px] blur-[0.3px]"
                        style={{ textShadow: '0 25px 60px rgba(0,0,0,0.18)' }}
                    >
                        S
                    </div>

                    <div
                        className="absolute right-16 bottom-24 text-white/15 font-extrabold select-none
                       text-[100px] blur-[0.6px]"
                        style={{ textShadow: '0 25px 60px rgba(0,0,0,0.18)' }}
                    >
                        S
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col w-full px-12 py-10">
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center max-w-lg">
                            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4">
                                Account Recovery
                            </h1>
                            <p className="text-white/70 text-base xl:text-lg">
                                We’ll help you regain access to your account.
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
                            <div className="text-3xl font-bold text-indigo-600">
                                Finetica
                            </div>
                        </div>

                        {/* HEADER */}
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-bold mb-2 tracking-tight text-brand">
                                Forgot Password
                            </h2>
                            <p className="text-gray-600">
                                Enter your email to receive a reset link.
                            </p>
                        </div>

                        {status === 'success' ? (
                            <div className="text-center">
                                <div className="flex justify-center mb-6">
                                    <div className="rounded-full bg-green-100 p-3">
                                        <CheckCircle className="h-12 w-12 text-green-600" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Check your email
                                </h3>
                                <p className="text-gray-600 mb-8">
                                    We’ve sent a password reset link to your inbox.
                                </p>

                                <Link
                                    to="/login"
                                    className="w-full inline-flex justify-center py-4 rounded-xl
                             bg-brand text-white font-semibold shadow-md
                             hover:shadow-lg transition-all"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* GLOBAL ERROR */}
                                {(status === 'error' || apiError) && (
                                    <div className="p-4 rounded-xl bg-red-100 border border-red-400 flex items-start">
                                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
                                        <p className="text-sm text-red-700">{apiError}</p>
                                    </div>
                                )}

                                {/* EMAIL */}
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
                      ${errors.email ? 'border-red-500' : 'border-transparent'}`}
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^\S+@\S+\.\S+$/,
                                                message: 'Invalid email format',
                                            },
                                        })}
                                    />

                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1 pl-2">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* SUBMIT */}
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full py-4 rounded-xl bg-brand text-white font-semibold
                             shadow-md hover:shadow-lg transition-all
                             disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                                </button>

                                {/* BACK */}
                                <div className="text-center pt-2">
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center text-sm font-medium
                               text-gray-600 hover:text-brand transition"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
