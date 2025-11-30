import React, { useState, useRef } from 'react'
import { StorageUnit, Category, ClothingItem } from '@closetcutie/types'
import { identifyClothingItem } from '../services/geminiService'
import { CameraIcon, SparklesIcon } from './Icons'

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: Omit<ClothingItem, 'id' | 'createdAt'>) => void
  storages: StorageUnit[]
  preselectedStorageId?: string
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  storages,
  preselectedStorageId
}) => {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>(Category.TOP)
  const [storageId, setStorageId] = useState(preselectedStorageId || storages[0]?.id || '')
  const [image, setImage] = useState<string | null>(null)
  const [tags, setTags] = useState<string>('')
  const [color, setColor] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!image) return
    setIsAnalyzing(true)
    try {
      const result = await identifyClothingItem(image)
      setName(result.name)
      setCategory(result.category)
      setColor(result.color)
      setTags(result.tags.join(', '))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !image || !storageId) return
    onSave({
      name,
      category,
      storageId,
      imageUrl: image,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      color
    })
    setName('')
    setImage(null)
    setTags('')
    setColor('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-3xl w-full max-w-md p-6 relative shadow-2xl animate-bounce-in max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">✨ Add New Goodie</h2>
        <div className="flex flex-col items-center mb-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`w-32 h-32 rounded-2xl border-4 border-dashed border-pink-200 flex items-center justify-center cursor-pointer overflow-hidden relative group hover:border-pink-400 transition-colors ${!image ? 'bg-pink-50' : ''}`}
          >
            {image ? (
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-2">
                <CameraIcon className="w-8 h-8 text-pink-300 mx-auto mb-1" />
                <span className="text-xs text-pink-400 font-medium">Add Photo</span>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {image && (
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="mt-4 flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md active:scale-95 transition-transform disabled:opacity-50"
            >
              {isAnalyzing ? (
                <span className="animate-pulse">Magic happening...</span>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4" />
                  Auto-Identify
                </>
              )}
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-2 mb-1">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-300 font-medium text-gray-700 placeholder-gray-300"
              placeholder="e.g. Lucky Red Dress"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 ml-2 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-300 font-medium text-gray-700"
              >
                {Object.values(Category).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 ml-2 mb-1">Color</label>
              <input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-300 font-medium text-gray-700"
                placeholder="e.g. Blue"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-2 mb-1">Where is it?</label>
            <select
              value={storageId}
              onChange={(e) => setStorageId(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-300 font-medium text-gray-700"
            >
              {storages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.icon} {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-2 mb-1">
              Tags (comma separated)
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-300 font-medium text-gray-700 placeholder-gray-300"
              placeholder="summer, cute, vintage..."
            />
          </div>
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-500 font-bold py-3 rounded-2xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-pink-500 text白 font-bold py-3 rounded-2xl shadow-lg shadow-pink-200 hover:bg-pink-600 transition-colors"
            >
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
