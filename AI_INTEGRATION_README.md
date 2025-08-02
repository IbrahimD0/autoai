# AI Integration Setup

This document explains how to use the AI menu extraction and chat functionality in AutoAI.

## Required Environment Variables

Add the following to your `.env.local` file:

```
OPENAI_KEY=your_openai_api_key_here
```

## Features

### 1. Menu Management
- Upload menu images (PNG, JPG, PDF)
- AI automatically extracts menu items, prices, descriptions, and categories
- Edit and manage extracted items
- Data stored locally in `.menu-data/` directory

### 2. AI Assistant
- Automatically activated when menu items are uploaded
- Answers customer questions about menu items
- Provides recommendations based on dietary restrictions
- Can process orders (order IDs generated but not persisted)

## Usage in Dashboard

1. Navigate to the Dashboard
2. Click on "My Menu" to upload and manage menu items
3. Click on "AI Assistant" to test the chat functionality

## API Endpoints

- `POST /api/menu/extract` - Upload menu image and extract items
- `GET /api/menu/extract` - Get current menu items
- `POST /api/chat` - Send message to AI assistant

## Client Utilities

```javascript
// Menu Upload
import { MenuUploadClient } from '@/utils/menu-upload-client';

// Upload menu
const result = await MenuUploadClient.uploadMenu(file, clearExisting);

// Get menu items
const result = await MenuUploadClient.getMenuItems();

// Chat
import { ChocolateChatClient } from '@/utils/chat-client';

// Check availability
const availability = await ChocolateChatClient.checkAvailability();

// Send message
const response = await ChocolateChatClient.sendMessage(messages);
```

## File Structure

```
utils/
├── ai/
│   ├── menu-extraction.ts    # AI menu extraction logic
│   └── chocolate-assistant.ts # AI chat assistant logic
├── storage/
│   └── menu-storage.ts       # File-based menu storage
├── menu-upload-client.ts     # Client utilities for menu upload
└── chat-client.ts            # Client utilities for chat

app/api/
├── menu/
│   └── extract/
│       └── route.ts          # Menu extraction API endpoint
└── chat/
    └── route.ts              # Chat API endpoint

components/dashboard/
├── MenuManager.tsx           # Menu management UI component
└── AIAssistant.tsx          # AI chat UI component
```

## Notes

- Menu data is stored in `.menu-data/` directory (gitignored)
- Each user's menu is stored separately by user ID
- The AI assistant is context-aware of the uploaded menu items
- No database required for basic functionality