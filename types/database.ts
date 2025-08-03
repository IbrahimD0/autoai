import { Database as GeneratedDatabase } from '@/types_db'
import { Shop, MenuItem } from './shop'

export interface Database extends GeneratedDatabase {
  public: GeneratedDatabase['public'] & {
    Tables: GeneratedDatabase['public']['Tables'] & {
      shops: {
        Row: Shop
        Insert: Omit<Shop, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Shop, 'id'>>
        Relationships: []
      }
      menu_items: {
        Row: MenuItem
        Insert: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<MenuItem, 'id'>>
        Relationships: [{
          foreignKeyName: "menu_items_shop_id_fkey"
          columns: ["shop_id"]
          referencedRelation: "shops"
          referencedColumns: ["id"]
        }]
      }
    }
  }
}