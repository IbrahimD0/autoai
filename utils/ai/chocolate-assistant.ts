import OpenAI from 'openai';
import { MenuItem } from '@/types/shop';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface OrderDetails {
  customerName?: string;
  customerPhone?: string;
  items: Array<{
    itemId: string;
    itemName: string;
    quantity: number;
    price: number;
    specialRequests?: string;
  }>;
  pickupTime?: string;
  giftWrapping?: boolean;
  giftMessage?: string;
  notes?: string;
  totalAmount?: number;
}

// Generate system prompt for the restaurant assistant
export function generateSystemPrompt(
  shopName: string,
  shopAddress: string,
  menuItems: MenuItem[],
  businessHours?: any,
  aiPersonality?: string
): string {
  // Group items by category for better organization
  const menuByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Format menu for the prompt
  let menuText = 'CURRENT MENU:\n\n';
  for (const [category, items] of Object.entries(menuByCategory)) {
    menuText += `${formatCategoryName(category)}:\n`;
    for (const item of items) {
      menuText += `- ${item.name}: $${item.price}`;
      if (item.description) menuText += ` - ${item.description}`;
      if (!item.available) menuText += ' (CURRENTLY UNAVAILABLE)';
      if (item.allergens?.length) menuText += ` [Contains: ${item.allergens.join(', ')}]`;
      menuText += '\n';
    }
    menuText += '\n';
  }

  const systemPrompt = `You are the expert AI assistant for ${shopName}, a restaurant located at ${shopAddress}.

${menuText}

CAPABILITIES:
- Answer detailed questions about menu items, ingredients, and allergens
- Take orders (collect: customer name, phone, specific items, quantities, pickup/delivery time, special requests)
- Recommend dishes based on preferences, dietary restrictions, and budgets
- Handle special dietary requests (vegetarian, vegan, gluten-free, etc.)
- Provide information about portion sizes and preparation methods
- Process reservations and special event inquiries

CONVERSATION PERSONALITY:
${aiPersonality || `- Warm, knowledgeable, and passionate about good food
- Professional yet friendly and approachable
- Patient with questions and happy to make recommendations
- Eager to ensure customer satisfaction
- Always prioritize dietary restrictions and allergen information`}

ORDERING PROCESS:
1. Greet warmly and ask how you can help
2. For orders: confirm specific items, quantities, and preferred pickup/delivery time
3. Collect customer name and phone number for order tracking
4. Ask about any dietary restrictions or special requests
5. Calculate total and provide clear order summary
6. Confirm order details and provide reference number
7. Thank them and provide pickup/delivery instructions

IMPORTANT RULES:
- Only recommend items that are marked as available
- Always mention allergens when relevant
- Be clear about pricing and portions
- If an item is unavailable, suggest alternatives
- For pickup times, suggest realistic timeframes (at least 30 minutes from now)
- Always be helpful and maintain the restaurant's reputation

When taking orders, format the order details clearly and collect all necessary information.`;

  return systemPrompt;
}

// Process chat messages and extract order details if present
export async function processChat(
  messages: ChatMessage[],
  shopName: string,
  shopAddress: string,
  menuItems: MenuItem[]
): Promise<{
  response: string;
  orderDetails?: OrderDetails;
}> {
  try {
    const systemPrompt = generateSystemPrompt(shopName, shopAddress, menuItems);
    
    // Add order extraction instruction for the last message
    const messagesWithSystem = [
      { role: 'system' as const, content: systemPrompt },
      ...messages
    ];

    // If the last message might contain an order, add extraction instruction
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.role === 'user' && 
        (lastUserMessage.content.toLowerCase().includes('order') ||
         lastUserMessage.content.toLowerCase().includes('buy') ||
         lastUserMessage.content.toLowerCase().includes('pick up'))) {
      
      messagesWithSystem.push({
        role: 'system' as const,
        content: `If the customer is placing an order, also provide the order details in this JSON format at the end of your response:
        
ORDER_JSON_START
{
  "customerName": "string",
  "customerPhone": "string",
  "items": [
    {
      "itemId": "menu_item_id",
      "itemName": "string",
      "quantity": number,
      "price": number,
      "specialRequests": "string"
    }
  ],
  "pickupTime": "ISO datetime string",
  "giftWrapping": boolean,
  "giftMessage": "string",
  "notes": "string",
  "totalAmount": number
}
ORDER_JSON_END`
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messagesWithSystem,
      temperature: 0.7,
      max_tokens: 1000
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // Extract order details if present
    let orderDetails: OrderDetails | undefined;
    const orderMatch = response.match(/ORDER_JSON_START\s*([\s\S]*?)\s*ORDER_JSON_END/);
    if (orderMatch) {
      try {
        orderDetails = JSON.parse(orderMatch[1]);
        // Clean the response by removing the JSON part
        const cleanResponse = response.replace(/ORDER_JSON_START[\s\S]*ORDER_JSON_END/, '').trim();
        return { response: cleanResponse, orderDetails };
      } catch (e) {
        console.error('Failed to parse order JSON:', e);
      }
    }

    return { response };
  } catch (error) {
    console.error('Chat processing error:', error);
    throw new Error('Failed to process chat message');
  }
}

// Helper function to format category names
function formatCategoryName(category: string): string {
  const names: Record<string, string> = {
    appetizer: 'Appetizers',
    main_course: 'Main Courses',
    dessert: 'Desserts',
    beverage: 'Beverages',
    side: 'Sides',
    special: 'Specials',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snacks',
    other: 'Other Items'
  };
  
  return names[category] || category;
}

// Generate a sample conversation for testing
export function generateSampleConversation(): ChatMessage[] {
  return [
    {
      role: 'user',
      content: 'Hi, I need some chocolates for my wife\'s birthday tomorrow'
    },
    {
      role: 'assistant',
      content: `Hello! How wonderful that you're choosing chocolates for your wife's birthday! I'd be delighted to help you find the perfect selection.

To help me recommend the best options, could you tell me:
- Does she prefer dark, milk, or white chocolate?
- Are there any flavors she particularly loves (like raspberry, caramel, or nuts)?
- Would you prefer an elegant gift box or individual selections?
- What's your budget range?

We have some beautiful options that would make a memorable birthday gift!`
    },
    {
      role: 'user',
      content: 'She loves dark chocolate, especially with fruit flavors. I\'d like a nice gift box, maybe around $40-50?'
    }
  ];
}