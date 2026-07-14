const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static assets from React build folder
app.use(express.static(path.join(__dirname, 'build')));

// Config check endpoint for frontend
app.get('/api/config', (req, res) => {
  const hasKey = !!process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'gsk_your_groq_api_key_here' && process.env.GROQ_API_KEY.trim() !== '';
  res.json({ hasKey });
});

// API Chat proxy endpoint for Groq
app.post('/api/chat', async (req, res) => {
  const { messages, model, apiKey } = req.body;
  const key = apiKey || process.env.GROQ_API_KEY;

  if (!key || key === 'gsk_your_groq_api_key_here' || key.trim() === '') {
    return res.status(400).json({
      error: 'Groq API Key not found. Please enter your API key in the AI Assistant settings panel (gear icon) or configure a GROQ_API_KEY in the server environment.'
    });
  }

  const selectedModel = model || 'llama-3.3-70b-versatile';

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: messages,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
      return res.status(response.status).json({ error: errorMessage });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Groq proxy error:', err);
    res.status(500).json({ error: `Server proxy error: ${err.message}` });
  }
});

// Wildcard route to handle client-side routing and serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` SentinelX AI Platform - Server Active            `);
  console.log(` Running on port: http://localhost:${PORT}        `);
  console.log(` Environment: Production                          `);
  console.log(`==================================================`);
});
