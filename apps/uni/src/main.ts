import * as Pinia from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { createSSRApp } from 'vue'

import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = Pinia.createPinia()

  pinia.use(
    createPersistedState({
      storage: {
        getItem: (key) => uni.getStorageSync(key),
        setItem: (key, value) => uni.setStorageSync(key, value)
      }
    })
  )

  // @ts-expect-error uni-app SSR 类型兼容
  app.use(pinia)
  return {
    app,
    Pinia
  }
}
