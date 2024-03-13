// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { isFunction } from 'lodash-es'

export class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      hasError: false
    }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    if(isFunction(this.props.onCatch)) {
      this.props.onCatch(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Root data-testid={this.props.testId ? this.props.testId : 'error-boundary'}>
          <WarnSvg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </WarnSvg>
          <WarnText>{this.props.message ? this.props.message : 'Something went wrong'}</WarnText>
        </Root>
      )
    }

    return this.props.children
  }
}

const Root = styled.div`
  position: relative;
  color: ${({ theme }) => theme.palette?.text.main}
`

const WarnSvg = styled.svg`
  display: block;
  width: 25px;
  height: 25px;

  & > path {
    fill: ${({ theme }) => theme.palette?.text.main};
    transform-origin: 25px 25px;
  }
`

const WarnText = styled.span`
  color: ${({ theme }) => theme.palette?.text.main};
  position: absolute;
  left: 39px;
  top: 4px;
`
