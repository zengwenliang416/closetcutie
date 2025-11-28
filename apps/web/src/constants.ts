import { StorageUnit, Category, ClothingItem } from '@types'

export const INITIAL_STORAGES: StorageUnit[] = [
  { id: 's1', name: 'My Big Wardrobe', type: 'closet', icon: '🚪', color: 'bg-blue-100' },
  { id: 's2', name: 'Summer Box', type: 'box', icon: '📦', color: 'bg-yellow-100' },
  { id: 's3', name: 'Shoe Rack', type: 'rack', icon: '👠', color: 'bg-pink-100' },
  { id: 's4', name: 'Under Bed', type: 'drawer', icon: '🛏️', color: 'bg-purple-100' },
]

export const INITIAL_ITEMS: ClothingItem[] = [
  { id: 'i1', name: 'Favorite Floral Dress', category: Category.DRESS, storageId: 's1', imageUrl: 'https://picsum.photos/400/400?random=1', tags: ['summer', 'floral', 'cute'], color: 'Pink', createdAt: Date.now() },
  { id: 'i2', name: 'Denim Jacket', category: Category.OUTERWEAR, storageId: 's1', imageUrl: 'https://picsum.photos/400/400?random=2', tags: ['vintage', 'casual'], color: 'Blue', createdAt: Date.now() },
  { id: 'i3', name: 'White Sneakers', category: Category.SHOES, storageId: 's3', imageUrl: 'https://picsum.photos/400/400?random=3', tags: ['everyday', 'comfy'], color: 'White', createdAt: Date.now() },
]
