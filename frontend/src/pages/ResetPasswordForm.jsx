import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
    Lock,
    Eye,
    EyeOff,
    CheckCircle,
    AlertTriangle,
    ArrowLeft,
} from 'lucide-react';

import { resetPassword } from '../api/auth';
import { notify } from '@/lib/notifications';

const ResetPasswordForm = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState('idle');
    const [apiError, setApiError] = useState('');

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    /* INVALID TOKEN */
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-[0_30px_80px_-25px_rgba(0,0,0,0.35)] text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <AlertTriangle className="h-12 w-12 text-yellow-600" />
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Invalid Link
                    </h3>
                    <p className="text-gray-600 mb-8">
                        This password reset link is invalid or expired.
                    </p>

                    <Link
                        to="/forgot-password"
                        className="inline-flex justify-center w-full py-4 rounded-xl
                       bg-brand text-white font-semibold shadow-md
                       hover:shadow-lg transition-all"
                    >
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

    const onSubmit = async (data) => {
        setStatus('loading');
        setApiError('');

        try {
            const result = await resetPassword({
                token,
                newPassword: data.newPassword,
            });

            if (result.success) {
                setStatus('success');
                notify?.onSuccess?.('Password reset successfully!');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setStatus('error');
                setApiError(result.message || 'Failed to reset password');
            }
        } catch (err) {
            setStatus('error');
            setApiError(err.message || 'Something went wrong');
        }
    };

    /* SUCCESS STATE */
    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-[0_30px_80px_-25px_rgba(0,0,0,0.35)] text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-100 p-3 rounded-full">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Password Reset!
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Your password has been changed successfully.
                        Redirecting to login…
                    </p>

                    <Link
                        to="/login"
                        className="font-semibold text-brand hover:underline"
                    >
                        Click here if not redirected
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* LEFT PANEL */}
            <div className="hidden lg:flex lg:w-2/5 bg-[linear-gradient(90deg,rgba(88,80,166,1)_0%,rgba(108,105,255,1)_76%)] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/5" />

                {/* Floating S */}
                <div className="pointer-events-none absolute inset-0 z-0">
                    <div
                        className="absolute left-12 top-24 text-white/20 font-extrabold select-none
                       text-[110px] blur-[0.3px]"
                        style={{ textShadow: '0 25px 60px rgba(0,0,0,0.18)' }}
                    >
                        S
                    </div>
                </div>

                <div className="relative z-10 flex flex-col w-full px-12 py-10">
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center max-w-lg">
                            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4">
                                Secure Your Account
                            </h1>
                            <p className="text-white/70 text-base xl:text-lg">
                                Choose a strong password to protect your data.
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

                        {/* MOBILE LOGO */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="text-3xl font-bold text-indigo-600">
                                Finetica
                            </div>
                        </div>

                        {/* HEADER */}
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-bold mb-2 tracking-tight text-brand">
                                New Password
                            </h2>
                            <p className="text-gray-600">
                                Enter and confirm your new password.
                            </p>
                        </div>

                        {/* ERROR */}
                        {(status === 'error' || apiError) && (
                            <div className="mb-6 p-4 rounded-xl bg-red-100 border border-red-400 flex items-start">
                                <p className="text-sm text-red-700">{apiError}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* NEW PASSWORD */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-brand" />
                                </div>

                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="New Password"
                                    className={`block w-full pl-12 pr-12 py-3.5 bg-indigo-50 border rounded-xl
                    text-gray-900 placeholder-gray-500
                    focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-colors
                    ${errors.newPassword ? 'border-red-500' : 'border-transparent'}`}
                                    {...register('newPassword', {
                                        required: 'Password is required',
                                        minLength: { value: 6, message: 'Minimum 6 characters' },
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

                                {errors.newPassword && (
                                    <p className="text-red-500 text-sm mt-1 pl-2">
                                        {errors.newPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-brand" />
                                </div>

                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    className={`block w-full pl-12 pr-4 py-3.5 bg-indigo-50 border rounded-xl
                    text-gray-900 placeholder-gray-500
                    focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-colors
                    ${errors.confirmPassword ? 'border-red-500' : 'border-transparent'}`}
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: (val) =>
                                            val === watch('newPassword') || 'Passwords do not match',
                                    })}
                                />

                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1 pl-2">
                                        {errors.confirmPassword.message}
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
                                {status === 'loading' ? 'Resetting...' : 'Set New Password'}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordForm;
