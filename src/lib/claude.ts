import Anthropic from '@anthropic-ai/sdk';

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

if (!apiKey) {
  console.warn('Missing Anthropic API key - AI features will be disabled');
}

export const anthropic = apiKey ? new Anthropic({ apiKey, dangerouslyAllowBrowser: true }) : null;

export async function translateMessage(text: string, targetLanguage: string = 'en'): Promise<string> {
  if (!anthropic) return text;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Translate this message to ${targetLanguage}. Return ONLY the translation, no explanation:\n\n${text}`
      }]
    });

    const content = message.content[0];
    return content.type === 'text' ? content.text : text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

export async function summarizeChat(messages: string[]): Promise<string> {
  if (!anthropic || messages.length === 0) return '';

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Summarize this conversation in 2-3 sentences:\n\n${messages.join('\n\n')}`
      }]
    });

    const content = message.content[0];
    return content.type === 'text' ? content.text : '';
  } catch (error) {
    console.error('Summarization error:', error);
    return '';
  }
}
