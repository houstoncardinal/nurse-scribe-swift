import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { prompt } = JSON.parse(event.body || '{}');

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required' }),
      };
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      console.error('OpenAI API key not found in environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'OpenAI API key not configured' }),
      };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert nursing documentation specialist with extensive knowledge of clinical documentation standards, medical terminology, and nursing best practices. 

CORE CAPABILITIES:
- Generate professional, accurate, and comprehensive nursing notes
- Follow established templates (SOAP, SBAR, PIE, DAR, Epic EMR) with precision
- Use proper medical terminology and nursing language
- Include specific measurements, times, and objective data
- Provide actionable nursing interventions and assessments
- Ensure HIPAA compliance and patient safety focus
- Generate situation-specific content based on input context
- Create detailed, clinically relevant documentation

MEDICAL EXPERTISE:
- Advanced knowledge of pathophysiology and nursing care
- Understanding of medication administration and monitoring
- Expertise in assessment techniques and clinical reasoning
- Knowledge of evidence-based nursing practices
- Familiarity with healthcare regulations and standards

OUTPUT FORMAT REQUIREMENTS (CRITICAL):
- ALWAYS format your response with clear section headers followed by colons
- Example for SOAP: "Subjective: [content]" then "Objective: [content]" etc.
- Example for SBAR: "Situation: [content]" then "Background: [content]" etc.
- Each section header must be on its own line followed by a colon
- Do NOT use markdown formatting (**, ##) for section headers
- Use plain text with section headers like "Section Name: content here"
- Separate sections with blank lines for clarity

CONTENT REQUIREMENTS:
- Use professional medical terminology
- Include specific measurements and vital signs
- Provide detailed nursing assessments
- Suggest appropriate interventions
- Include patient education components
- Ensure clinical accuracy and relevance
- Follow proper documentation format
- Maintain professional tone throughout

Generate comprehensive, professional nursing documentation that demonstrates clinical expertise and follows best practices. ALWAYS use the exact section header format specified above.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 3000,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', response.status, errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: `OpenAI API error: ${response.status} ${response.statusText}`,
          details: errorData.error?.message || 'Unknown error'
        }),
      };
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: data.choices[0].message.content,
        usage: data.usage,
      }),
    };

  } catch (error) {
    console.error('Error in generate-note function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

export { handler };
