'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import React from 'react';
import Link from 'next/link';
import { signUp } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

// Define prop type with allowEmail boolean
interface SignUpProps {
  allowEmail: boolean;
  redirectMethod: string;
}

export default function SignUp({ allowEmail, redirectMethod }: SignUpProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const passwordRequirements = [
    { met: password.length >= 6, text: 'At least 6 characters' },
    { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { met: /[a-z]/.test(password), text: 'One lowercase letter' },
    { met: /[0-9]/.test(password), text: 'One number' },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (!agreedToTerms) {
      setPasswordError('Please agree to the terms of service');
      return;
    }
    
    setPasswordError('');
    setIsSubmitting(true);
    await handleRequest(e, signUp, router);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <form
        noValidate={true}
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="space-y-5">
          <Input
            label="Email Address"
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            className="text-gray-900"
            required
          />
          
          <div className="relative">
            <Input
              label="Password"
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              autoComplete="new-password"
              className="text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          
          {password && (
            <div className="space-y-2">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  {req.met ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-gray-300" />
                  )}
                  <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          <div className="relative">
            <Input
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              autoComplete="new-password"
              className="text-gray-900"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          
          {passwordError && (
            <p className="text-sm text-red-600">{passwordError}</p>
          )}
          
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 mt-1 text-amber-600 bg-white border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <span className="ml-2 text-sm text-gray-600">
              I agree to the{' '}
              <Link href="#" className="text-amber-600 hover:text-amber-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="text-amber-600 hover:text-amber-700">
                Privacy Policy
              </Link>
            </span>
          </label>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            loading={isSubmitting}
            disabled={!agreedToTerms || passwordRequirements.some(req => !req.met)}
          >
            Create Account
          </Button>
        </div>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Already have an account?</span>
        </div>
      </div>
      
      <div className="text-center">
        <Link 
          href="/signin/password_signin" 
          className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
        >
          Sign in instead
        </Link>
      </div>
    </div>
  );
}
