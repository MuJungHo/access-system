import {
  validateAccount,
  validateEmail,
  validatePassword,
  validateIP,
  validatePort
} from './validate'

export const emailErrorMsg = email => {
  if (email.trim().length === 0) return 0
  if (!validateEmail(email)) return 1
  return ''
}

export const accountErrorMsg = account => {
  if (account.trim().length === 0) return 0
  if (!validateAccount(account)) return 1
  return ''
}

export const passwordErrorMsg = password => {
  if (password.trim().length === 0) return 0
  if (!validatePassword(password)) return 1
  return ''
}

export const confirmPasswordErrorMsg = (password, confirmPassword) => {
  if (confirmPassword.trim().length === 0) return 0
  if (confirmPassword !== password) return 999
  return ''
}

export const IPErrorMsg = ip => {
  if (ip.trim().length === 0) return 0
  if (!validateIP(ip)) return 1
  return ''
}

export const portErrorMsg = port => {
  if (port.trim().length === 0) return 0
  if (!validatePort(port)) return 1
  return ''
}