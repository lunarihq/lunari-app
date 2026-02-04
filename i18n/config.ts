import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { getLocales } from 'expo-localization';

const deviceLanguage = getLocales()[0]?.languageTag ?? getLocales()[0]?.languageCode ?? 'en';

const loadResources = resourcesToBackend((language: string, namespace: string) => {
  const lang =
    language === 'pt-PT'
      ? 'pt-PT'
      : language === 'pt-BR' || language === 'pt'
        ? 'pt-BR'
        : language.startsWith('es')
          ? 'es'
          : language;
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
    'pt-PT': {
      common: () => import('../locales/pt-PT/common.json'),
      onboarding: () => import('../locales/pt-PT/onboarding.json'),
      calendar: () => import('../locales/pt-PT/calendar.json'),
      settings: () => import('../locales/pt-PT/settings.json'),
      health: () => import('../locales/pt-PT/health.json'),
      home: () => import('../locales/pt-PT/home.json'),
      stats: () => import('../locales/pt-PT/stats.json'),
      info: () => import('../locales/pt-PT/info.json'),
      notifications: () => import('../locales/pt-PT/notifications.json'),
    },
    'pt-BR': {
      common: () => import('../locales/pt-BR/common.json'),
      onboarding: () => import('../locales/pt-BR/onboarding.json'),
      calendar: () => import('../locales/pt-BR/calendar.json'),
      settings: () => import('../locales/pt-BR/settings.json'),
      health: () => import('../locales/pt-BR/health.json'),
      home: () => import('../locales/pt-BR/home.json'),
      stats: () => import('../locales/pt-BR/stats.json'),
      info: () => import('../locales/pt-BR/info.json'),
      notifications: () => import('../locales/pt-BR/notifications.json'),
    },
  };

  return resources[lang]?.[namespace]?.();
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

