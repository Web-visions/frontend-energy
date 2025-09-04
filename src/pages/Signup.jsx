import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const {
    register: registerUser,
    isAuthenticated,
    isEmailVerified,
  } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      // If email verification is required but not verified, redirect to verification page
      if (!isEmailVerified()) {
        navigate("/verify-email", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, isEmailVerified, navigate]);

  const password = watch("password");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError("");

    try {
      // Prepare user data
      const userData = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };

      const result = await registerUser(userData);

      if (result.success) {
        if (result.needsVerification) {
          // If OTP is returned for testing, show it
          if (result.otp) {
            // Store OTP in session storage for testing purposes
            sessionStorage.setItem("testOTP", result.otp);
          }
          // Redirect to email verification page
          navigate("/verify-email", { replace: true });
        } else {
          // Redirect to dashboard
          navigate("/user/dashboard", { replace: true });
        }
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16  max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create an Account
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                className={`w-full px-3 py-2 border ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="First name"
                {...register("firstName", {
                  required: "First name is required",
                  minLength: {
                    value: 2,
                    message: "First name must be at least 2 characters",
                  },
                })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className={`w-full px-3 py-2 border ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="Last name"
                {...register("lastName", {
                  required: "Last name is required",
                  minLength: {
                    value: 2,
                    message: "Last name must be at least 2 characters",
                  },
                })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className={`w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="Create a password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{6,}$/,
                  message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`w-full px-3 py-2 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="Confirm your password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                {...register("terms", {
                  required: "You must agree to the terms and conditions",
                })}
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700"
              >
                I agree to the{" "}
                <a
                  href="/terms"
                  className="text-green-600 hover:text-green-800"
                >
                  Terms and Conditions
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-xs mt-1">
                {errors.terms.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50"
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-600 hover:text-green-800 font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
