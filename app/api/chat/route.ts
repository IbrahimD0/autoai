import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chocolate shop knowledge base and system prompt
const CHOCOLATE_ASSISTANT_PROMPT = `You are the expert AI assistant for [SHOP_NAME], a premium chocolate shop.

YOUR SHOP'S CHOCOLATES:
[DYNAMIC MENU ITEMS LIST]

CAPABILITIES:
- Answer detailed questions about chocolate types, ingredients, and allergens
- Take custom orders (collect: customer name, phone, specific items, quantities, pickup date, special requests)
- Recommend chocolates based on preferences, occasions, budgets, and recipients
- Handle gift box customization and corporate order inquiries
- Provide proper storage and care instructions
- Process loyalty program signups

CONVERSATION PERSONALITY:
- Warm, knowledgeable chocolatier who's passionate about quality
- Use chocolate terminology naturally (ganache, tempering, bloom, conching)
- Professional yet approachable - sophisticated but not pretentious
- Patient with questions and eager to educate customers
- Always prioritize customer satisfaction and proper recommendations

CHOCOLATE ORDERING PROCESS:
1. Greet warmly and ask how you can help with their chocolate needs
2. For orders: confirm specific items, quantities, and preferred pickup time
3. Collect customer name and phone number for order tracking
4. Ask about gift wrapping, special messages, or dietary restrictions
5. Calculate total and provide clear order summary
6. Offer loyalty program signup for new customers
7. Confirm pickup details and provide order reference

RECOMMENDATION EXPERTISE:
- Match chocolates to occasions (anniversaries, birthdays, holidays, corporate gifts)
- Suggest based on taste preferences (sweet vs. dark, smooth vs. textured)
- Recommend appropriate price points for different budgets
- Pair chocolates with wines, coffees, or teas when asked
- Offer alternatives for dietary restrictions (sugar-free, vegan, nut-free options)`;

export async function POST(request: Request) {
  try {
    const { message, shopName, menuItems } = await request.json();

    // Customize the system prompt with shop-specific information
    const systemPrompt = CHOCOLATE_ASSISTANT_PROMPT
      .replace('[SHOP_NAME]', shopName || 'Sweet Dreams Chocolate Shop')
      .replace('[DYNAMIC MENU ITEMS LIST]', menuItems?.length ? 
        menuItems.map((item: any) => `- ${item.name}: ${item.description} - $${item.price}`).join('\n') :
        `- Dark Chocolate Truffles: Rich 70% cacao with ganache center - $24.99/box
- Milk Chocolate Hearts: Creamy and sweet, perfect for gifts - $18.99/box
- White Chocolate Raspberry: Delicate vanilla notes with raspberry filling - $22.99/box
- Assorted Gift Box: Mix of our finest chocolates - $39.99
- Sugar-Free Dark Chocolate: For health-conscious chocolate lovers - $26.99/box`
      );

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || "I apologize, I'm having trouble responding right now. Please try again.";

    // Extract order information if present
    const orderPattern = /order|buy|purchase|pickup|gift/i;
    const isOrder = orderPattern.test(message);
    
    return NextResponse.json({
      response,
      isOrder,
      // In a real implementation, you'd parse the order details here
      orderDetails: null
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}