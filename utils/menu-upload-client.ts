// Client-side utility for menu upload
// This can be easily integrated into any UI component

interface MenuUploadResult {
  success: boolean;
  message?: string;
  items?: any[];
  error?: string;
}

export class MenuUploadClient {
  // Convert File to base64
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove data:image/xxx;base64, prefix
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  }

  // Upload menu image and extract items
  static async uploadMenu(
    imageFile: File,
    clearExisting: boolean = false
  ): Promise<MenuUploadResult> {
    try {
      // Validate file type
      if (!imageFile.type.startsWith('image/')) {
        return {
          success: false,
          error: 'Please upload an image file'
        };
      }

      // Validate file size (max 10MB)
      if (imageFile.size > 10 * 1024 * 1024) {
        return {
          success: false,
          error: 'Image size must be less than 10MB'
        };
      }

      // Convert to base64
      const imageBase64 = await this.fileToBase64(imageFile);

      // Send to API
      const response = await fetch('/api/menu/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64,
          clearExisting
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to extract menu'
        };
      }

      return data;
    } catch (error) {
      console.error('Menu upload error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  // Get current menu items
  static async getMenuItems(): Promise<MenuUploadResult> {
    try {
      const response = await fetch('/api/menu/extract', {
        method: 'GET',
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch menu items'
        };
      }

      return data;
    } catch (error) {
      console.error('Error fetching menu:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }
}

// Example usage in a React component:
/*
import { MenuUploadClient } from '@/utils/menu-upload-client';

function MenuUploadComponent() {
  const [uploading, setUploading] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const result = await MenuUploadClient.uploadMenu(file, false);
    setUploading(false);

    if (result.success) {
      alert(`Successfully extracted ${result.items.length} menu items!`);
      setMenuItems(result.items);
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileSelect}
        disabled={uploading}
      />
      {uploading && <p>Extracting menu items...</p>}
      {menuItems.length > 0 && (
        <ul>
          {menuItems.map((item, i) => (
            <li key={i}>{item.name} - ${item.price}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
*/