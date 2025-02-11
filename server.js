const express = require('express');
const axios = require('axios');
const cors = require('cors');
app.use(express.json());

const app = express();

// Enable CORS with specific origin
app.use(cors({
  origin: 'http://18.223.159.118:3000', // Your frontend IP
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Endpoint to fetch keywords and phrases for a given role and company
app.post('/keywords', async (req, res) => {
  const { company, role } = req.body;

  try {
    const prompt = `For a "${role}" at ${company}, list the most important technical skills, soft skills, and key phrases relevant to the role. Provide a valid JSON response with the following format:
    {
      "technical_skills": ["Skill1", "Skill2"],
      "soft_skills": ["Skill1", "Skill2"],
      "important_phrases": ["Phrase1", "Phrase2"]
    }
    Ensure the JSON is valid and does not contain any additional text.`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const responseContent = response.data.choices[0].message.content;
    console.log('Raw GPT Response for Keywords:', responseContent);

    const jsonMatch = responseContent.match(/\{.*\}/s);
    if (!jsonMatch) {
      throw new Error('No JSON found in the response.');
    }

    const keywords = JSON.parse(jsonMatch[0]);
    res.json(keywords);
  } catch (err) {
    console.error('Error fetching keywords and phrases:', err);
    res.status(500).send('Failed to fetch keywords and phrases');
  }
});

app.listen(5001, () => console.log('Server running on port 5001'));
