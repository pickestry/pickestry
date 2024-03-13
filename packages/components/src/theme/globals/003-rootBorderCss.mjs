// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { css } from 'styled-components'

export const rootBorderCss = css`
  :root {
    --boxShadow-thin: inset 0 0 0 max(1px, 0.0625rem);
    --boxShadow-thick: inset 0 0 0 max(2px, 0.125rem);
    --boxShadow-thicker: inset 0 0 0 max(4px, 0.25rem);
    --borderWidth-thin: max(1px, 0.0625rem);
    --borderWidth-thick: max(2px, 0.125rem);
    --borderWidth-thicker: max(4px, 0.25rem);
    --borderRadius-small: 0.1875rem;
    --borderRadius-medium: 0.375rem;
    --borderRadius-large: 0.75rem;
    --borderRadius-full: 624.9375rem;
    --outline-focus-offset: -0.125rem;
    --outline-focus-width: 0.125rem;
  }
`
