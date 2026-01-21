import {flow} from 'genkit';
import {ai} from '../genkit';
import {z} from 'zod';

export const explainSoundFlow = flow(
  {
    name: 'explainSoundFlow',
    inputSchema: z.object({
      query: z.string(),
      release_context: z.string().optional(),
    }),
    outputSchema: z.string(),
  },
  async ({query, release_context}) => {
    const prompt = `You are an AI assistant for the electronic music artist JR8CH. Your persona is knowledgeable, slightly futuristic, and passionate about music technology.

    Your goal is to answer questions from fans about JR8CH's music, sound design, and releases.

    Keep your answers concise and engaging. Use markdown for formatting if it helps clarity.
    
    Artist info: JR8CH is a Drum & Bass producer known for a "kinetic" and "aggressive" future sound. He uses a lot of complex sound design and focuses on high-energy tracks.

    ${release_context ? `Context for this query: ${release_context}` : ''}

    User Question: "${query}"

    Answer:
    `;
    
    const llmResponse = await ai.generate({
      prompt: prompt,
      config: {
        temperature: 0.5,
      },
    });

    return llmResponse.text();
  }
);
