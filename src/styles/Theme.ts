import createTheme from "@mui/material/styles/createTheme";

const baseTheme = createTheme({})

const theTheme = {
  mainPaper: {
    [baseTheme.breakpoints.down('sm')]: {
      p: 8, display: 'flex', gap: '1em', padding: "1em", margin: 0,
    },
    [baseTheme.breakpoints.up('sm')]: {
      p: 8, display: 'flex', gap: '1em', borderRadius: "16px", maxWidth: "600px", minWidth: "600px"
    },
  },
  centered: {
    margin: "0 auto",
    textAlign: "center",
  },
}

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    },
    theTheme: typeof theTheme
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    },
    theTheme?: typeof theTheme
  }
}

export const theme = createTheme({
  theTheme: theTheme,
});