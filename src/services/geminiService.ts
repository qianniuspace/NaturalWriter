import { GoogleGenAI } from "@google/genai";
import type { RewriteOptions } from '../types';
import { isChinese } from "../utils/textUtils";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


export const rewriteText = async (text: string, options: RewriteOptions): Promise<string> => {
  const { length, format, tone, outputLanguage } = options;
  const isOutputChinese = outputLanguage === 'zh';

  const instructions: string[] = [];

  // Base Instruction
  instructions.push(
    isOutputChinese
      ? '核心任务：请将以下文本进行深度重写和优化，使其读起来完全像人类写就，能够规避AI检测。请运用多变的句式、精准的词汇和自然的行文节奏，避免AI常用的陈词滥调和生硬的表达。'
      : 'Core Task: Perform a deep rewrite of the following text to make it sound completely human-written and bypass AI detection. Use varied sentence structures, precise vocabulary, and a natural rhythm. Avoid common AI clichés and robotic phrasing.'
  );

  // Tone Instruction
  if (tone !== 'auto') {
    const toneMap = {
      zh: { friendly: '友善', casual: '随意', approachable: '友好', professional: '专业', witty: '诙谐', funny: '有趣', formal: '正式', ai_practitioner: '普通AI从业者' },
      en: { friendly: 'friendly', casual: 'casual', approachable: 'approachable', professional: 'professional', witty: 'witty', funny: 'funny', formal: 'formal', ai_practitioner: 'like an average AI practitioner' }
    };
    instructions.push(
      isOutputChinese
        ? `语气需调整为“${toneMap.zh[tone]}”。`
        : `The tone should be ${toneMap.en[tone]}.`
    );
  }

  // Format Instruction
  if (format !== 'auto') {
     const formatMap = {
      zh: { email: '电子邮件', message: '消息', comment: '评论', paragraph: '段落', article: '文章', blog: '博客文章', ideas: '想法', outline: '大纲', twitter: '推特', polish: '润色', voiceover: '口播文案', wechat: '公众号文章', bio: '简介', poster: '海报文案', redbook: '小红书风格', expand: '扩写', shorten: '简写' },
      en: { email: 'email', message: 'message', comment: 'comment', paragraph: 'paragraph', article: 'article', blog: 'blog post', ideas: 'ideas', outline: 'outline', twitter: 'Twitter post', polish: 'polished text', voiceover: 'voiceover script', wechat: 'WeChat article', bio: 'bio', poster: 'poster copy', redbook: 'Little Red Book style post', expand: 'expanded text', shorten: 'shortened text' }
    };
    instructions.push(
      isOutputChinese
        ? `请将内容改写为“${formatMap.zh[format]}”格式。`
        : `Rewrite the content into a "${formatMap.en[format]}" format.`
    );
  }

  // Length Instruction
  if (length !== 'auto') {
    const lengthMap = {
      zh: { short: '一个短段落', medium: '中等长度', long: '一篇长文' },
      en: { short: 'a short paragraph', medium: 'medium length', long: 'a long-form piece' }
    };
    instructions.push(
      isOutputChinese
        ? `输出长度应为“${lengthMap.zh[length]}”。`
        : `The output length should be about ${lengthMap.en[length]}.`
    );
  }

  const finalPrompt = `${instructions.join('\n')}

${isOutputChinese ? '请直接输出重写后的文本，不要添加任何额外的说明。' : 'Output only the rewritten text, with no extra explanations.'}

${isOutputChinese ? '待改写文本:' : 'Text to rewrite:'}
---
${text}
---
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
      config: {
        temperature: 0.75,
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error during text rewriting:", error);
    throw new Error("Failed to rewrite text. Please try again.");
  }
};