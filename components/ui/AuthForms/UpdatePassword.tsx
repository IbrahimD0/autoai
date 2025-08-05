'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { updatePassword } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

interface UpdatePasswordProps {
  redirectMethod: string;
}

export default function UpdatePassword({
  redirectMethod
}: UpdatePasswordProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const passwordRequirements = [
    { met: password.length >= 6, text: 'At least 6 characters' },
    { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { met: /[a-z]/.test(password), text: 'One lowercase letter' },
    { met: /[0-9]/.test(password), text: 'One number' },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const passwordConfirm = formData.get('passwordConfirm') as string;
    
    if (password !== passwordConfirm) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setPasswordError('');
    setIsSubmitting(true);
    await handleRequest(e, updatePassword, router);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <form
        noValidate={true}
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="space-y-5">
          <div className="relative">
            <Input
              label="New Password"
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
              label="Confirm New Password"
              id="passwordConfirm"
              name="passwordConfirm"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              autoComplete="new-password"
              className="text-gray-900"
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
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            loading={isSubmitting}
            disabled={passwordRequirements.some(req => !req.met)}
          >
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
