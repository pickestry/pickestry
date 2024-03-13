// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import styled from 'styled-components'

export const ButtonLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: ${({theme: { palette: { text } }}) => text.invert};
  text-decoration: underline;
  cursor: pointer;
`
