import { GoogleGenAI, Type } from '@google/genai'
import { AIAnalysisResult, Category } from '@closetcutie/types'

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY })

export const identifyClothingItem = async (base64Image: string): Promise<AIAnalysisResult> => {
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '')

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: 'Analyze this clothing item. Identify a cute and short name, its category, main color, and 3 descriptive tags.'
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: {
              type: Type.STRING,
              enum: Object.values(Category)
            },
            color: { type: Type.STRING },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['name', 'category', 'color', 'tags']
        }
      }
    })

    const text = response.text
    if (!text) throw new Error('No response from AI')
    return JSON.parse(text) as AIAnalysisResult
  } catch (error) {
    return {
      name: '',
      category: Category.OTHER,
      color: '',
      tags: []
    }
  }
}
