import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { extractMenuFromImage } from '@/utils/ai/menu-extraction';

export const maxDuration = 30; // Allow 30 seconds for AI processing

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
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

    // Check if user has a shop (but don't fail if they don't)
    const { data: shop, error: shopError } = await supabase
      .from('shops')
      .select('id')
      .eq('user_id', user.id)
      .single();

    // Optional: Clear existing menu items before upload
    if (clearExisting && shop) {
      const { error: deleteError } = await supabase
        .from('menu_items')
        .delete()
        .eq('shop_id', shop.id);

      if (deleteError) {
        console.error('Error clearing menu items:', deleteError);
      }
      
      // If only clearing without new upload
      if (!imageBase64 || imageBase64 === '') {
        return NextResponse.json({
          success: true,
          message: 'Menu cleared successfully',
          items: [],
          shopId: shop.id
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

    // If no shop exists, return extracted items without saving
    if (!shop) {
      return NextResponse.json({
        success: true,
        message: `Successfully extracted ${extractedItems.length} menu items`,
        items: extractedItems,
        shopId: null,
        requiresShopSetup: true
      });
    }

    // Prepare items for database insertion
    const itemsToInsert = extractedItems.map(item => ({
      shop_id: shop.id,
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      size: item.size,
      allergens: item.allergens,
      available: item.available ?? true,
      seasonal: item.seasonal ?? false,
      sort_order: 0
    }));

    // Insert items into database
    const { data: insertedItems, error: insertError } = await supabase
      .from('menu_items')
      .insert(itemsToInsert)
      .select();

    if (insertError) {
      console.error('Error inserting menu items:', insertError);
      throw new Error('Failed to save menu items to database');
    }

    return NextResponse.json({
      success: true,
      message: `Successfully extracted ${extractedItems.length} menu items`,
      items: insertedItems || extractedItems,
      shopId: shop.id
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

    // Get user's shop
    const { data: shop, error: shopError } = await supabase
      .from('shops')
      .select('id, name')
      .eq('user_id', user.id)
      .single();

    if (shopError || !shop) {
      return NextResponse.json({
        success: true,
        items: [],
        shopId: null,
        shopName: 'My Shop'
      });
    }

    // Get menu items from database
    const { data: items, error: itemsError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('shop_id', shop.id)
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (itemsError) {
      console.error('Error fetching menu items:', itemsError);
      throw new Error('Failed to fetch menu items');
    }

    return NextResponse.json({
      success: true,
      items: items || [],
      shopId: shop.id,
      shopName: shop.name
    });

  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}