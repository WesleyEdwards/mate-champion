import { CssVarsThemeOptions } from "@mui/joy";
import { Palette, PaletteOptions } from "@mui/joy/styles/types/colorSystem";

const palette: Partial<Palette> = {
  mode: "light",
  primary: {
    50: "#e8f5e9",
    100: "#c8e6c9",
    200: "#a5d6a7",
    300: "#81c784",
    400: "#66bb6a",
    500: "#4caf50", // Main Green
    600: "#43a047",
    700: "#388e3c",
    800: "#2e7d32",
    900: "#1b5e20",
    plainColor: "#4caf50",
    plainHoverBg: "#43a047",
    plainActiveBg: "#388e3c",
    plainDisabledColor: "#b2dfdb",
    outlinedColor: "#4caf50",
    outlinedBorder: "#4caf50",
    outlinedHoverBg: "#32383e",
    outlinedHoverBorder: "#66bb6a",
    outlinedActiveBg: "#c8e6c9",
    outlinedDisabledColor: "#b2dfdb",
    outlinedDisabledBorder: "#b2dfdb",
    softColor: "#4caf50",
    softBg: "#e8f5e9",
    softHoverBg: "#c8e6c9",
    softActiveBg: "#a5d6a7",
    softDisabledColor: "#b2dfdb",
    softDisabledBg: "#f1f8e9",
    solidColor: "#ffffff",
    solidBg: "#4caf50",
    solidHoverBg: "#43a047",
    solidActiveBg: "#388e3c",
    solidDisabledColor: "#787878",
    solidDisabledBg: "#0a4e0d",
    mainChannel: "76, 175, 80",
    lightChannel: "118, 255, 123",
    darkChannel: "46, 125, 50",
  },
  //   neutral: {
  //     50: "#f5f5f5",
  //     100: "#eeeeee",
  //     200: "#e0e0e0",
  //     300: "#bdbdbd",
  //     400: "#9e9e9e",
  //     500: "#757575",
  //     600: "#616161",
  //     700: "#424242",
  //     800: "#212121",
  //     900: "#1a1a1a",
  //     plainHoverColor: "#757575",
  //     outlinedHoverColor: "#757575",
  //     softHoverColor: "#757575",
  //   },
  //   danger: {
  //     // Define shades of red for the danger palette
  //   },
  //   success: {
  //     // Define shades of green for the success palette
  //   },
  //   warning: {
  //     // Define shades of yellow for the warning palette
  //   },
  //   background: {
  //     // Define background colors
  //   },
  //   common: {
  //     // Define common colors
  //   },
  //   text: {
  //     // Define text colors
  //   },
};

export const mateTheme: CssVarsThemeOptions = {
  fontFamily: {
    body: "Courier New,Courier,monospace",
    display: "Courier New,Courier,monospace",
  },
  colorSchemes: {
    dark: {
      palette: palette,
    },
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
        },
      },
    },
  },
};
