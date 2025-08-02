import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Shop, MenuItem } from '@/types/shop';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to create a shop' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { shopData, menuItems } = body;

    // Check if user already has a shop
    const { data: existingShop } = await supabase
      .from('shops')
      .select('*')
      .eq('user_id', user.id)
      .single();

    let shop: Shop;

    if (existingShop) {
      // Update existing shop
      const { data: updatedShop, error: updateError } = await supabase
        .from('shops')
        .update({
          ...shopData,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingShop.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      shop = updatedShop;

      // Delete existing menu items
      await supabase
        .from('menu_items')
        .delete()
        .eq('shop_id', shop.id);
    } else {
      // Create new shop
      const { data: newShop, error: createError } = await supabase
        .from('shops')
        .insert({
          user_id: user.id,
          ...shopData
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      shop = newShop;
    }

    // Insert menu items
    if (menuItems && menuItems.length > 0) {
      const itemsToInsert = menuItems.map((item: any, index: number) => ({
        shop_id: shop.id,
        name: item.name,
        price: item.price,
        description: item.description,
        category: item.category,
        size: item.size,
        allergens: item.allergens || [],
        available: item.available !== false,
        seasonal: item.seasonal || false,
        sort_order: index
      }));

      const { error: menuError } = await supabase
        .from('menu_items')
        .insert(itemsToInsert);

      if (menuError) {
        throw menuError;
      }
    }

    return NextResponse.json({
      success: true,
      shop: shop,
      message: 'Shop created/updated successfully'
    });

  } catch (error) {
    console.error('Shop creation error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create shop',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}