'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/Input';
import { 
  Building2, 
  Clock, 
  Mail, 
  MapPin, 
  Phone, 
  Tag,
  Facebook,
  Instagram,
  Twitter,
  X 
} from 'lucide-react';

interface ShopData {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  social_media: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

interface ShopSetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (shopData: ShopData) => void;
  initialData?: Partial<ShopData>;
}

export default function ShopSetupDialog({ isOpen, onClose, onSubmit, initialData }: ShopSetupDialogProps) {
  const [shopData, setShopData] = useState<ShopData>({
    name: initialData?.name || '',
    tagline: initialData?.tagline || '',
    description: initialData?.description || '',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    hours: initialData?.hours || '',
    social_media: {
      facebook: initialData?.social_media?.facebook || '',
      instagram: initialData?.social_media?.instagram || '',
      twitter: initialData?.social_media?.twitter || ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(shopData);
  };

  const updateField = (field: keyof ShopData, value: string) => {
    setShopData(prev => ({ ...prev, [field]: value }));
  };

  const updateSocialMedia = (platform: keyof ShopData['social_media'], value: string) => {
    setShopData(prev => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [platform]: value
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Set Up Your Shop</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                Basic Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Shop Name *
                </label>
                <Input
                  type="text"
                  value={shopData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="e.g., Artisan Coffee & Bistro"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tagline
                </label>
                <Input
                  type="text"
                  value={shopData.tagline}
                  onChange={(e) => updateField('tagline', e.target.value)}
                  placeholder="e.g., Where Every Cup Tells a Story"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={shopData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Tell customers about your shop..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-800 dark:text-white"
                  rows={3}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-600" />
                Contact Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <Input
                  type="text"
                  value={shopData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="e.g., 123 Main Street, Downtown, City 12345"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    value={shopData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="e.g., (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={shopData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="e.g., hello@yourshop.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hours
                </label>
                <Input
                  type="text"
                  value={shopData.hours}
                  onChange={(e) => updateField('hours', e.target.value)}
                  placeholder="e.g., Mon-Fri: 7AM-8PM, Sat-Sun: 8AM-9PM"
                />
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Social Media (Optional)
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Facebook className="w-5 h-5 text-blue-600" />
                  <Input
                    type="url"
                    value={shopData.social_media.facebook}
                    onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Instagram className="w-5 h-5 text-pink-600" />
                  <Input
                    type="url"
                    value={shopData.social_media.instagram}
                    onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                    placeholder="https://instagram.com/yourpage"
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Twitter className="w-5 h-5 text-blue-400" />
                  <Input
                    type="url"
                    value={shopData.social_media.twitter}
                    onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                    placeholder="https://twitter.com/yourpage"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600"
              >
                Continue
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}