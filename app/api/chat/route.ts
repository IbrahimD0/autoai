import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { processChat, ChatMessage } from '@/utils/ai/chocolate-assistant';
import { FileMenuStorage } from '@/utils/storage/menu-storage';

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user (still using Supabase for auth only)
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to use the chat' },
        { status: 401 }
      );
    }

    // Get menu items from file storage
    const menuItems = FileMenuStorage.getMenuItems(user.id);
    
    if (menuItems.length === 0) {
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
    const shopName = user.email?.split('@')[0] || 'My Shop';
    const shopAddress = 'your location'; // Default for MVP
    
    const { response, orderDetails } = await processChat(
      messages,
      shopName,
      shopAddress,
      menuItems as any // Cast to match expected type
    );

    // If order was extracted, just return it (no database save for now)
    if (orderDetails && orderDetails.customerName && orderDetails.customerPhone) {
      // Calculate total if not provided
      if (!orderDetails.totalAmount) {
        orderDetails.totalAmount = orderDetails.items.reduce(
          (sum, item) => sum + (item.price * item.quantity),
          0
        );
      }

      return NextResponse.json({
        response,
        orderDetails,
        message: 'Order details extracted successfully!'
      });
    }

    return NextResponse.json({ response });

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
      return NextResponse.json(
        { available: false, reason: 'Not authenticated' },
        { status: 401 }
      );
    }

    const shopName = user.email?.split('@')[0] || 'My Shop';
    const hasMenuItems = FileMenuStorage.hasMenuItems(user.id);
    const menuItemCount = FileMenuStorage.getMenuItems(user.id).length;
    
    return NextResponse.json({
      available: hasMenuItems,
      shopName: shopName,
      menuItemCount: menuItemCount,
      reason: !hasMenuItems ? 'No menu items uploaded' : null
    });

  } catch (error) {
    console.error('Chat availability check error:', error);
    return NextResponse.json(
      { available: false, reason: 'System error' },
      { status: 500 }
    );
  }
}