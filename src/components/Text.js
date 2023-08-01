import React from "react";
import { palette } from '../customTheme'

export default ({ children, required, style }) => {
  return (
    <span style={{ ...style }}>
      {required && <span style={{ color: palette.error.main }}>*&nbsp;</span>}
      {children}
    </span>)
}