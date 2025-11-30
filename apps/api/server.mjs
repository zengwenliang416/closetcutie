import http from 'http'
import { GoogleGenAI, Type } from '@google/genai'

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY
const ai = new GoogleGenAI({ apiKey })

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/ai/identify') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', async () => {
      try {
        const data = JSON.parse(body || '{}')
        const base64 = String(data.imageBase64 || '').replace(
          /^data:image\/(png|jpeg|jpg|webp);base64,/,
          ''
        )
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: {
            parts: [
              { inlineData: { mimeType: 'image/jpeg', data: base64 } },
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
                category: { type: Type.STRING },
                color: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['name', 'category', 'color', 'tags']
            }
          }
        })
        const text = response.text || '{}'
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
        res.end(text)
      } catch (e) {
        res.writeHead(500, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
        res.end(JSON.stringify({ error: 'AI identification failed' }))
      }
    })
  } else if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    })
    res.end()
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
  }
})

const port = process.env.PORT ? Number(process.env.PORT) : 8787
server.listen(port, '0.0.0.0')
