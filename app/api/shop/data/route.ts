import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in' },
        { status: 401 }
      );
    }

    // Get user's shop
    const { data: shop, error: shopError } = await supabase
      .from('shops')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (shopError && shopError.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw shopError;
    }

    return NextResponse.json({
      success: true,
      shop: shop || null
    });

  } catch (error) {
    console.error('Error fetching shop data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shop data' },
      { status: 500 }
    );
  }
}