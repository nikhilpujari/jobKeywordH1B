const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // To load environment variables

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins (or specify your frontend URL for production)
app.use(express.json()); // To handle JSON requests

// Secure API Key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Endpoint to fetch keywords and phrases for a given role and company
app.post('/keywords', async (req, res) => {
  const { company, role } = req.body;

  if (!company || !role) {
    return res.status(400).json({ error: 'Company and role are required.' });
  }

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
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const responseContent = response.data.choices[0].message.content;
    console.log('Keywords Response:', responseContent); // Log for debugging

    // Extract JSON using regex (validate response)
    const jsonMatch = responseContent.match(/\{.*\}/s);
    if (!jsonMatch) {
      throw new Error('No JSON found in the response.');
    }

    const keywords = JSON.parse(jsonMatch[0]);
    res.json(keywords);
  } catch (err) {
    console.error('Error fetching keywords and phrases:', err);
    res.status(500).json({ error: 'Failed to fetch keywords and phrases' });
  }
});

// Endpoint for H1B1 information
app.post('/h1b1', async (req, res) => {
  const { company } = req.body;

  if (!company) {
    return res.status(400).json({ error: 'Company name is required' });
  }

  try {
    const prompt = `Find H1B1 information for the number of applications, rejected, accepted, and median salary at ${company}. Return only a valid JSON response with the following format:
    [
      {
        "applications": "Applications",
        "accepted": "Accepted",
        "rejected": "Rejected",
        "salary": "Salary"
      }
    ]
    Ensure the JSON is valid and does not contain any additional text. If you are unable to find the information just replace each field to NA`;

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
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const responseContent = response.data.choices[0].message.content;
    console.log('H1B1 Response:', responseContent); // Log for debugging

    // Extract JSON using regex (validate response)
    const jsonMatch = responseContent.match(/\[.*\]/s);
    if (!jsonMatch) {
      throw new Error('No JSON found in the response.');
    }

    const h1b1Info = JSON.parse(jsonMatch[0]);
    res.json(h1b1Info);
  } catch (err) {
    console.error('Error fetching H1B1 information:', err);
    res.status(500).json({ error: 'Failed to fetch H1B1 information' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
