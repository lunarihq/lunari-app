import * as Localization from 'expo-localization';
import dayjs from 'dayjs';
import i18n from '../i18n/config';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import 'dayjs/locale/de';
import 'dayjs/locale/it';
import 'dayjs/locale/pt';
import 'dayjs/locale/ja';
import 'dayjs/locale/ko';
import 'dayjs/locale/zh';

let cachedLocale: string | null = null;

export const getDeviceLocale = (): string => {
  if (cachedLocale) {
    return cachedLocale;
  }

  const locales = Localization.getLocales();
  const primaryLocale = locales[0];

  cachedLocale = primaryLocale.languageCode || 'en';

  try {
    dayjs.locale(cachedLocale);
  } catch {
    console.log('Locale not available for dayjs, falling back to en');
    cachedLocale = 'en';
    dayjs.locale('en');
  }

  return cachedLocale;
};

export const getLocaleInfo = () => {
  const locales = Localization.getLocales();
  const primaryLocale = locales[0];
  
  return {
    languageCode: primaryLocale.languageCode,
    languageTag: primaryLocale.languageTag,
    regionCode: primaryLocale.regionCode,
  };
};

export const formatDateLong = (date: Date | string): string => {
  getDeviceLocale();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(Localization.getLocales()[0].languageTag, {
    day: 'numeric',
    month: 'long',
  });
};

export const formatDateShort = (date: Date | string): string => {
  getDeviceLocale();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(Localization.getLocales()[0].languageTag, {
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateWithDay = (date: Date | string): string => {
  getDeviceLocale();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(Localization.getLocales()[0].languageTag, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (date: Date): string => {
  const localeTag = Localization.getLocales()[0].languageTag;
  
  return date.toLocaleTimeString(localeTag, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDayjsDate = (dateString: string, format?: string): string => {
  getDeviceLocale();
  
  if (format) {
    return dayjs(dateString).format(format);
  }
  
  return dayjs(dateString).format('LL');
};

export const formatTodayOrDate = (dateString: string): string => {
  getDeviceLocale();
  const localeTag = Localization.getLocales()[0].languageTag;
  const dateObj = new Date(dateString);
  const isToday = dateString === dayjs().format('YYYY-MM-DD');
  
  if (isToday) {
    const monthDay = dateObj.toLocaleDateString(localeTag, {
      month: 'long',
      day: 'numeric',
    });
    return `${i18n.t('common:time.today')}, ${monthDay}`;
  }
  
  return dateObj.toLocaleDateString(localeTag, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTodayShort = (date: Date): string => {
  getDeviceLocale();
  const monthDay = date.toLocaleDateString(Localization.getLocales()[0].languageTag, {
    month: 'short',
    day: 'numeric',
  });
  
  return `${i18n.t('common:time.today')}, ${monthDay}`;
};

getDeviceLocale();

