// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { BlankLink } from './misc/index.mjs'
import { Muted } from './misc/index.mjs'
import { H } from './layout/index.mjs'

/**
 * A component that displays information about a paginated result and
 * offers users the ability to navigate throughout the resulted data.
 */
export function Paginator({
  testId = 'paginator',
  page = 0,
  totalPages = 0,
  totalItems = 0,
  always = false,
  onRetrieveRequest
}) {

  const onPreviousClicked = React.useCallback(() => {
    onRetrieveRequest?.(page - 1)
  }, [page])

  const onNextClicked = React.useCallback(() => {
    onRetrieveRequest?.(page + 1)
  }, [page])

  const showPrevious = React.useMemo(() => {
    return page <= 1
  }, [page])

  const showNext = React.useMemo(() => {
    return page >= totalPages
  }, [page, totalPages])

  const showNextPrevious = React.useMemo(() => {
    if(always) return true

    return (totalPages > 1)
  }, [totalPages, always])

  return (
    <Root data-testid={testId} >
      <H>
        <H.Item>
          {
            showNextPrevious && (
              <StyledActions data-testid={`${testId}-actions`}>
                <BlankLink data-testid="previous-page" onClick={onPreviousClicked} disabled={showPrevious}>previous</BlankLink>
                <PageIndictor title={`Showing page ${page} out of ${totalPages} total pages`}>&nbsp;{page}/{totalPages}&nbsp;</PageIndictor>
                <BlankLink data-testid="next-page" onClick={onNextClicked} disabled={showNext}>next</BlankLink>
              </StyledActions>
            )
          }
        </H.Item>
        <H.Item>
          <Muted>Items found: { totalItems }</Muted>
        </H.Item>
      </H>
    </Root>
  )
}

const Root = styled.div`
  background-color: ${({theme: { components: { paginator } }}) => paginator.backgroundColor};
  margin: ${({theme: { components: { paginator } }}) => paginator.margin};
  padding: ${({theme: { components: { paginator } }}) => paginator.padding};
`

const StyledActions = styled.div`
`

const PageIndictor = styled(Muted)`
  cursor: default;
  font-size: 80%;
`
