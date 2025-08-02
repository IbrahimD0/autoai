// Simple in-memory storage for menu items - no database needed!
// This stores data per user session

import { MenuItem } from '@/utils/ai/menu-extraction';

// In-memory storage - resets when server restarts
const menuStorage = new Map<string, MenuItem[]>();

export class MenuStorage {
  // Save menu items for a user
  static saveMenuItems(userId: string, items: MenuItem[]): void {
    menuStorage.set(userId, items);
  }

  // Get menu items for a user
  static getMenuItems(userId: string): MenuItem[] {
    return menuStorage.get(userId) || [];
  }

  // Clear menu items for a user
  static clearMenuItems(userId: string): void {
    menuStorage.delete(userId);
    // Also clear from file storage
    FileMenuStorage.clearMenuItems(userId);
  }

  // Check if user has menu items
  static hasMenuItems(userId: string): boolean {
    const items = menuStorage.get(userId);
    return items ? items.length > 0 : false;
  }
}

// Alternative: File-based storage (persists across restarts)
import fs from 'fs';
import path from 'path';

const STORAGE_DIR = path.join(process.cwd(), '.menu-data');

export class FileMenuStorage {
  static {
    // Create storage directory if it doesn't exist
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }
  }

  static getFilePath(userId: string): string {
    // Safe filename from user ID
    const safeId = userId.replace(/[^a-zA-Z0-9-_]/g, '_');
    return path.join(STORAGE_DIR, `${safeId}.json`);
  }

  static saveMenuItems(userId: string, items: MenuItem[]): void {
    const filePath = this.getFilePath(userId);
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
  }

  static getMenuItems(userId: string): MenuItem[] {
    const filePath = this.getFilePath(userId);
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading menu file:', error);
    }
    return [];
  }

  static clearMenuItems(userId: string): void {
    const filePath = this.getFilePath(userId);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error deleting menu file:', error);
    }
  }

  static hasMenuItems(userId: string): boolean {
    return this.getMenuItems(userId).length > 0;
  }
}