// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { css } from 'styled-components'

export const indexCss = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    font-family: "DejaVu Serif", " DejaVu Sans Mono", serif, monospace;
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

  #modal-el {
    display: grid;
    justify-items: start;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }

  body {
    margin: 0;
    padding-bottom: 200px;
    font-size: 16px;
  }

  nav {
    background: #edeff7;
    position: fixed;
    left: 0;
    bottom: 0;
    top: 0;
    width: 10rem;
    overflow-y: auto;
    padding-bottom: 1rem;
    border-right: 1px solid #ccc;
  }

  nav h2 {
    margin-left: 1rem;
  }

  nav ul {
    list-style-type: none;
    padding: 0;
  }

  nav button {
    width: 100%;
    text-align: left;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0;
    padding-left: 2rem;
    background: none;
  }

  .home-button {
    font-size: 2rem;
    font-weight: bold;
    margin-top: 1rem;
    text-decoration: none;
    color: black;
  }

  .new-button {
    background: royalblue;
    width: max-content;
    text-decoration: none;
    color: white;
    font-size: 1.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }

  .nav-top {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    margin-left: 1.5rem;
    gap: 0.5rem;
  }

  .nav-link {
    display: block;
    text-decoration: none;
    margin-left: 2rem;
    margin-right: 1rem;
    font-size: 1.125rem;
    padding: 0.25rem 0;
    color: #646870;
    text-transform: capitalize;
  }

  .nav-link:visited {
    color: #646870;
  }

  h1 {
    font-size: 3rem;
  }

  h5 {
    margin: 32px 0 8px 0;
    font-size: 16px;
    font-weight: 600;
  }

  p {
    margin: 4px 0 8px;
  }

  main {
    overflow: auto;
    height: 100%;
    margin-left: 10rem;
  }

  .reference {
    display: grid;
    place-items: center;
    width: 160px;
    height: 160px;
    background: #ed4f73;
    color: white;
  }

  .floating {
    display: grid;
    place-items: center;
    background: turquoise;
    width: 80px;
    height: 80px;
  }

  .arrow {
    width: 15px;
    height: 15px;
    background: yellow;
  }

  .container {
    border: 1px solid black;
    display: grid;
    place-items: center;
    width: 700px;
    height: 500px;
    margin-bottom: 1rem;
  }

  .container[data-flexible] {
    width: 100%;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    width: 700px;
    background: #edeff7;
    padding: 16px;
  }

  .controls button {
    all: unset;
    text-align: center;
    background: royalblue;
    padding: 8px;
    color: white;
    font-size: 1.125rem;
    border-radius: 4px;
    width: 200px;
  }

  .controls button:hover {
    background: navy;
  }

  .controls button:focus-visible {
    outline: 2px solid black;
  }

  .scroll {
    display: grid;
    place-items: center;
    overflow: scroll;
    background: #edeff7;
    border: 1px solid;
    width: 450px;
    height: 450px;
  }

  .scroll::before {
    content: '';
    display: block;
    width: 1px;
    height: 750px;
  }

  .scroll::after {
    content: '';
    display: block;
    width: 1px;
    height: 750px;
  }

  .scroll[data-x]::before,
  .scroll[data-x]::after {
    width: 1500px;
  }

  .scroll-indicator {
    background: #edeff726;
    z-index: 10;
    width: fit-content;
    padding: 5px;
    border-radius: 5px;
    display: none;
  }

  .prose {
    font-size: 1.125rem;
    color: #555;
    line-height: 1.75;
  }

  @keyframes scale {
    from {
      transform: scale(0.5);
    }

    to {
      transform: scale(1.25);
    }
  }

  @media (max-width: 600px) {
    nav {
      display: none;
    }

    main {
      margin: 0;
      padding: 0 1rem;
    }
  }

  .dialog-overlay {
    background: rgba(0, 0, 0, 0.8);
    display: grid;
    place-items: start;
    z-index: 1000;
  }
`
