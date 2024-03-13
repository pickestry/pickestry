// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled, { css } from 'styled-components'
import { isFunction } from 'lodash-es'
import { pointer } from './core/index.mjs'

export function Alert({
  message,
  type = 'info',
  confirmClose = () => true,
  onClose,
  testId = 'alert'
}) {

  const withClose = React.useMemo(() => isFunction(onClose), [])

  const onCloseInner = React.useCallback((e) => {
    e.preventDefault()
    if (confirmClose && confirmClose()) {
      withClose && !!onClose && onClose()
    }
  }, [withClose])

  return (
    <Root data-testid={testId} type={type}>{message} {withClose && <CloseIcon data-testid="alert-close" onClick={onCloseInner}>x</CloseIcon>}</Root>
  )
}

const CloseIcon = styled.div`
  float: right;
  ${pointer}
`

const Root = styled.div`
    ${(({ type = 'info', theme: { palette } }) => {
      const color = palette[type].main
      const bgColor = palette[type].lighter
      const borderColor = palette[type].light
      return css`
              color: ${color};
              background-color: ${bgColor};
              border-color: ${borderColor};
            `
    })}
    border-radius: 4px;
    border-width: 1px;
    padding: 8px;
`
