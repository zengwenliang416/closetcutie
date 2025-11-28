import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom'
import { INITIAL_STORAGES, INITIAL_ITEMS } from './constants'
import { StorageUnit, ClothingItem } from '@types'
import { loadState, saveState } from '@/shared/storage'
import { AddItemModal } from './components/AddItemModal'
import { SearchIcon, BackIcon, TrashIcon } from './components/Icons'
import { Home } from './pages/Home'
import { StorageDetail } from './pages/StorageDetail'
import { PlusIcon } from './components/Icons'

function AppContent() {
  const initial = loadState()
  const [storages] = useState<StorageUnit[]>(initial?.storages || INITIAL_STORAGES)
  const [items, setItems] = useState<ClothingItem[]>(initial?.items || INITIAL_ITEMS)
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null)

  const navigate = useNavigate()
  const location = useLocation()
  
  // Derived state for current storage context
  const storageIdMatch = location.pathname.match(/\/storage\/(.+)/)
  const currentStorageId = storageIdMatch ? storageIdMatch[1] : null
  const activeStorage = storages.find(s => s.id === currentStorageId)

  useEffect(() => { saveState({ storages, items }) }, [storages, items])

  const handleAddItem = (newItem: Omit<ClothingItem, 'id' | 'createdAt'>) => {
    const item: ClothingItem = { ...newItem, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() }
    setItems(prev => [item, ...prev])
  }

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      setItems(prev => prev.filter(i => i.id !== itemId))
      setSelectedItem(null)
    }
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 px-6 py-4 border-b-2 border-pink-100">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentStorageId && (
              <button onClick={() => navigate('/')} className="bg-pink-100 hover:bg-pink-200 text-pink-600 p-2 rounded-xl transition-colors">
                <BackIcon className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{currentStorageId && activeStorage ? activeStorage.name : (currentStorageId === 'all' ? 'All Items' : 'ClosetCutie 🎀')}</h1>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-pink-300" />
            </div>
            <input type="text" placeholder="Find clothes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 bg-pink-50 border-none rounded-full text-sm focus:ring-2 focus:ring-pink-300 w-32 sm:w-48 transition-all" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                storages={storages}
                items={items}
                onStorageSelect={(id) => navigate(id === 'all' ? '/storage/all' : `/storage/${id}`)}
                onItemSelect={setSelectedItem}
              />
            }
          />
          <Route path="/storage/:id" element={
            <StorageWrapper items={items} searchQuery={searchQuery} onItemSelect={setSelectedItem} />
          } />
        </Routes>
      </main>

      <button onClick={() => setIsAddItemOpen(true)} className="fixed bottom-6 right-6 bg-gray-800 text-white p-4 rounded-full shadow-lg shadow-purple-300 hover:scale-110 active:scale-95 transition-all z-40 border-4 border-white">
        <PlusIcon className="w-8 h-8" />
      </button>

      <AddItemModal isOpen={isAddItemOpen} onClose={() => setIsAddItemOpen(false)} onSave={handleAddItem} storages={storages} preselectedStorageId={currentStorageId && currentStorageId !== 'all' ? currentStorageId : undefined} />

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden relative shadow-2xl animate-pop-in">
            <div className="h-64 relative bg-gray-100">
              <img src={selectedItem.imageUrl} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedItem(null)} className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-md">
                <BackIcon className="w-5 h-5" />
              </button>
              <button onClick={() => handleDeleteItem(selectedItem.id)} className="absolute top-4 right-4 bg-red-100 text-red-500 p-2 rounded-full">
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-bold text-pink-500 uppercase tracking-wider">{selectedItem.category}</span>
                  <h2 className="text-2xl font-bold text-gray-800 leading-tight">{selectedItem.name}</h2>
                </div>
                <div className="bg-gray-100 rounded-lg px-2 py-1 text-xs font-bold text-gray-500">{selectedItem.color}</div>
              </div>
              <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
                <span>Stored in:</span>
                <span className="font-bold text-gray-700 flex items-center gap-1">
                  {storages.find(s => s.id === selectedItem.storageId)?.icon}
                  {storages.find(s => s.id === selectedItem.storageId)?.name}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedItem.tags.map(tag => (<span key={tag} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">#{tag}</span>))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StorageWrapper({ items, searchQuery, onItemSelect }: { items: ClothingItem[], searchQuery: string, onItemSelect: (item: ClothingItem) => void }) {
  const { id } = useParams()
  return <StorageDetail storageId={id || null} items={items} searchQuery={searchQuery} onItemSelect={onItemSelect} />
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
