import React from "react";
import { palette } from '../customTheme'

export default ({ children, required }) => {
  return (
    <span>
      {required && <span style={{ color: palette.error.main }}>*&nbsp;</span>}
      {children}
    </span>)
}