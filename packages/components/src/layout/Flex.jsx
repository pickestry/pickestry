// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import styled from 'styled-components'

export const Flex = styled.div`
  display: flex;
  justify-content: ${({ $justifyContent = 'space-between' }) => $justifyContent};
  flex-direction: ${({ $direction = 'row' }) => $direction};
  gap: 4px;
`
