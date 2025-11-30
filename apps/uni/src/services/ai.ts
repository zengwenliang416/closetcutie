import { AIAnalysisResult, Category } from '@types'

// 区分环境的基础 URL
// H5 开发环境走代理，生产环境或小程序环境需要真实地址
// 注意：小程序真机调试需要配置局域网IP或公网HTTPS
const getBaseUrl = () => {
  // @ts-ignore
  if (import.meta.env.MODE === 'development') {
    // #ifdef H5
    return '' // H5 开发环境走 Vite 代理
    // #endif
    // #ifndef H5
    return 'http://localhost:8787' // 小程序模拟器可以连 localhost
    // #endif
  }
  return 'https://api.closetcutie.com' // 生产环境（示例）
}

export const identifyClothingItem = async (base64Image: string): Promise<AIAnalysisResult> => {
  try {
    const url = `${getBaseUrl()}/ai/identify`

    // uni.request 是跨平台的请求 API
    const response = await new Promise<UniApp.RequestSuccessCallbackResult>((resolve, reject) => {
      uni.request({
        url,
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        data: { imageBase64: base64Image },
        success: (res) => resolve(res),
        fail: (err) => reject(err)
      })
    })

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return response.data as AIAnalysisResult
    } else {
      throw new Error(`Request failed with status ${response.statusCode}`)
    }
  } catch (error) {
    console.error('AI identification failed:', error)
    return {
      name: '',
      category: Category.OTHER,
      color: '',
      tags: []
    }
  }
}
