import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
    Contact,
    Lock,
    Mail,
    ShieldCheck,
    User,
    ImagePlus,
} from "lucide-react";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";

import {
    Dropzone,
    DropzoneContent,
    DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";

const Register = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    const navigate = useNavigate();
    const password = watch("password");

    const [profileImage, setProfileImage] = useState(null);

    const onSubmit = (data) => {
        console.log("Form submitted:", data);
        console.log("Profile image:", profileImage);
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen flex">
            {/* LEFT PANEL (same as login) */}
            <div className="hidden lg:flex lg:w-2/5 bg-[linear-gradient(90deg,rgba(88,80,166,1)_0%,rgba(108,105,255,1)_76%)] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/5" />

                <div className="relative z-10 flex flex-col w-full px-12 py-10">
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center max-w-lg">
                            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 whitespace-nowrap">
                                Welcome to Finetica!
                            </h1>
                            <p className="text-white/70 text-base xl:text-lg">
                                Create your account to get access to the dashboard.
                            </p>
                        </div>
                    </div>

                    <div className="text-xs text-white/50 text-center">
                        © {new Date().getFullYear()} Finetica
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-xl">
                    {/* CARD (keeps your current register design, just slightly compact to avoid scroll) */}
                    <div
                        className="bg-white rounded-2xl
              px-10 py-10 sm:px-12 sm:py-12
              shadow-[0_20px_50px_rgba(0,0,0,0.22),0_0_0_1px_rgba(108,105,255,0.08)]"
                    >
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-6">
                            <div className="text-3xl font-bold text-indigo-600 mb-2">
                                Finetica
                            </div>
                        </div>

                        {/* HEADER */}
                        <div className="text-center mb-6">
                            <h2 className="text-4xl font-bold tracking-tight text-brand mb-2">
                                Create Account
                            </h2>
                            <p className="text-gray-600">
                                Fill in the form below to create an account
                            </p>
                        </div>

                        {/* PROFILE IMAGE UPLOAD */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="flex flex-col items-center justify-center mb-6 cursor-pointer group">
                                    <div className="relative w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center shadow-inner">
                                        {profileImage ? (
                                            <img
                                                src={URL.createObjectURL(profileImage)}
                                                alt="Profile"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <ImagePlus className="h-9 w-9 text-indigo-400 group-hover:scale-110 transition" />
                                        )}
                                    </div>

                                    <p className="mt-2 text-sm text-indigo-500 font-medium">
                                        Upload profile photo
                                    </p>
                                </div>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-md rounded-xl shadow-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-semibold">
                                        Upload Profile Photo
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="py-6">
                                    <Dropzone
                                        accept={{ "image/*": [".png", ".jpg", ".jpeg", ".gif"] }}
                                        maxSize={10 * 1024 * 1024}
                                        maxFiles={1}
                                        name="profile_image"
                                        onDrop={(files) => setProfileImage(files?.[0] ?? null)}
                                    >
                                        <DropzoneContent />
                                        <DropzoneEmptyState />
                                    </Dropzone>
                                </div>

                                <DialogFooter className="flex justify-between gap-2">
                                    <DialogClose asChild>
                                        <button className="px-4 py-2 text-sm text-gray-600 hover:underline">
                                            Cancel
                                        </button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <button className="px-4 py-2 rounded-lg bg-brand text-white font-semibold">
                                            Confirm
                                        </button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* FORM */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* First Name */}
                            <div>
                                <div
                                    className={`flex items-center gap-3 rounded-xl border px-4 py-4 bg-gray-50 transition-colors
                    ${errors.firstName ? "border-red-500" : "border-transparent"}`}
                                >
                                    <User className="h-5 w-5 text-brand shrink-0" />
                                    <div className="h-6 w-px bg-gray-300 shrink-0" />
                                    <input
                                        placeholder="First Name"
                                        {...register("firstName", { required: "First name required" })}
                                        className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
                                    />
                                </div>
                                {errors.firstName && (
                                    <p className="text-red-500 text-xs mt-1 pl-2">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <div
                                    className={`flex items-center gap-3 rounded-xl border px-4 py-4 bg-gray-50 transition-colors
                    ${errors.lastName ? "border-red-500" : "border-transparent"}`}
                                >
                                    <Contact className="h-5 w-5 text-brand shrink-0" />
                                    <div className="h-6 w-px bg-gray-300 shrink-0" />
                                    <input
                                        placeholder="Last Name"
                                        {...register("lastName", { required: "Last name required" })}
                                        className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
                                    />
                                </div>
                                {errors.lastName && (
                                    <p className="text-red-500 text-xs mt-1 pl-2">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <div
                                    className={`flex items-center gap-3 rounded-xl border px-4 py-4 bg-gray-50 transition-colors
                    ${errors.email ? "border-red-500" : "border-transparent"}`}
                                >
                                    <Mail className="h-5 w-5 text-brand shrink-0" />
                                    <div className="h-6 w-px bg-gray-300 shrink-0" />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        {...register("email", {
                                            required: "Email required",
                                            pattern: {
                                                value: /^[^@]+@[^@]+\.[^@]+$/,
                                                message: "Invalid email",
                                            },
                                        })}
                                        className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1 pl-2">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <div
                                    className={`flex items-center gap-3 rounded-xl border px-4 py-4 bg-gray-50 transition-colors
                    ${errors.password ? "border-red-500" : "border-transparent"}`}
                                >
                                    <Lock className="h-5 w-5 text-brand shrink-0" />
                                    <div className="h-6 w-px bg-gray-300 shrink-0" />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        {...register("password", {
                                            required: "Password required",
                                            minLength: { value: 6, message: "Min 6 characters" },
                                            deps: ["confirmPassword"],
                                        })}
                                        className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1 pl-2">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <div
                                    className={`flex items-center gap-3 rounded-xl border px-4 py-4 bg-gray-50 transition-colors
                    ${errors.confirmPassword ? "border-red-500" : "border-transparent"}`}
                                >
                                    <ShieldCheck className="h-5 w-5 text-brand shrink-0" />
                                    <div className="h-6 w-px bg-gray-300 shrink-0" />
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        {...register("confirmPassword", {
                                            required: "Confirm password required",
                                            validate: (value) =>
                                                value === password || "Passwords do not match",
                                        })}
                                        className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1 pl-2">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                className="w-full py-4 rounded-xl bg-brand text-white font-semibold
                  shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
                            >
                                Create Account
                            </button>

                            {/* LOGIN */}
                            <div className="text-center pt-2 text-gray-600">
                                Already have an account?
                                <a
                                    href="/login"
                                    className="pl-2 font-semibold text-brand hover:opacity-80 transition"
                                >
                                    Sign in
                                </a>
                            </div>
                        </form>
                    </div>
                    {/* /card */}
                </div>
            </div>
        </div>
    );
};

export default Register;
