import zh from './zh-TW.json'
import en from './en.json'
export default (locale) => (key, arg = {}) => {
  let result = {
    'zh-TW': zh[key],
    'en': en[key]
  }[locale]
  if (Object.keys(arg).length > 0) {
    for (let i = 0; i <= Object.keys(arg).length; i++) {
      result = result.replace(`{{${Object.keys(arg)[i]}}}`, arg[Object.keys(arg)[i]])
    }
  }
  return result
}