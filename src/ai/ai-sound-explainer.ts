'use server';

/**
 * @fileOverview An AI chat assistant that explains JR8CH's sound and releases.
 *
 * - aiSoundExplainer - A function that handles the sound explanation process.
 * - AISoundExplainerInput - The input type for the aiSoundExplainer function.
 * - AISoundExplainerOutput - The return type for the aiSoundExplainer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISoundExplainerInputSchema = z.object({
  query: z.string().describe('The user query about JR8CH sound or releases.'),
  release_id: z.string().optional().describe('The ID of the release to provide context.'),
  genre: z.string().optional().describe('The genre of the release.'),
  lufs: z.number().optional().describe('The LUFS (Loudness Units Relative to Full Scale) of the release.'),
  bpm: z.number().optional().describe('The BPM (beats per minute) of the release.'),
  key: z.string().optional().describe('The key of the release.'),
});
export type AISoundExplainerInput = z.infer<typeof AISoundExplainerInputSchema>;

const AISoundExplainerOutputSchema = z.object({
  answer: z.string().describe('The AI assistant answer to the user query.'),
});
export type AISoundExplainerOutput = z.infer<typeof AISoundExplainerOutputSchema>;

export async function aiSoundExplainer(input: AISoundExplainerInput): Promise<AISoundExplainerOutput> {
  return aiSoundExplainerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSoundExplainerPrompt',
  input: {schema: AISoundExplainerInputSchema},
  output: {schema: AISoundExplainerOutputSchema},
  prompt: `You are an AI assistant specialized in explaining the sound and releases of the artist JR8CH.

  Your goal is to provide informative and engaging answers to users' questions about JR8CH's music.

  Here is some context about the release, if available:
  Release ID: {{release_id}}
  Genre: {{genre}}
  LUFS: {{lufs}}
  BPM: {{bpm}}
  Key: {{key}}

  Now, answer the following question:
  {{query}}`,
});

const aiSoundExplainerFlow = ai.defineFlow(
  {
    name: 'aiSoundExplainerFlow',
    inputSchema: AISoundExplainerInputSchema,
    outputSchema: AISoundExplainerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
