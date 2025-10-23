import i18n, { use as i18nUse, init as i18nInit } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

const resources = {
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

const deviceLanguage = getLocales()[0]?.languageCode || 'en';

const loadLanguageResources = async (language: string) => {
  const languageResources = resources[language as keyof typeof resources];
  if (!languageResources) return {};

  const loadedResources: Record<string, any> = {};
  
  for (const [namespace, importFn] of Object.entries(languageResources)) {
    try {
      const module = await importFn();
      loadedResources[namespace] = module.default || module;
    } catch (error) {
      console.warn(`Failed to load ${namespace} for ${language}:`, error);
    }
  }
  
  return loadedResources;
};

const initializeI18n = async () => {
  const initialResources = await loadLanguageResources(deviceLanguage);
  
  // Configure i18next
  i18nUse(initReactI18next);
  
  // Initialize with resources
  await i18nInit({
    resources: {
      [deviceLanguage]: initialResources,
    },
    lng: deviceLanguage,
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  });
};

initializeI18n();

export const loadLanguage = async (language: string) => {
  if (i18n.hasResourceBundle(language, 'common')) {
    return;
  }
  
  const languageResources = await loadLanguageResources(language);
  
  for (const [namespace, translations] of Object.entries(languageResources)) {
    i18n.addResourceBundle(language, namespace, translations);
  }
};

export default i18n;

