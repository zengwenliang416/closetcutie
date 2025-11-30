import { ClothingItem } from '@closetcutie/types'
import { useMemo } from 'react'

import { ItemCard } from '../components/ItemCard'

interface StorageDetailProps {
  storageId: string | null
  items: ClothingItem[]
  searchQuery: string
  onItemSelect: (item: ClothingItem) => void
}

export function StorageDetail({ storageId, items, searchQuery, onItemSelect }: StorageDetailProps) {
  const filteredItems = useMemo(() => {
    let result = items
    if (storageId && storageId !== 'all')
      result = result.filter((item) => item.storageId === storageId)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q)
      )
    }
    return result
  }, [items, storageId, searchQuery])

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500 font-medium">
          {filteredItems.length === 0
            ? 'Nothing here yet...'
            : `Found ${filteredItems.length} cute things!`}
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} onClick={() => onItemSelect(item)} />
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-10 text-center text-gray-400">
            <span className="text-4xl block mb-2">🙈</span>
            No clothes found matching your criteria.
          </div>
        )}
      </div>
    </div>
  )
}
