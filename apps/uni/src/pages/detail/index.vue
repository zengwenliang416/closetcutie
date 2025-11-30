<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useClosetStore } from '@/stores/closet'
import { ClothingItem, StorageUnit } from '@types'

const store = useClosetStore()
const item = ref<ClothingItem | null>(null)
const storage = ref<StorageUnit | null>(null)

onLoad((options) => {
  const id = options?.id
  if (id) {
    const foundItem = store.getItemById(id)
    if (foundItem) {
      item.value = foundItem
      storage.value = store.storages.find((s) => s.id === foundItem.storageId) || null
    }
  }
})
</script>

<template>
  <view class="container" v-if="item">
    <image :src="item.imageUrl" mode="aspectFill" class="hero-image" />

    <view class="content-card">
      <view class="header">
        <text class="title">{{ item.name }}</text>
        <view class="category-badge">
          <text class="category-text">{{ item.category }}</text>
        </view>
      </view>

      <view class="info-row">
        <text class="label">Color</text>
        <view class="color-dot" :style="{ backgroundColor: item.color.toLowerCase() }"></view>
        <text class="value">{{ item.color }}</text>
      </view>

      <view class="tags-section">
        <text class="section-label">Tags</text>
        <view class="tags-list">
          <text class="tag" v-for="tag in item.tags" :key="tag">#{{ tag }}</text>
        </view>
      </view>

      <view class="storage-section" v-if="storage">
        <text class="section-label">Location</text>
        <view class="storage-card" :class="storage.color">
          <text class="storage-icon">{{ storage.icon }}</text>
          <view class="storage-info">
            <text class="storage-name">{{ storage.name }}</text>
            <text class="storage-type">{{ storage.type }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
  <view class="loading" v-else>
    <text>Loading...</text>
  </view>
</template>

<style>
.container {
  min-height: 100vh;
  background: #fff;
}
.hero-image {
  width: 100%;
  height: 300px;
  background: #f3f4f6;
}

.content-card {
  margin-top: -24px;
  background: #fff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 24px;
  position: relative;
  min-height: 500px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}
.title {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  flex: 1;
  margin-right: 16px;
}
.category-badge {
  background: #fdf2f8;
  padding: 4px 12px;
  border-radius: 999px;
}
.category-text {
  color: #db2777;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}
.label {
  width: 80px;
  color: #6b7280;
  font-size: 14px;
}
.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  margin-right: 8px;
}
.value {
  color: #1f2937;
  font-size: 14px;
  font-weight: 500;
}

.tags-section {
  margin-bottom: 24px;
}
.section-label {
  display: block;
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 12px;
}
.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tag {
  background: #f3f4f6;
  color: #4b5563;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
}

.storage-section {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid #f3f4f6;
}
.storage-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 16px;
  background: #f9fafb;
}
.storage-icon {
  font-size: 32px;
  margin-right: 16px;
}
.storage-info {
  display: flex;
  flex-direction: column;
}
.storage-name {
  font-weight: bold;
  color: #1f2937;
  font-size: 16px;
}
.storage-type {
  color: #6b7280;
  font-size: 12px;
  text-transform: capitalize;
}

/* Tailwind-like colors for dynamic class binding */
.bg-blue-100 {
  background-color: #dbeafe;
}
.bg-yellow-100 {
  background-color: #fef9c3;
}
.bg-pink-100 {
  background-color: #fce7f3;
}
.bg-purple-100 {
  background-color: #f3e8ff;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #9ca3af;
}
</style>
