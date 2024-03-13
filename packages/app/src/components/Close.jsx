// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { cssPointer } from '@pickestry/components'
import styled from 'styled-components'
import XIcon from 'assets/x.svg'

export const Close = styled(XIcon)`
  fill: #eee;
  stroke: ${({theme: { palette: {primary}}}) => primary.main};

  ${cssPointer}
`
