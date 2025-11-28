<script setup lang="ts">
import { ref, computed } from 'vue'
import { useClosetStore } from '@/stores/closet'
import { storeToRefs } from 'pinia'

const store = useClosetStore()
const { storages } = storeToRefs(store)
const searchQuery = ref('')

const filteredItems = computed(() => {
  if (!searchQuery.value) return store.items
  const q = searchQuery.value.toLowerCase()
  return store.items.filter(item => 
    item.name.toLowerCase().includes(q) || 
    item.tags.some(t => t.toLowerCase().includes(q)) || 
    item.category.toLowerCase().includes(q)
  )
})

function goToDetail(id: string) {
  uni.navigateTo({ url: `/pages/detail/index?id=${id}` })
}

function goToAdd() {
  uni.navigateTo({ url: '/pages/add/index' })
}
</script>

<template>
  <view class="container">
    <view class="header">
      <text class="title">ClosetCutie 🎀</text>
      <view class="search-bar">
        <input class="search-input" v-model="searchQuery" placeholder="Find clothes..." />
      </view>
    </view>

    <view class="content">
      <view class="section-title">My Warehouses</view>
      <scroll-view scroll-x class="storage-list">
        <view class="storage-item" v-for="storage in storages" :key="storage.id">
          <text class="storage-icon">{{ storage.icon }}</text>
          <text class="storage-name">{{ storage.name }}</text>
        </view>
      </scroll-view>

      <view class="section-title mt-6">Recent Additions</view>
      <view class="grid">
        <view class="card" v-for="item in filteredItems" :key="item.id" @tap="goToDetail(item.id)">
          <image :src="item.imageUrl" mode="aspectFill" class="card-img" />
          <view class="card-body">
            <text class="card-title">{{ item.name }}</text>
            <view class="tags">
              <text class="tag" v-for="tag in item.tags.slice(0, 2)" :key="tag">#{{ tag }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="fab" @tap="goToAdd">
      <text class="plus">+</text>
    </view>
  </view>
</template>

<style>
.container { padding-bottom: 100px; }
.header { padding: 20px 16px; background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 10; }
.title { font-size: 24px; font-weight: bold; color: #1f2937; }
.search-bar { margin-top: 12px; }
.search-input { background: #fdf2f8; padding: 10px 16px; border-radius: 999px; font-size: 14px; }

.content { padding: 16px; }
.section-title { font-size: 18px; font-weight: bold; color: #4b5563; margin-bottom: 12px; }
.mt-6 { margin-top: 24px; }

.storage-list { white-space: nowrap; display: flex; }
.storage-item { display: inline-flex; flex-direction: column; align-items: center; background: #fff; padding: 16px; border-radius: 16px; margin-right: 12px; width: 100px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.storage-icon { font-size: 32px; margin-bottom: 8px; }
.storage-name { font-size: 12px; color: #4b5563; white-space: normal; text-align: center; }

.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.card-img { width: 100%; height: 160px; background: #f3f4f6; }
.card-body { padding: 12px; }
.card-title { font-weight: bold; font-size: 14px; color: #1f2937; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.tags { display: flex; gap: 4px; margin-top: 4px; flex-wrap: wrap; }
.tag { font-size: 10px; color: #9333ea; background: #f3e8ff; padding: 2px 6px; border-radius: 4px; }

.fab { position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px; background: #1f2937; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2); border: 4px solid #fff; }
.plus { color: #fff; font-size: 32px; line-height: 1; margin-top: -4px; }
</style>
