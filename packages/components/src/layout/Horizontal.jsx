// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import styled from 'styled-components'
import { Flex } from './Flex.jsx'

const Horizontal = styled(Flex)`
  flex-direction: row
`

const Item = styled.div`
`

export const H = Object.assign(Horizontal, { Item: Item })
