import React, { useState, useCallback } from 'react';
import type { AnalysisResult } from './types';
import { analyzeText, rewriteText } from './services/geminiService';

// --- UI Helper Components (defined outside the main App component to prevent re-creation on re-renders) ---

const Header: React.FC = () => (
  <header className="text-center p-4 md:p-6">
    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white">
      妙笔生花
    </h1>
    <p className="text-md md:text-lg text-slate-600 dark:text-slate-300 mt-2">
      润色您的内容，轻松规避AI检测。
    </p>
  </header>
);

const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-4 my-8">
    <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="text-slate-500 dark:text-slate-400">AI正在全力创作中...</p>
  </div>
);

interface ResultCardProps {
  title: string;
  children: React.ReactNode;
}
const ResultCard: React.FC<ResultCardProps> = ({ title, children }) => (
  <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-md overflow-hidden w-full transition-all duration-300 ease-in-out">
    <div className="p-6">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  </div>
);


const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [textToCopy]);

  return (
    <button
      onClick={handleCopy}
      className={`absolute top-3 right-3 px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${
        copied
          ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
      }`}
    >
      {copied ? '已复制!' : '复制'}
    </button>
  );
};

const ConfidenceBar: React.FC<{ confidence: number }> = ({ confidence }) => {
  const percentage = Math.round(confidence * 100);
  let barColor = 'bg-green-500';
  if (percentage > 50) barColor = 'bg-yellow-500';
  if (percentage > 80) barColor = 'bg-red-500';

  return (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
      <div
        className={`h-4 rounded-full transition-all duration-500 ease-out ${barColor}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

// --- Main App Component ---

function App() {
  const [inputText, setInputText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [rewrittenText, setRewrittenText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      setError('请输入一些文本进行分析。');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setRewrittenText(null);

    try {
      const [analysis, rewritten] = await Promise.all([
        analyzeText(inputText),
        rewriteText(inputText),
      ]);
      setAnalysisResult(analysis);
      setRewrittenText(rewritten);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('发生未知错误。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 selection:bg-indigo-500/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />

        <main className="mt-8 space-y-8">
          <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg p-6">
            <label htmlFor="text-input" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
              在下方输入您的文本
            </label>
            <textarea
              id="text-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="在此粘贴AI生成的文本..."
              className="w-full h-48 p-4 bg-slate-100 dark:bg-slate-700 border-2 border-transparent focus:border-indigo-500 focus:ring-indigo-500 rounded-lg resize-y transition-colors duration-200"
              disabled={isLoading}
            />
            <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-slate-500">{inputText.length} 字符</p>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !inputText.trim()}
                    className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:dark:bg-slate-600 transition-all duration-200 transform hover:scale-105"
                >
                    {isLoading ? '处理中...' : '分析并优化'}
                </button>
            </div>
          </div>
          
          {isLoading && <Loader />}
          {error && <div className="bg-red-100 dark:bg-red-800/50 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-md" role="alert"><p>{error}</p></div>}
          
          {analysisResult && rewrittenText && !isLoading && (
            <div className="space-y-8 animate-fade-in">
              <ResultCard title="AI 内容分析">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600 dark:text-slate-300">AI 生成可能性</span>
                    <span className={`font-bold ${analysisResult.isAI ? 'text-red-500' : 'text-green-500'}`}>
                      {Math.round(analysisResult.confidence * 100)}%
                    </span>
                  </div>
                  <ConfidenceBar confidence={analysisResult.confidence} />
                   <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-700/50 border-l-4 border-indigo-400 rounded-r-md">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        <strong className="font-semibold text-slate-700 dark:text-slate-200">分析依据：</strong> {analysisResult.reasoning}
                    </p>
                  </div>
                </div>
              </ResultCard>

              <ResultCard title="优化后的文本">
                <div className="relative">
                  <textarea
                    readOnly
                    value={rewrittenText}
                    className="w-full h-56 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg resize-y border-none focus:ring-0"
                  />
                  <CopyButton textToCopy={rewrittenText} />
                </div>
              </ResultCard>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

// Add keyframes for animation in a style tag for simplicity.
// In a real-world app, this would be in a CSS file.
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);
