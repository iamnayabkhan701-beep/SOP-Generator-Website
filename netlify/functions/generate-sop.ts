import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { category, theme, structure, formData } = body;

    if (!formData || !formData.title) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required SOP information: title is required.' }),
      };
    }

    const apiKey = process.env.AI_API_KEY;
    const provider = process.env.AI_PROVIDER || 'gemini';
    const model = process.env.AI_MODEL || (provider === 'gemini' ? 'gemini-1.5-pro' : 'gpt-4o-mini');

    // If an external AI API key is configured, invoke the provider
    if (apiKey) {
      if (provider === 'gemini') {
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const prompt = `You are an expert enterprise SOP specialist. Generate a comprehensive, professional, structured Standard Operating Procedure for:
Title: ${formData.title}
Category: ${category}
Structure: ${structure}
Company: ${formData.companyName || 'Enterprise'}
Department: ${formData.department || 'Operations'}
Purpose: ${formData.purpose || ''}
Scope: ${formData.scope || ''}
Responsibilities: ${formData.responsibilities || ''}
Procedure: ${formData.procedureDetails || ''}
Tools & Systems: ${formData.requiredTools || ''}
Safety & Risk: ${formData.safetyRisk || ''}
Quality Checks: ${formData.qualityChecks || ''}
Documentation: ${formData.documentationRecords || ''}
Standards & References: ${formData.references || ''}

Output ONLY valid JSON matching this exact structure:
{
  "documentTitle": "${formData.title}",
  "organization": "${formData.companyName || 'Enterprise'}",
  "metadata": {
    "sopId": "${formData.sopId || `SOP-${category.toUpperCase().slice(0, 3)}-101`}",
    "version": "${formData.version || '1.0'}",
    "effectiveDate": "${formData.effectiveDate || new Date().toISOString().split('T')[0]}",
    "department": "${formData.department || 'Operations'}",
    "preparedBy": "${formData.preparedBy || 'Operations Lead'}",
    "reviewedBy": "${formData.reviewedBy || 'Quality Manager'}",
    "approvedBy": "${formData.approvedBy || 'Vice President of Operations'}"
  },
  "executiveSummary": "...",
  "disclaimer": "OFFICIAL STANDARD OPERATING PROCEDURE.",
  "sections": [
    {
      "id": "sec-1",
      "title": "1. Purpose & Objectives",
      "type": "text",
      "content": "..."
    }
  ]
}`;

        const geminiRes = await fetch(geminiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return {
              statusCode: 200,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parsed),
            };
          }
        }
      } else if (provider === 'openai') {
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model || 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: 'You are an expert enterprise SOP documentation architect. Output only structured JSON matching the requested SOP schema.',
              },
              {
                role: 'user',
                content: `Generate a comprehensive SOP for ${formData.title} in department ${category} for ${formData.companyName}. Procedure details: ${formData.procedureDetails}. Required tools: ${formData.requiredTools}. Safety: ${formData.safetyRisk}. Quality: ${formData.qualityChecks}.`,
              },
            ],
          }),
        });

        if (openaiRes.ok) {
          const openaiData = await openaiRes.json();
          const content = openaiData.choices?.[0]?.message?.content;
          if (content) {
            return {
              statusCode: 200,
              headers: { 'Content-Type': 'application/json' },
              body: content,
            };
          }
        }
      }
    }

    // Fallback if no external AI API key is configured yet
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'fallback_ready',
        message: 'Configured server-side endpoint acknowledged request.',
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error?.message || 'Server error generating SOP' }),
    };
  }
};

