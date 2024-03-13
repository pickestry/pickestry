// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import styled from 'styled-components'
import { Label } from '../misc/index.mjs'
import { TextDanger } from '../misc/index.mjs'
import { Muted } from '../misc/index.mjs'
import { cssNoSelect } from '../core/index.mjs'

export const FormGroup = styled.div`
  width: ${({ $width }) => $width ? `${$width}px` : '100%' };
  ${({$inline = false}) => $inline ? 'display: flex;' : null }

  display: ${({$inline}) => $inline ? 'relative' : 'block' };

  & + & {
    margin-top: 28px;
  }

  label {
    display: block;
    display: block;
    margin-top: 4px;
    margin-bottom: 5px;
    margin-right: 4px;
  }

  label > span.required {
    padding-left: 5px;
    font-size: 60%;
    color: ${({$error, theme}) => $error ? theme.palette.danger.main : theme.palette.danger.light};
  }

  & > input, select, input:focus {
    ${({$error, theme}) => $error ? `border-color: ${theme.palette.danger.main}` : ''};
  }
`

export const FormControl = styled.input`
  display: block;
  background: white;
  width: ${({ $width }) => $width};
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
    border: 1px solid ${({ theme }) => theme.palette.primary.tint};
    ${({theme}) => theme.shadow}
  }

  & + & {
    margin-top: 16px;
  }
`

styled(FormControl).attrs({ as: 'textarea' })`
  width: 89%;
  resize: ${({ $resize = 'both' }) => $resize};
`

export const FormText = styled(FormControl)`
  width: auto;
`

export const FormImage = styled(FormControl)`
  width: auto;
`

export const FormSelect = styled.select`
  display: block;
`

export const FormOption = styled.option`
`

export const FormLabel = styled(Label)`
  ${cssNoSelect}
`

export const FormHint = styled(Muted)`
  margin-bottom: 8px;
  display: block;
  ${cssNoSelect}
`

export const FormError = styled(TextDanger)`
  display: block;
  margin-top: 4px;
  ${cssNoSelect}
`
