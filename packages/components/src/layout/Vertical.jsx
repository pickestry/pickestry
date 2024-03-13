// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import styled from 'styled-components'
import { Flex } from './Flex.jsx'

const Vertical = styled(Flex)`
  flex-direction: column
`

const Item = styled.div`
`

export const V = Object.assign(Vertical, { Item: Item })
