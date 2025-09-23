import {CssVarsThemeOptions} from "@mui/joy"
import {Palette, PaletteOptions} from "@mui/joy/styles/types/colorSystem"

const palette: Partial<Palette> = {
  mode: "dark",
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
    plainHoverBg: "#171A1C",
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
    darkChannel: "46, 125, 50"
  }
}

export const mateTheme: CssVarsThemeOptions = {
  fontFamily: {
    body: "Courier New,Courier,monospace",
    display: "Courier New,Courier,monospace"
  },
  colorSchemes: {
    light: {
      palette: palette
    },
    dark: {
      palette: palette
    }
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: {
          borderRadius: "20px"
        }
      }
    }
  }
}
