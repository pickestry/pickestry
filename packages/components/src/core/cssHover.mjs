// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { css } from 'styled-components'
import { pointer } from './params.mjs'

export const cssHover = css`
  &:hover {
    background: ${({ theme }) => theme.palette.highlight};
    ${pointer}
  }
`
