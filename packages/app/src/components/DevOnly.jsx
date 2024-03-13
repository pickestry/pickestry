// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { utils } from '@pickestry/utils'
import FrownIcon from 'assets/frown.svg'

export const DevOnly = ({entity}) => {
  return __DEV__ && <Root title={utils.devOnly(entity)}><Frown /></Root>
}

const Root = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
`

export const Frown = styled(FrownIcon)`
  fill: #eee;
  stroke: ${({theme: { palette: {primary}}}) => primary.main};
`

