export enum Category {
  TOP = 'Tops',
  BOTTOM = 'Bottoms',
  DRESS = 'Dresses',
  OUTERWEAR = 'Outerwear',
  SHOES = 'Shoes',
  BAG = 'Bags',
  ACCESSORY = 'Accessories',
  OTHER = 'Other'
}

export interface StorageUnit {
  id: string
  name: string
  type: 'closet' | 'box' | 'drawer' | 'rack'
  icon: string
  color: string
}

export interface ClothingItem {
  id: string
  name: string
  storageId: string
  category: Category
  imageUrl: string
  tags: string[]
  color: string
  createdAt: number
}

export interface AIAnalysisResult {
  name: string
  category: Category
  color: string
  tags: string[]
}
