import 'react-i18next';
import common from '../locales/en/common.json';
import onboarding from '../locales/en/onboarding.json';
import calendar from '../locales/en/calendar.json';
import settings from '../locales/en/settings.json';
import health from '../locales/en/health.json';
import home from '../locales/en/home.json';
import stats from '../locales/en/stats.json';
import info from '../locales/en/info.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      onboarding: typeof onboarding;
      calendar: typeof calendar;
      settings: typeof settings;
      health: typeof health;
      home: typeof home;
      stats: typeof stats;
      info: typeof info;
    };
  }
}

