
export interface AnalysisResult {
  isAI: boolean;
  confidence: number;
  reasoning: string;
}

export type RewriteLength = 'auto' | 'short' | 'medium' | 'long';
export type RewriteFormat = 'auto' | 'email' | 'message' | 'comment' | 'paragraph' | 'article' | 'blog' | 'ideas' | 'outline' | 'twitter' | 'polish' | 'voiceover' | 'wechat' | 'bio' | 'poster' | 'redbook' | 'expand' | 'shorten';
export type RewriteTone = 'auto' | 'friendly' | 'casual' | 'approachable' | 'professional' | 'witty' | 'funny' | 'formal' | 'ai_practitioner';
export type OutputLanguage = 'zh' | 'en';

export interface RewriteOptions {
  length: RewriteLength;
  format: RewriteFormat;
  tone: RewriteTone;
  outputLanguage: OutputLanguage;
}