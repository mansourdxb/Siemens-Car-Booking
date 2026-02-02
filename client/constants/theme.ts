import { Platform } from "react-native";

const siemensPrimary = "#0066B2";
const siemensPrimaryDark = "#004A87";
const siemensAccent = "#00897B";
const siemensBackground = "#F5F7FA";
const siemensSurface = "#FFFFFF";
const siemensSurfaceVariant = "#E8ECF1";
const siemensTextPrimary = "#1A2332";
const siemensTextSecondary = "#5F6E7F";
const siemensError = "#D32F2F";
const siemensWarning = "#F57C00";
const siemensSuccess = "#00897B";
const siemensDisabled = "#B0BEC5";

export const StatusColors = {
  available: "#00897B",
  reserved: "#F57C00",
  checked_out: "#0066B2",
  maintenance: "#D32F2F",
  returned: "#00897B",
  cancelled: "#B0BEC5",
};

export const Colors = {
  light: {
    text: siemensTextPrimary,
    textSecondary: siemensTextSecondary,
    buttonText: "#FFFFFF",
    tabIconDefault: siemensTextSecondary,
    tabIconSelected: siemensPrimary,
    link: siemensPrimary,
    linkPressed: siemensPrimaryDark,
    backgroundRoot: siemensBackground,
    backgroundDefault: siemensSurface,
    backgroundSecondary: siemensSurfaceVariant,
    backgroundTertiary: "#D9E2EC",
    surface: siemensSurface,
    surfaceVariant: siemensSurfaceVariant,
    primary: siemensPrimary,
    primaryDark: siemensPrimaryDark,
    accent: siemensAccent,
    error: siemensError,
    warning: siemensWarning,
    success: siemensSuccess,
    disabled: siemensDisabled,
    border: siemensSurfaceVariant,
    cardBorder: "rgba(0, 0, 0, 0.06)",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#4DA6FF",
    link: "#4DA6FF",
    linkPressed: "#0066B2",
    backgroundRoot: "#0D1117",
    backgroundDefault: "#161B22",
    backgroundSecondary: "#21262D",
    backgroundTertiary: "#30363D",
    surface: "#161B22",
    surfaceVariant: "#21262D",
    primary: "#4DA6FF",
    primaryDark: "#0066B2",
    accent: "#4DB6AC",
    error: "#EF5350",
    warning: "#FFB74D",
    success: "#4DB6AC",
    disabled: "#6E7681",
    border: "#30363D",
    cardBorder: "rgba(255, 255, 255, 0.08)",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  full: 9999,
};

export const Typography = {
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: "700" as const,
  },
  h1: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  subhead: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
};

export const Shadows = {
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
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  fab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
