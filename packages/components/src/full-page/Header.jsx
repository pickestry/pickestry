// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import React from 'react'
import { useMemo } from 'react'
import styled from 'styled-components'
import { isFunction } from 'lodash-es'
import { isNotBlank } from '@pickestry/utils'
import { H } from '../layout/index.mjs'

export function Header({
      title,
      onClose,
      children
    }) {

    const maybeTitleEl = useMemo(() => {
      return isNotBlank(title) && <Title>{title}</Title>
    }, [title])

    const maybeOnCloseEl = useMemo(() => {
      return isFunction(onClose) ? <Close onClick={() => onClose()}>Close</Close> : undefined
    }, [onClose])

  return (
    <Root data-qa="full-page-header">
      <Wrapper>
        <H>
          <H.Item>{ maybeTitleEl }</H.Item>
          <Middle>{ children }</Middle>
          <H.Item>{ maybeOnCloseEl }</H.Item>
        </H>
      </Wrapper>
    </Root>
  )
}

const Wrapper = styled.div`
  position: relative;
`

const Middle = styled.div`
  flex-grow: 2;
  margin: 0 auto;
  max-width: 700px;
`

const Close = styled.a`
  display: block;
  position: absolute;
  right: 10px;
  top: 20px;
`

const Root = styled.div`
  border-bottom: 1px solid #ececec;
  position: fixed;
  left: 0;
  right: 0;
  background: white;
  z-index: 100;
  height: 50px;
`

const Title = styled.h1`
  font-size: 21px;
  font-weight: 600;
  margin-left: 8px;
`
