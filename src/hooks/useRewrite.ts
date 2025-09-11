import { useState, useCallback } from 'react';
import type { RewriteOptions } from '../types';
import { rewriteText } from '../services/geminiService';

export const useRewrite = () => {
  const [inputText, setInputText] = useState<string>('');
  const [rewriteOptions, setRewriteOptions] = useState<RewriteOptions>({
    length: 'auto',
    format: 'auto',
    tone: 'auto',
    outputLanguage: 'zh',
  });
  const [rewrittenText, setRewrittenText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!inputText.trim() || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const rewritten = await rewriteText(inputText, rewriteOptions);
      setRewrittenText(rewritten);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('发生未知错误。');
      }
      setRewrittenText(''); // Clear previous results on error
    } finally {
      setIsLoading(false);
    }
  }, [inputText, rewriteOptions, isLoading]);

  return {
    inputText,
    setInputText,
    rewriteOptions,
    setRewriteOptions,
    rewrittenText,
    isLoading,
    error,
    handleSubmit,
  };
};
