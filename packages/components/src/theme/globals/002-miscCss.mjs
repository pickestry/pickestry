// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { css } from 'styled-components'

export const miscCss = css`
  html {
    font-size: 16px;
    height:100%;
  }

  body {
    font-family: 'Source Sans Pro', sans-serif;
    color: #212529;
    background: #efefef;
    background-size: cover;
    background-repeat: no-repeat;
    margin: 0;
  }

  input, select, textarea, button {
    font-family: inherit;
    font-size: inherit;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    position: absolute;
    opacity: 0;
    z-index: 1;
    background: rgba(222, 222, 222, .75);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-transition: opacity 0.5s 0.5s ease-out;
    transition: opacity 0.5s 0.5s ease-out;
  }

  ::-webkit-scrollbar-thumb {
    position: absolute;
    top: 0;
    left: 0;
    width: 8px;
    height: 8px;
    background: rgba(150, 150, 150, .5);
    border-radius: 4px;
  }

  [draggable=true] {
    cursor: move;
  }
`
