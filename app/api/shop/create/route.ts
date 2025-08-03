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
    
    // Validate required fields
    if (!shopData || !shopData.name) {
      return NextResponse.json(
        { error: 'Shop name is required' },
        { status: 400 }
      );
    }
    
    // Generate slug from shop name if not provided
    if (!shopData.slug && shopData.name) {
      let baseSlug = shopData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50); // Limit slug length
      
      // Ensure slug is unique
      let slug = baseSlug;
      let counter = 1;
      
      while (true) {
        const { data: existingSlug } = await supabase
          .from('shops')
          .select('slug')
          .eq('slug', slug)
          .single();
          
        if (!existingSlug) {
          shopData.slug = slug;
          break;
        }
        
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Check if user already has a shop
    const { data: existingShop } = await supabase
      .from('shops')
      .select('*')
      .eq('user_id', user.id)
      .single();

    let shop: Shop;

    if (existingShop) {
      // Keep existing slug if updating
      if (!shopData.slug) {
        shopData.slug = existingShop.slug;
      }
      
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
        console.error('Shop update error:', updateError);
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
        console.error('Shop creation error:', createError);
        // If slug conflict, provide helpful error message
        if (createError.code === '23505' && createError.message.includes('slug')) {
          throw new Error('This shop name is already taken. Please choose a different name.');
        }
        throw createError;
      }

      shop = newShop;
    }

    // Insert menu items
    if (menuItems && menuItems.length > 0) {
      // Handle duplicate names by making them unique
      const nameCount: Record<string, number> = {};
      
      const itemsToInsert = menuItems.map((item: any, index: number) => {
        let uniqueName = item.name;
        
        // If we've seen this name before, append a number
        if (nameCount[item.name]) {
          nameCount[item.name]++;
          uniqueName = `${item.name} (${nameCount[item.name]})`;
        } else {
          nameCount[item.name] = 1;
        }
        
        return {
          shop_id: shop.id,
          name: uniqueName,
          price: item.price,
          description: item.description,
          category: item.category,
          size: item.size,
          allergens: item.allergens || [],
          available: item.available !== false,
          seasonal: item.seasonal || false,
          sort_order: index
        };
      });

      const { error: menuError } = await supabase
        .from('menu_items')
        .insert(itemsToInsert);

      if (menuError) {
        console.error('Menu items insertion error:', menuError);
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