// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { createGlobalStyle } from '@pickestry/components'

export const GlobalStyle = createGlobalStyle(`
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
    overflow: hidden;
    min-width: 300px;
    min-height: 200px;
    height: 100%
  }

  #root {
    margin: 0 auto;
    height: 100%;
  }

  .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #000;
      z-index: 999;
      opacity: 0.4;
  }

  .dialog-overlay {
    background: rgba(0, 0, 0, 0.8);
    display: grid;
    place-items: start;
    z-index: 1000;
  }

  input, select, textarea, button {
    font-family: inherit;
    font-size: inherit;
  }

  #modal-el {
    display: grid;
    justify-items: start;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
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
`)
