import React, { useEffect } from 'react';
import { useRewrite } from './hooks/useRewrite';
import { RewriteControls } from './components/RewriteControls';
import { Loader } from './components/Loader';

function App() {
  const {
    inputText,
    setInputText,
    rewriteOptions,
    setRewriteOptions,
    rewrittenText,
    isLoading,
    error,
    handleSubmit,
  } = useRewrite();

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
                  <svg xmlns="http://www.w.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
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
