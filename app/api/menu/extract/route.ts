import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { extractMenuFromImage } from '@/utils/ai/menu-extraction';
import { FileMenuStorage } from '@/utils/storage/menu-storage';

export const maxDuration = 30; // Allow 30 seconds for AI processing

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user (still using Supabase for auth only)
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to upload a menu' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { imageBase64, clearExisting = false } = body;

    // Optional: Clear existing menu items before upload
    if (clearExisting) {
      FileMenuStorage.clearMenuItems(user.id);
      
      // If only clearing without new upload
      if (!imageBase64 || imageBase64 === '') {
        return NextResponse.json({
          success: true,
          message: 'Menu cleared successfully',
          items: [],
          shopId: user.id
        });
      }
    }

    // Check if image is provided for extraction
    if (!imageBase64) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Extract menu items using AI
    const extractedItems = await extractMenuFromImage(imageBase64);

    // Save to file storage (no database needed!)
    FileMenuStorage.saveMenuItems(user.id, extractedItems);

    return NextResponse.json({
      success: true,
      message: `Successfully extracted ${extractedItems.length} menu items`,
      items: extractedItems,
      shopId: user.id
    });

  } catch (error) {
    console.error('Menu extraction error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to extract menu',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve menu items
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to view menu items' },
        { status: 401 }
      );
    }

    // Get menu items from file storage
    const items = FileMenuStorage.getMenuItems(user.id);
    const shopName = user.email?.split('@')[0] || 'My Shop';

    return NextResponse.json({
      success: true,
      items: items,
      shopId: user.id,
      shopName: shopName
    });

  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}