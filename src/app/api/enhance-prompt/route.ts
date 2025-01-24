import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a creative assistant that helps enhance prompts and generate social media content. 
          For each prompt, provide an enhanced version, create an engaging Instagram caption, suggest relevant hashtags, 
          and recommend a fitting song that matches the mood or theme.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      functions: [
        {
          name: 'generateEnhancedContent',
          description: 'Generate enhanced content from the user prompt',
          parameters: {
            type: 'object',
            properties: {
              originalPrompt: {
                type: 'string',
                description: 'The original prompt provided by the user',
              },
              enhancedPrompt: {
                type: 'string',
                description:
                  'An enhanced, more detailed version of the original prompt',
              },
              instagramCaption: {
                type: 'string',
                description:
                  'An engaging Instagram caption based on the prompt',
              },
              tags: {
                type: 'array',
                items: { type: 'string' },
                description: 'Relevant hashtags for social media',
              },
              musicRecommendation: {
                type: 'object',
                properties: {
                  songTitle: { type: 'string' },
                  artist: { type: 'string' },
                },
                required: ['songTitle', 'artist'],
                description:
                  'A song recommendation that matches the prompt theme',
              },
            },
            required: [
              'originalPrompt',
              'enhancedPrompt',
              'instagramCaption',
              'tags',
              'musicRecommendation',
            ],
          },
        },
      ],
      function_call: { name: 'generateEnhancedContent' },
    });

    const functionCall = completion.choices[0].message.function_call;
    if (functionCall && functionCall.arguments) {
      const result = JSON.parse(functionCall.arguments);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: 'Failed to generate structured output' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance prompt' },
      { status: 500 }
    );
  }
}
