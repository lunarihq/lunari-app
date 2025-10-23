import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { getLocales } from 'expo-localization';

const deviceLanguage = getLocales()[0]?.languageCode || 'en';

const loadResources = resourcesToBackend((language: string, namespace: string) => {
  const resources: Record<string, Record<string, () => Promise<any>>> = {
    en: {
      common: () => import('../locales/en/common.json'),
      onboarding: () => import('../locales/en/onboarding.json'),
      calendar: () => import('../locales/en/calendar.json'),
      settings: () => import('../locales/en/settings.json'),
      health: () => import('../locales/en/health.json'),
      home: () => import('../locales/en/home.json'),
      stats: () => import('../locales/en/stats.json'),
      info: () => import('../locales/en/info.json'),
      notifications: () => import('../locales/en/notifications.json'),
    },
    es: {
      common: () => import('../locales/es/common.json'),
      onboarding: () => import('../locales/es/onboarding.json'),
      calendar: () => import('../locales/es/calendar.json'),
      settings: () => import('../locales/es/settings.json'),
      health: () => import('../locales/es/health.json'),
      home: () => import('../locales/es/home.json'),
      stats: () => import('../locales/es/stats.json'),
      info: () => import('../locales/es/info.json'),
      notifications: () => import('../locales/es/notifications.json'),
    },
  };

  return resources[language]?.[namespace]?.();
});

// Initialize i18n with lazy-loaded translations
// eslint-disable-next-line import/no-named-as-default-member
i18n.use(loadResources).use(initReactI18next).init({
  lng: deviceLanguage,
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: [
    'common',
    'onboarding',
    'calendar',
    'settings',
    'health',
    'home',
    'stats',
    'info',
    'notifications',
  ],
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export default i18n;

