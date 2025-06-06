import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { verifyEmail, resendOTP, currentUser, isEmailVerified } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [testOTP, setTestOTP] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || '/dashboard';
  
  // Redirect if already verified
  useEffect(() => {
    if (isEmailVerified()) {
      navigate(redirectPath, { replace: true });
    }
  }, [isEmailVerified, navigate, redirectPath]);
  
  // Check for test OTP in sessionStorage
  useEffect(() => {
    const storedOTP = sessionStorage.getItem('testOTP');
    if (storedOTP) {
      setTestOTP(storedOTP);
      setValue('otp', storedOTP);
      setMessage('Test OTP has been auto-filled for development purposes.');
      // Remove the OTP from sessionStorage after using it
      sessionStorage.removeItem('testOTP');
    }
  }, [setValue]);
  
  // Handle countdown for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');
    setMessage('');
    
    try {
      const result = await verifyEmail(data.otp);
      
      if (result.success) {
        setMessage('Email verified successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError(result.error || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResendOTP = async () => {
    setResendDisabled(true);
    setCountdown(60); // 60 seconds cooldown
    setError('');
    setMessage('');
    
    try {
      const result = await resendOTP();
      
      if (result.success) {
        setMessage(result.message || 'OTP has been resent to your email.');
      } else {
        setError(result.error || 'Failed to resend OTP. Please try again later.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Verify Your Email</h2>
        
        <p className="text-gray-600 mb-6 text-center">
          We've sent a verification code to your email address. Please enter the code below to verify your account.
        </p>
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
          <div className="mb-4">
            <label htmlFor="otp" className="block text-gray-700 text-sm font-bold mb-2">
              Verification Code
            </label>
            <input
              id="otp"
              type="text"
              className={`w-full px-3 py-2 border ${errors.otp ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter 6-digit code"
              {...register('otp', { 
                required: 'Verification code is required',
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: 'Please enter a valid 6-digit code'
                }
              })}
            />
            {testOTP && (
              <p className="text-green-500 text-xs mt-1">Test OTP: {testOTP}</p>
            )}
            {errors.otp && (
              <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>
            )}
          </div>
          
          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying...' : 'Verify Email'}
            </button>
            
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendDisabled}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50"
            >
              {resendDisabled 
                ? `Resend Code (${countdown}s)` 
                : 'Resend Verification Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;