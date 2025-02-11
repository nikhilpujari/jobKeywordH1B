const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // To load environment variables
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { Readable } = require('stream');
const csv = require('csv-parser');

const app = express();
const PORT = process.env.PORT || 5001;

// AWS S3 Configuration using AWS SDK v3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = 'jobhunt-s3';  // Replace with your bucket name
const CSV_KEY = 'Consolidated_Employer_Data.csv';  // Replace with your CSV file name

// Middleware
const cors = require('cors');

app.use(cors({
  origin: ['http://18.223.159.118:3000'],  // Allow your frontend domain/IP
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,  // If needed for authentication
}));

app.use(express.json()); // To handle JSON requests

// Secure API Key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Utility to search for a company in the CSV
function searchCompany(companyName, callback) {
  let totals = {
    initialApproval: 0,
    initialDenial: 0,
    continuingApproval: 0,
    continuingDenial: 0,
  };

  const lowerCompanyName = companyName.toLowerCase();

  const params = {
    Bucket: BUCKET_NAME,
    Key: CSV_KEY,
  };

  // Fetch the CSV file from S3
  s3.send(new GetObjectCommand(params))
    .then((data) => {
      const stream = Readable.from(data.Body);
      stream
        .pipe(csv())
        .on('data', (row) => {
          if (row['Employer (Petitioner) Name'].toLowerCase().includes(lowerCompanyName)) {
            totals.initialApproval += parseInt(row['Initial Approval']) || 0;
            totals.initialDenial += parseInt(row['Initial Denial']) || 0;
            totals.continuingApproval += parseInt(row['Continuing Approval']) || 0;
            totals.continuingDenial += parseInt(row['Continuing Denial']) || 0;
          }
        })
        .on('end', () => {
          callback(totals);
        })
        .on('error', (err) => {
          console.error('Error reading CSV:', err);
          callback(totals);  // Return empty results on error
        });
    })
    .catch((err) => {
      console.error('Error fetching CSV from S3:', err);
      callback(totals);  // Return empty results on error
    });
}

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
app.post('/h1b1', (req, res) => {
  const { company } = req.body;

  if (!company) {
    return res.status(400).json({ error: 'Company name is required' });
  }

  searchCompany(company, (totals) => {
    res.json(totals);
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
