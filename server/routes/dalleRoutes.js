import express from 'express'
import * as dotenv from 'dotenv'
import axios from 'axios'

import Post from '../mongodb/models/post.js'

dotenv.config()

const router = express.Router()

router.route('/').get((req, res) => {
    res.send('Hello from DALL-E!')
})

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;

        const response = await axios({
            method: 'POST',
            url: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2',
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ inputs: prompt }),
            responseType: 'arraybuffer'
        });

        const base64Image = Buffer.from(response.data).toString('base64');
        const image = `data:image/png;base64,${base64Image}`;

        res.status(200).json({ photo: image });

    } catch (error) {
        console.error(error?.response?.data || error.message);
        res.status(500).json({ error: 'Image generation failed' });
    }
})

export default router
