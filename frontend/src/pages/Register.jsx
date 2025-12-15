import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Contact, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: "onChange",
    });
    const navigate = useNavigate();

    function onSubmit(data) {
        console.log("Form submitted:", data);
        navigate("/dashboard");
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 px-2">
            <Card className="w-full max-w-md sm:max-w-lg md:max-w- lg:max-w-2xl p-4 sm:p-6 md:p-8 max-sm:p-2 max-[380px]:p-1 shadow-md rounded-xl">
                <CardHeader className="text-center p-0">
                    <CardTitle className="text-2xl sm:text-4xl md:text-4xl mb-4 sm:mb-6 md:mb-8">
                        Register
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base md:text-lg text-gray-600">
                        Create your account
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-6 p-6 max-sm:p-3 max-sm:gap-4 max-[380px]:p-2 max-[380px]:gap-2 max-[330px]:p-1 max-[330px]:gap-1">
                    <form id="register-form" onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup className="space-y-0 max-[380px]:space-y-0 sm:space-y-0">
                            <div className="w-full rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground ">
                                Photo Upload
                            </div>
                            <Field>
                                <div className="flex items-center gap-3 rounded-md border px-3 py-3 sm:px-4 w-full min-w-0">
                                    <User className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                                    <div className="h-6 w-px bg-gray-300 shrink-0" />
                                    <Input
                                        placeholder="First Name"
                                        {...register("firstName", { required: "First name required" })}
                                        className="w-full border-0 p-0 text-sm sm:text-base md:text-base placeholder:text-sm sm:placeholder:text-base md:placeholder:text-base min-w-0" />
                                </div>
                                {errors.firstName && (
                                    <p className="text-red-500 text-xs mt-1 block">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <div className="flex items-center gap-3 rounded-md border px-3 py-3 sm:px-4 w-full min-w-0">
                                    <Contact className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                                    <div className="h-6 w-px bg-gray-300 shrink-0" />
                                    <Input
                                        placeholder="Last Name"
                                        {...register("lastName", { required: "Last name required" })}
                                        className="w-full border-0 p-0 text-sm sm:text-base md:text-base placeholder:text-sm sm:placeholder:text-base md:placeholder:text-base min-w-0" />
                                </div>
                                {errors.lastName && (
                                    <p className="text-red-500 text-xs mt-1 block">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <div className="flex items-center gap-3 rounded-md border px-3 py-3 sm:px-4 w-full min-w-0">
                                    <Mail className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                                    <div className="h-6 w-px bg-gray-300 shrink-0" />
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        {...register("email", {
                                            required: "Email required",
                                            pattern: {
                                                value: /^[^@]+@[^@]+\.[^@]+$/,
                                                message: "Invalid email"
                                            }
                                        })} className="w-full border-0 p-0 text-sm sm:text-base md:text-base placeholder:text-sm sm:placeholder:text-base md:placeholder:text-base min-w-0" />

                                </div> {errors.email && (
                                    <p className="text-red-500 text-xs mt-1 block">
                                        {errors.email.message}
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <div className="flex items-center gap-3 rounded-md border px-3 py-3 sm:px-4 w-full min-w-0">
                                    <Lock className="h-5 w-5 sm:h-6 sm:w-6  shrink-0" />
                                    <div className="h-6 w-px bg-gray-300 shrink-0" />
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        {...register("password", {
                                            required: "Password required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters"
                                            }
                                        })}
                                        className="w-full border-0 p-0 text-sm sm:text-base md:text-base placeholder:text-sm sm:placeholder:text-base md:placeholder:text-base min-w-0" />
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1 block">
                                        {errors.password.message}
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <div className="flex items-center gap-3 rounded-md border px-3 py-3 sm:px-4 w-full min-w-0">
                                    <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                                    <div className="h-6 w-px bg-gray-300 shrink-0" />
                                    <Input
                                        type="password"
                                        placeholder="Confirm Password"
                                        {...register("confirmPassword", {
                                            required: "Confirm password required",
                                            validate: (value) =>
                                                value === watch("password") || "Passwords do not match"
                                        })}
                                        className="w-full border-0 p-0 text-sm sm:text-base md:text-base placeholder:text-sm sm:placeholder:text-base md:placeholder:text-base min-w-0" />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1 block">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </Field>

                            <Button className="w-full text-base sm:text-lg md:text-xl">
                                Create Account
                            </Button>

                            <div className="w-full text-center mt-4 text-sm sm:text-base text-gray-600">
                                Already have an account?{" "}
                                <a
                                    href="/login"
                                    className="text-blue-600 font-medium hover:underline">
                                    Sign in here
                                </a>
                            </div>

                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;