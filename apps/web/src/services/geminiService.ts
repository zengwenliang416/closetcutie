import { AIAnalysisResult, Category } from '@closetcutie/types'

export const identifyClothingItem = async (base64Image: string): Promise<AIAnalysisResult> => {
  try {
    const response = await fetch('/ai/identify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imageBase64: base64Image })
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    return data as AIAnalysisResult
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
