import axios from 'axios';

const hf_token = "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";

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const requestBody = JSON.parse(event.body);
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest',
      { inputs: requestBody.inputs },
      {
        headers: {
          Authorization: `Bearer ${hf_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Error:', error.message);
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ error: 'Failed to fetch data from Hugging Face' }),
    };
  }
};