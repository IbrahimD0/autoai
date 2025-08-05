# AutoAI - AI-Powered Local Shop Websites

AutoAI is a platform that enables local shops and restaurants to create professional websites with AI-powered customer service in just 5 minutes.

## Features

- 🤖 **AI Chat Assistant** - Smart business assistant that knows your menu and takes custom orders
- 🌐 **Professional Website** - Beautiful, responsive website generated automatically
- 📸 **Menu Upload Magic** - Just photograph your menu, AI extracts all items
- 📊 **Order Management** - Built-in ordering system with customer tracking
- 🚀 **5-Minute Setup** - Go live in minutes, not weeks

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI**: OpenAI GPT-4 for chat and menu extraction
- **Payments**: Stripe integration (coming soon)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account
- OpenAI API key
- Stripe account (for payments - coming soon)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your API keys:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `OPENAI_API_KEY`

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── [shopname]/      # Dynamic shop routes
│   ├── dashboard/       # Shop owner dashboard
│   ├── landing/         # Marketing landing page
│   └── api/            # API routes
├── components/          # React components
│   ├── shop/           # Shop-specific components
│   ├── dashboard/      # Dashboard components
│   └── ui/             # Reusable UI components
├── utils/              # Utility functions
│   ├── ai/             # AI integration helpers
│   ├── supabase/       # Database queries
│   └── stripe/         # Payment processing
└── types/              # TypeScript types
```

## Key Features Implementation

### AI Menu Extraction
Upload a photo of your menu, and our AI automatically extracts all items, prices, and descriptions.

### Smart Chat Assistant
Each shop gets an AI assistant that knows their menu, hours, and can take custom orders.

### Instant Website Generation
Professional, mobile-responsive websites generated automatically based on your business info.

## Development

```bash
# Run development server
pnpm dev

# Run type checking
pnpm tsc --noEmit

# Run linting
pnpm lint

# Build for production
pnpm build
```

## Database Schema

The application uses Supabase with the following main tables:
- `shops` - Store information
- `menu_items` - Menu items for each shop
- `orders` - Customer orders
- `users` - User profiles

## Deployment

The app is configured for deployment on Vercel. Simply push to your main branch for automatic deployment.

### Environment Variables for Production

Make sure to set all required environment variables in your Vercel project settings.

## License

All rights reserved. This is proprietary software.

## Support

For support, email support@autoai.com