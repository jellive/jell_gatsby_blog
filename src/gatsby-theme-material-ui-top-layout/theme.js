// import { createMuiTheme } from "@material-ui/core";

// const theme = createMuiTheme({
//   typography: {
//     fontFamily: [
//         'Montserrat',
//         'sans-serif'
//       ].join(','),
//     },
//       palette: {
//         type: 'dark',
//       },
//   });

// export default theme;
import { createMuiTheme, colors } from "@material-ui/core";

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: `#556cd6`,
    },
    secondary: {
      main: `#19857b`,
    },
    error: {
      main: colors.red.A400,
    },
    background: {
      default: `#fff`,
    },
  },
});

export default theme;