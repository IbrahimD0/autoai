'use client';

import { useState, useEffect } from 'react';
import { MenuUploadClient } from '@/utils/menu-upload-client';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Upload, Trash2, Edit, AlertCircle, ExternalLink, Loader2, CheckCircle, FileImage, Sparkles } from 'lucide-react';
import ShopSetupDialog from './ShopSetupDialog';
import { useRouter } from 'next/navigation';

export default function MenuManager() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showShopSetup, setShowShopSetup] = useState(false);
  const [shopSlug, setShopSlug] = useState<string | null>(null);
  const [pendingMenuItems, setPendingMenuItems] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{
    stage: 'idle' | 'uploading' | 'processing' | 'extracting' | 'complete' | 'error';
    message: string;
    progress: number;
  }>({ stage: 'idle', message: '', progress: 0 });
  const router = useRouter();

  useEffect(() => {
    loadMenuItems();
    loadShopData();
  }, []);

  const loadMenuItems = async () => {
    setLoading(true);
    const result = await MenuUploadClient.getMenuItems();
    if (result.success && result.items) {
      setMenuItems(result.items);
    }
    setLoading(false);
  };

  const loadShopData = async () => {
    try {
      const response = await fetch('/api/shop/data');
      if (response.ok) {
        const data = await response.json();
        if (data.shop) {
          setShopSlug(data.shop.slug);
        }
      }
    } catch (error) {
      console.error('Error loading shop data:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress({ stage: 'uploading', message: 'Uploading image...', progress: 20 });

    // Simulate progress stages
    setTimeout(() => {
      setUploadProgress({ stage: 'processing', message: 'Enhancing image quality...', progress: 40 });
    }, 500);

    setTimeout(() => {
      setUploadProgress({ stage: 'extracting', message: 'AI is reading menu items, prices, and descriptions...', progress: 60 });
    }, 1500);

    try {
      const result = await MenuUploadClient.uploadMenu(file, false);
      
      if (result.success && result.items) {
        setUploadProgress({ stage: 'complete', message: `Found ${result.items.length} menu items!`, progress: 100 });
        setPendingMenuItems(result.items);
        setMenuItems(result.items);
        
        // Only show shop setup if we don't have a shop yet
        if (result.requiresShopSetup || !shopSlug) {
          setTimeout(() => {
            setShowShopSetup(true);
            setUploadProgress({ stage: 'idle', message: '', progress: 0 });
          }, 1500);
        } else {
          setTimeout(() => {
            setUploadProgress({ stage: 'idle', message: '', progress: 0 });
          }, 2000);
        }
      } else {
        setUploadProgress({ stage: 'error', message: result.error || 'Failed to extract menu items', progress: 0 });
        setTimeout(() => {
          setUploadProgress({ stage: 'idle', message: '', progress: 0 });
        }, 3000);
      }
    } catch (error) {
      setUploadProgress({ stage: 'error', message: 'An error occurred while processing your menu', progress: 0 });
      setTimeout(() => {
        setUploadProgress({ stage: 'idle', message: '', progress: 0 });
      }, 3000);
    } finally {
      setUploading(false);
    }
  };

  const handleShopSubmit = async (shopData: any) => {
    try {
      const response = await fetch('/api/shop/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shopData,
          menuItems: pendingMenuItems
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setShopSlug(data.shop.slug);
        setShowShopSetup(false);
        setPendingMenuItems([]);
        await loadMenuItems();
        await loadShopData();
      } else {
        const error = await response.json();
        alert(`Error creating shop: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating shop:', error);
      alert('Failed to create shop. Please try again.');
    }
  };

  const clearMenu = async () => {
    if (!shopSlug) {
      // If no shop exists, just clear the local state
      if (confirm('Are you sure you want to clear all menu items?')) {
        setMenuItems([]);
        setPendingMenuItems([]);
      }
      return;
    }
    
    if (confirm('Are you sure you want to clear all menu items?')) {
      try {
        const response = await fetch('/api/menu/extract', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageBase64: '',
            clearExisting: true
          }),
        });
        
        if (response.ok) {
          setMenuItems([]);
          await loadMenuItems();
        }
      } catch (error) {
        console.error('Error clearing menu:', error);
      }
    }
  };

  const groupByCategory = (items: any[]) => {
    return items.reduce((acc, item) => {
      const category = item.category || 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {} as Record<string, any[]>);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading menu items...</div>
      </div>
    );
  }

  const categorizedItems = groupByCategory(menuItems);

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <label htmlFor="menu-upload" className="cursor-pointer">
                  <span className="text-amber-600 hover:text-amber-700 font-medium">
                    Click to upload
                  </span>
                  <span className="text-gray-600"> or drag and drop</span>
                </label>
                <p className="text-sm text-gray-500">
                  PNG, JPG or PDF up to 10MB
                </p>
                <input
                  id="menu-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </div>
            </div>
            
            {uploading && uploadProgress.stage !== 'idle' && (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center space-y-3">
                  {uploadProgress.stage === 'uploading' && (
                    <FileImage className="h-10 w-10 text-amber-500 animate-pulse" />
                  )}
                  {uploadProgress.stage === 'processing' && (
                    <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
                  )}
                  {uploadProgress.stage === 'extracting' && (
                    <Sparkles className="h-10 w-10 text-amber-500 animate-pulse" />
                  )}
                  {uploadProgress.stage === 'complete' && (
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  )}
                  {uploadProgress.stage === 'error' && (
                    <AlertCircle className="h-10 w-10 text-red-500" />
                  )}
                  
                  <p className={`text-sm font-medium ${
                    uploadProgress.stage === 'complete' ? 'text-green-600' : 
                    uploadProgress.stage === 'error' ? 'text-red-600' : 
                    'text-gray-700'
                  }`}>
                    {uploadProgress.message}
                  </p>
                  
                  {uploadProgress.stage === 'extracting' && (
                    <p className="text-xs text-gray-500 animate-pulse">
                      This usually takes 5-15 seconds depending on menu complexity
                    </p>
                  )}
                  
                  {uploadProgress.stage !== 'complete' && uploadProgress.stage !== 'error' && (
                    <div className="w-full max-w-xs">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 ease-out"
                          style={{ width: `${uploadProgress.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {menuItems.length > 0 && (
              <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  {menuItems.length} items in your menu
                </p>
                <Button
                  onClick={clearMenu}
                  variant="outline"
                  size="sm"
                  className="!text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Menu
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Menu Items Display */}
      {menuItems.length > 0 && (
        <div className="space-y-4">
          {Object.entries(categorizedItems).map(([category, items]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg capitalize">
                  {category.replace(/_/g, ' ')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(items as any[]).map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          {item.seasonal && (
                            <Badge variant="secondary" className="text-xs">
                              Seasonal
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        )}
                        {item.allergens && item.allergens.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <AlertCircle className="h-3 w-3 text-amber-600" />
                            <p className="text-xs text-gray-500">
                              Contains: {item.allergens.join(', ')}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-gray-900">
                          ${item.price.toFixed(2)}
                        </p>
                        <div className="flex gap-1 mt-2">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {menuItems.length === 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <AlertCircle className="h-8 w-8 text-amber-600 mx-auto" />
              <h3 className="font-medium text-gray-900">No menu items yet</h3>
              <p className="text-sm text-gray-600">
                Upload a photo of your menu to get started
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shop Link */}
      {shopSlug && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Your Shop is Live!</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Your shop page is available at:
                </p>
                <a
                  href={`/${shopSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center gap-1 mt-2"
                >
                  {window.location.origin}/{shopSlug}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <Button
                onClick={() => window.open(`/${shopSlug}`, '_blank')}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
              >
                View Shop
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shop Setup Dialog */}
      <ShopSetupDialog
        isOpen={showShopSetup}
        onClose={() => {
          setShowShopSetup(false);
          setPendingMenuItems([]);
        }}
        onSubmit={handleShopSubmit}
      />
    </div>
  );
}