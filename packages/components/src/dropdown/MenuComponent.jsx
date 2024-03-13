// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { flip } from '@floating-ui/react'
import { offset } from '@floating-ui/react'
import { useMergeRefs } from '@floating-ui/react'
import { autoUpdate } from '@floating-ui/react'
import { FloatingPortal } from '@floating-ui/react'
import { FloatingNode } from '@floating-ui/react'
import { useFloating } from '@floating-ui/react'
import { useInteractions } from '@floating-ui/react'
import { FloatingFocusManager } from '@floating-ui/react'
import { useFloatingNodeId } from '@floating-ui/react'
import { useClick } from '@floating-ui/react'
import { useDismiss } from '@floating-ui/react'
import { useListNavigation } from '@floating-ui/react'
import { useFloatingTree } from '@floating-ui/react'
import { isFunction } from 'lodash-es'
import styled from 'styled-components'
import { BlankLink } from '../misc/index.mjs'
import { Separator } from './Separator.jsx'
import MenuIcon from './more-horizontal.svg'

export const MenuComponent = React.forwardRef(({
  children,
  render,
  placement = 'bottom-start',
  offset: offsetProp = {
    mainAxis: 0,
    crossAxis: 0
  },
  dismiss = {
    outsidePress: true,
    outsidePressEvent: 'pointerdown',
    referencePress: false,
    referencePressEvent: 'pointerdown'
  },
  testid = 'menu',
  element,
  ...props
}, ref) => {

  const [open, setOpen] = React.useState(false)

  const [activeIndex, setActiveIndex] = React.useState()

  const listItemsRef = React.useRef([])

  const tree = useFloatingTree()

  const nodeId = useFloatingNodeId()

  const { x, y, refs, strategy, context } = useFloating({
    placement,
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
    nodeId,
    middleware: [
      flip(),
      offset(offsetProp)
    ]
  })

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [
      useDismiss(context, {
        outsidePress: dismiss.outsidePress,
        outsidePressEvent: dismiss.outsidePressEvent,
        referencePress: dismiss.referencePress,
        referencePressEvent: dismiss.referencePressEvent
      }),
      useClick(context),
      useListNavigation(context, {
        listRef: listItemsRef,
        activeIndex,
        onNavigate: setActiveIndex,
        loop: true
      })
    ]
  )

  const mergedReferenceRefs = useMergeRefs([ref, refs.setReference])

  const rootProps = React.useMemo(() => ({
    ...getReferenceProps({
      ...props,
      ref: mergedReferenceRefs,
      className: `root-menu ${open ? 'open' : ''}`
    })
  }), [mergedReferenceRefs])

  const finalRootEl = React.useMemo(() => {
    if (isFunction(render)) {
      return render(rootProps)
    } else {
      return (<BlankLink data-testid={testid} {...rootProps}>{ element ?? <StyledMenuIcon /> }</BlankLink>)
    }
  }, [rootProps, testid])

  React.useEffect(() => {
    function handleTreeClick() {
      setOpen(false)
    }

    tree?.events.on('click', handleTreeClick)

    return () => {
      tree?.events.off('click', handleTreeClick)
    }
  }, [tree, nodeId])

  return (

    <FloatingNode id={nodeId}>
      {finalRootEl}
      <FloatingPortal>
        {
          open && (
            <FloatingFocusManager
              context={context}
              modal={true}>
              <StyledMenuContainer
                data-testid={`${testid}-container`}
                {...getFloatingProps({
                  className: 'menu',
                  ref: refs.setFloating, //refs.floating,
                  style: {
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0
                  }
                })}>
                {
                  React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                      if (child.type === Separator) {
                        return React.cloneElement(child)
                      } else {
                        return React.cloneElement(child,
                          getItemProps({
                            role: 'menuitem',
                            className: 'menu-item',
                            ref: (node) => listItemsRef.current.push(node),
                            onClick(event) {
                              child.props.onClick?.(event)
                              tree?.events.emit('click')
                            }
                          }))
                      }
                    }
                  })
                }
              </StyledMenuContainer>
            </FloatingFocusManager>
          )
        }
      </FloatingPortal>
    </FloatingNode>
  )
})

MenuComponent.displayName = 'MenuComponent'

const StyledMenuContainer = styled.div`
    background: white;
    padding: 4px;
    border-radius: 6px;
    outline: 0;
    z-index: 1100;
    ${({ theme }) => theme.shadow}
`

const StyledMenuIcon = styled(MenuIcon)`
  stroke: ${({theme: { palette: { primary } }}) => primary.main};
`
