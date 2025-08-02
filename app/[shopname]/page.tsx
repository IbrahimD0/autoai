import { notFound } from 'next/navigation'
import LocalShopWebsite from '@/components/shop/LocalShopWebsite'
import { createClient } from '@/utils/supabase/server'
import { Shop, MenuItem, MenuCategory } from '@/types/shop'

export const revalidate = 60 // Revalidate page every 60 seconds

async function getShopData(slug: string) {
  const supabase = await createClient()
  
  // Fetch shop details
  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .select('*')
    .eq('slug', slug)
    .single()
    
  if (shopError || !shop) {
    return null
  }
  
  // Fetch menu items
  const { data: menuItems, error: menuError } = await supabase
    .from('menu_items')
    .select('*')
    .eq('shop_id', shop.id)
    .eq('available', true)
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true })
    
  if (menuError) {
    console.error('Error fetching menu items:', menuError)
  }
  
  // Group menu items by category
  const menuCategories: MenuCategory[] = []
  const categoryMap = new Map<string, MenuItem[]>()
  
  menuItems?.forEach(item => {
    if (!categoryMap.has(item.category)) {
      categoryMap.set(item.category, [])
    }
    categoryMap.get(item.category)!.push(item)
  })
  
  categoryMap.forEach((items, category) => {
    menuCategories.push({ category, items })
  })
  
  return { shop, menuCategories }
}

export async function generateMetadata({ params }: { params: { shopname: string } }) {
  const shopData = await getShopData(params.shopname)
  
  if (!shopData) {
    return {
      title: 'Shop Not Found',
      description: 'The requested shop could not be found.'
    }
  }
  
  return {
    title: `${shopData.shop.name} - ${shopData.shop.tagline || 'Local Shop'}`,
    description: shopData.shop.description || `Visit ${shopData.shop.name} for great food and service.`,
    openGraph: {
      title: shopData.shop.name,
      description: shopData.shop.description,
      type: 'website',
    },
  }
}

export default async function ShopPage({ params }: { params: { shopname: string } }) {
  const shopData = await getShopData(params.shopname)
  
  if (!shopData) {
    notFound()
  }
  
  // Transform shop data to match the component's expected format
  const businessInfo = {
    name: shopData.shop.name,
    tagline: shopData.shop.tagline || '',
    description: shopData.shop.description || '',
    address: shopData.shop.address || '',
    phone: shopData.shop.phone || '',
    email: shopData.shop.email || '',
    hours: shopData.shop.hours || '',
    socialMedia: shopData.shop.social_media || {}
  }
  
  // Transform menu items to match the component's expected format
  const menuItems = shopData.menuCategories.map(category => ({
    category: category.category,
    items: category.items.map(item => ({
      name: item.name,
      price: `$${item.price.toFixed(2)}`,
      description: item.description,
      category: item.category
    }))
  }))
  
  return <LocalShopWebsite businessInfo={businessInfo} menuItems={menuItems} />
}