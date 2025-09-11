// Helper to detect Chinese characters
export const isChinese = (text: string): boolean => /[\u4e00-\u9fa5]/.test(text);
