// Shop-related type definitions

export interface Shop {
  id: string
  user_id: string
  slug: string
  name: string
  tagline?: string
  description?: string
  address?: string
  phone?: string
  email?: string
  hours?: string
  social_media?: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: string
  shop_id: string
  name: string
  price: number
  description?: string
  category: string
  size?: string
  allergens?: string[]
  available: boolean
  seasonal: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface MenuCategory {
  category: string
  items: MenuItem[]
}

// For compatibility with the existing AI extraction
export interface ExtractedMenuItem {
  name: string
  price: number
  description?: string
  category: string
  size?: string
  allergens?: string[]
  available?: boolean
  seasonal?: boolean
}