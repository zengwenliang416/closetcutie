<script setup lang="ts">
import { Category } from '@closetcutie/types'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { identifyClothingItem } from '@/services/ai'
import { useClosetStore } from '@/stores/closet'

const store = useClosetStore()
const { storages } = storeToRefs(store)

const imagePath = ref('')
const isAnalyzing = ref(false)
const showForm = ref(false)

const formData = ref({
  name: '',
  category: '',
  color: '',
  tags: '',
  storageId: storages.value[0].id
})

const categories = Object.values(Category)

function chooseImage() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      imagePath.value = res.tempFilePaths[0]
      analyzeImage(res.tempFilePaths[0])
    }
  })
}

async function analyzeImage(path: string) {
  isAnalyzing.value = true
  try {
    const base64 = await fileToBase64(path)
    // Remove data:image/jpeg;base64, prefix if present, as the service might expect raw base64 or full data URI
    // checking service implementation: it sends { imageBase64: base64Image }
    // Usually it's safer to send the full data URI or just the content depending on backend.
    // Assuming backend handles standard base64 strings.

    const result = await identifyClothingItem(base64)

    formData.value.name = result.name || 'New Item'
    formData.value.category = result.category || Category.OTHER
    formData.value.color = result.color || ''
    formData.value.tags = result.tags.join(', ')

    showForm.value = true
  } catch (error) {
    uni.showToast({ title: 'Analysis failed', icon: 'none' })
    console.error(error)
    showForm.value = true // Show form anyway to allow manual entry
  } finally {
    isAnalyzing.value = false
  }
}

function fileToBase64(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // #ifdef H5
    uni.request({
      url: path,
      responseType: 'blob',
      success: (res) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(res.data as Blob)
      },
      fail: reject
    })
    // #endif

    // #ifndef H5
    uni.getFileSystemManager().readFile({
      filePath: path,
      encoding: 'base64',
      success: (res) => {
        const prefix = 'data:image/jpeg;base64,' // Simplification, should detect type
        resolve(prefix + res.data)
      },
      fail: reject
    })
    // #endif
  })
}

async function saveItem() {
  uni.showLoading({ title: 'Saving...' })

  let imageUrl = imagePath.value || 'https://picsum.photos/400/400'

  // #ifndef H5
  if (imagePath.value) {
    try {
      const savedFile = await new Promise<string>((resolve, reject) => {
        uni.saveFile({
          tempFilePath: imagePath.value,
          success: (res) => resolve(res.savedFilePath),
          fail: reject
        })
      })
      imageUrl = savedFile
    } catch (e) {
      console.error('Save file failed', e)
    }
  }
  // #endif

  store.addItem({
    name: formData.value.name,
    category: formData.value.category as Category,
    color: formData.value.color,
    tags: formData.value.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    storageId: formData.value.storageId,
    imageUrl: imageUrl
  })

  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: 'Saved!', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }, 1000)
}
</script>

<template>
  <view class="container">
    <view class="image-section" @tap="chooseImage">
      <image v-if="imagePath" :src="imagePath" mode="aspectFit" class="preview-image" />
      <view v-else class="upload-placeholder">
        <text class="icon">📷</text>
        <text class="text">Take a photo or upload</text>
      </view>

      <view v-if="isAnalyzing" class="analyzing-overlay">
        <text class="analyzing-text">AI Analyzing...</text>
      </view>
    </view>

    <view class="form-section" v-if="showForm">
      <view class="form-item">
        <text class="label">Name</text>
        <input class="input" v-model="formData.name" placeholder="Item name" />
      </view>

      <view class="form-item">
        <text class="label">Category</text>
        <picker
          :range="categories"
          @change="(e: any) => (formData.category = categories[e.detail.value])"
        >
          <view class="picker">
            {{ formData.category || 'Select Category' }}
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">Color</text>
        <input class="input" v-model="formData.color" placeholder="Color" />
      </view>

      <view class="form-item">
        <text class="label">Tags</text>
        <input
          class="input"
          v-model="formData.tags"
          placeholder="casual, summer (comma separated)"
        />
      </view>

      <view class="form-item">
        <text class="label">Storage</text>
        <picker
          :range="storages"
          range-key="name"
          @change="(e: any) => (formData.storageId = storages[e.detail.value].id)"
        >
          <view class="picker">
            {{ storages.find((s) => s.id === formData.storageId)?.name }}
          </view>
        </picker>
      </view>

      <button class="save-btn" @tap="saveItem">Save to Closet</button>
    </view>
  </view>
</template>

<style>
.container {
  padding: 20px;
  min-height: 100vh;
  background: #fff;
}

.image-section {
  height: 300px;
  background: #f3f4f6;
  border-radius: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
  border: 2px dashed #e5e7eb;
}

.preview-image {
  width: 100%;
  height: 100%;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.icon {
  font-size: 48px;
  margin-bottom: 12px;
}
.text {
  color: #9ca3af;
  font-size: 14px;
}

.analyzing-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.analyzing-text {
  color: #fff;
  font-weight: bold;
  font-size: 18px;
}

.form-section {
  animation: slideUp 0.3s ease-out;
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-item {
  margin-bottom: 20px;
}
.label {
  display: block;
  font-size: 12px;
  font-weight: bold;
  color: #6b7280;
  margin-bottom: 8px;
  text-transform: uppercase;
}
.input,
.picker {
  background: #f9fafb;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  color: #1f2937;
}

.save-btn {
  background: #1f2937;
  color: #fff;
  border-radius: 999px;
  padding: 16px;
  font-weight: bold;
  margin-top: 32px;
  border: none;
}
.save-btn:active {
  opacity: 0.9;
}
</style>
