// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { createGlobalStyle as createGlobalStyleLib } from 'styled-components'
import { resetCss } from './001-resetCss.mjs'
import { miscCss } from './002-miscCss.mjs'
import { rootBorderCss } from './003-rootBorderCss.mjs'
import { rootSizeCss } from './003-rootSizeCss.mjs'
import { rootTypographyCss } from './003-rootTypographyCss.mjs'


export const createGlobalStyle = (moreCss = '') => {
  return createGlobalStyleLib`
    ${resetCss}
    ${miscCss}
    ${rootBorderCss}
    ${rootSizeCss}
    ${rootTypographyCss}
    ${moreCss}
  `
}
