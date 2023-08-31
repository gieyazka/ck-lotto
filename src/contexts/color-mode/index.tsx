import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "BoonBaanRegular",
  },
  palette: {
    mode: "light",
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#00D1FF",
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#FF5555",
      // dark: will be calculated from palette.secondary.main,
      contrastText: "#FFFFFF",
    },

    contrastThreshold: 3,

    tonalOffset: 0.2,
  },
});

const darkTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: "dark",
  },
});

type ColorModeContextType = {
  mode: string;
  setMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
);

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const colorModeFromLocalStorage = localStorage.getItem("colorMode");
  const isSystemPreferenceDark = window?.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const systemPreference = isSystemPreferenceDark ? "dark" : "light";
  const [mode, setMode] = useState(
    colorModeFromLocalStorage || systemPreference
  );

  useEffect(() => {
    window.localStorage.setItem("colorMode", mode);
  }, [mode]);

  const setColorMode = () => {
    if (mode === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };

  return (
    <ColorModeContext.Provider
      value={{
        setMode: setColorMode,
        mode,
      }}
    >
      <ThemeProvider
        // you can change the theme colors here. example: mode === "light" ? RefineThemes.Magenta : RefineThemes.MagentaDark
        theme={mode === "light" ? theme : darkTheme}
      >
        <div className={`${mode === "light" ? "" : "dark"}`}>{children}</div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
