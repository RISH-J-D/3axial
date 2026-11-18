import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ru', label: 'Русский' },
  { code: 'hi', label: 'हिन्दी' },
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const current = i18n.language || 'en';
  const change = (code: string) => {
    i18n.changeLanguage(code);
  };
  return (
    <div className="relative inline-block" aria-label="Language selector">
      <select
        value={current}
        onChange={(e) => change(e.target.value)}
        className="rounded border border-line bg-white px-2 py-1 text-sm"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
};
