// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import styled from 'styled-components'
import { css } from 'styled-components'

const cssButtonBase = css`
  align-items: center;
  background-color: initial;
  border: var(--borderWidth-thin, max(1px, 0.0625rem)) solid;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  font-size: var(--text-body-size-medium, 0.875rem);
  font-weight: var(--base-text-weight-medium, 500);
  justify-content: space-between;
  min-width: max-content;
  padding: 0 var(--control-medium-paddingInline-normal, 0.75rem);
  user-select: none;
  height: var(--control-small-size, 1.75rem);
  padding: 0 var(--control-small-paddingInline-normal, 0.75rem);
  height: var(--control-normal-size, 1.75rem);
  padding: 0 var(--control-medium-paddingInline-normal, 0.75rem);

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.6;
  }
`

const cssPrimary = css`
  fill: white;
  background-color: ${({theme: { palette: { primary } }}) => primary.main};
  border-color: ${({theme: { palette: { primary } }}) => primary.main};
  box-shadow: var(--shadow-resting-small, var(--color-btn-primary-shadow));
  color: ${({theme: { palette: { text } }}) => text.invert};
`

const cssSuccess = css`
  fill: white;
  background-color: ${({theme: { palette: { success } }}) => success.main};
  border-color: ${({theme: { palette: { success } }}) => success.main};
  box-shadow: var(--shadow-resting-small, var(--color-btn-primary-shadow));
  color: ${({theme: { palette: { text } }}) => text.invert};
`

const cssSmall = css`
  font-size: var(--text-body-size-small, 0.75rem);
  gap: var(--control-small-gap, 0.25rem);
  height: var(--control-small-size, 1.75rem);
  padding: 0 var(--control-small-paddingInline-condensed, 0.5rem);
`

export const Button = styled.button`
  ${cssButtonBase}

  ${({ small = false }) => small && cssSmall }

  ${({ primary = false }) => primary && cssPrimary }

  ${({ success = false }) => success && cssSuccess }
`

export const SubmitButton = styled.input.attrs({ type: 'submit'})`
  ${cssButtonBase}
  ${cssPrimary}
`
