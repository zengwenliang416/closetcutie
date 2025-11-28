import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ClothingItem, StorageUnit } from '@types'
import { INITIAL_ITEMS, INITIAL_STORAGES } from '@/constants'

export const useClosetStore = defineStore('closet', () => {
  const items = ref<ClothingItem[]>(INITIAL_ITEMS)
  const storages = ref<StorageUnit[]>(INITIAL_STORAGES)

  const getItemsByStorageId = (storageId: string) => {
    return items.value.filter(item => item.storageId === storageId)
  }

  const getItemById = (id: string) => {
    return items.value.find(item => item.id === id)
  }

  const addItem = (item: Omit<ClothingItem, 'id' | 'createdAt'>) => {
    const newItem: ClothingItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: Date.now()
    }
    items.value.unshift(newItem) // Add to top
    return newItem
  }

  return {
    items,
    storages,
    getItemsByStorageId,
    getItemById,
    addItem
  }
}, {
  persist: true
})
