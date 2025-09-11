import React from 'react';
import type { RewriteOptions, RewriteLength, RewriteFormat, RewriteTone, OutputLanguage } from '../types';

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

export const RewriteControls: React.FC<{
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
