import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

// Define types for menu items
export interface MenuItem {
  id?: string;
  name: string;
  price: number;
  description?: string;
  category: ChocolateCategory;
  allergens?: string[];
  size?: string;
  available: boolean;
  seasonal?: boolean;
}

export type ChocolateCategory = 
  | 'appetizer'
  | 'main_course'
  | 'dessert'
  | 'beverage'
  | 'side'
  | 'special'
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack'
  | 'other';

// Category detection keywords
const categoryKeywords: Record<ChocolateCategory, string[]> = {
  appetizer: ['appetizer', 'starter', 'app', 'small plate', 'tapas', 'antipasti'],
  main_course: ['main', 'entree', 'entrée', 'dinner', 'meal', 'course'],
  dessert: ['dessert', 'sweet', 'cake', 'chocolate', 'ice cream', 'pie', 'pudding'],
  beverage: ['drink', 'beverage', 'coffee', 'tea', 'juice', 'soda', 'cocktail'],
  side: ['side', 'accompaniment', 'salad', 'soup', 'fries'],
  special: ['special', 'chef', 'daily', 'featured', 'seasonal'],
  breakfast: ['breakfast', 'brunch', 'morning', 'egg', 'pancake', 'waffle'],
  lunch: ['lunch', 'sandwich', 'wrap', 'burger'],
  dinner: ['dinner', 'evening', 'steak', 'pasta', 'seafood'],
  snack: ['snack', 'small', 'bite', 'finger food'],
  other: []
};

// Extract menu items from image using OpenAI Vision
export async function extractMenuFromImage(imageBase64: string): Promise<MenuItem[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Updated model - gpt-4-vision-preview is deprecated
      messages: [
        {
          role: "system",
          content: `You are an expert at analyzing restaurant and food menus. Extract ALL menu items from the image and return them in a structured JSON format.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this menu image THOROUGHLY and extract EVERY SINGLE food item listed.
              
              Instructions:
              1. Look at ALL sections of the menu (appetizers, specials, main courses, etc.)
              2. Extract EVERY item you can see, including duplicates
              3. If the menu has multiple columns or sections, extract from ALL of them
              4. Do not skip any items - I need the COMPLETE menu
              
              For each item, extract:
              - name (exactly as written on the menu)
              - price (convert to number, e.g., $10 becomes 10)
              - description (if available, otherwise null)
              - category (the section it belongs to, e.g., "appetizer", "special menu", "main course")
              - size/portion (if mentioned, otherwise null)
              - allergen information (if mentioned, otherwise empty array)
              
              The menu appears to have sections like:
              - Appetizer section
              - Special Menu section  
              - Main Course section
              - And possibly more
              
              Make sure to extract items from EVERY section you can see.
              
              Return the data as a JSON array of objects with these fields:
              {
                "name": "string",
                "price": number,
                "description": "string or null",
                "category": "string (section name)",
                "size": "string or null",
                "allergens": []
              }
              
              Important: This menu has MANY items (at least 15-20). Make sure you extract ALL of them.
              
              Return ONLY the JSON array, no other text or markdown formatting.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 4000,
      temperature: 0.1
    });

    const content = response.choices[0]?.message?.content || '[]';
    
    // Clean the response - remove markdown code blocks if present
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```\s*/, '').replace(/```\s*$/, '');
    }
    
    // Parse the JSON response
    let extractedItems: any[];
    try {
      extractedItems = JSON.parse(cleanContent);
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse menu items from AI response');
    }

    // Process and categorize each item
    const menuItems: MenuItem[] = extractedItems.map(item => ({
      name: item.name || 'Unnamed Item',
      price: parseFloat(item.price) || 0,
      description: item.description || undefined,
      category: item.category ? detectCategoryFromSection(item.category) : detectCategory(item.name, item.description),
      allergens: item.allergens || [],
      size: item.size || undefined,
      available: true,
      seasonal: detectSeasonal(item.name, item.description)
    }));

    return menuItems;
  } catch (error) {
    console.error('Error extracting menu from image:', error);
    throw new Error('Failed to extract menu items from image');
  }
}

// Detect category from section name in menu
function detectCategoryFromSection(section: string): ChocolateCategory {
  const sectionLower = section.toLowerCase();
  
  if (sectionLower.includes('appetizer') || sectionLower.includes('starter')) {
    return 'appetizer';
  } else if (sectionLower.includes('main') || sectionLower.includes('entree')) {
    return 'main_course';
  } else if (sectionLower.includes('special')) {
    return 'special';
  } else if (sectionLower.includes('dessert') || sectionLower.includes('sweet')) {
    return 'dessert';
  } else if (sectionLower.includes('beverage') || sectionLower.includes('drink')) {
    return 'beverage';
  } else if (sectionLower.includes('side')) {
    return 'side';
  } else if (sectionLower.includes('breakfast')) {
    return 'breakfast';
  } else if (sectionLower.includes('lunch')) {
    return 'lunch';
  } else if (sectionLower.includes('dinner')) {
    return 'dinner';
  }
  
  return 'other';
}

// Detect category based on name and description
function detectCategory(name: string, description?: string): ChocolateCategory {
  const text = `${name} ${description || ''}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category as ChocolateCategory;
    }
  }
  
  return 'other';
}

// Detect if item is seasonal
function detectSeasonal(name: string, description?: string): boolean {
  const text = `${name} ${description || ''}`.toLowerCase();
  const seasonalKeywords = ['seasonal', 'holiday', 'christmas', 'easter', 'valentine', 'summer', 'winter', 'spring', 'fall'];
  return seasonalKeywords.some(keyword => text.includes(keyword));
}

// Format menu items for display
export function formatMenuForDisplay(items: MenuItem[]): string {
  const categories = groupByCategory(items);
  let formatted = '';
  
  for (const [category, categoryItems] of Object.entries(categories)) {
    formatted += `\n${formatCategoryName(category as ChocolateCategory)}\n`;
    formatted += '─'.repeat(30) + '\n';
    
    for (const item of categoryItems) {
      formatted += `${item.name} - $${item.price.toFixed(2)}`;
      if (item.size) formatted += ` (${item.size})`;
      if (item.description) formatted += `\n  ${item.description}`;
      if (item.allergens && item.allergens.length > 0) {
        formatted += `\n  Contains: ${item.allergens.join(', ')}`;
      }
      formatted += '\n\n';
    }
  }
  
  return formatted;
}

// Group menu items by category
export function groupByCategory(items: MenuItem[]): Record<ChocolateCategory, MenuItem[]> {
  const grouped: Partial<Record<ChocolateCategory, MenuItem[]>> = {};
  
  for (const item of items) {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category]!.push(item);
  }
  
  return grouped as Record<ChocolateCategory, MenuItem[]>;
}

// Format category name for display
function formatCategoryName(category: ChocolateCategory): string {
  const names: Record<ChocolateCategory, string> = {
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