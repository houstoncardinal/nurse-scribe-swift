/**
 * AI composition engine with fallback to mock generator
 */

import { NoteTemplate, getTemplate, formatPrompt } from './templates';

export interface ComposeResult {
  note: string;
  template: NoteTemplate;
  usedAI: boolean;
  model?: string;
  error?: string;
}

/**
 * Compose a clinical note using OpenAI or fallback to mock
 */
export async function composeNote(
  transcript: string,
  template: NoteTemplate
): Promise<ComposeResult> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (apiKey && apiKey.trim() !== '') {
    try {
      return await composeWithOpenAI(transcript, template, apiKey);
    } catch (error) {
      console.warn('OpenAI failed, falling back to mock:', error);
      return composeMock(transcript, template);
    }
  }

  return composeMock(transcript, template);
}

/**
 * Compose using OpenAI API
 */
async function composeWithOpenAI(
  transcript: string,
  template: NoteTemplate,
  apiKey: string
): Promise<ComposeResult> {
  const templateConfig = getTemplate(template);
  const userPrompt = formatPrompt(template, transcript);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: templateConfig.systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const note = data.choices[0]?.message?.content || 'No response generated';

  return {
    note,
    template,
    usedAI: true,
    model: 'gpt-4o-mini',
  };
}

/**
 * Mock composer for demo/testing without API key
 */
function composeMock(transcript: string, template: NoteTemplate): ComposeResult {
  const templateConfig = getTemplate(template);
  
  // Generate a deterministic but reasonable-looking note
  const sections = templateConfig.sections;
  const words = transcript.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  let note = `# ${templateConfig.displayName}\n\n`;
  
  sections.forEach((section, idx) => {
    note += `## ${section}\n`;
    
    // Distribute content across sections
    const start = Math.floor((idx / sections.length) * wordCount);
    const end = Math.floor(((idx + 1) / sections.length) * wordCount);
    const sectionWords = words.slice(start, end);
    
    if (sectionWords.length > 0) {
      // Create 2-3 sentences per section
      const sentenceSize = Math.max(5, Math.floor(sectionWords.length / 2));
      
      for (let i = 0; i < sectionWords.length; i += sentenceSize) {
        const sentence = sectionWords.slice(i, i + sentenceSize).join(' ');
        if (sentence.length > 0) {
          note += `- ${sentence.charAt(0).toUpperCase() + sentence.slice(1)}\n`;
        }
      }
    } else {
      note += `- [No specific ${section.toLowerCase()} information provided]\n`;
    }
    
    note += '\n';
  });

  note += '\n---\n*Generated in No-PHI Pilot Mode (Mock AI - add VITE_OPENAI_API_KEY for real AI)*\n';

  return {
    note,
    template,
    usedAI: false,
  };
}

/**
 * Estimate time saved vs manual documentation
 * Based on typical nursing documentation times
 */
export function estimateTimeSaved(
  transcriptLength: number,
  noteLength: number
): number {
  // Typical manual documentation: 5-10 minutes for comprehensive note
  // AI-assisted: 1-2 minutes including dictation and review
  
  const manualMinutes = 7; // Average
  const aiAssistedMinutes = 1.5; // Average
  
  return manualMinutes - aiAssistedMinutes; // ~5.5 minutes saved
}
