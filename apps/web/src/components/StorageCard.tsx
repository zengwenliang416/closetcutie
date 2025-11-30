import React from 'react'
import { StorageUnit } from '@types'

interface StorageCardProps {
  storage: StorageUnit
  itemCount: number
  onClick: () => void
}

export const StorageCard: React.FC<StorageCardProps> = ({ storage, itemCount, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`${storage.color} relative p-6 rounded-3xl cursor-pointer transform transition-all hover:scale-105 active:scale-95 border-b-8 border-black/10`}
    >
      <div className="absolute top-4 right-4 bg-white/40 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-gray-700">
        {itemCount} Items
      </div>
      <div className="text-6xl mb-4 filter drop-shadow-md transform transition-transform group-hover:rotate-12">
        {storage.icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800">{storage.name}</h3>
      <p className="text-sm text-gray-600 font-medium capitalize opacity-70">{storage.type}</p>
    </div>
  )
}
