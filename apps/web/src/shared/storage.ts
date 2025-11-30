import { StorageUnit, ClothingItem } from '@closetcutie/types'

export interface AppState {
  storages: StorageUnit[]
  items: ClothingItem[]
}

const KEY = 'closetcutie'

export function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as AppState) : null
  } catch {
    return null
  }
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // 静默处理存储失败（如配额超限）
  }
}
