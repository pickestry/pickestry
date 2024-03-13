// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { css } from 'styled-components'

// 1. Parameters
export const variables = {
  bline: '6px',
  m: '4px',
  p: '4px',
  fontSizeBase: '16px',
  fontSizeLarge: '18px',
  fontSizeSmall: '14px'
}

export const pointer = css`
  cursor: pointer;
  cursor: hand;
`

export const center = css`
  display: block;
  margin: 0 auto;
`
export const defaultBorderRadius = css`
  border-radius: 4px;
`

export const defaultShadow = css`
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08), 0 2px 5px 0 rgba(19, 72, 137, 0.1), 0 0 0 0 rgba(48, 48, 48, 0.03);
`

export const defaultBackground = css`
  background: white;
`
