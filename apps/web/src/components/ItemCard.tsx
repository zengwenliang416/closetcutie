import React from 'react'
import { ClothingItem } from '@types'

interface ItemCardProps { item: ClothingItem; onClick?: () => void }

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  return (
    <div onClick={onClick} className="bg-white p-3 rounded-2xl shadow-lg border-2 border-pink-100 hover:border-pink-300 transition-all cursor-pointer overflow-hidden relative group">
      <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3 relative">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="px-1">
        <h4 className="font-bold text-gray-800 text-sm truncate">{item.name}</h4>
        <div className="flex flex-wrap gap-1 mt-2">
          {item.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-semibold">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
