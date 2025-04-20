const axios = require('axios');

const hf_token = "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";

exports.handler = async (event, context) => {
  console.log('Function invoked:', { method: event.httpMethod, body: event.body });

  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    if (!event.body) {
      console.log('No request body provided');
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const requestBody = JSON.parse(event.body);
    if (!requestBody.inputs) {
      console.log('Missing inputs in request body:', requestBody);
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing "inputs" in request body' }),
      };
    }

    console.log('Making Hugging Face API request:', requestBody.inputs);
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest',
      { inputs: requestBody.inputs },
      {
        headers: {
          Authorization: `Bearer ${hf_token}`,
          'Content-Type': 'application/json',
        },
        timeout: 8000, // 8-second timeout to avoid Netlify's 10-second limit
      }
    );

    console.log('Hugging Face API response:', response.data);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Function error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack,
    });
    return {
      statusCode: error.response?.status || 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        error: 'Failed to fetch data from Hugging Face',
        details: error.message,
      }),
    };
  }
};

