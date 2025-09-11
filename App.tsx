import React, { useState, useCallback, useEffect } from 'react';
import type { RewriteOptions, RewriteLength, RewriteFormat, RewriteTone, OutputLanguage } from './types';
import { rewriteText } from './services/geminiService';

// --- UI Helper Components ---

const Loader: React.FC = () => (
  <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 flex flex-col items-center justify-center gap-4 z-10">
    <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="text-slate-500 dark:text-slate-400">AI正在全力创作中...</p>
  </div>
);

// --- Rewrite Controls ---

const lengthOptions: { value: RewriteLength; label: string }[] = [
    { value: 'auto', label: '自动' }, { value: 'short', label: '短' }, { value: 'medium', label: '中等' }, { value: 'long', label: '长' }
];
const formatOptions: { value: RewriteFormat; label: string }[] = [
    { value: 'auto', label: '自动' }, { value: 'email', label: '电子邮件' }, { value: 'message', label: '消息' }, { value: 'comment', label: '评论' }, { value: 'paragraph', label: '段落' }, { value: 'article', label: '文章' }, { value: 'blog', label: '博客文章' }, { value: 'ideas', label: '想法' }, { value: 'outline', label: '大纲' }, { value: 'twitter', label: '推特' }, { value: 'polish', label: '润色' }, { value: 'voiceover', label: '口播文案' }, { value: 'wechat', label: '公众号文章' }, { value: 'bio', label: '简介' }, { value: 'poster', label: '海报文案' }, { value: 'redbook', label: '小红书风格' }, { value: 'expand', label: '扩写' }, { value: 'shorten', label: '简写' }
];
const toneOptions: { value: RewriteTone; label: string }[] = [
    { value: 'auto', label: '自动' }, { value: 'friendly', label: '友善' }, { value: 'casual', label: '随意' }, { value: 'approachable', label: '友好' }, { value: 'professional', label: '专业' }, { value: 'witty', label: '诙谐' }, { value: 'funny', label: '有趣' }, { value: 'formal', label: '正式' }, { value: 'ai_practitioner', label: '普通AI从业者' }
];
const languageOptions: { value: OutputLanguage; label: string }[] = [
    { value: 'zh', label: '中文 (简体)' }, { value: 'en', label: 'English' }
];

const ControlSection: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col gap-3">
    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
    {children}
  </div>
);

const OptionButton: React.FC<{
    onClick: () => void;
    isSelected: boolean;
    disabled: boolean;
    children: React.ReactNode;
}> = ({ onClick, isSelected, disabled, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800
            ${isSelected
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'
                : 'bg-slate-200/70 text-slate-600 hover:bg-slate-300/70 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-600/50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
    >
        {children}
    </button>
);

const RewriteControls: React.FC<{
  options: RewriteOptions;
  setOptions: React.Dispatch<React.SetStateAction<RewriteOptions>>;
  disabled: boolean;
}> = ({ options, setOptions, disabled }) => {
  const handleOptionChange = <K extends keyof RewriteOptions>(key: K, value: RewriteOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <ControlSection label="长度">
        <div className="flex flex-wrap gap-2">
            {lengthOptions.map(opt => (
                <OptionButton key={opt.value} onClick={() => handleOptionChange('length', opt.value)} isSelected={options.length === opt.value} disabled={disabled}>{opt.label}</OptionButton>
            ))}
        </div>
      </ControlSection>
      <ControlSection label="格式">
        <div className="flex flex-wrap gap-2">
            {formatOptions.map(opt => (
                <OptionButton key={opt.value} onClick={() => handleOptionChange('format', opt.value)} isSelected={options.format === opt.value} disabled={disabled}>{opt.label}</OptionButton>
            ))}
        </div>
      </ControlSection>
       <ControlSection label="语气">
        <div className="flex flex-wrap gap-2">
            {toneOptions.map(opt => (
                <OptionButton key={opt.value} onClick={() => handleOptionChange('tone', opt.value)} isSelected={options.tone === opt.value} disabled={disabled}>{opt.label}</OptionButton>
            ))}
        </div>
      </ControlSection>
      <ControlSection label="输出语言">
          <select
              value={options.outputLanguage}
              onChange={(e) => handleOptionChange('outputLanguage', e.target.value as OutputLanguage)}
              disabled={disabled}
              className="w-full max-w-48 px-3 py-2 text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
          >
              {languageOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
      </ControlSection>
    </div>
  );
};

// --- Main App Component ---

function App() {
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSubmit]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 selection:bg-indigo-500/20">
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
        
        {/* Left Panel: Input */}
        <div className="flex flex-col h-full bg-white dark:bg-slate-800/50 p-6 md:p-8 overflow-y-auto pb-28">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">写作内容</h2>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="告诉我该写点什么，按 ⌘+Enter 生成。"
            className="w-full flex-grow p-4 bg-slate-100 dark:bg-slate-700/50 border-2 border-transparent focus:border-indigo-500 focus:ring-0 rounded-lg resize-none transition-colors duration-200 text-base"
            disabled={isLoading}
            aria-label="Text to rewrite"
          />
          <div className="mt-6">
            <RewriteControls options={rewriteOptions} setOptions={setRewriteOptions} disabled={isLoading} />
          </div>
        </div>

        {/* Right Panel: Preview */}
        <div className="relative flex flex-col h-full p-6 md:p-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">预览</h2>
                <button 
                  onClick={handleSubmit} 
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  重试
                </button>
            </div>
          <div className="relative flex-grow flex flex-col bg-slate-100 dark:bg-slate-800/50 rounded-xl shadow-inner">
            {isLoading && <Loader />}
            {error && <div className="p-4 text-red-600 dark:text-red-400" role="alert"><p>{error}</p></div>}
            {!isLoading && !error && (
                <textarea
                    readOnly
                    value={rewrittenText}
                    placeholder="生成的内容将显示在这里..."
                    className="w-full h-full p-4 bg-transparent rounded-lg resize-none border-none focus:ring-0 text-base"
                    aria-label="Rewritten text"
                />
            )}
          </div>
        </div>

      </div>

       {/* Footer Action Button */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-transparent pointer-events-none">
        <div className="container mx-auto flex justify-center">
            <button
                onClick={handleSubmit}
                disabled={isLoading || !inputText.trim()}
                className="pointer-events-auto px-8 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:dark:bg-slate-600 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275z"></path></svg>
                {isLoading ? '生成中...' : '生成'}
                <span className="text-xs opacity-70">⌘⏎</span>
            </button>
        </div>
      </footer>
    </div>
  );
}

export default App;