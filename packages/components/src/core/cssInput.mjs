// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { css } from 'styled-components'

export const cssInputBase = css`
  display: block;
  background: white;
  font-size: 1rem;
  letter-spacing: ${({theme: { input: { letterSpacing = '0' } }}) => letterSpacing};
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 8px;
  line-height: 1.42857143;
  color: ${({ theme }) => theme.palette.text.main};
  border-radius: 4px;
  outline: 0;
  border: 1px solid ${({ theme }) => theme.palette.grey.light};

  &.disabled {
    background-color: ${({ theme }) => theme.palette.grey.lighter};
  }

  &:focus {
    border: 1px solid ${({ $error, theme: { palette } }) => $error ? palette.danger.main : palette.primary.main};
    ${({theme}) => theme.shadow}
  }

  & + & {
    margin-top: 16px;
  }

  &.error {
    border: 1px solid ${({ theme: { palette } }) => palette.danger.main};
  }
`

export const cssInput = css`
  height: 37px;
  width: ${({ width = '100%' }) => width};
`
