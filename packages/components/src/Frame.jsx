// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import styled from 'styled-components'
import { css } from 'styled-components'

const border = css`
  border: ${({ theme: { components: { frame } } }) => frame.border};
  border-radius: ${({ theme: { components: { frame } } }) => frame.borderRadius};
  box-shadow:  ${({ theme: { components: { frame } } }) => frame.borderShadow};
`

export const Frame = styled.div`
  background-color: ${({ $bare = false, theme }) => $bare ? 'transparent' : theme.palette.common.white};
  margin: ${({ theme: { components: { frame } } }) => frame.margin};
  padding: ${({ theme: { components: { frame } } }) => frame.padding};
  min-height:  ${({theme: { components: { frame } }}) => frame.minHeight};
  height:  ${({theme: { components: { frame } }}) => frame.height};

  ${({ $bare = false }) => $bare ? null : border }
`
