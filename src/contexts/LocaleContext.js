import React, { createContext, useState } from "react";
import i18n from '../i18n'

const LocaleContext = createContext();

function LocaleProvider(props) {
  const [locale, setLocale] = useState(localStorage.getItem('locale') || 'zh-TW');

  const changeLocale = (locale) => {
    setLocale(locale);
    localStorage.setItem('locale', locale)
  };

  const value = {
    locale,
    t: i18n(locale),
    changeLocale,
  };

  return <LocaleContext.Provider value={value} {...props} />;
}

export { LocaleContext, LocaleProvider };