import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import commonEN from '../locales/en/common.json';
import onboardingEN from '../locales/en/onboarding.json';
import calendarEN from '../locales/en/calendar.json';
import settingsEN from '../locales/en/settings.json';
import healthEN from '../locales/en/health.json';
import homeEN from '../locales/en/home.json';
import statsEN from '../locales/en/stats.json';
import infoEN from '../locales/en/info.json';

import commonES from '../locales/es/common.json';
import onboardingES from '../locales/es/onboarding.json';
import calendarES from '../locales/es/calendar.json';
import settingsES from '../locales/es/settings.json';
import healthES from '../locales/es/health.json';
import homeES from '../locales/es/home.json';
import statsES from '../locales/es/stats.json';
import infoES from '../locales/es/info.json';

const resources = {
  en: {
    common: commonEN,
    onboarding: onboardingEN,
    calendar: calendarEN,
    settings: settingsEN,
    health: healthEN,
    home: homeEN,
    stats: statsEN,
    info: infoEN,
  },
  es: {
    common: commonES,
    onboarding: onboardingES,
    calendar: calendarES,
    settings: settingsES,
    health: healthES,
    home: homeES,
    stats: statsES,
    info: infoES,
  },
};

const deviceLanguage = getLocales()[0]?.languageCode || 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage,
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v3',
});

export default i18n;

