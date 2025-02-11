const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // To handle JSON requests

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
          'Authorization': 'Bearer secret-api',
          'Content-Type': 'application/json',
        },
      }
    );

    const responseContent = response.data.choices[0].message.content;
    console.log('Raw GPT Response for Keywords:', responseContent); // Log response for debugging

    // Extract and parse the JSON part
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

// Endpoint for H1B1 information
app.post('/h1b1', async (req, res) => {
  const { company } = req.body;

  try {
    const prompt = `Perform a web search on h1bgrader.com to find H1B1 information for the number of applications, rejected, accepted, and median salary at ${company}. Return only a valid JSON response with the following format:
    [
      {
        "applications": "Applications",
        "accepted": "Accepted",
        "rejected": "Rejected",
        "salary": "Salary"
      }
    ]
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
          'Authorization': 'Bearer secret-api',
          'Content-Type': 'application/json',
        },
      }
    );

    const responseContent = response.data.choices[0].message.content;
    console.log('H1B1 Information Response:', responseContent); // Log raw response for debugging

    // Extract and parse the JSON part
    const jsonMatch = responseContent.match(/\[.*\]/s);
    if (!jsonMatch) {
      throw new Error('No JSON found in the response.');
    }

    const h1b1Info = JSON.parse(jsonMatch[0]);
    res.json(h1b1Info);
  } catch (err) {
    console.error('Error fetching H1B1 information:', err);
    res.status(500).send('Failed to fetch H1B1 information');
  }
});

app.listen(5001, () => console.log('Server running on port 5001'));
