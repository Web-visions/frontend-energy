import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-hot-toast";
import API from "../utils/api";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { resettoken } = useParams();
  const watchedPassword = watch("password");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (formValues) => {
    setIsSubmitting(true);
    try {
      const response = await API.put(`/auth/reset-password/${resettoken}`, {
        password: formValues.password,
      });
      if (response.status === 200) {
        toast.success("Password reset successfully!");
        navigate("/login");
      } else {
        toast.error("Failed to reset password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        <p className="text-gray-600 mb-6 text-center">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              New Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className={`w-full px-3 py-2 pr-10 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter new password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className={`w-full px-3 py-2 pr-10 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Confirm new password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watchedPassword || "Passwords do not match",
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-500"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out disabled:opacity-50"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
