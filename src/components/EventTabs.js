import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/EventTabs.css';

const EventTabs = ({ activeTab, onTabChange }) => {
  const { i18n } = useTranslation();
  
  const tabs = [
    { id: 'canyon-clash', label: '⚔️ Canyon Clash', icon: '⚔️' },
    { id: 'capital-clash', label: '🏰 Capital Clash', icon: '🏰' },
    { id: 'ava-buster', label: '💥 AvA Buster Day', icon: '💥' },
    { id: 'world-watch', label: '🌍 World Watch', icon: '🌍' }
  ];

  return (
    <div className="event-tabs-container">
      <div className="event-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`event-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            title={tab.label}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="language-selector-navbar">
        <button className={`lang-btn-navbar ${i18n.language === 'en' ? 'active' : ''}`} onClick={() => i18n.changeLanguage('en')} title="English">🇬🇧</button>
        <button className={`lang-btn-navbar ${i18n.language === 'es' ? 'active' : ''}`} onClick={() => i18n.changeLanguage('es')} title="Español">🇪🇸</button>
        <button className={`lang-btn-navbar ${i18n.language === 'fr' ? 'active' : ''}`} onClick={() => i18n.changeLanguage('fr')} title="Français">🇫🇷</button>
        <button className={`lang-btn-navbar ${i18n.language === 'de' ? 'active' : ''}`} onClick={() => i18n.changeLanguage('de')} title="Deutsch">🇩🇪</button>
        <button className={`lang-btn-navbar ${i18n.language === 'ja' ? 'active' : ''}`} onClick={() => i18n.changeLanguage('ja')} title="日本語">🇯🇵</button>
        <button className={`lang-btn-navbar ${i18n.language === 'ko' ? 'active' : ''}`} onClick={() => i18n.changeLanguage('ko')} title="한국어">🇰🇷</button>
        <button className={`lang-btn-navbar ${i18n.language === 'zh' ? 'active' : ''}`} onClick={() => i18n.changeLanguage('zh')} title="简体中文">🇨🇳</button>
        <button className={`lang-btn-navbar ${i18n.language === 'zh-TW' ? 'active' : ''}`} onClick={() => i18n.changeLanguage('zh-TW')} title="繁體中文">🇹🇼</button>
      </div>
    </div>
  );
};

export default EventTabs;
