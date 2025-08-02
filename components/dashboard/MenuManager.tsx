'use client';

import { useState, useEffect } from 'react';
import { MenuUploadClient } from '@/utils/menu-upload-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Trash2, Edit, AlertCircle } from 'lucide-react';

export default function MenuManager() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    setLoading(true);
    const result = await MenuUploadClient.getMenuItems();
    if (result.success && result.items) {
      setMenuItems(result.items);
    }
    setLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const result = await MenuUploadClient.uploadMenu(file, false);
    setUploading(false);

    if (result.success) {
      await loadMenuItems();
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const clearMenu = async () => {
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
            
            {uploading && (
              <div className="text-center text-sm text-gray-500">
                Extracting menu items from image...
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
                  className="text-red-600 border-red-200 hover:bg-red-50"
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
                  {items.map((item, index) => (
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
    </div>
  );
}