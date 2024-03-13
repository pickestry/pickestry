// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { css } from 'styled-components'

const defaultShadow = css`
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08),
    0 2px 5px 0 rgba(19, 72, 137, 0.1),
    0 0 0 0 rgba(48, 48, 48, 0.03);
`

const textBaseSize = '16px'

export const defaultTheme = {
  palette: {
    common: {
      black: '#222831',
      white: '#ffffff'
    },
    text: {
      main: '#212529',
      invert: '#ffffff'
    },
    primary: {
      main: '#085394',
      invert: '#ffffff',
      light: '#1866E1',
      lighter: '#e6eef5',
      tint: 'rgba(0, 48, 87, 0.3)'
    },
    secondary: {
      main: '#1B7AFF',
      light: '#F7D084'
    },
    success: {
      main: '#198754',
      light: '#badbcc',
      lighter: '#d1e7dd'
    },
    danger: {
      main: '#842029',
      light: '#f5c2c7',
      lighter: '#f8d7da'
    },
    info: {
      main: '#055160',
      light: '#b6effb',
      lighter: '#cff4fc'
    },
    warn: {
      main: '#664d03',
      light: '#ffecb5',
      lighter: '#fff3cd'
    },
    grey: {
      main: 'gray',
      light: '#ccc',
      lighter: '#eee'
    },
    highlight: '#FFEEBA',
    textMuted: '#919191'
  },
  typo: {
    baseSize: textBaseSize
  },
  shadow: defaultShadow,
  closeIcon: 'X',
  menuIcon: '...',
  input: {
    letterSpacing: '0.30px'
  },
  components: {
    dialog: {
      contentMargin: 'calc(10vh) auto',
      contentPadding: '15px',
      headerBorderBottomColor: '#eee',
      headerFontSize: 'large',
      headerFontStyle: 'normal',
      headerFontWeight: 600,
      headerMargin: '8px 0 9px 0',
      headerPadding: '0 75px 8px 0',
      maxHeight: 'calc(91vh - 40px)'
    },
    filter: {
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: 'inherit',
      padding: '4px',
      margin: 'inherit',
      moreBackgroundColor: 'white',
      moreBorder: 'inherit',
      moreBorderRadius: 'inherit',
      morePadding: '12px 8px 0 4px',
      moreMargin: 'inherit',
      activeBorder: '1px solid #ddd',
      activeBorderRadius: '4px',
      activePadding: '5px 4px 0 4px'
    },
    frame: {
      margin: '4px',
      padding: '4px',
      borderRadius: '4px',
      borderShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.08), 0 2px 5px 0 rgba(19, 72, 137, 0.1), 0 0 0 0 rgba(48, 48, 48, 0.03)',
      border: 'inherit',
      minHeight: 'auto',
      height: 'fit-content'
    },
    modal: {
      margin: 'calc(20vh) auto',
      padding: '8px'
    },
    paginator: {
      backgroundColor: 'inherit',
      margin: '0',
      padding: '0'
    },
    panel: {
      actionsMargin: '0',
      headerMargin: '0px 0 8px 0',
      headerPadding: '8px 0 0 0',
      headerBorderBottomColor: '#eee',
      headerFontSize: '21px',
      headerFontStyle: 'normal',
      headerFontWeight: 400,
      titlePadding: '0 0 8px 0',
      titleMargin: '0',
      bodyFontStyle: 'normal',
      bodyFontWeight: 400,
      bodySize: 'normal'
    },
    stacked: {
      itemHeight: '27px'
    },
    table: {
      border: 'initial',
      borderRadius: 'initial',
      backgroundColor: 'initial',
      margin: 'initial',
      padding: 'initial',
      thFontWeight: '400',
      thPadding: '0 0 4px 0',
      thBorderBottom: '1px solid #cecece',
      trBorderBottom: '1px solid #efefef',
      tdPadding: '8px 4px',
      minHeight: 'calc(42vh)'
    },
    list: {
      itemPadding: '4px'
    },
    items: {
      border: '1px solid #cecece'
    }
  }
}
