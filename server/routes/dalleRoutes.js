import express from 'express'
import * as dotenv from 'dotenv'
import { InferenceClient } from '@huggingface/inference'

import Post from '../mongodb/models/post.js'

dotenv.config()

const router = express.Router()

const client = new InferenceClient(process.env.HUGGINGFACE_API_TOKEN)

router.route('/').get((req, res) => {
  res.send('Hello from DALL-E!')
})

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body

    const image = await client.textToImage({
      provider: 'replicate',
      model: 'black-forest-labs/FLUX.1-dev',
      inputs: prompt,
      parameters: { num_inference_steps: 5 }
    })

    const buffer = await image.arrayBuffer()
    const base64Image = Buffer.from(buffer).toString('base64')

    res.status(200).json({
      photo: `data:image/png;base64,${base64Image}`
    })
  } catch (error) {
    console.error('Image generation failed:', error)
    res.status(500).json({ error: 'Failed image generation' })
  }
})

export default router
