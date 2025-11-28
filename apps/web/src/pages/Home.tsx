import { StorageUnit, ClothingItem } from '@types'
import { StorageCard } from '../components/StorageCard'
import { ItemCard } from '../components/ItemCard'
import { PlusIcon } from '../components/Icons'

interface HomeProps {
  storages: StorageUnit[]
  items: ClothingItem[]
  onStorageSelect: (id: string | null) => void
  onItemSelect: (item: ClothingItem) => void
}

export function Home({ storages, items, onStorageSelect, onItemSelect }: HomeProps) {
  return (
    <div className="animate-fade-in-up">
      <h2 className="text-lg font-bold text-gray-600 mb-4 px-1">My Warehouses</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {storages.map(storage => (
          <StorageCard 
            key={storage.id} 
            storage={storage} 
            itemCount={items.filter(i => i.storageId === storage.id).length} 
            onClick={() => onStorageSelect(storage.id)} 
          />
        ))}
        <button className="border-4 border-dashed border-pink-200 rounded-3xl p-6 flex flex-col items-center justify-center text-pink-300 hover:bg-pink-50 hover:border-pink-300 transition-all min-h-[160px]">
          <PlusIcon className="w-12 h-12 mb-2 opacity-50" />
          <span className="font-bold text-sm">Add Warehouse</span>
        </button>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-bold text-gray-600">Recent Additions</h2>
          <button onClick={() => onStorageSelect('all')} className="text-pink-500 font-bold text-sm">See All</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {items.slice(0, 4).map(item => (<ItemCard key={item.id} item={item} onClick={() => onItemSelect(item)} />))}
        </div>
      </div>
    </div>
  )
}
