import dotenv from 'dotenv';
dotenv.config(); // Ensure environment variables are loaded

import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors()); // Enable CORS
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    console.log('POST request received at /api/chat');
    const { message } = req.body;
    console.log('Received message from frontend:', message);

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: message }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response from OpenAI API:', data);
        res.json({ reply: data.choices[0].message.content });
    } catch (error) {
        console.error('Error fetching bot response:', error);
        console.error('Error details:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
            console.error('Response data:', await error.response.text());
        }
        res.status(500).json({ error: 'Failed to fetch response from OpenAI API' });
    }
});

// Serve static files from the current directory
const __dirname = path.resolve();
app.use(express.static(__dirname));

// Fallback to serve index.html for any unmatched routes
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

app.get('/favicon.ico', (req, res) => res.status(204));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});