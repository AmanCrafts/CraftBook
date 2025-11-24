import COLORS from "../constants/colors";

// Light theme
export const lightTheme = {
  // Background colors
  background: {
    primary: "#ffffff",
    secondary: "#f5f5f5",
    tertiary: "#e0e0e0",
  },

  // Text colors
  text: {
    primary: "#333333",
    secondary: "#666666",
    tertiary: "#999999",
    inverse: "#ffffff",
  },

  // Brand colors
  brand: {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    accent: COLORS.accent,
  },

  // Status colors
  status: {
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error,
    info: COLORS.info,
  },

  // UI Element colors
  ui: {
    border: "#e0e0e0",
    shadow: "rgba(0, 0, 0, 0.1)",
    disabled: "#cccccc",
    placeholder: "#999999",
  },
};

// Dark theme
export const darkTheme = {
  // Background colors
  background: {
    primary: "#1a1a1a",
    secondary: "#2d2d2d",
    tertiary: "#404040",
  },

  // Text colors
  text: {
    primary: "#f5f5f5",
    secondary: "#cccccc",
    tertiary: "#999999",
    inverse: "#1a1a1a",
  },

  // Brand colors
  brand: {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    accent: COLORS.accent,
  },

  // Status colors
  status: {
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error,
    info: COLORS.info,
  },

  // UI Element colors
  ui: {
    border: "#404040",
    shadow: "rgba(0, 0, 0, 0.3)",
    disabled: "#666666",
    placeholder: "#666666",
  },
};

// Typography
export const typography = {
  fonts: {
    regular: "System",
    medium: "System",
    bold: "System",
    light: "System",
  },

  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    huge: 32,
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// Border radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

// Default export
export default {
  light: lightTheme,
  dark: darkTheme,
  typography,
  spacing,
  borderRadius,
  shadows,
};
