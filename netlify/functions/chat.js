exports.handler = async (event, context) => {
  console.log('🚀 FUNCTION STARTED');
  console.log('📊 Environment check:');
  console.log('  - OPENROUTER_API_KEY exists:', !!process.env.OPENROUTER_API_KEY);
  console.log('  - REACT_APP_OPENROUTER_API_KEY exists:', !!process.env.REACT_APP_OPENROUTER_API_KEY);
  console.log('📨 Request method:', event.httpMethod);
  
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === 'OPTIONS') {
    console.log('✅ CORS preflight handled');
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.REACT_APP_OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error('❌ NO API KEY FOUND');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "API key missing" })
      };
    }

    console.log('✅ API key found, length:', apiKey.length);
    
    const requestBody = JSON.parse(event.body || '{}');
    console.log('📋 Request received');

    console.log('🌐 Calling OpenRouter API...');
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://xistai.netlify.app',
        'X-Title': 'Xist AI Platform'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📡 OpenRouter status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenRouter error:', response.status, errorText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: "OpenRouter API failed",
          status: response.status,
          details: errorText
        })
      };
    }

    const data = await response.json();
    console.log('✅ OpenRouter success');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('💥 Function error:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
