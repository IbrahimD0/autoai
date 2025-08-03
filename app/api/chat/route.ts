import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { processChat, ChatMessage } from '@/utils/ai/chocolate-assistant';

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to use the chat' },
        { status: 401 }
      );
    }

    // Get user's shop
    const { data: shop, error: shopError } = await supabase
      .from('shops')
      .select('id, name, address')
      .eq('user_id', user.id)
      .single();

    if (shopError || !shop) {
      return NextResponse.json(
        { error: 'You must create a shop first' },
        { status: 400 }
      );
    }

    // Get menu items from database
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('shop_id', shop.id)
      .eq('available', true);

    if (menuError) {
      console.error('Error fetching menu items:', menuError);
      throw new Error('Failed to fetch menu items');
    }
    
    if (!menuItems || menuItems.length === 0) {
      return NextResponse.json(
        { error: 'No menu items found. Please upload a menu first.' },
        { status: 400 }
      );
    }

    // Parse request body
    const { messages }: { messages: ChatMessage[] } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Process chat with AI
    const shopName = shop.name || user.email?.split('@')[0] || 'My Shop';
    const shopAddress = shop.address || 'your location';
    
    const { response, orderDetails } = await processChat(
      messages,
      shopName,
      shopAddress,
      menuItems
    );

    // Return the response
    return NextResponse.json({
      response,
      orderDetails
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to process chat',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check chat availability
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ available: false });
    }

    // Check if user has a shop with menu items
    const { data: shop } = await supabase
      .from('shops')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!shop) {
      return NextResponse.json({ available: false });
    }

    const { count } = await supabase
      .from('menu_items')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shop.id);

    return NextResponse.json({ 
      available: (count || 0) > 0,
      itemCount: count || 0
    });

  } catch (error) {
    console.error('Error checking chat availability:', error);
    return NextResponse.json({ available: false });
  }
}